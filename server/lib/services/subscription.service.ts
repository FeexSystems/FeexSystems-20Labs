import { PrismaClient, Subscription, Plan, SubscriptionStatus } from '@prisma/client';
import { stripeService } from './stripe.service.js';
import Stripe from 'stripe';

const prisma = new PrismaClient();

export interface CreateSubscriptionRequest {
  userId: string;
  planId: string;
  paymentMethodId?: string;
  trialPeriodDays?: number;
}

export interface UpdateSubscriptionRequest {
  subscriptionId: string;
  planId?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionWithPlan extends Subscription {
  plan: Plan;
}

export class SubscriptionService {
  /**
   * Get all available plans
   */
  async getPlans(): Promise<Plan[]> {
    return await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  /**
   * Get user's current subscription
   */
  async getUserSubscription(userId: string): Promise<SubscriptionWithPlan | null> {
    return await prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['ACTIVE', 'TRIALING', 'PAST_DUE'],
        },
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a new subscription
   */
  async createSubscription(request: CreateSubscriptionRequest): Promise<{
    subscription: SubscriptionWithPlan;
    clientSecret?: string;
  }> {
    // Get user and plan
    const user = await prisma.user.findUnique({
      where: { id: request.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const plan = await prisma.plan.findUnique({
      where: { id: request.planId },
    });

    if (!plan || !plan.isActive) {
      throw new Error('Plan not found or inactive');
    }

    // Check if user already has an active subscription
    const existingSubscription = await this.getUserSubscription(request.userId);
    if (existingSubscription) {
      throw new Error('User already has an active subscription');
    }

    // Create or get Stripe customer
    let stripeCustomerId: string | null = null;
    const existingCustomer = await prisma.subscription.findFirst({
      where: { userId: request.userId, stripeCustomerId: { not: null } },
      select: { stripeCustomerId: true },
    });

    if (existingCustomer?.stripeCustomerId) {
      stripeCustomerId = existingCustomer.stripeCustomerId;
    } else {
      const stripeCustomer = await stripeService.createCustomer(
        user.email,
        `${user.firstName} ${user.lastName}`,
        { userId: user.id }
      );
      stripeCustomerId = stripeCustomer?.id || null;
    }

    // Create Stripe subscription
    const stripeSubscription = await stripeService.createSubscription(
      stripeCustomerId || 'placeholder',
      plan.stripePriceId || 'placeholder',
      {
        trialPeriodDays: request.trialPeriodDays || plan.trialPeriodDays || undefined,
        metadata: {
          userId: user.id,
          planId: plan.id,
        },
      }
    );

    // Create subscription in database
    const subscriptionData: any = {
      userId: request.userId,
      planId: request.planId,
      status: stripeSubscription
        ? this.mapStripeStatusToDb(stripeSubscription.status)
        : 'ACTIVE',
      currentPeriodStart: stripeSubscription
        ? new Date(stripeSubscription.current_period_start * 1000)
        : new Date(),
      currentPeriodEnd: stripeSubscription
        ? new Date(stripeSubscription.current_period_end * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days
      stripeSubscriptionId: stripeSubscription?.id || null,
      stripeCustomerId,
    };

    if (stripeSubscription) {
      if (stripeSubscription.trial_start) {
        subscriptionData.trialStart = new Date(stripeSubscription.trial_start * 1000);
      }
      if (stripeSubscription.trial_end) {
        subscriptionData.trialEnd = new Date(stripeSubscription.trial_end * 1000);
      }
    }

    const subscription = await prisma.subscription.create({
      data: subscriptionData,
      include: { plan: true },
    });

    // Extract client secret if payment is required
    let clientSecret: string | undefined;
    if (stripeSubscription?.latest_invoice) {
      const invoice = stripeSubscription.latest_invoice as Stripe.Invoice;
      if (invoice.payment_intent) {
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
        clientSecret = paymentIntent.client_secret || undefined;
      }
    }

    return {
      subscription,
      clientSecret,
    };
  }

  /**
   * Update an existing subscription
   */
  async updateSubscription(request: UpdateSubscriptionRequest): Promise<SubscriptionWithPlan> {
    const subscription = await prisma.subscription.findUnique({
      where: { id: request.subscriptionId },
      include: { plan: true },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('Subscription not found');
    }

    const updates: any = {};

    if (request.planId && request.planId !== subscription.planId) {
      const newPlan = await prisma.plan.findUnique({
        where: { id: request.planId },
      });

      if (!newPlan || !newPlan.isActive) {
        throw new Error('New plan not found or inactive');
      }

      updates.priceId = newPlan.stripePriceId;
    }

    if (request.cancelAtPeriodEnd !== undefined) {
      updates.cancelAtPeriodEnd = request.cancelAtPeriodEnd;
    }

    // Update Stripe subscription
    const stripeSubscription = await stripeService.updateSubscription(
      subscription.stripeSubscriptionId,
      updates
    );

    // Update database
    const updatedSubscription = await prisma.subscription.update({
      where: { id: request.subscriptionId },
      data: {
        planId: request.planId || subscription.planId,
        status: stripeSubscription
          ? this.mapStripeStatusToDb(stripeSubscription.status)
          : subscription.status,
        currentPeriodStart: stripeSubscription
          ? new Date(stripeSubscription.current_period_start * 1000)
          : subscription.currentPeriodStart,
        currentPeriodEnd: stripeSubscription
          ? new Date(stripeSubscription.current_period_end * 1000)
          : subscription.currentPeriodEnd,
        cancelAtPeriodEnd: stripeSubscription
          ? stripeSubscription.cancel_at_period_end
          : updates.cancelAtPeriodEnd !== undefined ? updates.cancelAtPeriodEnd : subscription.cancelAtPeriodEnd,
        canceledAt: stripeSubscription?.canceled_at
          ? new Date(stripeSubscription.canceled_at * 1000)
          : subscription.canceledAt,
        endedAt: stripeSubscription?.ended_at
          ? new Date(stripeSubscription.ended_at * 1000)
          : subscription.endedAt,
      },
      include: { plan: true },
    });

    return updatedSubscription;
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string, immediate = false): Promise<SubscriptionWithPlan> {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { plan: true },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('Subscription not found');
    }

    let stripeSubscription: Stripe.Subscription | null = null;

    if (subscription.stripeSubscriptionId) {
      if (immediate) {
        // Cancel immediately
        stripeSubscription = await stripeService.cancelSubscription(
          subscription.stripeSubscriptionId
        );
      } else {
        // Cancel at period end
        stripeSubscription = await stripeService.updateSubscription(
          subscription.stripeSubscriptionId,
          { cancelAtPeriodEnd: true }
        );
      }
    }

    // Update database
    const updateData: any = {
      status: stripeSubscription
        ? this.mapStripeStatusToDb(stripeSubscription.status)
        : (immediate ? 'CANCELED' : subscription.status),
      cancelAtPeriodEnd: stripeSubscription
        ? stripeSubscription.cancel_at_period_end
        : !immediate,
    };

    if (stripeSubscription) {
      if (stripeSubscription.canceled_at) {
        updateData.canceledAt = new Date(stripeSubscription.canceled_at * 1000);
      }
      if (stripeSubscription.ended_at) {
        updateData.endedAt = new Date(stripeSubscription.ended_at * 1000);
      }
    } else if (immediate) {
      updateData.canceledAt = new Date();
      updateData.endedAt = new Date();
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: updateData,
      include: { plan: true },
    });

    return updatedSubscription;
  }

  /**
   * Get subscription usage limits
   */
  async getSubscriptionLimits(userId: string): Promise<Record<string, any> | null> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription) {
      // Return free tier limits
      return {
        aiRequestsPerMonth: 10,
        deploymentsPerMonth: 2,
        securityScansPerMonth: 1,
        storageGB: 1,
        teamMembers: 1,
      };
    }

    return subscription.plan.features as Record<string, any>;
  }

  /**
   * Check if user can perform an action based on subscription limits
   */
  async canPerformAction(
    userId: string,
    action: 'ai_request' | 'deployment' | 'security_scan',
    period = new Date().toISOString().slice(0, 7) // YYYY-MM format
  ): Promise<boolean> {
    const limits = await this.getSubscriptionLimits(userId);
    if (!limits) return false;

    const usage = await prisma.usageMetrics.findUnique({
      where: {
        userId_period: {
          userId,
          period,
        },
      },
    });

    const currentUsage = usage || {
      aiRequestsCount: 0,
      deploymentCount: 0,
      securityScansCount: 0,
    };

    switch (action) {
      case 'ai_request':
        return currentUsage.aiRequestsCount < (limits.aiRequestsPerMonth || 0);
      case 'deployment':
        return currentUsage.deploymentCount < (limits.deploymentsPerMonth || 0);
      case 'security_scan':
        return currentUsage.securityScansCount < (limits.securityScansPerMonth || 0);
      default:
        return false;
    }
  }

  /**
   * Map Stripe subscription status to database enum
   */
  private mapStripeStatusToDb(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
    switch (stripeStatus) {
      case 'active':
        return 'ACTIVE';
      case 'canceled':
        return 'CANCELED';
      case 'incomplete':
        return 'INCOMPLETE';
      case 'incomplete_expired':
        return 'INCOMPLETE_EXPIRED';
      case 'past_due':
        return 'PAST_DUE';
      case 'trialing':
        return 'TRIALING';
      case 'unpaid':
        return 'UNPAID';
      case 'paused':
        return 'PAUSED';
      default:
        return 'INCOMPLETE';
    }
  }
}

export const subscriptionService = new SubscriptionService();