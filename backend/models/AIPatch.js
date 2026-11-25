/**
 * AIPatch model and persistence module for SyncOps.
 * 
 * Supports multi-tier persistence:
 * 1. Tier 1: Firebase Firestore (`ai_patches` collection)
 * 2. Tier 2: Local disk cache (`.ai_patches_cache.json`)
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
const DISK_CACHE_FILE = path.resolve(backendDir, '.ai_patches_cache.json')

export const AI_PATCH_COLLECTION = 'ai_patches'

// ── In-Memory Patch Store ───────────────────────────────────────────────────
// Key: patchId -> PatchRecord
const _IN_MEMORY_AI_PATCHES = new Map()

// ── Disk Cache Helpers ──────────────────────────────────────────────────────
function readDiskCache() {
  try {
    if (fs.existsSync(DISK_CACHE_FILE)) {
      const raw = fs.readFileSync(DISK_CACHE_FILE, 'utf8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.warn('[AIPatch] Disk cache read notice:', err.message)
  }
  return []
}

function writeDiskCache(records) {
  try {
    fs.writeFileSync(DISK_CACHE_FILE, JSON.stringify(records, null, 2), 'utf8')
  } catch (err) {
    console.warn('[AIPatch] Disk cache write notice:', err.message)
  }
}

export function getAIPatchCollection() {
  const db = getDB()
  return db ? db.collection(AI_PATCH_COLLECTION) : null
}

/**
 * Saves a new AI patch record to storage.
 */
export async function savePatchRecord(record = {}) {
  const now = new Date().toISOString()
  const userId = String(record.userId || '')
  const findingId = String(record.findingId || '')
  const repoId = String(record.repositoryId || '')
  const patchId = record.patchId || `patch_${userId}_${findingId}_${Date.now()}`

  const docData = {
    patchId,
    userId,
    repositoryId: repoId,
    scanId: record.scanId ? String(record.scanId) : null,
    findingId,
    filePath: record.filePath || '',
    language: record.language || 'Unknown',
    scanner: record.scanner || '',
    ruleId: record.ruleId || '',
    originalContentHash: record.originalContentHash || '',
    snapshotContent: record.snapshotContent !== undefined ? record.snapshotContent : null,
    backupFilePath: record.backupFilePath || null,
    explanation: record.explanation || '',
    originalSnippet: record.originalSnippet || '',
    proposedSnippet: record.proposedSnippet || '',
    unifiedDiff: record.unifiedDiff || '',
    startLine: Number(record.startLine) || 1,
    endLine: Number(record.endLine) || 1,
    addedLinesCount: Number(record.addedLinesCount) || 0,
    removedLinesCount: Number(record.removedLinesCount) || 0,
    status: record.status || 'proposed', // 'proposed' | 'applied' | 'rejected' | 'rolled_back'
    validationResult: record.validationResult || null, // 'resolved' | 'changed' | 'still_present' | null
    validationMessage: record.validationMessage || null,
    scannerExecuted: record.scannerExecuted || null,
    createdAt: record.createdAt || now,
    updatedAt: now,
    appliedAt: record.appliedAt || null,
    rolledBackAt: record.rolledBackAt || null
  }

  // 1. In-Memory
  _IN_MEMORY_AI_PATCHES.set(patchId, docData)

  // 2. Disk Cache
  try {
    const diskRecords = readDiskCache()
    const idx = diskRecords.findIndex((r) => r.patchId === patchId)
    if (idx >= 0) {
      diskRecords[idx] = docData
    } else {
      diskRecords.unshift(docData)
    }
    writeDiskCache(diskRecords)
  } catch (e) {
    console.warn('[AIPatch] Failed to write disk cache:', e.message)
  }

  // 3. Firestore if connected
  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      const col = db.collection(AI_PATCH_COLLECTION)
      await col.doc(patchId).set(docData, { merge: true })
    } catch (e) {
      console.warn('[AIPatch] Firestore save notice:', e.message)
    }
  }

  return docData
}

/**
 * Retrieves a patch by its patchId, enforcing user authorization.
 */
export async function getPatchById(patchId, userId) {
  if (!patchId) return null
  const uId = String(userId || '')

  // 1. Check in-memory
  const mem = _IN_MEMORY_AI_PATCHES.get(patchId)
  if (mem) {
    if (mem.userId !== uId) return null // Multi-tenant isolation
    return mem
  }

  // 2. Check disk cache
  const diskRecords = readDiskCache()
  const foundDisk = diskRecords.find((r) => r.patchId === patchId)
  if (foundDisk) {
    if (foundDisk.userId !== uId) return null
    _IN_MEMORY_AI_PATCHES.set(patchId, foundDisk)
    return foundDisk
  }

  // 3. Check Firestore
  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      const col = db.collection(AI_PATCH_COLLECTION)
      const snap = await col.doc(patchId).get()
      if (snap.exists) {
        const data = snap.data()
        if (data.userId !== uId) return null
        _IN_MEMORY_AI_PATCHES.set(patchId, data)
        return data
      }
    } catch (e) {
      console.warn('[AIPatch] Firestore read notice:', e.message)
    }
  }

  return null
}

