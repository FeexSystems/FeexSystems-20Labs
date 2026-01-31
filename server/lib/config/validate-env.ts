import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  REDIS_URL: z.string().url(),
  CORS_ORIGIN: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  AI_SERVICE_API_KEY: z.string().optional(),
  AI_SERVICE_URL: z.string().url().optional(),
  PORT: z.string().optional(),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error('❌ Invalid environment variables:', result.error.format());
    process.exit(1);
  }
}
