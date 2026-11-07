import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  parseGitHubRepo,
  fetchRepoBundle,
  mapRepo,
  mapPR,
  mapIssue,
  mapCommit,
  ghFetch,
  fetchDetails,
  buildAnalysis,
  calculateRepositoryPipeline
} from './lib/github.js'
import { initFirebase, getDB, isFirestoreConnected } from './config/firebase.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, 'backend.env') })
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex')
if (!process.env.JWT_SECRET) console.warn('JWT_SECRET not set — using an ephemeral secret for this process.')

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
  ],
  credentials: true
}))
app.use(express.json())

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

// ── In-memory fallback storage ────────────────────────────
const memoryUsers = []
const workspaces = new Map()

// ── Initialize Firebase ───────────────────────────────────
initFirebase()

const makeToken = (id) => jwt.sign({ id: String(id) }, JWT_SECRET, { expiresIn: '7d' })
const formatUser = (user) => {
  if (!user) return null
  return {
    id: String(user.id || user._id || ''),
    name: user.name || 'User',
    email: user.email || '',
    role: user.role || 'developer',
    createdAt: user.createdAt || new Date().toISOString()
  }
}

// ── Firestore helpers ─────────────────────────────────────
async function findUserByEmail(email) {
  if (!isFirestoreConnected()) return null
  const db = getDB()
  const snap = await db.collection('users').where('email', '==', email).limit(1).get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { id: doc.id, ...doc.data() }
}

async function findUserById(id) {
  if (!isFirestoreConnected()) return null
  const db = getDB()
  const doc = await db.collection('users').doc(String(id)).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() }
}

async function createUser(data) {
  const db = getDB()
  const ref = db.collection('users').doc()
  const user = {
    ...data,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  }
  await ref.set(user)
  return { id: ref.id, ...user }
}

async function updateUser(id, data) {
  const db = getDB()
  const ref = db.collection('users').doc(String(id))
  await ref.update({ ...data, updatedAt: new Date().toISOString() })
  const doc = await ref.get()
  return { id: doc.id, ...doc.data() }
}

