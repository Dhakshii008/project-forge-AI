// ProjectForge AI — Mobile Project Management Service
import { apiClient } from '../api/client';
import { Project } from '../types';

export const projectService = {
  async getDashboardStats() {
    return apiClient.get('/projects/dashboard-stats');
  },

  async getProjects(params?: { category?: string; search?: string; difficulty?: string; limit?: number }) {
    let query = '';
    if (params?.category) query += `category=${encodeURIComponent(params.category)}&`;
    if (params?.search) query += `search=${encodeURIComponent(params.search)}&`;
    if (params?.difficulty) query += `difficulty=${encodeURIComponent(params.difficulty)}&`;
    if (params?.limit) query += `limit=${params.limit}&`;
    const endpoint = `/projects${query ? `?${query}` : ''}`;
    return apiClient.get<Project[]>(endpoint);
  },

  async getMyProjects() {
    return this.getProjects();
  },

  async getProject(idOrSlug: string) {
    return apiClient.get<Project>(`/projects/${idOrSlug}`);
  },

  async getProjectById(idOrSlug: string) {
    return this.getProject(idOrSlug);
  },

  async createProject(projectData: Partial<Project>) {
    return apiClient.post<{ project: Project }>('/projects', projectData);
  },

  async updateProject(id: string, projectData: Partial<Project>) {
    return apiClient.put<Project>(`/projects/${id}`, projectData);
  },

  async deleteProject(id: string) {
    return apiClient.delete(`/projects/${id}`);
  },

  async forkProject(id: string) {
    return apiClient.post<{ projectId: string; project: Project }>(`/projects/${id}/fork`);
  },

  async getPublicPortfolio(slug: string) {
    return apiClient.get(`/portfolio/${slug}`);
  }
};
