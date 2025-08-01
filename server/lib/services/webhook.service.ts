import { PrismaClient } from '@prisma/client';
import { stripeService } from './stripe.service.js';
import Stripe from 'stripe';

const prisma = new PrismaClient();

export class WebhookService {
  /**
   * Process Stripe webhook event
   */
  async processStripeWebhook(payload: string | Buffer, signature: string): Promise<void> {
    try {
      const event = stripeService.constructWebhookEvent(payload, signature);

      // Check if we've already processed this event
      const existingEvent = await prisma.stripeWebhookEvent.findUnique({
        where: { stripeEventId: event.id },
      });

      if (existingEvent?.processed) {
        console.log(`Event ${event.id} already processed, skipping`);
        return;
      }

      // Store the event
      await prisma.stripeWebhookEvent.upsert({
        where: { stripeEventId: event.id },
        update: {
          eventType: event.type,
          data: event.data as any,
        },
        create: {
          stripeEventId: event.id,
          eventType: event.type,
          data: event.data as any,
        },
      });

      // Process the event based on type
      await this.handleStripeEvent(event);

      // Mark as processed
      await prisma.stripeWebhookEvent.update({
        where: { stripeEventId: event.id },
        data: {
          processed: true,
          processedAt: new Date(),
        },
      });

      console.log(`Successfully processed webhook event: ${event.type}`);
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  /**
   * Handle different types of Stripe events
   */
  private async handleStripeEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.trial_will_end':
        await this.handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  /**
   * Handle subscription created event
   */
  private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata?.userId;
    if (!userId) {
      console.error('No userId in subscription metadata');
      return;
    }

    // The subscription should already exist from our API call
    // This webhook mainly serves as confirmation
    await this.syncSubscriptionFromStripe(subscription);
  }

  /**
   * Handle subscription updated event
   */
  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    await this.syncSubscriptionFromStripe(subscription);
  }

  /**
   * Handle subscription deleted event
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(subscription.canceled_at! * 1000),
        endedAt: new Date(subscription.ended_at! * 1000),
      },
    });
  }

  /**
   * Handle successful invoice payment
   */
  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    if (invoice.subscription) {
      const subscriptionId = typeof invoice.subscription === 'string' 
        ? invoice.subscription 
        : invoice.subscription.id;

      // Update subscription status to active
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscriptionId },
        data: { status: 'ACTIVE' },
      });

      // TODO: Send payment confirmation email
      console.log(`Payment succeeded for subscription: ${subscriptionId}`);
    }
  }

  /**
   * Handle failed invoice payment
   */
  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    if (invoice.subscription) {
      const subscriptionId = typeof invoice.subscription === 'string' 
        ? invoice.subscription 
        : invoice.subscription.id;

      // Update subscription status
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscriptionId },
        data: { status: 'PAST_DUE' },
      });

      // TODO: Send payment failed notification
      console.log(`Payment failed for subscription: ${subscriptionId}`);
    }
  }

  /**
   * Handle trial ending soon
   */
  private async handleTrialWillEnd(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    // TODO: Send trial ending notification email
    console.log(`Trial ending soon for user: ${userId}`);
  }

  /**
   * Sync subscription data from Stripe to database
   */
  private async syncSubscriptionFromStripe(stripeSubscription: Stripe.Subscription): Promise<void> {
    const userId = stripeSubscription.metadata?.userId;
    if (!userId) {
      console.error('No userId in subscription metadata');
      return;
    }

    // Get the plan from Stripe price ID
    const priceId = stripeSubscription.items.data[0]?.price?.id;
    if (!priceId) {
      console.error('No price ID found in subscription');
      return;
    }

    const plan = await prisma.plan.findUnique({
      where: { stripePriceId: priceId },
    });

    if (!plan) {
      console.error(`Plan not found for price ID: ${priceId}`);
      return;
    }

    // Update or create subscription
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: stripeSubscription.id },
      update: {
        status: this.mapStripeStatusToDb(stripeSubscription.status),
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        trialStart: stripeSubscription.trial_start
          ? new Date(stripeSubscription.trial_start * 1000)
          : null,
        trialEnd: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000)
          : null,
        canceledAt: stripeSubscription.canceled_at
          ? new Date(stripeSubscription.canceled_at * 1000)
          : null,
        endedAt: stripeSubscription.ended_at
          ? new Date(stripeSubscription.ended_at * 1000)
          : null,
      },
      create: {
        userId,
        planId: plan.id,
        status: this.mapStripeStatusToDb(stripeSubscription.status),
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: typeof stripeSubscription.customer === 'string' 
          ? stripeSubscription.customer 
          : stripeSubscription.customer.id,
        trialStart: stripeSubscription.trial_start
          ? new Date(stripeSubscription.trial_start * 1000)
          : null,
        trialEnd: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000)
          : null,
      },
    });
  }

  /**
   * Map Stripe subscription status to database enum
   */
  private mapStripeStatusToDb(stripeStatus: Stripe.Subscription.Status) {
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

export const webhookService = new WebhookService();