import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  profileImageUrl?: string;
  emailVerified?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthError {
  type: string;
  message: string;
  code: string;
  timestamp: string;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: AuthError | null;

  // Computed
  isLoggedIn: () => boolean;
  isTokenExpired: () => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;

  // Actions
  login: (user: User, token: string, refreshToken?: string, expiresIn?: number) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: AuthError | null) => void;
  setInitialized: (initialized: boolean) => void;
  refreshAuthToken: () => Promise<boolean>;
  clearError: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Computed values
      isLoggedIn: () => {
        const state = get();
        return !!state.token && !state.isTokenExpired() && !!state.user;
      },

      isTokenExpired: () => {
        const state = get();
        if (!state.expiresAt) return false;
        return Date.now() >= state.expiresAt;
      },

      isAdmin: () => {
        const state = get();
        return state.user?.role === 'ADMIN' || state.user?.role === 'SUPER_ADMIN';
      },

      isSuperAdmin: () => {
        const state = get();
        return state.user?.role === 'SUPER_ADMIN';
      },

      // Actions
      login: (user, token, refreshToken, expiresIn = 3600) => {
        const expiresAt = Date.now() + (expiresIn * 1000);
        set({
          user,
          token,
          refreshToken,
          expiresAt,
          isLoading: false,
          error: null,
          isInitialized: true
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          expiresAt: null,
          isLoading: false,
          error: null,
          isInitialized: true
        });
        // Clear any stored data
        localStorage.removeItem('auth-storage');
      },

      setUser: (user) => set((state) => ({ ...state, user })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setInitialized: (initialized) => set({ isInitialized: initialized }),

      clearError: () => set({ error: null }),

      initialize: async () => {
        const state = get();

        // If already initialized, skip
        if (state.isInitialized) return;

        set({ isLoading: true });

        try {
          // If we have a token but it's expired, try to refresh
          if (state.token && state.isTokenExpired() && state.refreshToken) {
            const refreshed = await get().refreshAuthToken();
            if (!refreshed) {
              get().logout();
            }
          }

          // If we have a valid token, verify the user is still valid
          if (state.token && !state.isTokenExpired()) {
            try {
              const response = await fetch('/api/users/profile', {
                headers: {
                  'Authorization': `Bearer ${state.token}`,
                },
              });

              if (response.ok) {
                const userData = await response.json();
                if (userData.success) {
                  set({ user: userData.user });
                }
              } else if (response.status === 401) {
                // Token is invalid, logout
                get().logout();
              }
            } catch (error) {
              console.error('Failed to verify user:', error);
              // Don't logout on network errors, just continue
            }
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({
            error: {
              type: 'INITIALIZATION_ERROR',
              message: 'Failed to initialize authentication',
              code: 'AUTH_INIT_FAILED',
              timestamp: new Date().toISOString()
            }
          });
        } finally {
          set({ isLoading: false, isInitialized: true });
        }
      },

      refreshAuthToken: async () => {
        const state = get();
        if (!state.refreshToken) {
          get().logout();
          return false;
        }

        try {
          set({ isLoading: true, error: null });

          const response = await fetch('/api/auth/refresh-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: state.refreshToken }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            const expiresAt = Date.now() + (data.expiresIn * 1000);
            set({
              token: data.token,
              refreshToken: data.refreshToken || state.refreshToken,
              expiresAt,
              isLoading: false,
              error: null
            });
            return true;
          } else {
            throw new Error(data.error?.message || 'Token refresh failed');
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          set({
            error: {
              type: 'TOKEN_REFRESH_ERROR',
              message: error instanceof Error ? error.message : 'Token refresh failed',
              code: 'TOKEN_REFRESH_FAILED',
              timestamp: new Date().toISOString()
            }
          });
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
      }),
    }
  )
);

// Auto-refresh token when it's about to expire
setInterval(() => {
  const state = useAuthStore.getState();
  if (state.token && state.expiresAt) {
    const timeUntilExpiry = state.expiresAt - Date.now();
    // Refresh token if it expires in the next 5 minutes
    if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
      state.refreshAuthToken();
    }
  }
}, 60 * 1000); // Check every minute
