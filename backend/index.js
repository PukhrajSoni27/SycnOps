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
  buildAnalysis
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

// ── In-memory fallback storage ────────────────────────────
const memoryUsers = []
const workspaces = new Map()

// ── Initialize Firebase ───────────────────────────────────
initFirebase()

const makeToken = (id) => jwt.sign({ id: String(id) }, JWT_SECRET, { expiresIn: '7d' })
const formatUser = (user) => ({
  id: String(user.id || user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt
})

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

// ── Workspace storage ─────────────────────────────────────
function workspace(userId) {
  const key = String(userId)
  if (!workspaces.has(key)) workspaces.set(key, { repos: [] })
  return workspaces.get(key)
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
  try {
    req.auth = jwt.verify(header.slice(7), JWT_SECRET)
    next()
  } catch {
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
        user = await findUserById(user.id)
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
    return res.status(500).json({ success: false, message: 'Social login failed.' })
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
  const parsed = parseGitHubRepo(req.body?.name)
  if (!parsed) {
    return res.status(400).json({ success: false, message: 'Enter a GitHub URL or owner/repo (example: facebook/react).' })
  }
  const ws = workspace(req.auth.id)
  const full = `${parsed.owner}/${parsed.repo}`.toLowerCase()
  if (ws.repos.some((r) => r.fullName?.toLowerCase() === full)) {
    return res.status(400).json({ success: false, message: `Repository ${parsed.owner}/${parsed.repo} is already imported.` })
  }
  try {
    const bundle = await fetchRepoBundle(parsed.owner, parsed.repo)
    const repo = {
      ...mapRepo(bundle.meta, { importedAt: new Date().toISOString() }),
      issues: bundle.issues,
      pulls: bundle.pulls,
      commits: bundle.commits
    }
    ws.repos.unshift(repo)
    return res.status(201).json({ success: true, message: `Imported ${repo.fullName} from GitHub.`, data: repo })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message || 'Failed to import repository.' })
  }
})

app.get('/api/repositories/github-info/:owner/:repo', requireAuth, async (req, res) => {
  try {
    const bundle = await fetchRepoBundle(req.params.owner, req.params.repo)
    return res.json({ success: true, data: mapRepo(bundle.meta) })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
})

app.get('/api/repositories/:id/details', requireAuth, async (req, res) => {
  const repo = findRepo(workspace(req.auth.id).repos, req.params.id)
  if (!repo) return res.status(404).json({ success: false, message: 'Repository not found in your workspace.' })
  if (repo.source !== 'github' || !repo.owner) {
    return res.json({ success: true, data: { repo, issues: [], pulls: [], commits: [], languages: {}, contributors: [] } })
  }
  try {
    const data = await fetchDetails(repo.owner, repo.name, repo)
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
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.get('/api/repositories/:id/analysis', requireAuth, async (req, res) => {
  const repo = findRepo(workspace(req.auth.id).repos, req.params.id)
  if (!repo) return res.status(404).json({ success: false, message: 'Repository not found.' })
  if (repo.source !== 'github' || !repo.owner) {
    return res.json({ success: true, data: { healthScore: 0, findings: [], insights: ['Import a GitHub repository to analyze it.'], recentCommits: [] } })
  }
  try {
    const data = await buildAnalysis(repo.owner, repo.name, repo)
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
          ghFetch(`/repos/${repo.owner}/${repo.name}/commits?per_page=100`).catch(() => []),
          ghFetch(`/repos/${repo.owner}/${repo.name}/pulls?state=all&per_page=100`).catch(() => []),
          ghFetch(`/repos/${repo.owner}/${repo.name}/issues?state=all&per_page=100`).catch(() => [])
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
      if (!p.createdAt) return
      // createdAt is already "Xh ago" format from mapPR — use stored date if available
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
