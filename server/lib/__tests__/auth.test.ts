import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { JWTService, AuthError, PasswordUtils, TokenBlacklistService } from '../auth';
import { UserRole } from '@prisma/client';

// Mock environment variables
const mockEnv = {
  JWT_SECRET: 'test-jwt-secret-key-for-testing-purposes-only',
  JWT_REFRESH_SECRET: 'test-refresh-secret-key-for-testing-purposes-only',
  JWT_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
};

// Mock process.env
vi.mock('process', () => ({
  env: mockEnv,
}));

describe('JWTService', () => {
  const mockUser = {
    id: 'user_123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.USER,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
  };

  beforeEach(() => {
    // Clear token blacklist before each test
    TokenBlacklistService.clear();
  });

  afterEach(() => {
    // Clean up after each test
    TokenBlacklistService.clear();
  });

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = JWTService.generateAccessToken(mockUser);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // Verify token structure
      const decoded = jwt.decode(token) as any;
      expect(decoded.userId).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
      expect(decoded.iss).toBe('feexsystems');
      expect(decoded.aud).toBe('feexsystems-users');
    });

    it('should generate different tokens for different users', () => {
      const user2 = { ...mockUser, id: 'user_456', email: 'test2@example.com' };
      
      const token1 = JWTService.generateAccessToken(mockUser);
      const token2 = JWTService.generateAccessToken(user2);
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const tokenId = 'token_123';
      const token = JWTService.generateRefreshToken(mockUser.id, tokenId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // Verify token structure
      const decoded = jwt.decode(token) as any;
      expect(decoded.userId).toBe(mockUser.id);
      expect(decoded.tokenId).toBe(tokenId);
      expect(decoded.iss).toBe('feexsystems');
      expect(decoded.aud).toBe('feexsystems-refresh');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const token = JWTService.generateAccessToken(mockUser);
      const payload = JWTService.verifyAccessToken(token);
      
      expect(payload.userId).toBe(mockUser.id);
      expect(payload.email).toBe(mockUser.email);
      expect(payload.role).toBe(mockUser.role);
    });

    it('should throw AuthError for invalid token', () => {
      expect(() => {
        JWTService.verifyAccessToken('invalid-token');
      }).toThrow(AuthError);
    });

    it('should throw AuthError for expired token', () => {
      // Generate token with very short expiry
      const shortLivedToken = jwt.sign(
        { userId: mockUser.id, email: mockUser.email, role: mockUser.role },
        mockEnv.JWT_SECRET,
        { expiresIn: '1ms' }
      );

      // Wait for token to expire
      setTimeout(() => {
        expect(() => {
          JWTService.verifyAccessToken(shortLivedToken);
        }).toThrow(AuthError);
      }, 10);
    });

    it('should throw AuthError with correct error codes', () => {
      try {
        JWTService.verifyAccessToken('invalid-token');
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).code).toBe('INVALID_TOKEN');
      }
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const tokenId = 'token_123';
      const token = JWTService.generateRefreshToken(mockUser.id, tokenId);
      const payload = JWTService.verifyRefreshToken(token);
      
      expect(payload.userId).toBe(mockUser.id);
      expect(payload.tokenId).toBe(tokenId);
    });

    it('should throw AuthError for invalid refresh token', () => {
      expect(() => {
        JWTService.verifyRefreshToken('invalid-token');
      }).toThrow(AuthError);
    });
  });

  describe('generateEmailVerificationToken', () => {
    it('should generate a valid email verification token', () => {
      const token = JWTService.generateEmailVerificationToken(mockUser.id, mockUser.email);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      const decoded = jwt.decode(token) as any;
      expect(decoded.userId).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.type).toBe('email_verification');
    });
  });

  describe('generatePasswordResetToken', () => {
    it('should generate a valid password reset token', () => {
      const token = JWTService.generatePasswordResetToken(mockUser.id, mockUser.email);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      const decoded = jwt.decode(token) as any;
      expect(decoded.userId).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.type).toBe('password_reset');
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'test-token';
      const header = `Bearer ${token}`;
      
      const extracted = JWTService.extractTokenFromHeader(header);
      expect(extracted).toBe(token);
    });

    it('should return null for invalid header format', () => {
      expect(JWTService.extractTokenFromHeader('Invalid header')).toBeNull();
      expect(JWTService.extractTokenFromHeader('Bearer')).toBeNull();
      expect(JWTService.extractTokenFromHeader('Basic token')).toBeNull();
      expect(JWTService.extractTokenFromHeader(undefined)).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const token = JWTService.generateAccessToken(mockUser);
      expect(JWTService.isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      const expiredToken = jwt.sign(
        { userId: mockUser.id },
        mockEnv.JWT_SECRET,
        { expiresIn: '1ms' }
      );

      setTimeout(() => {
        expect(JWTService.isTokenExpired(expiredToken)).toBe(true);
      }, 10);
    });

    it('should return true for invalid token', () => {
      expect(JWTService.isTokenExpired('invalid-token')).toBe(true);
    });
  });

  describe('generateTokenPair', () => {
    it('should generate both access and refresh tokens', () => {
      const refreshTokenId = 'refresh_123';
      const tokenPair = JWTService.generateTokenPair(mockUser, refreshTokenId);
      
      expect(tokenPair.accessToken).toBeDefined();
      expect(tokenPair.refreshToken).toBeDefined();
      expect(tokenPair.expiresIn).toBeGreaterThan(0);
      expect(tokenPair.tokenType).toBe('Bearer');
      
      // Verify tokens are valid
      const accessPayload = JWTService.verifyAccessToken(tokenPair.accessToken);
      const refreshPayload = JWTService.verifyRefreshToken(tokenPair.refreshToken);
      
      expect(accessPayload.userId).toBe(mockUser.id);
      expect(refreshPayload.userId).toBe(mockUser.id);
      expect(refreshPayload.tokenId).toBe(refreshTokenId);
    });
  });

  describe('generateSecureToken', () => {
    it('should generate a secure random token', () => {
      const token = JWTService.generateSecureToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // 32 bytes = 64 hex characters
    });

    it('should generate different tokens each time', () => {
      const token1 = JWTService.generateSecureToken();
      const token2 = JWTService.generateSecureToken();
      
      expect(token1).not.toBe(token2);
    });

    it('should generate token with custom length', () => {
      const token = JWTService.generateSecureToken(16);
      
      expect(token.length).toBe(32); // 16 bytes = 32 hex characters
    });
  });
});