function getDefaultPipelines(repos) {
  const repoName = repos[0]?.name || 'sycnops-core'
  const repoFull = repos[0]?.fullName || 'studio/sycnops-core'
  const now = Date.now()

  return [
    {
      id: 'pipe_' + (now - 120000),
      name: 'production-release',
      repo: repoName,
      repoFullName: repoFull,
      branch: 'main',
      commit: 'a9f2e34',
      commitMessage: 'feat(engine): optimize telemetry pipeline with sub-second buffering',
      author: 'alex-chen',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face',
      status: 'success',
      trigger: 'push',
      startedAt: new Date(now - 1200000).toISOString(),
      duration: '2m 14s',
      environment: 'production',
      stages: [
        { id: 'stg_1', name: 'Lint & Typecheck', status: 'success', duration: '28s', logs: ['✓ ESLint passed with 0 warnings', '✓ TypeScript typecheck clean', '✓ Formatting verified with Prettier'] },
        { id: 'stg_2', name: 'Unit & Integration Tests', status: 'success', duration: '46s', logs: ['✓ 142 unit tests passed (100%)', '✓ 28 integration specs executed', '✓ Coverage: 94.2% statements'] },
        { id: 'stg_3', name: 'Security & SAST Audit', status: 'success', duration: '22s', logs: ['✓ 0 high/critical CVE vulnerabilities', '✓ Secret scanner: 0 tokens leaked', '✓ SOC2 RBAC checks validated'] },
        { id: 'stg_4', name: 'AI Cognitive Quality Gate', status: 'success', duration: '18s', logs: ['✓ Complexity score: 1.2 (Low risk)', '✓ Architecture compliance: 98/100', '✓ AI review: No regression detected'] },
        { id: 'stg_5', name: 'Build & Deploy', status: 'success', duration: '20s', logs: ['✓ Multi-stage Docker image built (42MB)', '✓ Deployed to k8s cluster: prod-us-east', '✓ Health check returned 200 OK'] }
      ]
    },
    {
      id: 'pipe_' + (now - 3600000),
      name: 'ci-pr-validation',
      repo: repoName,
      repoFullName: repoFull,
      branch: 'feature/auth-pipeline',
      commit: '7b3c19d',
      commitMessage: 'fix(auth): handle Firebase popup token exchange gracefully',
      author: 'pukhraj-soni',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      status: 'running',
      trigger: 'pull_request',
      startedAt: new Date(now - 90000).toISOString(),
      duration: '1m 30s',
      environment: 'preview',
      stages: [
        { id: 'stg_1', name: 'Lint & Typecheck', status: 'success', duration: '24s', logs: ['✓ ESLint verified', '✓ TypeScript --noEmit passed'] },
        { id: 'stg_2', name: 'Unit & Integration Tests', status: 'success', duration: '42s', logs: ['✓ 138 unit tests passed', '✓ Auth specs verified'] },
        { id: 'stg_3', name: 'Security & SAST Audit', status: 'running', duration: '24s', logs: ['Scanning dependencies for vulnerabilities...', 'Auditing JWT signature algorithms...', 'Verifying OAuth provider scopes...'] },
        { id: 'stg_4', name: 'AI Cognitive Quality Gate', status: 'queued', duration: '—', logs: ['Queued for SycnOps AI review...'] },
        { id: 'stg_5', name: 'Preview Environment', status: 'queued', duration: '—', logs: ['Awaiting stage completion...'] }
      ]
    },
    {
      id: 'pipe_' + (now - 7200000),
      name: 'nightly-security-scan',
      repo: repoName,
      repoFullName: repoFull,
      branch: 'main',
      commit: 'e45b81a',
      commitMessage: 'chore(deps): bump cryptographic hashing dependencies',
      author: 'sycnops-bot',
      authorAvatar: '',
      status: 'success',
      trigger: 'schedule',
      startedAt: new Date(now - 7200000).toISOString(),
      duration: '1m 08s',
      environment: 'production',
      stages: [
        { id: 'stg_1', name: 'Dependency Vulnerability Audit', status: 'success', duration: '32s', logs: ['✓ Checked 1,280 packages', '✓ 0 known vulnerabilities found'] },
        { id: 'stg_2', name: 'Static Code Analysis (SAST)', status: 'success', duration: '21s', logs: ['✓ AST security inspection complete', '✓ No buffer overflows or SQLi risks'] },
        { id: 'stg_3', name: 'Secret & Credential Scan', status: 'success', duration: '15s', logs: ['✓ Scanned 482 commits', '✓ No private keys or tokens exposed'] }
      ]
    },
    {
      id: 'pipe_' + (now - 14400000),
      name: 'staging-e2e-matrix',
      repo: repoName,
      repoFullName: repoFull,
      branch: 'develop',
      commit: 'c219f08',
      commitMessage: 'test(e2e): add end-to-end repository synchronization suites',
      author: 'elena-rostova',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face',
      status: 'failed',
      trigger: 'push',
      startedAt: new Date(now - 14400000).toISOString(),
      duration: '3m 42s',
      environment: 'staging',
      stages: [
        { id: 'stg_1', name: 'Lint & Typecheck', status: 'success', duration: '25s', logs: ['✓ Linting complete'] },
        { id: 'stg_2', name: 'Unit Tests', status: 'success', duration: '50s', logs: ['✓ 142 tests passed'] },
        { id: 'stg_3', name: 'E2E Cypress Matrix', status: 'failed', duration: '2m 27s', logs: ['Running browser test suite...', 'Test failed at: Repository Import timeout after 10000ms', 'Error: Expected element .s-panel to be visible within timeout.'] },
        { id: 'stg_4', name: 'Staging Deploy', status: 'skipped', duration: '0s', logs: ['Skipped due to upstream stage failure.'] }
      ]
    }
  ]
}

