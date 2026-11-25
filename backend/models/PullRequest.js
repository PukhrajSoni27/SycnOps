/**
 * PullRequest model and persistence module for SyncOps.
 * 
 * Supports multi-tier persistence:
 * 1. Tier 1: Firebase Firestore (`pull_requests` collection)
 * 2. Tier 2: Local disk cache (`.pull_requests_cache.json`)
 * 3. Tier 3: In-memory store
 * 
 * Guarantees strict multi-tenant user and repository isolation.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getDB, isFirestoreConnected } from '../config/firebase.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const backendDir = path.resolve(rootDir, 'backend')
const DISK_CACHE_FILE = path.resolve(backendDir, '.pull_requests_cache.json')

export const PULL_REQUESTS_COLLECTION = 'pull_requests'

// ── In-Memory Pull Request Store ────────────────────────────────────────────
// Key: prId -> PullRequestRecord
const _IN_MEMORY_PULL_REQUESTS = new Map()

// ── Disk Cache Helpers ──────────────────────────────────────────────────────
function readDiskCache() {
  try {
    if (fs.existsSync(DISK_CACHE_FILE)) {
      const raw = fs.readFileSync(DISK_CACHE_FILE, 'utf8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.warn('[PullRequest] Disk cache read notice:', err.message)
  }
  return []
}

function writeDiskCache(records) {
  try {
    fs.writeFileSync(DISK_CACHE_FILE, JSON.stringify(records, null, 2), 'utf8')
  } catch (err) {
    console.warn('[PullRequest] Disk cache write notice:', err.message)
  }
}

export function getPullRequestsCollection() {
  const db = getDB()
  return db ? db.collection(PULL_REQUESTS_COLLECTION) : null
}

/**
 * Saves a new or updated Pull Request record to storage.
 */
export async function savePullRequestRecord(record = {}) {
  const now = new Date().toISOString()
  const userId = String(record.userId || '')
  const repoId = String(record.repositoryId || '')
  const prId = String(record.id || record.prId || `pr_${userId}_${repoId}_${Date.now()}`)

  const docData = {
    id: prId,
    prId,
    userId,
    repositoryId: repoId,
    repoFullName: record.repoFullName || '',
    number: typeof record.number === 'number' ? record.number : null,
    title: record.title || 'SyncOps AI Fix Pull Request',
    description: record.description || '',
    headBranch: record.headBranch || '',
    baseBranch: record.baseBranch || 'main',
    commitSha: record.commitSha || null,
    htmlUrl: record.htmlUrl || null,
    status: record.status || 'open', // 'open' | 'merged' | 'closed' | 'failed'
    draft: Boolean(record.draft),
    patchIds: Array.isArray(record.patchIds) ? record.patchIds : [],
    affectedFiles: Array.isArray(record.affectedFiles) ? record.affectedFiles : [],
    validationSummary: record.validationSummary || {
      scannersExecuted: [],
      resolvedCount: 0,
      remainingCount: 0,
      newlyIntroducedCount: 0,
      testsExecuted: false,
      testsPassed: null
    },
    createdAt: record.createdAt || now,
    updatedAt: now,
    mergedAt: record.mergedAt || null,
    closedAt: record.closedAt || null,
    githubSyncedAt: record.githubSyncedAt || null
  }

  // 1. In-Memory
  _IN_MEMORY_PULL_REQUESTS.set(prId, docData)

  // 2. Disk Cache
  try {
    const diskRecords = readDiskCache()
    const idx = diskRecords.findIndex((r) => r.id === prId || r.prId === prId)
    if (idx >= 0) {
      diskRecords[idx] = docData
    } else {
      diskRecords.unshift(docData)
    }
    writeDiskCache(diskRecords)
  } catch (e) {
    console.warn('[PullRequest] Failed to write disk cache:', e.message)
  }

  // 3. Firestore if connected
  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      const col = db.collection(PULL_REQUESTS_COLLECTION)
      await col.doc(prId).set(docData, { merge: true })
    } catch (e) {
      console.warn('[PullRequest] Firestore save notice:', e.message)
    }
  }

  return docData
}

/**
 * Retrieves a Pull Request by ID, enforcing user authorization.
 */
export async function getPullRequestById(prId, userId) {
  if (!prId) return null
  const uId = String(userId || '')
  const idStr = String(prId)

  // 1. Check in-memory
  const mem = _IN_MEMORY_PULL_REQUESTS.get(idStr)
  if (mem) {
    if (mem.userId !== uId) return null // Multi-tenant isolation
    return mem
  }

  // 2. Check disk cache
  const diskRecords = readDiskCache()
  const foundDisk = diskRecords.find((r) => (r.id === idStr || r.prId === idStr))
  if (foundDisk) {
    if (foundDisk.userId !== uId) return null
    _IN_MEMORY_PULL_REQUESTS.set(idStr, foundDisk)
    return foundDisk
  }

  // 3. Check Firestore
  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      const col = db.collection(PULL_REQUESTS_COLLECTION)
      const snap = await col.doc(idStr).get()
      if (snap.exists) {
        const data = snap.data()
        if (data.userId !== uId) return null
        _IN_MEMORY_PULL_REQUESTS.set(idStr, data)
        return data
      }
    } catch (e) {
      console.warn('[PullRequest] Firestore read notice:', e.message)
    }
  }

  return null
}

