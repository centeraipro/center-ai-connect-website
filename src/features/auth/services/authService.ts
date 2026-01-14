import type {
  RegisterBusinessRequest,
  RegisterBusinessResponse,
  LoginResponse,
  RegisterAdminRequest,
  RegisterAdminResponse,
} from '../types/auth.types';
import { extractSlugFromSubdomain } from '../utils/slugExtractor';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AUTH_PREFIX = '/api/auth';

const fetchOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const authService = {
  async registerBusiness(data: RegisterBusinessRequest): Promise<RegisterBusinessResponse> {
    const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/register-business`, {
      method: 'POST',
      ...fetchOptions,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login`, {
      method: 'POST',
      ...fetchOptions,
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/logout`, {
      method: 'POST',
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  },

  async getCurrentUser(): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/me`, {
      method: 'GET',
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    return response.json();
  },

  async registerTeamMember(data: RegisterAdminRequest): Promise<RegisterAdminResponse> {
    const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/register`, {
      method: 'POST',
      ...fetchOptions,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add team member');
    }

    return response.json();
  },
};
