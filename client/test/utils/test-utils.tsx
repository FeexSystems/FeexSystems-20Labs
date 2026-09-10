import React from 'react';
import { vi } from 'vitest';
import { render, renderHook, act, waitFor } from '@testing-library/react';
import { AuthStoreProvider } from '@/lib/auth-store';
import { mockApiResponses } from '../mocks/api';
import { createMockUser, createMockTokens } from './mock-factories';

// Re-export testing utilities and mock factories
export { render, renderHook, act, waitFor };
export { createMockUser, createMockTokens };

// Helper function to create mock auth state
export const createMockAuthState = (overrides = {}) => ({
  user: createMockUser(),
  tokens: createMockTokens(),
  isAuthenticated: true,
  isLoading: false,
  error: null,
  ...overrides,
});

// Helper to mock localStorage with auth data
export const mockAuthStorage = (authState = createMockAuthState()) => {
  const mockStorage = {
    user: authState.user,
    tokens: authState.tokens,
    isAuthenticated: authState.isAuthenticated,
  };
  
  vi.mocked(localStorage.getItem).mockImplementation((key) => {
    if (key === 'auth-storage') {
      return JSON.stringify(mockStorage);
    }
    return null;
  });
};

// Helper to clear auth storage mock
export const clearAuthStorage = () => {
  vi.mocked(localStorage.getItem).mockReturnValue(null);
};

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Helper to mock successful fetch responses
export const mockFetchSuccess = (data: any, status = 200) => {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: true,
    status,
    json: async () => data,
    headers: new Headers({ 'content-type': 'application/json' }),
  } as Response);
};

// Helper to mock failed fetch responses
export const mockFetchError = (error: any, status = 400) => {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => error,
    headers: new Headers({ 'content-type': 'application/json' }),
  } as Response);
};

// Test wrapper component
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthStoreProvider>{children}</AuthStoreProvider>;
};

// Export mock API responses for convenience
export { mockApiResponses };