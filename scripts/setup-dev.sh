#!/bin/bash

# FeexSystems Platform Development Setup Script
# This script sets up the development environment for the FeexSystems platform

set -e

echo "🚀 Setting up FeexSystems Platform Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Some features may not work."
    echo "   Please install Docker and Docker Compose for full functionality."
else
    echo "✅ Docker version: $(docker --version)"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  Docker Compose is not installed. Some features may not work."
    echo "   Please install Docker Compose for full functionality."
else
    echo "✅ Docker Compose version: $(docker-compose --version)"
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ .env file created from env.example"
        echo "⚠️  Please update .env file with your actual configuration values"
    else
        echo "⚠️  env.example not found. Please create .env file manually."
    fi
else
    echo "✅ .env file already exists"
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
cd server
npx prisma generate
cd ..

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads
mkdir -p public/uploads

# Set up Git hooks (if git is available)
if command -v git &> /dev/null; then
    echo "🔧 Setting up Git hooks..."
    if [ -d .git ]; then
        # Create pre-commit hook
        mkdir -p .git/hooks
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."
npm run lint
npm run test
EOF
        chmod +x .git/hooks/pre-commit
        echo "✅ Git pre-commit hook created"
    fi
else
    echo "⚠️  Git not found. Skipping Git hooks setup."
fi

# Create development database (if Docker is available)
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Setting up development database..."
    echo "   This will start PostgreSQL and Redis containers..."
    echo "   Press Ctrl+C to cancel, or wait for setup to complete..."
    
    # Start only database services
    docker-compose up -d postgres redis
    
    echo "⏳ Waiting for database to be ready..."
    sleep 10
    
    # Run database migrations
    echo "🗄️  Running database migrations..."
    cd server
    npx prisma migrate deploy
    cd ..
    
    # Seed database
    echo "🌱 Seeding database..."
    cd server
    npx prisma db seed
    cd ..
    
    echo "✅ Database setup completed"
else
    echo "⚠️  Docker not available. Please set up PostgreSQL and Redis manually."
    echo "   Then run: npm run db:migrate && npm run db:seed"
fi

echo ""
echo "🎉 FeexSystems Platform Development Environment Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration values"
echo "2. Start the development environment:"
echo "   - With Docker: npm run docker:up"
echo "   - Without Docker: npm run dev"
echo ""
echo "Access your application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000"
echo "   - Database: localhost:5432"
echo "   - Redis: localhost:6379"
echo ""
echo "Happy coding! 🚀" 