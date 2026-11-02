// ProjectForge AI — Mobile AI Generation & Validation Service
import { apiClient } from '../api/client';
import { ValidationScore } from '../types';

export const aiService = {
  async generateProject(params: {
    prompt: string;
    domain?: string;
    difficulty?: string;
    technologies?: string[];
    skills?: string[];
    careerGoal?: string;
  }) {
    return apiClient.post('/ai/generate', params);
  },

  async validateProject(projectData: any) {
    return apiClient.post<ValidationScore>('/ai/validate', { project: projectData });
  },

  async acceptBlueprint(blueprint: any) {
    return apiClient.post<{ project: any }>('/ai/accept', { project: blueprint });
  },

  async askAssistant(params: { projectId: string; prompt: string; history?: any[] }) {
    return apiClient.post<{ reply?: string; response?: string }>('/ai/chat', params);
  }
};

