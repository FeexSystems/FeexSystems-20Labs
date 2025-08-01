// Export all services
export * from './user.service';
export * from './session.service';
export * from './auth.service';

// Service factory for dependency injection
import { PrismaClient } from '@prisma/client';
import { UserService } from './user.service';
import { SessionService } from './session.service';
import { AuthService } from './auth.service';

export class ServiceFactory {
  private static instance: ServiceFactory;
  private prisma: PrismaClient;
  private userService: UserService;
  private sessionService: SessionService;
  private authService: AuthService;

  private constructor() {
    this.prisma = new PrismaClient();
    this.userService = new UserService(this.prisma);
    this.sessionService = new SessionService(this.prisma);
    this.authService = new AuthService(this.prisma);
  }

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  getUserService(): UserService {
    return this.userService;
  }

  getSessionService(): SessionService {
    return this.sessionService;
  }

  getAuthService(): AuthService {
    return this.authService;
  }

  getPrisma(): PrismaClient {
    return this.prisma;
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Convenience function to get services
export function getServices() {
  const factory = ServiceFactory.getInstance();
  return {
    userService: factory.getUserService(),
    sessionService: factory.getSessionService(),
    authService: factory.getAuthService(),
    prisma: factory.getPrisma(),
  };
}