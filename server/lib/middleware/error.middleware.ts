import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR'
}

export interface ApiError {
  type: ErrorType;
  message: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId: string;
}

/**
 * Generate a unique request ID for error tracking
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Map error types to HTTP status codes
 */
function getStatusCode(errorType: ErrorType): number {
  const statusMap: Record<ErrorType, number> = {
    [ErrorType.VALIDATION_ERROR]: 400,
    [ErrorType.AUTHENTICATION_ERROR]: 401,
    [ErrorType.AUTHORIZATION_ERROR]: 403,
    [ErrorType.RATE_LIMIT_ERROR]: 429,
    [ErrorType.SERVICE_UNAVAILABLE]: 503,
    [ErrorType.PAYMENT_ERROR]: 402,
    [ErrorType.EXTERNAL_API_ERROR]: 502,
    [ErrorType.INTERNAL_SERVER_ERROR]: 500,
    [ErrorType.NOT_FOUND_ERROR]: 404
  };
  return statusMap[errorType] || 500;
}

/**
 * Transform various error types into a standardized ApiError format
 */
function transformError(error: Error): ApiError {
  const timestamp = new Date().toISOString();
  const requestId = generateRequestId();

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return {
      type: ErrorType.VALIDATION_ERROR,
      message: 'Validation failed',
      code: 'VALIDATION_FAILED',
      details: error.errors,
      timestamp,
      requestId
    };
  }

  // Handle Prisma database errors
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return {
        type: ErrorType.VALIDATION_ERROR,
        message: 'Unique constraint violation',
        code: 'UNIQUE_CONSTRAINT_VIOLATION',
        details: { fields: error.meta?.target },
        timestamp,
        requestId
      };
    }
    if (error.code === 'P2025') {
      return {
        type: ErrorType.NOT_FOUND_ERROR,
        message: 'Record not found',
        code: 'RECORD_NOT_FOUND',
        timestamp,
        requestId
      };
    }
  }

  // Handle custom auth errors
  if (error.name === 'AuthError') {
    return {
      type: ErrorType.AUTHENTICATION_ERROR,
      message: error.message,
      code: (error as any).code || 'AUTH_ERROR',
      timestamp,
      requestId
    };
  }

  // Default to internal server error
  return {
    type: ErrorType.INTERNAL_SERVER_ERROR,
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    timestamp,
    requestId
  };
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Transform the error into our standard format
  const apiError = transformError(error);
  
  // Log error for monitoring (you can integrate with your logging service here)
  console.error('[API Error]', {
    error: apiError,
    stack: error.stack,
    request: {
      method: req.method,
      url: req.url,
      userId: (req as any).user?.id,
      ip: req.ip
    }
  });

  // Send standardized error response
  res.status(getStatusCode(apiError.type)).json({
    success: false,
    error: apiError
  });
}

/**
 * Handle 404 Not Found errors
 */
export function notFoundHandler(req: Request, res: Response) {
  const apiError: ApiError = {
    type: ErrorType.NOT_FOUND_ERROR,
    message: 'Resource not found',
    code: 'RESOURCE_NOT_FOUND',
    timestamp: new Date().toISOString(),
    requestId: generateRequestId()
  };

  res.status(404).json({
    success: false,
    error: apiError
  });
}
