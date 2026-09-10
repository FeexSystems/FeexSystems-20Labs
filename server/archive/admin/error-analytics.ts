import { Router } from 'express';
import { prisma } from '../lib/database';
import { adminMiddleware } from '../lib/middleware/admin.middleware';
import { validateQuery } from '../lib/middleware/auth.middleware';
import { z } from 'zod';
import { monitoringService } from '../lib/monitoring/monitoring.service';

const router = Router();

// Query schema for error analytics
const errorAnalyticsSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  type: z.string().optional(),
});

/**
 * GET /api/admin/analytics/errors
 * Get error analytics data
 */
router.get(
  '/analytics/errors',
  adminMiddleware,
  validateQuery(errorAnalyticsSchema),
  async (req, res) => {
    try {
      const { startDate, endDate, type } = req.query as z.infer<typeof errorAnalyticsSchema>;
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Create monitoring span
      await monitoringService.createSpan('get_error_analytics', async () => {
        // Get total errors
        const totalErrors = await prisma.errorLog.count({
          where: {
            timestamp: {
              gte: start,
              lte: end
            },
            ...(type && type !== 'all' ? { type } : {})
          }
        });

        // Get errors by type
        const errorsByType = await prisma.errorLog.groupBy({
          by: ['type'],
          _count: true,
          where: {
            timestamp: {
              gte: start,
              lte: end
            }
          }
        });

        // Get errors by endpoint
        const errorsByEndpoint = await prisma.errorLog.groupBy({
          by: ['endpoint'],
          _count: true,
          where: {
            timestamp: {
              gte: start,
              lte: end
            },
            ...(type && type !== 'all' ? { type } : {})
          },
          orderBy: {
            _count: {
              endpoint: 'desc'
            }
          },
          take: 10
        });

        // Get error timeline
        const errorTimeline = await prisma.errorLog.groupBy({
          by: ['timestamp'],
          _count: true,
          where: {
            timestamp: {
              gte: start,
              lte: end
            },
            ...(type && type !== 'all' ? { type } : {})
          },
          orderBy: {
            timestamp: 'asc'
          }
        });

        // Get recent errors
        const recentErrors = await prisma.errorLog.findMany({
          where: {
            timestamp: {
              gte: start,
              lte: end
            },
            ...(type && type !== 'all' ? { type } : {})
          },
          orderBy: {
            timestamp: 'desc'
          },
          take: 10,
          select: {
            id: true,
            type: true,
            message: true,
            timestamp: true,
            endpoint: true,
            userId: true
          }
        });

        res.json({
          totalErrors,
          errorsByType: errorsByType.map(({ type, _count }) => ({
            type,
            count: _count
          })),
          errorsByEndpoint: errorsByEndpoint.map(({ endpoint, _count }) => ({
            endpoint,
            count: _count
          })),
          errorTimeline: errorTimeline.map(({ timestamp, _count }) => ({
            timestamp: timestamp.toISOString(),
            count: _count
          })),
          recentErrors: recentErrors.map(error => ({
            ...error,
            timestamp: error.timestamp.toISOString()
          }))
        });
      });
    } catch (error) {
      monitoringService.trackError(error as Error, {
        endpoint: '/api/admin/analytics/errors',
        query: req.query
      });
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch error analytics'
      });
    }
  }
);
