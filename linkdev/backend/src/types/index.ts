import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  headline?: string;
  about?: string;
  profilePicture?: string;
  coverPhoto?: string;
  location?: string;
  industry?: string;
  website?: string;
  resume?: string;
  role: 'job_seeker' | 'recruiter' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary?: string;
  jobType: 'full_time' | 'part_time' | 'contract' | 'internship';
  workMode: 'remote' | 'on_site' | 'hybrid';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  recruiterId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  imageUrl?: string;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'job_seeker' | 'recruiter';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface JobFilters extends PaginationParams {
  search?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  experienceLevel?: string;
}

export interface UserFilters extends PaginationParams {
  search?: string;
  role?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}