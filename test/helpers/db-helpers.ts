import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { db } from '../../server/lib/database';

/**
 * Reset the test database to a clean state
 */
export async function resetTestDatabase() {
  try {
    // Run migrations
    execSync('npx prisma migrate reset --force');
    
    // Clean up any remaining data
    const tables = await getTables();
    for (const table of tables) {
      await db.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
    }
  } catch (error) {
    console.error('Failed to reset test database:', error);
    throw error;
  }
}

/**
 * Get all table names from the database
 */
async function getTables() {
  const result = await db.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  `;
  return result.map(({ tablename }) => tablename);
}

/**
 * Create a test database connection
 */
export function createTestDatabase() {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL
      }
    }
  });
}

/**
 * Generate test data for a specific model
 */
export function generateTestData(model: string, count: number = 1) {
  const data: Record<string, any>[] = [];
  
  for (let i = 0; i < count; i++) {
    switch (model) {
      case 'user':
        data.push({
          email: `test${i}@example.com`,
          passwordHash: 'hashed-password',
          firstName: `Test${i}`,
          lastName: 'User',
          role: 'USER'
        });
        break;
      
      case 'subscription':
        data.push({
          planId: 'test-plan',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        break;
      
      // Add more models as needed
    }
  }
  
  return count === 1 ? data[0] : data;
}
