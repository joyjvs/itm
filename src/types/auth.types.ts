export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  address?: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  lastName: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  lastName: string;
}

export interface UpdateUserPayload {
  email?: string;
  name?: string;
  lastName?: string;
}
