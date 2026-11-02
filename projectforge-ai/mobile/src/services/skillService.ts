// ProjectForge AI — Mobile Skill Intelligence & Tech Catalog Service
import { apiClient } from '../api/client';
import { Skill, Technology, Category } from '../types';

export const skillService = {
  async getSkills() {
    return apiClient.get<Skill[]>('/skills');
  },

  async addSkill(skillData: Omit<Skill, '_id'>) {
    return apiClient.post<Skill>('/skills', skillData);
  },

  async updateSkill(id: string, updates: Partial<Skill>) {
    return apiClient.put<Skill>(`/skills/${id}`, updates);
  },

  async deleteSkill(id: string) {
    return apiClient.delete(`/skills/${id}`);
  },

  async getTechnologies() {
    return apiClient.get<Technology[]>('/technologies');
  },

  async getCategories() {
    return apiClient.get<Category[]>('/categories');
  },

  async getSkillProfile() {
    return apiClient.get<{
      overallScore: number;
      skills: { name: string; score: number }[];
      strongSkills: string[];
      weakSkills: string[];
      recommendedTech: string[];
      careerFit: string;
    }>('/skills/profile');
  }
};

