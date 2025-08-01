import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { subscriptionService } from '../lib/services/subscription.service.js';
import { stripeService } from '../lib/services/stripe.service.js';
import { webhookService } from '../lib/services/webhook.service.js';
import { authMiddleware } from '../lib/middleware/auth.middleware.js';
import { requireActiveSubscription } from '../lib/middleware/subscription.middleware.js';

const prisma = new PrismaClient();

const router = express.Router();

// Validation schemas
const createSubscriptionSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  paymentMethodId: z.string().optional(),
  trialPeriodDays: z.number().min(0).max(365).optional(),
});

const updateSubscriptionSchema = z.object({
  planId: z.string().optional(),
  cancelAtPeriodEnd: z.boolean().optional(),
});

/**
 * GET /api/subscriptions/plans
 * Get all available subscription plans
 */
router.get('/plans', async (req, res) => {
  try {
    const plans = await subscriptionService.getPlans();
    
    res.json({
      success: true,
      data: { plans },
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch subscription plans',
        code: 'PLANS_FETCH_FAILED',
      },
    });
  }
});

/**
 * GET /api/subscriptions/current
 * Get current user's subscription
 */
router.get('/current', authMiddleware, async (req, res) => {
  try {
    const subscription = await subscriptionService.getUserSubscription(req.user!.id);
    
    res.json({
      success: true,
      data: { subscription },
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch subscription',
        code: 'SUBSCRIPTION_FETCH_FAILED',
      },
    });
  }
});

/**
 * POST /api/subscriptions/create
 * Create a new subscription
 */
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const validatedData = createSubscriptionSchema.parse(req.body);
    
    const result = await subscriptionService.createSubscription({
      userId: req.user!.id,
      ...validatedData,
    });
    
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          code: 'VALIDATION_FAILED',
          details: error.errors,
        },
      });
      return;
    }
    
    if (error instanceof Error) {
      if (error.message.includes('already has an active subscription')) {
        res.status(409).json({
          error: {
            type: 'SUBSCRIPTION_ERROR',
            message: error.message,
            code: 'SUBSCRIPTION_EXISTS',
          },
        });
        return;
      }
      
      if (error.message.includes('not found')) {
        res.status(404).json({
          error: {
            type: 'SUBSCRIPTION_ERROR',
            message: error.message,
            code: 'RESOURCE_NOT_FOUND',
          },
        });
        return;
      }
    }
    
    res.status(500).json({
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create subscription',
        code: 'SUBSCRIPTION_CREATE_FAILED',
      },
    });
  }
});

/**
 * PUT /api/subscriptions/:id
 * Update an existing subscription
 */
router.put('/:id', authMiddleware, requireActiveSubscription, async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const validatedData = updateSubscriptionSchema.parse(req.body);
    
    // Verify user owns this subscription
    const currentSubscription = await subscriptionService.getUserSubscription(req.user!.id);
    if (!currentSubscription || currentSubscription.id !== subscriptionId) {
      res.status(403).json({
        error: {
          type: 'AUTHORIZATION_ERROR',
          message: 'Not authorized to modify this subscription',
          code: 'SUBSCRIPTION_ACCESS_DENIED',
        },
      });
      return;
    }
    
    const updatedSubscription = await subscriptionService.updateSubscription({
      subscriptionId,
      ...validatedData,
    });
    
    res.json({
      success: true,
      data: { subscription: updatedSubscription },
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          code: 'VALIDATION_FAILED',
          details: error.errors,
        },
      });
      return;
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({
        error: {
          type: 'SUBSCRIPTION_ERROR',
          message: error.message,
          code: 'SUBSCRIPTION_NOT_FOUND',
        },
      });
      return;
    }
    
    res.status(500).json({
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update subscription',
        code: 'SUBSCRIPTION_UPDATE_FAILED',
      },
    });
  }
});

/**
 * DELETE /api/subscriptions/:id
 * Cancel a subscription
 */
router.delete('/:id', authMiddleware, requireActiveSubscription, async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const immediate = req.query.immediate === 'true';
    
    // Verify user owns this subscription
    const currentSubscription = await subscriptionService.getUserSubscription(req.user!.id);
    if (!currentSubscription || currentSubscription.id !== subscriptionId) {
      res.status(403).json({
        error: {
          type: 'AUTHORIZATION_ERROR',
          message: 'Not authorized to cancel this subscription',
          code: 'SUBSCRIPTION_ACCESS_DENIED',
        },
      });
      return;
    }
    
    const canceledSubscription = await subscriptionService.cancelSubscription(
      subscriptionId,
      immediate
    );
    
    res.json({
      success: true,
      data: { subscription: canceledSubscription },
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({
        error: {
          type: 'SUBSCRIPTION_ERROR',
          message: error.message,
          code: 'SUBSCRIPTION_NOT_FOUND',
        },
      });
      return;
    }
    
    res.status(500).json({
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to cancel subscription',
        code: 'SUBSCRIPTION_CANCEL_FAILED',
      },
    });
  }
});

/**
 * GET /api/subscriptions/usage
 * Get current usage and limits
 */
router.get('/usage', authMiddleware, async (req, res) => {
  try {
    const limits = await subscriptionService.getSubscriptionLimits(req.user!.id);
    
    // Get current period usage
    const period = new Date().toISOString().slice(0, 7);
    const usage = await prisma.usageMetrics.findUnique({
      where: {
        userId_period: {
          userId: req.user!.id,
          period,
        },
      },
    });
    
    res.json({
      success: true,
      data: {
        limits,
        usage: usage || {
          aiRequestsCount: 0,
          deploymentCount: 0,
          securityScansCount: 0,
          storageUsed: 0,
          bandwidthUsed: 0,
        },
        period,
      },
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(500).json({
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch usage information',
        code: 'USAGE_FETCH_FAILED',
      },
    });
  }
});

/**
 * POST /api/subscriptions/billing-portal
 * Create Stripe billing portal session
 */
router.post('/billing-portal', authMiddleware, requireActiveSubscription, async (req, res) => {
  try {
    const subscription = await subscriptionService.getUserSubscription(req.user!.id);
    
    if (!subscription?.stripeCustomerId) {
      res.status(400).json({
        error: {
          type: 'SUBSCRIPTION_ERROR',
          message: 'No billing information found',
          code: 'NO_BILLING_INFO',
        },
      });
      return;
    }
    
    const returnUrl = req.body.returnUrl || `${process.env.FRONTEND_URL}/dashboard/billing`;
    
    const session = await stripeService.createBillingPortalSession(
      subscription.stripeCustomerId,
      returnUrl
    );
    
    res.json({
      success: true,
      data: { url: session.url },
    });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    res.status(500).json({
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create billing portal session',
        code: 'BILLING_PORTAL_FAILED',
      },
    });
  }
});

/**
 * POST /api/subscriptions/webhook
 * Handle Stripe webhooks
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!signature) {
      res.status(400).json({
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Missing Stripe signature',
          code: 'MISSING_SIGNATURE',
        },
      });
      return;
    }
    
    await webhookService.processStripeWebhook(req.body, signature);
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      error: {
        type: 'WEBHOOK_ERROR',
        message: 'Webhook processing failed',
        code: 'WEBHOOK_FAILED',
      },
    });
  }
});

export default router;