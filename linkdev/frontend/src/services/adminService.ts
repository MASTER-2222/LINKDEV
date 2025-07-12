import { api } from './api';
import type { User, Job, Post, JobApplication, ApiResponse } from '../types';

interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalPosts: number;
  totalApplications: number;
  newUsersThisWeek: number;
  newJobsThisWeek: number;
  newPostsThisWeek: number;
  newApplicationsThisWeek: number;
}

interface UsersFilters {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export const adminService = {
  async getAdminStats(): Promise<AdminStats> {
    const response = await api.get<ApiResponse<AdminStats>>('/admin/stats');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch admin stats');
    }
    return response.data.data;
  },

  async getAllUsers(filters: UsersFilters = {}): Promise<{ users: User[]; total: number; totalPages: number }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await api.get<ApiResponse<{ users: User[]; total: number; totalPages: number }>>(`/admin/users?${params}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch users');
    }
    return response.data.data;
  },

  async updateUserRole(userId: string, role: User['role']): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/admin/users/${userId}/role`, { role });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update user role');
    }
    return response.data.data;
  },

  async deleteUser(userId: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/admin/users/${userId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete user');
    }
  },

  async getAllJobs(page = 1, limit = 10): Promise<{ jobs: Job[]; total: number; totalPages: number }> {
    const response = await api.get<ApiResponse<{ jobs: Job[]; total: number; totalPages: number }>>(`/admin/jobs?page=${page}&limit=${limit}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch jobs');
    }
    return response.data.data;
  },

  async deleteJob(jobId: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/admin/jobs/${jobId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete job');
    }
  },

  async getAllPosts(page = 1, limit = 10): Promise<{ posts: Post[]; total: number; totalPages: number }> {
    const response = await api.get<ApiResponse<{ posts: Post[]; total: number; totalPages: number }>>(`/admin/posts?page=${page}&limit=${limit}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch posts');
    }
    return response.data.data;
  },

  async deletePost(postId: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/admin/posts/${postId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete post');
    }
  },

  async getAllApplications(page = 1, limit = 10): Promise<{ applications: JobApplication[]; total: number; totalPages: number }> {
    const response = await api.get<ApiResponse<{ applications: JobApplication[]; total: number; totalPages: number }>>(`/admin/applications?page=${page}&limit=${limit}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch applications');
    }
    return response.data.data;
  },

  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: User['role'];
  }): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/admin/users', userData);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create user');
    }
    return response.data.data;
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/admin/users/${userId}`, userData);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update user');
    }
    return response.data.data;
  },
};