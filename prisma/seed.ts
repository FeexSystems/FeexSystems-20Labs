import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@feexsystems.com' },
    update: {},
    create: {
      email: 'admin@feexsystems.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create test user
  const testPassword = await bcrypt.hash('test123', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@feexsystems.com' },
    update: {},
    create: {
      email: 'test@feexsystems.com',
      passwordHash: testPassword,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
      emailVerified: true,
    },
  });

  console.log('✅ Created test user:', testUser.email);

  // Create sample team
  const team = await prisma.team.upsert({
    where: { id: 'sample-team-id' },
    update: {},
    create: {
      id: 'sample-team-id',
      name: 'Sample Team',
      description: 'A sample team for testing collaboration features',
    },
  });

  console.log('✅ Created sample team:', team.name);

  // Add users to team
  await prisma.teamMember.upsert({
    where: { 
      teamId_userId: {
        teamId: team.id,
        userId: admin.id
      }
    },
    update: {},
    create: {
      teamId: team.id,
      userId: admin.id,
      role: 'OWNER',
    },
  });

  await prisma.teamMember.upsert({
    where: { 
      teamId_userId: {
        teamId: team.id,
        userId: testUser.id
      }
    },
    update: {},
    create: {
      teamId: team.id,
      userId: testUser.id,
      role: 'MEMBER',
    },
  });

  console.log('✅ Added users to sample team');

  // Create sample workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: 'sample-workspace-id' },
    update: {},
    create: {
      id: 'sample-workspace-id',
      teamId: team.id,
      name: 'Development Workspace',
      description: 'Main development workspace for the team',
      settings: {
        theme: 'dark',
        notifications: true,
        autoSave: true,
      },
    },
  });

  console.log('✅ Created sample workspace:', workspace.name);

  // Create sample usage metrics
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  
  await prisma.usageMetrics.upsert({
    where: {
      userId_period: {
        userId: testUser.id,
        period: currentMonth
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      period: currentMonth,
      aiRequestsCount: 25,
      deploymentCount: 5,
      securityScansCount: 3,
      storageUsed: BigInt(1024 * 1024 * 100), // 100MB
      bandwidthUsed: BigInt(1024 * 1024 * 500), // 500MB
    },
  });

  console.log('✅ Created sample usage metrics');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });