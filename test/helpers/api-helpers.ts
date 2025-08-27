import supertest from 'supertest';
import { app } from '../../server';
import type { User } from '@prisma/client';
import { db } from '../../server/lib/database';
import jwt from 'jsonwebtoken';

export const request = supertest(app);

/**
 * Create an authenticated request agent
 */
export function createAuthenticatedAgent(user: User) {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
  
  const agent = supertest.agent(app);
  agent.set('Authorization', `Bearer ${token}`);
  return agent;
}

/**
 * Create a test user and return both the user object and an authenticated agent
 */
export async function createTestUserAndAgent(role: 'USER' | 'ADMIN' = 'USER') {
  const user = await db.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      passwordHash: 'test-password-hash',
      firstName: 'Test',
      lastName: 'User',
      role
    }
  });
  
  return {
    user,
    agent: createAuthenticatedAgent(user)
  };
}

/**
 * Clean up test data after tests
 */
export async function cleanupTestData() {
  const testUserEmails = ['test%'];
  await db.user.deleteMany({
    where: {
      OR: testUserEmails.map(email => ({
        email: { startsWith: email }
      }))
    }
  });
}

/**
 * Mock API response for testing
 */
export function mockApiResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
}

/**
 * Wait for a specified time
 */
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
