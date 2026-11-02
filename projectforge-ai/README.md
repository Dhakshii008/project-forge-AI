# 📱 ProjectForge AI — Mobile Application

> **Turn your skills and ideas into projects you can actually build.**

ProjectForge AI is a production-grade native **mobile engineering workspace** for Android (and iOS-ready) engineered with **React Native**, **Expo SDK 51**, and **TypeScript**, powered by an autonomous multi-tier AI backend with Node.js, Express, and MongoDB Atlas.

```
IDEA ➔ AI UNDERSTANDING ➔ PROJECT DISCOVERY ➔ PROJECT GENERATION ➔ PROJECT VALIDATION 
  ➔ REQUIREMENTS ➔ ARCHITECTURE ➔ DATABASE ➔ API ➔ UI/UX ➔ ROADMAP ➔ TASKS 
  ➔ AI DEVELOPMENT ASSISTANT ➔ STARTER CODE ➔ TESTING ➔ DOCUMENTATION ➔ DEPLOYMENT ➔ PORTFOLIO
```

Every single step is accessible, interactive, and optimized for mobile devices.

---

## 🌟 Key Features

1. **Native Mobile Architecture**: Built using React Native 0.74.5 and Expo SDK 51 with file-based routing (`expo-router`), comfortable touch targets (≥ 44x44pt), smooth transitions, and dark slate aesthetics (`#020617`).
2. **Encrypted Token Security**: Sessions are backed by `expo-secure-store` utilizing hardware-backed Android KeyStore encryption. No sensitive credentials or plaintext JWTs are exposed.
3. **Offline-Aware Resilience**: Integrated 22-collection real data store ensures the app remains fully functional in offline environments or during intermittent connectivity without crashing.
4. **Guided Student Onboarding**: 5-step registration wizard and multi-step profile calibration saving directly to the backend.
5. **Interactive Skill Intelligence**: Custom SVG polygonal radar chart (`react-native-svg`), competency scoring, gap analysis, and tailored career matching.
6. **Project Discovery Marketplace**: Search, category filters (Full Stack, AI & ML, Mobile, DevOps, Blockchain), and difficulty badges with skill-match indicators.
7. **AI Project Generator**: 4-step wizard that transforms conceptual goals into production proposals divided into MVP, Phase 2, and Advanced frontiers.
8. **Feasibility Validation**: Analyzes complexity, scope fit, risk levels, and provides actionable MVP scoping recommendations.
9. **All 14 Engineering Workspace Modules**:
   - **Module 01: Overview**: Problem statement, solution, target users, and editable project goals.
   - **Module 02: Requirements**: Collapsible cards for Functional (FR), Non-Functional (NFR), and Agile User Stories.
   - **Module 03: Architecture**: Modular Monolith vs Microservices visual component flow with Mermaid diagram code viewer.
   - **Module 04: Database Schema**: Collections / Tables inspector with field types, required flags, compound indexes, and database engine switcher.
   - **Module 05: API Designer**: Expandable REST endpoint cards with method badges (GET, POST, PUT, DELETE), payload contracts, and cURL snippets.
   - **Module 06: UI/UX Planner**: WCAG 2.1 AA compliant color token palette, screen hierarchy, and mobile ergonomics guidelines.
   - **Module 07: Roadmap**: 8-phase engineering milestone timeline with progress indicators and deliverables.
   - **Module 08: Tasks Kanban**: Sprint task board with status tabs (`TODO`, `IN_PROGRESS`, `DONE`), priority chips, status toggle, and creation modal.
   - **Module 09: AI Mentor**: Project-aware conversational chat assistant with bubble styling, prompt shortcuts, copy response, and chat reset.
   - **Module 10: Starter Code**: Interactive project directory tree with code viewer and one-tap clipboard copy.
   - **Module 11: Testing Center**: Test suites covering Unit, Integration, API, UI, and Security with execution trigger and coverage metrics.
   - **Module 12: Documentation**: Multi-tab technical viewer for automated README, Abstract, and Software Requirements Specification (SRS).
   - **Module 13: Deployment Center**: Production guides for Render, Vercel, Railway, and MongoDB Atlas with build commands and environment variables.
   - **Module 14: Public Portfolio**: Recruiter-ready project showcase URL generator with strict privacy redaction of secrets and credentials.
