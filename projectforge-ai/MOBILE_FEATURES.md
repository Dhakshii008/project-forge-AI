# ProjectForge AI — Mobile Application Features Specification

ProjectForge AI delivers a complete, end-to-end mobile engineering workspace that helps students and aspiring developers turn project ideas into genuine, buildable, documented, tested, and deployable software.

---

## 1. Native Mobile Features Matrix

### 1.1 Splash Screen & Session Verification
- **Branded Initializer**: Displays "PROJECTFORGE AI" with official tagline *"Turn your skills and ideas into projects you can actually build."*
- **Auto-Routing Engine**:
  - Restores session via `expo-secure-store`.
  - Routes unauthenticated visitors to `/(auth)/login`.
  - Routes incomplete profiles to `/(onboarding)/welcome`.
  - Routes authenticated students directly to `/(tabs)`.

### 1.2 Authentication & 5-Step Registration
- **Login Experience**:
  - Email & password with toggle visibility.
  - 1-Tap Quick Credentials for demo testing (`student@projectforge.ai` and `admin@projectforge.ai`).
  - Runtime API Server Switcher allowing instant configuration of LAN or cloud endpoints without recompiling.
- **5-Step Registration Wizard**:
  - Step 1: Account credentials (Full Name, Email, Password, Confirm Password).
  - Step 2: Academic background (University/College, Department, Current Year).
  - Step 3: Technical stack assessment (Languages, Frontend, Backend, Databases, AI).
  - Step 4: Career objectives (Target Role, Experience Level, Preferred Domains).
  - Step 5: Review & Account Confirmation.
- **Password Recovery**:
  - Validates registered email and triggers instructions dispatch.

### 1.3 Onboarding Flow
- Guided 3-step profile calibration saving directly to the backend `/api/profile/onboarding`.
- Aligns engineering project suggestions to career aspirations and technical skills.

### 1.4 Home Engineering Dashboard
- **Personalized Greeting**: Context-aware time-of-day greeting with student name.
- **ProjectForge Skill Score**: Visual progress bar and score benchmarking students against industry standards.
- **Active Project Card**: Direct one-tap continuation into current active project workspace.
- **Quick Actions Grid**:
  - Generate Project (AI wizard).
  - Explore Blueprints (Marketplace).
  - My Tasks (Kanban board).
  - AI Mentor (Chat assistant).
- **Recommended Projects**: Tailored list of blueprints based on student skill overlap.

### 1.5 Skill Intelligence (Profile Screen)
- **Interactive SVG Radar Chart**: 6-axis polygonal radar visualizer rendered via `react-native-svg` tailored for small touchscreens.
- **Strength & Gap Analysis**: Highlights strong frameworks vs identified missing competencies.
- **Target Career Fit**: Probability-based career path alignment score.

### 1.6 Project Discovery Marketplace
- **Real-Time Search**: Instant filtering by keywords, frameworks, or problems.
- **Category Filter Pills**: All, Full Stack, AI & ML, Mobile, DevOps, Blockchain.
- **Difficulty Badges**: Beginner, Intermediate, Advanced.
- **Blueprint Cards**: Shows title, duration in weeks, skill match %, tech pills, and Open action.

### 1.7 AI Project Generator & Scope Validation
- **4-Step Wizard**:
  - Step 1: Idea Prompt description.
  - Step 2: Domain & Difficulty selector.
  - Step 3: Target Technologies selector.
  - Step 4: Synthesize Architecture.
- **Live Blueprint Preview**: Detailed breakdown of Problem, Solution, MVP vs Phase 2 features, and Tech Stack.
- **Feasibility & Validation**: Analyzes complexity, scope fit, risk index, and recommended MVP adjustments.

### 1.8 My Projects Management
- **Status Tabs**: All, Active, Drafts, Completed.
- **Project Card**: Progress %, Category, Technologies, Open button, Fork button, Delete button.

---

## 2. All 14 Workspace Submodules

| # | Module | Core Functionality |
|---|---|---|
| **01** | **Overview** | Problem statement, solution, target audience, and editable project goals. |
| **02** | **Requirements** | Collapsible cards for Functional Requirements (FR), Non-Functional Requirements (NFR), and Agile User Stories. |
| **03** | **Architecture** | Modular Monolith vs Microservices visual component layer flow with Mermaid code viewer. |
| **04** | **Database Schema** | Collections / Tables inspector with field types, required flags, compound indexes, and database engine switcher. |
| **05** | **API Designer** | Expandable REST endpoint cards with method badges (GET, POST, PUT, DELETE), request payloads, responses, and cURL copiers. |
| **06** | **UI/UX Planner** | WCAG 2.1 AA compliant color token palette, screen hierarchy, and mobile ergonomics guidelines. |
| **07** | **Roadmap** | 8-phase engineering milestone timeline with progress indicators and deliverables. |
| **08** | **Tasks Kanban** | Sprint task board with status tabs (`TODO`, `IN_PROGRESS`, `DONE`), priority chips (`LOW`, `MEDIUM`, `HIGH`), status toggle, and creation modal. |
| **09** | **AI Mentor** | Project-aware conversational chat assistant with bubble styling, prompt shortcuts, copy response, and chat reset. |
| **10** | **Starter Code** | Interactive project directory tree with code viewer and one-tap clipboard copy. |
| **11** | **Testing Center** | Test suites covering Unit, Integration, API, UI, and Security with execution trigger and coverage metrics. |
| **12** | **Documentation** | Multi-tab technical viewer for automated README, Abstract, and Software Requirements Specification (SRS). |
| **13** | **Deployment Center** | Production guides for Render, Vercel, Railway, and MongoDB Atlas with build commands and required environment variables. |
| **14** | **Public Portfolio** | Recruiter-ready project showcase URL generator with strict privacy redaction of secrets and credentials. |

---

## 3. Auxiliary & Administrative Features
- **In-App Notifications**: Categorized alerts for project milestones, AI generation, task deadlines, and skill score increases.
- **Settings Screen**: Live API endpoint changer, theme preferences, storage cache purge, and account deletion confirmation dialog.
- **Admin Management Console**: Privileged RBAC portal providing real-time system metrics, user lists, and Technology Catalog CRUD operations.
