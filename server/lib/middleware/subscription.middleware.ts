import { Request, Response, NextFunction } from 'express';
import { subscriptionService } from '../services/subscription.service.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware to check if user has an active subscription
 */
export const requireActiveSubscription = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: {
          type: 'AUTHENTICATION_ERROR',
          message: 'Authentication required',
          code: 'AUTH_REQUIRED',
        },
      });
      return;
    }

    const subscription = await subscriptionService.getUserSubscription(req.user.id);

    if (!subscription) {
      res.status(403).json({
        error: {
          type: 'SUBSCRIPTION_ERROR',
          message: 'Active subscription required',
          code: 'SUBSCRIPTION_REQUIRED',
        },
      });
      return;
    }

    // Check if subscription is in a valid state
    const validStatuses = ['ACTIVE', 'TRIALING'];
    if (!validStatuses.includes(subscription.status)) {
      res.status(403).json({
        error: {
          type: 'SUBSCRIPTION_ERROR',
          message: 'Subscription is not active',
          code: 'SUBSCRIPTION_INACTIVE',
          details: { status: subscription.status },
        },
      });
      return;
    }

    // Add subscription info to request for downstream use
    (req as any).subscription = subscription;
    next();
  } catch (error) {
    console.error('Subscription middleware error:', error);
    res.status(500).json({
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to verify subscription',
        code: 'SUBSCRIPTION_CHECK_FAILED',
      },
    });
  }
};

/**
 * Middleware to check usage limits for specific actions
 */
export const checkUsageLimit = (action: 'ai_request' | 'deployment' | 'security_scan') => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            type: 'AUTHENTICATION_ERROR',
            message: 'Authentication required',
            code: 'AUTH_REQUIRED',
          },
        });
        return;
      }

      const canPerform = await subscriptionService.canPerformAction(req.user.id, action);

      if (!canPerform) {
        // Get current usage and limits for detailed error
        const limits = await subscriptionService.getSubscriptionLimits(req.user.id);
        const period = new Date().toISOString().slice(0, 7);
        
        const usage = await prisma.usageMetrics.findUnique({
          where: {
            userId_period: {
              userId: req.user.id,
              period,
            },
          },
        });

        const actionLimitMap = {
          ai_request: { 
            current: usage?.aiRequestsCount || 0, 
            limit: limits?.aiRequestsPerMonth || 0,
            name: 'AI requests'
          },
          deployment: { 
            current: usage?.deploymentCount || 0, 
            limit: limits?.deploymentsPerMonth || 0,
            name: 'deployments'
          },
          security_scan: { 
            current: usage?.securityScansCount || 0, 
            limit: limits?.securityScansPerMonth || 0,
            name: 'security scans'
          },
        };

        const actionInfo = actionLimitMap[action];

        res.status(429).json({
          error: {
            type: 'RATE_LIMIT_ERROR',
            message: `Monthly ${actionInfo.name} limit exceeded`,
            code: 'USAGE_LIMIT_EXCEEDED',
            details: {
              action,
              current: actionInfo.current,
              limit: actionInfo.limit,
              period,
            },
          },
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Usage limit middleware error:', error);
      res.status(500).json({
        error: {
          type: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to check usage limits',
          code: 'USAGE_CHECK_FAILED',
        },
      });
    }
  };
};

/**
 * Middleware to require specific subscription plan or higher
 */
export const requirePlan = (requiredPlanName: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            type: 'AUTHENTICATION_ERROR',
            message: 'Authentication required',
            code: 'AUTH_REQUIRED',
          },
        });
        return;
      }

      const subscription = await subscriptionService.getUserSubscription(req.user.id);

      if (!subscription) {
        res.status(403).json({
          error: {
            type: 'SUBSCRIPTION_ERROR',
            message: `${requiredPlanName} plan or higher required`,
            code: 'PLAN_UPGRADE_REQUIRED',
            details: { requiredPlan: requiredPlanName },
          },
        });
        return;
      }

      // Define plan hierarchy (you can adjust this based on your plans)
      const planHierarchy = ['Free', 'Starter', 'Professional', 'Enterprise'];
      const userPlanIndex = planHierarchy.indexOf(subscription.plan.name);
      const requiredPlanIndex = planHierarchy.indexOf(requiredPlanName);

      if (userPlanIndex < requiredPlanIndex) {
        res.status(403).json({
          error: {
            type: 'SUBSCRIPTION_ERROR',
            message: `${requiredPlanName} plan or higher required`,
            code: 'PLAN_UPGRADE_REQUIRED',
            details: {
              currentPlan: subscription.plan.name,
              requiredPlan: requiredPlanName,
            },
          },
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Plan requirement middleware error:', error);
      res.status(500).json({
        error: {
          type: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to verify plan requirements',
          code: 'PLAN_CHECK_FAILED',
        },
      });
    }
  };
};

/**
 * Middleware to track usage after successful action
 */
export const trackUsage = (action: 'ai_request' | 'deployment' | 'security_scan') => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    // Store original send function
    const originalSend = res.send;

    // Override send to track usage on successful responses
    res.send = function(body: any) {
      // Only track usage for successful responses (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        // Track usage asynchronously to not block response
        trackUsageAsync(req.user.id, action).catch(error => {
          console.error('Failed to track usage:', error);
        });
      }

      // Call original send
      return originalSend.call(this, body);
    };

    next();
  };
};

/**
 * Async function to track usage
 */
async function trackUsageAsync(userId: string, action: 'ai_request' | 'deployment' | 'security_scan'): Promise<void> {
  const period = new Date().toISOString().slice(0, 7); // YYYY-MM format

  const updateData: any = {};
  switch (action) {
    case 'ai_request':
      updateData.aiRequestsCount = { increment: 1 };
      break;
    case 'deployment':
      updateData.deploymentCount = { increment: 1 };
      break;
    case 'security_scan':
      updateData.securityScansCount = { increment: 1 };
      break;
  }

  await prisma.usageMetrics.upsert({
    where: {
      userId_period: {
        userId,
        period,
      },
    },
    update: updateData,
    create: {
      userId,
      period,
      ...updateData,
    },
  });
}