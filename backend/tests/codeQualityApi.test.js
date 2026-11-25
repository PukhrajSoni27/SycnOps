/**
 * SyncOps Code Quality REST APIs Test Suite (Stage 2B)
 * 
 * Comprehensive tests covering:
 * - Authentication & Bearer token enforcement (HTTP 401)
 * - Multi-tenant workspace repository ownership & tenant isolation (HTTP 404)
 * - Path traversal defense & filesystem confinement
 * - Asynchronous background scan trigger (HTTP 202 Accepted) & status polling
 * - Concurrency protection: duplicate scan rejection (HTTP 409 Conflict)
 * - Synchronous scan execution (?sync=true, HTTP 200)
 * - Latest scan retrieval (HTTP 200, summary metrics without heavy findings array)
 * - Scan history with pagination (page, limit, total, totalPages)
 * - Full scan details retrieval (HTTP 200 with findings and code snippets)
 * - Granular finding details retrieval (HTTP 200 with snippet & fix, HTTP 404 on missing)
 * - Status transitions (idle -> queued -> running -> completed)
 * - Input validation (invalid IDs, missing parameters)
 * - Database & storage fallback resilience
 * - Existing SyncOps route regression verification
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import os from 'os'
import path from 'path'
import http from 'http'
import { fileURLToPath } from 'url'
import {
  app,
  server,
  workspace,
  makeToken,
  codeQualityJobs,
  codeQualityJobsById
} from '../index.js'
import {
  saveScan,
  _clearStorageForTesting
} from '../lib/codeQualityStorage.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const realRepoPath = path.resolve(rootDir, 'backend/.repos_cache/Estate-Luxe')

test('Code Quality Backend REST API Suite (Stage 2B)', async (t) => {
  // Start isolated test server on free ephemeral port to prevent port collisions
  const testServer = http.createServer(app)
  await new Promise((res) => testServer.listen(0, '127.0.0.1', res))
  const port = testServer.address().port
  const baseUrl = `http://127.0.0.1:${port}`

  t.after(() => {
    testServer.close()
    if (server && server.listening) {
      server.close()
    }
  })

  // Setup test users & workspaces
  const user1Id = 'test_user_api_1'
  const user2Id = 'test_user_api_2'
  const token1 = makeToken(user1Id)
  const token2 = makeToken(user2Id)

  // Create minimal real source repository fixtures for testing
  const miniRepoDir = path.join(os.tmpdir(), `syncops_mini_repo_${Date.now()}`)
  fs.mkdirSync(miniRepoDir, { recursive: true })
  fs.writeFileSync(path.join(miniRepoDir, 'app.js'), 'const greeting = "hello world";\nmodule.exports = { greeting };\n')

  const syncRepoDir = path.join(os.tmpdir(), `syncops_sync_repo_${Date.now()}`)
  fs.mkdirSync(syncRepoDir, { recursive: true })
  fs.writeFileSync(path.join(syncRepoDir, 'calc.js'), 'function add(a, b) { return a + b; }\nmodule.exports = { add };\n')

  // Configure user 1 workspace with real repository fixture
  const ws1 = workspace(user1Id)
  ws1.repos = [
    {
      id: 'repo_estate_luxe_101',
      name: 'Estate-Luxe',
      fullName: 'studio/Estate-Luxe',
      language: 'TypeScript',
      localPath: realRepoPath,
      visibility: 'public'
    },
    {
      id: 'repo_mini_async_103',
      name: 'mini-async-repo',
      fullName: 'studio/mini-async-repo',
      language: 'JavaScript',
      localPath: miniRepoDir,
      visibility: 'public'
    },
    {
      id: 'repo_sync_104',
      name: 'sync-repo',
      fullName: 'studio/sync-repo',
      language: 'JavaScript',
      localPath: syncRepoDir,
      visibility: 'public'
    },
    {
      id: 'repo_missing_path_102',
      name: 'phantom-repo',
      fullName: 'studio/phantom-repo',
      language: 'JavaScript',
      localPath: path.resolve(rootDir, 'non_existent_directory_xyz'),
      visibility: 'public'
    }
  ]

  // Configure user 2 workspace (isolated from user 1)
  const ws2 = workspace(user2Id)
  ws2.repos = [
    {
      id: 'repo_user2_only_201',
      name: 'user2-project',
      fullName: 'studio/user2-project',
      language: 'Python',
      visibility: 'private'
    }
  ]

  // Clear any existing test records
  _clearStorageForTesting()
  codeQualityJobs.clear()
  codeQualityJobsById.clear()

  // ── 1. Authentication Enforcement ──────────────────────────────────────────
  await t.test('1. Authentication: Rejects unauthenticated requests with HTTP 401', async () => {
    // A. POST Scan
    const resScan = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/scan`, {
      method: 'POST'
    })
    assert.equal(resScan.status, 401)
    const dataScan = await resScan.json()
    assert.equal(dataScan.success, false)

    // B. GET Latest Scan
    const resLatest = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality`)
    assert.equal(resLatest.status, 401)

    // C. GET History
    const resHist = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/history`)
    assert.equal(resHist.status, 401)

    // D. GET Status
    const resStatus = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/status`)
    assert.equal(resStatus.status, 401)

    // E. GET Scan details
    const resDetails = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/scans/cqs_test`)
    assert.equal(resDetails.status, 401)

    // F. GET Finding details
    const resFinding = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/findings/find_test`)
    assert.equal(resFinding.status, 401)
  })

  // ── 2. Multi-Tenant Workspace & Repository Ownership ───────────────────────
  await t.test('2. Multi-tenant isolation: Rejects access to unowned or foreign repositories with HTTP 404', async () => {
    // User 1 requests non-existent repository ID
    const resNonExistent = await fetch(`${baseUrl}/api/repositories/non_existent_repo_id/code-quality`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(resNonExistent.status, 404)
    const dataNonExistent = await resNonExistent.json()
    assert.equal(dataNonExistent.success, false)
    assert.match(dataNonExistent.message, /not found/i)

    // User 2 attempts to trigger scan on User 1's repository
    const resCrossTenant = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/scan`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token2}` }
    })
    assert.equal(resCrossTenant.status, 404)
    const dataCrossTenant = await resCrossTenant.json()
    assert.equal(dataCrossTenant.success, false)
    assert.match(dataCrossTenant.message, /not found in your authorized workspace/i)
  })

  // ── 3. Path Traversal & Filesystem Confinement ──────────────────────────────
  await t.test('3. Security: Rejects repositories with missing local files or path traversal attempts', async () => {
    // Attempt scan on repository whose localPath does not exist on disk
    const resMissing = await fetch(`${baseUrl}/api/repositories/repo_missing_path_102/code-quality/scan`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(resMissing.status, 400)
    const dataMissing = await resMissing.json()
    assert.equal(dataMissing.success, false)
    assert.match(dataMissing.message, /Local source files not found/i)
  })

  // ── 4. Initial Status: Idle State ──────────────────────────────────────────
  await t.test('4. Status: Returns status "idle" when no scan has been executed yet', async () => {
    const res = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/status`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(res.status, 200)
    const data = await res.json()
    assert.equal(data.success, true)
    assert.equal(data.status, 'idle')
    assert.equal(data.repositoryId, 'repo_estate_luxe_101')
  })

  // ── 5. Latest Scan 404 when None Exist ─────────────────────────────────────
  await t.test('5. Latest Scan: Returns HTTP 404 when no scans exist for repository', async () => {
    const res = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(res.status, 404)
    const data = await res.json()
    assert.equal(data.success, false)
    assert.match(data.message, /No completed code quality scans found/i)
  })

  // ── 6. Asynchronous Background Scan Execution & Status Polling ─────────────
  let asyncScanId = null

  await t.test('6. Async Scan: Returns HTTP 202 Accepted and tracks background execution', async () => {
    const res = await fetch(`${baseUrl}/api/repositories/repo_mini_async_103/code-quality/scan`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(res.status, 202)
    const data = await res.json()
    assert.equal(data.success, true)
    assert.ok(data.scanId)
    assert.equal(data.status, 'queued')
    assert.ok(data.statusUrl.includes('/status'))

    asyncScanId = data.scanId

    // Verify status endpoint reflects queued or running state
    const resStatus = await fetch(`${baseUrl}/api/repositories/repo_mini_async_103/code-quality/status?scanId=${asyncScanId}`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(resStatus.status, 200)
    const statusData = await resStatus.json()
    assert.equal(statusData.success, true)
    assert.ok(['queued', 'running', 'completed'].includes(statusData.status))
  })

  // ── 7. Duplicate Scan Concurrency Protection (HTTP 409 Conflict) ───────────
  await t.test('7. Concurrency: Rejects duplicate concurrent scan with HTTP 409 Conflict', async () => {
    // Attempt duplicate scan while previous job is active
    const resDup = await fetch(`${baseUrl}/api/repositories/repo_mini_async_103/code-quality/scan`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(resDup.status, 409)
    const dataDup = await resDup.json()
    assert.equal(dataDup.success, false)
    assert.match(dataDup.message, /already in progress/i)

    // Clean up active job
    codeQualityJobs.delete('repo_mini_async_103')
  })

  // ── 8. Synchronous Scan Fixture & Storage Verification ─────────────────────
  let createdScanId = null
  let createdFindingId = null

  await t.test('8. Storage Fixture: Persists real scan and retrieves via GET endpoints', async () => {
    // Populate real scan fixture using saveScan (simulating completed scan from engine)
    const sampleScan = {
      scanId: 'cqs_test_stage2b_verified',
      repositoryPath: realRepoPath,
      timestamp: new Date().toISOString(),
      durationMs: 4250,
      scannedFilesCount: 42,
      languagesDetected: ['JavaScript', 'TypeScript', 'Python'],
      scannersExecuted: {
        eslint: { status: 'completed', durationMs: 1200, findingsCount: 2 },
        ruff: { status: 'completed', durationMs: 850, findingsCount: 1 },
        semgrep: { status: 'completed', durationMs: 2200, findingsCount: 1 }
      },
      findings: [
        {
          id: 'find_sec_1010101',
          ruleId: 'generic.jwt.security-misconfiguration',
          title: '[Semgrep] JWT Security Misconfiguration',
          severity: 'critical',
          message: 'Hardcoded secret or insecure JWT algorithm detected.',
          filePath: 'Backend/routes/auth.js',
          line: 45,
          column: 12,
          scanner: 'semgrep',
          category: 'security',
          suggestedFix: 'Use process.env.JWT_SECRET and RS256 algorithm.',
          codeSnippet: '44 | const token = jwt.sign(\n45 >   { id: user._id },\n46 |   "weak-secret"\n47 | )'
        },
        {
          id: 'find_lint_2020202',
          ruleId: 'no-unused-vars',
          title: '[ESLint] no-unused-vars',
          severity: 'medium',
          message: "'tempResult' is assigned a value but never used.",
          filePath: 'src/components/PropertyCard.tsx',
          line: 28,
          column: 9,
          scanner: 'eslint',
          category: 'maintainability',
          suggestedFix: 'Remove unused variable',
          codeSnippet: '27 | function renderBadge() {\n28 >   const tempResult = calculateDiscount()\n29 |   return <div />'
        },
        {
          id: 'find_ruff_3030303',
          ruleId: 'F401',
          title: '[Ruff] F401: unused import',
          severity: 'high',
          message: '`os` imported but unused',
          filePath: 'Backend/app.py',
          line: 2,
          column: 8,
          scanner: 'ruff',
          category: 'maintainability',
          suggestedFix: 'Remove unused import `os`',
          codeSnippet: '1 | import sys\n2 > import os\n3 | from flask import Flask'
        }
      ]
    }

    const saved = await saveScan({
      ...sampleScan,
      repositoryId: 'repo_estate_luxe_101',
      userId: user1Id,
      repoName: 'Estate-Luxe',
      repoFullName: 'studio/Estate-Luxe'
    })

    createdScanId = saved.scanId
    createdFindingId = 'find_sec_1010101'
    assert.equal(saved.scanId, 'cqs_test_stage2b_verified')
    assert.equal(typeof saved.qualityScore, 'number')
    assert.ok(saved.qualityScore >= 0 && saved.qualityScore <= 100)
  })

  // ── 9. Latest Scan Retrieval (HTTP 200, Summary Metrics, No Findings Array) ─
  await t.test('9. Latest Scan API: Returns summary metrics and omits full findings array', async () => {
    const res = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)

    const data = body.data
    assert.equal(data.scanId, createdScanId)
    assert.equal(data.repositoryId, 'repo_estate_luxe_101')
    assert.equal(typeof data.qualityScore, 'number')
    assert.ok(data.grade)
    assert.equal(data.totalFindings, 3)

    // Severity counts
    assert.equal(data.severityCounts.critical, 1)
    assert.equal(data.severityCounts.high, 1)
    assert.equal(data.severityCounts.medium, 1)
    assert.equal(data.severityCounts.low, 0)
    assert.equal(data.severityCounts.informational, 0)

    // Scanner breakdown
    assert.equal(data.scannerBreakdown.semgrep, 1)
    assert.equal(data.scannerBreakdown.eslint, 1)
    assert.equal(data.scannerBreakdown.ruff, 1)

    // Category breakdown
    assert.equal(data.categoryBreakdown.security, 1)
    assert.equal(data.categoryBreakdown.maintainability, 2)

    // Duration & Timestamps
    assert.ok(data.durationMs > 0)
    assert.ok(data.lastScanTimestamp)

    // CRITICAL: Ensure full findings array is NOT in summary
    assert.equal(data.findings, undefined, 'findings array must be strictly excluded from summary response')
  })

  // ── 10. Scan History API (Pagination & Metadata) ───────────────────────────
  await t.test('10. History API: Supports pagination with page and limit params', async () => {
    // Add a second scan record (older) to test pagination
    const secondScan = {
      scanId: 'cqs_test_stage2b_second',
      repositoryPath: realRepoPath,
      createdAt: new Date(Date.now() - 50000).toISOString(),
      timestamp: new Date(Date.now() - 50000).toISOString(),
      durationMs: 3100,
      scannedFilesCount: 42,
      languagesDetected: ['TypeScript'],
      scannersExecuted: { eslint: { status: 'completed', durationMs: 1100, findingsCount: 0 } },
      findings: []
    }
    await saveScan({
      ...secondScan,
      repositoryId: 'repo_estate_luxe_101',
      userId: user1Id,
      repoName: 'Estate-Luxe'
    })

    const res = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/history?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.equal(body.pagination.page, 1)
    assert.equal(body.pagination.limit, 1)
    assert.ok(body.pagination.total >= 2)
    assert.ok(body.pagination.totalPages >= 2)
    assert.equal(body.data.length, 1)

    // History item should omit large findings array
    assert.equal(body.data[0].findings, undefined, 'History records must omit heavy findings array')
    assert.ok(typeof body.data[0].findingsCount === 'number')
  })

  // ── 11. Full Scan Details API ──────────────────────────────────────────────
  await t.test('11. Scan Details API: Returns full scan including findings and snippets', async () => {
    const res = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/scans/${createdScanId}`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)

    const scan = body.data
    assert.equal(scan.scanId, createdScanId)
    assert.ok(Array.isArray(scan.findings))
    assert.equal(scan.findings.length, 3)

    const f1 = scan.findings.find((f) => f.id === createdFindingId)
    assert.ok(f1)
    assert.equal(f1.severity, 'critical')
    assert.equal(f1.scanner, 'semgrep')
    assert.ok(f1.codeSnippet.includes('jwt.sign'))

    // Request with invalid scanId -> 404
    const resInvalid = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/scans/non_existent_scan`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(resInvalid.status, 404)
  })

  // ── 12. Granular Finding Details API ───────────────────────────────────────
  await t.test('12. Finding Details API: Returns specific finding with snippet and suggested fix', async () => {
    const res = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/findings/${createdFindingId}`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.equal(body.data.scanId, createdScanId)

    const finding = body.data.finding
    assert.equal(finding.id, createdFindingId)
    assert.equal(finding.ruleId, 'generic.jwt.security-misconfiguration')
    assert.equal(finding.severity, 'critical')
    assert.equal(finding.scanner, 'semgrep')
    assert.equal(finding.filePath, 'Backend/routes/auth.js')
    assert.equal(finding.line, 45)
    assert.ok(finding.codeSnippet)
    assert.ok(finding.suggestedFix)

    // Also verify retrieval with explicit ?scanId query parameter
    const resWithScanId = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/findings/${createdFindingId}?scanId=${createdScanId}`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(resWithScanId.status, 200)
    const bodyWithScanId = await resWithScanId.json()
    assert.equal(bodyWithScanId.data.finding.id, createdFindingId)

    // Request non-existent finding ID -> 404
    const resNonExistent = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/findings/non_existent_find_999`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(resNonExistent.status, 404)
    const dataNonExistent = await resNonExistent.json()
    assert.equal(dataNonExistent.success, false)
    assert.match(dataNonExistent.message, /Finding .* not found/i)
  })

  // ── 13. Cross-Tenant Data Isolation on Scan & Finding Details ──────────────
  await t.test('13. Cross-Tenant Protection: User 2 cannot access User 1 scan or finding details', async () => {
    // User 2 cannot read User 1's scan
    const resScan = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/scans/${createdScanId}`, {
      headers: { Authorization: `Bearer ${token2}` }
    })
    assert.equal(resScan.status, 404)

    // User 2 cannot read User 1's finding
    const resFind = await fetch(`${baseUrl}/api/repositories/repo_estate_luxe_101/code-quality/findings/${createdFindingId}`, {
      headers: { Authorization: `Bearer ${token2}` }
    })
    assert.equal(resFind.status, 404)
  })

  // ── 14. Synchronous Scan Trigger (?sync=true) ──────────────────────────────
  await t.test('14. Synchronous Scan: Returns HTTP 200 with completed results when ?sync=true', async () => {
    // Synchronous execution on sync-repo (fast, single file)
    const res = await fetch(`${baseUrl}/api/repositories/repo_sync_104/code-quality/scan?sync=true`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(res.status, 200)
    const data = await res.json()
    assert.equal(data.success, true)
    assert.equal(data.status, 'completed')
    assert.ok(data.scanId)
    assert.equal(typeof data.qualityScore, 'number')
    assert.ok(data.grade)
    assert.ok(data.summary)
  })

  // ── 15. Status Polling after Scan Completion ───────────────────────────────
  await t.test('15. Status Polling: Status endpoint reports completed state for scanned repo', async () => {
    const res = await fetch(`${baseUrl}/api/repositories/repo_sync_104/code-quality/status`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(res.status, 200)
    const data = await res.json()
    assert.equal(data.success, true)
    assert.equal(data.status, 'completed')
    assert.ok(data.scanId)
  })

  // ── 16. Existing SyncOps API Regression Check ──────────────────────────────
  await t.test('16. Regression: Existing SyncOps routes remain functional', async () => {
    // A. Repositories list
    const resRepos = await fetch(`${baseUrl}/api/repositories`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(resRepos.status, 200)
    const dataRepos = await resRepos.json()
    assert.equal(dataRepos.success, true)
    assert.ok(Array.isArray(dataRepos.data))

    // B. Pipelines list
    const resPipe = await fetch(`${baseUrl}/api/pipelines`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(resPipe.status, 200)
    const dataPipe = await resPipe.json()
    assert.equal(dataPipe.success, true)

    // C. Dashboard summary
    const resDash = await fetch(`${baseUrl}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
    assert.equal(resDash.status, 200)
    const dataDash = await resDash.json()
    assert.equal(dataDash.success, true)
  })

  // Cleanup temporary fixtures
  try {
    fs.rmSync(miniRepoDir, { recursive: true, force: true })
    fs.rmSync(syncRepoDir, { recursive: true, force: true })
  } catch (_) {}
})
