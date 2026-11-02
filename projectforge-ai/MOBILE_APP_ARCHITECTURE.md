# ProjectForge AI — Mobile Application Architecture Specification

## 1. Architectural Overview

ProjectForge AI has been transformed from a web-oriented application into a genuine **native mobile engineering workspace** for Android (and cross-platform iOS readiness) built on:
- **Framework**: React Native 0.74.5 + Expo SDK 51
- **Language**: TypeScript 5.3+ (Strict Mode)
- **Navigation & Routing**: Expo Router v3.5 (File-based navigation with deep linking)
- **Token Security**: Expo SecureStore (Encrypted on-device hardware keystore)
- **Offline Persistence**: React Native AsyncStorage + Embedded 22-Collection Fallback Engine
- **Backend API Core**: Node.js + Express.js REST API with JWT and RBAC (Port 5000 / LAN IP / Production Cloud)
- **Vector & Database Engine**: MongoDB Atlas native driver + embedded JSON fallback engine
- **Multi-Provider AI Gateway**: Google Gemini 2.5 Flash → OpenAI GPT-4o → Groq LLaMA3 → Deterministic Heuristic Engine

```
                               ┌────────────────────────────────────────────────────────┐
                               │       PROJECTFORGE AI MOBILE APPLICATION               │
                               │           (React Native + Expo SDK 51)                 │
                               └────────────────────────┬───────────────────────────────┘
                                                        │
                      ┌─────────────────────────────────┴─────────────────────────────────┐
                      │                                                                   │
            ┌─────────▼─────────┐                                               ┌─────────▼─────────┐
            │   ONLINE MODE     │                                               │   OFFLINE MODE    │
            │ (Express REST API)│                                               │ (Standalone Store)│
            └─────────┬─────────┘                                               └─────────┬─────────┘
                      │                                                                   │
        ┌─────────────┴─────────────┐                                           ┌─────────┴─────────┐
        │                           │                                           │ 22 Collections    │
┌───────▼────────┐         ┌────────▼────────┐                                  │ Real Seed Records │
│ MongoDB Atlas  │         │  AI Provider    │                                  │ Local Persistence │
│ Native Driver  │         │  Chain Engine   │                                  └───────────────────┘
└────────────────┘         └─────────────────┘
```

---

## 2. Directory & Screen Layout

The mobile directory structure is organized cleanly under `mobile/`:

