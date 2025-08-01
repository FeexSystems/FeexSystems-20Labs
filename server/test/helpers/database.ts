import { PrismaClient } from '@prisma/client';

let testPrisma: PrismaClient | null = null;

export async function createTestDatabase(): Promise<PrismaClient> {
  if (testPrisma) {
    return testPrisma;
  }

  // Use a test database URL or in-memory database
  const databaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('TEST_DATABASE_URL or DATABASE_URL must be set for testing');
  }

  testPrisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'test' ? [] : ['error'],
  });

  await testPrisma.$connect();
  return testPrisma;
}

export async function cleanupTestDatabase(prisma: PrismaClient): Promise<void> {
  // Clean up all test data
  await prisma.refreshToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.aIRequest.deleteMany();
  await prisma.deployment.deleteMany();
  await prisma.pipeline.deleteMany();
  await prisma.repository.deleteMany();
  await prisma.securityScan.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();
  
  await prisma.$disconnect();
  testPrisma = null;
}

export async function createTestUser(prisma: PrismaClient, userData?: Partial<{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
}>) {
  const { AuthService } = await import('../../lib/services/auth.service');
  const authService = new AuthService(prisma);

  const defaultUserData = {
    email: 'test@example.com',
    password: 'SecurePass123!',
    firstName: 'Test',
    lastName: 'User',
    ...userData,
  };

  return authService.register(defaultUserData);
}

export async function createTestUsers(prisma: PrismaClient, count: number = 3) {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const user = await createTestUser(prisma, {
      email: `test${i + 1}@example.com`,
      firstName: `Test${i + 1}`,
      lastName: `User${i + 1}`,
    });
    users.push(user);
  }
  
  return users;
}