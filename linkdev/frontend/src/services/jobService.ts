import { api } from './api';
import type { Job, JobApplication, ApiResponse } from '../types';

interface CreateJobData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary?: string;
  jobType: 'full_time' | 'part_time' | 'contract' | 'internship';
  workMode: 'remote' | 'on_site' | 'hybrid';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
}

interface JobFilters {
  search?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  experienceLevel?: string;
  page?: number;
  limit?: number;
}

export const jobService = {
  async getJobs(filters: JobFilters = {}): Promise<{ jobs: Job[]; total: number; totalPages: number }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await api.get<ApiResponse<{ jobs: Job[]; total: number; totalPages: number }>>(`/jobs?${params}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch jobs');
    }
    return response.data.data;
  },

  async getJobById(id: string): Promise<Job> {
    const response = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch job');
    }
    return response.data.data;
  },

  async createJob(data: CreateJobData): Promise<Job> {
    const response = await api.post<ApiResponse<Job>>('/jobs', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create job');
    }
    return response.data.data;
  },

  async updateJob(id: string, data: Partial<CreateJobData>): Promise<Job> {
    const response = await api.put<ApiResponse<Job>>(`/jobs/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update job');
    }
    return response.data.data;
  },

  async deleteJob(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/jobs/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete job');
    }
  },

  async getMyJobs(): Promise<Job[]> {
    const response = await api.get<ApiResponse<Job[]>>('/jobs/my-jobs');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch your jobs');
    }
    return response.data.data;
  },

  async applyToJob(jobId: string, coverLetter?: string): Promise<JobApplication> {
    const response = await api.post<ApiResponse<JobApplication>>(`/jobs/${jobId}/apply`, { coverLetter });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to apply to job');
    }
    return response.data.data;
  },

  async getMyApplications(): Promise<JobApplication[]> {
    const response = await api.get<ApiResponse<JobApplication[]>>('/jobs/my-applications');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch your applications');
    }
    return response.data.data;
  },

  async getJobApplications(jobId: string): Promise<JobApplication[]> {
    const response = await api.get<ApiResponse<JobApplication[]>>(`/jobs/${jobId}/applications`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch job applications');
    }
    return response.data.data;
  },

  async updateApplicationStatus(applicationId: string, status: JobApplication['status']): Promise<JobApplication> {
    const response = await api.put<ApiResponse<JobApplication>>(`/jobs/applications/${applicationId}/status`, { status });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update application status');
    }
    return response.data.data;
  },
};