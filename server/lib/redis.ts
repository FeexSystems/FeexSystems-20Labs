import Redis from 'ioredis';

let redis: Redis | null = null;

export function createRedisClient(): Redis {
  if (redis) {
    return redis;
  }

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  redis = new Redis(redisUrl, {
    enableReadyCheck: false,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    connectTimeout: 10000,
    commandTimeout: 5000,
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redis.on('error', (error) => {
    console.error('❌ Redis connection error:', error);
  });

  redis.on('close', () => {
    console.log('🔌 Redis connection closed');
  });

  return redis;
}

export function getRedisClient(): Redis {
  if (!redis) {
    return createRedisClient();
  }
  return redis;
}

// Cache utilities
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = getRedisClient();
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async increment(key: string, ttlSeconds?: number): Promise<number> {
    try {
      const result = await this.redis.incr(key);
      if (ttlSeconds && result === 1) {
        await this.redis.expire(key, ttlSeconds);
      }
      return result;
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  async getKeys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      console.error('Cache keys error:', error);
      return [];
    }
  }
}

// Session management
export class SessionService extends CacheService {
  private readonly SESSION_PREFIX = 'session:';
  private readonly SESSION_TTL = 24 * 60 * 60; // 24 hours

  async createSession(sessionId: string, userData: any): Promise<boolean> {
    return this.set(`${this.SESSION_PREFIX}${sessionId}`, userData, this.SESSION_TTL);
  }

  async getSession(sessionId: string): Promise<any | null> {
    return this.get(`${this.SESSION_PREFIX}${sessionId}`);
  }

  async updateSession(sessionId: string, userData: any): Promise<boolean> {
    return this.set(`${this.SESSION_PREFIX}${sessionId}`, userData, this.SESSION_TTL);
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return this.del(`${this.SESSION_PREFIX}${sessionId}`);
  }

  async extendSession(sessionId: string): Promise<boolean> {
    try {
      await this.redis.expire(`${this.SESSION_PREFIX}${sessionId}`, this.SESSION_TTL);
      return true;
    } catch (error) {
      console.error('Session extend error:', error);
      return false;
    }
  }
}

// Rate limiting
export class RateLimitService extends CacheService {
  private readonly RATE_LIMIT_PREFIX = 'rate_limit:';

  async checkRateLimit(
    identifier: string,
    windowMs: number,
    maxRequests: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `${this.RATE_LIMIT_PREFIX}${identifier}`;
    const windowSeconds = Math.ceil(windowMs / 1000);

    try {
      const current = await this.increment(key, windowSeconds);
      const remaining = Math.max(0, maxRequests - current);
      const resetTime = Date.now() + windowMs;

      return {
        allowed: current <= maxRequests,
        remaining,
        resetTime
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      // Allow request on error to prevent blocking users
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: Date.now() + windowMs
      };
    }
  }
}

// Health check
export async function checkRedisHealth() {
  try {
    const redis = getRedisClient();
    await redis.ping();
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

// Cleanup function
export async function disconnectRedis() {
  if (redis) {
    await redis.quit();
    redis = null;
    console.log('✅ Redis disconnected successfully');
  }
}