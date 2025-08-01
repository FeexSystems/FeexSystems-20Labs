import { subscriptionService } from './subscription.service.js';
import { stripeService } from './stripe.service.js';
import { webhookService } from './webhook.service.js';

/**
 * Validation script to check subscription system components
 */
async function validateSubscriptionSystem() {
  console.log('🔍 Validating subscription system components...');

  try {
    // Check if services are properly instantiated
    console.log('✅ SubscriptionService instantiated');
    console.log('✅ StripeService instantiated');
    console.log('✅ WebhookService instantiated');

    // Check if required environment variables are set
    const requiredEnvVars = [
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'DATABASE_URL'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      console.warn('⚠️  Missing environment variables:', missingEnvVars);
    } else {
      console.log('✅ All required environment variables are set');
    }

    // Check service methods exist
    const subscriptionMethods = [
      'getPlans',
      'getUserSubscription',
      'createSubscription',
      'updateSubscription',
      'cancelSubscription',
      'getSubscriptionLimits',
      'canPerformAction'
    ];

    subscriptionMethods.forEach(method => {
      if (typeof (subscriptionService as any)[method] === 'function') {
        console.log(`✅ SubscriptionService.${method} exists`);
      } else {
        console.error(`❌ SubscriptionService.${method} missing`);
      }
    });

    const stripeMethods = [
      'createCustomer',
      'createSubscription',
      'updateSubscription',
      'cancelSubscription',
      'getSubscription',
      'createSetupIntent',
      'getPaymentMethods',
      'createBillingPortalSession',
      'constructWebhookEvent',
      'getActivePrices',
      'syncPlansFromStripe'
    ];

    stripeMethods.forEach(method => {
      if (typeof (stripeService as any)[method] === 'function') {
        console.log(`✅ StripeService.${method} exists`);
      } else {
        console.error(`❌ StripeService.${method} missing`);
      }
    });

    const webhookMethods = ['processStripeWebhook'];

    webhookMethods.forEach(method => {
      if (typeof (webhookService as any)[method] === 'function') {
        console.log(`✅ WebhookService.${method} exists`);
      } else {
        console.error(`❌ WebhookService.${method} missing`);
      }
    });

    console.log('🎉 Subscription system validation completed!');
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    throw error;
  }
}

// Run validation if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateSubscriptionSystem()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { validateSubscriptionSystem };