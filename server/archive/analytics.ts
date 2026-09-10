// --- AI Feature Endpoints ---
router.post(
  '/summarize',
  authenticateUser,
  async (req, res) => {
    try {
      const content = z.string().min(10).parse(req.body.content);
      const summaryLength = req.body.summary_length || 'medium';
      const result = await aiService.submitRequest({
        userId: req.user.id,
        serviceId: 'text-summarization',
        input: { content },
        parameters: { summary_length: summaryLength },
      });
      if (!result.success) throw new Error(result.error);
      res.json({ requestId: result.requestId });
    } catch (error) {
      res.status(400).json({ error: 'Failed to summarize content' });
    }
  }
);

router.post(
  '/sentiment',
  authenticateUser,
  async (req, res) => {
    try {
      const content = z.string().min(5).parse(req.body.content);
      const result = await aiService.submitRequest({
        userId: req.user.id,
        serviceId: 'sentiment-analysis',
        input: { content },
      });
      if (!result.success) throw new Error(result.error);
      res.json({ requestId: result.requestId });
    } catch (error) {
      res.status(400).json({ error: 'Failed to analyze sentiment' });
    }
  }
);

router.post(
  '/smart-tags',
  authenticateUser,
  async (req, res) => {
    try {
      const content = z.string().min(5).parse(req.body.content);
      const maxTags = req.body.max_tags || 5;
      const result = await aiService.submitRequest({
        userId: req.user.id,
        serviceId: 'smart-tagging',
        input: { content },
        parameters: { max_tags: maxTags },
      });
      if (!result.success) throw new Error(result.error);
      res.json({ requestId: result.requestId });
    } catch (error) {
      res.status(400).json({ error: 'Failed to generate tags' });
    }
  }
);
import { Router } from 'express';
import { z } from 'zod';
import { AnalyticsService } from '../lib/services/analytics.service';
import { AIService } from '../lib/services/ai.service';
import { authenticateUser, requireRole } from '../middleware/auth';

const router = Router();
const analyticsService = new AnalyticsService();
const aiService = new AIService();

// Schema for analytics request
const AnalyticsQuerySchema = z.object({
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().optional().transform(str => str ? new Date(str) : new Date()),
});

// Schema for event tracking
const EventSchema = z.object({
  eventType: z.string(),
  eventData: z.record(z.any()),
});

/**
 * Get analytics metrics
 */
router.get(
  '/metrics',
  authenticateUser,
  requireRole(['ADMIN', 'ANALYST']),
  async (req, res) => {
    try {
      const { startDate, endDate } = AnalyticsQuerySchema.parse(req.query);
      const metrics = await analyticsService.getMetrics(startDate, endDate);
      res.json(metrics);
    } catch (error) {
      console.error('Failed to get metrics:', error);
      res.status(400).json({ error: 'Invalid request' });
    }
  }
);

/**
 * Track user event
 */
router.post(
  '/events',
  authenticateUser,
  async (req, res) => {
    try {
      const { eventType, eventData } = EventSchema.parse(req.body);
      await analyticsService.trackEvent({
        userId: req.user.id,
        eventType,
        eventData,
        timestamp: new Date(),
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('Failed to track event:', error);
      res.status(400).json({ error: 'Invalid event data' });
    }
  }
);

/**
 * Get user-specific analytics
 */
router.get(
  '/user/:userId',
  authenticateUser,
  async (req, res) => {
    try {
      // Check if user is requesting their own analytics or is an admin
      if (req.params.userId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const userAnalytics = await analyticsService.getUserAnalytics(req.params.userId);
      
      // If user has premium features, add AI-powered recommendations
      if (req.user.subscriptionTier === 'premium') {
        const recommendations = await aiService.generateRecommendations(req.params.userId);
        userAnalytics.aiRecommendations = recommendations;
      }

      res.json(userAnalytics);
    } catch (error) {
      console.error('Failed to get user analytics:', error);
      res.status(500).json({ error: 'Failed to get user analytics' });
    }
  }
);

/**
 * Generate AI insights
 */
router.post(
  '/insights',
  authenticateUser,
  requireRole(['PREMIUM']),
  async (req, res) => {
    try {
      const content = z.string().parse(req.body.content);
      const insights = await aiService.analyzeContent(content);
      res.json(insights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      res.status(400).json({ error: 'Failed to generate insights' });
    }
  }
);

export default router;
