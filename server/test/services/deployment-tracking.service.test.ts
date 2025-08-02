import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { DeploymentTrackingService } from '../../lib/services/deployment-tr