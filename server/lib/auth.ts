import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '@prisma/client';
import { 
  JwtPayload, 
  RefreshTokenPayload, 
  EmailVerificationToken, 
  PasswordResetToken 
} from './validations/auth';

// Environment variables with defaults
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const EMAIL_TOKEN_EXPIRES_IN = '24h';
const PASSWORD_RESET_TOKEN_EXPIRES_IN = '1h';

export class JWTService {
  /**
   * Generate access token
   */
  static generateAccessToken(user: Omit<User, 'passwordHash'>): string {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
      issuer: 'feexsystems',
      audience: 'feexsystems-users',
    });
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(userId: string, tokenId: string): string {
    const payload: Omit<RefreshTokenPayload, 'iat' | 'exp'> = {
      userId,
      tokenId,
    };

    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN as any,
      issuer: 'feexsystems',
      audience: 'feexsystems-refresh',
    });
  }

  /**
   * Generate email verification token
   */
  static generateEmailVerificationToken(userId: string, email: string): string {
    const payload: Omit<EmailVerificationToken, 'iat' | 'exp'> = {
      userId,
      email,
      type: 'email_verification',
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: EMAIL_TOKEN_EXPIRES_IN,
      issuer: 'feexsystems',
      audience: 'feexsystems-email-verification',
    });
  }

  /**
   * Generate password reset token
   */
  static generatePasswordResetToken(userId: string, email: string): string {
    const payload: Omit<PasswordResetToken, 'iat' | 'exp'> = {
      userId,
      email,
      type: 'password_reset',
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: PASSWORD_RESET_TOKEN_EXPIRES_IN,
      issuer: 'feexsystems',
      audience: 'feexsystems-password-reset',
    });
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'feexsystems',
        audience: 'feexsystems-users',
      }) as JwtPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError('Access token expired', 'TOKEN_EXPIRED');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError('Invalid access token', 'INVALID_TOKEN');
      } else {
        throw new AuthError('Token verification failed', 'TOKEN_VERIFICATION_FAILED');
      }
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: 'feexsystems',
        audience: 'feexsystems-refresh',
      }) as RefreshTokenPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError('Refresh token expired', 'REFRESH_TOKEN_EXPIRED');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
      } else {
        throw new AuthError('Refresh token verification failed', 'REFRESH_TOKEN_VERIFICATION_FAILED');
      }
    }
  }

  /**
   * Verify email verification token
   */
  static verifyEmailVerificationToken(token: string): EmailVerificationToken {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'feexsystems',
        audience: 'feexsystems-email-verification',
      }) as EmailVerificationToken;

      if (decoded.type !== 'email_verification') {
        throw new AuthError('Invalid token type', 'INVALID_TOKEN_TYPE');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError('Email verification token expired', 'EMAIL_TOKEN_EXPIRED');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError('Invalid email verification token', 'INVALID_EMAIL_TOKEN');
      } else {
        throw new AuthError('Email token verification failed', 'EMAIL_TOKEN_VERIFICATION_FAILED');
      }
    }
  }

  /**
   * Verify password reset token
   */
  static verifyPasswordResetToken(token: string): PasswordResetToken {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'feexsystems',
        audience: 'feexsystems-password-reset',
      }) as PasswordResetToken;

      if (decoded.type !== 'password_reset') {
        throw new AuthError('Invalid token type', 'INVALID_TOKEN_TYPE');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError('Password reset token expired', 'PASSWORD_RESET_TOKEN_EXPIRED');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError('Invalid password reset token', 'INVALID_PASSWORD_RESET_TOKEN');
      } else {
        throw new AuthError('Password reset token verification failed', 'PASSWORD_RESET_TOKEN_VERIFICATION_FAILED');
      }
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    
    return parts[1];
  }

  /**
   * Get token expiration time in seconds
   */
  static getTokenExpirationTime(token: string): number | null {
    try {
      const decoded = jwt.decode(token) as any;
      return decoded?.exp || null;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const exp = this.getTokenExpirationTime(token);
    if (!exp) return true;
    
    return Date.now() >= exp * 1000;
  }

  /**
   * Generate secure random token for non-JWT purposes
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate token pair (access + refresh)
   */
  static generateTokenPair(user: Omit<User, 'passwordHash'>, refreshTokenId: string) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user.id, refreshTokenId);
    
    // Get expiration time from access token
    const expiresIn = this.getTokenExpirationTime(accessToken);
    
    return {
      accessToken,
      refreshToken,
      expiresIn: expiresIn ? expiresIn - Math.floor(Date.now() / 1000) : 900, // Default 15 minutes
      tokenType: 'Bearer',
    };
  }
}

/**
 * Custom authentication error class
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Password utilities
 */
export class PasswordUtils {
  /**
   * Generate a secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
    let password = '';
    
    // Ensure at least one character from each required category
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '@$!%*?&';
    
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Check password strength
   */
  static checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
    isStrong: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('Password should be at least 8 characters long');

    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Add numbers');

    if (/[@$!%*?&]/.test(password)) score += 1;
    else feedback.push('Add special characters (@$!%*?&)');

    // Common patterns check
    if (!/(.)\1{2,}/.test(password)) score += 1;
    else feedback.push('Avoid repeating characters');

    return {
      score,
      feedback,
      isStrong: score >= 5,
    };
  }
}

/**
 * Token blacklist service for logout functionality
 */
export class TokenBlacklistService {
  private static blacklistedTokens = new Set<string>();
  private static cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Add token to blacklist
   */
  static addToBlacklist(token: string): void {
    this.blacklistedTokens.add(token);
    
    // Start cleanup if not already running
    if (!this.cleanupInterval) {
      this.startCleanup();
    }
  }

  /**
   * Check if token is blacklisted
   */
  static isBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  /**
   * Remove expired tokens from blacklist
   */
  static cleanup(): void {
    const expiredTokens: string[] = [];
    
    for (const token of this.blacklistedTokens) {
      if (JWTService.isTokenExpired(token)) {
        expiredTokens.push(token);
      }
    }
    
    expiredTokens.forEach(token => this.blacklistedTokens.delete(token));
  }

  /**
   * Start automatic cleanup
   */
  private static startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
      
      // Stop cleanup if no tokens left
      if (this.blacklistedTokens.size === 0) {
        this.stopCleanup();
      }
    }, 60000); // Cleanup every minute
  }

  /**
   * Stop automatic cleanup
   */
  private static stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Clear all blacklisted tokens (for testing)
   */
  static clear(): void {
    this.blacklistedTokens.clear();
    this.stopCleanup();
  }

  /**
   * Get blacklist size (for monitoring)
   */
  static size(): number {
    return this.blacklistedTokens.size;
  }
}