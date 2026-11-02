// ProjectForge AI — Mobile Authentication Service
import { apiClient } from '../api/client';
import { storage } from './storage';
import { User } from '../types';

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const res = await apiClient.post<{ token: string; user: User }>('/auth/login', credentials);
    if (res.success && res.data) {
      await storage.setToken(res.data.token);
      await storage.setUser(res.data.user);
    }
    return res;
  },

  async register(data: { name: string; email: string; password: string; role?: string }) {
    const res = await apiClient.post<{ token: string; user: User }>('/auth/register', data);
    if (res.success && res.data) {
      await storage.setToken(res.data.token);
      await storage.setUser(res.data.user);
    }
    return res;
  },

  async getMe() {
    return apiClient.get<{ user: User }>('/auth/me');
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      await storage.clearSession();
    }
  },

  async forgotPassword(email: string) {
    return apiClient.post('/auth/forgot-password', { email });
  },

  async completeOnboarding(profileData: any) {
    const res = await apiClient.post('/profile/onboarding', profileData);
    if (res.success && res.data?.user) {
      await storage.setUser(res.data.user);
    }
    return res;
  },

  async getProfile() {
    return apiClient.get('/profile');
  },

  async updateProfile(profileData: any) {
    return apiClient.put('/profile', profileData);
  }
};
