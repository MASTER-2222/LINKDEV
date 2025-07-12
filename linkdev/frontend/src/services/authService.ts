import { api } from './api';
import type { User, LoginData, RegisterData, ApiResponse } from '../types';

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Login failed');
    }
    return response.data.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Registration failed');
    }
    return response.data.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to get user data');
    }
    return response.data.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Profile update failed');
    }
    return response.data.data;
  },

  async uploadProfilePicture(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post<ApiResponse<{ imageUrl: string }>>('/auth/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Image upload failed');
    }
    
    return response.data.data.imageUrl;
  },
};