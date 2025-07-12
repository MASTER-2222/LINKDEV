import { format, formatDistanceToNow } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const formatDate = (date: string | Date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatTimeAgo = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatFullName = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`;
};

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatJobType = (jobType: string) => {
  return jobType.split('_').map(word => capitalizeFirst(word)).join(' ');
};

export const formatSalary = (salary?: string) => {
  if (!salary) return 'Salary not disclosed';
  return salary;
};

export const getJobTypeColor = (jobType: string) => {
  switch (jobType) {
    case 'full_time':
      return 'bg-green-100 text-green-800';
    case 'part_time':
      return 'bg-blue-100 text-blue-800';
    case 'contract':
      return 'bg-yellow-100 text-yellow-800';
    case 'internship':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getWorkModeColor = (workMode: string) => {
  switch (workMode) {
    case 'remote':
      return 'bg-green-100 text-green-800';
    case 'on_site':
      return 'bg-blue-100 text-blue-800';
    case 'hybrid':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getApplicationStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'reviewing':
      return 'bg-blue-100 text-blue-800';
    case 'interview':
      return 'bg-purple-100 text-purple-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const generateAvatarUrl = (firstName: string, lastName: string) => {
  const initials = getInitials(firstName, lastName);
  return `https://ui-avatars.com/api/?name=${initials}&background=0077b5&color=fff&size=100`;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};