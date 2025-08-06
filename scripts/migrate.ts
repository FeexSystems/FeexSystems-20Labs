#!/usr/bin/env tsx

import 'dotenv/config';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

const PRISMA_SCHEMA_PATH = path.join(process.cwd(), 'prisma', 'schema.prisma');

function runCommand(command: string, description: string) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error);
    process.exit(1);
  }
}

function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');
  
  if (!existsSync(PRISMA_SCHEMA_PATH)) {
    console.error('❌ Prisma schema not found at:', PRISMA_SCHEMA_PATH);
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('💡 Please set DATABASE_URL in your .env file');
    process.exit(1);
  }

  console.log('✅ Prerequisites check passed');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'deploy';

  console.log('🚀 Starting database migration process...');
  
  checkPrerequisites();

  switch (command) {
    case 'init':
      // Initialize Prisma (first time setup)
      runCommand('npx prisma generate', 'Generating Prisma client');
      runCommand('npx prisma db push', 'Pushing schema to database');
      runCommand('npx prisma db seed', 'Seeding database with initial data');
      break;

    case 'reset':
      // Reset database (development only)
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ Database reset is not allowed in production');
        process.exit(1);
      }
      runCommand('npx prisma db push --force-reset', 'Resetting database');
      runCommand('npx prisma generate', 'Generating Prisma client');
      runCommand('npx prisma db seed', 'Seeding database with initial data');
      break;

    case 'migrate':
      // Create and apply migration
      const migrationName = args[1] || `migration_${Date.now()}`;
      runCommand(`npx prisma migrate dev --name ${migrationName}`, 'Creating and applying migration');
      break;

    case 'deploy':
      // Deploy migrations (production)
      runCommand('npx prisma migrate deploy', 'Deploying migrations');
      runCommand('npx prisma generate', 'Generating Prisma client');
      break;

    case 'seed':
      // Seed database only
      runCommand('npx prisma db seed', 'Seeding database');
      break;

    case 'studio':
      // Open Prisma Studio
      runCommand('npx prisma studio', 'Opening Prisma Studio');
      break;

    case 'status':
      // Check migration status
      runCommand('npx prisma migrate status', 'Checking migration status');
      break;

    default:
      console.log(`
📖 Database Migration Tool

Usage: npm run migrate [command]

Commands:
  init      Initialize database (first time setup)
  reset     Reset database (development only)
  migrate   Create and apply new migration
  deploy    Deploy migrations (production)
  seed      Seed database with initial data
  studio    Open Prisma Studio
  status    Check migration status

Examples:
  npm run migrate init
  npm run migrate reset
  npm run migrate migrate add_user_preferences
  npm run migrate deploy
  npm run migrate seed
      `);
      break;
  }

  console.log('🎉 Migration process completed successfully!');
}

main().catch((error) => {
  console.error('❌ Migration process failed:', error);
  process.exit(1);
});