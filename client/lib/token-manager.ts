import { AuthTokens } from './auth-store';

interface TokenRefreshCallback {
  (): Promise<AuthTokens>;
}

interface TokenExpiredCallback {
  (): void;
}

class TokenManager {
  private static instance: TokenManager;
  private refreshTimer: NodeJS.Timeout | null = null;
  private refreshPromise: Promise<AuthTokens> | null = null;
  private refreshCallback: TokenRefreshCallback | null = null;
  private expiredCallback: TokenExpiredCallback | null = null;
  private isRefreshing = false;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Initialize the token manager with callbacks
   */
  initialize(
    refreshCallback: TokenRefreshCallback,
    expiredCallback: TokenExpiredCallback
  ) {
    this.refreshCallback = refreshCallback;
    this.expiredCallback = expiredCallback;
  }

  /**
   * Start automatic token refresh based on token expiration
   */
  startAutoRefresh(tokens: AuthTokens) {
    this.clearRefreshTimer();

    if (!tokens.accessToken || !tokens.expiresIn) {
      return;
    }

    // Calculate when to refresh (5 minutes before expiration)
    const refreshTime = (tokens.expiresIn * 1000) - (5 * 60 * 1000);
    const timeUntilRefresh = Math.max(refreshTime - Date.now(), 0);

    console.log(`🔄 Token refresh scheduled in ${Math.round(timeUntilRefresh / 1000 / 60)} minutes`);

    this.refreshTimer = setTimeout(() => {
      this.refreshTokens();
    }, timeUntilRefresh);
  }

  /**
   * Stop automatic token refresh
   */
  stopAutoRefresh() {
    this.clearRefreshTimer();
    this.refreshPromise = null;
    this.isRefreshing = false;
  }

  /**
   * Check if token is expired or about to expire
   */
  isTokenExpired(tokens: AuthTokens, bufferMinutes = 5): boolean {
    if (!tokens.accessToken || !tokens.expiresIn) {
      return true;
    }

    const expirationTime = tokens.expiresIn * 1000;
    const bufferTime = bufferMinutes * 60 * 1000;
    const now = Date.now();

    return now >= (expirationTime - bufferTime);
  }

  /**
   * Get valid access token, refreshing if necessary
   */
  async getValidAccessToken(currentTokens: AuthTokens | null): Promise<string | null> {
    if (!currentTokens?.accessToken) {
      return null;
    }

    // If token is not expired, return it
    if (!this.isTokenExpired(currentTokens)) {
      return currentTokens.accessToken;
    }

    // If token is expired, try to refresh
    try {
      const newTokens = await this.refreshTokens();
      return newTokens.accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }

  /**
   * Refresh tokens with deduplication
   */
  async refreshTokens(): Promise<AuthTokens> {
    // If already refreshing, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshCallback) {
      throw new Error('Token refresh callback not initialized');
    }

    this.isRefreshing = true;
    
    this.refreshPromise = this.refreshCallback()
      .then((newTokens) => {
        console.log('✅ Token refresh successful');
        this.isRefreshing = false;
        this.refreshPromise = null;
        
        // Schedule next refresh
        this.startAutoRefresh(newTokens);
        
        return newTokens;
      })
      .catch((error) => {
        console.error('❌ Token refresh failed:', error);
        this.isRefreshing = false;
        this.refreshPromise = null;
        
        // Call expired callback to logout user
        if (this.expiredCallback) {
          this.expiredCallback();
        }
        
        throw error;
      });

    return this.refreshPromise;
  }

  /**
   * Handle API request with automatic token refresh retry
   */
  async makeAuthenticatedRequest<T>(
    requestFn: (token: string) => Promise<T>,
    currentTokens: AuthTokens | null,
    maxRetries = 1
  ): Promise<T> {
    let attempts = 0;
    
    while (attempts <= maxRetries) {
      try {
        const token = await this.getValidAccessToken(currentTokens);
        
        if (!token) {
          throw new Error('No valid access token available');
        }

        return await requestFn(token);
      } catch (error: any) {
        attempts++;
        
        // If it's a 401 error and we haven't exceeded max retries, try to refresh
        if (error.status === 401 && attempts <= maxRetries) {
          console.log(`🔄 Received 401, attempting token refresh (attempt ${attempts}/${maxRetries + 1})`);
          
          try {
            const newTokens = await this.refreshTokens();
            currentTokens = newTokens;
            continue; // Retry with new token
          } catch (refreshError) {
            console.error('Token refresh failed during retry:', refreshError);
            throw refreshError;
          }
        }
        
        // If not a 401 or exceeded retries, throw the error
        throw error;
      }
    }
    
    throw new Error('Max retry attempts exceeded');
  }

  /**
   * Get time until token expiration in minutes
   */
  getTimeUntilExpiration(tokens: AuthTokens): number | null {
    if (!tokens.expiresIn) {
      return null;
    }

    const expirationTime = tokens.expiresIn * 1000;
    const now = Date.now();
    const timeLeft = expirationTime - now;

    return Math.max(0, Math.round(timeLeft / 1000 / 60));
  }

  /**
   * Check if refresh is currently in progress
   */
  get isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
  }

  private clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();

// Utility functions
export const isTokenExpired = (tokens: AuthTokens | null, bufferMinutes = 5): boolean => {
  if (!tokens) return true;
  return tokenManager.isTokenExpired(tokens, bufferMinutes);
};

export const getValidAccessToken = async (tokens: AuthTokens | null): Promise<string | null> => {
  return tokenManager.getValidAccessToken(tokens);
};

export const makeAuthenticatedRequest = async <T>(
  requestFn: (token: string) => Promise<T>,
  tokens: AuthTokens | null,
  maxRetries = 1
): Promise<T> => {
  return tokenManager.makeAuthenticatedRequest(requestFn, tokens, maxRetries);
};