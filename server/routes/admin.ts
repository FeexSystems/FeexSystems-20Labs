import express from 'express';
import { z } from 'zod';
import { authMiddleware } from '../lib/middleware/auth.middleware';
import { rateLimitMiddleware } from '../lib/middleware/rate-limit.middleware';
import { PrismaClient } from '@prisma/client';
import { createActivityLog } from '../lib/services/activity-log.service';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication to all admin routes
router.use(authMiddleware);

// Admin role validation middleware
const adminMiddleware = async (req: any, res: any, next: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });

    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Apply admin middleware to all routes
router.use(adminMiddleware);

/**
 * GET /api/admin/metrics
 * Get system health and performance metrics
 */
router.get('/metrics', async (req, res) => {
  try {
    // Get system statistics
    const [
      totalUsers,
      totalTeams,
      totalSubscriptions,
      totalAIRequests,
      totalDeployments,
      totalSecurityScans,
      activeSubscriptions,
      recentActivity
    ] = await Promise.all([
      prisma.user.count(),
      prisma.team.count(),
      prisma.subscription.count(),
      prisma.aIRequest.count(),
      prisma.deployment.count(),
      prisma.securityScan.count(),
      prisma.subscription.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.activityLog.findMany({
        take: 20,
        orderBy: { timestamp: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })
    ]);

    // Calculate system health metrics
    const systemHealth = {
      database: 'healthy', // You can add actual health checks here
      redis: 'healthy',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };

    // Get subscription analytics
    const subscriptionAnalytics = await prisma.subscription.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Get usage metrics for the current period
    const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const currentUsage = await prisma.usageMetrics.findMany({
      where: {
        period: currentPeriod
      }
    });

    const totalUsage = currentUsage.reduce((acc, usage) => ({
      aiRequests: acc.aiRequests + usage.aiRequestsCount,
      deployments: acc.deployments + usage.deploymentCount,
      securityScans: acc.securityScans + usage.securityScansCount,
      storage: acc.storage + Number(usage.storageUsed),
      bandwidth: acc.bandwidth + Number(usage.bandwidthUsed)
    }), {
      aiRequests: 0,
      deployments: 0,
      securityScans: 0,
      storage: 0,
      bandwidth: 0
    });

    res.json({
      success: true,
      data: {
        systemHealth,
        statistics: {
          totalUsers,
          totalTeams,
          totalSubscriptions,
          totalAIRequests,
          totalDeployments,
          totalSecurityScans,
          activeSubscriptions
        },
        subscriptionAnalytics,
        currentPeriodUsage: totalUsage,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch admin metrics'
    });
  }
});

/**
 * GET /api/admin/users
 * Get user analytics and statistics
 */
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    if (role) where.role = role;
    if (status === 'active') where.emailVerified = true;
    if (status === 'inactive') where.emailVerified = false;

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          lastLoginAt: true,
          profileImageUrl: true,
          _count: {
            select: {
              aiRequests: true,
              subscriptions: true,
              repositories: true,
              securityScans: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum
      }),
      prisma.user.count({ where })
    ]);

    // Get user role distribution
    const roleDistribution = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });

    // Get user registration trends (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const registrationTrends = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: {
        createdAt: true
      },
      where: {
        createdAt: {
          gte: twelveMonthsAgo
        }
      }
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalUsers,
          pages: Math.ceil(totalUsers / limitNum)
        },
        analytics: {
          roleDistribution,
          registrationTrends
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user analytics'
    });
  }
});

/**
 * GET /api/admin/subscriptions
 * Get subscription and revenue analytics
 */
router.get('/subscriptions', async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Get subscription statistics
    const subscriptionStats = await prisma.subscription.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Get plan distribution
    const planDistribution = await prisma.subscription.groupBy({
      by: ['planId'],
      _count: {
        planId: true
      },
      include: {
        plan: {
          select: {
            name: true,
            price: true,
            currency: true
          }
        }
      }
    });

    // Calculate revenue metrics
    const activeSubscriptions = await prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      include: {
        plan: {
          select: {
            price: true,
            currency: true,
            interval: true
          }
        }
      }
    });

    const monthlyRevenue = activeSubscriptions.reduce((total, sub) => {
      if (sub.plan.interval === 'month') {
        return total + sub.plan.price;
      } else if (sub.plan.interval === 'year') {
        return total + Math.round(sub.plan.price / 12);
      }
      return total;
    }, 0);

    const yearlyRevenue = activeSubscriptions.reduce((total, sub) => {
      if (sub.plan.interval === 'year') {
        return total + sub.plan.price;
      } else if (sub.plan.interval === 'month') {
        return total + (sub.plan.price * 12);
      }
      return total;
    }, 0);

    // Get subscription trends
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const subscriptionTrends = await prisma.subscription.groupBy({
      by: ['createdAt'],
      _count: {
        createdAt: true
      },
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      }
    });

    res.json({
      success: true,
      data: {
        subscriptionStats,
        planDistribution,
        revenue: {
          monthlyRevenue,
          yearlyRevenue,
          currency: 'USD'
        },
        subscriptionTrends
      }
    });
  } catch (error) {
    console.error('Error fetching subscription analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription analytics'
    });
  }
});

