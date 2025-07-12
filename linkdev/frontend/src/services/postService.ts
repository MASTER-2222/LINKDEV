import { api } from './api';
import type { Post, Comment, ApiResponse } from '../types';

interface CreatePostData {
  content: string;
  image?: File;
}

interface CreateCommentData {
  content: string;
  postId: string;
}

export const postService = {
  async getPosts(page = 1, limit = 10): Promise<{ posts: Post[]; total: number; totalPages: number }> {
    const response = await api.get<ApiResponse<{ posts: Post[]; total: number; totalPages: number }>>(`/posts?page=${page}&limit=${limit}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch posts');
    }
    return response.data.data;
  },

  async getPostById(id: string): Promise<Post> {
    const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch post');
    }
    return response.data.data;
  },

  async createPost(data: CreatePostData): Promise<Post> {
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.post<ApiResponse<Post>>('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create post');
    }
    return response.data.data;
  },

  async updatePost(id: string, content: string): Promise<Post> {
    const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, { content });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update post');
    }
    return response.data.data;
  },

  async deletePost(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/posts/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete post');
    }
  },

  async likePost(id: string): Promise<Post> {
    const response = await api.post<ApiResponse<Post>>(`/posts/${id}/like`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to like post');
    }
    return response.data.data;
  },

  async unlikePost(id: string): Promise<Post> {
    const response = await api.delete<ApiResponse<Post>>(`/posts/${id}/like`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to unlike post');
    }
    return response.data.data;
  },

  async getPostComments(postId: string): Promise<Comment[]> {
    const response = await api.get<ApiResponse<Comment[]>>(`/posts/${postId}/comments`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch comments');
    }
    return response.data.data;
  },

  async createComment(data: CreateCommentData): Promise<Comment> {
    const response = await api.post<ApiResponse<Comment>>(`/posts/${data.postId}/comments`, { content: data.content });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create comment');
    }
    return response.data.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/comments/${commentId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete comment');
    }
  },

  async getUserPosts(userId: string, page = 1, limit = 10): Promise<{ posts: Post[]; total: number; totalPages: number }> {
    const response = await api.get<ApiResponse<{ posts: Post[]; total: number; totalPages: number }>>(`/users/${userId}/posts?page=${page}&limit=${limit}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user posts');
    }
    return response.data.data;
  },
};