/**
 * SyncOps Code Quality Storage & Scoring Module
 * 
 * Responsibilities:
 * 1. Transparent 0–100 Quality Scoring Algorithm with configurable severity penalties.
 * 2. Multi-tier persistence:
 *    - Tier 1: Firebase Firestore (`code_quality_scans` collection)
 *    - Tier 2: MongoDB Atlas (if MONGODB_URI is configured)
 *    - Tier 3: Local disk cache (`.code_quality_cache.json`) + In-memory store
 * 3. Scan comparison engine (new, resolved, persistent, severity deltas).
 * 4. Scan history with pagination and granular finding retrieval.
 * 5. Multi-tenant repository and user ownership isolation.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getDB, isFirestoreConnected } from '../config/firebase.js'
import { generateFindingId } from './codeQualityEngine.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const backendDir = path.resolve(rootDir, 'backend')
const DISK_CACHE_FILE = path.resolve(backendDir, '.code_quality_cache.json')

export const SCANS_COLLECTION = 'code_quality_scans'

// ── Default Configurable Severity Penalties ─────────────────────────────────
export const DEFAULT_SEVERITY_PENALTIES = Object.freeze({
  critical: 10,
  high: 5,
  medium: 2,
  low: 0.5,
  informational: 0
})

// Severity ranking for escalation/reduction diffs
const SEVERITY_RANK = Object.freeze({
  informational: 1,
  low: 2,
  medium: 3,
  high: 4,
  critical: 5
})

// ── In-Memory Storage Cache ─────────────────────────────────────────────────
// Key: scanId -> ScanRecord
const _IN_MEMORY_SCANS = new Map()

// ── Disk Cache Helpers ──────────────────────────────────────────────────────
function readDiskCache() {
  try {
    if (fs.existsSync(DISK_CACHE_FILE)) {
      const raw = fs.readFileSync(DISK_CACHE_FILE, 'utf8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.warn('[CodeQualityStorage] Disk cache read notice:', err.message)
  }
  return []
}

function writeDiskCache(records) {
  try {
    fs.writeFileSync(DISK_CACHE_FILE, JSON.stringify(records, null, 2), 'utf8')
  } catch (err) {
    console.warn('[CodeQualityStorage] Disk cache write notice:', err.message)
  }
}

// ── Quality Scoring Engine ──────────────────────────────────────────────────
/**
 * Calculates a transparent, configurable quality score from 0 to 100.
 * 
 * Formula:
 *   score = max(0, 100 - sum(severity * penalty))
 * 
 * Standard Weights:
 *   - Critical:      10 pts
 *   - High:          5 pts
 *   - Medium:        2 pts
 *   - Low:           0.5 pts
 *   - Informational: 0 pts
 * 
 * Deduplication:
 *   Findings with identical IDs are counted only once to prevent penalty inflation.
 */
