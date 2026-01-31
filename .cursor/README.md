# FeexSystems Enhanced Platform

A comprehensive AI-powered DevOps and Security Management platform built with modern technologies.

## 🚀 Features

### Core Platform
- **Authentication & User Management** - Secure JWT-based authentication with role-based access control
- **Team Collaboration** - Team and workspace management with real-time collaboration
- **Subscription Management** - Flexible billing and subscription plans
- **AI Services Integration** - OpenAI-powered intelligent automation and insights

### DevOps Tools
- **Repository Management** - Git provider integrations (GitHub, GitLab, Bitbucket)
- **CI/CD Pipelines** - Automated build, test, and deployment workflows
- **Infrastructure Monitoring** - Real-time system health and performance tracking
- **Deployment Tracking** - Comprehensive deployment history and rollback capabilities

### Security Features
- **Vulnerability Scanning** - Automated security scanning and reporting
- **Security Monitoring** - Real-time threat detection and alerting
- **Compliance Management** - Industry-standard compliance frameworks
- **Incident Response** - Automated incident detection and response workflows

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **TypeScript** for type safety
- **Prisma** ORM with **PostgreSQL** database
- **Redis** for caching and rate limiting
- **JWT** for authentication
- **WebSocket** for real-time communication

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Framer Motion** for animations

### Infrastructure
- **Docker** and **Docker Compose** for containerization
- **Nginx** as reverse proxy
- **PostgreSQL** for primary database
- **Redis** for caching and sessions

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- Docker and Docker Compose
- PostgreSQL 15+ (if running locally)
- Redis 7+ (if running locally)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd feexsystems-platform
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install

# Return to root
cd ..
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```bash
# Database
DATABASE_URL="postgresql://feexsystems:feexsystems123@localhost:5432/feexsystems"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Stripe (for billing)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database
npm run db:seed
```

### 5. Start Development Environment
```bash
# Using Docker (recommended)
npm run docker:up

# Or start services individually
npm run dev:server  # Backend on port 5000
npm run dev:client  # Frontend on port 3000
```

## 🐳 Docker Development

### Start all services
```bash
npm run docker:up
```

### View logs
```bash
docker-compose logs -f
```

### Stop services
```bash
npm run docker:down
```

### Rebuild containers
```bash
npm run docker:build
```

## 📚 API Documentation

The API is available at `http://localhost:5000/api` with the following endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/teams` - Get user teams

### Teams
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Subscriptions
- `GET /api/subscriptions` - List subscriptions
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions/:id` - Get subscription details

### AI Services
- `POST /api/ai/chat` - AI chat interface
- `POST /api/ai/analyze` - Code analysis
- `POST /api/ai/generate` - Code generation

### DevOps
- `GET /api/devops/repositories` - List repositories
- `POST /api/devops/repositories` - Connect repository
- `GET /api/devops/pipelines` - List pipelines
- `POST /api/devops/pipelines` - Create pipeline

### Security
- `GET /api/security/scans` - List security scans
- `POST /api/security/scans` - Start security scan
- `GET /api/security/vulnerabilities` - List vulnerabilities

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run specific test suites
```bash
npm run test:server  # Backend tests
npm run test:client  # Frontend tests
```

### Run tests with coverage
```bash
npm run test:coverage
```

## 🏗️ Building for Production

### Build all packages
```bash
npm run build
```

### Build specific packages
```bash
npm run build:server  # Backend build
npm run build:client  # Frontend build
```

### Start production server
```bash
npm start
```

## 📁 Project Structure

```
feexsystems-platform/
├── client/                 # React frontend
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── store/            # State management
│   ├── lib/              # Utility functions
│   └── global.css        # Global styles
├── server/                # Express.js backend
│   ├── lib/              # Core libraries
│   │   ├── services/     # Business logic services
│   │   ├── middleware/   # Express middleware
│   │   ├── validations/  # Input validation schemas
│   │   └── types/        # TypeScript type definitions
│   ├── routes/           # API route handlers
│   └── test/             # Backend tests
├── prisma/                # Database schema and migrations
├── docker/                # Docker configuration files
├── netlify/               # Netlify functions (if deploying)
└── shared/                # Shared types and utilities
```

## 🔧 Development Workflow

1. **Feature Development**
   - Create feature branch from `main`
   - Implement changes with tests
   - Update documentation
   - Submit pull request

2. **Testing**
   - Write unit tests for new features
   - Ensure all tests pass
   - Maintain good test coverage

3. **Code Quality**
   - Follow TypeScript best practices
   - Use ESLint and Prettier
   - Write clear commit messages

4. **Deployment**
   - Test in staging environment
   - Deploy to production
   - Monitor application health

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database credentials

**Redis Connection Error**
- Ensure Redis is running
- Check REDIS_URL in .env
- Verify Redis port configuration

**Port Already in Use**
- Check if services are already running
- Use different ports in .env
- Kill existing processes

**Build Errors**
- Clear node_modules and reinstall
- Check TypeScript configuration
- Verify all dependencies are installed

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

---

**Built with ❤️ by the FeexSystems Team** 