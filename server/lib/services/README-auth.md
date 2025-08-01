# Authentication Service Implementation

This document describes the authentication system implementation for the FeexSystems platform.

## Overview

The authentication system provides comprehensive user management with JWT-based authentication, including:

- User registration with email verification
- Secure login with password validation
- JWT access tokens with refresh token rotation
- Password reset functionality
- Rate limiting and security features
- Session management
- User profile management

## Architecture

### Components

1. **AuthService** (`auth.service.ts`) - Main authentication business logic
2. **UserService** (`user.service.ts`) - User data management
3. **SessionService** (`session.service.ts`) - Session and token management
4. **JWTService** (`../auth.ts`) - JWT token utilities
5. **Authentication Middleware** (`../middleware/auth.middleware.ts`) - Route protection
6. **Validation Schemas** (`../validations/`) - Input validation

### Database Models

- **User** - User account information
- **Session** - User sessions (alternative to JWT)
- **RefreshToken** - JWT refresh tokens with rotation

## API Endpoints

### Public Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Protected Endpoints

- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout current session
- `POST /api/auth/logout-all` - Logout all sessions
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/resend-verification` - Resend email verification
- `GET /api/auth/sessions` - Get user sessions
- `GET /api/auth/stats` - Get authentication statistics

## Security Features

### Password Security

- Minimum 8 characters with complexity requirements
- bcrypt hashing with salt rounds of 12
- Password strength validation
- Secure password generation utility

### JWT Security

- Short-lived access tokens (15 minutes)
- Refresh token rotation on each use
- Token blacklisting for logout
- Proper JWT claims and validation
- Separate secrets for access and refresh tokens

### Rate Limiting

- Authentication endpoints: 10 requests per 15 minutes
- Password reset: 3 requests per hour
- General API: 100 requests per 15 minutes
- Per-user limits for authenticated endpoints

### Additional Security

- Email verification required for sensitive operations
- Secure token generation for email/password reset
- Session management with expiration
- Input validation and sanitization
- CORS protection
- Error message standardization (no information leakage)

## Usage Examples

### Register a new user

```typescript
const authService = new AuthService(prisma);

const result = await authService.register({
  email: 'user@example.com',
  password: 'SecurePass123!',
  firstName: 'John',
  lastName: 'Doe'
});

console.log('User:', result.user);
console.log('Tokens:', result.tokens);
```

### Login user

```typescript
const result = await authService.login({
  email: 'user@example.com',
  password: 'SecurePass123!'
});

console.log('Access Token:', result.tokens.accessToken);
console.log('Refresh Token:', result.tokens.refreshToken);
```

### Protect routes with middleware

```typescript
import { authenticate, authorize } from '../middleware/auth.middleware';

// Require authentication
router.get('/protected', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Require specific role
router.get('/admin', authenticate, authorize('ADMIN'), (req, res) => {
  res.json({ message: 'Admin only' });
});
```

### Refresh tokens

```typescript
const newTokens = await authService.refreshToken({
  refreshToken: 'existing-refresh-token'
});

console.log('New Access Token:', newTokens.accessToken);
console.log('New Refresh Token:', newTokens.refreshToken);
```

## Error Handling

All authentication errors use the `AuthError` class with consistent structure:

```typescript
{
  success: false,
  error: {
    type: 'AUTHENTICATION_ERROR',
    message: 'Invalid email or password',
    code: 'INVALID_CREDENTIALS',
    timestamp: '2024-01-01T00:00:00.000Z',
    requestId: 'req_123456789'
  }
}
```

### Common Error Codes

- `EMAIL_ALREADY_EXISTS` - Registration with existing email
- `INVALID_CREDENTIALS` - Wrong email/password
- `TOKEN_EXPIRED` - Access token expired
- `INVALID_TOKEN` - Malformed or invalid token
- `EMAIL_VERIFICATION_REQUIRED` - Action requires verified email
- `RATE_LIMIT_EXCEEDED` - Too many requests

## Testing

### Unit Tests

- JWT token generation and validation
- Password utilities and strength checking
- Token blacklist functionality
- Authentication service methods

### Integration Tests

- API endpoint testing with supertest
- Database integration testing
- Rate limiting validation
- Error handling verification

### Manual Testing

See `server/test/manual/auth-endpoints.md` for curl commands to test all endpoints.

## Configuration

### Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/feexsystems

# Redis (for rate limiting and caching)
REDIS_URL=redis://localhost:6379

# Email (for verification and password reset)
EMAIL_SERVICE_API_KEY=your-email-service-key
EMAIL_FROM=noreply@feexsystems.com
```

### Security Recommendations

1. Use strong, unique secrets for JWT tokens
2. Enable HTTPS in production
3. Configure proper CORS origins
4. Set up email service for verification/reset
5. Monitor rate limiting and authentication attempts
6. Regularly rotate JWT secrets
7. Implement proper logging and monitoring
8. Use environment-specific configurations

## Future Enhancements

- OAuth integration (Google, GitHub, etc.)
- Two-factor authentication (2FA)
- Device management and trusted devices
- Advanced session management
- Audit logging for security events
- Account lockout after failed attempts
- Password history and rotation policies
- Advanced rate limiting with user reputation