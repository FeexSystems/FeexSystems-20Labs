# DevOps Integration System

This document describes the DevOps automation tools and integrations implemented for Task 5.1.

## Overview

The DevOps integration system provides OAuth-based repository integration with GitHub, GitLab, and Bitbucket, along with secure token storage and webhook handling for automated CI/CD triggers.

## Components

### 1. Database Models

The following Prisma models are defined in `prisma/schema.prisma`:

- **Repository**: Stores connected repositories with encrypted access tokens
- **Pipeline**: Defines CI/CD pipeline configurations with stages and triggers
- **Deployment**: Tracks deployment executions and their status

### 2. Git Provider Integrations

#### GitHub Provider (`server/lib/services/git-providers/github.provider.ts`)
- OAuth 2.0 authentication flow
- Repository listing and details
- Webhook creation and management
- HMAC signature validation

#### GitLab Provider (`server/lib/services/git-providers/gitlab.provider.ts`)
- OAuth 2.0 with refresh token support
- Project (repository) management
- Webhook integration
- Token-based webhook validation

#### Bitbucket Provider (`server/lib/services/git-providers/bitbucket.provider.ts`)
- OAuth 2.0 authentication
- Repository access and management
- Webhook setup
- Basic webhook validation

### 3. Security & Encryption

#### Encryption Service (`server/lib/utils/encryption.ts`)
- AES-256-GCM encryption for access tokens
- HMAC signature generation and verification
- Secure random secret generation
- Timing-safe signature comparison

### 4. Repository Service

#### Main Service (`server/lib/services/repository.service.ts`)
- OAuth flow orchestration
- Repository management (CRUD operations)
- Webhook lifecycle management
- Secure token storage and retrieval
- Webhook payload processing

### 5. API Routes

#### DevOps Routes (`server/routes/devops.ts`)
- `GET /api/devops/providers` - List available git providers
- `GET /api/devops/auth/:provider` - Get OAuth authorization URL
- `GET /api/devops/auth/:provider/callback` - Handle OAuth callback
- `GET /api/devops/repositories` - List user repositories
- `GET /api/devops/repositories/:id` - Get repository details
- `POST /api/devops/repositories/:id/webhook` - Create webhook
- `DELETE /api/devops/repositories/:id/webhook` - Delete webhook
- `DELETE /api/devops/repositories/:id` - Remove repository access
- `POST /api/devops/webhooks/:provider` - Handle incoming webhooks

### 6. Validation Schemas

#### DevOps Validations (`server/lib/validations/devops.ts`)
- Git provider validation
- Repository creation/update schemas
- Pipeline stage and trigger validation
- Webhook payload validation
- OAuth callback validation

## Environment Variables

The following environment variables are required:

```bash
# Git Providers
GITHUB_CLIENT_ID="your-github-oauth-client-id"
GITHUB_CLIENT_SECRET="your-github-oauth-client-secret"
GITLAB_CLIENT_ID="your-gitlab-oauth-client-id"
GITLAB_CLIENT_SECRET="your-gitlab-oauth-client-secret"
BITBUCKET_CLIENT_ID="your-bitbucket-oauth-client-id"
BITBUCKET_CLIENT_SECRET="your-bitbucket-oauth-client-secret"

# Encryption
ENCRYPTION_KEY="your-super-secret-encryption-key"

# Base URL
BASE_URL="http://localhost:3001"
```

## OAuth Setup

### GitHub
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `{BASE_URL}/api/devops/auth/github/callback`
4. Copy Client ID and Client Secret to environment variables

### GitLab
1. Go to GitLab User Settings > Applications
2. Create a new application
3. Set Redirect URI to: `{BASE_URL}/api/devops/auth/gitlab/callback`
4. Select scopes: `api`, `read_user`, `read_repository`
5. Copy Application ID and Secret to environment variables

### Bitbucket
1. Go to Bitbucket Settings > OAuth consumers
2. Create a new consumer
3. Set Callback URL to: `{BASE_URL}/api/devops/auth/bitbucket/callback`
4. Select permissions: `Repositories: Read`, `Account: Read`
5. Copy Key and Secret to environment variables

## Usage Flow

1. **Connect Repository**:
   - User clicks "Connect GitHub/GitLab/Bitbucket"
   - System redirects to OAuth provider
   - User authorizes application
   - System stores encrypted access token
   - Repositories are imported and displayed

2. **Webhook Setup**:
   - User enables webhooks for a repository
   - System creates webhook on git provider
   - Webhook URL is stored in database
   - Push/PR events trigger webhook calls

3. **Webhook Processing**:
   - Git provider sends webhook to system
   - System validates signature (if supported)
   - Webhook payload is processed
   - Pipeline triggers can be initiated

## Security Features

- **Token Encryption**: All access tokens are encrypted using AES-256-GCM
- **Signature Validation**: Webhook signatures are validated when supported
- **State Parameter**: OAuth flows use state parameter to prevent CSRF
- **Token Expiration**: Refresh tokens are used when available
- **Rate Limiting**: API endpoints are protected by rate limiting middleware
- **Authentication**: All endpoints require valid JWT authentication

## Testing

Tests are provided for:
- Repository Service (`server/test/services/repository.service.test.ts`)
- DevOps Routes (`server/test/routes/devops.test.ts`)
- Git Provider implementations (mocked in tests)

Run tests with:
```bash
npm test -- server/test/services/repository.service.test.ts
npm test -- server/test/routes/devops.test.ts
```

## Requirements Fulfilled

This implementation fulfills the following requirements from Task 5.1:

✅ **Define Repository, Pipeline, and Deployment models**
- All models are defined in Prisma schema with proper relationships

✅ **Implement OAuth integration for GitHub, GitLab, and Bitbucket**
- Complete OAuth 2.0 flows for all three providers
- Token refresh support where available

✅ **Create repository webhook handling for automated triggers**
- Webhook creation, deletion, and processing
- Signature validation for security

✅ **Build secure token storage and encryption utilities**
- AES-256-GCM encryption for sensitive data
- HMAC utilities for webhook validation
- Secure random secret generation

The system is ready for the next phase: CI/CD pipeline management (Task 5.2).