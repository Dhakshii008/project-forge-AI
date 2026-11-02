// ProjectForge AI — Mobile Workspace Submodules Service (All 14 Modules)
import { apiClient } from '../api/client';
import {
  ProjectRequirements, ProjectArchitecture, ProjectDatabase,
  ProjectApis, ProjectUI, ProjectRoadmap, Task, TestCase, ProjectDocument
} from '../types';

export const workspaceService = {
  // Module 2: Requirements
  async getRequirements(projectId: string) {
    return apiClient.get<ProjectRequirements>(`/projects/${projectId}/requirements`);
  },

  // Module 3: Architecture
  async getArchitecture(projectId: string) {
    return apiClient.get<ProjectArchitecture>(`/projects/${projectId}/architecture`);
  },

  // Module 4: Database Designer
  async getDatabase(projectId: string) {
    return apiClient.get<ProjectDatabase>(`/projects/${projectId}/database`);
  },

  // Module 5: API Designer
  async getApis(projectId: string) {
    return apiClient.get<ProjectApis>(`/projects/${projectId}/apis`);
  },

  // Module 6: UI/UX Planner
  async getUI(projectId: string) {
    return apiClient.get<ProjectUI>(`/projects/${projectId}/ui`);
  },

  // Module 7: Roadmap
  async getRoadmap(projectId: string) {
    return apiClient.get<ProjectRoadmap>(`/projects/${projectId}/roadmap`);
  },

  // Module 8: Tasks
  async getTasks(projectId: string) {
    return apiClient.get<Task[]>(`/projects/${projectId}/tasks`);
  },

  async createTask(projectId: string, taskData: Partial<Task>) {
    return apiClient.post<Task>(`/projects/${projectId}/tasks`, taskData);
  },

  async updateTask(projectId: string, taskId: string, updates: Partial<Task>) {
    return apiClient.put<Task>(`/projects/${projectId}/tasks/${taskId}`, updates);
  },

  async deleteTask(projectId: string, taskId: string) {
    return apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
  },

  // Module 9: AI Development Assistant
  async sendChatMessage(projectId: string, message: string) {
    return apiClient.post<{ message: any }>(`/projects/${projectId}/chat`, { message });
  },

  // Module 10: Starter Code
  async generateStarterCode(projectId: string, target = 'core') {
    return apiClient.post<{ code: string; filename: string }>(`/projects/${projectId}/code/generate`, { target });
  },

  // Module 11: Testing Center
  async getTests(projectId: string) {
    return apiClient.get<TestCase[]>(`/projects/${projectId}/tests`);
  },

  async updateTestCase(projectId: string, testId: string, updates: Partial<TestCase>) {
    return apiClient.put<TestCase>(`/projects/${projectId}/tests/${testId}`, updates);
  },

  // Module 12: Documentation
  async getDocs(projectId: string) {
    return apiClient.get<ProjectDocument>(`/projects/${projectId}/docs`);
  },

  // Module 13: Deployment
  async getDeployment(projectId: string) {
    return apiClient.get(`/projects/${projectId}/deployment`);
  },

  // Aliases for submodule screens
  getDatabaseSchema(projectId: string) {
    return this.getDatabase(projectId);
  },
  getApiEndpoints(projectId: string) {
    return this.getApis(projectId);
  },
  getTestCases(projectId: string) {
    return this.getTests(projectId);
  }
};

