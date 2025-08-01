# Subscription System Documentation

This document describes the subscription and billing system implementation for the FeexSystems platform.

## Overview

The subscription system provides:
- Stripe integration for payment processing
- Subscription plan management
- Usage tracking and limits enforcement
- Webhook handling for real-time updates
- Middleware for subscription validation

## Components

### 1. Database Models

#### Plan Model
- Stores subscription plan information
- Links to Stripe products and prices
- Contains feature limits and pricing details

#### Subscription Model
- Links users to their active subscriptions
- Tracks subscription status and periods
- Stores Stripe subscription and customer IDs

#### StripeWebhookEvent Model
- Tracks processed webhook events
- Prevents duplicate processing
- Stores event data for debugging

### 2. Services

#### StripeService (`stripe.service.ts`)
Handles all Stripe API interactions:
- Customer management
- Subscription creation and updates
- Payment method handling
- Billing portal sessions
- Webhook event construction

#### SubscriptionService (`subscription.service.ts`)
Business logic for subscriptions:
- Plan management
- Subscription lifecycle
- Usage limit checking
- Feature access validation

#### WebhookService (`webhook.service.ts`)
Processes Stripe webhook events:
- Event deduplication
- Subscription status updates
- Payment notifications
- Trial ending alerts

### 3. Middleware

#### Subscription Middleware (`subscription.middleware.ts`)
- `requireActiveSubscription`: Ensures user has valid subscription
- `checkUsageLimit`: Validates usage against plan limits
- `requirePlan`: Requires specific plan tier or higher
- `trackUsage`: Records usage after successful actions

### 4. API Routes

#### Subscription Routes (`/api/subscriptions`)
- `GET /plans` - List available plans
- `GET /current` - Get user's current subscription
- `POST /create` - Create new subscription
- `PUT /:id` - Update subscription
- `DELETE /:id` - Cancel subscription
- `GET /usage` - Get usage metrics and limits
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Handle Stripe webhooks

## Environment Variables

Required environment variables:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
FRONTEND_URL=http://localhost:3000
```

## Usage Examples

### Creating a Subscription
```typescript
import { subscriptionService } from './subscription.service';

const result = await subscriptionService.createSubscription({
  userId: 'user_123',
  planId: 'plan_456',
  trialPeriodDays: 14
});
```

### Checking Usage Limits
```typescript
const canMakeRequest = await subscriptionService.canPerformAction(
  'user_123',
  'ai_request'
);

if (!canMakeRequest) {
  throw new Error('Usage limit exceeded');
}
```

### Using Middleware
```typescript
import { requireActiveSubscription, checkUsageLimit, trackUsage } from './subscription.middleware';

// Require active subscription
app.get('/api/premium-feature', 
  authMiddleware,
  requireActiveSubscription,
  handler
);

// Check and track AI request usage
app.post('/api/ai/request',
  authMiddleware,
  checkUsageLimit('ai_request'),
  trackUsage('ai_request'),
  handler
);
```

## Plan Features Structure

Plans store features as JSON with the following structure:
```json
{
  "aiRequestsPerMonth": 100,
  "deploymentsPerMonth": 10,
  "securityScansPerMonth": 5,
  "storageGB": 10,
  "teamMembers": 5,
  "support": "email",
  "customDomains": true,
  "advancedAnalytics": false,
  "apiAccess": true,
  "webhooks": true
}
```

Use `-1` for unlimited features in higher-tier plans.

## Webhook Events Handled

The system handles these Stripe webhook events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.trial_will_end`

## Error Handling

The system provides standardized error responses:
- `SUBSCRIPTION_ERROR` - Subscription-related issues
- `RATE_LIMIT_ERROR` - Usage limit exceeded
- `VALIDATION_ERROR` - Invalid request data
- `WEBHOOK_ERROR` - Webhook processing failed

## Testing

Run the subscription service tests:
```bash
npm test server/lib/services/__tests__/subscription.service.test.ts
```

Validate the system setup:
```bash
npx tsx server/lib/services/validate-subscription.ts
```

## Database Migrations

The subscription system requires these migrations:
1. `20241231000001_init_user_auth_system` - Base user system
2. `20241231000002_add_subscription_enhancements` - Subscription models

Run migrations:
```bash
npm run db:migrate
```

## Seeding Data

The seed file creates default plans:
- Free (0/month)
- Starter ($29/month)
- Professional ($99/month)
- Enterprise ($299/month)

Run seeding:
```bash
npm run db:seed
```

## Security Considerations

1. **Webhook Verification**: All webhooks are verified using Stripe signatures
2. **Event Deduplication**: Webhook events are tracked to prevent duplicate processing
3. **User Authorization**: Middleware ensures users can only access their own subscriptions
4. **Rate Limiting**: Usage limits are enforced at the API level
5. **Secure Storage**: Sensitive data is encrypted and stored securely

## Monitoring and Logging

The system logs:
- Subscription creation and updates
- Payment successes and failures
- Usage limit violations
- Webhook processing events
- Error conditions

Monitor these logs for system health and user behavior insights.