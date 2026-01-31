import { 
  LoginFormData, 
  RegisterFormData, 
  PasswordResetRequestData, 
  PasswordResetData,
  EmailVerificationData,
  ChangePasswordData,
  ProfileUpdateData
} from '@/lib/validations/auth';
import { User, AuthError } from '@/store/auth';

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  message?: string;
  error?: AuthError;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: AuthError;
}

class AuthService {
  private baseUrl = '/api/auth';

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`Auth service error (${endpoint}):`, error);
      throw error;
    }
  }

  async login(credentials: LoginFormData): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    return response.data || response;
  }

  async register(userData: RegisterFormData): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      }),
    });

    return response.data || response;
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Logout should always succeed locally even if server request fails
      console.warn('Logout request failed:', error);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    return response.data || response;
  }

  async requestPasswordReset(data: PasswordResetRequestData): Promise<ApiResponse> {
    return this.makeRequest('/password-reset-request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: PasswordResetData): Promise<ApiResponse> {
    return this.makeRequest('/password-reset', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(data: EmailVerificationData): Promise<ApiResponse> {
    return this.makeRequest('/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendVerificationEmail(): Promise<ApiResponse> {
    return this.makeRequest('/resend-verification', {
      method: 'POST',
    });
  }

  async changePassword(data: ChangePasswordData, token: string): Promise<ApiResponse> {
    return this.makeRequest('/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async updateProfile(data: ProfileUpdateData, token: string): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async getProfile(token: string): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async uploadProfileImage(file: File, token: string): Promise<ApiResponse<{ profileImageUrl: string }>> {
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await fetch(`${this.baseUrl}/profile/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Profile image upload error:', error);
      throw error;
    }
  }

  async deleteAccount(password: string, token: string): Promise<ApiResponse> {
    return this.makeRequest('/delete-account', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });
  }

  // Utility methods
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
  } {
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;

    // Additional complexity
    if (password.length >= 16) score += 1;
    if (/[^a-zA-Z\d@$!%*?&]/.test(password)) score += 1;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a', '#15803d'];

    const index = Math.min(score, labels.length - 1);

    return {
      score,
      label: labels[index],
      color: colors[index],
    };
  }
}

export const authService = new AuthService();