10. **Role-Based Access Control (RBAC)**: Strict separation between student accounts and the privileged Admin Management Console with Technology Catalog CRUD.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Mobile Client** | React Native 0.74.5, Expo SDK 51, Expo Router v3.5, TypeScript 5.3 (Strict Mode) |
| **Mobile UI & Styling** | Vanilla React Native StyleSheet, Custom Token Design System, Lucide Icons, React Native SVG |
| **Mobile Storage** | Expo SecureStore (Hardware KeyStore), AsyncStorage, 22-Collection Fallback Engine |
| **Backend API Core** | Node.js, Express.js, TypeScript, REST API (Port 5000 / LAN 192.168.1.4:5000) |
| **Database Layer** | MongoDB Atlas native driver, Embedded JSON fallback database |
| **AI Provider Chain** | Google Gemini 2.5 Flash ➔ OpenAI GPT-4o ➔ Groq LLaMA3 ➔ Deterministic Fallback |
| **Release & Packaging** | Expo Application Services (EAS Build), Android Standalone APK & Production AAB |

---

## 🔒 Security Architecture

- **Zero Client Secrets**: `GEMINI_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`, `JWT_SECRET`, and `MONGODB_URI` remain strictly server-side.
- **Hardware KeyStore**: Tokens are stored via `expo-secure-store`.
- **Public Portfolio Privacy**: Redacts private tasks, environment variables, credentials, and connection strings from public recruiter views.
- **RBAC Shield**: Admin endpoints and UI screens require verified `role === 'ADMIN'`.

---

## 📱 Mobile Screens Directory

```
mobile/
├── app/
│   ├── _layout.tsx                 # Root layout & SafeAreaProvider
│   ├── index.tsx                   # Splash screen & auth routing
│   ├── (auth)/                     # Login, 5-step Register, Forgot Password
│   ├── (onboarding)/               # Welcome, Education, Skills, Goals
│   ├── (tabs)/                     # Home, Explore, Create, Projects, Profile
│   ├── project/[id].tsx            # Blueprint detail & fork
│   ├── project/validation.tsx      # Feasibility & MVP scope
│   ├── workspace/[id].tsx          # 14 Module workspace hub
│   ├── workspace/overview.tsx      # Module 01: Overview
│   ├── workspace/requirements.tsx  # Module 02: Requirements
│   ├── workspace/architecture.tsx  # Module 03: Architecture
│   ├── workspace/database.tsx      # Module 04: Database Schema
│   ├── workspace/api.tsx           # Module 05: API Designer
│   ├── workspace/uiux.tsx          # Module 06: UI/UX Planner
│   ├── workspace/roadmap.tsx       # Module 07: Roadmap
│   ├── workspace/tasks.tsx         # Module 08: Tasks Kanban
│   ├── workspace/assistant.tsx     # Module 09: AI Chat Mentor
│   ├── workspace/starter-code.tsx  # Module 10: Starter Code
│   ├── workspace/testing.tsx       # Module 11: Testing Center
│   ├── workspace/documentation.tsx # Module 12: Documentation
│   ├── workspace/deployment.tsx    # Module 13: Deployment Center
│   ├── workspace/portfolio.tsx     # Module 14: Public Portfolio
│   ├── notifications.tsx           # In-app notifications
│   ├── settings.tsx                # API URL switcher & settings
│   └── admin/index.tsx             # RBAC admin portal
```

---

## ⚡ Quick Start & Development

### 1. Start the Backend API Server
```bash
npm install
npm run dev:server
# Server will listen on http://localhost:5000 and http://192.168.1.4:5000
```

### 2. Launch the Mobile Application
```bash
cd mobile
npm install

# Run TypeScript verification
npx tsc --noEmit

# Run automated mobile test suite
npm run test

# Start Expo dev server
npx expo start --lan
```

Scan the QR code with **Expo Go** on Android or an Android emulator.

---

## 📦 Android APK & AAB Generation

The application is linked to Expo Cloud under EAS Project ID `7d440d7f-5331-4c93-abe7-640f0e09a0fe` (`monishhhh`).

### Generate Development / Preview APK:
```bash
cd mobile
eas build --platform android --profile preview
```
Download the resulting `.apk` file directly onto any physical Android device.

### Generate Production Google Play AAB:
```bash
cd mobile
eas build --platform android --profile production-aab
```

---

## 🧪 Automated Test Verification

The mobile test suite executes 25 critical verification assertions:
```bash
cd mobile
npm run test
```
Result: **25 / 25 checks passed (100% Score, 0 failures)**.

---

## 👥 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Student** | `student@projectforge.ai` | `Student@123` |
| **Admin** | `admin@projectforge.ai` | `Admin@123` |

Tap **1-Tap Test Credentials** on the mobile login screen to instantly autofill either account.

---

## 📄 License

MIT License — Copyright (c) 2026 ProjectForge AI.
