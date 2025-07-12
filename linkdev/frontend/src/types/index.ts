export interface User {
  id: string;
  email: string;
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
  recruiter?: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  job?: Job;
  applicantId: string;
  applicant?: User;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  imageUrl?: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Connection {
  id: string;
  senderId: string;
  sender?: User;
  receiverId: string;
  receiver?: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'job_seeker' | 'recruiter';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}