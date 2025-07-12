import { api } from './api';
import type { Connection, User, ApiResponse } from '../types';

export const connectionService = {
  async sendConnectionRequest(userId: string): Promise<Connection> {
    const response = await api.post<ApiResponse<Connection>>('/connections/send', { receiverId: userId });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to send connection request');
    }
    return response.data.data;
  },

  async acceptConnectionRequest(connectionId: string): Promise<Connection> {
    const response = await api.put<ApiResponse<Connection>>(`/connections/${connectionId}/accept`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to accept connection request');
    }
    return response.data.data;
  },

  async rejectConnectionRequest(connectionId: string): Promise<void> {
    const response = await api.put<ApiResponse<void>>(`/connections/${connectionId}/reject`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to reject connection request');
    }
  },

  async removeConnection(connectionId: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/connections/${connectionId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to remove connection');
    }
  },

  async getMyConnections(): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>('/connections/my-connections');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch connections');
    }
    return response.data.data;
  },

  async getPendingRequests(): Promise<Connection[]> {
    const response = await api.get<ApiResponse<Connection[]>>('/connections/pending');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch pending requests');
    }
    return response.data.data;
  },

  async getSentRequests(): Promise<Connection[]> {
    const response = await api.get<ApiResponse<Connection[]>>('/connections/sent');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch sent requests');
    }
    return response.data.data;
  },

  async searchUsers(query: string, page = 1, limit = 10): Promise<{ users: User[]; total: number; totalPages: number }> {
    const response = await api.get<ApiResponse<{ users: User[]; total: number; totalPages: number }>>(`/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to search users');
    }
    return response.data.data;
  },

  async getUserById(userId: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user');
    }
    return response.data.data;
  },

  async getConnectionStatus(userId: string): Promise<{ status: 'none' | 'pending' | 'connected' | 'sent'; connectionId?: string }> {
    const response = await api.get<ApiResponse<{ status: 'none' | 'pending' | 'connected' | 'sent'; connectionId?: string }>>(`/connections/status/${userId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to get connection status');
    }
    return response.data.data;
  },

  async getSuggestedConnections(): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>('/connections/suggestions');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch connection suggestions');
    }
    return response.data.data;
  },
};