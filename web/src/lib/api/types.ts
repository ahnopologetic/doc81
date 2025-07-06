// Common API response types
export interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

// Pagination response type
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Error response type
export interface ErrorResponse {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}

// Template related types
export interface Template {
  id: string;
  name: string;
  description?: string;
  content: string;
  created_at: string;
  updated_at: string;
  path: string;
  tags: string[];
}

export interface TemplateCreate {
  name: string;
  description?: string;
  content: string;
  path?: string;
  tags?: string[];
}

export interface TemplateListItem {
  id: string;
  name: string;
  description?: string;
  path: string;
  content: string;
  tags: string[];
}

// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  created_at: string;
}

// Company related types
export interface Company {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

// Health check response
export interface HealthCheckResponse {
  status: string;
  version: string;
  uptime: number;
} 