/**
 * Retrieves the latest patch for a specific finding in a repository.
 */
export async function getLatestPatchForFinding(repositoryId, findingId, userId) {
  const repoId = String(repositoryId || '')
  const fId = String(findingId || '')
  const uId = String(userId || '')

  // 1. Search in-memory
  for (const patch of _IN_MEMORY_AI_PATCHES.values()) {
    if (patch.repositoryId === repoId && patch.findingId === fId && patch.userId === uId) {
      return patch
    }
  }

  // 2. Search disk cache
  const diskRecords = readDiskCache()
  const diskMatches = diskRecords.filter(
    (r) => r.repositoryId === repoId && r.findingId === fId && r.userId === uId
  )
  if (diskMatches.length > 0) {
    diskMatches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const latest = diskMatches[0]
    _IN_MEMORY_AI_PATCHES.set(latest.patchId, latest)
    return latest
  }

  // 3. Search Firestore
  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      const col = db.collection(AI_PATCH_COLLECTION)
      const snap = await col
        .where('repositoryId', '==', repoId)
        .where('findingId', '==', fId)
        .where('userId', '==', uId)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get()

      if (!snap.empty) {
        const doc = snap.docs[0].data()
        _IN_MEMORY_AI_PATCHES.set(doc.patchId, doc)
        return doc
      }
    } catch (e) {
      console.warn('[AIPatch] Firestore query notice:', e.message)
    }
  }

  return null
}

/**
 * Updates patch fields (e.g. status, validationResult, appliedAt, rolledBackAt).
 */
export async function updatePatchRecord(patchId, userId, updateFields = {}) {
  const existing = await getPatchById(patchId, userId)
  if (!existing) {
    throw new Error(`Patch "${patchId}" not found or unauthorized`)
  }

  const updated = {
    ...existing,
    ...updateFields,
    updatedAt: new Date().toISOString()
  }

  _IN_MEMORY_AI_PATCHES.set(patchId, updated)

  try {
    const diskRecords = readDiskCache()
    const idx = diskRecords.findIndex((r) => r.patchId === patchId)
    if (idx >= 0) {
      diskRecords[idx] = updated
    } else {
      diskRecords.unshift(updated)
    }
    writeDiskCache(diskRecords)
  } catch (e) {
    console.warn('[AIPatch] Failed to update disk cache:', e.message)
  }

  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      const col = db.collection(AI_PATCH_COLLECTION)
      await col.doc(patchId).set(updated, { merge: true })
    } catch (e) {
      console.warn('[AIPatch] Firestore update notice:', e.message)
    }
  }

  return updated
}

/**
 * Testing helper: clears all in-memory and disk patch records.
 */

/**
 * Retrieves all patches for a specific repository and user.
 */
export async function getPatchesByRepo(repositoryId, userId) {
  const repoId = String(repositoryId || '')
  const uId = String(userId || '')
  const results = new Map()

  for (const [id, patch] of _IN_MEMORY_AI_PATCHES.entries()) {
    if (patch.repositoryId === repoId && patch.userId === uId) {
      results.set(id, patch)
    }
  }

  const diskRecords = readDiskCache()
  for (const patch of diskRecords) {
    if (patch.repositoryId === repoId && patch.userId === uId) {
      if (!results.has(patch.patchId)) {
        results.set(patch.patchId, patch)
        _IN_MEMORY_AI_PATCHES.set(patch.patchId, patch)
      }
    }
  }

  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      const col = db.collection(AI_PATCH_COLLECTION)
      const snap = await col
        .where('repositoryId', '==', repoId)
        .where('userId', '==', uId)
        .get()

      for (const doc of snap.docs) {
        const data = doc.data()
        if (!results.has(data.patchId)) {
          results.set(data.patchId, data)
          _IN_MEMORY_AI_PATCHES.set(data.patchId, data)
        }
      }
    } catch (e) {
      console.warn('[AIPatch] Firestore query notice:', e.message)
    }
  }

  const list = Array.from(results.values())
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return list
}

export function _clearPatchesForTesting() {
  _IN_MEMORY_AI_PATCHES.clear()
  try {
    if (fs.existsSync(DISK_CACHE_FILE)) {
      fs.unlinkSync(DISK_CACHE_FILE)
    }
  } catch (_) {}
}

export default {
  AI_PATCH_COLLECTION,
  savePatchRecord,
  getPatchById,
  getLatestPatchForFinding,
  updatePatchRecord,
  getPatchesByRepo,
  _clearPatchesForTesting
}