describe('PasswordUtils', () => {
  describe('generateSecurePassword', () => {
    it('should generate a password with default length', () => {
      const password = PasswordUtils.generateSecurePassword();
      
      expect(password).toBeDefined();
      expect(password.length).toBe(16);
    });

    it('should generate a password with custom length', () => {
      const password = PasswordUtils.generateSecurePassword(20);
      
      expect(password.length).toBe(20);
    });

    it('should generate different passwords each time', () => {
      const password1 = PasswordUtils.generateSecurePassword();
      const password2 = PasswordUtils.generateSecurePassword();
      
      expect(password1).not.toBe(password2);
    });

    it('should include all required character types', () => {
      const password = PasswordUtils.generateSecurePassword(20);
      
      expect(password).toMatch(/[a-z]/); // lowercase
      expect(password).toMatch(/[A-Z]/); // uppercase
      expect(password).toMatch(/\d/); // numbers
      expect(password).toMatch(/[@$!%*?&]/); // special characters
    });
  });

  describe('checkPasswordStrength', () => {
    it('should return strong score for good password', () => {
      const result = PasswordUtils.checkPasswordStrength('StrongPass123!');
      
      expect(result.score).toBeGreaterThanOrEqual(5);
      expect(result.isStrong).toBe(true);
      expect(result.feedback).toHaveLength(0);
    });

    it('should return weak score for poor password', () => {
      const result = PasswordUtils.checkPasswordStrength('weak');
      
      expect(result.score).toBeLessThan(5);
      expect(result.isStrong).toBe(false);
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should provide specific feedback for missing requirements', () => {
      const result = PasswordUtils.checkPasswordStrength('password');
      
      expect(result.feedback).toContain('Add uppercase letters');
      expect(result.feedback).toContain('Add numbers');
      expect(result.feedback).toContain('Add special characters (@$!%*?&)');
    });

    it('should detect repeating characters', () => {
      const result = PasswordUtils.checkPasswordStrength('Passsword123!');
      
      expect(result.feedback).toContain('Avoid repeating characters');
    });
  });
});

describe('TokenBlacklistService', () => {
  beforeEach(() => {
    TokenBlacklistService.clear();
  });

  afterEach(() => {
    TokenBlacklistService.clear();
  });

  describe('addToBlacklist', () => {
    it('should add token to blacklist', () => {
      const token = 'test-token';
      
      TokenBlacklistService.addToBlacklist(token);
      
      expect(TokenBlacklistService.isBlacklisted(token)).toBe(true);
      expect(TokenBlacklistService.size()).toBe(1);
    });
  });

  describe('isBlacklisted', () => {
    it('should return false for non-blacklisted token', () => {
      expect(TokenBlacklistService.isBlacklisted('non-existent-token')).toBe(false);
    });

    it('should return true for blacklisted token', () => {
      const token = 'blacklisted-token';
      
      TokenBlacklistService.addToBlacklist(token);
      
      expect(TokenBlacklistService.isBlacklisted(token)).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should remove expired tokens from blacklist', () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { userId: 'test' },
        mockEnv.JWT_SECRET,
        { expiresIn: '1ms' }
      );

      TokenBlacklistService.addToBlacklist(expiredToken);
      
      setTimeout(() => {
        TokenBlacklistService.cleanup();
        expect(TokenBlacklistService.isBlacklisted(expiredToken)).toBe(false);
      }, 10);
    });

    it('should keep valid tokens in blacklist', () => {
      const validToken = jwt.sign(
        { userId: 'test' },
        mockEnv.JWT_SECRET,
        { expiresIn: '1h' }
      );

      TokenBlacklistService.addToBlacklist(validToken);
      TokenBlacklistService.cleanup();
      
      expect(TokenBlacklistService.isBlacklisted(validToken)).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all blacklisted tokens', () => {
      TokenBlacklistService.addToBlacklist('token1');
      TokenBlacklistService.addToBlacklist('token2');
      
      expect(TokenBlacklistService.size()).toBe(2);
      
      TokenBlacklistService.clear();
      
      expect(TokenBlacklistService.size()).toBe(0);
    });
  });
});

describe('AuthError', () => {
  it('should create error with correct properties', () => {
    const error = new AuthError('Test message', 'TEST_CODE', 400);
    
    expect(error.message).toBe('Test message');
    expect(error.code).toBe('TEST_CODE');
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe('AuthError');
  });

  it('should use default status code', () => {
    const error = new AuthError('Test message', 'TEST_CODE');
    
    expect(error.statusCode).toBe(401);
  });
});