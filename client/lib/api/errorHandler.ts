import { logError } from '../logging/sentry';

export class APIError extends Error {
  status: number;
  code?: string;
  details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const handleAPIError = (error: any): never => {
  const status = error.response?.status || 500;
  const data = error.response?.data as any;
  
  // Create structured error object
  const apiError = new APIError(
    data?.message || error.message || 'An unexpected error occurred',
    status,
    data?.code,
    data?.details
  );

  // Log to Sentry with context
  logError(apiError, {
    endpoint: error.config?.url,
    method: error.config?.method,
    requestData: error.config?.data,
    responseData: error.response?.data,
  });

  throw apiError;
};
