export interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive?: boolean;
  roles?: Role[];
  phone?: string;
  address?: string;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UsersResponse {
  data: User[];
  pagination: PaginationResponse;
}
