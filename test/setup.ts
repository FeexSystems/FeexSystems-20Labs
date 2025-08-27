import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';
import { db } from '../server/lib/database';
import { resetTestDatabase } from './helpers/db-helpers';
import { mockRedisClient } from './helpers/redis-mock';
import { mockStripeClient } from './helpers/stripe-mock';

// Setup test environment
beforeAll(async () => {
  // Reset test database before all tests
  await resetTestDatabase();

  // Mock Redis client
  vi.mock('../server/lib/redis', () => mockRedisClient);

  // Mock Stripe client
  vi.mock('stripe', () => mockStripeClient);

  // Mock environment variables
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.REDIS_URL = 'redis://localhost:6379';
  process.env.STRIPE_SECRET_KEY = 'test-stripe-key';
});

// Cleanup after each test
afterEach(async () => {
  cleanup(); // Clean up React Testing Library
  await db.$disconnect(); // Disconnect from database
  vi.clearAllMocks(); // Clear all mocks
});

// Global test utilities
global.createTestUser = async (overrides = {}) => {
  return db.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      firstName: 'Test',
      lastName: 'User',
      ...overrides
    }
  });
};

global.createTestSubscription = async (userId: string, overrides = {}) => {
  return db.subscription.create({
    data: {
      userId,
      planId: 'test-plan',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ...overrides
    }
  });
};
