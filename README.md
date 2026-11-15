# SycnOps AI • Engineering Cockpit & Architecture Platform

![Version](https://img.shields.io/badge/version-2.0.28-emerald.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg)
![Node](https://img.shields.io/badge/Node.js-18+-green.svg)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFA611.svg)
![License](https://img.shields.io/badge/License-MIT-gray.svg)

**SycnOps AI** is an advanced developer intelligence and workflow automation platform. It bridges the gap between static codebases, runtime execution traces, CI/CD pipelines, and GitHub telemetry. Powered by Abstract Syntax Tree (AST) scanning, interactive node graph architectures, automated quality audits, and Firebase Cloud Firestore, SycnOps gives engineering teams full situational awareness of their applications.

---

## 🌟 Core Features

### 1. ⚡ Interactive File Flow (AST Dependency Graph)
- **Deep AST Relationship Scanning**: Parses JavaScript/TypeScript imports, CommonJS `require()`, HTTP endpoints (`fetch`, `axios`), and database operations (Firebase Firestore).
- **Interactive Node Canvas**: Built on `@xyflow/react` with high-performance viewport culling (`onlyRenderVisibleElements`) and memoized custom node architectures.
- **Architectural Diagnostics**: Automatically flags **orphan files**, **disconnected components**, and **circular dependency loops** with visual indicators.
- **Path Tracing Engine**: Select source and target files to calculate and visualize end-to-end communication paths.
- **Floating Zoom & View Controls**: Prominent viewport controls featuring `[+]`, `[100%]`, `[−]`, and `[Fit Screen]` buttons.
- **Integrated Code Inspector**: Live syntax review, functions count, exported symbols, incoming/outgoing edge stats, and file metrics.

### 2. 🌳 File Topology & Architecture Tree
- **Hierarchical Directory Tree**: Explore project structure with recursive folding, file size inspection, and line counters.
- **Module Clustering**: Categorizes files into **Frontend**, **Backend**, **Database Models**, and **Configs/Manifests**.
- **Interactive Filtering**: Real-time category counters filter the tree and highlight module distribution across the workspace.

### 3. 🛡️ Code Quality & Architecture Auditor
- **Architectural Health Scoring**: Computes a dynamic Quality Index based on circular import cycles, modular cohesion, and isolation metrics.
- **Automated Verification**: Validates TypeScript strict mode, Firestore database guards, and dependency health.
- **Audited File Catalog**: Searchable, filterable file inventory categorizing maintainability status (`Verified` vs `Isolated`).

### 4. 🚀 5-Stage CI/CD Pipeline Orchestrator
- **Multi-Stage Real Execution**:
  1. **Repository Import**: Validates working tree, checks out branch, and resolves commits via `simple-git`.
  2. **Dependency Analysis**: Audits package manifests (`package.json`) across frontend and backend.
  3. **Linting**: Runs AST lint rules and syntax validations.
  4. **Automated Testing**: Executes unit and integration test suites.
  5. **Production Build**: Compiles TypeScript and triggers Vite production asset bundling.
- **Multi-View Analytics**: Switch between **Stage Breakdown Cards**, **Step-by-Step Table**, **Summary Metrics**, and **Unified Diagnostics**.
- **Execution History & Live Logs**: Real-time terminal log outputs, duration timers, environment targeting, and exit code tracking.

### 5. 🧭 Code Flow Execution Tracing
- **End-to-End User Journey Mapping**: Visualizes complete transaction flows (e.g., Campus Lost & Found report flow).
- **Layer-by-Layer Propagation**: Traces user interaction in React components &rarr; HTTP API requests &rarr; Express route handlers &rarr; Firestore database persistence.

### 6. 📦 Repository Management & Live GitHub Sync
- **Live GitHub Integration**: Import public and private GitHub repositories to synchronize pull requests, issues, commits, stars, and language breakdowns.
- **Custom Studio Repositories**: Create and manage local workspace repositories without requiring GitHub credentials.
- **Safe Repository Removal**: Individual removal modal and global **Remove All Links** action with workspace state persistence.

### 7. 🔐 Firebase Cloud Authentication & Firestore Persistence
- **Multiple Auth Providers**: Email/Password, Google OAuth, and GitHub OAuth.
- **Popup-Blocker Bypass**: Native fallback to `signInWithRedirect` and `getRedirectResult` ensures seamless sign-in across all browsers.
- **Cloud Firestore Backend**: Migrated from legacy MongoDB to Firebase Cloud Firestore for scalable workspace document storage.

### 8. 📊 Engineering Cockpit (Dashboard)
- Real-time pulse of connected repositories, active pull requests, open issues, and recent commit velocity.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, `@xyflow/react`, Lucide Icons, React Router 6, TanStack React Query.
- **Backend**: Node.js, Express, Firebase Admin SDK, Babel AST Parser (`@babel/parser`, `@babel/traverse`), `simple-git`, JWT Auth, bcryptjs.
- **Database & Auth**: Google Cloud Firestore, Firebase Authentication.
- **DevOps**: Docker, Docker Compose, Concurrently.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 1. Installation

Clone the repository and install dependencies at root, frontend, and backend:

```bash
git clone https://github.com/PukhrajSoni27/SycnOps.git
cd SycnOps

# Install workspace root dependencies (concurrently)
npm install

# Install frontend and backend packages
npm --prefix frontend install
npm --prefix backend install
```

### 2. Environment Configuration

#### Frontend (`frontend/.env`):
```env
VITE_API_URL=/api

# Firebase Client Configuration (Firebase Console → Project Settings)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1005863641606
VITE_FIREBASE_APP_ID=1:1005863641606:web:...
VITE_FIREBASE_MEASUREMENT_ID=G-...
```

#### Backend (`backend/.env` or `backend/backend.env`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secure_random_jwt_secret

# Optional: GitHub Personal Access Token (for higher API rate limits)
GITHUB_TOKEN=ghp_...

# Optional: Firebase Admin Service Account (falls back to in-memory mode if omitted)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
```

### 3. Running Development Servers

Run both the frontend and backend concurrently with a single command from the project root:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 📜 Available NPM Scripts

### Root Workspace
- `npm run dev` - Runs both Frontend (`:3000`) and Backend (`:5000`) simultaneously via `concurrently`.
- `npm run dev:frontend` - Starts only the Vite frontend dev server.
- `npm run dev:backend` - Starts only the Express backend server with Node watch mode.
- `npm run build` - Compiles TypeScript and builds production assets for the frontend.
- `npm run lint` - Runs ESLint across frontend files.

### Frontend
- `cd frontend && npm run dev` - Start Vite dev server on port 3000.
- `cd frontend && npm run build` - Full production build (`tsc && vite build`).
- `cd frontend && npm run typecheck` - Verify TypeScript typings with `tsc --noEmit`.

### Backend
- `cd backend && npm start` - Start Express production server.
- `cd backend && npm run dev` - Start Express server in `--watch` mode.

---

## 📂 Project Architecture

```
SycnOps/
├── frontend/                         # React 18 + TypeScript + Vite Client
│   ├── src/
│   │   ├── components/               # UI components, Plasma, SocialAuth, MainLayout
│   │   ├── hooks/                    # TanStack React Query hooks (useApi.ts)
│   │   ├── lib/                      # Firebase client initialization
│   │   ├── pages/                    # Core view pages
│   │   │   ├── Dashboard.tsx         # Engineering cockpit & metrics
│   │   │   ├── Repositories.tsx      # Repository management & live GitHub sync
│   │   │   ├── RepoDetail.tsx        # Single repo overview & language stats
│   │   │   ├── RepoAnalysis.tsx      # Health scores, bug lists & security checks
│   │   │   ├── Pipeline.tsx          # 5-stage CI/CD execution orchestrator
│   │   │   ├── CodeFlow.tsx          # Architecture transaction tracing
│   │   │   ├── FileFlow.tsx          # Interactive AST node graph
│   │   │   ├── FileTopology.tsx      # Directory tree topology & module clustering
│   │   │   ├── CodeQuality.tsx       # Codebase maintainability & architecture audit
│   │   │   ├── PullRequests.tsx      # Pull request tracker
│   │   │   ├── Issues.tsx            # Issue manager
│   │   │   ├── Analytics.tsx         # Velocity metrics & charts
│   │   │   ├── Profile.tsx           # User settings & identity
│   │   │   ├── Login.tsx             # Auth with popup & redirect support
│   │   │   └── Register.tsx          # User registration
│   │   ├── services/                 # API client & TypeScript interfaces (api.ts)
│   │   ├── App.tsx                   # Route definitions & guards
│   │   └── main.tsx                  # React DOM mount point
│   ├── vite.config.ts                # Vite build configuration & server proxies
│   └── tsconfig.json                 # TypeScript project configuration
├── backend/                          # Express REST API Server
│   ├── config/                       # Firebase Admin SDK initialization
│   ├── lib/
│   │   ├── fileFlowScanner.js        # AST file parser, imports & database scanner
│   │   ├── pipelineOrchestrator.js   # 5-stage pipeline command runner
│   │   ├── astFlowAnalyzer.js        # Code Flow trace builder
│   │   ├── securityScanner.js        # Vulnerability detection
│   │   └── github.js                 # GitHub REST API v3 client
│   ├── index.js                      # Express routes, controllers & cache fallback
│   └── package.json
├── docker/                           # Containerization files
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── package.json                      # Workspace root orchestration script
└── README.md                         # Project documentation
```

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check |
| `POST` | `/api/auth/login` | User login with email/password |
| `POST` | `/api/auth/social` | Social sign-in (Google / GitHub token exchange) |
| `GET` | `/api/repositories` | List all repositories in active workspace |
| `POST` | `/api/repositories/import` | Import repository via GitHub or custom name |
| `DELETE` | `/api/repositories/:id` | Remove specific repository from workspace |
| `DELETE` | `/api/repositories/all` | Remove all linked repositories from workspace |
| `GET` | `/api/pipelines` | Get CI/CD pipeline runs and stage logs |
| `POST` | `/api/pipelines/trigger` | Trigger live multi-stage pipeline run |
| `GET` | `/api/file-flow/graph` | Fetch AST nodes, communication edges & summaries |
| `GET` | `/api/file-flow/files` | Get parsed file catalog with lines and categories |
| `GET` | `/api/file-flow/paths` | Trace communication paths between two nodes |
| `POST` | `/api/file-flow/scan` | Rescan local codebase AST and rebuild graph |

---

## 🐳 Docker Deployment

To launch the complete application stack via Docker:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