/**
 * GET /api/admin/usage
 * Get system usage analytics
 */
router.get('/usage', async (req, res) => {
  try {
    const { period = 'current' } = req.query;

    let targetPeriod = new Date().toISOString().slice(0, 7); // Current month
    if (period === 'last') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      targetPeriod = lastMonth.toISOString().slice(0, 7);
    }

    // Get usage metrics for the target period
    const usageMetrics = await prisma.usageMetrics.findMany({
      where: {
        period: targetPeriod
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Calculate total usage
    const totalUsage = usageMetrics.reduce((acc, usage) => ({
      aiRequests: acc.aiRequests + usage.aiRequestsCount,
      deployments: acc.deployments + usage.deploymentCount,
      securityScans: acc.securityScans + usage.securityScansCount,
      storage: acc.storage + Number(usage.storageUsed),
      bandwidth: acc.bandwidth + Number(usage.bandwidthUsed)
    }), {
      aiRequests: 0,
      deployments: 0,
      securityScans: 0,
      storage: 0,
      bandwidth: 0
    });

    // Get top users by usage
    const topUsersByAI = usageMetrics
      .sort((a, b) => b.aiRequestsCount - a.aiRequestsCount)
      .slice(0, 10);

    const topUsersByDeployments = usageMetrics
      .sort((a, b) => b.deploymentCount - a.deploymentCount)
      .slice(0, 10);

    const topUsersBySecurityScans = usageMetrics
      .sort((a, b) => b.securityScansCount - a.securityScansCount)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        period: targetPeriod,
        totalUsage,
        topUsers: {
          aiRequests: topUsersByAI,
          deployments: topUsersByDeployments,
          securityScans: topUsersBySecurityScans
        },
        usageMetrics
      }
    });
  } catch (error) {
    console.error('Error fetching usage analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch usage analytics'
    });
  }
});

/**
 * GET /api/admin/security
 * Get security scanning analytics
 */
router.get('/security', async (req, res) => {
  try {
    // Get security scan statistics
    const scanStats = await prisma.securityScan.groupBy({
      by: ['status', 'scanType'],
      _count: {
        status: true
      }
    });

    // Get vulnerability statistics
    const vulnerabilityStats = await prisma.securityScan.groupBy({
      by: ['scanType'],
      _count: {
        scanType: true
      }
    });

    // Get recent security scans
    const recentScans = await prisma.securityScan.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Get scan success rate
    const totalScans = await prisma.securityScan.count();
    const successfulScans = await prisma.securityScan.count({
      where: { status: 'COMPLETED' }
    });

    const successRate = totalScans > 0 ? (successfulScans / totalScans) * 100 : 0;

    res.json({
      success: true,
      data: {
        scanStats,
        vulnerabilityStats,
        recentScans,
        successRate: Math.round(successRate * 100) / 100
      }
    });
  } catch (error) {
    console.error('Error fetching security analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch security analytics'
    });
  }
});

/**
 * POST /api/admin/users/:id/role
 * Update user role
 */
router.post('/users/:id/role',
  rateLimitMiddleware({ windowMs: 60 * 1000, max: 10 }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Validate role
      if (!['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role. Must be one of: USER, ADMIN, SUPER_ADMIN'
        });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Update user role
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true
        }
      });

      // Log activity
      await createActivityLog({
        userId: req.user!.id,
        action: 'UPDATE_ROLE',
        resource: 'USER',
        resourceId: id,
        metadata: { 
          previousRole: user.role,
          newRole: role,
          targetUserEmail: user.email
        }
      });

      res.json({
        success: true,
        data: updatedUser,
        message: 'User role updated successfully'
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user role'
      });
    }
  }
);

/**
 * GET /api/admin/system/health
 * Get detailed system health information
 */
router.get('/system/health', async (req, res) => {
  try {
    // Database health check
    const dbHealth = await prisma.$queryRaw`SELECT 1 as health_check`;
    
    // Redis health check (you'll need to implement this)
    const redisHealth = 'healthy'; // Placeholder
    
    // System resources
    const systemResources = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    };

    // Check critical services
    const serviceHealth = {
      database: dbHealth ? 'healthy' : 'unhealthy',
      redis: redisHealth,
      api: 'healthy'
    };

    const overallHealth = Object.values(serviceHealth).every(status => status === 'healthy') 
      ? 'healthy' 
      : 'degraded';

    res.json({
      success: true,
      data: {
        status: overallHealth,
        timestamp: new Date().toISOString(),
        services: serviceHealth,
        system: systemResources
      }
    });
  } catch (error) {
    console.error('Error checking system health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check system health'
    });
  }
});

export default router; 