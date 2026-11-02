// ProjectForge AI — Mobile Embedded Offline Real Data Engine
import AsyncStorage from '@react-native-async-storage/async-storage';
import embeddedRaw from './embeddedData.json';

const embedded: any = embeddedRaw;

class MobileStandaloneStore {
  private cache: Map<string, any[]> = new Map();

  private async getCollection(key: string, defaultData: any[]): Promise<any[]> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    try {
      const stored = await AsyncStorage.getItem(`pf_mobile_coll_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cache.set(key, parsed);
        return parsed;
      }
    } catch {}
    this.cache.set(key, defaultData);
    return defaultData;
  }

  private async saveCollection(key: string, data: any[]): Promise<void> {
    this.cache.set(key, data);
    try {
      await AsyncStorage.setItem(`pf_mobile_coll_${key}`, JSON.stringify(data));
    } catch {}
  }

  private normalizeProject(p: any): any {
    if (!p) return p;
    const techStack = Array.isArray(p.techStack)
      ? p.techStack
      : [...(p.techStack?.frontend || []), ...(p.techStack?.backend || [])];

    const features = Array.isArray(p.features)
      ? p.features
      : [...(p.features?.mvp || []), ...(p.features?.phase2 || [])];

    return {
      ...p,
      title: p.title || p.name || 'Project Blueprint',
      description: p.description || p.detailedDescription || p.oneLineDescription || '',
      category: p.category || 'Full Stack',
      difficulty: p.difficulty || p.complexity?.difficulty || 'Intermediate',
      progress: p.progress || p.completionScore || 72,
      status: p.status === 'in_development' ? 'Active' : p.status || 'Active',
      techStack: techStack.length > 0 ? techStack : ['React Native', 'Node.js', 'MongoDB', 'Docker'],
      problem: p.problem || p.problemStatement || '',
      solution: p.solution || p.proposedSolution || '',
      features: features.length > 0 ? features : ['User Authentication', 'Data Pipeline', 'Interactive Dashboard'],
      estimatedWeeks: p.estimatedWeeks || (p.complexity?.estimatedDuration ? parseInt(p.complexity.estimatedDuration) : 4),
    };
  }

  public async handleRequest(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: any; error?: any } | null> {
    const method = (options.method || 'GET').toUpperCase();
    const clean = endpoint.replace(/^\/api/, '').split('?')[0];
    let body: any = {};
    if (options.body && typeof options.body === 'string') {
      try { body = JSON.parse(options.body); } catch {}
    }

    // 1. Auth Login
    if (clean === '/auth/login' && method === 'POST') {
      const email = body.email?.toLowerCase().trim();
      const users = await this.getCollection('users', embedded.users || []);
      const user = users.find((u: any) => u.email.toLowerCase() === email);
      if (user) {
        const normalizedRole = (user.role || 'STUDENT').toUpperCase();
        return {
          success: true,
          data: {
            token: 'mobile_secure_jwt_' + user._id,
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: normalizedRole,
              isOnboarded: user.isOnboarded !== undefined ? user.isOnboarded : true,
              onboardingComplete: true,
              college: user.college || 'MIT',
              careerGoal: user.careerGoal || 'Full Stack Engineer',
              avatarUrl: user.avatarUrl,
              createdAt: user.createdAt
            }
          }
        };
      }
      return { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials. Use demo cards.' } };
    }

    // 2. Auth Register
    if (clean === '/auth/register' && method === 'POST') {
      const newUser = {
        _id: 'user_' + Date.now(),
        name: body.name || 'New Student',
        email: body.email,
        role: 'STUDENT',
        isOnboarded: true,
        onboardingComplete: true,
        college: body.college || 'University',
        careerGoal: body.careerGoal || 'Engineer',
        createdAt: new Date().toISOString()
      };
      const users = await this.getCollection('users', embedded.users || []);
      users.push(newUser);
      await this.saveCollection('users', users);
      return {
        success: true,
        data: {
          token: 'mobile_secure_jwt_' + newUser._id,
          user: newUser
        }
      };
    }

    // 3. Technologies & Categories
    if (clean === '/technologies') {
      const techs = await this.getCollection('technologies', embedded.technologies || []);
      return { success: true, data: techs };
    }
    if (clean === '/categories') {
      const cats = await this.getCollection('categories', embedded.categories || []);
      return { success: true, data: cats };
    }

    // 4. Skills & Profile
    if (clean === '/skills' && method === 'GET') {
      const skills = await this.getCollection('skills', embedded.skills || []);
      return { success: true, data: skills };
    }
    if (clean === '/skills/profile' && method === 'GET') {
      return {
        success: true,
        data: {
          overallScore: 82,
          skills: [
            { name: 'TypeScript', score: 88 },
            { name: 'React', score: 85 },
            { name: 'Node.js', score: 80 },
            { name: 'MongoDB', score: 78 },
            { name: 'System Design', score: 72 },
            { name: 'Testing', score: 65 },
          ],
          strongSkills: ['TypeScript', 'React', 'Node.js'],
          weakSkills: ['Automated Testing', 'Docker / CI/CD', 'Kubernetes'],
          recommendedTech: ['Jest / Cypress', 'Docker', 'FastAPI'],
          careerFit: 'Full Stack Engineer (88% Match)',
        }
      };
    }
    if (clean === '/skills' && method === 'POST') {
      const skills = await this.getCollection('skills', embedded.skills || []);
      const newSkill = { ...body, _id: 'skill_' + Date.now() };
      skills.push(newSkill);
      await this.saveCollection('skills', skills);
      return { success: true, data: newSkill };
    }
    if (clean === '/profile') {
      const profiles = await this.getCollection('profiles', embedded.profiles || []);
      return { success: true, data: profiles[0] || {} };
    }

    // 5. Dashboard Stats
    if (clean === '/projects/dashboard-stats') {
      const rawProjects = await this.getCollection('projects', embedded.projects || []);
      const tasks = await this.getCollection('tasks', embedded.tasks || []);
      const completed = tasks.filter((t: any) => t.status === 'completed').length;
      return {
        success: true,
        data: {
          totalProjects: rawProjects.length,
          activeProjects: rawProjects.length,
          completedProjects: 0,
          totalTasks: tasks.length,
          completedTasks: completed,
          overallReadiness: tasks.length ? Math.round((completed / tasks.length) * 100) : 89,
          skillsTracked: 7
        }
      };
    }

    // 6. Projects List
    if (clean === '/projects' && method === 'GET') {
      const rawProjects = await this.getCollection('projects', embedded.projects || []);
      const normalized = rawProjects.map((p: any) => this.normalizeProject(p));
      return { success: true, data: normalized };
    }

    // 7. Project Submodules (:id/...)
    const projectSubMatch = clean.match(/^\/projects\/([^\/]+)\/([a-zA-Z_-]+)/);
    if (projectSubMatch) {
      const [, projId, submodule] = projectSubMatch;
      const getList = async (key: string, def: any[]) => {
        const items = await this.getCollection(key, def);
        return items.find((i: any) => i.projectId === projId || i._id === projId) || items[0] || null;
      };

      if (submodule === 'requirements') {
        const rawReq = await getList('project_requirements', embedded.project_requirements || []);
        const data = rawReq ? {
          ...rawReq,
          functional: rawReq.functional?.map((f: any) => typeof f === 'string' ? f : f.description || f.title) || [
            'System must authenticate users via JWT and bcrypt password hashing.',
            'System must stream real-time telemetry metrics using WebSockets.',
          ],
          nonFunctional: rawReq.nonFunctional?.map((f: any) => typeof f === 'string' ? f : f.description || f.title) || [
            'Sub-200ms latency for 99th percentile under load.',
            'Zero plaintext secret storage in local client cache.',
          ],
        } : null;
        return { success: true, data };
      }
      if (submodule === 'architecture') {
        const rawArch = await getList('project_architecture', embedded.project_architecture || []);
        const data = rawArch ? {
          ...rawArch,
          overview: rawArch.overview || rawArch.beginnerArchitecture?.description || rawArch.productionArchitecture?.description || 'Modular full stack architecture',
          mermaidDiagram: rawArch.mermaidDiagram || rawArch.beginnerArchitecture?.mermaidDiagram || rawArch.productionArchitecture?.mermaidDiagram || '',
        } : null;
        return { success: true, data };
      }
      if (submodule === 'database') {
        const rawDb = await getList('project_databases', embedded.project_databases || []);
        const data = rawDb ? {
          ...rawDb,
          collections: rawDb.collections || rawDb.tables?.map((t: any) => ({
            name: t.name || t.tableName || 'collection',
            description: t.description || 'Data entity schema',
            fields: t.fields || t.columns?.map((c: any) => ({
              name: c.name || c.columnName,
              type: c.type || c.dataType || 'String',
              required: c.required !== undefined ? c.required : true,
              description: c.description || ''
            })) || [],
            indexes: t.indexes || []
          })) || [],
          selectedDatabase: rawDb.databaseType || 'mongodb'
        } : null;
        return { success: true, data };
      }
      if (submodule === 'apis') return { success: true, data: await getList('project_apis', embedded.project_apis || []) };
      if (submodule === 'ui') return { success: true, data: await getList('project_ui', embedded.project_ui || []) };
      if (submodule === 'roadmap') return { success: true, data: await getList('roadmaps', embedded.roadmaps || []) };
      if (submodule === 'docs') return { success: true, data: await getList('documents', embedded.documents || []) };
      if (submodule === 'tests') {
        const tests = await this.getCollection('test_cases', embedded.test_cases || []);
        return { success: true, data: tests };
      }
      if (submodule === 'tasks') {
        const tasks = await this.getCollection('tasks', embedded.tasks || []);
        if (method === 'GET') return { success: true, data: tasks };
        if (method === 'POST') {
          const newTask = {
            _id: 'task_' + Date.now(),
            projectId: projId,
            title: body.title || 'New Task',
            description: body.description || '',
            status: body.status || 'todo',
            priority: body.priority || 'medium',
            createdAt: new Date().toISOString()
          };
          tasks.unshift(newTask);
          await this.saveCollection('tasks', tasks);
          return { success: true, data: newTask };
        }
      }
      if (submodule === 'chat' && method === 'POST') {
        return {
          success: true,
          data: {
            message: {
              role: 'assistant',
              content: `AI Mentor (Offline Fallback): For your project "${projId}", prioritize setting up database indexes for fast query speeds and validating all client inputs using Zod. What module should we build next?`,
              timestamp: new Date().toISOString()
            }
          }
        };
      }
    }

    // 8. Single Project Detail
    const projectMatch = clean.match(/^\/projects\/([^\/]+)$/);
    if (projectMatch && method === 'GET') {
      const projId = projectMatch[1];
      const projects = await this.getCollection('projects', embedded.projects || []);
      const found = projects.find((p: any) => p._id === projId || p.slug === projId) || projects[0];
      return { success: true, data: this.normalizeProject(found) };
    }

    // 9. AI Generate & Validate
    if (clean === '/ai/generate' && method === 'POST') {
      return {
        success: true,
        data: {
          title: body.prompt ? `${body.prompt} Platform` : 'Smart Campus AI Assistant',
          slug: 'smart-campus-ai',
          tagline: 'Intelligent full-stack workflow automation powered by AI',
          description: 'A complete production-grade application engineered with modular architecture, strict data validation, and automated test coverage.',
          category: body.domain || 'edtech',
          difficulty: body.difficulty || 'intermediate',
          technologies: body.technologies || ['React Native', 'Node.js', 'MongoDB', 'FastAPI'],
          techStack: body.technologies || ['React Native', 'Node.js', 'MongoDB', 'FastAPI'],
          features: [
            'Automated telemetry stream ingestion',
            'Multi-provider AI model synthesis',
            'Interactive mobile Kanban board',
            'Full documentation & SRS compilation'
          ],
          readinessScore: 88,
          isPublic: true
        }
      };
    }
    if (clean === '/ai/validate' && method === 'POST') {
      return {
        success: true,
        data: {
          feasibilityScore: 92,
          scopeScore: 85,
          technicalComplexity: 'Medium',
          skillGapScore: 18,
          riskLevel: 'Low',
          estimatedWeeks: 6,
          strengths: ['Clear requirements architecture', 'Modern tech stack', 'High reusability'],
          risks: ['Third-party API rate limits', 'Data indexing optimization required'],
          mvpRecommendation: 'Deliver the core database schemas and primary REST APIs in Phase 1 before building client interfaces.'
        }
      };
    }

    // 10. Admin
    if (clean.startsWith('/admin')) {
      const users = await this.getCollection('users', embedded.users || []);
      const projects = await this.getCollection('projects', embedded.projects || []);
      const techs = await this.getCollection('technologies', embedded.technologies || []);
      return {
        success: true,
        data: {
          systemStatus: 'OPERATIONAL',
          totalUsers: users.length,
          totalProjects: projects.length,
          activeWorkspaces: projects.length,
          stats: { totalUsers: users.length, totalProjects: projects.length, totalTechnologies: techs.length },
          users,
          projects: projects.map((p: any) => this.normalizeProject(p)),
          technologies: techs
        }
      };
    }

    return null;
  }
}

export const mobileStandaloneStore = new MobileStandaloneStore();
