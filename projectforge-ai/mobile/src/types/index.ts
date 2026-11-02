// ProjectForge AI — Mobile Application Core TypeScript Types

export type UserRole = 'student' | 'admin' | 'STUDENT' | 'ADMIN';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isOnboarded?: boolean;
  onboardingComplete?: boolean;
  college?: string;
  department?: string;
  year?: string;
  skills?: string[];
  careerGoal?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Profile {
  _id?: string;
  userId: string;
  college?: string;
  degree?: string;
  department?: string;
  currentYear?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | string;
  careerGoal?: string;
  interests?: string[];
  preferences?: {
    preferredTeamSize?: string;
    targetDuration?: string;
    preferredPlatforms?: string[];
    projectObjective?: string;
  };
}

export interface Skill {
  _id: string;
  userId?: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'devops' | 'mobile' | 'language' | string;
  level: 'beginner' | 'intermediate' | 'advanced' | string;
  yearsExperience?: number;
  confidenceScore: number;
}

export interface Project {
  _id: string;
  userId?: string;
  ownerId?: string;
  title: string;
  slug?: string;
  tagline?: string;
  description: string;
  category?: string;
  domain?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'Beginner' | 'Intermediate' | 'Advanced' | string;
  technologies?: string[];
  techStack?: string[];
  targetUsers?: string[] | string;
  problem?: string;
  solution?: string;
  features?: string[];
  estimatedWeeks?: number;
  readinessScore?: number;
  progress?: number;
  status?: string;
  isPublic?: boolean;
  forksCount?: number;
  starsCount?: number;
  forkedFromId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RequirementItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical' | string;
}

export interface UserStory {
  id: string;
  role?: string;
  action?: string;
  benefit?: string;
  asA?: string;
  iWant?: string;
  soThat?: string;
  acceptanceCriteria?: string[];
}

export interface ProjectRequirements {
  _id?: string;
  projectId: string;
  functional: any[];
  nonFunctional: any[];
  userStories: any[];
}

export type Requirements = ProjectRequirements;

export interface ProjectArchitecture {
  _id?: string;
  projectId: string;
  pattern: string;
  overview: string;
  monolithDiagram?: string;
  microservicesDiagram?: string;
  mermaidDiagram?: string;
  components: Array<{
    name: string;
    description: string;
    technology: string;
    responsibilities: string[];
  }>;
}

export type Architecture = ProjectArchitecture;

export interface DbField {
  name: string;
  type: string;
  required: boolean;
  isUnique?: boolean;
  description?: string;
}

export interface DbCollection {
  name: string;
  description: string;
  fields: DbField[];
  indexes?: string[];
}

export interface ProjectDatabase {
  _id?: string;
  projectId: string;
  selectedDatabase: 'mongodb' | 'postgresql' | 'mysql' | string;
  collections: DbCollection[];
}

export type DatabaseSchema = ProjectDatabase;

export interface ApiEndpoint {
  _id?: string;
  id?: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | string;
  description: string;
  authRequired: boolean;
  requestBody?: any;
  responseBody?: any;
  statusCodes?: number[];
  curlExample?: string;
}

export interface ProjectApis {
  _id?: string;
  projectId: string;
  endpoints: ApiEndpoint[];
}

export interface ProjectUI {
  _id?: string;
  projectId: string;
  designSystem: {
    colors: Record<string, string>;
    typography: Record<string, string>;
  };
  screens: Array<{
    name: string;
    description: string;
    wireframeNotes: string[];
    components: string[];
  }>;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  weekRange: string;
  goal: string;
  tasks: string[];
  completed?: boolean;
}

export interface ProjectRoadmap {
  _id?: string;
  projectId: string;
  phases: RoadmapPhase[];
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  estimatedHours?: number;
  dueDate?: string;
  createdAt?: string;
}

export interface TestCase {
  _id: string;
  projectId: string;
  title: string;
  category: 'unit' | 'integration' | 'api' | 'ui' | 'security' | string;
  description: string;
  expectedResult: string;
  status: 'pending' | 'passed' | 'failed' | string;
  codeSnippet?: string;
}

export interface ProjectDocument {
  _id?: string;
  projectId: string;
  readme: string;
  abstract: string;
  srs?: string;
}

export interface Technology {
  _id?: string;
  name: string;
  slug?: string;
  category: string;
  description?: string;
  iconName?: string;
  popular?: boolean;
  status?: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  iconName?: string;
  projectCount: number;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'system' | 'project' | 'task' | 'success' | 'alert' | 'ai';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface ValidationScore {
  feasibilityScore: number;
  scopeScore: number;
  technicalComplexity: 'Low' | 'Medium' | 'High' | string;
  skillGapScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | string;
  estimatedWeeks: number;
  strengths: string[];
  risks: string[];
  mvpRecommendation: string;
}
