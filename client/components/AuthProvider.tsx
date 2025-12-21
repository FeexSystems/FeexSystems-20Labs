import { ReactNode, useEffect } from 'react';
import { AuthStoreProvider, useAuthStore } from '@/lib/auth-store';
import { tokenManager } from '@/lib/token-manager';
import { TokenExpirationWarning } from './TokenExpirationWarning';

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProviderInner({ children }: AuthProviderProps) {
  const { isAuthenticated, tokens, refreshToken } = useAuthStore();

  useEffect(() => {
    // Initialize authentication check on app start
    const initializeAuth = async () => {
      if (isAuthenticated && tokens?.accessToken) {
        try {
          // Check if token is expired and needs refresh
          if (tokenManager.isTokenExpired(tokens)) {
            console.log('🔄 Token expired on app start, refreshing...');
            await refreshToken();
          } else {
            // Start auto refresh for valid tokens
            tokenManager.startAutoRefresh(tokens);
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          // Token refresh failed, user will be logged out by the store
        }
      }
    };

    initializeAuth();
  }, []); // Only run on mount

  // Handle browser tab visibility changes to refresh tokens when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isAuthenticated && tokens) {
        // Check if token needs refresh when tab becomes visible
        if (tokenManager.isTokenExpired(tokens, 10)) { // 10 minute buffer
          try {
            console.log('🔄 Refreshing token on tab visibility change...');
            await refreshToken();
          } catch (error) {
            console.error('Token refresh on visibility change failed:', error);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, tokens, refreshToken]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = async () => {
      if (isAuthenticated && tokens) {
        // When coming back online, check token validity
        if (tokenManager.isTokenExpired(tokens, 10)) { // 10 minute buffer
          try {
            console.log('🔄 Refreshing token on reconnect...');
            await refreshToken();
          } catch (error) {
            console.error('Token refresh on reconnect failed:', error);
          }
        }
      }
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [isAuthenticated, tokens, refreshToken]);

  return (
    <>
      {children}
      {/* Show token expiration warning for authenticated users */}
      {isAuthenticated && <TokenExpirationWarning />}
    </>
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <AuthStoreProvider>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </AuthStoreProvider>
  );
}