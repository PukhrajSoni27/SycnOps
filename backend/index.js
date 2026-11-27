import fs from 'fs'

import os from 'os'

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

import { initFirebase, getDB, isFirestoreConnected, verifyFirebaseIdToken } from './config/firebase.js'

import {

  createPipelineExecutionRecord,

  executePipeline,

  cancelPipeline,

  syncPipelineToFirestore

} from './lib/pipelineOrchestrator.js'

import {

  runFileFlowScan,

  getLatestFileFlowAnalysis,

  getFileDetails,

  findGraphPaths

} from './lib/fileFlowScanner.js'

import { getOrGenerateTopology } from './lib/topologyScanner.js'
import {
  getCodeFlowOperations,
  getCodeFlowTrace,
  analyzeFileAST
} from './lib/astFlowAnalyzer.js'

import {

  executeCodeQualityScan,

  isScanRunning,

  detectRepositoryLanguages

} from './lib/codeQualityEngine.js'

import {

  saveScan,

  getLatestScan,

  getScanHistory,

  getScanById,

  getFindingById

} from './lib/codeQualityStorage.js'

import {

  isAIProviderAvailable,

  getProviderStatus,

  computeFindingFingerprint,

  generateFindingExplanation

} from './lib/aiProvider.js'

import {

  saveAIExplanationRecord,

  getAIExplanationRecord,

  deleteAIExplanationRecord

} from './models/AIHistory.js'
import {
  generateAIFix,
  applyAIFix,
  rollbackAIFix,
  validateAIFixWithScanner
} from './lib/aiFixEngine.js'
import {
  getPatchById,
  getLatestPatchForFinding,
  updatePatchRecord,
  getPatchesByRepo
} from './models/AIPatch.js'
import {
  validateBranchName,
  checkWorkingTreeClean,
  createOrCheckoutFixBranch,
  applyMultiplePatches,
  executeQualityValidation,
  generateCommitMessage,
  createFixCommit,
  generatePRContent,
  createGitHubPullRequest,
  syncPullRequestStatus,
  rollbackFixBranchOrPatches
} from './lib/gitPrEngine.js'
import {
  savePullRequestRecord,
  getPullRequestById,
  getPullRequestsByRepo,
  getAllPullRequestsForUser,
  updatePullRequestRecord
} from './models/PullRequest.js'
import {
  encryptToken,
  decryptToken,
  maskToken,
  sanitizeRepoForClient,
  sanitizeRepoListForClient
} from './lib/cryptoToken.js'




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
const WORKSPACE_CACHE_FILE = path.join(__dirname, '.workspace_cache.json')
const USERS_CACHE_FILE = path.join(__dirname, '.users_cache.json')

function loadCachedUsers() {
  try {
    if (fs.existsSync(USERS_CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(USERS_CACHE_FILE, 'utf8'))
      if (Array.isArray(data)) {
        memoryUsers.length = 0
        memoryUsers.push(...data)
      }
    }
  } catch (e) {
    console.warn('Failed to load users cache:', e.message)
  }
}

function saveCachedUsers() {
  try {
    fs.writeFileSync(USERS_CACHE_FILE, JSON.stringify(memoryUsers, null, 2), 'utf8')
  } catch (e) {
    console.warn('Failed to save users cache:', e.message)
  }
}

function isDemoRepo(repo) {
  if (!repo) return false
  const name = String(repo.name || '').toLowerCase()
  const full = String(repo.fullName || '').toLowerCase()
  return name === 'campus-lost-found' ||
    name === 'sycnops-core' ||
    full === 'studio/campus-lost-found' ||
    full === 'studio/sycnops-core'
}

function loadCachedWorkspaces() {
  try {
    if (fs.existsSync(WORKSPACE_CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(WORKSPACE_CACHE_FILE, 'utf8'))
      for (const [k, v] of Object.entries(data)) {
        if (!k || k === 'undefined' || k === 'null' || k === '[object Object]') continue
        if (v && Array.isArray(v.repos)) {
          // Strip out legacy mock/demo repositories
          v.repos = v.repos.filter((r) => !isDemoRepo(r))
          for (const repo of v.repos) {
            if (repo.encryptedGithubToken && !repo.githubToken) {
              repo.githubToken = decryptToken(repo.encryptedGithubToken)
            } else if (repo.githubToken && repo.githubToken.startsWith('enc:v1:')) {
              repo.encryptedGithubToken = repo.githubToken
              repo.githubToken = decryptToken(repo.githubToken)
            }
          }
        }
        if (v && Array.isArray(v.pipelines)) {
          v.pipelines = v.pipelines.filter((p) => {
            const r = String(p.repository || p.repo || '').toLowerCase()
            return r !== 'campus-lost-found' && r !== 'sycnops-core'
          })
        }
        workspaces.set(k, v)
      }
    }
  } catch (e) {
    console.warn('Failed to load workspace cache:', e.message)
  }
}

function saveCachedWorkspaces() {
  try {
    const obj = {}
    for (const [k, v] of workspaces.entries()) {
      const cloned = { ...v }
      if (Array.isArray(cloned.repos)) {
        cloned.repos = cloned.repos.filter((r) => !isDemoRepo(r)).map((r) => {
          const rCopy = { ...r }
          if (rCopy.githubToken) {
            rCopy.encryptedGithubToken = encryptToken(rCopy.githubToken)
            delete rCopy.githubToken
          }
          return rCopy
        })
      }
      obj[k] = cloned
    }
    fs.writeFileSync(WORKSPACE_CACHE_FILE, JSON.stringify(obj, null, 2), 'utf8')
  } catch (e) {
    console.warn('Failed to save workspace cache:', e.message)
  }
}

loadCachedUsers()
loadCachedWorkspaces()



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
  if (!repos || !Array.isArray(repos) || repos.length === 0) return []
  const repoName = repos[0]?.name
  if (!repoName) return []
  const repoFull = repos[0]?.fullName || repoName
  const now = Date.now()



  return [

    {

      id: 'pipe_' + (now - 120000),

      name: 'production-ci',

      repository: repoName,

      repo: repoName,

      repoFullName: repoFull,

      branch: 'main',

      commit: 'a9f2e34',

      commitMessage: 'feat(pipeline): real multi-stage command execution engine',

      author: 'pukhraj-soni',

      authorAvatar: '',

      status: 'success',

      trigger: 'manual',

      startedAt: new Date(now - 1200000).toISOString(),

      duration: '1m 18s',

      environment: 'production',

      exitCode: 0,

      stages: [

        {

          id: 'stg_1',

          name: 'Repository Import',

          status: 'success',

          duration: '1.24s',

          exitCode: 0,

          logs: [

            `[simple-git] Initializing git inspection for target: ${repoName}`,

            `[simple-git] Working tree: checked out branch main`,

            `[simple-git] HEAD commit: a9f2e34 (feat(pipeline): real multi-stage command execution engine)`,

            `✓ Repository Import stage completed successfully with exit code 0`

          ]

        },

        {

          id: 'stg_2',

          name: 'Dependency Analysis',

          status: 'success',

          duration: '0.82s',

          exitCode: 0,

          logs: [

            '[Dependency Inspector] Reading package manifests (package.json)...',

            '[Dependency Inspector] Frontend dependencies: 53 packages (react, vite, tailwindcss)',

            '[Dependency Inspector] Backend dependencies: 10 packages (express, simple-git, firebase-admin)',

            '✓ Dependency Analysis completed with exit code 0'

          ]

        },

        {

          id: 'stg_3',

          name: 'Linting',

          status: 'success',

          duration: '3.45s',

          exitCode: 0,

          logs: [

            '[ESLint] Executing: npm run lint',

            '> syncops-ai@1.0.0 lint',

            '> eslint .',

            '✓ ESLint validation passed with exit code 0'

          ]

        },

        {

          id: 'stg_4',

          name: 'Testing',

          status: 'success',

          duration: '2.91s',

          exitCode: 0,

          logs: [

            '[Vitest / Jest] Executing: npm run test',

            '> vitest run',

            '✓ src/tests/pipeline.test.ts (2 passed)',

            '✓ Automated testing completed successfully with exit code 0'

          ]

        },

        {
          id: 'stg_5',
          name: 'Build',
          status: 'success',
          duration: '14.20s',
          exitCode: 0,
          logs: [
            '[Vite] Executing: npm run build',
            '> tsc && vite build',
            '✓ built in 13.8s',
            '✓ Production Vite bundle generated successfully with exit code 0'
          ]
        }
      ]
    }
  ]
}



// ── Workspace storage ─────────────────────────────────────

function workspace(userId) {

  const key = String(userId)

  if (!workspaces.has(key)) {

    workspaces.set(key, { repos: [], pipelines: null, initialized: false })

  }

  const ws = workspaces.get(key)
  if (!ws.initialized) {
    ws.initialized = true
    ws.repos = []
    ws.pipelines = []
    saveCachedWorkspaces()
  }

  if (!ws.pipelines) {
    ws.pipelines = ws.repos && ws.repos.length > 0 ? getDefaultPipelines(ws.repos) : []
  }

  return ws

}