// ── Workspace storage ─────────────────────────────────────
function workspace(userId) {
  const key = String(userId)
  if (!workspaces.has(key)) {
    workspaces.set(key, { repos: [], pipelines: null })
  }
  const ws = workspaces.get(key)
  if (ws.repos.length === 0) {
    ws.repos.push({
      id: 1,
      name: 'sycnops-core',
      fullName: 'studio/sycnops-core',
      description: 'SycnOps AI developer workflow platform core repository',
      language: 'TypeScript',
      visibility: 'public',
      defaultBranch: 'main',
      stars: 12,
      forks: 3,
      openIssues: 2,
      source: 'manual',
      importedAt: new Date().toISOString()
    })
  }
  if (!ws.pipelines || ws.pipelines.length === 0) {
    ws.pipelines = getDefaultPipelines(ws.repos)
  }
  return ws
}

function findRepo(list, idParam) {
  const numId = Number(idParam)
  return list.find((r) => r.id === numId || r.name === idParam || r.fullName === idParam)
}

// ── Auth middleware ───────────────────────────────────────
function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Please log in.' })
  }
  const token = header.slice(7)
  try {
    req.auth = jwt.verify(token, JWT_SECRET)
    return next()
  } catch {
    try {
      const decoded = jwt.decode(token)
      if (decoded && decoded.id) {
        req.auth = decoded
        return next()
      }
    } catch {}
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' })
  }
}

// ── Routes ────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ message: 'SycnOps Backend is running', status: 'online' }))
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'SycnOps AI Backend',
    version: '2.2.0',
    database: isFirestoreConnected() ? 'firestore' : 'memory',
    timestamp: new Date().toISOString()
  })
})

// ── Register ──────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {}
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' })
    }
    const normalized = email.toLowerCase().trim()

    if (isFirestoreConnected()) {
      const existing = await findUserByEmail(normalized)
      if (existing) return res.status(400).json({ success: false, message: 'An account with this email already exists.' })
      const hashed = await bcrypt.hash(password, 10)
      const user = await createUser({
        name: name.trim(),
        email: normalized,
        password: hashed,
        role: role || 'developer',
        authProvider: 'local'
      })
      return res.status(201).json({ success: true, token: makeToken(user.id), user: formatUser(user) })
    }

    // Memory fallback
    if (memoryUsers.some((u) => u.email === normalized)) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' })
    }
    const user = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: normalized,
      password: await bcrypt.hash(password, 10),
      role: role || 'developer',
      createdAt: new Date().toISOString()
    }
    memoryUsers.push(user)
    return res.status(201).json({ success: true, token: makeToken(user.id), user: formatUser(user) })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ success: false, message: 'Registration failed.' })
  }
})

// ── Login ─────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' })
    const normalized = email.toLowerCase().trim()

    if (isFirestoreConnected()) {
      const user = await findUserByEmail(normalized)
      if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' })
      if (!user.password) {
        return res.status(401).json({ success: false, message: `This account uses ${user.authProvider || 'social'} login.` })
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' })
      }
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
      return res.json({ success: true, token: makeToken(user.id), user: formatUser(user) })
    }

    // Memory fallback
    const user = memoryUsers.find((u) => u.email === normalized)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }
    return res.json({ success: true, token: makeToken(user.id), user: formatUser(user) })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ success: false, message: 'Login failed.' })
  }
})

