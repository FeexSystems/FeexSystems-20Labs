import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { 
  authenticate, 
  authorize, 
  requireEmailVerification,
  optionalAuthenticate,
  validateRequest,
  rateLimit
} from '../auth.middleware';
import { JWTService, TokenBlacklistService } from '../../auth';
import { UserService } from '../../services/user.service';

// Mock dependencies
vi.mock('../../auth');
vi.mock('../../s