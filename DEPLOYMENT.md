# Production Deployment Guide

This guide provides instructions for deploying the application to a production environment.

## 1. Prerequisites

- Docker and Docker Compose installed
- Access to a PostgreSQL database
- Access to a Redis instance
- Sentry DSN (optional)
- Environment variables configured (see `.env.example`)

## 2. Environment Variables

Create a `.env.prod` file with the following variables:

```
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
REDIS_URL="redis://host:port"
CORS_ORIGIN="https://your-frontend-domain.com"
SENTRY_DSN="your-sentry-dsn"
AI_SERVICE_API_KEY="your-ai-service-key"
AI_SERVICE_URL="https://api.feexsystems.ai"
PORT=3000
```

## 3. Build and Run with Docker

1.  **Build the Docker image:**

    ```bash
    docker-compose -f docker-compose.yml -p feexsystems-prod build
    ```

2.  **Run the application:**

    ```bash
    docker-compose -f docker-compose.yml -p feexsystems-prod up -d
    ```

## 4. Database Migrations

Run database migrations after starting the application:

```bash
docker-compose -f docker-compose.yml -p feexsystems-prod exec app npx prisma migrate deploy
```

## 5. Health Checks

Verify the application is running correctly:

-   **Health Check:** `curl http://localhost:3000/health`
-   **Readiness Check:** `curl http://localhost:3000/health/ready`
-   **Liveness Check:** `curl http://localhost:3000/health/live`

## 6. Backup and Restore

### Backup

```bash
docker-compose -f docker-compose.yml -p feexsystems-prod exec postgres pg_dumpall -U your_user > backup.sql
```

### Restore

```bash
cat backup.sql | docker-compose -f docker-compose.yml -p feexsystems-prod exec -T postgres psql -U your_user
```

## 7. Deployment Checklist

-   [ ] Environment variables are configured and secured.
-   [ ] Database and Redis are accessible.
-   [ ] CORS origin is set to the correct frontend domain.
-   [ ] Sentry DSN is configured for error monitoring.
-   [ ] Docker image is built successfully.
-   [ ] Application is running and accessible.
-   [ ] Database migrations are applied.
-   [ ] Health checks are passing.
-   [ ] Backup and restore procedures are tested.
-   [ ] E2E tests have been run against a staging environment.

## 8. Rollback

To roll back to a previous version, you can use a specific Docker image tag if you are using a versioning strategy. If not, you would need to rebuild the previous version from source control and redeploy.

---

This guide provides a solid foundation for your production deployment. You can adapt it further based on your specific infrastructure and requirements.
