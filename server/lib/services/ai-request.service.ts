import { PrismaClient } from '@prisma/client';
import { AIRequest, AIResponse, AIRequestStatus } from '../types/ai';
import { prisma } from '../database';

/**
 * AI Request Service - Handles database operations for AI requests
 */
export class AIRequestService {
  constructor(private db: PrismaClient = prisma) {}

  /**
   * Create a new AI request
   */
  async createRequest(data: {
    userId: string;
    serviceId: string;
    input: any;
    parameters?: Record<string, any>;
    priority?: 'low' | 'normal' | 'high';
  }): Promise<AIRequest> {
    const request = await this.db.aIRequest.create({
      data: {
        userId: data.userId,
        serviceId: data.serviceId,
        inputData: data.input,
        metadata: {
          parameters: data.parameters || {},
          priority: data.priority || 'normal',
          createdAt: new Date().toISOString()
        },
        status: 'PENDING'
      }
    });

    return this.mapPrismaToAIRequest(request);
  }

  /**
   * Get AI request by ID
   */
  async getRequest(requestId: string): Promise<AIRequest | null> {
    const request = await this.db.aIRequest.findUnique({
      where: { id: requestId }
    });

    return request ? this.mapPrismaToAIRequest(request) : null;
  }

  /**
   * Get AI requests for a user
   */
  async getUserRequests(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: AIRequestStatus;
      serviceId?: string;
    } = {}
  ): Promise<{ requests: AIRequest[]; total: number }> {
    const where = {
      userId,
      ...(options.status && { status: options.status.toUpperCase() as any }),
      ...(options.serviceId && { serviceId: options.serviceId })
    };

    const [requests, total] = await Promise.all([
      this.db.aIRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options.limit || 50,
        skip: options.offset || 0
      }),
      this.db.aIRequest.count({ where })
    ]);

    return {
      requests: requests.map(this.mapPrismaToAIRequest),
      total
    };
  }

  /**
   * Update request status
   */
  async updateRequestStatus(
    requestId: string,
    status: AIRequestStatus,
    metadata?: Record<string, any>
  ): Promise<void> {
    const updateData: any = {
      status: status.toUpperCase(),
      updatedAt: new Date()
    };

    if (status === 'processing') {
      updateData.startedAt = new Date();
    } else if (status === 'completed' || status === 'failed') {
      updateData.completedAt = new Date();
    }

    if (metadata) {
      // Merge with existing metadata
      const existing = await this.db.aIRequest.findUnique({
        where: { id: requestId },
        select: { metadata: true }
      });

      updateData.metadata = {
        ...(existing?.metadata as Record<string, any> || {}),
        ...metadata
      };
    }

    await this.db.aIRequest.update({
      where: { id: requestId },
      data: updateData
    });
  }

  /**
   * Complete an AI request with response data
   */
  async completeRequest(
    requestId: string,
    response: Omit<AIResponse, 'id' | 'createdAt'>
  ): Promise<void> {
    await this.db.aIRequest.update({
      where: { id: requestId },
      data: {
        status: 'COMPLETED',
        outputData: response.result,
        processingTime: response.metadata.processingTime,
        tokensUsed: response.metadata.tokensUsed,
        completedAt: new Date(),
        metadata: {
          ...response.metadata,
          responseStatus: response.status
        }
      }
    });
  }

  /**
   * Get request statistics for a user
   */
  async getUserRequestStats(
    userId: string,
    period: 'hour' | 'day' | 'week' | 'month' = 'day'
  ): Promise<{
    total: number;
    completed: number;
    failed: number;
    pending: number;
    processing: number;
    tokensUsed: number;
  }> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'hour':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const requests = await this.db.aIRequest.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate
        }
      },
      select: {
        status: true,
        tokensUsed: true
      }
    });

    const stats = {
      total: requests.length,
      completed: 0,
      failed: 0,
      pending: 0,
      processing: 0,
      tokensUsed: 0
    };

    requests.forEach(request => {
      switch (request.status) {
        case 'COMPLETED':
          stats.completed++;
          break;
        case 'FAILED':
          stats.failed++;
          break;
        case 'PENDING':
          stats.pending++;
          break;
        case 'PROCESSING':
          stats.processing++;
          break;
      }

      if (request.tokensUsed) {
        stats.tokensUsed += request.tokensUsed;
      }
    });

    return stats;
  }

  /**
   * Check if user has exceeded rate limits
   */
  async checkRateLimit(
    userId: string,
    serviceId: string,
    limits: { maxRequestsPerHour: number; maxRequestsPerDay: number }
  ): Promise<{ allowed: boolean; reason?: string }> {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [hourlyCount, dailyCount] = await Promise.all([
      this.db.aIRequest.count({
        where: {
          userId,
          serviceId,
          createdAt: { gte: hourAgo }
        }
      }),
      this.db.aIRequest.count({
        where: {
          userId,
          serviceId,
          createdAt: { gte: dayAgo }
        }
      })
    ]);

    if (hourlyCount >= limits.maxRequestsPerHour) {
      return {
        allowed: false,
        reason: `Hourly limit of ${limits.maxRequestsPerHour} requests exceeded`
      };
    }

    if (dailyCount >= limits.maxRequestsPerDay) {
      return {
        allowed: false,
        reason: `Daily limit of ${limits.maxRequestsPerDay} requests exceeded`
      };
    }

    return { allowed: true };
  }

  /**
   * Delete old requests (cleanup)
   */
  async cleanupOldRequests(olderThanDays: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await this.db.aIRequest.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        },
        status: {
          in: ['COMPLETED', 'FAILED']
        }
      }
    });

    return result.count;
  }

  /**
   * Map Prisma AI request to our AI request type
   */
  private mapPrismaToAIRequest(prismaRequest: any): AIRequest {
    return {
      id: prismaRequest.id,
      userId: prismaRequest.userId,
      serviceId: prismaRequest.serviceId,
      input: prismaRequest.inputData,
      parameters: prismaRequest.metadata?.parameters || {},
      priority: prismaRequest.metadata?.priority || 'normal',
      status: prismaRequest.status.toLowerCase() as AIRequestStatus,
      createdAt: prismaRequest.createdAt,
      startedAt: prismaRequest.startedAt || undefined,
      completedAt: prismaRequest.completedAt || undefined
    };
  }
}

// Singleton instance
export const aiRequestService = new AIRequestService();