import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, isApiError, handleApiError } from '@/lib/api-client';
import { AuthTokens } from '@/lib/auth-store';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock token