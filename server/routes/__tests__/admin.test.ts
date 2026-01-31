import request from 'supertest';
import { createServer } from '../../index';
import { PrismaClient, UserRole } from '@prisma/client';

const app = createServer();
const prisma = new PrismaClient();

// Mock authentication middleware
jest.mock('../../lib/middleware/auth.middleware', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = {
      id: 'admin-user-id',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    };
    next();
  }
}));

// Mock admin service
jest.mock('../../lib/services/admin.service', () => ({
  AdminService: jest.fn().mockImplementation(() => ({
    getDashboardMetrics: jest.fn().mockResolvedValue({
      systemHealth: {
        status: 'healthy',
        database: 'healthy',
        redis: 'healthy',
        uptime: 3600,
        memoryUsage: { rss: 100000000, heapTotal: 50000000, heapUsed: 30000000, external: 5000000, arrayBuffers: 1000000 },
        cpuUsage: { user: 1000000, system: 500000 }
      },
      userMetrics: {
        totalUsers: 100,
        activeUsers: 80,
        newUsersToday: 5,
        newUsersThisWeek: 25,
        usersByRole: { USER: 90, ADMIN: 8, SUPER_ADMIN: 2 }
      },
      subscriptionMetrics: {
        totalSubscriptions: 50,
        activeSubscriptions: 45,
        revenue: { monthly: 5000, yearly: 60000, currency: 'USD' },
        planDistribution: []
      },
      usageMetrics: {
        aiRequests: 1000,
        deployments: 200,
        securityScans: 150,
        storage: 1000000000,
        bandwidth: 5000000000
      },
      securityMetrics: {
        totalScans: 150,
        criticalVulnerabilities: 5,
        highVulnerabilities: 15,
        scanSuccessRate: 95.5
      }
    }),
    getUserAnalytics: jest.fn().mockResolvedValue({
      users: [],
      total: 0,
      analytics: { registrationTrends: [], roleDistribution: {} }
    }),
    updateUserRole: jest.fn().mockResolvedValue({
      success: true,
      user: { id: 'user-id', email: 'user@example.com', role: 'USER' }
    }),
    getSecurityReport: jest.fn().mockResolvedValue({
      overview: { totalScans: 100, completedScans: 95, failedScans: 5, successRate: 95 },
      vulnerabilities: { critical: 2, high: 8, medium: 15, low: 25, info: 10 },
      trends: [],
      topVulnerabilities: []
    }),
    getAdminAuditLogs: jest.fn().mockResolvedValue({
      logs: [],
      total: 0
    })
  }))
}));

describe('Admin API', () => {
  beforeAll(async () => {
    // Setup test database if needed
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/admin/metrics', () => {
    it('should return dashboard metrics for admin user', async () => {
      const response = await request(app)
        .get('/api/admin/metrics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.metrics).toBeDefined();
      expect(response.body.metrics.systemHealth).toBeDefined();
      expect(response.body.metrics.userMetrics).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/admin/users', () => {
    it('should return user analytics', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.users).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      expect(response.body.analytics).toBeDefined();
    });

    it('should validate query parameters', async () => {
      const response = await request(app)
        .get('/api/admin/users?page=0')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('VALIDATION_ERROR');
    });
  });

  describe('PUT /api/admin/users/:id/role', () => {
    it('should validate role update request', async () => {
      const response = await request(app)
        .put('/api/admin/users/user-id/role')
        .send({ role: 'INVALID_ROLE' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('VALIDATION_ERROR');
    });

    it('should update user role successfully', async () => {
      const response = await request(app)
        .put('/api/admin/users/user-id/role')
        .send({ role: 'USER' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
    });
  });

  describe('GET /api/admin/security', () => {
    it('should return security analytics', async () => {
      const response = await request(app)
        .get('/api/admin/security')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.report).toBeDefined();
      expect(response.body.report.overview).toBeDefined();
      expect(response.body.report.vulnerabilities).toBeDefined();
    });
  });

  describe('GET /api/admin/audit-logs', () => {
    it('should return audit logs', async () => {
      const response = await request(app)
        .get('/api/admin/audit-logs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.logs).toBeDefined();
      expect(response.body.pagination).toBeDefined();
    });

    it('should validate query parameters', async () => {
      const response = await request(app)
        .get('/api/admin/audit-logs?limit=200')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/admin/permissions', () => {
    it('should return admin permissions', async () => {
      const response = await request(app)
        .get('/api/admin/permissions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.permissions).toBeDefined();
      expect(response.body.role).toBeDefined();
    });
  });

  describe('GET /api/admin/system/health', () => {
    it('should return system health status', async () => {
      const response = await request(app)
        .get('/api/admin/system/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.systemHealth).toBeDefined();
      expect(response.body.systemHealth.status).toBeDefined();
    });
  });
});