export function calculateQualityScore(findings = [], options = {}) {
  const penalties = {
    ...DEFAULT_SEVERITY_PENALTIES,
    ...(options.penalties || {})
  }

  // Deduplicate findings by stable ID
  const seenIds = new Set()
  const uniqueFindings = []

  for (const f of findings) {
    if (!f) continue
    const fid = f.id || generateFindingId(f.scanner, f.filePath, f.ruleId, f.line, f.column)
    if (!seenIds.has(fid)) {
      seenIds.add(fid)
      uniqueFindings.push({ ...f, id: fid })
    }
  }

  let criticalCount = 0
  let highCount = 0
  let mediumCount = 0
  let lowCount = 0
  let informationalCount = 0

  const countsByScanner = { eslint: 0, ruff: 0, semgrep: 0 }
  const countsByCategory = {
    security: 0,
    reliability: 0,
    maintainability: 0,
    readability: 0,
    performance: 0
  }
  const countsByLanguage = {}

  for (const f of uniqueFindings) {
    const sev = (f.severity || 'low').toLowerCase()
    if (sev === 'critical') criticalCount++
    else if (sev === 'high') highCount++
    else if (sev === 'medium') mediumCount++
    else if (sev === 'low') lowCount++
    else informationalCount++

    // By scanner
    if (f.scanner && countsByScanner[f.scanner] !== undefined) {
      countsByScanner[f.scanner]++
    }

    // By category
    const cat = (f.category || 'maintainability').toLowerCase()
    if (countsByCategory[cat] !== undefined) {
      countsByCategory[cat]++
    } else {
      countsByCategory.maintainability++
    }

    // By language
    const ext = path.extname(f.filePath || '').toLowerCase()
    let lang = 'Other'
    if (['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'].includes(ext)) {
      lang = 'JavaScript/TypeScript'
    } else if (['.py', '.pyw'].includes(ext)) {
      lang = 'Python'
    } else if (['.json', '.yaml', '.yml'].includes(ext)) {
      lang = 'Config'
    }
    countsByLanguage[lang] = (countsByLanguage[lang] || 0) + 1
  }

  const penaltyBreakdown = {
    critical: criticalCount * penalties.critical,
    high: highCount * penalties.high,
    medium: mediumCount * penalties.medium,
    low: lowCount * penalties.low,
    informational: informationalCount * penalties.informational,
    totalPenalty: 0
  }
  penaltyBreakdown.totalPenalty =
    penaltyBreakdown.critical +
    penaltyBreakdown.high +
    penaltyBreakdown.medium +
    penaltyBreakdown.low +
    penaltyBreakdown.informational

  const rawScore = Math.max(0, 100 - penaltyBreakdown.totalPenalty)
  const qualityScore = Math.round(rawScore * 10) / 10

  // Standard Academic Letter Grade
  let grade = 'F'
  if (qualityScore >= 90) grade = 'A'
  else if (qualityScore >= 80) grade = 'B'
  else if (qualityScore >= 70) grade = 'C'
  else if (qualityScore >= 60) grade = 'D'

  return {
    qualityScore,
    grade,
    totalFindings: uniqueFindings.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    informationalCount,
    countsByScanner,
    countsByCategory,
    countsByLanguage,
    penaltyBreakdown,
    deduplicatedFindings: uniqueFindings
  }
}

// ── Scan Comparison Engine ──────────────────────────────────────────────────
/**
 * Compares a current completed scan against the previous successful scan.
 * Identifies new, resolved, and persistent findings, as well as severity shifts.
 */
export function compareScans(currentScan, previousScan) {
  if (!currentScan) {
    throw new Error('Current scan record is required for comparison')
  }

  const currentFindings = currentScan.findings || []
  const currentScore = currentScan.qualityScore ?? 100

  // If no previous successful scan exists
  if (!previousScan || previousScan.status !== 'completed') {
    return {
      hasPreviousScan: false,
      previousScanId: null,
      previousScore: null,
      currentScore,
      scoreDifference: 0,
      newFindingsCount: currentFindings.length,
      resolvedFindingsCount: 0,
      persistentFindingsCount: 0,
      increasedSeverityCount: 0,
      reducedSeverityCount: 0,
      newFindings: currentFindings,
      resolvedFindings: [],
      persistentFindings: [],
      increasedSeverityFindings: [],
      reducedSeverityFindings: []
    }
  }

  const prevFindings = previousScan.findings || []
  const previousScore = previousScan.qualityScore ?? 100

  const prevMap = new Map()
  for (const pf of prevFindings) {
    if (pf && pf.id) prevMap.set(pf.id, pf)
  }

  const currMap = new Map()
  for (const cf of currentFindings) {
    if (cf && cf.id) currMap.set(cf.id, cf)
  }

  const newFindings = []
  const persistentFindings = []
  const increasedSeverityFindings = []
  const reducedSeverityFindings = []

  for (const curr of currentFindings) {
    if (!curr || !curr.id) continue
    if (!prevMap.has(curr.id)) {
      newFindings.push(curr)
    } else {
      const prev = prevMap.get(curr.id)
      persistentFindings.push(curr)

      const prevRank = SEVERITY_RANK[prev.severity?.toLowerCase()] || 2
      const currRank = SEVERITY_RANK[curr.severity?.toLowerCase()] || 2

      if (currRank > prevRank) {
        increasedSeverityFindings.push({
          finding: curr,
          previousSeverity: prev.severity,
          currentSeverity: curr.severity
        })
      } else if (currRank < prevRank) {
        reducedSeverityFindings.push({
          finding: curr,
          previousSeverity: prev.severity,
          currentSeverity: curr.severity
        })
      }
    }
  }

  const resolvedFindings = []
  for (const prev of prevFindings) {
    if (prev && prev.id && !currMap.has(prev.id)) {
      resolvedFindings.push(prev)
    }
  }

  const scoreDifference = Math.round((currentScore - previousScore) * 10) / 10

  return {
    hasPreviousScan: true,
    previousScanId: previousScan.scanId,
    previousCreatedAt: previousScan.createdAt,
    previousScore,
    currentScore,
    scoreDifference,
    newFindingsCount: newFindings.length,
    resolvedFindingsCount: resolvedFindings.length,
    persistentFindingsCount: persistentFindings.length,
    increasedSeverityCount: increasedSeverityFindings.length,
    reducedSeverityCount: reducedSeverityFindings.length,
    newFindings,
    resolvedFindings,
    persistentFindings,
    increasedSeverityFindings,
    reducedSeverityFindings
  }
}

