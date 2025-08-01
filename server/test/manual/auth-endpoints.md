# Authentication Endpoints Manual Testing Guide

This guide provides curl commands to manually test the authentication endpoints.

## Prerequisites

1. Start the server: `npm run dev`
2. Ensure database is running and migrated
3. Ensure Redis is running (for rate limiting)

## Test Endpoints

### 1. Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification.",
  "data": {
    "user": {
      "id": "...",
      "email": "test@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "emailVerified": false,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    }
  }
}
```

### 2. Login with credentials

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Get user profile (requires access token)

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### 4. Refresh access token

```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

### 5. Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

### 6. Request password reset

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### 7. Change password (requires access token)

```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePass123!",
    "newPassword": "NewSecurePass123!"
  }'
```

## Error Testing

### Test validation errors

```bash
# Invalid email format
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Weak password
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "password": "weak",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Missing required fields
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test3@example.com"
  }'
```

### Test authentication errors

```bash
# Invalid credentials
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword123!"
  }'

# Missing access token
curl -X GET http://localhost:3000/api/auth/me

# Invalid access token
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer invalid-token"
```

## Rate Limiting Testing

To test rate limiting, make multiple requests quickly:

```bash
# Make 15 registration attempts quickly (should hit rate limit)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"test$i@example.com\",
      \"password\": \"SecurePass123!\",
      \"firstName\": \"Test$i\",
      \"lastName\": \"User$i\"
    }"
  echo "Request $i completed"
done
```

Expected response after hitting rate limit:
```json
{
  "success": false,
  "error": {
    "type": "RATE_LIMIT_ERROR",
    "message": "Too many authentication attempts, please try again later",
    "code": "RATE_LIMIT_EXCEEDED",
    "details": {
      "limit": 10,
      "remaining": 0,
      "resetTime": "..."
    }
  }
}
```

## Notes

- Replace `YOUR_ACCESS_TOKEN_HERE` and `YOUR_REFRESH_TOKEN_HERE` with actual tokens from registration/login responses
- Email verification tokens are logged to console in development mode
- Password reset tokens are logged to console in development mode
- All endpoints return consistent error format with proper HTTP status codes
- Rate limiting is applied per IP address for public endpoints and per user for authenticated endpoints