```
mobile/
├── app/                                 # Expo Router File-Based Routing
│   ├── _layout.tsx                      # Root Layout (SafeAreaProvider, AuthProvider, Dark Theme)
│   ├── index.tsx                        # Splash Screen with Session Verification & Auto-Routing
│   │
│   ├── (auth)/                          # Authentication Flow
│   │   ├── _layout.tsx                  # Auth Stack Navigation
│   │   ├── login.tsx                    # Login Screen (JWT, 1-tap demo credentials, LAN API drawer)
│   │   ├── register.tsx                 # 5-Step Academic Registration Wizard
│   │   └── forgot-password.tsx          # Password Recovery Flow
│   │
│   ├── (onboarding)/                    # First-Time Student Onboarding Flow
│   │   ├── _layout.tsx                  # Onboarding Stack Navigation
│   │   ├── welcome.tsx                  # Welcome & Value Proposition
│   │   ├── education.tsx                # University, Major, and Academic Year
│   │   ├── skills.tsx                   # Grouped Technical Stack Assessment
│   │   └── goals.tsx                    # Career Goals & Domain Preference
│   │
│   ├── (tabs)/                          # Main Mobile Bottom Tab Navigation
│   │   ├── _layout.tsx                  # Tab Bar (Home, Explore, Create, Projects, Profile)
│   │   ├── index.tsx                    # Home Engineering Dashboard & Quick Actions
│   │   ├── explore.tsx                  # Project Discovery Marketplace
│   │   ├── create.tsx                   # AI Project Generator Wizard & Live Blueprint
│   │   ├── projects.tsx                 # My Projects Workspace & Kanban Launch
│   │   └── profile.tsx                  # Student Profile & SVG Skill Radar Intelligence
│   │
│   ├── project/
│   │   ├── [id].tsx                     # Project Blueprint Detail & Fork Action
│   │   └── validation.tsx               # AI Project Scope & Feasibility Validation
│   │
│   ├── workspace/                       # 14 Full Engineering Workspace Submodules
│   │   ├── [id].tsx                     # Hub Navigation Grid with Completion Indicators
│   │   ├── overview.tsx                 # Module 01: Problem, Solution & Target Users
│   │   ├── requirements.tsx             # Module 02: FR, NFR & Agile User Stories
│   │   ├── architecture.tsx             # Module 03: Monolith vs Microservices & Mermaid
│   │   ├── database.tsx                 # Module 04: MongoDB & SQL Schemas, Types & Indexes
│   │   ├── api.tsx                      # Module 05: REST API Designer & cURL Snippets
│   │   ├── uiux.tsx                     # Module 06: Design System Tokens & Wireframes
│   │   ├── roadmap.tsx                  # Module 07: 8-Phase Timeline Milestones
│   │   ├── tasks.tsx                    # Module 08: Sprint Tasks & Kanban Board
│   │   ├── assistant.tsx                # Module 09: Contextual AI Development Chat
│   │   ├── starter-code.tsx             # Module 10: Project Directory Tree & Code Viewer
│   │   ├── testing.tsx                  # Module 11: Unit, API & Security Test Suites
│   │   ├── documentation.tsx            # Module 12: README, Abstract & SRS Viewer
│   │   ├── deployment.tsx               # Module 13: Vercel, Render & Atlas Guides
│   │   └── portfolio.tsx                # Module 14: Public Showcase & Privacy Redaction
│   │
│   ├── notifications.tsx                # In-App Notification Center
│   ├── settings.tsx                     # API Endpoint Switcher, Theme & Danger Zone
│   └── admin/
│       └── index.tsx                    # Privileged Admin Portal (RBAC Guarded)
│
├── src/
│   ├── api/client.ts                    # Central API Client with 8s Timeout & Offline Switch
│   ├── components/                      # Native Mobile UI Components (Button, Input, Card, Badge, Header, SkillRadar...)
│   ├── data/
│   │   ├── embeddedData.json            # 22 Standalone Fallback Seed Collections
│   │   └── standaloneStore.ts           # Mobile Offline-First Data & Auth Handler
│   ├── services/                        # Service Facades (auth, project, workspace, skill, ai, admin, storage)
│   ├── store/authContext.tsx            # React Context Authentication State & Session Restore
│   ├── theme/index.ts                   # Design Tokens, Colors, Spacing & 44pt Touch Targets
│   └── types/index.ts                   # Strict TypeScript Data Contracts
│
├── tests/
│   └── runner.ts                        # Automated Mobile Production Test Suite (25/25 verified)
├── app.json                             # Expo Configuration & Android Package Identity
├── eas.json                             # EAS Cloud Build Configuration (APK & AAB profiles)
└── package.json                         # Dependencies & Scripts
```

---

## 3. Mobile Security & Secret Boundary

The mobile application strictly obeys production security boundaries:
1. **Zero Secret Exposure**:
   - `GEMINI_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`, `JWT_SECRET`, and `MONGODB_URI` remain exclusively on the backend server.
   - The mobile client bundle contains **0 API keys or database secrets**.
2. **Encrypted Token Storage**:
   - Authentication JWT tokens are written directly to `expo-secure-store` backed by Android KeyStore.
3. **Role-Based Access Control (RBAC)**:
   - Admin routes (`/admin`) check `user.role === 'ADMIN'` and display an impenetrable Access Denied barrier for standard student accounts.
4. **Public Portfolio Redaction**:
   - Public showcase links redact environment credentials, private tasks, database connection strings, and student passwords.
