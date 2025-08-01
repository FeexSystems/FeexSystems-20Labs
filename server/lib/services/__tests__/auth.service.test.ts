import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../auth.service';
import { AuthError } from '../../auth';
import { createTestDatabase, cleanupTestDatabase } from '../../../test/helpers/database';

describe('AuthService', () => {
  let prisma: PrismaClient;
  let authService: AuthService;

  beforeAll(async () => {
    prisma = await createTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase(prisma);
  });

  beforeEach(async () => {
    authService = new AuthService(prisma);
    // Clean up any existing data
    await prisma.refreshToken.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    // Clean up after each test
    await prisma.refreshToken.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await authService.register(userData);

      expect(result.user.email).toBe(userData.email.toLowerCase());
      expect(result.user.firstName).toBe(userData.firstName);
      expect(result.user.lastName).toBe(userData.lastName);
      expect(result.user.emailVerified).toBe(false);
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(result.tokens.expiresIn).toBeGreaterThan(0);
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      // Register first user
      await authService.register(userData);

      // Try to register with same email
      await expect(authService.register(userData)).rejects.toThrow(AuthError);
      await expect(authService.register(userData)).rejects.toThrow('User with this email already exists');
    });

    it('should normalize email to lowercase', async () => {
      const userData = {
        email: 'TEST@EXAMPLE.COM',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await authService.register(userData);

      expect(result.user.email).toBe('test@example.com');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Create a test user
      await authService.register({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('should login user with correct credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const result = await authService.login(credentials);

      expect(result.user.email).toBe(credentials.email);
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should throw error with invalid email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'SecurePass123!',
      };

      await expect(authService.login(credentials)).rejects.toThrow(AuthError);
      await expect(authService.login(credentials)).rejects.toThrow('Invalid email or password');
    });

    it('should throw error with invalid password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      await expect(authService.login(credentials)).rejects.toThrow(AuthError);
      await expect(authService.login(credentials)).rejects.toThrow('Invalid email or password');
    });

    it('should update last login timestamp', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const result = await authService.login(credentials);
      
      // Get user from database to check lastLoginAt
      const user = await prisma.user.findUnique({
        where: { id: result.user.id },
      });

      expect(user?.lastLoginAt).toBeDefined();
      expect(user?.lastLoginAt).toBeInstanceOf(Date);
    });
  });

  describe('refreshToken', () => {
    let refreshToken: string;
    let userId: string;

    beforeEach(async () => {
      // Create a test user and get refresh token
      const result = await authService.register({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      });
      refreshToken = result.tokens.refreshToken;
      userId = result.user.id;
    });

    it('should refresh token successfully', async () => {
      const result = await authService.refreshToken({ refreshToken });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.expiresIn).toBeGreaterThan(0);
      expect(result.refreshToken).not.toBe(refreshToken); // Should be rotated
    });

    it('should throw error with invalid refresh token', async () => {
      const invalidToken = 'invalid-token';

      await expect(authService.refreshToken({ refreshToken: invalidToken })).rejects.toThrow(AuthError);
    });

    it('should throw error with expired refresh token', async () => {
      // Delete the refresh token to simulate expiration
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });

      await expect(authService.refreshToken({ refreshToken })).rejects.toThrow(AuthError);
    });
  });

  describe('logout', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeEach(async () => {
      const result = await authService.register({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      });
      accessToken = result.tokens.accessToken;
      refreshToken = result.tokens.refreshToken;
    });

    it('should logout successfully', async () => {
      await expect(authService.logout(accessToken, refreshToken)).resolves.not.toThrow();

      // Verify refresh token is deleted
      const tokenRecord = await prisma.refreshToken.findFirst({
        where: { token: refreshToken },
      });
      expect(tokenRecord).toBeNull();
    });

    it('should logout without refresh token', async () => {
      await expect(authService.logout(accessToken)).resolves.not.toThrow();
    });
  });

  describe('verifyEmail', () => {
    let userId: string;
    let email: string;

    beforeEach(async () => {
      const result = await authService.register({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      });
      userId = result.user.id;
      email = result.user.email;
    });

    it('should verify email successfully', async () => {
      // Generate verification token
      const { JWTService } = await import('../../auth');
      const token = JWTService.generateEmailVerificationToken(userId, email);

      await authService.verifyEmail({ token });

      // Check if email is verified
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      expect(user?.emailVerified).toBe(true);
    });

    it('should throw error with invalid token', async () => {
      const invalidToken = 'invalid-token';

      await expect(authService.verifyEmail({ token: invalidToken })).rejects.toThrow(AuthError);
    });
  });

  describe('requestPasswordReset', () => {
    beforeEach(async () => {
      await authService.register({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('should request password reset for existing user', async () => {
      await expect(authService.requestPasswordReset({ email: 'test@example.com' })).resolves.not.toThrow();
    });

    it('should not throw error for non-existent email', async () => {
      // Should not reveal if email exists or not
      await expect(authService.requestPasswordReset({ email: 'nonexistent@example.com' })).resolves.not.toThrow();
    });
  });

  describe('resetPassword', () => {
    let userId: string;
    let email: string;

    beforeEach(async () => {
      const result = await authService.register({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      });
      userId = result.user.id;
      email = result.user.email;
    });

    it('should reset password successfully', async () => {
      // Generate reset token
      const { JWTService } = await import('../../auth');
      const token = JWTService.generatePasswordResetToken(userId, email);

      const newPassword = 'NewSecurePass123!';
      await authService.resetPassword({ token, password: newPassword });

      // Try to login with new password
      const loginResult = await authService.login({
        email,
        password: newPassword,
      });
      expect(loginResult.user.email).toBe(email);
    });

    it('should throw error with invalid token', async () => {
      const invalidToken = 'invalid-token';
      const newPassword = 'NewSecurePass123!';

      await expect(authService.resetPassword({ token: invalidToken, password: newPassword })).rejects.toThrow(AuthError);
    });
  });

  describe('changePassword', () => {
    let userId: string;
    const currentPassword = 'SecurePass123!';

    beforeEach(async () => {
      const result = await authService.register({
        email: 'test@example.com',
        password: currentPassword,
        firstName: 'John',
        lastName: 'Doe',
      });
      userId = result.user.id;
    });

    it('should change password successfully', async () => {
      const newPassword = 'NewSecurePass123!';

      await authService.changePassword(userId, {
        currentPassword,
        newPassword,
      });

      // Try to login with new password
      const loginResult = await authService.login({
        email: 'test@example.com',
        password: newPassword,
      });
      expect(loginResult.user.id).toBe(userId);
    });

    it('should throw error with incorrect current password', async () => {
      const newPassword = 'NewSecurePass123!';

      await expect(authService.changePassword(userId, {
        currentPassword: 'WrongPassword123!',
        newPassword,
      })).rejects.toThrow(AuthError);
      await expect(authService.changePassword(userId, {
        currentPassword: 'WrongPassword123!',
        newPassword,
      })).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('getProfile', () => {
    let userId: string;

    beforeEach(async () => {
      const result = await authService.register({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      });
      userId = result.user.id;
    });

    it('should get user profile successfully', async () => {
      const profile = await authService.getProfile(userId);

      expect(profile.id).toBe(userId);
      expect(profile.email).toBe('test@example.com');
      expect(profile.firstName).toBe('John');
      expect(profile.lastName).toBe('Doe');
      expect('passwordHash' in profile).toBe(false); // Should not include password
    });

    it('should throw error for non-existent user', async () => {
      const nonExistentId = 'non-existent-id';

      await expect(authService.getProfile(nonExistentId)).rejects.toThrow(AuthError);
      await expect(authService.getProfile(nonExistentId)).rejects.toThrow('User not found');
    });
  });

  describe('updateProfile', () => {
    let userId: string;

    beforeEach(async () => {
      const result = await authService.register({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      });
      userId = result.user.id;
    });

    it('should update profile successfully', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const updatedProfile = await authService.updateProfile(userId, updateData);

      expect(updatedProfile.firstName).toBe('Jane');
      expect(updatedProfile.lastName).toBe('Smith');
      expect(updatedProfile.email).toBe('test@example.com'); // Should remain unchanged
    });

    it('should update email successfully', async () => {
      const updateData = {
        email: 'newemail@example.com',
      };

      const updatedProfile = await authService.updateProfile(userId, updateData);

      expect(updatedProfile.email).toBe('newemail@example.com');
      expect(updatedProfile.emailVerified).toBe(false); // Should be reset when email changes
    });

    it('should throw error when updating to existing email', async () => {
      // Create another user
      await authService.register({
        email: 'existing@example.com',
        password: 'SecurePass123!',
        firstName: 'Existing',
        lastName: 'User',
      });

      const updateData = {
        email: 'existing@example.com',
      };

      await expect(authService.updateProfile(userId, updateData)).rejects.toThrow(AuthError);
      await expect(authService.updateProfile(userId, updateData)).rejects.toThrow('Email is already taken');
    });
  });
});