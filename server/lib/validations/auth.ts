import { z } from 'zod';

// JWT payload validation schema
export const jwtPayloadSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  email: z.string().email('Invalid email'),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  iat: z.number().int().positive('Invalid issued at time'),
  exp: z.number().int().positive('Invalid expiration time'),
});

// Session token validation schema
export const sessionTokenSchema = z.object({
  sessionId: z.string().cuid('Invalid session ID'),
  userId: z.string().cuid('Invalid user ID'),
  expiresAt: z.number().int().positive('Invalid expiration time'),
});

// Refresh token payload validation schema
export const refreshTokenPayloadSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  tokenId: z.string().cuid('Invalid token ID'),
  iat: z.number().int().positive('Invalid issued at time'),
  exp: z.number().int().positive('Invalid expiration time'),
});

// Email verification token validation schema
export const emailVerificationTokenSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  email: z.string().email('Invalid email'),
  type: z.literal('email_verification'),
  iat: z.number().int().positive('Invalid issued at time'),
  exp: z.number().int().positive('Invalid expiration time'),
});

// Password reset token validation schema
export const passwordResetTokenSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  email: z.string().email('Invalid email'),
  type: z.literal('password_reset'),
  iat: z.number().int().positive('Invalid issued at time'),
  exp: z.number().int().positive('Invalid expiration time'),
});

// Authentication response schema
export const authResponseSchema = z.object({
  user: z.object({
    id: z.string().cuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
    emailVerified: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    lastLoginAt: z.date().nullable(),
  }),
  tokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number().int().positive(),
  }),
});

// Rate limiting validation schema
export const rateLimitSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  limit: z.number().int().positive('Limit must be positive'),
  windowMs: z.number().int().positive('Window must be positive'),
  skipSuccessfulRequests: z.boolean().optional().default(false),
  skipFailedRequests: z.boolean().optional().default(false),
});

// API key validation schema (for future use)
export const apiKeySchema = z.object({
  keyId: z.string().cuid('Invalid key ID'),
  userId: z.string().cuid('Invalid user ID'),
  name: z.string().min(1, 'API key name is required').max(100, 'Name too long'),
  permissions: z.array(z.string()).min(1, 'At least one permission required'),
  expiresAt: z.date().optional(),
  lastUsedAt: z.date().optional(),
});

// Two-factor authentication schema (for future use)
export const twoFactorSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  secret: z.string().min(1, 'Secret is required'),
  backupCodes: z.array(z.string()).length(10, 'Must have exactly 10 backup codes'),
  enabled: z.boolean(),
});

// TOTP verification schema
export const totpVerificationSchema = z.object({
  token: z.string().length(6, 'TOTP token must be 6 digits').regex(/^\d{6}$/, 'Token must be numeric'),
  userId: z.string().cuid('Invalid user ID'),
});

// OAuth provider schema (for future social login)
export const oauthProviderSchema = z.object({
  provider: z.enum(['google', 'github', 'microsoft']),
  providerId: z.string().min(1, 'Provider ID is required'),
  email: z.string().email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
  avatar: z.string().url().optional(),
});

// Device tracking schema (for security)
export const deviceSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  deviceId: z.string().min(1, 'Device ID is required'),
  deviceName: z.string().min(1, 'Device name is required'),
  userAgent: z.string().min(1, 'User agent is required'),
  ipAddress: z.string().ip('Invalid IP address'),
  location: z.object({
    country: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
  }).optional(),
  lastSeenAt: z.date(),
  trusted: z.boolean().default(false),
});

// Security event schema
export const securityEventSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  eventType: z.enum([
    'login_success',
    'login_failed',
    'password_changed',
    'email_changed',
    'account_locked',
    'suspicious_activity',
    'token_refresh',
    'logout',
  ]),
  ipAddress: z.string().ip('Invalid IP address'),
  userAgent: z.string().min(1, 'User agent is required'),
  metadata: z.record(z.any()).optional(),
  timestamp: z.date(),
});

// Type exports
export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
export type SessionToken = z.infer<typeof sessionTokenSchema>;
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;
export type EmailVerificationToken = z.infer<typeof emailVerificationTokenSchema>;
export type PasswordResetToken = z.infer<typeof passwordResetTokenSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RateLimit = z.infer<typeof rateLimitSchema>;
export type ApiKey = z.infer<typeof apiKeySchema>;
export type TwoFactor = z.infer<typeof twoFactorSchema>;
export type TotpVerification = z.infer<typeof totpVerificationSchema>;
export type OAuthProvider = z.infer<typeof oauthProviderSchema>;
export type Device = z.infer<typeof deviceSchema>;
export type SecurityEvent = z.infer<typeof securityEventSchema>;