// Temporary implementation without Zustand - will be replaced when Zustand is available
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { tokenManager } from './token-manager';
import { apiClient } from './api-client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  profileImageUrl?: string;
  emailVerified: boolean;
  subscription?: {
    id: string;
    status: string;
    planId: string;
    currentPeriodEnd: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Unix timestamp in milliseconds
  tokenType?: string;
}

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  validateResetToken: (token: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string>;
}

type AuthStore = AuthState & AuthActions;

// Context for auth state
const AuthContext = createContext<AuthStore | null>(null);

// Hook to use auth context
export const useAuthStore = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthStore must be used within AuthStoreProvider');
  }
  return context;
};

// Provider component
export function AuthStoreProvider({ children }: { children: ReactNode }) {
  // Load initial state from localStorage
  const getInitialState = (): AuthState => {
    try {
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          user: parsed.user || null,
          tokens: parsed.tokens || null,
          isAuthenticated: parsed.isAuthenticated || false,
          isLoading: false,
          error: null,
        };
      }
    } catch (error) {
      console.error('Failed to load auth state from localStorage:', error);
    }
    
    return {
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  };

  const [state, setState] = useState<AuthState>(getInitialState);

  // Initialize token manager and API client
  useEffect(() => {
    // Initialize API client with token getter
    apiClient.initialize(() => state.tokens);

    // Initialize token manager with refresh and expired callbacks
    tokenManager.initialize(
      // Refresh callback
      async () => {
        if (!state.tokens?.refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await fetch('/api/auth/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: state.tokens.refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        
        // Update state with new tokens
        updateState({
          tokens: data.tokens,
        });

        return data.tokens;
      },
      // Expired callback (logout user)
      () => {
        console.log('🚪 Token refresh failed, logging out user');
        logout();
      }
    );

    // Start auto refresh if we have tokens
    if (state.tokens && state.isAuthenticated) {
      tokenManager.startAutoRefresh(state.tokens);
    }

    return () => {
      tokenManager.stopAutoRefresh();
    };
  }, [state.tokens, state.isAuthenticated]);

  // Save to localStorage whenever state changes
  const updateState = useCallback((newState: Partial<AuthState>) => {
    setState(prevState => {
      const updatedState = { ...prevState, ...newState };
      
      // Save to localStorage
      try {
        localStorage.setItem('auth-storage', JSON.stringify({
          user: updatedState.user,
          tokens: updatedState.tokens,
          isAuthenticated: updatedState.isAuthenticated,
        }));
      } catch (error) {
        console.error('Failed to save auth state to localStorage:', error);
      }
      
      return updatedState;
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    updateState({ isLoading: true, error: null });
    
    try {
      const data = await apiClient.post('/auth/login', 
        { email, password },
        { requireAuth: false }
      );
      
      const newState = {
        user: data.user,
        tokens: data.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
      updateState(newState);
      
      // Start automatic token refresh
      if (data.tokens) {
        tokenManager.startAutoRefresh(data.tokens);
      }
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  }, [updateState]);

  const register = useCallback(async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    updateState({ isLoading: true, error: null });
    
    try {
      const data = await apiClient.post('/auth/register', 
        userData,
        { requireAuth: false }
      );
      
      const newState = {
        user: data.user,
        tokens: data.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
      updateState(newState);
      
      // Start automatic token refresh
      if (data.tokens) {
        tokenManager.startAutoRefresh(data.tokens);
      }
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  }, [updateState]);

  const logout = useCallback(() => {
    // Stop automatic token refresh
    tokenManager.stopAutoRefresh();
    
    // Clear localStorage and state
    updateState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      error: null,
    });
    
    // Optional: Call logout endpoint to invalidate tokens on server
    if (state.tokens?.accessToken) {
      apiClient.post('/auth/logout', {}, { requireAuth: true }).catch(() => {
        // Ignore errors on logout endpoint
      });
    }
  }, [updateState, state.tokens]);

  const refreshToken = useCallback(async () => {
    try {
      const newTokens = await tokenManager.refreshTokens();
      return newTokens;
    } catch (error) {
      // Token manager will handle logout on failure
      throw error;
    }
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    if (state.user) {
      updateState({
        user: { ...state.user, ...userData },
      });
    }
  }, [state.user, updateState]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const setLoading = useCallback((loading: boolean) => {
    updateState({ isLoading: loading });
  }, [updateState]);

  const forgotPassword = useCallback(async (email: string) => {
    updateState({ isLoading: true, error: null });
    
    try {
      await apiClient.post('/auth/forgot-password', 
        { email },
        { requireAuth: false }
      );
      updateState({ isLoading: false });
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : 'Failed to send reset email',
        isLoading: false,
      });
      throw error;
    }
  }, [updateState]);

  const resetPassword = useCallback(async (token: string, password: string) => {
    updateState({ isLoading: true, error: null });
    
    try {
      await apiClient.post('/auth/reset-password', 
        { token, password },
        { requireAuth: false }
      );
      updateState({ isLoading: false });
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : 'Failed to reset password',
        isLoading: false,
      });
      throw error;
    }
  }, [updateState]);

  const validateResetToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      await apiClient.post('/auth/validate-reset-token', 
        { token },
        { requireAuth: false }
      );
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    updateState({ isLoading: true, error: null });
    
    try {
      await apiClient.post('/auth/verify-email', 
        { token },
        { requireAuth: false }
      );
      updateState({ isLoading: false });
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : 'Email verification failed',
        isLoading: false,
      });
      throw error;
    }
  }, [updateState]);

  const resendVerificationEmail = useCallback(async (email: string) => {
    updateState({ isLoading: true, error: null });
    
    try {
      await apiClient.post('/auth/resend-verification', 
        { email },
        { requireAuth: false }
      );
      updateState({ isLoading: false });
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : 'Failed to resend verification email',
        isLoading: false,
      });
      throw error;
    }
  }, [updateState]);

  const uploadProfileImage = useCallback(async (file: File): Promise<string> => {
    updateState({ isLoading: true, error: null });
    
    try {
      const data = await apiClient.upload('/users/upload-avatar', file, 'avatar');
      updateState({ isLoading: false });
      return data.profileImageUrl;
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : 'Failed to upload profile image',
        isLoading: false,
      });
      throw error;
    }
  }, [updateState]);

  const value: AuthStore = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
    clearError,
    setLoading,
    forgotPassword,
    resetPassword,
    validateResetToken,
    verifyEmail,
    resendVerificationEmail,
    uploadProfileImage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}