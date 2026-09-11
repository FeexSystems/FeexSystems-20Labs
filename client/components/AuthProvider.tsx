import { ReactNode, useEffect, useState, useCallback } from 'react';
import { AuthStoreProvider, useAuthStore } from '@/lib/auth-store';
import { tokenManager } from '@/lib/token-manager';
import { SessionTimeoutWarning } from './SessionTimeoutWarning';

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProviderInner({ children }: AuthProviderProps) {
  const { isAuthenticated, tokens, refreshToken, logout } = useAuthStore();
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [warningSeconds, setWarningSeconds] = useState(120); // 2 minutes default

  // Handle timeout warning callback
  const handleTimeoutWarning = useCallback((secondsRemaining: number) => {
    console.log(`⚠️ Showing session timeout warning: ${secondsRemaining} seconds remaining`);
    setWarningSeconds(secondsRemaining);
    setShowTimeoutWarning(true);
  }, []);

  // Handle "Stay Logged In" action
  const handleStayLoggedIn = useCallback(async () => {
    try {
      await refreshToken();
      setShowTimeoutWarning(false);
    } catch (error) {
      console.error('Failed to refresh token from timeout warning:', error);
      // If refresh fails, let the warning continue until auto-logout
    }
  }, [refreshToken]);

  // Handle logout from warning
  const handleLogoutFromWarning = useCallback(() => {
    setShowTimeoutWarning(false);
    logout();
  }, [logout]);

  useEffect(() => {
    // Initialize token manager with callbacks
    tokenManager.initialize(
      refreshToken as any,
      logout,
      handleTimeoutWarning,
      120 // Warn 2 minutes before expiration
    );

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
      {/* Show session timeout warning */}
      <SessionTimeoutWarning
        remainingSeconds={warningSeconds}
        isOpen={showTimeoutWarning && isAuthenticated}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleLogoutFromWarning}
        onClose={() => setShowTimeoutWarning(false)}
      />
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