function findRepo(list, idParam) {

  if (!list || !Array.isArray(list)) return null

  const numId = Number(idParam)

  const strId = String(idParam)

  return list.find((r) => r.id === numId || String(r.id) === strId || r.name === strId || r.fullName === strId)

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

    } catch { }

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
    saveCachedUsers()

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

    const { provider, idToken } = req.body || {}

    if (!provider || (provider !== 'google' && provider !== 'github')) {

      return res.status(400).json({ success: false, message: 'Valid provider (google or github) is required.' })

    }

    if (!idToken || typeof idToken !== 'string') {

      return res.status(400).json({ success: false, message: 'Valid Firebase ID token is required for social authentication.' })

    }



    // 1. Cryptographically verify the ID token via Firebase Admin SDK

    let decodedToken

    try {

      decodedToken = await verifyFirebaseIdToken(idToken)

    } catch (verifyErr) {

      console.warn('Firebase ID token verification failed:', verifyErr.message)

      return res.status(401).json({

        success: false,

        message: 'Firebase token verification failed. The token may be expired or invalid.'

      })

    }



    // 1b. Strict claim assertions: audience, issuer, subject

    const expectedProjectId = process.env.FIREBASE_PROJECT_ID || 'sycnops-cd9af'

    if (decodedToken.aud !== expectedProjectId || decodedToken.iss !== `https://securetoken.google.com/${expectedProjectId}`) {

      return res.status(401).json({ success: false, message: 'Invalid token audience or issuer.' })

    }

    if (!decodedToken.uid || typeof decodedToken.uid !== 'string') {

      return res.status(401).json({ success: false, message: 'Invalid token subject (missing UID).' })

    }



    // 2. Validate provider match against the actual token issuer identity

    const tokenProvider = decodedToken.firebase?.sign_in_provider || ''

    const expectedDomain = provider === 'github' ? 'github.com' : 'google.com'

    const identities = decodedToken.firebase?.identities || {}

    const hasExpectedIdentity = Boolean(identities[expectedDomain])



    if (tokenProvider && tokenProvider !== expectedDomain && !hasExpectedIdentity) {

      return res.status(401).json({

        success: false,

        message: `Token provider '${tokenProvider}' does not match requested provider '${provider}'.`

      })

    }



    // 3. Extract verified identity from the decoded token — never trust client headers/body

    const firebaseUid = decodedToken.uid

    const isEmailVerified = Boolean(decodedToken.email_verified)

    const rawEmail = decodedToken.email ? String(decodedToken.email).toLowerCase().trim() : ''

    // Only genuine, cryptographically verified emails may be used for account linking

    const verifiedEmail = (isEmailVerified && rawEmail) ? rawEmail : ''

    const hasVerifiedEmail = Boolean(verifiedEmail)



    // For display / account identification when GitHub email is kept private:

    // Firebase UID is the immutable stable identity. Fallback synthetic address is NEVER marked verified.

    const userEmail = verifiedEmail || `${firebaseUid}@github.noreply.syncops.dev`

    const isSyntheticEmail = !hasVerifiedEmail

    const displayName = (decodedToken.name && String(decodedToken.name).trim()) ||

      (verifiedEmail ? verifiedEmail.split('@')[0] : (provider === 'github' ? 'GitHub Developer' : 'Google Developer'))

    const avatar = decodedToken.picture || ''



    // 4. Safe account lookup and linking:

    // RULE: We NEVER link accounts using synthetic fallback emails or unverified email strings!

    let user = null

    if (isFirestoreConnected()) {

      const db = getDB()

      // Step A: Primary lookup by immutable firebaseUid (always safe)

      if (firebaseUid) {

        const snapUid = await db.collection('users').where('firebaseUid', '==', firebaseUid).limit(1).get()

        if (!snapUid.empty) {

          user = { id: snapUid.docs[0].id, ...snapUid.docs[0].data() }

        }

      }

      // Step B: ONLY if the token carries a genuine, verified email, check for an existing account with that verified email

      if (!user && hasVerifiedEmail) {

        user = await findUserByEmail(verifiedEmail)

      }



      if (!user) {

        // Create new account

        user = await createUser({

          name: displayName,

          email: userEmail,

          firebaseUid,

          avatar,

          authProvider: provider,

          role: 'developer',

          emailVerified: hasVerifiedEmail,

          isSyntheticEmail,

          lastLoginAt: new Date().toISOString()

        })

      } else {

        // Link existing account safely:

        // Only update email/verification if the incoming email is genuinely verified

        const updates = {

          lastLoginAt: new Date().toISOString(),

          authProvider: user.authProvider || provider,

          ...(firebaseUid && !user.firebaseUid ? { firebaseUid } : {}),

          ...(avatar && !user.avatar ? { avatar } : {}),

          ...(hasVerifiedEmail ? { email: verifiedEmail, emailVerified: true, isSyntheticEmail: false } : {})

        }

        await updateUser(user.id, updates)

        user = (await findUserById(user.id)) || { ...user, ...updates }

      }

      return res.json({

        success: true,

        message: `Successfully authenticated with ${provider}.`,

        token: makeToken(user.id),

        user: formatUser(user)

      })

    }



    // Memory fallback (when Firestore credentials are not loaded)

    // Primary lookup by firebaseUid; fallback lookup by verified email ONLY

    user = memoryUsers.find((u) =>

      (u.firebaseUid && u.firebaseUid === firebaseUid) ||

      (hasVerifiedEmail && u.email?.toLowerCase() === verifiedEmail)

    )



    if (!user) {

      user = {

        id: 'usr_social_' + Date.now(),

        name: displayName,

        email: userEmail,

        firebaseUid,

        avatar,

        authProvider: provider,

        role: 'developer',

        emailVerified: hasVerifiedEmail,

        isSyntheticEmail,

        createdAt: new Date().toISOString(),

        lastLoginAt: new Date().toISOString()

      }

      memoryUsers.push(user)
      saveCachedUsers()

    } else {

      user.lastLoginAt = new Date().toISOString()

      if (firebaseUid && !user.firebaseUid) user.firebaseUid = firebaseUid

      if (avatar && !user.avatar) user.avatar = avatar

      if (!user.authProvider) user.authProvider = provider

      if (hasVerifiedEmail) {

        user.email = verifiedEmail

        user.emailVerified = true

        user.isSyntheticEmail = false

      }
      saveCachedUsers()

    }



    return res.json({

      success: true,

      message: `Successfully authenticated with ${provider}.`,

      token: makeToken(user.id),

      user: formatUser(user)

    })

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
  saveCachedUsers()

  return res.json({ success: true, user: formatUser(user) })

})



// ── Repositories ──────────────────────────────────────────

