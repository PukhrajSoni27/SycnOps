# SycnOps AI

SycnOps AI is a full-stack web application that helps developers automate their daily development workflow. It integrates with GitHub to monitor repositories, pull requests, commits, and issues in real-time. The platform provides analytics, automated notifications, AI-powered summaries, documentation generation, and productivity insights through a modern dashboard.

## Features

- **GitHub Integration**: Monitor repositories, pull requests, commits, and issues in real-time
- **Advanced Analytics**: Comprehensive insights into development workflow with detailed metrics
- **AI-Powered Features**: Automatic summaries, documentation generation, and intelligent code recommendations
- **Workflow Automation**: Automate repetitive tasks and streamline development processes
- **Smart Notifications**: Real-time alerts for important events and updates
- **Team Collaboration**: Enhanced productivity with shared insights and collaborative features

## Quick Start (Root Commands)

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### 1. Install & Start Frontend & Backend

```bash
# Install frontend & backend dependencies
cd frontend && npm install && cd ../backend && npm install && cd ..

# Start frontend dev server (port 3000)
npm run dev

# Start backend dev server (port 5000)
npm run dev:backend
```

### 2. Available Root Scripts

- `npm run dev` - Start frontend development server on `http://localhost:3000`
- `npm run dev:backend` - Start backend REST API server on `http://localhost:5000`
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint across frontend components

## Project Structure

```
SycnOps/
├── frontend/                   # React 18 + Vite frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components & MainLayout
│   │   ├── pages/              # App pages (Dashboard, Repositories, PRs, etc.)
│   │   ├── lib/                # Utility helpers
│   │   ├── App.jsx             # React router configuration
│   │   └── main.jsx            # Entry point
│   ├── eslint.config.js        # ESLint 9 configuration
│   ├── vite.config.js          # Vite build & chunk configuration
│   └── package.json
├── backend/                    # Express REST API backend
│   ├── index.js                # API routes & server entry point
│   ├── package.json
│   └── .env.example
├── docker/                     # Docker configuration
│   ├── Dockerfile.frontend     # Frontend container spec
│   ├── Dockerfile.backend      # Backend container spec
│   └── docker-compose.yml      # Multi-service stack
├── docker-compose.yml          # Root docker compose setup
├── package.json                # Root orchestration workspace config
└── README.md
```

## Backend API Endpoints

- `GET /api/health` - Server health check
- `GET /api/repositories` - Repositories data endpoint
- `GET /api/pull-requests` - Pull requests tracking endpoint
- `GET /api/issues` - Issue tracking endpoint
- `GET /api/analytics` - Workflow analytics data
- `POST /api/ai-assistant` - AI assistant chat endpoint
- `POST /api/auth/login` - User authentication

## Docker Workflow

To build and run both frontend and backend in Docker containers:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## License

This project is licensed under the MIT License.
