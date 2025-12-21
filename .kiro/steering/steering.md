---
inclusion: always
---

# FeexSystems Platform Development Guidelines

## Architecture & Stack

Full-stack TypeScript application with:
- **Frontend**: React 18 + Vite + TailwindCSS + shadcn/ui components
- **Backend**: Express.js + TypeScript + Prisma ORM
- **Database**: PostgreSQL with multi-tenant SaaS schema
- **Auth**: JWT tokens with refresh mechanism, Zustand persistence
- **Infrastructure**: Docker containers, Redis caching, WebSocket support

## Code Standards (Critical)

### Formatting (Non-negotiable)
- **2 spaces indentation** (never tabs or 4 spaces)
- **Trailing commas** in all objects/arrays
- **Functional components only** with hooks (no class components)
- TypeScript strict mode is **disabled** - maintain this setting
- Follow existing `.prettierrc` configuration exactly

### File Organization
- `client/` - React components, hooks, utilities
- `server/` - Express routes, middleware, services  
- `shared/` - Common types, utilities, API contracts
- `prisma/` - Database schema, migrations, seeds

### Import Conventions
- Use `@/*` for `./client/*` imports
- Use `@shared/*` for `./shared/*` imports  
- Prefer path aliases over relative imports (`../../../`)

## Authentication Architecture

### Core Components (Required)
- `AuthProvider` - Global context in `client/components/AuthProvider.tsx`
- `ProtectedRoute` - Guards for authenticated pages
- `PublicRoute` - Guards for unauthenticated pages  
- `useAuth` - Hook for auth state management
- `TokenManager` - Handles automatic token refresh

### Implementation Rules
- Use Zustand store with localStorage persistence for auth state
- Auto-refresh tokens on 401 responses via interceptors
- JWT tokens with proper expiration validation
- **Never expose secrets/keys in client code**

## API Patterns

### Endpoint Structure
- **All API routes MUST start with `/api/`**
- Use RESTful conventions: `GET /api/users`, `POST /api/users`
- Include health endpoints: `/health`, `/health/ready`, `/health/live`

### Error Response Schema
```typescript
{
  type: string,        // Error category
  message: string,     // Human-readable message
  code: number,        // HTTP status code
  timestamp: string,   // ISO timestamp
  requestId: string    // Unique request identifier
}
```

### Error Handling Requirements
- Auto-retry 401s with token refresh
- Graceful degradation for network failures
- Consistent error format across all endpoints

## Database Patterns

### Prisma Schema Rules
- Database columns: `snake_case` with `@map()` directive
- TypeScript fields: `camelCase`
- Use proper relations with cascade deletes where appropriate
- Use enums for status/categorical fields

### Data Access Requirements
- **Only use Prisma Client** for database operations
- Wrap multi-table operations in transactions
- Implement proper connection pooling and error handling

## UI Component Standards

### shadcn/ui Integration
- **Always use shadcn/ui components** as base building blocks
- Extend components through composition, not modification
- Follow existing component patterns in `client/components/`

### Styling Requirements
- **Primary theme**: Dark mode
- Use TailwindCSS with custom color palette
- Implement mobile-first responsive design
- Use CSS custom properties for theme consistency

### State Management
- Use React Query for server state
- Use Zustand for client state
- Implement proper loading states and error boundaries

## Security Requirements

### Data Protection
- **Never expose API keys, secrets, or sensitive data** in client code
- Use environment variables for all configuration
- Validate all input with Zod schemas
- Use bcrypt for password hashing

### CORS Configuration
- Implement proper CORS settings
- Restrict origins in production
- Handle preflight requests correctly

## Development Commands

Essential scripts:
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run db:migrate` - Database migrations
- `npm run db:seed` - Seed test data

## Performance Requirements

### Code Optimization
- Use React.lazy() for code splitting
- Implement proper bundle tree shaking
- Use React Query for caching and background updates
- Always include loading states and skeleton screens

### Testing Standards
- Use Vitest for all tests
- Mock API endpoints properly
- Test critical UI flows
- Leverage TypeScript for compile-time error prevention