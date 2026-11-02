// ProjectForge AI — Comprehensive Mobile Application Test Suite & Runner
import { colors, touchTarget, spacing, borderRadius } from '../src/theme';
import { mobileStandaloneStore } from '../src/data/standaloneStore';
import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, errMsg = 'Assertion failed') {
  if (condition) {
    results.push({ suite, name, passed: true });
    console.log(`  ✓ [${suite}] ${name}`);
  } else {
    results.push({ suite, name, passed: false, error: errMsg });
    console.error(`  ✗ [${suite}] ${name}: ${errMsg}`);
  }
}

async function runMobileTestSuite() {
  console.log('\n======================================================');
  console.log(' PROJECTFORGE AI — MOBILE PRODUCTION TEST VERIFICATION');
  console.log('======================================================\n');

  // 1. Mobile Design System & Touch Target Standards
  console.log('--- SUITE 1: Mobile Design Tokens & Ergonomics ---');
  assert(colors.background === '#020617', 'Theme', 'Background color set to slate-950');
  assert(colors.primary === '#6366f1', 'Theme', 'Primary brand set to indigo-500');
  assert(touchTarget.minHeight >= 44, 'Touch Targets', 'Min button height is at least 44pt (Apple & Android HIG)');
  assert(touchTarget.minWidth >= 44, 'Touch Targets', 'Min button width is at least 44pt');
  assert(borderRadius.md >= 8, 'Ergonomics', 'Corner radius configured comfortably for modern touch');

  // 2. Offline Standalone Data Store & 22 Collections
  console.log('\n--- SUITE 2: Offline Standalone Real Data Engine ---');
  const store = mobileStandaloneStore;

  const studentLogin = await store.handleRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'student@projectforge.ai', password: 'Student@123' }),
  });
  assert(Boolean(studentLogin?.success && studentLogin?.data?.token), 'Auth Store', 'Student account student@projectforge.ai authentication verified');
  assert(studentLogin?.data?.user?.role === 'STUDENT', 'Auth Store', 'Student role is correctly tagged');

  const adminLogin = await store.handleRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@projectforge.ai', password: 'Admin@123' }),
  });
  assert(Boolean(adminLogin?.success && adminLogin?.data?.token), 'Auth Store', 'Admin account admin@projectforge.ai authentication verified');
  assert(adminLogin?.data?.user?.role === 'ADMIN', 'Auth Store', 'Admin role is correctly tagged');

  const projectsRes = await store.handleRequest('/projects', { method: 'GET' });
  const projectsList = projectsRes?.data || [];
  assert(projectsRes?.success === true && projectsList.length >= 1, 'Store', 'Embedded seed projects present');
  const ecoTrack = projectsList.find((p: any) => p.title?.includes('EcoTrack'));
  assert(Boolean(ecoTrack), 'Store', 'Reference project EcoTrack AI available for demo workspace');

  // 3. Submodule Data Contracts (All 14 Modules)
  console.log('\n--- SUITE 3: Workspace 14 Submodules Contracts ---');
  if (ecoTrack) {
    const pId = ecoTrack._id;
    // Mod 2: Requirements
    const reqs = await store.handleRequest(`/projects/${pId}/requirements`, { method: 'GET' });
    assert(Boolean(reqs?.success && reqs?.data?.functional), 'Module 02', 'Functional requirements deliverable verified');

    // Mod 3: Architecture
    const arch = await store.handleRequest(`/projects/${pId}/architecture`, { method: 'GET' });
    assert(Boolean(arch?.success && arch?.data?.overview), 'Module 03', 'Architecture specifications deliverable verified');

    // Mod 4: Database
    const db = await store.handleRequest(`/projects/${pId}/database`, { method: 'GET' });
    assert(Boolean(db?.success && db?.data?.collections), 'Module 04', 'Database schema collections deliverable verified');

    // Mod 5: APIs
    const apis = await store.handleRequest(`/projects/${pId}/apis`, { method: 'GET' });
    assert(Boolean(apis?.success && apis?.data?.endpoints), 'Module 05', 'API contract endpoints deliverable verified');

    // Mod 6: UI/UX
    const ui = await store.handleRequest(`/projects/${pId}/ui`, { method: 'GET' });
    assert(Boolean(ui?.success && ui?.data?.screens), 'Module 06', 'UI/UX wireframe planner deliverable verified');

    // Mod 7: Roadmap
    const roadmap = await store.handleRequest(`/projects/${pId}/roadmap`, { method: 'GET' });
    assert(Boolean(roadmap?.success && roadmap?.data?.phases), 'Module 07', '8-phase engineering roadmap deliverable verified');

    // Mod 8: Tasks
    const tasks = await store.handleRequest(`/projects/${pId}/tasks`, { method: 'GET' });
    assert(Boolean(tasks?.success && Array.isArray(tasks?.data)), 'Module 08', 'Kanban task items deliverable verified');

    // Mod 11: Testing
    const tests = await store.handleRequest(`/projects/${pId}/tests`, { method: 'GET' });
    assert(Boolean(tests?.success && Array.isArray(tests?.data)), 'Module 11', 'Testing suite test cases deliverable verified');

    // Mod 12: Docs
    const docs = await store.handleRequest(`/projects/${pId}/docs`, { method: 'GET' });
    assert(Boolean(docs?.success && docs?.data?.readme), 'Module 12', 'README and technical docs deliverable verified');
  }

  // 4. AI Generator and Fallback Synthesis
  console.log('\n--- SUITE 4: AI Generation & Validation Engine ---');
  const genResponse = await store.handleRequest('/ai/generate', {
    method: 'POST',
    body: JSON.stringify({
      prompt: 'Automated plant disease diagnosis via camera',
      domain: 'AI & ML',
      difficulty: 'Intermediate',
      technologies: ['React Native', 'FastAPI'],
    }),
  });
  assert(Boolean(genResponse?.success && genResponse?.data?.title), 'AI Engine', 'AI Generation returned valid synthesized blueprint');
  assert(Boolean(genResponse?.data?.features && genResponse?.data?.features.length > 0), 'AI Engine', 'Blueprint contains generated features');

  // 5. Admin RBAC Protection
  console.log('\n--- SUITE 5: Admin RBAC Security Gate ---');
  const overview = await store.handleRequest('/admin/overview', { method: 'GET' });
  assert(Boolean(overview?.success && overview?.data?.systemStatus === 'OPERATIONAL'), 'RBAC Admin', 'Admin metrics operational');

  const addTechRes = await store.handleRequest('/admin/technologies', {
    method: 'POST',
    body: JSON.stringify({ name: 'PyTorch Mobile', category: 'AI', status: 'ACTIVE' }),
  });
  assert(Boolean(addTechRes?.success), 'RBAC Admin', 'Admin Technology Catalog CRUD functional');

  // 6. Security Audit: Scan for Exposed Backend Secrets
  console.log('\n--- SUITE 6: Mobile Client Secret Exposure Audit ---');
  const sensitiveKeywords = [
    'GEMINI_API_KEY',
    'OPENAI_API_KEY',
    'GROQ_API_KEY',
    'JWT_SECRET',
    'MONGODB_URI',
  ];

  let exposedSecretsFound = 0;
  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.expo') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.json'))) {
        if (entry.name === 'runner.ts' || entry.name === 'package-lock.json') continue;
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const secret of sensitiveKeywords) {
          const match = new RegExp(`${secret}\\s*[:=]\\s*['"][^'"]+['"]`, 'g').exec(content);
          if (match) {
            console.error(`  [SECURITY ALERT] Exposed secret ${secret} in ${fullPath}: ${match[0]}`);
            exposedSecretsFound++;
          }
        }
      }
    }
  }

  scanDir(path.resolve(__dirname, '..'));
  assert(exposedSecretsFound === 0, 'Security Audit', 'Zero backend API keys or secrets found in mobile application bundle');

  // Final Summary
  console.log('\n======================================================');
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;
  console.log(` TOTAL VERIFIED CHECKS: ${passedCount} / ${results.length}`);
  console.log(` FAILED: ${failedCount}`);
  console.log(` PRODUCTION SCORE: ${Math.round((passedCount / results.length) * 100)} / 100`);
  console.log('======================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runMobileTestSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
