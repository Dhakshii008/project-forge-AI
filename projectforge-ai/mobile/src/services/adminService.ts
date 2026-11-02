// ProjectForge AI — Mobile Admin RBAC Service
import { apiClient } from '../api/client';
import { Technology } from '../types';

export const adminService = {
  async getOverview() {
    return apiClient.get('/admin/overview');
  },

  async getUsers() {
    return apiClient.get('/admin/users');
  },

  async getProjects() {
    return apiClient.get('/admin/projects');
  },

  async createTechnology(data: Partial<Technology>) {
    return apiClient.post('/admin/technologies', data);
  },

  async updateTechnology(idOrSlug: string, updates: Partial<Technology>) {
    return apiClient.put(`/admin/technologies/${idOrSlug}`, updates);
  },

  async deleteTechnology(idOrSlug: string) {
    return apiClient.delete(`/admin/technologies/${idOrSlug}`);
  }
};
