import axios from 'axios';
import { User, LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<void> {
    await apiClient.post('/auth/register', data);
  },

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await apiClient.post('/auth/forgot-password', data);
  },

  async resetPassword(data: ResetPasswordData): Promise<void> {
    await apiClient.post('/auth/reset-password', data);
  },

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token });
  },

  async resendVerification(email: string): Promise<void> {
    await apiClient.post('/auth/resend-verification', { email });
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },

  async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/auth/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};