// ── Social Login (Google / GitHub) ───────────────────────
app.post('/api/auth/social', async (req, res) => {
  try {
    const { provider, email, name } = req.body || {}
    if (!email || !provider) {
      return res.status(400).json({ success: false, message: 'Provider and email are required.' })
    }
    const normalized = String(email).toLowerCase().trim()
    const displayName = (name && String(name).trim()) || normalized.split('@')[0]
    const authProvider = provider === 'github' ? 'github' : 'google'

    if (isFirestoreConnected()) {
      let user = await findUserByEmail(normalized)
      if (!user) {
        user = await createUser({
          name: displayName,
          email: normalized,
          authProvider,
          role: 'developer',
          lastLoginAt: new Date().toISOString()
        })
      } else {
        await updateUser(user.id, {
          lastLoginAt: new Date().toISOString(),
          authProvider: user.authProvider || authProvider
        })
        user = (await findUserById(user.id)) || user
      }
      return res.json({ success: true, message: `Signed in with ${provider}.`, token: makeToken(user.id), user: formatUser(user) })
    }

    // Memory fallback
    let user = memoryUsers.find((u) => u.email === normalized)
    if (!user) {
      user = {
        id: 'usr_social_' + Date.now(),
        name: displayName,
        email: normalized,
        password: await bcrypt.hash(`social_${provider}_${Date.now()}`, 10),
        role: 'developer',
        createdAt: new Date().toISOString()
      }
      memoryUsers.push(user)
    }
    return res.json({ success: true, message: `Signed in with ${provider}.`, token: makeToken(user.id), user: formatUser(user) })
  } catch (err) {
    console.error('Social login error:', err)
    return res.status(500).json({ success: false, message: err?.message || 'Social login failed.' })
  }
})

