# FeexSystems Platform

A comprehensive full-stack TypeScript platform providing AI services, DevOps automation, and security solutions with enterprise-grade authentication and multi-tenant architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

### Development Setup

```bash
# Clone and setup
git clone <repository-url>
cd FeexSystems-20Labs
npm install

# Environment setup
cp .env.example .env
# Edit .env with your configuration

# Start with Docker (recommended)
npm run docker:dev

# Or start manually
npm run db:init
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Express.js + TypeScript + Prisma ORM
- **Database**: PostgreSQL with multi-tenant schema
- **Cache**: Redis for sessions and caching
- **Auth**: JWT with refresh tokens + Zustand state management
- **Testing**: Vitest + MSW + jsdom
- **Infrastructure**: Docker + Docker Compose

### Project Structure
```
FeexSystems-20Labs/
├── client/                 # React frontend application
│   ├── components/         # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and services
│   ├── pages/             # Route components
│   └── test/              # Frontend tests
├── server/                # Express backend application
│   ├── lib/               # Business logic and services
│   ├── routes/            # API route handlers
│   └── test/              # Backend tests
├── shared/                # Shared types and utilities
├── prisma/                # Database schema and migrations
├── docker/                # Docker configuration
└── scripts/               # Build and deployment scripts
```

## 🔐 Authentication System

### Features
- **JWT-based authentication** with automatic token refresh
- **Role-based access control** (USER, ADMIN, SUPER_ADMIN)
- **Persistent sessions** with localStorage
- **Protected routing** with automatic redirects
- **Email verification** and password reset flows
- **Rate limiting** and security protections

### Usage Examples

#### Authentication Hook
```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }
  
  return (
    <div>
      Welcome, {user.firstName}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### Protected Routes
```typescript
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';

// Regular protected route
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Admin-only route
<AdminRoute>
  <AdminPanel />
</AdminRoute>
```

#### API Client
```typescript
import { apiClient } from '@/lib/api-client';

// Authenticated requests with automatic token handling
const userData = await apiClient.get('/users/profile');
const result = await apiClient.post('/ai/request', { prompt: 'Hello' });
```

## 🧪 Testing

### Test Infrastructure
- **Vitest** for unit and integration tests
- **MSW** for API mocking
- **jsdom** for DOM testing
- **Comprehensive mocks** for localStorage, fetch, and React Router

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npx vitest run client/test/auth/use-auth.test.ts
```

### Test Coverage
- ✅ Authentication store and state management
- ✅ Token manager and automatic refresh
- ✅ API client with error handling
- ✅ useAuth hook functionality
- ✅ Protected route components
- ✅ Mock utilities and test helpers

## 🐳 Docker Support

### Development Environment
```bash
# Start all services
npm run docker:dev

# View logs
docker-compose logs -f

# Stop services
npm run docker:down
```

### Production Environment
```bash
# Start production build
npm run docker:prod

# Scale application
docker-compose --profile prod up --scale app-prod=3
```

## 📊 Database Management

### Available Commands
```bash
# Initialize database (first time)
npm run db:init

# Create and apply migrations
npm run db:migrate migrate add_feature_name

# Reset database (development)
npm run db:reset

# Seed with sample data
npm run db:seed

# Open database GUI
npm run db:studio
```

### Schema Features
- **Multi-tenant architecture** with proper isolation
- **User management** with roles and permissions
- **Subscription handling** with Stripe integration
- **AI service tracking** and usage analytics
- **Audit logging** for security and compliance

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Token refresh
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation
- `GET /api/auth/me` - Current user profile

### Health Checks
- `GET /health` - Overall system health
- `GET /health/ready` - Readiness check
- `GET /health/live` - Liveness check

### Protected Endpoints
- `GET /api/users/profile` - User profile management
- `POST /api/ai/request` - AI service requests
- `GET /api/subscription/status` - Subscription information

## 🛡️ Security Features

### Authentication Security
- **JWT tokens** with short expiration (15 minutes)
- **Refresh token rotation** for enhanced security
- **Automatic token refresh** before expiration
- **Secure token storage** in localStorage
- **Role-based access control** with hierarchical permissions

### API Security
- **Rate limiting** on all endpoints
- **Input validation** with Zod schemas
- **CORS protection** with configurable origins
- **Error handling** without information leakage
- **Request/response logging** for audit trails

### Infrastructure Security
- **Environment variable protection**
- **Database connection encryption**
- **Redis authentication**
- **Docker security best practices**

## 🚀 Deployment

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Redis
REDIS_URL=redis://host:port

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret

# Optional: Email, Stripe, OpenAI
SMTP_HOST=smtp.gmail.com
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
```

### Production Checklist
- [ ] Set strong JWT secrets
- [ ] Configure database with SSL
- [ ] Set up Redis with authentication
- [ ] Configure email service
- [ ] Set up monitoring and logging
- [ ] Configure CORS for production domains
- [ ] Set up SSL/TLS certificates
- [ ] Configure rate limiting
- [ ] Set up backup strategies

## 📈 Monitoring

### Health Checks
The application provides comprehensive health monitoring:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "database": { "status": "healthy" },
    "redis": { "status": "healthy" }
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

### Logging
- **Structured logging** with timestamps and request IDs
- **Error tracking** with stack traces
- **Performance monitoring** for API endpoints
- **Security event logging** for authentication attempts

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes following the coding standards
4. Add tests for new functionality
5. Run tests and ensure they pass
6. Submit a pull request

### Coding Standards
- **2 spaces indentation** (never tabs)
- **Trailing commas** in objects/arrays
- **Functional components** with hooks only
- **TypeScript strict mode** disabled (maintain current setting)
- **Prettier formatting** with existing configuration

### Testing Requirements
- Unit tests for new functions and hooks
- Integration tests for API endpoints
- Component tests for UI changes
- Mock external dependencies properly

## 📚 Documentation

### Additional Resources
- [Infrastructure Setup Guide](./INFRASTRUCTURE_SETUP.md)
- [Authentication Infrastructure](./client/README-auth-infrastructure.md)
- [Testing Documentation](./client/test/README.md)
- [Server Authentication Service](./server/lib/services/README-auth.md)

### API Documentation
- Interactive API documentation available at `/api/docs` (when running)
- OpenAPI specification in `docs/api-spec.yaml`
- Postman collection in `docs/postman-collection.json`

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check PostgreSQL status
docker-compose ps postgres
docker-compose logs postgres

# Test connection
psql $DATABASE_URL
```

**Redis Connection Failed**
```bash
# Check Redis status
docker-compose ps redis
redis-cli -u $REDIS_URL ping
```

**Authentication Issues**
```bash
# Clear auth storage
localStorage.clear()

# Check JWT token validity
# Tokens expire after 15 minutes
```

**Build Issues**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run build:clean
```

## 📄 License

This project is proprietary software owned by FeexSystems. All rights reserved.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `docs/` directory

---

**Version**: 2.0.0  
**Last Updated**: January 2024  
**Node.js**: 18+  
**TypeScript**: 5.5+