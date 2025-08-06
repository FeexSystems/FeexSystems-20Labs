import 'dotenv/config';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StripeService {
  private stripe: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }
    
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  /**
   * Create a Stripe customer
   */
  async createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      email,
      name,
      metadata,
    });
  }

  /**
   * Create a subscription for a customer
   */
  async createSubscription(
    customerId: string,
    priceId: string,
    options?: {
      trialPeriodDays?: number;
      metadata?: Record<string, string>;
      paymentBehavior?: Stripe.SubscriptionCreateParams.PaymentBehavior;
    }
  ): Promise<Stripe.Subscription> {
    const subscriptionParams: Stripe.SubscriptionCreateParams = {
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: options?.paymentBehavior || 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    };

    if (options?.trialPeriodDays) {
      subscriptionParams.trial_period_days = options.trialPeriodDays;
    }

    if (options?.metadata) {
      subscriptionParams.metadata = options.metadata;
    }

    return await this.stripe.subscriptions.create(subscriptionParams);
  }

  /**
   * Update a subscription
   */
  async updateSubscription(
    subscriptionId: string,
    updates: {
      priceId?: string;
      cancelAtPeriodEnd?: boolean;
      metadata?: Record<string, string>;
    }
  ): Promise<Stripe.Subscription> {
    const updateParams: Stripe.SubscriptionUpdateParams = {};

    if (updates.priceId) {
      // Get current subscription to update items
      const currentSub = await this.stripe.subscriptions.retrieve(subscriptionId);
      updateParams.items = [
        {
          id: currentSub.items.data[0].id,
          price: updates.priceId,
        },
      ];
    }

    if (updates.cancelAtPeriodEnd !== undefined) {
      updateParams.cancel_at_period_end = updates.cancelAtPeriodEnd;
    }

    if (updates.metadata) {
      updateParams.metadata = updates.metadata;
    }

    return await this.stripe.subscriptions.update(subscriptionId, updateParams);
  }

  /**
   * Cancel a subscription immediately
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.cancel(subscriptionId);
  }

  /**
   * Retrieve a subscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['customer', 'items.data.price.product'],
    });
  }

  /**
   * Create a setup intent for saving payment methods
   */
  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    return await this.stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
    });
  }

  /**
   * Get customer's payment methods
   */
  async getPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return paymentMethods.data;
  }

  /**
   * Create a billing portal session
   */
  async createBillingPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<Stripe.BillingPortal.Session> {
    return await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  /**
   * Construct webhook event from request
   */
  constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is required');
    }

    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  /**
   * Get all active prices/plans
   */
  async getActivePrices(): Promise<Stripe.Price[]> {
    const prices = await this.stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });
    return prices.data;
  }

  /**
   * Create an invoice item
   */
  async createInvoiceItem(params: {
    customer: string;
    amount: number;
    currency: string;
    description: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.InvoiceItem> {
    return await this.stripe.invoiceItems.create(params);
  }

  /**
   * Create an invoice
   */
  async createInvoice(params: {
    customer: string;
    description?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Invoice> {
    return await this.stripe.invoices.create(params);
  }

  /**
   * Finalize an invoice
   */
  async finalizeInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    return await this.stripe.invoices.finalizeInvoice(invoiceId);
  }

  /**
   * Sync plans from Stripe to database
   */
  async syncPlansFromStripe(): Promise<void> {
    const prices = await this.getActivePrices();
    
    for (const price of prices) {
      const product = price.product as Stripe.Product;
      
      await prisma.plan.upsert({
        where: { stripePriceId: price.id },
        update: {
          name: product.name,
          description: product.description,
          price: price.unit_amount || 0,
          currency: price.currency,
          interval: price.recurring?.interval || 'month',
          intervalCount: price.recurring?.interval_count || 1,
          isActive: price.active,
          updatedAt: new Date(),
        },
        create: {
          name: product.name,
          description: product.description,
          stripePriceId: price.id,
          stripeProductId: product.id,
          price: price.unit_amount || 0,
          currency: price.currency,
          interval: price.recurring?.interval || 'month',
          intervalCount: price.recurring?.interval_count || 1,
          features: product.metadata || {},
          isActive: price.active,
        },
      });
    }
  }
}

export const stripeService = new StripeService();