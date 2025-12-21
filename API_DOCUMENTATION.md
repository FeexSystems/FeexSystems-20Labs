# FeexSystems Platform API Documentation

## Overview

The FeexSystems platform provides a comprehensive REST API with JWT-based authentication, role-based access control, and comprehensive error handling. All API endpoints follow RESTful conventions and return consistent JSON responses.

## Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://api.feexsystems.com/api`

## Authentication

### JWT Token Authentication

The API uses JWT (JSON Web Tokens) for authentication with the following characteristics:

- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for obtaining new access tokens
- **Automatic Refresh**: Client automatically refreshes tokens before expiration

### Authentication Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Token Refresh Flow

When an access token expires (401 response), the client automatically:
1. Uses the refresh token to obtain a new access token
2. Retries the original request with the new token
3. If refresh fails, redirects user to login

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "emailVerified": false,
      "profileImageUrl": null
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "emailVerified": true,
      "profileImageUrl": "https://example.com/profile.jpg",
      "subscription": {
        "id": "sub_123",
        "status": "active",
        "planId": "pro",
        "currentPeriodEnd": "2024-02-15T00:00:00.000Z"
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "emailVerified": true,
      "profileImageUrl": "https://example.com/profile.jpg"
    }
  }
}
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully logged out"
  }
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  }
}
```

#### Reset Password
```http
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token_123",
  "password": "NewSecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password successfully reset"
  }
}
```

#### Verify Email
```http
POST /api/auth/verify-email
```

**Request Body:**
```json
{
  "token": "verification_token_123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Email successfully verified"
  }
}
```

### User Management Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "emailVerified": true,
      "profileImageUrl": "https://example.com/profile.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "profileImageUrl": "https://example.com/new-profile.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "role": "USER",
      "emailVerified": true,
      "profileImageUrl": "https://example.com/new-profile.jpg"
    }
  }
}
```

#### Upload Profile Image
```http
POST /api/users/profile/image
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
```
image: <file>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profileImageUrl": "https://example.com/uploads/profiles/user_123.jpg"
  }
}
```

### Health Check Endpoints

#### System Health
```http
GET /health
```

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "database": { "status": "healthy", "responseTime": 12 },
    "redis": { "status": "healthy", "responseTime": 5 }
  },
  "uptime": 3600,
  "memory": {
    "rss": 52428800,
    "heapTotal": 29360128,
    "heapUsed": 20971520
  },
  "version": "2.0.0"
}
```

#### Readiness Check
```http
GET /health/ready
```

**Response (200):**
```json
{
  "status": "ready",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "database": "ready",
    "redis": "ready"
  }
}
```

#### Liveness Check
```http
GET /health/live
```

**Response (200):**
```json
{
  "status": "alive",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

## Error Handling

### Error Response Format

All API errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "type": "AUTHENTICATION_ERROR",
    "message": "Invalid email or password",
    "code": "INVALID_CREDENTIALS",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_123456789",
    "details": {
      "field": "email",
      "reason": "Email format is invalid"
    }
  }
}
```

### Common Error Codes

#### Authentication Errors (401)
- `INVALID_CREDENTIALS` - Wrong email or password
- `TOKEN_EXPIRED` - Access token has expired
- `INVALID_TOKEN` - Malformed or invalid token
- `TOKEN_REQUIRED` - Authorization header missing

#### Authorization Errors (403)
- `INSUFFICIENT_PERMISSIONS` - User lacks required role
- `EMAIL_VERIFICATION_REQUIRED` - Action requires verified email
- `ACCOUNT_SUSPENDED` - User account is suspended

#### Validation Errors (400)
- `VALIDATION_ERROR` - Request data validation failed
- `EMAIL_ALREADY_EXISTS` - Registration with existing email
- `WEAK_PASSWORD` - Password doesn't meet requirements
- `INVALID_EMAIL_FORMAT` - Email format is invalid

#### Rate Limiting Errors (429)
- `RATE_LIMIT_EXCEEDED` - Too many requests from client
- `LOGIN_ATTEMPTS_EXCEEDED` - Too many failed login attempts

#### Server Errors (500)
- `INTERNAL_SERVER_ERROR` - Unexpected server error
- `DATABASE_ERROR` - Database connection or query error
- `SERVICE_UNAVAILABLE` - External service unavailable

## Rate Limiting

### Limits by Endpoint Type

- **Authentication endpoints**: 10 requests per 15 minutes per IP
- **Password reset**: 3 requests per hour per IP
- **General API**: 100 requests per 15 minutes per user
- **File uploads**: 10 requests per hour per user

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## Role-Based Access Control

### User Roles

1. **USER** (Level 0)
   - Basic platform access
   - Personal profile management
   - Standard AI services

2. **ADMIN** (Level 1)
   - User management
   - Organization settings
   - Advanced AI services
   - Analytics access

3. **SUPER_ADMIN** (Level 2)
   - System administration
   - All user management
   - Platform configuration
   - Full analytics access

### Role Hierarchy

Roles are hierarchical - higher-level roles inherit permissions from lower levels:
- `SUPER_ADMIN` can access `ADMIN` and `USER` endpoints
- `ADMIN` can access `USER` endpoints
- `USER` can only access `USER` endpoints

## Client Integration

### JavaScript/TypeScript Example

```typescript
import { apiClient } from '@/lib/api-client';

// Initialize API client with auth functions
apiClient.initialize(
  () => authStore.tokens,
  () => authStore.refreshToken(),
  () => authStore.logout()
);

// Make authenticated requests
try {
  const userData = await apiClient.get('/users/profile');
  console.log('User:', userData.data.user);
} catch (error) {
  console.error('API Error:', error.message);
}

// Upload file
const formData = new FormData();
formData.append('image', file);
const result = await apiClient.upload('/users/profile/image', formData);
```

### cURL Examples

#### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

#### Get Profile
```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

#### Upload Image
```bash
curl -X POST http://localhost:3001/api/users/profile/image \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "image=@profile.jpg"
```

## Testing

### API Testing Tools

- **Postman Collection**: Available in `docs/postman-collection.json`
- **OpenAPI Spec**: Available in `docs/api-spec.yaml`
- **Integration Tests**: Run with `npm run test:api`

### Test Environment

- **Base URL**: `http://localhost:3001/api`
- **Test Database**: Automatically seeded with test data
- **Test Users**: Available with different roles for testing

## Security Considerations

### Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** (httpOnly cookies recommended for web)
3. **Implement proper CORS** settings
4. **Validate all input** on both client and server
5. **Use rate limiting** to prevent abuse
6. **Log security events** for monitoring
7. **Rotate JWT secrets** regularly
8. **Implement proper session management**

### Security Headers

The API includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## Changelog

### Version 2.0.0 (Current)
- Complete authentication system implementation
- JWT token management with automatic refresh
- Role-based access control
- Comprehensive error handling
- Rate limiting implementation
- Health check endpoints
- File upload support

### Version 1.0.0
- Basic API structure
- Database integration
- Initial endpoint definitions

---

**Last Updated**: January 2024  
**API Version**: 2.0.0  
**Documentation Version**: 1.0.0