import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, User } from '@/lib/auth-store';
import { tokenManager } from '@/lib/token-manager';
import { toast } from '@/hooks/use-toast';

export function useAuth() {
  const navigate = useNavigate();
  const {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
    refreshToken,
    updateUser,
    clearError,
    setLoading,
    forgotPassword: storeForgotPassword,
    resetPassword: storeResetPassword,
    validateResetToken,
    verifyEmail: storeVerifyEmail,
    resendVerificationEmail: storeResendVerificationEmail,
    uploadProfileImage: storeUploadProfileImage,
  } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string, redirectTo?: string) => {
      try {
        await storeLogin(email, password);
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully logged in.',
        });
        navigate(redirectTo || '/dashboard');
      } catch (error) {
        toast({
          title: 'Login Failed',
          description: error instanceof Error ? error.message : 'An error occurred',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [storeLogin, navigate]
  );

  const register = useCallback(
    async (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      try {
        await storeRegister(userData);
        toast({
          title: 'Account Created!',
          description: 'Welcome to FeexSystems. Please verify your email.',
        });
        navigate('/verify-email');
      } catch (error) {
        toast({
          title: 'Registration Failed',
          description: error instanceof Error ? error.message : 'An error occurred',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [storeRegister, navigate]
  );

  const logout = useCallback(() => {
    storeLogout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  }, [storeLogout, navigate]);

  const updateProfile = useCallback(
    async (userData: Partial<User>) => {
      try {
        setLoading(true);
        // Update user in store optimistically
        updateUser(userData);
        
        // TODO: Make API call to update user profile
        // await apiClient.put('/users/profile', userData);
        
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated.',
        });
      } catch (error) {
        toast({
          title: 'Update Failed',
          description: error instanceof Error ? error.message : 'An error occurred',
          variant: 'destructive',
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [updateUser, setLoading]
  );

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        await storeForgotPassword(email);
        toast({
          title: 'Reset Link Sent',
          description: 'Check your email for password reset instructions.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to send reset email',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [storeForgotPassword]
  );

  const resetPassword = useCallback(
    async (token: string, password: string) => {
      try {
        await storeResetPassword(token, password);
        toast({
          title: 'Password Reset Successful',
          description: 'Your password has been updated successfully.',
        });
      } catch (error) {
        toast({
          title: 'Reset Failed',
          description: error instanceof Error ? error.message : 'Failed to reset password',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [storeResetPassword]
  );

  const verifyEmail = useCallback(
    async (token: string) => {
      try {
        await storeVerifyEmail(token);
        toast({
          title: 'Email Verified!',
          description: 'Your account has been successfully verified.',
        });
      } catch (error) {
        toast({
          title: 'Verification Failed',
          description: error instanceof Error ? error.message : 'Unable to verify your email',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [storeVerifyEmail]
  );

  const resendVerificationEmail = useCallback(
    async (email: string) => {
      try {
        await storeResendVerificationEmail(email);
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your email for the new verification link.',
        });
      } catch (error) {
        toast({
          title: 'Failed to Resend',
          description: error instanceof Error ? error.message : 'Unable to send verification email',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [storeResendVerificationEmail]
  );

  const verifyEmail = useCallback(
    async (token: string) => {
      try {
        await storeVerifyEmail(token);
        toast({
          title: 'Email Verified!',
          description: 'Your account has been successfully verified.',
        });
      } catch (error) {
        toast({
          title: 'Verification Failed',
          description: error instanceof Error ? error.message : 'Unable to verify your email',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [storeVerifyEmail]
  );

  const resendVerificationEmail = useCallback(
    async (email: string) => {
      try {
        await storeResendVerificationEmail(email);
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your email for the new verification link.',
        });
      } catch (error) {
        toast({
          title: 'Failed to Resend',
          description: error instanceof Error ? error.message : 'Unable to send verification email',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [storeResendVerificationEmail]
  );

  const uploadProfileImage = useCallback(
    async (file: File): Promise<string> => {
      try {
        const imageUrl = await storeUploadProfileImage(file);
        toast({
          title: 'Profile Image Updated',
          description: 'Your profile image has been successfully updated.',
        });
        return imageUrl;
      } catch (error) {
        toast({
          title: 'Upload Failed',
          description: error instanceof Error ? error.message : 'Failed to upload profile image',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [storeUploadProfileImage]
  );

  const checkAuthStatus = useCallback(async () => {
    if (!tokens?.accessToken) {
      return false;
    }

    try {
      // Check if token is expired
      if (tokenManager.isTokenExpired(tokens)) {
        // Try to refresh the token
        await refreshToken();
        return true;
      }
      
      // TODO: Optionally validate token with server
      // await apiClient.get('/auth/validate');
      return true;
    } catch (error) {
      // Token is invalid or refresh failed, logout user
      storeLogout();
      return false;
    }
  }, [tokens, refreshToken, storeLogout]);

  const hasRole = useCallback(
    (role: 'USER' | 'ADMIN' | 'SUPER_ADMIN') => {
      if (!user) return false;
      
      const roleHierarchy = {
        USER: 0,
        ADMIN: 1,
        SUPER_ADMIN: 2,
      };

      return roleHierarchy[user.role] >= roleHierarchy[role];
    },
    [user]
  );

  const isAdmin = useCallback(() => hasRole('ADMIN'), [hasRole]);
  const isSuperAdmin = useCallback(() => hasRole('SUPER_ADMIN'), [hasRole]);

  // Token expiration utilities
  const getTimeUntilExpiration = useCallback(() => {
    if (!tokens) return null;
    return tokenManager.getTimeUntilExpiration(tokens);
  }, [tokens]);

  const isTokenExpired = useCallback((bufferMinutes = 5) => {
    if (!tokens) return true;
    return tokenManager.isTokenExpired(tokens, bufferMinutes);
  }, [tokens]);

  const isTokenRefreshing = useCallback(() => {
    return tokenManager.isCurrentlyRefreshing;
  }, []);

  return {
    // State
    user,
    tokens,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
    checkAuthStatus,
    clearError,
    forgotPassword,
    resetPassword,
    validateResetToken,
    verifyEmail,
    resendVerificationEmail,
    uploadProfileImage,

    // Utilities
    hasRole,
    isAdmin,
    isSuperAdmin,
    
    // Token utilities
    getTimeUntilExpiration,
    isTokenExpired,
    isTokenRefreshing,
  };
}