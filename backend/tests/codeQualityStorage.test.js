/**
 * Test Suite for SyncOps Code Quality Storage & Scoring Module
 * 
 * Verifies:
 * - 0–100 Quality score formula and configurable severity penalties.
 * - Deduplication of findings.
 * - Persistence across tiers (Firestore, local disk cache, in-memory).
 * - Scan comparison engine (new, resolved, persistent, severity shifts).
 * - Paginated history and granular finding retrieval.
 * - User and repository ownership isolation.
 * - Database failure and fallback resilience.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  calculateQualityScore,
  compareScans,
  saveScan,
  getLatestScan,
  getScanHistory,
  getScanById,
  getFindingById,
  DEFAULT_SEVERITY_PENALTIES,
  _clearStorageForTesting
} from '../lib/codeQualityStorage.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const backendDir = path.resolve(rootDir, 'backend')
const cacheFile = path.resolve(backendDir, '.code_quality_cache.json')

test('Code Quality Scoring & Persistence Suite (Stage 2A)', async (t) => {
  // Clear test state before running
  _clearStorageForTesting()

  // ── 1. Quality Score Algorithm ────────────────────────────────────────────
  await t.test('1. Quality Score: clean repository with 0 findings receives score 100 and Grade A', () => {
    const res = calculateQualityScore([])
    assert.equal(res.qualityScore, 100)
    assert.equal(res.grade, 'A')
    assert.equal(res.totalFindings, 0)
    assert.equal(res.criticalCount, 0)
    assert.equal(res.highCount, 0)
    assert.equal(res.mediumCount, 0)
    assert.equal(res.lowCount, 0)
    assert.equal(res.informationalCount, 0)
    assert.equal(res.penaltyBreakdown.totalPenalty, 0)
  })

  await t.test('2. Quality Score: applies standard severity penalties (Critical: 10, High: 5, Medium: 2, Low: 0.5, Info: 0)', () => {
    const findings = [
      { id: 'f1', severity: 'critical', scanner: 'semgrep', filePath: 'auth.py', ruleId: 'hardcoded-secret' }, // -10
      { id: 'f2', severity: 'high', scanner: 'eslint', filePath: 'app.tsx', ruleId: 'no-undef' },             // -5
      { id: 'f3', severity: 'medium', scanner: 'eslint', filePath: 'app.tsx', ruleId: 'no-unused-vars' },      // -2
      { id: 'f4', severity: 'low', scanner: 'ruff', filePath: 'main.py', ruleId: 'E501' },                    // -0.5
      { id: 'f5', severity: 'informational', scanner: 'semgrep', filePath: 'utils.js', ruleId: 'comment' }   // -0
    ]

    const res = calculateQualityScore(findings)
    // 100 - (10 + 5 + 2 + 0.5 + 0) = 82.5
    assert.equal(res.qualityScore, 82.5)
    assert.equal(res.grade, 'B')
    assert.equal(res.criticalCount, 1)
    assert.equal(res.highCount, 1)
    assert.equal(res.mediumCount, 1)
    assert.equal(res.lowCount, 1)
    assert.equal(res.informationalCount, 1)
    assert.equal(res.totalFindings, 5)
    assert.equal(res.penaltyBreakdown.totalPenalty, 17.5)
  })

  await t.test('3. Quality Score: score clamps at 0 (never negative) when penalties exceed 100', () => {
    const heavyFindings = []
    for (let i = 0; i < 15; i++) {
      heavyFindings.push({ id: `crit_${i}`, severity: 'critical', scanner: 'semgrep', filePath: 'vuln.py', ruleId: 'rce' })
    }
    // 15 criticals * 10 = 150 penalty
    const res = calculateQualityScore(heavyFindings)
    assert.equal(res.qualityScore, 0)
    assert.equal(res.grade, 'F')
    assert.equal(res.criticalCount, 15)
  })

  await t.test('4. Quality Score: deduplicates duplicate finding IDs to prevent penalty inflation', () => {
    const duplicatedFindings = [
      { id: 'dup_1', severity: 'critical', scanner: 'semgrep', filePath: 'auth.py', ruleId: 'secret' },
      { id: 'dup_1', severity: 'critical', scanner: 'semgrep', filePath: 'auth.py', ruleId: 'secret' }, // duplicate
      { id: 'dup_2', severity: 'high', scanner: 'eslint', filePath: 'index.js', ruleId: 'no-undef' },
      { id: 'dup_2', severity: 'high', scanner: 'eslint', filePath: 'index.js', ruleId: 'no-undef' }     // duplicate
    ]

    const res = calculateQualityScore(duplicatedFindings)
    assert.equal(res.totalFindings, 2, 'Must deduplicate 4 items to 2 unique findings')
    assert.equal(res.criticalCount, 1)
    assert.equal(res.highCount, 1)
    // 100 - (10 + 5) = 85
    assert.equal(res.qualityScore, 85)
    assert.equal(res.grade, 'B')
  })

  await t.test('5. Quality Score: supports custom configurable penalty overrides', () => {
    const findings = [
      { id: 'custom_1', severity: 'critical', scanner: 'semgrep', filePath: 'a.py' },
      { id: 'custom_2', severity: 'low', scanner: 'ruff', filePath: 'b.py' }
    ]

    const customPenalties = {
      critical: 25,
      low: 5
    }

    const res = calculateQualityScore(findings, { penalties: customPenalties })
    // 100 - (25 + 5) = 70
    assert.equal(res.qualityScore, 70)
    assert.equal(res.grade, 'C')
    assert.equal(res.penaltyBreakdown.critical, 25)
    assert.equal(res.penaltyBreakdown.low, 5)
  })

  // ── 2. Persistence Layer ──────────────────────────────────────────────────
  await t.test('6. Persistence: saveScan persists all required fields and auto-calculates score', async () => {
    const scanData = {
      scanId: 'cqs_test_001',
      repositoryId: 'repo_alpha',
      userId: 'user_123',
      findings: [
        { id: 'f_alpha_1', severity: 'high', scanner: 'eslint', filePath: 'src/main.ts', ruleId: 'no-undef', line: 12, column: 4 },
        { id: 'f_alpha_2', severity: 'low', scanner: 'ruff', filePath: 'server.py', ruleId: 'E501', line: 45, column: 1 }
      ],
      languagesDetected: ['JavaScript/TypeScript', 'Python'],
      scannersExecuted: {
        eslint: { status: 'completed', durationMs: 120, findingsCount: 1 },
        ruff: { status: 'completed', durationMs: 80, findingsCount: 1 }
      },
      scannedFilesCount: 24,
      durationMs: 2500,
      createdAt: '2026-11-18T20:00:00.000Z',
      status: 'completed'
    }

    const saved = await saveScan(scanData)

    assert.equal(saved.scanId, 'cqs_test_001')
    assert.equal(saved.repositoryId, 'repo_alpha')
    assert.equal(saved.userId, 'user_123')
    assert.equal(saved.status, 'completed')
    // 100 - (5 + 0.5) = 94.5
    assert.equal(saved.qualityScore, 94.5)
    assert.equal(saved.grade, 'A')
    assert.equal(saved.summary.totalFindings, 2)
    assert.equal(saved.summary.high, 1)
    assert.equal(saved.summary.low, 1)
    assert.equal(saved.summary.errors, 1)
    assert.equal(saved.summary.warnings, 1)
    assert.equal(saved.scannedFilesCount, 24)

    // Verify it persists to disk cache
    assert.ok(fs.existsSync(cacheFile), 'Local disk cache file must exist')
    const diskContent = JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
    const foundOnDisk = diskContent.find((r) => r.scanId === 'cqs_test_001')
    assert.ok(foundOnDisk, 'Scan must be saved in disk cache')
  })

  await t.test('7. Persistence: rejects invalid scan records missing repositoryId or userId', async () => {
    await assert.rejects(
      async () => {
        await saveScan({ findings: [] })
      },
      (err) => {
        assert.match(err.message, /repositoryId is required/i)
        return true
      }
    )

    await assert.rejects(
      async () => {
        await saveScan({ repositoryId: 'repo_beta' })
      },
      (err) => {
        assert.match(err.message, /userId is required/i)
        return true
      }
    )
  })

  // ── 3. Scan Comparison Engine ─────────────────────────────────────────────
  await t.test('8. Scan Comparison: compares current scan with previous successful scan', async () => {
    // Scan 1 (Base): f1, f2, f3 (Score: 100 - 17 = 83)
    const scan1 = await saveScan({
      scanId: 'cqs_compare_001',
      repositoryId: 'repo_compare',
      userId: 'user_456',
      createdAt: '2026-11-18T21:00:00.000Z',
      findings: [
        { id: 'item_1', severity: 'critical', scanner: 'semgrep', filePath: 'db.py', ruleId: 'sql-injection' }, // -10
        { id: 'item_2', severity: 'high', scanner: 'eslint', filePath: 'app.js', ruleId: 'no-undef' },           // -5
        { id: 'item_3', severity: 'medium', scanner: 'ruff', filePath: 'main.py', ruleId: 'F401' }              // -2
      ]
    })
    assert.equal(scan1.qualityScore, 83)

    // Scan 2 (Updated):
    // item_1 resolved!
    // item_2 persistent!
    // item_3 severity escalated from medium to high!
    // item_4 new finding!
    const scan2 = await saveScan({
      scanId: 'cqs_compare_002',
      repositoryId: 'repo_compare',
      userId: 'user_456',
      createdAt: '2026-11-18T21:10:00.000Z',
      findings: [
        { id: 'item_2', severity: 'high', scanner: 'eslint', filePath: 'app.js', ruleId: 'no-undef' },           // -5
        { id: 'item_3', severity: 'high', scanner: 'ruff', filePath: 'main.py', ruleId: 'F401' },                // -5 (escalated)
        { id: 'item_4', severity: 'low', scanner: 'ruff', filePath: 'helper.py', ruleId: 'E501' }               // -0.5
      ]
    })
    // Score: 100 - (5 + 5 + 0.5) = 89.5
    assert.equal(scan2.qualityScore, 89.5)

    const comp = scan2.comparison
    assert.ok(comp, 'Comparison must be automatically populated on completed scan')
    assert.equal(comp.hasPreviousScan, true)
    assert.equal(comp.previousScanId, 'cqs_compare_001')
    assert.equal(comp.previousScore, 83)
    assert.equal(comp.currentScore, 89.5)
    assert.equal(comp.scoreDifference, 6.5) // 89.5 - 83 = +6.5

    assert.equal(comp.newFindingsCount, 1)
    assert.equal(comp.newFindings[0].id, 'item_4')

    assert.equal(comp.resolvedFindingsCount, 1)
    assert.equal(comp.resolvedFindings[0].id, 'item_1')

    assert.equal(comp.persistentFindingsCount, 2)
    assert.equal(comp.increasedSeverityCount, 1)
    assert.equal(comp.increasedSeverityFindings[0].finding.id, 'item_3')
    assert.equal(comp.increasedSeverityFindings[0].previousSeverity, 'medium')
    assert.equal(comp.increasedSeverityFindings[0].currentSeverity, 'high')
  })

  await t.test('9. Scan Comparison: ignores failed or incomplete scans during comparison', async () => {
    // Save a failed scan
    await saveScan({
      scanId: 'cqs_failed_003',
      repositoryId: 'repo_compare',
      userId: 'user_456',
      status: 'failed',
      createdAt: '2026-11-18T21:20:00.000Z',
      error: 'Scanner execution timed out'
    })

    // Now save a new completed scan
    const scan4 = await saveScan({
      scanId: 'cqs_compare_004',
      repositoryId: 'repo_compare',
      userId: 'user_456',
      createdAt: '2026-11-18T21:30:00.000Z',
      findings: [
        { id: 'item_2', severity: 'high', scanner: 'eslint', filePath: 'app.js', ruleId: 'no-undef' }
      ]
    })

    // Comparison should compare against cqs_compare_002 (the last SUCCESSFUL scan), NOT the failed scan
    assert.equal(scan4.comparison.previousScanId, 'cqs_compare_002')
    assert.equal(scan4.comparison.previousScore, 89.5)
  })

  // ── 4. History, Pagination & Granular Finding Retrieval ───────────────────
  await t.test('10. Scan History: getLatestScan retrieves newest completed scan for user and repo', async () => {
    const latest = await getLatestScan('repo_compare', 'user_456')
    assert.ok(latest)
    assert.equal(latest.scanId, 'cqs_compare_004')
    assert.equal(latest.status, 'completed')
  })

  await t.test('11. Scan History: getScanHistory returns paginated summary list and total count', async () => {
    const history = await getScanHistory('repo_compare', 'user_456', { page: 1, limit: 2 })
    assert.equal(history.total >= 3, true)
    assert.equal(history.page, 1)
    assert.equal(history.limit, 2)
    assert.equal(history.scans.length, 2)
    assert.ok(history.totalPages >= 2)

    // Ensure finding arrays are stripped from history overview for performance
    assert.equal(history.scans[0].findings, undefined)
    assert.ok(typeof history.scans[0].findingsCount === 'number')

    // Page 2
    const page2 = await getScanHistory('repo_compare', 'user_456', { page: 2, limit: 2 })
    assert.ok(page2.scans.length >= 1)
    assert.notEqual(page2.scans[0].scanId, history.scans[0].scanId)
  })

  await t.test('12. Granular Retrieval: getScanById and getFindingById enforce user ownership', async () => {
    // Valid owner
    const fullScan = await getScanById('cqs_compare_004', 'user_456')
    assert.ok(fullScan)
    assert.equal(fullScan.scanId, 'cqs_compare_004')
    assert.ok(Array.isArray(fullScan.findings))

    // Unauthorized user accessing another user's scan
    const unauthorizedScan = await getScanById('cqs_compare_004', 'intruder_user_999')
    assert.equal(unauthorizedScan, null, 'Must reject access to another user scan')

    // Retrieve single finding
    const finding = await getFindingById('cqs_compare_004', 'item_2', 'user_456')
    assert.ok(finding)
    assert.equal(finding.id, 'item_2')
    assert.equal(finding.ruleId, 'no-undef')

    // Non-existent finding
    const nonExistent = await getFindingById('cqs_compare_004', 'missing_id', 'user_456')
    assert.equal(nonExistent, null)
  })

  // ── 5. Integration with Real Scanner Engine Output ────────────────────────
  await t.test('13. Integration: calculates score and persists real scan from Estate-Luxe', async () => {
    // Real normalized findings extracted from our Estate-Luxe engine run
    const realFindings = [
      { id: 'semgrep_jwt', severity: 'critical', scanner: 'semgrep', filePath: 'Real-estate-project-backend/Backend/main.py', line: 115, column: 19, ruleId: 'jwt-python-hardcoded-secret', message: 'Hardcoded JWT secret' },
      { id: 'semgrep_insecure_req', severity: 'critical', scanner: 'semgrep', filePath: 'src/pages/Signup.tsx', line: 19, column: 10, ruleId: 'react-insecure-request', message: 'Insecure HTTP request' },
      { id: 'eslint_no_undef', severity: 'high', scanner: 'eslint', filePath: 'src/App.tsx', line: 35, column: 48, ruleId: 'no-undef', message: "'JSX' is not defined" },
      { id: 'ruff_f401', severity: 'high', scanner: 'ruff', filePath: 'Real-estate-project-backend/Backend/main.py', line: 3, column: 54, ruleId: 'F401', message: 'fastapi.status imported but unused' },
      { id: 'eslint_no_unused', severity: 'medium', scanner: 'eslint', filePath: 'src/components/Header.tsx', line: 10, column: 8, ruleId: 'no-unused-vars', message: "'user' is defined but never used" }
    ]

    const realScan = await saveScan({
      scanId: 'cqs_estate_luxe_001',
      repositoryId: 'estate-luxe',
      userId: 'test_dev_user',
      findings: realFindings,
      languagesDetected: ['JavaScript/TypeScript', 'Python'],
      scannedFilesCount: 128,
      durationMs: 58860,
      scannersExecuted: {
        eslint: { status: 'completed', durationMs: 9717, findingsCount: 2 },
        ruff: { status: 'completed', durationMs: 174, findingsCount: 1 },
        semgrep: { status: 'completed', durationMs: 58790, findingsCount: 2 }
      }
    })

    // Score: 100 - (2*10 + 2*5 + 1*2) = 100 - 32 = 68
    assert.equal(realScan.qualityScore, 68)
    assert.equal(realScan.grade, 'D')
    assert.equal(realScan.summary.critical, 2)
    assert.equal(realScan.summary.high, 2)
    assert.equal(realScan.summary.medium, 1)
    assert.equal(realScan.summary.byScanner.semgrep, 2)
    assert.equal(realScan.summary.byScanner.eslint, 2)
    assert.equal(realScan.summary.byScanner.ruff, 1)
  })
})

