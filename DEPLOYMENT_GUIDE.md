# FeexSystems Platform Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the FeexSystems platform to various environments, including development, staging, and production deployments.

## Prerequisites

### System Requirements
- **Node.js**: 18+ LTS
- **Docker**: 20.10+ with Docker Compose
- **PostgreSQL**: 15+
- **Redis**: 7+
- **SSL Certificate**: For production HTTPS

### Required Services
- **Database**: PostgreSQL with connection pooling
- **Cache**: Redis for sessions and caching
- **Email**: SMTP service for notifications
- **Storage**: File storage for uploads (local or cloud)
- **Monitoring**: Health check and logging service

## Environment Configuration

### Environment Variables

Create environment-specific `.env` files:

#### Development (.env.development)
```env
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://feexsystems:password@localhost:5432/feexsystems_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secrets (generate strong secrets)
JWT_SECRET=dev-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=dev-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=dev@feexsystems.com
SMTP_PASS=app-password

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Logging
LOG_LEVEL=debug
```

#### Production (.env.production)
```env
# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://app.feexsystems.com

# Database (use connection pooling)
DATABASE_URL=postgresql://feexsystems:STRONG_PASSWORD@db.feexsystems.com:5432/feexsystems_prod?sslmode=require&connection_limit=20

# Redis (use authentication)
REDIS_URL=redis://username:STRONG_PASSWORD@redis.feexsystems.com:6379

# JWT Secrets (generate strong, unique secrets)
JWT_SECRET=SUPER_STRONG_JWT_SECRET_256_BITS_MINIMUM
JWT_REFRESH_SECRET=SUPER_STRONG_REFRESH_SECRET_256_BITS_MINIMUM
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.SENDGRID_API_KEY

# File Upload (use cloud storage)
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760
AWS_S3_BUCKET=feexsystems-uploads
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Security
CORS_ORIGINS=https://app.feexsystems.com,https://www.feexsystems.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

## Docker Deployment

### Development Deployment

```bash
# Clone repository
git clone <repository-url>
cd FeexSystems-20Labs

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development environment
npm run docker:dev

# View logs
docker-compose logs -f

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Health: http://localhost:3001/health
```

### Production Deployment

#### 1. Build Production Images

```bash
# Build production images
docker-compose --profile prod build

# Or build specific services
docker-compose build app-prod
docker-compose build nginx-prod
```

#### 2. Start Production Services

```bash
# Start all production services
npm run docker:prod

# Or start with custom configuration
docker-compose --profile prod up -d

# Scale application instances
docker-compose --profile prod up --scale app-prod=3 -d
```

#### 3. Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app-prod:
    build:
      context: .
      dockerfile: docker/Dockerfile.prod
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres-prod
      - redis-prod
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx-prod:
    build:
      context: docker/nginx
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - app-prod
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    restart: unless-stopped

  postgres-prod:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: feexsystems_prod
      POSTGRES_USER: feexsystems
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U feexsystems"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis-prod:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:
```

## Cloud Deployment

### AWS Deployment

#### 1. ECS with Fargate

```yaml
# ecs-task-definition.json
{
  "family": "feexsystems-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "feexsystems-app",
      "image": "your-account.dkr.ecr.region.amazonaws.com/feexsystems:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:feexsystems/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:feexsystems/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/feexsystems-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

#### 2. RDS and ElastiCache Setup

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier feexsystems-prod \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username feexsystems \
  --master-user-password STRONG_PASSWORD \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-12345678 \
  --db-subnet-group-name feexsystems-subnet-group

# Create ElastiCache Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id feexsystems-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --security-group-ids sg-87654321
```

### Google Cloud Platform

#### 1. Cloud Run Deployment

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/feexsystems:$COMMIT_SHA', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/feexsystems:$COMMIT_SHA']
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'feexsystems-app'
      - '--image'
      - 'gcr.io/$PROJECT_ID/feexsystems:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

#### 2. Cloud SQL and Memorystore

```bash
# Create Cloud SQL PostgreSQL instance
gcloud sql instances create feexsystems-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Create Memorystore Redis instance
gcloud redis instances create feexsystems-redis \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_7_0
```

## Database Migration

### Production Migration Strategy

```bash
# 1. Backup current database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Run migrations
npm run db:migrate deploy

# 3. Verify migration
npm run db:status

# 4. Seed production data (if needed)
npm run db:seed:prod
```

### Zero-Downtime Migration

```bash
# 1. Deploy new version alongside old version
docker-compose --profile blue-green up -d app-new

# 2. Run database migrations
docker-compose exec app-new npm run db:migrate deploy

# 3. Switch traffic to new version
# Update load balancer configuration

# 4. Stop old version
docker-compose stop app-old
```

## SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d app.feexsystems.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx SSL Configuration

