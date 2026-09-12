/**
 * Auth Seeder — FeexSystems Living Intelligence
 *
 * Seeds initial admin and test user accounts for local/staging authentication.
 * Uses upsert so it is safe to run repeatedly.
 *
 * Usage:
 *   npx tsx prisma/seed-auth.ts
 */
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting auth seeding...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@feexsystems.com';
  const adminRawPassword = process.env.ADMIN_PASSWORD || 'Admin123!Secure';
  const adminPasswordHash = await bcrypt.hash(adminRawPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {
      role: UserRole.ADMIN,
      emailVerified: true,
    },
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'FeexSystems',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email} (Role: ${admin.role})`);

  const testEmail = process.env.TEST_EMAIL || 'engineer@feexsystems.com';
  const testRawPassword = process.env.TEST_PASSWORD || 'Engineer123!Secure';
  const testPasswordHash = await bcrypt.hash(testRawPassword, 12);

  const testUser = await prisma.user.upsert({
    where: { email: testEmail.toLowerCase() },
    update: {
      role: UserRole.USER,
      emailVerified: true,
    },
    create: {
      email: testEmail.toLowerCase(),
      passwordHash: testPasswordHash,
      firstName: 'Test',
      lastName: 'Engineer',
      role: UserRole.USER,
      emailVerified: true,
    },
  });

  console.log(`✅ Test user seeded: ${testUser.email} (Role: ${testUser.role})`);
  console.log('🎉 Auth seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Auth seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
