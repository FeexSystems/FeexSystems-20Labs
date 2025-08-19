import { describe, it, expect, beforeEach } from 'vitest';
import { createTestUserAndAgent, request } from '../helpers/api-helpers';
import { cleanupTestData } from '../helpers/db-helpers';
import { db } from '../../server/lib/database';

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      });

      // Verify user was created in database
      const user = await db.user.findUnique({
        where: { email: userData.email }
      });
      expect(user).toBeTruthy();
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully login an existing user', async () => {
      // Create test user
      const { user } = await createTestUserAndAgent();
      
      const response = await request
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'test-password'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'wrong-password'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