```nginx
# /etc/nginx/sites-available/feexsystems
server {
    listen 443 ssl http2;
    server_name app.feexsystems.com;

    ssl_certificate /etc/letsencrypt/live/app.feexsystems.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.feexsystems.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name app.feexsystems.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring and Logging

### Health Check Monitoring

```bash
# Setup health check monitoring
curl -f http://localhost:3001/health || exit 1

# Monitor with systemd
cat > /etc/systemd/system/feexsystems-health.service << EOF
[Unit]
Description=FeexSystems Health Check
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/bin/curl -f http://localhost:3001/health
User=www-data

[Install]
WantedBy=multi-user.target
EOF

# Enable health check timer
systemctl enable feexsystems-health.timer
systemctl start feexsystems-health.timer
```

### Application Logging

```javascript
// Production logging configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### Log Aggregation

```yaml
# docker-compose.logging.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.5.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200

volumes:
  elasticsearch_data:
```

## Backup and Recovery

### Database Backup

```bash
#!/bin/bash
# backup-database.sh

BACKUP_DIR="/backups/database"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/feexsystems_backup_$TIMESTAMP.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Upload to cloud storage (optional)
aws s3 cp $BACKUP_FILE.gz s3://feexsystems-backups/database/

# Clean up old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Database backup completed: $BACKUP_FILE.gz"
```

### Application Backup

```bash
#!/bin/bash
# backup-application.sh

BACKUP_DIR="/backups/application"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
APP_DIR="/app/FeexSystems-20Labs"

# Create backup
tar -czf $BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=logs \
  --exclude=uploads \
  $APP_DIR

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz s3://feexsystems-backups/application/

echo "Application backup completed"
```

## Security Hardening

### Server Security

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install fail2ban
sudo apt install fail2ban -y

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

### Application Security

```javascript
// Security middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

app.use('/api/', limiter);
```

## Performance Optimization

### Application Performance

```javascript
// Enable gzip compression
const compression = require('compression');
app.use(compression());

// Enable HTTP/2
const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
}, app);
```

### Database Performance

```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_users_role ON users(role);
CREATE INDEX CONCURRENTLY idx_sessions_user_id ON sessions(user_id);
CREATE INDEX CONCURRENTLY idx_refresh_tokens_token ON refresh_tokens(token);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';
```

## Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
docker-compose logs app

# Check environment variables
docker-compose exec app env | grep -E "(DATABASE_URL|REDIS_URL|JWT_SECRET)"

# Test database connection
docker-compose exec app npm run db:status
```

#### Database Connection Issues
```bash
# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT version();"

# Check PostgreSQL logs
docker-compose logs postgres

# Verify network connectivity
docker-compose exec app ping postgres
```

#### Redis Connection Issues
```bash
# Test Redis connection
redis-cli -u $REDIS_URL ping

# Check Redis logs
docker-compose logs redis

# Verify Redis configuration
docker-compose exec redis redis-cli config get "*"
```

### Performance Issues

```bash
# Monitor resource usage
docker stats

# Check application metrics
curl http://localhost:3001/health

# Monitor database performance
docker-compose exec postgres pg_stat_activity

# Check slow queries
docker-compose exec postgres pg_stat_statements
```

## Rollback Procedures

### Application Rollback

```bash
# Rollback to previous version
docker-compose down
docker-compose pull app:previous-tag
docker-compose up -d

# Or use blue-green deployment
docker-compose --profile blue up -d
# Switch load balancer back to blue
docker-compose --profile green down
```

### Database Rollback

```bash
# Restore from backup
pg_restore --clean --if-exists -d $DATABASE_URL backup_file.sql

# Or rollback specific migration
npm run db:migrate rollback --steps=1
```

## Maintenance

### Regular Maintenance Tasks

```bash
# Weekly maintenance script
#!/bin/bash

# Update system packages
sudo apt update && sudo apt upgrade -y

# Clean Docker images
docker system prune -f

# Backup database
./scripts/backup-database.sh

# Rotate logs
logrotate /etc/logrotate.d/feexsystems

# Check disk space
df -h

# Monitor SSL certificate expiry
certbot certificates
```

### Scheduled Maintenance

```cron
# /etc/cron.d/feexsystems-maintenance

# Daily backup at 2 AM
0 2 * * * root /app/scripts/backup-database.sh

# Weekly system update at 3 AM Sunday
0 3 * * 0 root /app/scripts/system-update.sh

# Monthly SSL certificate renewal
0 4 1 * * root certbot renew --quiet

# Daily log cleanup
0 1 * * * root find /app/logs -name "*.log" -mtime +30 -delete
```

---

**Last Updated**: January 2024  
**Deployment Guide Version**: 1.0.0  
**Platform Version**: 2.0.0