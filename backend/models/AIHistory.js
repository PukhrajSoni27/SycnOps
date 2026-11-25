/**
 * AIHistory model and persistence module for SyncOps.
 * 
 * Supports multi-tier persistence:
 * 1. Tier 1: Firebase Firestore (`ai_histories` collection)
 * 2. Tier 2: Local disk cache (`.ai_history_cache.json`)
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
const DISK_CACHE_FILE = path.resolve(backendDir, '.ai_history_cache.json')

export const AI_HISTORY_COLLECTION = 'ai_histories'

// ── In-Memory AI History Store ──────────────────────────────────────────────
// Key: recordId -> Record
const _IN_MEMORY_AI_HISTORY = new Map()

// ── Disk Cache Helpers ──────────────────────────────────────────────────────
function readDiskCache() {
  try {
    if (fs.existsSync(DISK_CACHE_FILE)) {
      const raw = fs.readFileSync(DISK_CACHE_FILE, 'utf8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.warn('[AIHistory] Disk cache read notice:', err.message)
  }
  return []
}

function writeDiskCache(records) {
  try {
    fs.writeFileSync(DISK_CACHE_FILE, JSON.stringify(records, null, 2), 'utf8')
  } catch (err) {
    console.warn('[AIHistory] Disk cache write notice:', err.message)
  }
}

export function getAIHistoryCollection() {
  const db = getDB()
  return db ? db.collection(AI_HISTORY_COLLECTION) : null
}

/**
 * Saves an AI explanation or prompt interaction record to storage.
 */
export async function saveAIExplanationRecord(record = {}) {
  const now = new Date().toISOString()
  const userId = String(record.userId || '')
  const findingId = String(record.findingId || '')
  const repoId = String(record.repositoryId || '')

  const recordId = record.id || `aih_${userId}_${findingId}`

  const docData = {
    id: recordId,
    userId,
    repositoryId: repoId,
    scanId: record.scanId ? String(record.scanId) : null,
    findingId,
    fingerprint: record.fingerprint || '',
    type: record.type || 'finding_explanation',
    scanner: record.scanner || '',
    ruleId: record.ruleId || '',
    explanation: record.explanation || null,
    createdAt: record.createdAt || now,
    updatedAt: now
  }

  // 1. Update In-Memory
  _IN_MEMORY_AI_HISTORY.set(recordId, docData)

  // 2. Update Disk Cache
  try {
    const diskRecords = readDiskCache()
    const idx = diskRecords.findIndex((r) => r.id === recordId)
    if (idx >= 0) {
      diskRecords[idx] = docData
    } else {
      diskRecords.unshift(docData)
    }
    writeDiskCache(diskRecords)
  } catch (e) {
    console.warn('[AIHistory] Failed to write disk cache:', e.message)
  }

  // 3. Update Firestore if connected
  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      await db.collection(AI_HISTORY_COLLECTION).doc(recordId).set(docData, { merge: true })
    } catch (err) {
      console.warn('[AIHistory] Firestore write notice:', err.message)
    }
  }

  return docData
}

/**
 * Retrieves a previously generated AI explanation for a finding.
 * Validates user ownership and optional context fingerprint.
 */
export async function getAIExplanationRecord({ userId, repositoryId, findingId, fingerprint } = {}) {
  if (!userId || !findingId) return null
  const uId = String(userId)
  const fId = String(findingId)
  const rId = repositoryId ? String(repositoryId) : null

  // 1. Try In-Memory first
  for (const r of _IN_MEMORY_AI_HISTORY.values()) {
    if (String(r.userId) === uId && String(r.findingId) === fId && r.type === 'finding_explanation') {
      if (rId && String(r.repositoryId) !== rId) continue
      if (fingerprint && r.fingerprint !== fingerprint) continue
      return r
    }
  }

  // 2. Try Disk Cache
  const diskRecords = readDiskCache()
  for (const r of diskRecords) {
    if (String(r.userId) === uId && String(r.findingId) === fId && r.type === 'finding_explanation') {
      if (rId && String(r.repositoryId) !== rId) continue
      if (fingerprint && r.fingerprint !== fingerprint) continue
      _IN_MEMORY_AI_HISTORY.set(r.id, r)
      return r
    }
  }

  // 3. Try Firestore if connected
  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      const recordId = `aih_${uId}_${fId}`
      const doc = await db.collection(AI_HISTORY_COLLECTION).doc(recordId).get()
      if (doc.exists) {
        const r = doc.data()
        if (String(r.userId) === uId && String(r.findingId) === fId) {
          if ((!rId || String(r.repositoryId) === rId) && (!fingerprint || r.fingerprint === fingerprint)) {
            _IN_MEMORY_AI_HISTORY.set(r.id, r)
            return r
          }
        }
      }
    } catch (err) {
      console.warn('[AIHistory] Firestore read notice:', err.message)
    }
  }

  return null
}

/**
 * Deletes an AI explanation record (used during regeneration or cache invalidation).
 */
export async function deleteAIExplanationRecord({ userId, repositoryId, findingId } = {}) {
  if (!userId || !findingId) return false
  const uId = String(userId)
  const fId = String(findingId)
  const recordId = `aih_${uId}_${fId}`

  // 1. Delete In-Memory
  _IN_MEMORY_AI_HISTORY.delete(recordId)

  // 2. Delete from Disk
  try {
    const diskRecords = readDiskCache()
    const filtered = diskRecords.filter((r) => r.id !== recordId)
    writeDiskCache(filtered)
  } catch (_) {}

  // 3. Delete from Firestore
  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      await db.collection(AI_HISTORY_COLLECTION).doc(recordId).delete()
    } catch (_) {}
  }

  return true
}

/**
 * Retrieves AI explanation history for a user and repository.
 */
export async function listAIHistoryForUser(userId, options = {}) {
  if (!userId) return []
  const uId = String(userId)
  const rId = options.repositoryId ? String(options.repositoryId) : null
  const limit = Math.min(100, Math.max(1, parseInt(options.limit, 10) || 50))

  const records = readDiskCache().filter((r) => {
    if (String(r.userId) !== uId) return false
    if (rId && String(r.repositoryId) !== rId) return false
    return true
  })

  // Merge in-memory
  for (const r of _IN_MEMORY_AI_HISTORY.values()) {
    if (String(r.userId) === uId && (!rId || String(r.repositoryId) === rId)) {
      if (!records.some((x) => x.id === r.id)) {
        records.push(r)
      }
    }
  }

  records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return records.slice(0, limit)
}

/**
 * Test helper to clear AI history cache.
 */
export function _clearAIHistoryForTesting() {
  _IN_MEMORY_AI_HISTORY.clear()
  if (fs.existsSync(DISK_CACHE_FILE)) {
    try { fs.unlinkSync(DISK_CACHE_FILE) } catch (_) {}
  }
}

export default {
  AI_HISTORY_COLLECTION,
  getAIHistoryCollection,
  saveAIExplanationRecord,
  getAIExplanationRecord,
  deleteAIExplanationRecord,
  listAIHistoryForUser,
  _clearAIHistoryForTesting
}
