---
inclusion: always
---

# FeexSystems Platform Development Guidelines

## Project Overview
This is a full-stack TypeScript platform with React frontend, Express backend, and PostgreSQL database. The platform provides AI services, DevOps automation, security scanning, and team collaboration features.

## Architecture Patterns

### Monorepo Structure
- `client/` - React frontend with Vite
- `server/` - Express.js backend
- `shared/` - Shared types and utilities
- `prisma/` - Database schema and migrations

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI, React Query, Zustand
- **Backend**: Express.js, TypeScript, Prisma ORM, Redis, Socket.IO
- **Database**: PostgreSQL with Prisma
- **Infrastructure**: Docker, Netlify Functions

## Code Style & Conventions

### TypeScript
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use enums for constants that map to database values
- Always type function parameters and return values
- Use `Record<string, any>` for flexible JSON fields

### React Patterns
- Use functional components with hooks
- Implement lazy loading for route components
- Use React Query for server state management
- Use Zustand for client state management
- Wrap components in ErrorBoundary and Suspense
- Use `@/` path alias for imports from client root

### API Design
- RESTful endpoints under `/api/` prefix
- Use consistent response format with `success` boolean
- Include timestamps in responses
- Handle BigInt serialization with custom JSON replacer
- Use Zod for request/response validation

### Database Patterns
- Use Prisma schema with snake_case column names
- Map to camelCase in TypeScript with `@map()`
- Use UUIDs (cuid) for primary keys
- Include `createdAt` and `updatedAt` timestamps
- Use proper foreign key relationships with cascade rules

### Error Handling
- Use ErrorBoundary components in React
- Implement global error handler in Express
- Return structured error responses with timestamps
- Log errors with appropriate context
- Don't retry 4xx HTTP errors in React Query

### Security
- Use JWT tokens with refresh token rotation
- Hash passwords with bcryptjs
- Implement rate limiting on API endpoints
- Use CORS with specific origins
- Validate all inputs with Zod schemas

### Performance
- Implement lazy loading for routes and components
- Use React Query caching with appropriate stale times
- Optimize database queries with proper indexing
- Use Redis for caching and session storage
- Implement pagination for large data sets

## File Organization

### Client Structure
```
client/
├── components/     # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and services
├── store/         # Zustand stores
└── src/           # Additional source files
```

### Server Structure
```
server/
├── routes/        # Express route handlers
├── lib/           # Business logic and services
├── middleware/    # Express middleware
└── test/          # Test files
```

### Component Patterns
- Use shadcn/ui components as base
- Implement compound components for complex UI
- Use render props or children functions for flexibility
- Keep components focused and single-purpose

## Development Workflow

### Testing
- Use Vitest for unit and integration tests
- Test API endpoints with Supertest
- Mock external services in tests
- Maintain test coverage for critical paths

### Environment Management
- Use `.env.example` files for documentation
- Never commit sensitive environment variables
- Use different configs for dev/staging/production
- Validate required environment variables on startup

### Database Migrations
- Use Prisma migrations for schema changes
- Include seed data for development
- Test migrations on staging before production
- Keep migrations atomic and reversible

## Team Collaboration Features

### Role-Based Access
- Implement proper permission checking
- Use shared types from `shared/api.ts`
- Support team workspaces and resource sharing
- Track activity logs for audit trails

### Real-time Features
- Use Socket.IO for live updates
- Implement proper connection management
- Handle reconnection gracefully
- Use rooms for team-specific updates

## Deployment & Infrastructure

### Docker Support
- Use multi-stage builds for optimization
- Separate dev and production Dockerfiles
- Include health check endpoints
- Use proper signal handling for graceful shutdown

### Monitoring
- Implement health check endpoints (`/health`, `/health/ready`, `/health/live`)
- Log structured data for observability
- Track usage metrics and activity logs
- Monitor database connection health

## Best Practices

### Code Quality
- Use Prettier for consistent formatting
- Follow ESLint rules for code quality
- Write self-documenting code with clear names
- Keep functions small and focused
- Use TypeScript strict mode

### Performance Optimization
- Implement proper loading states
- Use skeleton screens for better UX
- Optimize bundle size with code splitting
- Cache API responses appropriately
- Use database indexes for query optimization

### Security Considerations
- Validate all user inputs
- Implement proper authentication flows
- Use HTTPS in production
- Sanitize data before database operations
- Implement proper CORS policies