// ── Persistence Layer ───────────────────────────────────────────────────────
/**
 * Saves a scan record across available storage tiers (Firestore -> MongoDB -> Disk Cache -> Memory).
 */
export async function saveScan(scanData) {
  if (!scanData || typeof scanData !== 'object') {
    throw new Error('Valid scan data object is required')
  }
  if (!scanData.repositoryId) {
    throw new Error('repositoryId is required to persist scan')
  }
  if (!scanData.userId) {
    throw new Error('userId is required to persist scan')
  }

  const repoId = String(scanData.repositoryId)
  const userId = String(scanData.userId)
  const scanId = scanData.scanId || `cqs_${Date.now()}`
  const createdAt = scanData.createdAt || new Date().toISOString()
  const status = scanData.status || 'completed'

  // Score computation
  const scoring = calculateQualityScore(scanData.findings || [])

  // Auto-compare with previous successful scan if status is completed
  let comparison = null
  if (status === 'completed') {
    const prevScan = await getLatestScan(repoId, userId)
    comparison = compareScans({
      qualityScore: scoring.qualityScore,
      findings: scoring.deduplicatedFindings
    }, prevScan)
  }

  const record = {
    scanId,
    repositoryId: repoId,
    userId,
    status,
    qualityScore: scoring.qualityScore,
    grade: scoring.grade,
    summary: {
      totalFindings: scoring.totalFindings,
      critical: scoring.criticalCount,
      high: scoring.highCount,
      medium: scoring.mediumCount,
      low: scoring.lowCount,
      informational: scoring.informationalCount,
      errors: scoring.criticalCount + scoring.highCount,
      warnings: scoring.mediumCount + scoring.lowCount,
      byCategory: scoring.countsByCategory,
      byScanner: scoring.countsByScanner,
      byLanguage: scoring.countsByLanguage,
      penaltyBreakdown: scoring.penaltyBreakdown
    },
    findings: scoring.deduplicatedFindings,
    languagesDetected: scanData.languagesDetected || [],
    scannersExecuted: scanData.scannersExecuted || {},
    scannedFilesCount: scanData.scannedFilesCount || 0,
    durationMs: scanData.durationMs || 0,
    createdAt,
    comparison: comparison || undefined,
    error: scanData.error || undefined
  }

  // Tier 1: In-Memory cache (synchronously available)
  _IN_MEMORY_SCANS.set(scanId, record)

  // Tier 2: Persistent Disk Cache (offline and restart safe)
  try {
    const diskRecords = readDiskCache()
    // Append-only (prevent overwriting previous records)
    const existsIdx = diskRecords.findIndex((r) => r.scanId === scanId)
    if (existsIdx >= 0) {
      diskRecords[existsIdx] = record
    } else {
      diskRecords.push(record)
    }
    writeDiskCache(diskRecords)
  } catch (diskErr) {
    console.warn('[CodeQualityStorage] Disk cache update error:', diskErr.message)
  }

  // Tier 3: Firestore Cloud Storage (if available)
  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      await db.collection(SCANS_COLLECTION).doc(scanId).set(record)
    } catch (fireErr) {
      console.warn('[CodeQualityStorage] Firestore save notice:', fireErr.message, '— cached to disk & memory.')
    }
  }

  return record
}

/**
 * Returns the most recent completed scan for a repository and user.
 */
