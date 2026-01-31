import { tokenManager } from './token-manager';
import { AuthTokens } from './auth-store';

interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
}

interface RequestConfig extends RequestInit {
  timeout?: number;
  requireAuth?: boolean;
  skipCSRF?: boolean; // Skip CSRF for GET requests by default
}

interface ApiError extends Error {
  status: number;
  code?: string;
  details?: any;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private getTokens: (() => AuthTokens | null) | null = null;
  private errorReporter: ((error: ApiError) => void) | null = null;
  private csrfToken: string | null = null;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || '/api';
    this.timeout = config.timeout || 30000;
    this.initCSRFToken();
  }

  /**
   * Initialize CSRF token from meta tag or cookie
   */
  private initCSRFToken() {
    // Try to get CSRF token from meta tag
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      this.csrfToken = metaTag.getAttribute('content');
    }

    // Fallback to cookie
    if (!this.csrfToken) {
      const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
      if (match) {
        this.csrfToken = decodeURIComponent(match[1]);
      }
    }
  }

  /**
   * Initialize the API client with token getter and error reporter
   */
  initialize(getTokens: () => AuthTokens | null, errorReporter?: (error: ApiError) => void) {
    this.getTokens = getTokens;
    this.errorReporter = errorReporter || null;
  }

  /**
   * Make an HTTP request with automatic token refresh
   */
  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      timeout = this.timeout,
      requireAuth = true,
      headers = {},
      ...requestConfig
    } = config;

    const url = `${this.baseURL}${endpoint}`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      let requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers as Record<string, string>,
      };

      // Add CSRF token for state-changing methods
      const isStateMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(requestConfig.method || 'GET');
      if (isStateMutating && this.csrfToken && !config.skipCSRF) {
        requestHeaders['X-CSRF-Token'] = this.csrfToken;
      }

      // Add authorization header if auth is required
      if (requireAuth && this.getTokens) {
        const tokens = this.getTokens();

        if (tokens) {
          // Use token manager to get valid token (with automatic refresh)
          const validToken = await tokenManager.getValidAccessToken(tokens);

          if (validToken) {
            requestHeaders = {
              ...requestHeaders,
              Authorization: `Bearer ${validToken}`,
            };
          } else if (requireAuth) {
            throw new Error('No valid access token available');
          }
        } else if (requireAuth) {
          throw new Error('Authentication required but no tokens available');
        }
      }

      const response = await fetch(url, {
        ...requestConfig,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle different response types
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (!contentType || response.status === 204) {
        return {} as T;
      }

      // Parse JSON response
      if (contentType.includes('application/json')) {
        return await response.json();
      }

      // Return text for non-JSON responses
      return (await response.text()) as unknown as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw error;
    }
  }

  /**
   * Handle error responses
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorCode: string | undefined;
    let errorDetails: any;

    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorCode = errorData.code;
        errorDetails = errorData.details;
      }
    } catch (parseError) {
      // If we can't parse the error response, use the default message
    }

    const apiError = new Error(errorMessage) as ApiError;
    apiError.status = response.status;
    apiError.code = errorCode;
    apiError.details = errorDetails;

    // Report error to monitoring service if configured
    if (this.errorReporter) {
      try {
        this.errorReporter(apiError);
      } catch (reportError) {
        console.error('Error reporting failed:', reportError);
      }
    }

    // Special handling for rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      if (retryAfter) {
        apiError.details = { ...errorDetails, retryAfter };
      }
    }

    throw apiError;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config: Omit<RequestConfig, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config: Omit<RequestConfig, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config: Omit<RequestConfig, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Upload file
   */
  async upload<T>(
    endpoint: string,
    file: File,
    fieldName = 'file',
    config: Omit<RequestConfig, 'method' | 'body' | 'headers'> = {}
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
    });
  }

  /**
   * Make request with retry logic for token refresh
   */
  async requestWithRetry<T>(
    requestFn: () => Promise<T>,
    maxRetries = 1
  ): Promise<T> {
    if (!this.getTokens) {
      return requestFn();
    }

    const tokens = this.getTokens();

    return tokenManager.makeAuthenticatedRequest(
      async (token) => {
        // Update the authorization header for this request
        return requestFn();
      },
      tokens,
      maxRetries
    );
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export types
export type { ApiError, RequestConfig };

// Utility function to check if error is an API error
export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.status === 'number';
};

// Utility function to handle common API errors
export const handleApiError = (error: any): string => {
  if (isApiError(error)) {
    switch (error.status) {
      case 400:
        return error.message || 'Bad request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return error.message || 'A conflict occurred. The resource may already exist.';
      case 422:
        return error.message || 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'An internal server error occurred. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return error.message || `An error occurred (${error.status}).`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};