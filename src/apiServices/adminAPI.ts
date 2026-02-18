import { SERVER_URL } from './config';
import { Admin } from '../store/authSlice';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  admin: Admin;
}

export const login = async (email: string, password: string): Promise<Admin> => {
  const response = await fetch(`${SERVER_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any).error || 'Failed to login');
  }

  const data: LoginResponse = await response.json();
  return data.admin;
};

export const getCurrentAdmin = async (): Promise<Admin> => {
  const adminId = localStorage.getItem('adminId');
  if (!adminId) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${SERVER_URL}/admin/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminId}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any).error || 'Failed to get admin');
  }

  const data: LoginResponse = await response.json();
  return data.admin;
};

export const logout = async (): Promise<void> => {
  const adminId = localStorage.getItem('adminId');
  if (adminId) {
    try {
      await fetch(`${SERVER_URL}/admin/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminId}`,
        },
      });
    } catch (error) {
      // Ignore errors on logout
      console.error('Logout error:', error);
    }
  }
};
