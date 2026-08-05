import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SycnOps AI Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// Repositories API
app.get('/api/repositories', (req, res) => {
  const mockRepos = [
    { id: 1, name: 'sycnops-ai-web', stars: 124, forks: 38, openIssues: 5, language: 'JavaScript', visibility: 'Public', updatedAt: '2 hours ago' },
    { id: 2, name: 'workflow-engine', stars: 89, forks: 14, openIssues: 2, language: 'TypeScript', visibility: 'Public', updatedAt: '5 hours ago' },
    { id: 3, name: 'analytics-service', stars: 45, forks: 8, openIssues: 0, language: 'Python', visibility: 'Private', updatedAt: '1 day ago' },
    { id: 4, name: 'ai-prompt-pipeline', stars: 210, forks: 62, openIssues: 11, language: 'Python', visibility: 'Public', updatedAt: '3 days ago' }
  ]
  res.json({ success: true, data: mockRepos })
})

// Pull Requests API
app.get('/api/pull-requests', (req, res) => {
  const mockPRs = [
    { id: 101, title: 'feat: Add AI code recommendation widget', repo: 'sycnops-ai-web', author: 'johndoe', status: 'open', comments: 4, createdAt: '3 hours ago' },
    { id: 102, title: 'fix: Resolve chart rendering lag in analytics', repo: 'analytics-service', author: 'sarah_m', status: 'merged', comments: 2, createdAt: '1 day ago' },
    { id: 103, title: 'refactor: Upgrade tailwind tokens & components', repo: 'sycnops-ai-web', author: 'alex_dev', status: 'under_review', comments: 7, createdAt: '2 days ago' }
  ]
  res.json({ success: true, data: mockPRs })
})

// Issues API
app.get('/api/issues', (req, res) => {
  const mockIssues = [
    { id: 201, title: 'OAuth token refresh failing intermittently', repo: 'sycnops-ai-web', priority: 'high', label: 'bug', state: 'open', assignee: 'johndoe' },
    { id: 202, title: 'Add dark mode toggle in navbar settings', repo: 'sycnops-ai-web', priority: 'medium', label: 'enhancement', state: 'open', assignee: 'sarah_m' },
    { id: 203, title: 'Update documentation for webhook events', repo: 'workflow-engine', priority: 'low', label: 'documentation', state: 'closed', assignee: 'alex_dev' }
  ]
  res.json({ success: true, data: mockIssues })
})

// Analytics API
app.get('/api/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      totalCommits: 342,
      mergedPRs: 87,
      issuesClosed: 115,
      codeReviewsCount: 64,
      velocityScore: 94.5,
      dailyActivity: [
        { day: 'Mon', commits: 14, prs: 3 },
        { day: 'Tue', commits: 22, prs: 5 },
        { day: 'Wed', commits: 30, prs: 8 },
        { day: 'Thu', commits: 18, prs: 4 },
        { day: 'Fri', commits: 26, prs: 6 },
        { day: 'Sat', commits: 8, prs: 1 },
        { day: 'Sun', commits: 5, prs: 0 }
      ]
    }
  })
})

// AI Assistant API Endpoint
app.post('/api/ai-assistant', (req, res) => {
  const { message } = req.body || {}
  const reply = message
    ? `SycnOps AI response to: "${message}". Processed workflow prompt successfully.`
    : 'Hello! I am your SycnOps AI assistant. How can I help optimize your workflow today?'

  res.json({
    success: true,
    response: reply,
    timestamp: new Date().toISOString()
  })
})

// Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' })
  }
  res.json({
    success: true,
    token: 'mock-jwt-token-sycnops-ai',
    user: { id: 1, name: 'John Doe', email, role: 'Developer' }
  })
})

app.listen(PORT, () => {
  console.log(`🚀 SycnOps AI Backend running on http://localhost:${PORT}`)
})
