import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { apiClient } from '@/lib/api-client';

export function useApiClient() {
  const { tokens, refreshToken, logout } = useAuthStore();

  useEffect(() => {
    // Initialize API client with auth functions
    apiClient.initialize(
      () => tokens,
      refreshToken,
      logout
    );
  }, [tokens, refreshToken, logout]);

  return apiClient;
}