/**
 * Retrieves all Pull Requests for a specific repository and user.
 */
export async function getPullRequestsByRepo(repositoryId, userId) {
  const repoId = String(repositoryId || '')
  const uId = String(userId || '')

  const results = new Map()

  // 1. In-memory
  for (const [id, pr] of _IN_MEMORY_PULL_REQUESTS.entries()) {
    if (pr.repositoryId === repoId && pr.userId === uId) {
      results.set(id, pr)
    }
  }

  // 2. Disk cache
  const diskRecords = readDiskCache()
  for (const pr of diskRecords) {
    if (pr.repositoryId === repoId && pr.userId === uId) {
      if (!results.has(pr.id)) {
        results.set(pr.id, pr)
        _IN_MEMORY_PULL_REQUESTS.set(pr.id, pr)
      }
    }
  }

  // 3. Firestore
  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      const col = db.collection(PULL_REQUESTS_COLLECTION)
      const snap = await col
        .where('repositoryId', '==', repoId)
        .where('userId', '==', uId)
        .orderBy('createdAt', 'desc')
        .get()

      for (const doc of snap.docs) {
        const data = doc.data()
        if (!results.has(data.id)) {
          results.set(data.id, data)
          _IN_MEMORY_PULL_REQUESTS.set(data.id, data)
        }
      }
    } catch (e) {
      console.warn('[PullRequest] Firestore query notice:', e.message)
    }
  }

  const list = Array.from(results.values())
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return list
}

/**
 * Retrieves all Pull Requests across all repositories for a user.
 */
export async function getAllPullRequestsForUser(userId) {
  const uId = String(userId || '')
  const results = new Map()

  for (const [id, pr] of _IN_MEMORY_PULL_REQUESTS.entries()) {
    if (pr.userId === uId) results.set(id, pr)
  }

  const diskRecords = readDiskCache()
  for (const pr of diskRecords) {
    if (pr.userId === uId && !results.has(pr.id)) {
      results.set(pr.id, pr)
      _IN_MEMORY_PULL_REQUESTS.set(pr.id, pr)
    }
  }

  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      const col = db.collection(PULL_REQUESTS_COLLECTION)
      const snap = await col.where('userId', '==', uId).get()
      for (const doc of snap.docs) {
        const data = doc.data()
        if (!results.has(data.id)) {
          results.set(data.id, data)
          _IN_MEMORY_PULL_REQUESTS.set(data.id, data)
        }
      }
    } catch (e) {
      console.warn('[PullRequest] Firestore query notice:', e.message)
    }
  }

  const list = Array.from(results.values())
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return list
}

/**
 * Updates an existing Pull Request record.
 */
export async function updatePullRequestRecord(prId, userId, updateFields = {}) {
  const existing = await getPullRequestById(prId, userId)
  if (!existing) {
    const err = new Error(`Pull Request "${prId}" not found or unauthorized`)
    err.code = 'NOT_FOUND'
    err.status = 404
    throw err
  }

  const updated = {
    ...existing,
    ...updateFields,
    updatedAt: new Date().toISOString()
  }

  _IN_MEMORY_PULL_REQUESTS.set(prId, updated)

  try {
    const diskRecords = readDiskCache()
    const idx = diskRecords.findIndex((r) => r.id === prId || r.prId === prId)
    if (idx >= 0) {
      diskRecords[idx] = updated
    } else {
      diskRecords.unshift(updated)
    }
    writeDiskCache(diskRecords)
  } catch (e) {
    console.warn('[PullRequest] Failed to update disk cache:', e.message)
  }

  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      const col = db.collection(PULL_REQUESTS_COLLECTION)
      await col.doc(prId).set(updated, { merge: true })
    } catch (e) {
      console.warn('[PullRequest] Firestore update notice:', e.message)
    }
  }

  return updated
}

/**
 * Testing helper: clears all in-memory and disk PR records.
 */
export function _clearPullRequestsForTesting() {
  _IN_MEMORY_PULL_REQUESTS.clear()
  try {
    if (fs.existsSync(DISK_CACHE_FILE)) {
      fs.unlinkSync(DISK_CACHE_FILE)
    }
  } catch (_) {}
}

export default {
  PULL_REQUESTS_COLLECTION,
  getPullRequestsCollection,
  savePullRequestRecord,
  getPullRequestById,
  getPullRequestsByRepo,
  getAllPullRequestsForUser,
  updatePullRequestRecord,
  _clearPullRequestsForTesting
}