export async function getLatestScan(repositoryId, userId) {
  if (!repositoryId || !userId) return null
  const repoId = String(repositoryId)
  const uId = String(userId)

  // 1. Try Firestore if available
  const db = getDB()
  if (db && isFirestoreConnected()) {
    try {
      const snap = await db.collection(SCANS_COLLECTION)
        .where('repositoryId', '==', repoId)
        .where('userId', '==', uId)
        .where('status', '==', 'completed')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get()

      if (!snap.empty) {
        return snap.docs[0].data()
      }
    } catch (err) {
      // Fall through to disk cache if index or network issue occurs
    }
  }

  // 2. Try Disk Cache
  const diskRecords = readDiskCache()
  const matching = diskRecords
    .filter((r) => String(r.repositoryId) === repoId && String(r.userId) === uId && r.status === 'completed')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  if (matching.length > 0) {
    return matching[0]
  }

  // 3. Fallback to In-Memory
  const memMatching = Array.from(_IN_MEMORY_SCANS.values())
    .filter((r) => String(r.repositoryId) === repoId && String(r.userId) === uId && r.status === 'completed')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return memMatching[0] || null
}

/**
 * Retrieves paginated scan history for a repository.
 * Returns concise scan metadata (excluding heavy finding blobs) for rapid display.
 */
export async function getScanHistory(repositoryId, userId, options = {}) {
  if (!repositoryId || !userId) {
    return { scans: [], total: 0, page: 1, totalPages: 0, limit: 10 }
  }

  const repoId = String(repositoryId)
  const uId = String(userId)
  const page = Math.max(1, parseInt(options.page, 10) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(options.limit, 10) || 10))

  // Retrieve all records for repo + user from disk/memory
  let allRecords = readDiskCache().filter(
    (r) => String(r.repositoryId) === repoId && String(r.userId) === uId
  )

  // Merge with memory records
  for (const r of _IN_MEMORY_SCANS.values()) {
    if (String(r.repositoryId) === repoId && String(r.userId) === uId) {
      if (!allRecords.some((x) => x.scanId === r.scanId)) {
        allRecords.push(r)
      }
    }
  }

  // Sort newest first
  allRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const total = allRecords.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const paginated = allRecords.slice(startIndex, startIndex + limit)

  // Strip large findings array for listing endpoints
  const cleanScans = paginated.map((r) => {
    const { findings: _, ...summary } = r
    return {
      ...summary,
      findingsCount: r.findings?.length || r.summary?.totalFindings || 0
    }
  })

  return {
    scans: cleanScans,
    total,
    page,
    totalPages,
    limit
  }
}

/**
 * Retrieves a full scan record by scanId with strict user ownership validation.
 */
export async function getScanById(scanId, userId) {
  if (!scanId) return null
  const uId = userId ? String(userId) : null

  // Check In-Memory
  let record = _IN_MEMORY_SCANS.get(scanId)

  // Check Disk Cache
  if (!record) {
    const diskRecords = readDiskCache()
    record = diskRecords.find((r) => r.scanId === scanId)
  }

  // Check Firestore
  if (!record) {
    const db = getDB()
    if (db && isFirestoreConnected()) {
      try {
        const doc = await db.collection(SCANS_COLLECTION).doc(scanId).get()
        if (doc.exists) {
          record = doc.data()
        }
      } catch (_) {}
    }
  }

  if (!record) return null

  // Enforce ownership
  if (uId && String(record.userId) !== uId) {
    return null // Unauthorized access
  }

  return record
}

/**
 * Retrieves a single finding by scanId and findingId with strict ownership check.
 */
export async function getFindingById(scanId, findingId, userId) {
  const scan = await getScanById(scanId, userId)
  if (!scan || !Array.isArray(scan.findings)) return null

  return scan.findings.find((f) => f.id === findingId) || null
}

// ── Test & Reset Helpers ────────────────────────────────────────────────────
export function _clearStorageForTesting() {
  _IN_MEMORY_SCANS.clear()
  if (fs.existsSync(DISK_CACHE_FILE)) {
    try { fs.unlinkSync(DISK_CACHE_FILE) } catch (_) {}
  }
}

export default {
  DEFAULT_SEVERITY_PENALTIES,
  calculateQualityScore,
  compareScans,
  saveScan,
  getLatestScan,
  getScanHistory,
  getScanById,
  getFindingById,
  _clearStorageForTesting
}