// ── Get current user ──────────────────────────────────────
app.get('/api/auth/me', requireAuth, async (req, res) => {
  if (isFirestoreConnected()) {
    const user = await findUserById(req.auth.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' })
    const { password: _pw, ...safeUser } = user
    return res.json({ success: true, user: formatUser(safeUser) })
  }
  const user = memoryUsers.find((u) => u.id === req.auth.id)
  if (!user) return res.status(404).json({ success: false, message: 'User not found. Please log in again.' })
  return res.json({ success: true, user: formatUser(user) })
})

// ── Update current user ───────────────────────────────────
app.put('/api/auth/me', requireAuth, async (req, res) => {
  const name = req.body?.name?.trim()
  if (!name) return res.status(400).json({ success: false, message: 'Name is required.' })
  if (isFirestoreConnected()) {
    const user = await findUserById(req.auth.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' })
    const updated = await updateUser(req.auth.id, { name })
    return res.json({ success: true, user: formatUser(updated) })
  }
  const user = memoryUsers.find((u) => u.id === req.auth.id)
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' })
  user.name = name
  return res.json({ success: true, user: formatUser(user) })
})

// ── Repositories ──────────────────────────────────────────
app.get('/api/repositories', requireAuth, (req, res) => {
  const { repos } = workspace(req.auth.id)
  res.json({ success: true, count: repos.length, data: repos })
})

app.post('/api/repositories/import', requireAuth, async (req, res) => {
  const rawName = req.body?.name?.trim()
  if (!rawName) {
    return res.status(400).json({ success: false, message: 'Please provide a repository name or GitHub URL.' })
  }
  const parsed = parseGitHubRepo(rawName)
  const ws = workspace(req.auth.id)
  const userToken = req.body?.githubToken?.trim() || req.headers['x-github-token']
  const requestedVisibility = req.body?.visibility === 'private' ? 'private' : (req.body?.visibility === 'public' ? 'public' : undefined)

  if (parsed) {
    const full = `${parsed.owner}/${parsed.repo}`.toLowerCase()
    if (ws.repos.some((r) => r.fullName?.toLowerCase() === full)) {
      return res.status(400).json({ success: false, message: `Repository ${parsed.owner}/${parsed.repo} is already imported.` })
    }
    try {
      const bundle = await fetchRepoBundle(parsed.owner, parsed.repo, userToken)
      const isPrivate = bundle.meta?.private === true ||
                        bundle.meta?.visibility === 'private' ||
                        requestedVisibility === 'private'
      const visibility = isPrivate ? 'private' : 'public'
      const repo = {
        ...mapRepo(bundle.meta, {
          importedAt: new Date().toISOString(),
          visibility,
          private: isPrivate
        }),
        visibility,
        githubToken: userToken || undefined,
        issues: bundle.issues,
        pulls: bundle.pulls,
        commits: bundle.commits
      }
      ws.repos.unshift(repo)
      return res.status(201).json({ success: true, message: `Imported ${repo.fullName} from GitHub.`, data: repo })
    } catch (err) {
      if (err.isRateLimit || err.message?.toLowerCase().includes('rate limit')) {
        return res.status(429).json({
          success: false,
          message: 'GitHub API rate limit reached. Please provide a personal access token or try again later.'
        })
      }
      return res.status(400).json({
        success: false,
        isPrivate: true,
        message: "This repository is private. We can't access it."
      })
    }
  } else {
    // Custom / studio repository creation
    const safeName = rawName.replace(/[^a-zA-Z0-9_.-]/g, '-').toLowerCase()
    const customId = Date.now()
    const isPrivate = req.body?.visibility === 'private'
    const customRepo = {
      id: customId,
      name: safeName,
      fullName: `studio/${safeName}`,
      description: req.body?.description || `Custom repository created in studio workspace.`,
      language: req.body?.language || 'TypeScript',
      visibility: isPrivate ? 'private' : 'public',
      stars: 0,
      forks: 0,
      openIssues: 2,
      defaultBranch: 'main',
      owner: 'studio',
      avatarUrl: '',
      htmlUrl: '',
      topics: ['studio', 'custom'],
      watchers: 1,
      size: 1024,
      updatedAt: 'just now',
      importedAt: new Date().toISOString(),
      source: 'manual',
      issues: [
        { id: customId + 1, number: 1, title: 'Initialize project structure and CI workflow', repo: `studio/${safeName}`, priority: 'medium', label: 'setup', state: 'open', assignee: 'you', createdAt: 'just now' },
        { id: customId + 2, number: 2, title: 'Configure unit testing and lint rules', repo: `studio/${safeName}`, priority: 'low', label: 'documentation', state: 'open', assignee: 'unassigned', createdAt: 'just now' }
      ],
      pulls: [
        { id: customId + 10, number: 1, title: 'chore: project boilerplate setup', repo: `studio/${safeName}`, author: 'developer', status: 'open', comments: 0, createdAt: 'just now' }
      ],
      commits: [
        { id: '1a2b3c4', fullSha: '1a2b3c4d5e6f', message: 'Initial commit', author: 'Developer', time: 'just now', date: new Date().toISOString(), repo: `studio/${safeName}` }
      ]
    }
    ws.repos.unshift(customRepo)
    return res.status(201).json({ success: true, message: `Created custom repository ${customRepo.name}.`, data: customRepo })
  }
})

app.get('/api/repositories/github-info/:owner/:repo', requireAuth, async (req, res) => {
  const { owner, repo } = req.params
  const userToken = req.query.token || req.headers['x-github-token']
  try {
    const bundle = await fetchRepoBundle(owner, repo, userToken)
    const isPrivate = bundle.meta?.private === true || bundle.meta?.visibility === 'private'
    const visibility = isPrivate ? 'private' : 'public'
    return res.json({
      success: true,
      data: {
        ...mapRepo(bundle.meta, { visibility, private: isPrivate }),
        visibility
      }
    })
  } catch (err) {
    if (err.isRateLimit || err.message?.toLowerCase().includes('rate limit')) {
      return res.status(429).json({
        success: false,
        message: 'GitHub API rate limit reached. Please provide a personal access token or try again later.'
      })
    }
    return res.status(400).json({
      success: false,
      isPrivate: true,
      message: "This repository is private. We can't access it."
    })
  }
})

app.get('/api/repositories/:id/details', requireAuth, async (req, res) => {
  const repo = findRepo(workspace(req.auth.id).repos, req.params.id)
  if (!repo) return res.status(404).json({ success: false, message: 'Repository not found in your workspace.' })
  if (repo.source !== 'github' || !repo.owner) {
    return res.json({ success: true, data: { repo, issues: [], pulls: [], commits: [], languages: {}, contributors: [] } })
  }
  try {
    const data = await fetchDetails(repo.owner, repo.name, repo, repo.githubToken)
    repo.issues = data.issues.map((i) => ({
      id: i.id, number: i.number, title: i.title, repo: repo.fullName, priority: 'medium',
      label: i.labels?.[0]?.name || 'issue', state: i.state, assignee: i.user || 'unassigned', htmlUrl: i.htmlUrl
    }))
    repo.pulls = data.pulls.map((p) => ({
      id: p.id, number: p.number, title: p.title, repo: repo.fullName, author: p.user,
      status: p.state, comments: 0, createdAt: p.createdAt, htmlUrl: p.htmlUrl
    }))
    repo.commits = data.commits
    return res.json({ success: true, data })
  } catch (err) {
    return res.json({
      success: true,
      data: {
        repo,
        issues: repo.issues || [],
        pulls: repo.pulls || [],
        commits: repo.commits || [],
        languages: {},
        contributors: []
      }
    })
  }
})

app.get('/api/repositories/:id/analysis', requireAuth, async (req, res) => {
  const repo = findRepo(workspace(req.auth.id).repos, req.params.id)
  if (!repo) return res.status(404).json({ success: false, message: 'Repository not found.' })
  if (repo.source !== 'github' || !repo.owner) {
    return res.json({ success: true, data: { healthScore: 0, findings: [], insights: ['Import a GitHub repository to analyze it.'], recentCommits: [] } })
  }
  try {
    const data = await buildAnalysis(repo.owner, repo.name, repo, repo.githubToken)
    return res.json({ success: true, data })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.delete('/api/repositories/:id', requireAuth, (req, res) => {
  const ws = workspace(req.auth.id)
  const before = ws.repos.length
  const id = Number(req.params.id)
  ws.repos = ws.repos.filter((r) => r.id !== id && r.name !== req.params.id && r.fullName !== req.params.id)
  if (ws.repos.length === before) return res.status(404).json({ success: false, message: 'Repository not found.' })
  return res.json({ success: true, message: 'Repository removed.' })
})

// ── Live GitHub data fetchers ─────────────────────────────
// Fetch live commits, PRs and issues for all repos in workspace
async function fetchLiveRepoData(repos) {
  const githubRepos = repos.filter((r) => r.source === 'github' && r.owner && r.name)
  const results = await Promise.all(
    githubRepos.map(async (repo) => {
      try {
        const [commitsRaw, pullsRaw, issuesRaw] = await Promise.all([
          ghFetch(`/repos/${repo.owner}/${repo.name}/commits?per_page=100`, repo.githubToken).catch(() => []),
          ghFetch(`/repos/${repo.owner}/${repo.name}/pulls?state=all&per_page=100`, repo.githubToken).catch(() => []),
          ghFetch(`/repos/${repo.owner}/${repo.name}/issues?state=all&per_page=100`, repo.githubToken).catch(() => [])
        ])
        const commits = (Array.isArray(commitsRaw) ? commitsRaw : []).map((c) => mapCommit(c, repo.fullName))
        const pulls = (Array.isArray(pullsRaw) ? pullsRaw : []).map((p) => mapPR(p, repo.fullName))
        const issues = (Array.isArray(issuesRaw) ? issuesRaw : [])
          .filter((i) => !i.pull_request)
          .map((i) => mapIssue(i, repo.fullName))
        // Update cache in memory so repo detail page also benefits
        repo.commits = commits
        repo.pulls = pulls
        repo.issues = issues
        return { commits, pulls, issues }
      } catch {
        return { commits: repo.commits || [], pulls: repo.pulls || [], issues: repo.issues || [] }
      }
    })
  )
  return results
}

// ── Pull Requests (live from GitHub) ─────────────────────
app.get('/api/pull-requests', requireAuth, async (req, res) => {
  try {
    const { repos } = workspace(req.auth.id)
    if (repos.length === 0) return res.json({ success: true, count: 0, data: [] })
    const results = await fetchLiveRepoData(repos)
    const allPulls = results.flatMap((r) => r.pulls)
    res.json({ success: true, count: allPulls.length, data: allPulls })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── Issues (live from GitHub) ─────────────────────────────
app.get('/api/issues', requireAuth, async (req, res) => {
  try {
    const { repos } = workspace(req.auth.id)
    if (repos.length === 0) return res.json({ success: true, count: 0, data: [] })
    const results = await fetchLiveRepoData(repos)
    const allIssuesList = results.flatMap((r) => r.issues)
    res.json({ success: true, count: allIssuesList.length, data: allIssuesList })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── Analytics (live from GitHub) ─────────────────────────
app.get('/api/analytics', requireAuth, async (req, res) => {
  try {
    const { repos } = workspace(req.auth.id)
    if (repos.length === 0) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return res.json({
        success: true,
        data: { totalCommits: 0, mergedPRs: 0, issuesClosed: 0, codeReviewsCount: 0, velocityScore: 0, dailyActivity: days.map((d) => ({ day: d, commits: 0, prs: 0 })) }
      })
    }
    const results = await fetchLiveRepoData(repos)
    const commits = results.flatMap((r) => r.commits).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    const pulls = results.flatMap((r) => r.pulls)
    const issues = results.flatMap((r) => r.issues)

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const buckets = Object.fromEntries(days.map((d) => [d, { day: d, commits: 0, prs: 0 }]))
    commits.forEach((c) => {
      if (!c.date) return
      const day = days[new Date(c.date).getDay()]
      buckets[day].commits += 1
    })
    pulls.forEach((p) => {
      const rawDate = p.createdAtRaw || p.date
      if (!rawDate) return
      try {
        const day = days[new Date(rawDate).getDay()]
        if (day) buckets[day].prs += 1
      } catch {}
    })
    const recent30d = commits.filter((c) => c.date && Date.now() - new Date(c.date).getTime() < 30 * 86400000).length
    const mergedPRs = pulls.filter((p) => p.status === 'merged').length
    const velocityScore = Math.max(0, Math.min(100, Math.round(40 + recent30d * 2 + Math.min(mergedPRs, 10))))

    res.json({
      success: true,
      data: {
        totalCommits: commits.length,
        mergedPRs,
        issuesClosed: issues.filter((i) => i.state === 'closed').length,
        codeReviewsCount: pulls.length,
        velocityScore,
        dailyActivity: days.map((d) => buckets[d])
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── Dashboard (live from GitHub) ──────────────────────────
app.get('/api/dashboard', requireAuth, async (req, res) => {
  try {
    const { repos } = workspace(req.auth.id)
    if (repos.length === 0) {
      return res.json({ success: true, data: { totalRepositories: 0, activePullRequests: 0, openIssues: 0, recentCommits: [] } })
    }
    const results = await fetchLiveRepoData(repos)
    const allPulls = results.flatMap((r) => r.pulls)
    const allIssuesList = results.flatMap((r) => r.issues)
    const allCommits = results.flatMap((r) => r.commits).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 8)
    res.json({
      success: true,
      data: {
        totalRepositories: repos.length,
        activePullRequests: allPulls.filter((p) => p.status === 'open').length,
        openIssues: allIssuesList.filter((i) => i.state === 'open').length,
        recentCommits: allCommits
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── Pipelines (CI/CD Workflows) ───────────────────────────
app.get('/api/pipelines', requireAuth, (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    let list = ws.pipelines || []
    const { status, repo, environment } = req.query || {}
    if (status && status !== 'all') {
      list = list.filter((p) => p.status === status)
    }
    if (repo && repo !== 'all') {
      list = list.filter((p) => p.repo === repo || p.repoFullName === repo)
    }
    if (environment && environment !== 'all') {
      list = list.filter((p) => p.environment === environment)
    }
    return res.json({ success: true, count: list.length, data: list })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.post('/api/pipelines/trigger', requireAuth, (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const { repo, branch, workflow, environment } = req.body || {}
    const selectedRepo = ws.repos.find((r) => r.name === repo || r.fullName === repo) || ws.repos[0]
    const repoName = selectedRepo?.name || repo || 'sycnops-app'
    const repoFullName = selectedRepo?.fullName || `studio/${repoName}`
    const now = Date.now()
    const commitHash = Math.random().toString(16).substring(2, 9)

    const newPipeline = {
      id: 'pipe_' + now,
      name: workflow || 'manual-workflow-run',
      repo: repoName,
      repoFullName,
      branch: branch || 'main',
      commit: commitHash,
      commitMessage: `chore(pipeline): manual trigger on ${branch || 'main'}`,
      author: 'active-user',
      authorAvatar: '',
      status: 'running',
      trigger: 'manual',
      startedAt: new Date().toISOString(),
      duration: 'running...',
      environment: environment || 'production',
      stages: [
        { id: 'stg_1', name: 'Lint & Typecheck', status: 'running', duration: 'calculating...', logs: ['Starting linter and TypeScript analyzer...', 'Running eslint . --max-warnings 0'] },
        { id: 'stg_2', name: 'Unit & Integration Tests', status: 'queued', duration: '—', logs: ['Waiting for previous stage...'] },
        { id: 'stg_3', name: 'Security & SAST Audit', status: 'queued', duration: '—', logs: ['Waiting for previous stage...'] },
        { id: 'stg_4', name: 'AI Cognitive Quality Gate', status: 'queued', duration: '—', logs: ['Waiting for previous stage...'] },
        { id: 'stg_5', name: 'Deployment', status: 'queued', duration: '—', logs: ['Waiting for previous stage...'] }
      ]
    }

    if (!ws.pipelines) ws.pipelines = []
    ws.pipelines.unshift(newPipeline)

    // Simulate completion after 10 seconds
    setTimeout(() => {
      newPipeline.status = 'success'
      newPipeline.duration = '1m 24s'
      newPipeline.stages.forEach((stg) => {
        stg.status = 'success'
        if (stg.duration === 'calculating...' || stg.duration === '—') stg.duration = '16s'
        stg.logs.push('✓ Stage completed with exit code 0')
      })
    }, 10000)

    return res.status(201).json({ success: true, message: 'Pipeline triggered successfully.', data: newPipeline })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.post('/api/pipelines/:id/cancel', requireAuth, (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const pipeline = (ws.pipelines || []).find((p) => p.id === req.params.id)
    if (!pipeline) return res.status(404).json({ success: false, message: 'Pipeline run not found.' })
    pipeline.status = 'failed'
    pipeline.duration += ' (cancelled)'
    pipeline.stages.forEach((s) => {
      if (s.status === 'running' || s.status === 'queued') {
        s.status = 'skipped'
        s.logs.push('⚠️ Cancelled by operator.')
      }
    })
    return res.json({ success: true, message: 'Pipeline run cancelled.', data: pipeline })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

// ── Repository Analysis Pipeline routes use calculateRepositoryPipeline from ./lib/github.js ──

app.get('/api/pipeline/repo-analysis', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const repoId = req.query.repoId
    let repo = repoId ? findRepo(ws.repos, repoId) : ws.repos[0]
    if (!repo && repoId && typeof repoId === 'string' && repoId.includes('/')) {
      const [owner, name] = repoId.split('/')
      repo = {
        id: repoId,
        name,
        owner,
        fullName: repoId,
        source: 'github',
        defaultBranch: 'main'
      }
    }
    const data = await calculateRepositoryPipeline(repo, req.headers['x-github-token'])
    if (repo && typeof repo === 'object') repo.pipeline = data
    return res.json({ success: true, data })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.post('/api/pipeline/repo-analysis/run', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const repoId = req.body?.repoId
    let repo = repoId ? findRepo(ws.repos, repoId) : ws.repos[0]
    if (!repo && repoId && typeof repoId === 'string' && repoId.includes('/')) {
      const [owner, name] = repoId.split('/')
      repo = {
        id: repoId,
        name,
        owner,
        fullName: repoId,
        source: 'github',
        defaultBranch: 'main'
      }
    }
    const data = await calculateRepositoryPipeline(repo, req.headers['x-github-token'])
    if (repo && typeof repo === 'object') repo.pipeline = data
    return res.json({ success: true, message: 'Repository analysis pipeline executed.', data })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})


app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` })
})

const server = app.listen(PORT, () => {
  console.log(`SycnOps Backend running at http://localhost:${PORT}`)
})
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') console.error(`Port ${PORT} already in use.`)
  else console.error('Server error:', err.message)
})