app.get('/api/repositories', requireAuth, (req, res) => {
  const { repos } = workspace(req.auth.id)
  res.json({ success: true, count: repos.length, data: sanitizeRepoListForClient(repos) })
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

      const isPrivate = requestedVisibility === 'private' ||

        (requestedVisibility !== 'public' && (bundle.meta?.private === true || bundle.meta?.visibility === 'private'))

      const visibility = isPrivate ? 'private' : 'public'



      // Ensure repository is available locally in .repos_cache for Code Quality static analysis

      const reposCacheDir = path.resolve(__dirname, '.repos_cache')

      const localTarget = path.resolve(reposCacheDir, parsed.repo)

      if (!fs.existsSync(localTarget)) {

        try {

          fs.mkdirSync(reposCacheDir, { recursive: true })

          const { execSync } = await import('child_process')

          const cloneUrl = userToken

            ? `https://${userToken}@github.com/${parsed.owner}/${parsed.repo}.git`

            : `https://github.com/${parsed.owner}/${parsed.repo}.git`

          execSync(`git clone --depth 1 ${cloneUrl} "${localTarget}"`, {

            timeout: 30000,

            stdio: ['ignore', 'pipe', 'ignore'],

            windowsHide: true

          })

        } catch (cloneErr) {

          console.warn(`[Import] Clone notice for ${parsed.owner}/${parsed.repo}:`, cloneErr.message)

        }

      }

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

      saveCachedWorkspaces()

      if (isFirestoreConnected()) {

        try {

          const db = getDB()

          if (db) {
            const safeRepos = ws.repos.map((r) => {
              const copy = { ...r }
              if (copy.githubToken) {
                copy.encryptedGithubToken = encryptToken(copy.githubToken)
                delete copy.githubToken
              }
              return copy
            })
            await db.collection('workspaces').doc(String(req.auth.id)).set({ repos: safeRepos, initialized: true }, { merge: true }).catch(() => { })
          }

        } catch (e) { }

      }

      return res.status(201).json({ success: true, message: `Imported ${repo.fullName} from GitHub.`, data: sanitizeRepoForClient(repo) })

    } catch (err) {

      if (err.isRateLimit || err.message?.toLowerCase().includes('rate limit')) {

        return res.status(429).json({

          success: false,

          message: err.message || 'GitHub API rate limit reached. Please provide a personal access token or try again later.'

        })

      }

      return res.status(400).json({

        success: false,

        isPrivate: err.isPrivate || false,

        message: err.message || "This repository is private or inaccessible. We can't access it."

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

    saveCachedWorkspaces()

    if (isFirestoreConnected()) {

      try {

        const db = getDB()

        if (db) await db.collection('workspaces').doc(String(req.auth.id)).set({ repos: ws.repos, initialized: true }, { merge: true }).catch(() => { })

      } catch (e) { }

    }

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

        visibility,

        rateLimited: bundle.rateLimited || false

      }

    })

  } catch (err) {

    if (err.isRateLimit || err.message?.toLowerCase().includes('rate limit')) {

      return res.status(429).json({

        success: false,

        message: err.message || 'GitHub API rate limit reached. Please provide a personal access token or try again later.'

      })

    }

    return res.status(400).json({

      success: false,

      isPrivate: err.isPrivate || false,

      message: err.message || "This repository is private or inaccessible. We can't access it."

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

    if (data && data.repo) data.repo = sanitizeRepoForClient(data.repo)

    return res.json({ success: true, data })


  } catch (err) {

    return res.json({

      success: true,

      data: {

        repo: sanitizeRepoForClient(repo),

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

    return res.json({
      success: true,
      data: {
        healthScore: 0,
        healthTier: 'Local',
        issueCloseRate: 0,
        prMergeRate: 0,
        openBugs: 0,
        securityIssues: 0,
        perfIssues: 0,
        docIssues: 0,
        openFeatureRequests: 0,
        staleIssues: 0,
        oldBugs: 0,
        totalOpenIssues: 0,
        totalClosedIssues: 0,
        openPRs: 0,
        mergedPRs: 0,
        closedPRs: 0,
        draftPRs: 0,
        stalePRs: 0,
        recentCommits7d: 0,
        recentCommits30d: 0,
        totalReleases: 0,
        watchersCount: 0,
        branchCount: 1,
        langBreakdown: [],
        bugs: [],
        securityIssuesList: [],
        perfIssuesList: [],
        stalePRsList: [],
        staleIssuesList: [],
        featureRequests: [],
        findings: [],
        recommendations: [],
        insights: ['Import a GitHub repository to analyze it.'],
        recentCommits: [],
        summary: { criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0 }
      }
    })

  }

  try {

    const data = await buildAnalysis(repo.owner, repo.name, repo, repo.githubToken)

    return res.json({ success: true, data })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



app.delete('/api/repositories/all', requireAuth, async (req, res) => {

  try {

    const ws = workspace(req.auth.id)

    ws.repos = []

    ws.pipelines = []

    saveCachedWorkspaces()



    if (isFirestoreConnected()) {

      try {

        const db = getDB()

        if (db) {

          await db.collection('workspaces').doc(String(req.auth.id)).set({ repos: [], pipelines: [], initialized: true }, { merge: true }).catch(() => { })

          const snap = await db.collection('repositories').get().catch(() => null)

          if (snap && !snap.empty) {

            for (const doc of snap.docs) {

              await doc.ref.delete().catch(() => { })

            }

          }

        }

      } catch (e) { }

    }



    return res.json({ success: true, message: 'All repositories removed successfully.', count: 0, data: [] })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



app.delete('/api/repositories/:id', requireAuth, async (req, res) => {

  try {

    const idParam = String(req.params.id)

    const ws = workspace(req.auth.id)



    if (idParam === 'all') {

      ws.repos = []

      ws.pipelines = []

      saveCachedWorkspaces()

      if (isFirestoreConnected()) {

        try {

          const db = getDB()

          if (db) {

            await db.collection('workspaces').doc(String(req.auth.id)).set({ repos: [], pipelines: [], initialized: true }, { merge: true }).catch(() => { })

            const snap = await db.collection('repositories').get().catch(() => null)

            if (snap && !snap.empty) {

              for (const doc of snap.docs) {

                await doc.ref.delete().catch(() => { })

              }

            }

          }

        } catch (e) { }

      }

      return res.json({ success: true, message: 'All repositories removed successfully.', count: 0, data: [] })

    }



    const before = ws.repos.length

    const numId = Number(idParam)

    const removedRepo = ws.repos.find((r) => r.id === numId || String(r.id) === idParam || r.name === idParam || r.fullName === idParam)



    ws.repos = ws.repos.filter((r) => r.id !== numId && String(r.id) !== idParam && r.name !== idParam && r.fullName !== idParam)

    saveCachedWorkspaces()



    // Also remove from Firebase Firestore

    if (isFirestoreConnected()) {

      try {

        const db = getDB()

        if (db) {

          await db.collection('workspaces').doc(String(req.auth.id)).set({ repos: ws.repos, initialized: true }, { merge: true }).catch(() => { })

          await db.collection('repositories').doc(idParam).delete().catch(() => { })

          if (removedRepo?.fullName) {

            const snap = await db.collection('repositories').where('fullName', '==', removedRepo.fullName).get().catch(() => null)

            if (snap && !snap.empty) {

              for (const doc of snap.docs) {

                await doc.ref.delete().catch(() => { })

              }

            }

          }

        }

      } catch (e) { }

    }



    if (ws.repos.length === before) return res.status(404).json({ success: false, message: 'Repository not found.' })

    return res.json({ success: true, message: 'Repository removed successfully.' })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



// ── Live GitHub data fetchers ─────────────────────────────

// Fetch live commits, PRs and issues for all repos in workspace
async function fetchLiveRepoData(repos, explicitToken = null) {
  const githubRepos = repos.filter((r) => r.source === 'github' || (r.owner && r.name && r.owner !== 'studio'))
  const results = await Promise.all(
    githubRepos.map(async (repo) => {
      try {
        const token = decryptToken(explicitToken || repo.githubToken || repo.encryptedGithubToken)
        let prError = null
        const [commitsRaw, pullsRaw, issuesRaw] = await Promise.all([
          ghFetch(`/repos/${repo.owner}/${repo.name}/commits?per_page=100`, token).catch(() => []),
          ghFetch(`/repos/${repo.owner}/${repo.name}/pulls?state=all&per_page=100`, token).catch((e) => {
            prError = e.message || 'GitHub API permission or rate limit issue'
            return []
          }),
          ghFetch(`/repos/${repo.owner}/${repo.name}/issues?state=all&per_page=100`, token).catch(() => [])
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

        return { repo, commits, pulls, issues, prError }
      } catch (err) {
        return { repo, commits: repo.commits || [], pulls: repo.pulls || [], issues: repo.issues || [], prError: err.message }
      }
    })
  )
  return results
}

// ── Pull Requests (live from GitHub) ─────────────────────

app.get('/api/pull-requests', requireAuth, async (req, res) => {
  try {
    const { repos } = workspace(req.auth.id)
    const targetRepoId = req.query?.repoId
    const explicitToken = req.headers['x-github-token'] || req.query?.token

    let filteredRepos = repos
    if (targetRepoId && targetRepoId !== 'all') {
      const found = findRepo(repos, targetRepoId)
      if (!found) {
        return res.status(404).json({ success: false, message: `Repository "${targetRepoId}" not found in your workspace.` })
      }
      filteredRepos = [found]
    }

    const results = filteredRepos.length > 0 ? await fetchLiveRepoData(filteredRepos, explicitToken).catch(() => []) : []
    const allPulls = results.flatMap((r) => r.pulls || [])
    const githubError = results.find((r) => r.prError)?.prError || null

    // Merge with stored SyncOps AI Fix pull request records
    const syncOpsPRs = targetRepoId && targetRepoId !== 'all'
      ? await getPullRequestsByRepo(filteredRepos[0].id, req.auth.id).catch(() => [])
      : await getAllPullRequestsForUser(req.auth.id).catch(() => [])

    const prMap = new Map()

    for (const p of allPulls) {
      const key = `${p.repo || ''}#${p.number || p.id}`
      prMap.set(key, { ...p, source: 'github' })
    }

    for (const pr of syncOpsPRs) {
      const key = `${pr.repoFullName || ''}#${pr.number || pr.id}`
      const existing = prMap.get(key)
      if (existing) {
        prMap.set(key, {
          ...existing,
          prId: pr.id,
          aiFix: true,
          status: pr.status || existing.status,
          patchIds: pr.patchIds,
          validationSummary: pr.validationSummary,
          htmlUrl: pr.htmlUrl || existing.htmlUrl
        })
      } else {
        prMap.set(key, {
          id: pr.number || pr.id,
          prId: pr.id,
          number: pr.number,
          title: pr.title,
          repo: pr.repoFullName,
          author: 'SyncOps AI Assistant',
          status: pr.status || 'open',
          comments: 0,
          createdAt: pr.createdAt,
          createdAtRaw: pr.createdAt,
          htmlUrl: pr.htmlUrl,
          draft: Boolean(pr.draft),
          head: pr.headBranch,
          base: pr.baseBranch,
          aiFix: true,
          patchIds: pr.patchIds,
          validationSummary: pr.validationSummary,
          source: 'syncops'
        })
      }
    }

    const mergedPulls = Array.from(prMap.values())
    res.json({ success: true, count: mergedPulls.length, data: mergedPulls, githubError })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})



// ── Issues (live from GitHub) ─────────────────────────────

app.get('/api/issues', requireAuth, async (req, res) => {
  try {
    const { repos } = workspace(req.auth.id)
    const targetRepoId = req.query?.repoId
    let filteredRepos = repos
    if (targetRepoId && targetRepoId !== 'all') {
      const found = findRepo(repos, targetRepoId)
      if (found) filteredRepos = [found]
    }

    if (filteredRepos.length === 0) return res.json({ success: true, count: 0, data: [] })

    const results = await fetchLiveRepoData(filteredRepos)
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
    const targetRepoId = req.query?.repoId
    let filteredRepos = repos
    if (targetRepoId && targetRepoId !== 'all') {
      const found = findRepo(repos, targetRepoId)
      if (found) filteredRepos = [found]
    }

    if (filteredRepos.length === 0) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return res.json({
        success: true,
        data: { totalCommits: 0, mergedPRs: 0, issuesClosed: 0, codeReviewsCount: 0, velocityScore: 0, dailyActivity: days.map((d) => ({ day: d, commits: 0, prs: 0 })) }
      })
    }

    const results = await fetchLiveRepoData(filteredRepos)
    const commits = results.flatMap((r) => r.commits).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    const pulls = results.flatMap((r) => r.pulls)
    const issues = results.flatMap((r) => r.issues)

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const buckets = Object.fromEntries(days.map((d) => [d, { day: d, commits: 0, prs: 0 }]))

    commits.forEach((c) => {
      if (!c.date) return
      const day = days[new Date(c.date).getDay()]
      if (buckets[day]) buckets[day].commits += 1
    })

    pulls.forEach((p) => {
      const rawDate = p.createdAtRaw || p.date
      if (!rawDate) return
      try {
        const day = days[new Date(rawDate).getDay()]
        if (day && buckets[day]) buckets[day].prs += 1
      } catch { }
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
    const targetRepoId = req.query?.repoId

    if (repos.length === 0) {
      return res.json({ success: true, data: { totalRepositories: 0, activePullRequests: 0, openIssues: 0, recentCommits: [] } })
    }

    let filteredRepos = repos
    if (targetRepoId && targetRepoId !== 'all') {
      const found = findRepo(repos, targetRepoId)
      if (found) filteredRepos = [found]
    }

    const results = await fetchLiveRepoData(filteredRepos)
    const allPulls = results.flatMap((r) => r.pulls)
    const allIssuesList = results.flatMap((r) => r.issues)
    const allCommits = results.flatMap((r) => r.commits).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 8)

    res.json({
      success: true,
      data: {
        totalRepositories: repos.length,
        selectedRepository: filteredRepos.length === 1 ? sanitizeRepoForClient(filteredRepos[0]) : null,
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

app.get('/api/pipelines', requireAuth, async (req, res) => {

  try {

    const ws = workspace(req.auth.id)

    let list = ws.pipelines || []



    // If Firebase Firestore is connected, load recorded pipeline runs

    if (isFirestoreConnected()) {

      try {

        const db = getDB()

        const snap = await db.collection('pipeline_runs').orderBy('startedAt', 'desc').limit(50).get()

        if (!snap.empty) {

          const fromDb = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

          const existingIds = new Set(list.map((p) => p.id))

          for (const item of fromDb) {

            if (!existingIds.has(item.id)) {

              list.push(item)

              existingIds.add(item.id)

            } else {

              // Update status and stages in memory cache

              const idx = list.findIndex((p) => p.id === item.id)

              if (idx !== -1) list[idx] = { ...list[idx], ...item }

            }

          }

        }

      } catch (e) {



        // Fallback to in-memory workspace

      }

    }



    const { status, repo, environment } = req.query || {}

    if (status && status !== 'all') {

      list = list.filter((p) => p.status === status)

    }

    if (repo && repo !== 'all') {

      list = list.filter((p) => p.repo === repo || p.repoFullName === repo || p.repository === repo)

    }

    if (environment && environment !== 'all') {

      list = list.filter((p) => p.environment === environment)

    }

    return res.json({ success: true, count: list.length, data: list })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



app.get('/api/pipelines/:id', requireAuth, async (req, res) => {

  try {

    const ws = workspace(req.auth.id)

    let pipeline = (ws.pipelines || []).find((p) => p.id === req.params.id)



    if (!pipeline && isFirestoreConnected()) {

      try {

        const db = getDB()

        const doc = await db.collection('pipeline_runs').doc(req.params.id).get()

        if (doc.exists) pipeline = { id: doc.id, ...doc.data() }

      } catch { }





    }



    if (!pipeline) return res.status(404).json({ success: false, message: 'Pipeline run not found' })

    return res.json({ success: true, data: pipeline })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



app.post('/api/pipelines/trigger', requireAuth, async (req, res) => {

  try {

    const ws = workspace(req.auth.id)

    const { repo, branch, workflow, environment } = req.body || {}

    const selectedRepo = ws.repos.find((r) => r.name === repo || r.fullName === repo) || ws.repos[0]
    const repoName = selectedRepo?.name || repo
    if (!repoName) {
      return res.status(400).json({ success: false, message: 'Please import or select a repository before triggering a pipeline.' })
    }
    const repoFullName = selectedRepo?.fullName || `studio/${repoName}`



    // Create execution record conforming to user's specification

    const newPipeline = createPipelineExecutionRecord({

      repo: repoName,

      repoFullName,

      branch: branch || 'main',

      workflow: workflow || 'production-ci',

      environment: environment || 'production',

      author: req.auth.name || 'operator'

    })



    if (!ws.pipelines) ws.pipelines = []

    ws.pipelines.unshift(newPipeline)



    // Save initial record to Firebase Firestore

    await syncPipelineToFirestore(newPipeline)



    // Asynchronously orchestrate real command execution (Node.js engine)

    executePipeline(newPipeline, (updated) => {

      const idx = ws.pipelines.findIndex((p) => p.id === updated.id)

      if (idx !== -1) ws.pipelines[idx] = updated

    }).catch((err) => {

      console.error(`Pipeline ${newPipeline.id} execution error:`, err)

    })



    return res.status(201).json({

      success: true,

      message: 'Pipeline triggered and orchestrated with real command execution.',

      data: newPipeline

    })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



app.post('/api/pipelines/:id/cancel', requireAuth, async (req, res) => {

  try {

    const ws = workspace(req.auth.id)

    const pipeline = (ws.pipelines || []).find((p) => p.id === req.params.id)

    if (!pipeline) return res.status(404).json({ success: false, message: 'Pipeline run not found.' })



    await cancelPipeline(pipeline)

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

    if (!repo) {
      return res.json({
        success: true,
        data: {
          repository: null,
          metrics: { totalFilesScanned: 0, languagesDetected: 0, functionsAnalyzed: 0, dependenciesFound: 0, securityIssues: 0, pipelineDuration: '—', pipelineStatus: 'No Repository' },
          stages: [],
          summaryTable: [],
          componentBreakdown: [],
          securityVulnerabilities: [],
          projectDependencies: []
        }
      })
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

    if (!repo) {
      return res.json({
        success: true,
        data: {
          repository: null,
          metrics: { totalFilesScanned: 0, languagesDetected: 0, functionsAnalyzed: 0, dependenciesFound: 0, securityIssues: 0, pipelineDuration: '—', pipelineStatus: 'No Repository' },
          stages: [],
          summaryTable: [],
          componentBreakdown: [],
          securityVulnerabilities: [],
          projectDependencies: []
        }
      })
    }

    const data = await calculateRepositoryPipeline(repo, req.headers['x-github-token'])

    if (repo && typeof repo === 'object') repo.pipeline = data

    return res.json({ success: true, message: 'Repository analysis pipeline executed.', data })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})





// ── File Flow & Code Architecture Endpoints ──────────────────



function resolveWorkspaceRepoContext(userId, rawTarget) {
  const ws = workspace(userId)
  const target = rawTarget && rawTarget !== 'sycnops' ? rawTarget : null
  const repo = target ? findRepo(ws.repos, target) : (ws.repos[0] || null)
  const repoDir = repo ? resolveAuthorizedRepoPath(repo) : null
  return { ws, repo, repoDir, projectId: repo ? String(repo.id) : String(rawTarget || '') }
}

function emptyFileFlowResponse(projectId = '') {
  return {
    projectId,
    analyzedAt: new Date().toISOString(),
    nodes: [],
    edges: [],
    files: [],
    circularDependencies: [],
    summary: {
      totalFiles: 0,
      totalNodes: 0,
      totalEdges: 0,
      languages: {},
      apiEndpointsDetected: 0,
      matchedConnections: 0,
      brokenConnections: 0,
      databaseOperations: 0
    }
  }
}

app.post('/api/file-flow/scan', requireAuth, async (req, res) => {
  try {
    const rawTarget = req.body?.repoId || req.body?.projectId || req.query?.repoId || req.query?.projectId
    const { repo, repoDir, projectId } = resolveWorkspaceRepoContext(req.auth.id, rawTarget)
    if (!repo || !repoDir) {
      return res.json({ success: true, message: 'No local repository clone available to scan.', data: emptyFileFlowResponse(projectId) })
    }
    const result = await runFileFlowScan(projectId, repoDir, req.auth.id)
    return res.json({ success: true, message: 'File flow scan completed successfully', data: result })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.get('/api/file-flow/graph', requireAuth, async (req, res) => {
  try {
    const rawTarget = req.query?.repoId || req.query?.projectId
    const { repo, repoDir, projectId } = resolveWorkspaceRepoContext(req.auth.id, rawTarget)
    if (!repo || !repoDir) {
      return res.json({ success: true, data: emptyFileFlowResponse(projectId) })
    }
    const result = await getLatestFileFlowAnalysis(projectId, req.auth.id, repoDir)
    return res.json({ success: true, data: result })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.get('/api/file-flow/files', requireAuth, async (req, res) => {
  try {
    const rawTarget = req.query?.repoId || req.query?.projectId
    const { repo, repoDir, projectId } = resolveWorkspaceRepoContext(req.auth.id, rawTarget)
    if (!repo || !repoDir) {
      return res.json({ success: true, count: 0, data: [] })
    }
    const result = await getLatestFileFlowAnalysis(projectId, req.auth.id, repoDir)
    const files = (result.files && result.files.length > 0)
      ? result.files
      : (result.nodes || []).filter((n) => n.type === 'fileNode' || n.type === 'file').map((n) => n.data || n)
    return res.json({ success: true, count: files.length, data: files })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})



app.get('/api/file-flow/file-details', requireAuth, async (req, res) => {
  try {
    const filePath = req.query?.path
    if (!filePath) {
      return res.status(400).json({ success: false, message: 'Query parameter "path" is required' })
    }
    const rawTarget = req.query?.repoId || req.query?.projectId
    const ws = workspace(req.auth.id)
    const repo = rawTarget ? findRepo(ws.repos, rawTarget) : (ws.repos[0] || null)
    const repoDir = repo ? resolveAuthorizedRepoPath(repo) : null
    const details = getFileDetails(filePath, repoDir)
    return res.json({ success: true, data: details })
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message })
  }
})

app.get('/api/file-flow/paths', requireAuth, async (req, res) => {
  try {
    const { source, target, projectId, repoId } = req.query
    if (!source || !target) {
      return res.status(400).json({ success: false, message: 'Query parameters "source" and "target" are required' })
    }
    const rawTarget = repoId || projectId
    const ws = workspace(req.auth.id)
    const repo = rawTarget ? findRepo(ws.repos, rawTarget) : (ws.repos[0] || null)
    const repoDir = repo ? resolveAuthorizedRepoPath(repo) : null
    const resolvedId = repo ? String(repo.id) : String(rawTarget || 'default')
    const analysis = await getLatestFileFlowAnalysis(resolvedId, req.auth.id, repoDir)
    const paths = findGraphPaths(source, target, analysis.edges || [])
    return res.json({ success: true, count: paths.length, data: paths })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})



// ── Code Flow AST Trace Endpoints ──────────────────────────────

app.get('/api/code-flow/operations', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const targetRepo = req.query?.repoId ? findRepo(ws.repos, req.query.repoId) : (ws.repos[0] || null)
    const repoDir = targetRepo ? resolveAuthorizedRepoPath(targetRepo) : null
    const operations = await getCodeFlowOperations(targetRepo, req.auth.id, repoDir)
    return res.json({ success: true, count: operations.length, data: operations })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.get('/api/code-flow/trace', requireAuth, async (req, res) => {
  try {
    const operation = req.query?.operation
    if (!operation) {
      return res.status(400).json({ success: false, message: 'Query parameter "operation" is required.' })
    }
    const { repo, repoDir } = resolveWorkspaceRepoContext(req.auth.id, req.query?.repoId)
    const trace = await getCodeFlowTrace(operation, repo, req.auth.id, repoDir)
    if (!trace) {
      return res.status(404).json({ success: false, message: `Operation "${operation}" not found` })
    }
    return res.json({ success: true, data: trace })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.post('/api/code-flow/analyze-file', requireAuth, async (req, res) => {
  try {
    const { code, filePath } = req.body || {}
    const result = analyzeFileAST(code, filePath)
    return res.json({ success: true, data: result })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

// ── File Topology Endpoints ────────────────────────────────────

function emptyTopologyResponse(projectId = '') {
  return {
    projectId,
    analysisId: 'empty',
    scanTimestamp: new Date().toISOString(),
    summary: {
      totalFiles: 0,
      totalFolders: 0,
      totalLines: 0,
      totalSizeBytes: 0,
      languages: {},
      categories: { frontend: 0, backend: 0, database: 0, components: 0, utilities: 0, configuration: 0, documentation: 0 },
      circularDependencies: [],
      entryPoints: [],
      manifests: [],
      totalEdges: 0
    },
    tree: { id: 'root', name: 'No Repository Selected', path: '', isDirectory: true, children: [], fileCount: 0, folderCount: 0, totalLines: 0, totalSize: 0 },
    nodes: [],
    edges: [],
    files: []
  }
}

app.get('/api/projects/:projectId/topology', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params
    const { repo, repoDir } = resolveWorkspaceRepoContext(req.auth.id, projectId)
    if (!repo || !repoDir) {
      return res.json({ success: true, data: emptyTopologyResponse(projectId) })
    }
    const topology = await getOrGenerateTopology(projectId, req.auth.id, repoDir)
    return res.json({ success: true, data: topology })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.get('/api/projects/:projectId/topology/tree', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params
    const { repo, repoDir } = resolveWorkspaceRepoContext(req.auth.id, projectId)
    const topology = (!repo || !repoDir)
      ? emptyTopologyResponse(projectId)
      : await getOrGenerateTopology(projectId, req.auth.id, repoDir)
    return res.json({
      success: true,
      data: {
        projectId,
        analysisId: topology.analysisId,
        scanTimestamp: topology.scanTimestamp,
        summary: topology.summary,
        tree: topology.tree
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.get('/api/projects/:projectId/topology/dependencies', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params
    const { repo, repoDir } = resolveWorkspaceRepoContext(req.auth.id, projectId)
    const topology = (!repo || !repoDir)
      ? emptyTopologyResponse(projectId)
      : await getOrGenerateTopology(projectId, req.auth.id, repoDir)
    return res.json({
      success: true,
      data: {
        projectId,
        analysisId: topology.analysisId,
        scanTimestamp: topology.scanTimestamp,
        circularDependencies: topology.summary?.circularDependencies || [],
        manifests: topology.summary?.manifests || [],
        edges: topology.edges || [],
        totalEdges: (topology.edges || []).length
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

app.get('/api/projects/:projectId/topology/file/*', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params
    const fileId = req.params[0]
    const ws = workspace(req.auth.id)
    const repo = findRepo(ws.repos, projectId)
    const repoDir = repo ? resolveAuthorizedRepoPath(repo) : null
    const topology = await getOrGenerateTopology(projectId, req.auth.id, repoDir)

    const file = (topology.files || []).find(f => f.path === fileId || f.name === fileId)

    if (!file) {

      return res.status(404).json({ success: false, message: `File '${fileId}' not found.` })

    }

    const incoming = (topology.edges || [])

      .filter(e => (e.data?.targetPath || e.target) === file.path)

      .map(e => e.data?.sourcePath || e.source)

    const outgoing = (topology.edges || [])

      .filter(e => (e.data?.sourcePath || e.source) === file.path)

      .map(e => e.data?.targetPath || e.target)



    return res.json({

      success: true,

      data: {

        projectId,

        file,

        incomingDependencies: incoming,

        outgoingDependencies: outgoing,

        inDegree: incoming.length,

        outDegree: outgoing.length

      }

    })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



app.post('/api/projects/:projectId/topology/rescan', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params
    const ws = workspace(req.auth.id)
    const repo = findRepo(ws.repos, projectId)
    const repoDir = repo ? resolveAuthorizedRepoPath(repo) : null
    const topology = await getOrGenerateTopology(projectId, req.auth.id, repoDir, true)
    return res.json({ success: true, message: 'Topology rescan completed.', data: topology })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})



// ── Code Quality Helpers & Background Job Registry ──────────────────────────

const reposCacheDir = path.resolve(__dirname, '.repos_cache')

const rootDir = path.resolve(__dirname, '..')

const codeQualityJobs = new Map() // Key: repositoryId -> JobRecord

const codeQualityJobsById = new Map() // Key: scanId -> JobRecord



/**

 * Resolves and validates that a repository's local filesystem path is safely confined

 * within authorized boundaries (backend/.repos_cache, workspace root, or test temp directory).

 * Prevents arbitrary filesystem path traversal.

 */

function resolveAuthorizedRepoPath(repo) {

  if (!repo) return null



  const candidates = []

  if (repo.localPath) candidates.push(repo.localPath)

  if (repo.path) candidates.push(repo.path)

  if (repo.name) {

    candidates.push(path.resolve(reposCacheDir, repo.name))

  }

  if (repo.fullName) {

    const parts = repo.fullName.split('/')

    if (parts.length === 2) {

      candidates.push(path.resolve(reposCacheDir, parts[1]))

      candidates.push(path.resolve(reposCacheDir, repo.fullName.replace(/\//g, '_')))

    }

  }



  const allowedRoots = [

    path.resolve(rootDir),

    path.resolve(reposCacheDir),

    path.resolve(os.tmpdir())

  ]



  for (const candidate of candidates) {

    try {

      const resolved = path.resolve(candidate)

      const isConfined = allowedRoots.some((allowedRoot) => {

        const rel = path.relative(allowedRoot, resolved)

        return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))

      })

      if (isConfined && fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {

        return resolved

      }

    } catch (_) { }

  }



  return null

}



// ── Code Quality REST APIs (Stage 2B) ───────────────────────────────────────



/**

 * POST /api/repositories/:id/code-quality/scan

 * Triggers a real Code Quality static analysis scan.

 * Supports asynchronous background execution (default, 202 Accepted) or synchronous (?sync=true).

 */

app.post('/api/repositories/:id/code-quality/scan', requireAuth, async (req, res) => {

  try {

    const ws = workspace(req.auth.id)

    const repo = findRepo(ws.repos, req.params.id)

    if (!repo) {

      return res.status(404).json({

        success: false,

        message: `Repository "${req.params.id}" not found in your authorized workspace.`

      })

    }



    const repoIdStr = String(repo.id)



    // Concurrency protection: reject simultaneous scans on the same repository

    const existingJob = codeQualityJobs.get(repoIdStr)

    if (

      (existingJob && (existingJob.status === 'queued' || existingJob.status === 'running')) ||

      isScanRunning(repoIdStr)

    ) {

      return res.status(409).json({

        success: false,

        message: `A code quality scan is already in progress for repository "${repo.name}". Please wait for it to complete.`,

        status: existingJob ? existingJob.status : 'running',

        scanId: existingJob ? existingJob.scanId : undefined

      })

    }



    // Resolve local directory strictly within authorized boundaries

    const resolvedPath = resolveAuthorizedRepoPath(repo)

    if (!resolvedPath) {

      return res.status(400).json({

        success: false,

        message: `Local source files not found for repository "${repo.name}". Ensure the repository is imported and cached on disk.`

      })

    }



    const isSync = req.query.sync === 'true'



    if (isSync) {

      try {

        const scanResult = await executeCodeQualityScan(resolvedPath, {
          repoId: repoIdStr,
          incremental: req.query.incremental === 'true' || req.body?.incremental === true
        })

        const saved = await saveScan({

          ...scanResult,

          repositoryId: repoIdStr,

          userId: String(req.auth.id),

          repoName: repo.name,

          repoFullName: repo.fullName

        })



        return res.status(200).json({

          success: true,

          message: 'Code quality scan completed successfully',

          scanId: saved.scanId,

          status: 'completed',

          qualityScore: saved.qualityScore,

          grade: saved.grade,

          summary: saved.summary,

          durationMs: saved.durationMs

        })

      } catch (scanErr) {

        return res.status(500).json({

          success: false,

          message: `Code quality scan execution failed: ${scanErr.message}`

        })

      }

    }



    // Asynchronous background job execution

    const scanId = `cqs_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`

    const job = {

      jobId: scanId,

      scanId,

      repositoryId: repoIdStr,

      userId: String(req.auth.id),

      repoName: repo.name,

      status: 'queued',

      createdAt: new Date().toISOString(),

      startedAt: null,

      completedAt: null,

      durationMs: null,

      qualityScore: null,

      grade: null,

      summary: null,

      error: null

    }



    codeQualityJobs.set(repoIdStr, job)

    codeQualityJobsById.set(scanId, job)



    // Respond immediately with 202 Accepted

    res.status(202).json({

      success: true,

      message: `Code quality scan queued for ${repo.name}. Monitor progress at the status endpoint.`,

      scanId,

      status: 'queued',

      statusUrl: `/api/repositories/${repo.id}/code-quality/status?scanId=${scanId}`

    })



      // Execute background analysis asynchronously

      ; (async () => {

        job.status = 'running'

        job.startedAt = new Date().toISOString()

        const jobStart = Date.now()



        try {

          const scanResult = await executeCodeQualityScan(resolvedPath, {
            repoId: repoIdStr,
            incremental: req.query.incremental === 'true' || req.body?.incremental === true
          })

          const saved = await saveScan({

            ...scanResult,

            repositoryId: repoIdStr,

            userId: String(job.userId),

            repoName: repo.name,

            repoFullName: repo.fullName

          })



          job.status = 'completed'

          job.completedAt = new Date().toISOString()

          job.durationMs = Date.now() - jobStart

          job.scanId = saved.scanId

          job.qualityScore = saved.qualityScore

          job.grade = saved.grade

          job.summary = saved.summary

          codeQualityJobsById.set(saved.scanId, job)

        } catch (err) {

          job.status = 'failed'

          job.completedAt = new Date().toISOString()

          job.durationMs = Date.now() - jobStart

          job.error = err.message

        }

      })()

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



/**

 * GET /api/repositories/:id/code-quality/status

 * Returns real-time execution status of an active or recent scan job.

 */

app.get('/api/repositories/:id/code-quality/status', requireAuth, async (req, res) => {

  try {

    const ws = workspace(req.auth.id)

    const repo = findRepo(ws.repos, req.params.id)

    if (!repo) {

      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found.` })

    }



    const repoIdStr = String(repo.id)

    let job = null



    if (req.query.scanId) {

      job = codeQualityJobsById.get(String(req.query.scanId))

    }

    if (!job) {

      job = codeQualityJobs.get(repoIdStr)

    }



    if (job && job.userId === String(req.auth.id)) {

      return res.status(200).json({

        success: true,

        repositoryId: repoIdStr,

        scanId: job.scanId,

        status: job.status,

        createdAt: job.createdAt,

        startedAt: job.startedAt,

        completedAt: job.completedAt,

        durationMs: job.durationMs,

        qualityScore: job.qualityScore,

        grade: job.grade,

        summary: job.summary,

        error: job.error

      })

    }



    // Fall back to persistent storage

    const latest = await getLatestScan(repo.id, req.auth.id)

    if (latest) {

      return res.status(200).json({

        success: true,

        repositoryId: repoIdStr,

        scanId: latest.scanId,

        status: latest.status || 'completed',

        createdAt: latest.createdAt,

        completedAt: latest.createdAt,

        durationMs: latest.durationMs,

        qualityScore: latest.qualityScore,

        grade: latest.grade,

        summary: latest.summary,

        error: latest.error

      })

    }



    return res.status(200).json({

      success: true,

      repositoryId: repoIdStr,

      status: 'idle',

      message: 'No code quality scan has been run for this repository yet.'

    })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



/**

 * GET /api/repositories/:id/code-quality

 * Returns latest scan summary metrics without returning the heavy findings array.

 */

app.get('/api/repositories/:id/code-quality', requireAuth, async (req, res) => {

  try {

    const ws = workspace(req.auth.id)

    const repo = findRepo(ws.repos, req.params.id)

    if (!repo) {

      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found.` })

    }



    const latest = await getLatestScan(repo.id, req.auth.id)

    if (!latest) {

      return res.status(404).json({

        success: false,

        message: `No completed code quality scans found for repository "${repo.name}".`

      })

    }



    return res.status(200).json({

      success: true,

      data: {

        scanId: latest.scanId,

        repositoryId: String(latest.repositoryId),

        repoName: latest.repoName,

        status: latest.status,

        qualityScore: latest.qualityScore,

        grade: latest.grade,

        penaltiesTotal: latest.penaltiesTotal,

        totalFindings: latest.summary?.totalFindings || 0,

        severityCounts: {

          critical: latest.summary?.critical || 0,

          high: latest.summary?.high || 0,

          medium: latest.summary?.medium || 0,

          low: latest.summary?.low || 0,

          informational: latest.summary?.informational || 0

        },

        scannerBreakdown: latest.summary?.byScanner || {},

        categoryBreakdown: latest.summary?.byCategory || {},

        languageBreakdown: latest.summary?.byLanguage || {},

        scanDuration: latest.durationMs,

        durationMs: latest.durationMs,

        lastScanTimestamp: latest.createdAt,

        createdAt: latest.createdAt,

        previousScore: latest.comparison?.previousScore ?? null,

        scoreDifference: latest.comparison?.scoreDifference ?? 0,

        comparison: latest.comparison ? {

          previousScanId: latest.comparison.previousScanId,

          previousScore: latest.comparison.previousScore,

          scoreDifference: latest.comparison.scoreDifference,

          newFindingsCount: latest.comparison.newFindingsCount,

          resolvedFindingsCount: latest.comparison.resolvedFindingsCount,

          persistentFindingsCount: latest.comparison.persistentFindingsCount,

          escalatedCount: latest.comparison.escalatedCount,

          reducedCount: latest.comparison.reducedCount

        } : null,

        languagesDetected: latest.languagesDetected || [],

        scannersExecuted: latest.scannersExecuted || {},

        scannedFilesCount: latest.scannedFilesCount || 0,

        summary: latest.summary

      }

    })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



/**

 * GET /api/repositories/:id/code-quality/history

 * Returns paginated scan history list without heavy findings blobs.

 */

app.get('/api/repositories/:id/code-quality/history', requireAuth, async (req, res) => {

  try {

    const ws = workspace(req.auth.id)

    const repo = findRepo(ws.repos, req.params.id)

    if (!repo) {

      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found.` })

    }



    const page = Math.max(1, parseInt(req.query.page, 10) || 1)

    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10))



    const history = await getScanHistory(repo.id, req.auth.id, { page, limit })



    return res.status(200).json({

      success: true,

      repositoryId: String(repo.id),

      data: history.scans,

      pagination: {

        total: history.total,

        page: history.page,

        totalPages: history.totalPages,

        limit: history.limit

      }

    })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



/**

 * GET /api/repositories/:id/code-quality/scans/:scanId

 * Retrieves full scan details including findings and code snippets with ownership verification.

 */

app.get('/api/repositories/:id/code-quality/scans/:scanId', requireAuth, async (req, res) => {

  try {

    const ws = workspace(req.auth.id)

    const repo = findRepo(ws.repos, req.params.id)

    if (!repo) {

      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found.` })

    }



    const { scanId } = req.params

    if (!scanId || typeof scanId !== 'string') {

      return res.status(400).json({ success: false, message: 'Invalid scanId parameter.' })

    }



    const scan = await getScanById(scanId, req.auth.id)

    if (!scan || String(scan.repositoryId) !== String(repo.id)) {

      return res.status(404).json({

        success: false,

        message: `Scan "${scanId}" not found for repository "${repo.name}".`

      })

    }



    return res.status(200).json({

      success: true,

      data: scan

    })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



/**

 * GET /api/repositories/:id/code-quality/findings/:findingId

 * Returns granular finding details including rule, severity, code snippet, and fix recommendation.

 */

app.get('/api/repositories/:id/code-quality/findings/:findingId', requireAuth, async (req, res) => {

  try {

    const ws = workspace(req.auth.id)

    const repo = findRepo(ws.repos, req.params.id)

    if (!repo) {

      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found.` })

    }



    const { findingId } = req.params

    if (!findingId || typeof findingId !== 'string') {

      return res.status(400).json({ success: false, message: 'Invalid findingId parameter.' })

    }



    let scan = null

    if (req.query.scanId) {

      scan = await getScanById(String(req.query.scanId), req.auth.id)

    } else {

      scan = await getLatestScan(repo.id, req.auth.id)

    }



    if (!scan || String(scan.repositoryId) !== String(repo.id)) {

      return res.status(404).json({

        success: false,

        message: `No scan found for repository "${repo.name}".`

      })

    }



    const finding = Array.isArray(scan.findings)

      ? scan.findings.find((f) => f.id === findingId)

      : null



    if (!finding) {

      return res.status(404).json({

        success: false,

        message: `Finding "${findingId}" not found in scan "${scan.scanId}".`

      })

    }



    return res.status(200).json({

      success: true,

      data: {

        scanId: scan.scanId,

        repositoryId: String(repo.id),

        finding

      }

    })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



// ── AI-Powered Code Quality Intelligence (Stage 4) ──────────────────────────



/**

 * GET /api/repositories/:id/code-quality/ai-status

 * Returns provider availability and model info for the client.

 */

app.get('/api/repositories/:id/code-quality/ai-status', requireAuth, async (req, res) => {

  try {

    const ws = workspace(req.auth.id)

    const repo = findRepo(ws.repos, req.params.id)

    if (!repo) {

      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found.` })

    }

    return res.status(200).json({ success: true, data: getProviderStatus() })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



/**

 * Helper to resolve finding & scan with ownership validation.

 */

async function resolveFindingForUser(req, repoId, findingId) {

  const ws = workspace(req.auth.id)

  const repo = findRepo(ws.repos, repoId)

  if (!repo) return { error: { status: 404, message: `Repository "${repoId}" not found.` } }



  if (!findingId || typeof findingId !== 'string') {

    return { error: { status: 400, message: 'Invalid findingId parameter.' } }

  }



  const scanId = req.query.scanId || req.body?.scanId

  let scan = null

  if (scanId) {

    scan = await getScanById(String(scanId), req.auth.id)

  } else {

    scan = await getLatestScan(repo.id, req.auth.id)

  }



  if (!scan || String(scan.repositoryId) !== String(repo.id)) {

    return { error: { status: 404, message: `No scan found for repository "${repo.name}".` } }

  }



  const finding = Array.isArray(scan.findings)

    ? scan.findings.find((f) => f.id === findingId)

    : null



  if (!finding) {

    return { error: { status: 404, message: `Finding "${findingId}" not found in scan "${scan.scanId}".` } }

  }



  const language = repo.language || scan.summary?.languages?.[0] || 'Unknown'

  return { repo, scan, finding, language }

}



/**

 * POST /api/repositories/:id/code-quality/findings/:findingId/explain

 * Generates or retrieves a cached AI explanation for a specific scanner finding.

 */

app.post('/api/repositories/:id/code-quality/findings/:findingId/explain', requireAuth, async (req, res) => {

  try {

    const resolved = await resolveFindingForUser(req, req.params.id, req.params.findingId)

    if (resolved.error) {

      return res.status(resolved.error.status).json({ success: false, message: resolved.error.message })

    }



    const { repo, scan, finding, language } = resolved

    const fingerprint = computeFindingFingerprint(finding, { language })

    const regenerate = Boolean(req.body?.regenerate)



    // 1. Check Cache if not regenerating

    if (!regenerate) {

      const cachedRecord = await getAIExplanationRecord({

        userId: req.auth.id,

        repositoryId: repo.id,

        findingId: finding.id,

        fingerprint

      })



      if (cachedRecord && cachedRecord.explanation) {

        return res.status(200).json({

          success: true,

          cached: true,

          data: cachedRecord.explanation

        })

      }

    } else {

      // Invalidate existing record on regenerate

      await deleteAIExplanationRecord({

        userId: req.auth.id,

        repositoryId: repo.id,

        findingId: finding.id

      })

    }



    // 2. Verify AI Provider is Available

    if (!isAIProviderAvailable()) {

      return res.status(503).json({

        success: false,

        error: 'PROVIDER_UNAVAILABLE',

        message: 'Gemini AI provider is not configured. Set GEMINI_API_KEY in backend/.env to enable AI explanations.'

      })

    }



    // 3. Generate Explanation via Provider

    const explanation = await generateFindingExplanation(

      finding,

      { language, repoName: repo.name },

      req.body || {}

    )



    // 4. Save to AIHistory Cache

    await saveAIExplanationRecord({

      userId: req.auth.id,

      repositoryId: String(repo.id),

      scanId: scan.scanId,

      findingId: finding.id,

      fingerprint,

      type: 'finding_explanation',

      scanner: finding.scanner,

      ruleId: finding.ruleId,

      explanation

    })



    return res.status(200).json({

      success: true,

      cached: false,

      data: explanation

    })

  } catch (err) {

    const status = err.status || (err.code === 'PROVIDER_UNAVAILABLE' ? 503 : 500)

    return res.status(status).json({

      success: false,

      error: err.code || 'AI_GENERATION_FAILED',

      message: err.message || 'Failed to generate AI explanation'

    })

  }

})



/**

 * GET /api/repositories/:id/code-quality/findings/:findingId/explain

 * Retrieves an existing AI explanation for a finding.

 */

app.get('/api/repositories/:id/code-quality/findings/:findingId/explain', requireAuth, async (req, res) => {

  try {

    const resolved = await resolveFindingForUser(req, req.params.id, req.params.findingId)

    if (resolved.error) {

      return res.status(resolved.error.status).json({ success: false, message: resolved.error.message })

    }



    const { repo, finding } = resolved

    const record = await getAIExplanationRecord({

      userId: req.auth.id,

      repositoryId: repo.id,

      findingId: finding.id

    })



    if (!record || !record.explanation) {

      return res.status(404).json({

        success: false,

        message: 'No AI explanation found for this finding. Click "Explain with AI" to generate one.'

      })

    }



    return res.status(200).json({

      success: true,

      data: record.explanation

    })

  } catch (err) {

    return res.status(500).json({ success: false, message: err.message })

  }

})



/**

 * POST /api/repositories/:id/code-quality/findings/:findingId/regenerate

 * Forces a fresh generation of an AI explanation, bypassing cached results.

 */

app.post('/api/repositories/:id/code-quality/findings/:findingId/regenerate', requireAuth, async (req, res) => {

  req.body = { ...(req.body || {}), regenerate: true }

  // Forward to explain handler logic

  try {

    const resolved = await resolveFindingForUser(req, req.params.id, req.params.findingId)

    if (resolved.error) {

      return res.status(resolved.error.status).json({ success: false, message: resolved.error.message })

    }



    const { repo, scan, finding, language } = resolved

    const fingerprint = computeFindingFingerprint(finding, { language })



    await deleteAIExplanationRecord({

      userId: req.auth.id,

      repositoryId: repo.id,

      findingId: finding.id

    })



    if (!isAIProviderAvailable()) {

      return res.status(503).json({

        success: false,

        error: 'PROVIDER_UNAVAILABLE',

        message: 'Gemini AI provider is not configured. Set GEMINI_API_KEY in backend/.env to enable AI explanations.'

      })

    }



    const explanation = await generateFindingExplanation(

      finding,

      { language, repoName: repo.name },

      req.body || {}

    )



    await saveAIExplanationRecord({

      userId: req.auth.id,

      repositoryId: String(repo.id),

      scanId: scan.scanId,

      findingId: finding.id,

      fingerprint,

      type: 'finding_explanation',

      scanner: finding.scanner,

      ruleId: finding.ruleId,

      explanation

    })



    return res.status(200).json({

      success: true,

      cached: false,

      data: explanation

    })

  } catch (err) {

    const status = err.status || (err.code === 'PROVIDER_UNAVAILABLE' ? 503 : 500)

    return res.status(status).json({

      success: false,

      error: err.code || 'AI_GENERATION_FAILED',

      message: err.message || 'Failed to regenerate AI explanation'

    })

  }

})




// ── Stage 5: AI Fix Assistant REST APIs ─────────────────────────────────────

/**
 * POST /api/repositories/:id/code-quality/findings/:findingId/generate-fix
 * Generates an automated, surgical AI code fix and unified diff for a finding.
 */
app.post('/api/repositories/:id/code-quality/findings/:findingId/generate-fix', requireAuth, async (req, res) => {
  try {
    const resolved = await resolveFindingForUser(req, req.params.id, req.params.findingId)
    if (resolved.error) {
      return res.status(resolved.error.status).json({ success: false, message: resolved.error.message })
    }

    const { repo, scan, finding } = resolved
    const resolvedRepoDir = resolveAuthorizedRepoPath(repo)
    if (!resolvedRepoDir) {
      return res.status(400).json({
        success: false,
        message: `Local source files not found for repository "${repo.name}". Ensure the repository is imported and cached on disk.`
      })
    }

    const patch = await generateAIFix({
      repo,
      repoDir: resolvedRepoDir,
      finding,
      user: req.auth,
      options: req.body || {}
    })

    return res.status(200).json({
      success: true,
      data: patch
    })
  } catch (err) {
    const status = err.status || 500
    return res.status(status).json({
      success: false,
      error: err.code || 'AI_FIX_GENERATION_FAILED',
      message: err.message || 'Failed to generate AI fix'
    })
  }
})

/**
 * GET /api/repositories/:id/code-quality/findings/:findingId/fix
 * Retrieves the latest proposed or applied AI patch for a finding.
 */
app.get('/api/repositories/:id/code-quality/findings/:findingId/fix', requireAuth, async (req, res) => {
  try {
    const resolved = await resolveFindingForUser(req, req.params.id, req.params.findingId)
    if (resolved.error) {
      return res.status(resolved.error.status).json({ success: false, message: resolved.error.message })
    }

    const { repo, finding } = resolved
    const patch = await getLatestPatchForFinding(repo.id, finding.id, req.auth.id)
    if (!patch) {
      return res.status(404).json({
        success: false,
        message: 'No AI fix found for this finding. Click "Generate AI Fix" to create one.'
      })
    }

    return res.status(200).json({
      success: true,
      data: patch
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

/**
 * POST /api/repositories/:id/code-quality/patches/:patchId/apply
 * Safely applies an approved AI patch to repository source code, creates backup,
 * and executes scanner verification.
 */
app.post('/api/repositories/:id/code-quality/patches/:patchId/apply', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const repo = findRepo(ws.repos, req.params.id)
    if (!repo) {
      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found in your workspace.` })
    }

    const resolvedRepoDir = resolveAuthorizedRepoPath(repo)
    if (!resolvedRepoDir) {
      return res.status(400).json({
        success: false,
        message: `Local source files not found for repository "${repo.name}".`
      })
    }

    const applyResult = await applyAIFix({
      repo,
      repoDir: resolvedRepoDir,
      patchId: req.params.patchId,
      userId: req.auth.id,
      options: req.body || {}
    })

    // Execute scanner validation
    let validation = { validationResult: null, validationMessage: null, patch: applyResult.patch }
    if (!req.body?.skipValidation) {
      try {
        validation = await validateAIFixWithScanner({
          repoDir: resolvedRepoDir,
          patch: applyResult.patch,
          userId: req.auth.id
        })
      } catch (valErr) {
        console.warn('[AIFix] Scanner validation notice:', valErr.message)
      }
    }

    return res.status(200).json({
      success: true,
      data: validation.patch || applyResult.patch,
      validationResult: validation.validationResult,
      validationMessage: validation.validationMessage
    })
  } catch (err) {
    const status = err.status || 500
    return res.status(status).json({
      success: false,
      error: err.code || 'PATCH_APPLICATION_FAILED',
      message: err.message || 'Failed to apply patch'
    })
  }
})

/**
 * POST /api/repositories/:id/code-quality/patches/:patchId/rollback
 * Restores pre-fix source code from recoverable backup snapshot.
 */
app.post('/api/repositories/:id/code-quality/patches/:patchId/rollback', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const repo = findRepo(ws.repos, req.params.id)
    if (!repo) {
      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found in your workspace.` })
    }

    const resolvedRepoDir = resolveAuthorizedRepoPath(repo)
    if (!resolvedRepoDir) {
      return res.status(400).json({
        success: false,
        message: `Local source files not found for repository "${repo.name}".`
      })
    }

    const rollbackResult = await rollbackAIFix({
      repo,
      repoDir: resolvedRepoDir,
      patchId: req.params.patchId,
      userId: req.auth.id
    })

    return res.status(200).json(rollbackResult)
  } catch (err) {
    const status = err.status || 500
    return res.status(status).json({
      success: false,
      error: err.code || 'ROLLBACK_FAILED',
      message: err.message || 'Failed to rollback patch'
    })
  }
})

/**
 * POST /api/repositories/:id/code-quality/patches/:patchId/reject
 * Explicitly marks a proposed AI patch as rejected.
 */
app.post('/api/repositories/:id/code-quality/patches/:patchId/reject', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const repo = findRepo(ws.repos, req.params.id)
    if (!repo) {
      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found in your workspace.` })
    }

    const patch = await getPatchById(req.params.patchId, req.auth.id)
    if (!patch) {
      return res.status(404).json({ success: false, message: `Patch "${req.params.patchId}" not found or unauthorized.` })
    }

    const updated = await updatePatchRecord(req.params.patchId, req.auth.id, {
      status: 'rejected'
    })

    return res.status(200).json({
      success: true,
      message: 'Patch marked as rejected.',
      data: updated
    })
  } catch (err) {
    const status = err.status || 500
    return res.status(status).json({
      success: false,
      error: err.code || 'PATCH_REJECTION_FAILED',
      message: err.message || 'Failed to reject patch'
    })
  }
})


// ══════════════════════════════════════════════════════════════════════════════
// ── STAGE 6: GitHub Integration & AI Fix Pull Request Automation ──────────────
// ══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/repositories/:id/pull-requests/prepare
 * Inspects working tree cleanliness, validates proposed branch name,
 * generates commit preview, and constructs PR title & description.
 */
app.post('/api/repositories/:id/pull-requests/prepare', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const repo = findRepo(ws.repos, req.params.id)
    if (!repo) {
      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found in your workspace.` })
    }

    const resolvedRepoDir = resolveAuthorizedRepoPath(repo)
    if (!resolvedRepoDir) {
      return res.status(400).json({ success: false, message: `Local source files not found for repository "${repo.name}".` })
    }

    // 1. Check for uncommitted developer changes
    await checkWorkingTreeClean(resolvedRepoDir)

    const { patchIds, branchName, baseBranch, customCommitMessage, customTitle, customDescription } = req.body || {}
    if (!Array.isArray(patchIds) || patchIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one approved AI patch.' })
    }

    // 2. Fetch and validate each patch
    const patches = []
    const affectedFiles = []
    for (const pId of patchIds) {
      const patch = await getPatchById(pId, req.auth.id)
      if (!patch) {
        return res.status(404).json({ success: false, message: `Patch "${pId}" not found or unauthorized.` })
      }
      if (patch.repositoryId !== String(repo.id)) {
        return res.status(400).json({ success: false, message: `Patch "${pId}" belongs to another repository.` })
      }
      patches.push(patch)
      if (!affectedFiles.includes(patch.filePath)) {
        affectedFiles.push(patch.filePath)
      }
    }

    // 3. Validate branch name (never default branch)
    const targetBaseBranch = baseBranch?.trim() || repo.defaultBranch || 'main'
    const proposedBranchName = branchName?.trim() || `syncops/fix-${patches[0].ruleId || 'security'}-${Date.now().toString(36)}`
    const { sanitizedBranchName } = validateBranchName(proposedBranchName, targetBaseBranch)

    // 4. Generate proposed commit message & PR content
    const proposedCommit = generateCommitMessage({ patches, customMessage: customCommitMessage })
    const { title: proposedTitle, description: proposedDescription } = generatePRContent({
      repo,
      branchName: sanitizedBranchName,
      baseBranch: targetBaseBranch,
      patches,
      user: req.auth,
      customTitle,
      customDescription
    })

    return res.status(200).json({
      success: true,
      data: {
        branchName: sanitizedBranchName,
        baseBranch: targetBaseBranch,
        affectedFiles,
        patches,
        proposedCommit,
        proposedTitle,
        proposedDescription
      }
    })
  } catch (err) {
    const status = err.status || 500
    return res.status(status).json({
      success: false,
      error: err.code || 'PREPARE_PR_FAILED',
      message: err.message || 'Failed to prepare pull request',
      modifiedFiles: err.modifiedFiles
    })
  }
})

/**
 * POST /api/repositories/:id/pull-requests/validate
 * Checks out isolated fix branch, safely applies patches, runs ESLint/Ruff/Semgrep
 * and safe repository test policy, comparing findings against baseline scan.
 */
app.post('/api/repositories/:id/pull-requests/validate', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const repo = findRepo(ws.repos, req.params.id)
    if (!repo) {
      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found in your workspace.` })
    }

    const resolvedRepoDir = resolveAuthorizedRepoPath(repo)
    if (!resolvedRepoDir) {
      return res.status(400).json({ success: false, message: `Local source files not found for repository "${repo.name}".` })
    }

    const { patchIds, branchName, baseBranch, runTests } = req.body || {}
    if (!Array.isArray(patchIds) || patchIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one approved AI patch.' })
    }

    const targetBaseBranch = baseBranch?.trim() || repo.defaultBranch || 'main'
    const targetBranchName = branchName?.trim() || `syncops/fix-${Date.now().toString(36)}`

    // 1. Create or checkout isolated branch
    await createOrCheckoutFixBranch({
      repoDir: resolvedRepoDir,
      branchName: targetBranchName,
      baseBranch: targetBaseBranch
    })

    // 2. Apply patches to this branch
    const { appliedPatches, affectedFiles } = await applyMultiplePatches({
      repo,
      repoDir: resolvedRepoDir,
      patchIds,
      userId: req.auth.id,
      options: req.body
    })

    // 3. Retrieve baseline scan for comparison
    const baselineScan = await getLatestScan(repo.id, req.auth.id)
    const baselineFindings = baselineScan?.findings || []

    // 4. Run quality validation (ESLint, Ruff, Semgrep + safe tests)
    const validation = await executeQualityValidation({
      repo,
      repoDir: resolvedRepoDir,
      modifiedFiles: affectedFiles,
      baselineFindings,
      options: { runTests: Boolean(runTests) }
    })

    return res.status(200).json({
      success: true,
      data: {
        branch: targetBranchName,
        baseBranch: targetBaseBranch,
        affectedFiles,
        appliedPatches,
        validation
      }
    })
  } catch (err) {
    const status = err.status || 500
    return res.status(status).json({
      success: false,
      error: err.code || 'VALIDATION_FAILED',
      message: err.message || 'Validation execution failed'
    })
  }
})

/**
 * POST /api/repositories/:id/pull-requests/create
 * Commits changes to isolated fix branch, pushes to GitHub remote,
 * creates GitHub Pull Request, and stores PR record.
 * Requires explicit user confirmation.
 */
app.post('/api/repositories/:id/pull-requests/create', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const repo = findRepo(ws.repos, req.params.id)
    if (!repo) {
      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found in your workspace.` })
    }

    const resolvedRepoDir = resolveAuthorizedRepoPath(repo)
    if (!resolvedRepoDir) {
      return res.status(400).json({ success: false, message: `Local source files not found for repository "${repo.name}".` })
    }

    // Explicit confirmation required
    if (!req.body?.confirmed) {
      return res.status(400).json({
        success: false,
        error: 'CONFIRMATION_REQUIRED',
        message: 'Explicit user confirmation is required to create a commit and push a Pull Request.'
      })
    }

    const {
      patchIds,
      branchName,
      baseBranch,
      commitMessage: customCommitMessage,
      title: customTitle,
      description: customDescription,
      githubToken: customToken,
      overrideValidation,
      force,
      runTests,
      draft
    } = req.body || {}

    if (!Array.isArray(patchIds) || patchIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one approved AI patch.' })
    }

    const targetBaseBranch = baseBranch?.trim() || repo.defaultBranch || 'main'
    const targetBranchName = branchName?.trim() || `syncops/fix-${Date.now().toString(36)}`

    // 1. Create or checkout isolated branch
    await createOrCheckoutFixBranch({
      repoDir: resolvedRepoDir,
      branchName: targetBranchName,
      baseBranch: targetBaseBranch
    })

    // 2. Apply patches
    const { appliedPatches, affectedFiles } = await applyMultiplePatches({
      repo,
      repoDir: resolvedRepoDir,
      patchIds,
      userId: req.auth.id,
      options: req.body
    })

    // 3. Execute quality validation
    const baselineScan = await getLatestScan(repo.id, req.auth.id)
    const baselineFindings = baselineScan?.findings || []

    const validation = await executeQualityValidation({
      repo,
      repoDir: resolvedRepoDir,
      modifiedFiles: affectedFiles,
      baselineFindings,
      options: { runTests: Boolean(runTests) }
    })

    // Check if validation failed and no override
    if (!validation.passed && !overrideValidation && !force) {
      return res.status(422).json({
        success: false,
        error: 'VALIDATION_FAILED',
        message: 'Quality validation checks failed. Set overrideValidation: true to explicitly proceed.',
        data: { validation }
      })
    }

    // 4. Generate commit message and commit changes
    const finalCommitMessage = generateCommitMessage({
      patches: appliedPatches,
      customMessage: customCommitMessage
    })

    const commitResult = await createFixCommit({
      repoDir: resolvedRepoDir,
      commitMessage: finalCommitMessage,
      affectedFiles,
      user: req.auth
    })

    // 5. Generate PR Title & Description
    const { title: prTitle, description: prDescription } = generatePRContent({
      repo,
      branchName: targetBranchName,
      baseBranch: targetBaseBranch,
      patches: appliedPatches,
      validation,
      user: req.auth,
      customTitle,
      customDescription
    })

    // 6. Push and create GitHub Pull Request
    const token = decryptToken(customToken || req.headers['x-github-token'] || repo.githubToken || repo.encryptedGithubToken)
    const prRecord = await createGitHubPullRequest({
      repo,
      repoDir: resolvedRepoDir,
      branchName: targetBranchName,
      baseBranch: targetBaseBranch,
      commitSha: commitResult.commitSha,
      title: prTitle,
      description: prDescription,
      patchIds,
      affectedFiles,
      validation,
      token,
      user: req.auth,
      options: { overrideValidation, force, draft }
    })

    return res.status(201).json({
      success: true,
      message: `Pull Request #${prRecord.number || ''} successfully created on GitHub.`,
      data: prRecord
    })
  } catch (err) {
    const status = err.status || 500
    return res.status(status).json({
      success: false,
      error: err.code || 'PR_CREATION_FAILED',
      message: err.message || 'Failed to create pull request',
      validation: err.validation
    })
  }
})

/**
 * GET /api/repositories/:id/pull-requests
 * Retrieves list of PR records created for this repository.
 */
app.get('/api/repositories/:id/pull-requests', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const repo = findRepo(ws.repos, req.params.id)
    if (!repo) {
      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found in your workspace.` })
    }

    const prs = await getPullRequestsByRepo(repo.id, req.auth.id)
    return res.status(200).json({ success: true, count: prs.length, data: prs })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

/**
 * GET /api/repositories/:id/pull-requests/:prId
 * Retrieves detailed PR record for a specific PR.
 */
app.get('/api/repositories/:id/pull-requests/:prId', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const repo = findRepo(ws.repos, req.params.id)
    if (!repo) {
      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found in your workspace.` })
    }

    const pr = await getPullRequestById(req.params.prId, req.auth.id)
    if (!pr || pr.repositoryId !== String(repo.id)) {
      return res.status(404).json({ success: false, message: `Pull Request "${req.params.prId}" not found or unauthorized.` })
    }

    return res.status(200).json({ success: true, data: pr })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

/**
 * POST /api/repositories/:id/pull-requests/:prId/sync
 * Synchronizes live PR status from GitHub API.
 */
app.post('/api/repositories/:id/pull-requests/:prId/sync', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const repo = findRepo(ws.repos, req.params.id)
    if (!repo) {
      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found in your workspace.` })
    }

    const pr = await getPullRequestById(req.params.prId, req.auth.id)
    if (!pr || pr.repositoryId !== String(repo.id)) {
      return res.status(404).json({ success: false, message: `Pull Request "${req.params.prId}" not found or unauthorized.` })
    }

    const token = decryptToken(req.body?.githubToken || req.headers['x-github-token'] || repo.githubToken || repo.encryptedGithubToken)
    const synced = await syncPullRequestStatus({
      repo,
      prRecord: pr,
      token,
      userId: req.auth.id
    })

    return res.status(200).json({
      success: true,
      message: `Synchronized PR #${synced.number || pr.id} status (${synced.status}).`,
      data: synced
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

/**
 * POST /api/repositories/:id/pull-requests/rollback
 * Restores pre-patch backup files and checks out base branch.
 */
app.post('/api/repositories/:id/pull-requests/rollback', requireAuth, async (req, res) => {
  try {
    const ws = workspace(req.auth.id)
    const repo = findRepo(ws.repos, req.params.id)
    if (!repo) {
      return res.status(404).json({ success: false, message: `Repository "${req.params.id}" not found in your workspace.` })
    }

    const resolvedRepoDir = resolveAuthorizedRepoPath(repo)
    if (!resolvedRepoDir) {
      return res.status(400).json({ success: false, message: `Local source files not found for repository "${repo.name}".` })
    }

    const { patchIds, baseBranch } = req.body || {}
    const result = await rollbackFixBranchOrPatches({
      repoDir: resolvedRepoDir,
      repo,
      baseBranch: baseBranch || repo.defaultBranch || 'main',
      patchIds: Array.isArray(patchIds) ? patchIds : [],
      userId: req.auth.id
    })

    return res.status(200).json(result)
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



export {
  app,
  server,
  workspace,
  makeToken,
  findRepo,
  codeQualityJobs,
  codeQualityJobsById,
  resolveAuthorizedRepoPath,
  validateBranchName,
  checkWorkingTreeClean,
  createOrCheckoutFixBranch,
  applyMultiplePatches,
  executeQualityValidation,
  generateCommitMessage,
  createFixCommit,
  generatePRContent,
  createGitHubPullRequest,
  syncPullRequestStatus,
  rollbackFixBranchOrPatches,
  savePullRequestRecord,
  getPullRequestById,
  getPullRequestsByRepo,
  getAllPullRequestsForUser,
  updatePullRequestRecord
}

