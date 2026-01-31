import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/use-auth';
import { TestWrapper, createMockUser, createMockTokens } from '../utils/test-utils';

// Mock the auth store
const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockLogout = vi.fn();
const mockRefreshToken = vi.fn();
const mockUpdateUser = vi.fn();
const mockClearError = vi.fn();
const mockSetLoading = vi.fn();
const mockVerifyEmail = vi.fn();
const mockResendVerificationEmail = vi.fn();
const mockForgotPassword = vi.fn();
const mockResetPassword = vi.fn();
const mockValidateResetToken = vi.fn();
const mockUpdateProfile = vi.fn();
const mockUploadProfileImage = vi.fn();

const mockUseAuthStore = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: mockLogin,
  register: mockRegister,
  logout: mockLogout,
  refreshToken: mockRefreshToken,
  updateUser: mockUpdateUser,
  clearError: mockClearError,
  setLoading: mockSetLoading,
  verifyEmail: mockVerifyEmail,
  resendVerificationEmail: mockResendVerificationEmail,
  forgotPassword: mockForgotPassword,
  resetPassword: mockResetPassword,
  validateResetToken: mockValidateResetToken,
  updateProfile: mockUpdateProfile,
  uploadProfileImage: mockUploadProfileImage,
};

vi.mock('@/lib/auth-store', () => ({
  useAuthStore: () => mockUseAuthStore,
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.user = null;
    mockUseAuthStore.tokens = null;
    mockUseAuthStore.isAuthenticated = false;
    mockUseAuthStore.isLoading = false;
    mockUseAuthStore.error = null;
  });

  describe('Hook State', () => {
    it('should return auth state from store', () => {
      const mockUser = createMockUser();
      const mockTokens = createMockTokens();
      
      mockUseAuthStore.user = mockUser;
      mockUseAuthStore.tokens = mockTokens;
      mockUseAuthStore.isAuthenticated = true;
      mockUseAuthStore.isLoading = false;
      mockUseAuthStore.error = null;

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.tokens).toEqual(mockTokens);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should return loading state', () => {
      mockUseAuthStore.isLoading = true;

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it('should return error state', () => {
      mockUseAuthStore.error = 'Authentication failed';

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      expect(result.current.error).toBe('Authentication failed');
    });
  });

  describe('Authentication Methods', () => {
    it('should call login with correct parameters', async () => {
      const mockUser = createMockUser();
      const mockTokens = createMockTokens();
      
      mockLogin.mockResolvedValueOnce({
        user: mockUser,
        tokens: mockTokens,
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should call register with correct parameters', async () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const mockUser = createMockUser();
      const mockTokens = createMockTokens();
      
      mockRegister.mockResolvedValueOnce({
        user: mockUser,
        tokens: mockTokens,
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        await result.current.register(registerData);
      });

      expect(mockRegister).toHaveBeenCalledWith(registerData);
    });

    it('should call logout', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      act(() => {
        result.current.logout();
      });

      expect(mockLogout).toHaveBeenCalled();
    });

    it('should call refreshToken', async () => {
      const mockTokens = createMockTokens();
      mockRefreshToken.mockResolvedValueOnce({ tokens: mockTokens });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        await result.current.refreshToken();
      });

      expect(mockRefreshToken).toHaveBeenCalled();
    });
  });

  describe('Profile Management Methods', () => {
    it('should call updateProfile with correct parameters', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com',
      };

      mockUpdateProfile.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        await result.current.updateProfile(updateData);
      });

      expect(mockUpdateProfile).toHaveBeenCalledWith(updateData);
    });

    it('should call uploadProfileImage with file', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockImageUrl = 'https://example.com/image.jpg';
      
      mockUploadProfileImage.mockResolvedValueOnce(mockImageUrl);

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      let imageUrl: string;
      await act(async () => {
        imageUrl = await result.current.uploadProfileImage(mockFile);
      });

      expect(mockUploadProfileImage).toHaveBeenCalledWith(mockFile);
      expect(imageUrl!).toBe(mockImageUrl);
    });

    it('should call updateUser with partial data', () => {
      const updateData = { firstName: 'Updated' };

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      act(() => {
        result.current.updateUser(updateData);
      });

      expect(mockUpdateUser).toHaveBeenCalledWith(updateData);
    });
  });

  describe('Email Verification Methods', () => {
    it('should call verifyEmail with token', async () => {
      const token = 'verification-token';
      mockVerifyEmail.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        await result.current.verifyEmail(token);
      });

      expect(mockVerifyEmail).toHaveBeenCalledWith(token);
    });

    it('should call resendVerificationEmail with email', async () => {
      const email = 'test@example.com';
      mockResendVerificationEmail.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        await result.current.resendVerificationEmail(email);
      });

      expect(mockResendVerificationEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('Password Reset Methods', () => {
    it('should call forgotPassword with email', async () => {
      const email = 'test@example.com';
      mockForgotPassword.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        await result.current.forgotPassword(email);
      });

      expect(mockForgotPassword).toHaveBeenCalledWith(email);
    });

    it('should call resetPassword with token and password', async () => {
      const token = 'reset-token';
      const password = 'newPassword123';
      mockResetPassword.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        await result.current.resetPassword(token, password);
      });

      expect(mockResetPassword).toHaveBeenCalledWith(token, password);
    });

    it('should call validateResetToken and return validity', async () => {
      const token = 'reset-token';
      mockValidateResetToken.mockResolvedValueOnce(true);

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      let isValid: boolean;
      await act(async () => {
        isValid = await result.current.validateResetToken(token);
      });

      expect(mockValidateResetToken).toHaveBeenCalledWith(token);
      expect(isValid!).toBe(true);
    });

    it('should handle invalid reset token', async () => {
      const token = 'invalid-token';
      mockValidateResetToken.mockResolvedValueOnce(false);

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      let isValid: boolean;
      await act(async () => {
        isValid = await result.current.validateResetToken(token);
      });

      expect(mockValidateResetToken).toHaveBeenCalledWith(token);
      expect(isValid!).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    it('should call clearError', () => {
      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      act(() => {
        result.current.clearError();
      });

      expect(mockClearError).toHaveBeenCalled();
    });

    it('should call setLoading', () => {
      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      act(() => {
        result.current.setLoading(true);
      });

      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle login errors', async () => {
      const errorMessage = 'Invalid credentials';
      mockLogin.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        try {
          await result.current.login('invalid@example.com', 'wrongpassword');
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe(errorMessage);
        }
      });

      expect(mockLogin).toHaveBeenCalledWith('invalid@example.com', 'wrongpassword');
    });

    it('should handle registration errors', async () => {
      const errorMessage = 'Email already exists';
      mockRegister.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        try {
          await result.current.register({
            email: 'existing@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe(errorMessage);
        }
      });
    });

    it('should handle profile update errors', async () => {
      const errorMessage = 'Update failed';
      mockUpdateProfile.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        try {
          await result.current.updateProfile({
            firstName: 'Updated',
            lastName: 'Name',
            email: 'updated@example.com',
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe(errorMessage);
        }
      });
    });

    it('should handle email verification errors', async () => {
      const errorMessage = 'Invalid verification token';
      mockVerifyEmail.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        try {
          await result.current.verifyEmail('invalid-token');
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe(errorMessage);
        }
      });
    });

    it('should handle password reset errors', async () => {
      const errorMessage = 'Failed to send reset email';
      mockForgotPassword.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await act(async () => {
        try {
          await result.current.forgotPassword('test@example.com');
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe(errorMessage);
        }
      });
    });
  });

  describe('State Consistency', () => {
    it('should maintain consistent state across multiple operations', async () => {
      const mockUser = createMockUser();
      const mockTokens = createMockTokens();
      
      // Initial state
      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });
      
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();

      // Login
      mockLogin.mockResolvedValueOnce({
        user: mockUser,
        tokens: mockTokens,
      });
      
      mockUseAuthStore.user = mockUser;
      mockUseAuthStore.tokens = mockTokens;
      mockUseAuthStore.isAuthenticated = true;

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);

      // Update profile
      const updatedUser = { ...mockUser, firstName: 'Updated' };
      mockUseAuthStore.user = updatedUser;
      mockUpdateProfile.mockResolvedValueOnce(undefined);

      await act(async () => {
        await result.current.updateProfile({ firstName: 'Updated' });
      });

      expect(result.current.user?.firstName).toBe('Updated');

      // Logout
      mockUseAuthStore.user = null;
      mockUseAuthStore.tokens = null;
      mockUseAuthStore.isAuthenticated = false;

      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('should handle concurrent operations correctly', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      // Simulate concurrent login and profile update
      const loginPromise = result.current.login('test@example.com', 'password123');
      const profilePromise = result.current.updateProfile({ firstName: 'Updated' });

      await act(async () => {
        await Promise.allSettled([loginPromise, profilePromise]);
      });

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockUpdateProfile).toHaveBeenCalledWith({ firstName: 'Updated' });
    });
  });

  describe('Method Availability', () => {
    it('should expose all required authentication methods', () => {
      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      // Authentication methods
      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.register).toBe('function');
      expect(typeof result.current.logout).toBe('function');
      expect(typeof result.current.refreshToken).toBe('function');

      // Profile methods
      expect(typeof result.current.updateProfile).toBe('function');
      expect(typeof result.current.uploadProfileImage).toBe('function');
      expect(typeof result.current.updateUser).toBe('function');

      // Email verification methods
      expect(typeof result.current.verifyEmail).toBe('function');
      expect(typeof result.current.resendVerificationEmail).toBe('function');

      // Password reset methods
      expect(typeof result.current.forgotPassword).toBe('function');
      expect(typeof result.current.resetPassword).toBe('function');
      expect(typeof result.current.validateResetToken).toBe('function');

      // Utility methods
      expect(typeof result.current.clearError).toBe('function');
      expect(typeof result.current.setLoading).toBe('function');
    });

    it('should expose all required state properties', () => {
      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('tokens');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
    });
  });
});