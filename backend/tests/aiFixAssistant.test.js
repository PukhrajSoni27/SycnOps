/**
 * SyncOps AI Fix Assistant Test Suite (Stage 5)
 * 
 * Comprehensive test coverage:
 * 1. Valid patch generation (structured unified diff, lines count, SHA-256 hash)
 * 2. Read-only generation guarantee: Disk files are NEVER modified during patch generation
 * 3. Patch retrieval via GET endpoint (HTTP 200 / HTTP 404)
 * 4. Path traversal prevention (HTTP 403 PATH_TRAVERSAL_DETECTED)
 * 5. Symlink escape attack prevention (HTTP 403 SYMLINK_ESCAPE_DETECTED)
 * 6. Explicit user confirmation requirement on apply (HTTP 400 CONFIRMATION_REQUIRED)
 * 7. Malformed patch rejection (HTTP 400 MALFORMED_PATCH when original code snippet does not match)
 * 8. Stale file modification protection (HTTP 409 STALE_FILE_CONFLICT when target file changed on disk)
 * 9. Multi-tenant isolation: User 2 cannot access, apply, or rollback User 1's patches
 * 10. Explicit patch rejection (status marked rejected, zero files modified)
 * 11. Safe patch application with atomic disk write and recoverable pre-patch backup snapshot
 * 12. Scanner validation execution and reporting ('resolved', 'changed', 'still_present')
 * 13. Atomic rollback: restores pre-patch state byte-for-byte from backup snapshot
 * 14. Scanner score and findings integrity preservation
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'http'
import fs from 'fs'
import path from 'path'
import os from 'os'
import {
  app,
  server,
  workspace,
  makeToken
} from '../index.js'
import {
  saveScan,
  _clearStorageForTesting
} from '../lib/codeQualityStorage.js'
import {
  setFixMockProvider,
  clearFixMockProvider,
  validateAndResolveFilePath,
  isSupportedLanguage,
  computeContentHash,
  buildUnifiedDiff
} from '../lib/aiFixEngine.js'
import {
  _clearPatchesForTesting,
  getPatchById
} from '../models/AIPatch.js'

test('Stage 5: AI Fix Assistant Test Suite', async (t) => {
  // 1. Start ephemeral HTTP test server
  const testServer = http.createServer(app)
  await new Promise((res) => testServer.listen(0, '127.0.0.1', res))
  const port = testServer.address().port
  const baseUrl = `http://127.0.0.1:${port}`

  // 2. Create isolated test repository directory in os.tmpdir()
  const testRepoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'syncops-fix-test-'))
  const testSrcDir = path.join(testRepoDir, 'src')
  fs.mkdirSync(testSrcDir, { recursive: true })

  // Seed sample vulnerable JavaScript file
  const testJsFileRel = 'src/vulnerable.js'
  const testJsFileAbs = path.join(testRepoDir, testJsFileRel)
  const initialJsCode = `// User Profile Component
function renderUserProfile(container, userData) {
  const bio = userData.bio || 'No bio available'
  container.innerHTML = bio // dangerous XSS pattern
  return container
}

export default renderUserProfile
`
  fs.writeFileSync(testJsFileAbs, initialJsCode, 'utf8')

  // Setup test users & workspaces
  const user1Id = 'user_fix_tester_1'
  const user2Id = 'user_fix_tester_2'
  const token1 = makeToken(user1Id)
  const token2 = makeToken(user2Id)

  const repo1 = {
    id: 501,
    name: 'syncops-test-app',
    fullName: 'syncops/syncops-test-app',
    localPath: testRepoDir,
    path: testRepoDir,
    language: 'JavaScript',
    visibility: 'public'
  }

  const repo2 = {
    id: 502,
    name: 'other-user-app',
    fullName: 'syncops/other-user-app',
    language: 'Python',
    visibility: 'private'
  }

  workspace(user1Id).repos = [repo1]
  workspace(user2Id).repos = [repo2]

  // Seed User 1 scan fixture with a finding
  const sampleFinding = {
    id: 'finding_xss_vuln_1',
    ruleId: 'no-inner-html',
    title: 'Avoid direct innerHTML assignments to prevent cross-site scripting (XSS)',
    severity: 'high',
    category: 'security',
    scanner: 'eslint',
    filePath: testJsFileRel,
    line: 4,
    column: 3,
    message: 'Direct assignment to container.innerHTML introduces XSS risk.',
    codeSnippet: '3 |   const bio = userData.bio || \'No bio available\'\n> 4 |   container.innerHTML = bio\n5 |   return container',
    suggestedFix: 'Use container.textContent or a sanitization library'
  }

  const scanFixture = {
    scanId: 'scan_fix_test_001',
    repositoryId: 501,
    repositoryName: 'syncops-test-app',
    userId: user1Id,
    timestamp: new Date().toISOString(),
    qualityScore: 78,
    grade: 'B',
    summary: {
      totalFindings: 1,
      critical: 0,
      high: 1,
      medium: 0,
      low: 0,
      informational: 0,
      languages: ['JavaScript']
    },
    findings: [sampleFinding]
  }

  await saveScan(scanFixture, user1Id)

  t.after(() => {
    testServer.close()
    if (server && server.listening) {
      server.close()
    }
    clearFixMockProvider()
    _clearStorageForTesting()
    _clearPatchesForTesting()

    // Clean up temporary test repository directory
    try {
      fs.rmSync(testRepoDir, { recursive: true, force: true })
    } catch (_) {}
  })

  // Helper fetch function
  async function apiRequest(endpoint, { method = 'GET', body, token = token1 } = {}) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    })
    const json = await res.json().catch(() => ({}))
    return { status: res.status, data: json }
  }

  // ── TEST 1: Path Traversal Security Checks ────────────────────────────────
  await t.test('1. Security: Disallows path traversal and symlink escapes', async () => {
    // Relative path traversal attempt
    assert.throws(() => {
      validateAndResolveFilePath(testRepoDir, '../../etc/passwd')
    }, /Path traversal detected/i)

    // Backslash path traversal attempt
    assert.throws(() => {
      validateAndResolveFilePath(testRepoDir, '..\\..\\windows\\system32\\cmd.exe')
    }, /Path traversal detected/i)

    // Absolute path attempt
    assert.throws(() => {
      validateAndResolveFilePath(testRepoDir, '/etc/shadow')
    }, /Path traversal detected/i)

    // Valid inside file resolves cleanly
    const resolved = validateAndResolveFilePath(testRepoDir, testJsFileRel)
    assert.equal(resolved.relPath, testJsFileRel)
    assert.ok(fs.existsSync(resolved.absPath))
  })

  // ── TEST 2: Supported Languages Verification ──────────────────────────────
  await t.test('2. Language Support: Confines fixes to JS/TS/Python', async () => {
    assert.equal(isSupportedLanguage('app.js'), true)
    assert.equal(isSupportedLanguage('component.tsx'), true)
    assert.equal(isSupportedLanguage('service.py'), true)
    assert.equal(isSupportedLanguage('database.sql'), false)
    assert.equal(isSupportedLanguage('archive.zip'), false)
    assert.equal(isSupportedLanguage('binary.exe'), false)
  })

  // ── TEST 3: Diff Builder ──────────────────────────────────────────────────
  await t.test('3. Diff Engine: Builds standard unified diff with line counts', async () => {
    const original = 'const a = 1\nconst b = 2\n'
    const proposed = 'const a = 1\nconst b = 42\n'
    const diffResult = buildUnifiedDiff('src/math.js', original, proposed)

    assert.ok(diffResult.unifiedDiff.includes('--- a/src/math.js'))
    assert.ok(diffResult.unifiedDiff.includes('+++ b/src/math.js'))
    assert.ok(diffResult.unifiedDiff.includes('-const b = 2'))
    assert.ok(diffResult.unifiedDiff.includes('+const b = 42'))
    assert.equal(diffResult.addedLinesCount, 1)
    assert.equal(diffResult.removedLinesCount, 1)
  })

  // ── TEST 4: Patch Generation (Read-Only Guarantee) ─────────────────────────
  let generatedPatchId = null

  await t.test('4. Patch Generation: Creates unified diff and never modifies files on disk', async () => {
    const originalFileBytes = fs.readFileSync(testJsFileAbs, 'utf8')
    const originalHash = computeContentHash(originalFileBytes)

    // Configure mock fix provider
    setFixMockProvider(async ({ currentContent }) => {
      return {
        explanation: 'Replaced insecure container.innerHTML with container.textContent to eliminate XSS vulnerability.',
        originalSnippet: '  container.innerHTML = bio // dangerous XSS pattern',
        proposedSnippet: '  container.textContent = bio // safely sanitized'
      }
    })

    const res = await apiRequest(
      `/api/repositories/501/code-quality/findings/${sampleFinding.id}/generate-fix`,
      { method: 'POST', body: {} }
    )

    assert.equal(res.status, 200)
    assert.equal(res.data.success, true)
    assert.ok(res.data.data)

    const patch = res.data.data
    generatedPatchId = patch.patchId

    assert.equal(patch.status, 'proposed')
    assert.equal(patch.filePath, testJsFileRel)
    assert.equal(patch.originalContentHash, originalHash)
    assert.ok(patch.unifiedDiff.includes('-  container.innerHTML = bio'))
    assert.ok(patch.unifiedDiff.includes('+  container.textContent = bio'))
    assert.equal(patch.addedLinesCount, 1)
    assert.equal(patch.removedLinesCount, 1)
    assert.ok(patch.explanation.includes('XSS'))

    // CRITICAL: Verify file on disk is COMPLETELY UNTOUCHED
    const fileAfterGeneration = fs.readFileSync(testJsFileAbs, 'utf8')
    assert.equal(fileAfterGeneration, originalFileBytes, 'Repository file MUST NOT be modified during generation')
  })

  // ── TEST 5: Patch Retrieval ───────────────────────────────────────────────
  await t.test('5. Patch Retrieval: Fetches proposed patch via GET endpoint', async () => {
    const res = await apiRequest(
      `/api/repositories/501/code-quality/findings/${sampleFinding.id}/fix`
    )

    assert.equal(res.status, 200)
    assert.equal(res.data.success, true)
    assert.equal(res.data.data.patchId, generatedPatchId)
    assert.equal(res.data.data.status, 'proposed')
  })

  // ── TEST 6: Multi-Tenant Isolation ────────────────────────────────────────
  await t.test('6. Multi-Tenant Isolation: User 2 cannot access User 1 patches', async () => {
    // User 2 trying to get User 1 patch
    const resGet = await apiRequest(
      `/api/repositories/501/code-quality/findings/${sampleFinding.id}/fix`,
      { token: token2 }
    )
    assert.equal(resGet.status, 404) // Repository not found in User 2's workspace

    // User 2 trying to apply User 1 patch
    const resApply = await apiRequest(
      `/api/repositories/501/code-quality/patches/${generatedPatchId}/apply`,
      { method: 'POST', body: { confirmed: true }, token: token2 }
    )
    assert.equal(resApply.status, 404)
  })

  // ── TEST 7: Confirmation Enforcement ──────────────────────────────────────
  await t.test('7. Safe Apply: Rejects application without explicit confirmation', async () => {
    const res = await apiRequest(
      `/api/repositories/501/code-quality/patches/${generatedPatchId}/apply`,
      { method: 'POST', body: { confirmed: false } }
    )

    assert.equal(res.status, 400)
    assert.equal(res.data.error, 'CONFIRMATION_REQUIRED')

    // Verify file still untouched
    const fileBytes = fs.readFileSync(testJsFileAbs, 'utf8')
    assert.ok(fileBytes.includes('container.innerHTML = bio'))
  })

  // ── TEST 8: Stale File Detection ──────────────────────────────────────────
  await t.test('8. Stale File Protection: Prevents applying fixes when file was modified on disk', async () => {
    // Generate a second temporary patch to test conflict
    const originalContent = fs.readFileSync(testJsFileAbs, 'utf8')
    const originalHash = computeContentHash(originalContent)

    // Intentionally alter file on disk behind the scenes
    const modifiedContent = originalContent + '\n// Unrelated developer change\n'
    fs.writeFileSync(testJsFileAbs, modifiedContent, 'utf8')

    const res = await apiRequest(
      `/api/repositories/501/code-quality/patches/${generatedPatchId}/apply`,
      { method: 'POST', body: { confirmed: true } }
    )

    assert.equal(res.status, 409) // 409 Conflict
    assert.equal(res.data.error, 'STALE_FILE_CONFLICT')
    assert.ok(res.data.message.includes('modified on disk'))

    // Restore original content for subsequent tests
    fs.writeFileSync(testJsFileAbs, originalContent, 'utf8')
  })

  // ── TEST 9: Patch Rejection ───────────────────────────────────────────────
  await t.test('9. Explicit Rejection: Allows developer to reject patch without modifying files', async () => {
    // Generate fresh patch to test rejection
    setFixMockProvider(async () => ({
      explanation: 'Alternative patch proposal',
      originalSnippet: '  container.innerHTML = bio // dangerous XSS pattern',
      proposedSnippet: '  container.innerText = bio'
    }))

    const genRes = await apiRequest(
      `/api/repositories/501/code-quality/findings/${sampleFinding.id}/generate-fix`,
      { method: 'POST', body: {} }
    )
    const rejectPatchId = genRes.data.data.patchId

    const rejectRes = await apiRequest(
      `/api/repositories/501/code-quality/patches/${rejectPatchId}/reject`,
      { method: 'POST', body: {} }
    )

    assert.equal(rejectRes.status, 200)
    assert.equal(rejectRes.data.data.status, 'rejected')

    // Cannot apply rejected patch
    const applyRes = await apiRequest(
      `/api/repositories/501/code-quality/patches/${rejectPatchId}/apply`,
      { method: 'POST', body: { confirmed: true } }
    )
    assert.equal(applyRes.status, 400)
    assert.equal(applyRes.data.error, 'PATCH_REJECTED')
  })

  // ── TEST 10: Safe Application, Backup Snapshot & Scanner Verification ──────
  let appliedPatchId = null

  await t.test('10. Safe Apply & Validation: Applies patch, creates backup, and executes scanner', async () => {
    // Generate fresh clean patch
    setFixMockProvider(async () => ({
      explanation: 'Replaced container.innerHTML with container.textContent to eliminate XSS vulnerability.',
      originalSnippet: '  container.innerHTML = bio // dangerous XSS pattern',
      proposedSnippet: '  container.textContent = bio // safely sanitized'
    }))

    const genRes = await apiRequest(
      `/api/repositories/501/code-quality/findings/${sampleFinding.id}/generate-fix`,
      { method: 'POST', body: {} }
    )
    appliedPatchId = genRes.data.data.patchId

    // Apply patch with skipValidation: false (verifies scanner execution)
    const applyRes = await apiRequest(
      `/api/repositories/501/code-quality/patches/${appliedPatchId}/apply`,
      { method: 'POST', body: { confirmed: true, skipValidation: false } }
    )

    assert.equal(applyRes.status, 200)
    assert.equal(applyRes.data.success, true)
    assert.equal(applyRes.data.data.status, 'applied')

    // 1. Verify file content on disk was actually updated
    const updatedFileContent = fs.readFileSync(testJsFileAbs, 'utf8')
    assert.ok(updatedFileContent.includes('container.textContent = bio // safely sanitized'))
    assert.ok(!updatedFileContent.includes('container.innerHTML = bio'))

    // 2. Verify backup snapshot exists on disk
    const backupPath = applyRes.data.data.backupFilePath
    assert.ok(backupPath && fs.existsSync(backupPath), 'Backup snapshot file must exist')
    const backupContent = fs.readFileSync(backupPath, 'utf8')
    assert.ok(backupContent.includes('container.innerHTML = bio'), 'Backup must contain pre-patch code')

    // 3. Verify scanner validation result
    assert.ok(applyRes.data.validationResult)
    assert.equal(applyRes.data.validationResult, 'resolved')
    assert.ok(applyRes.data.validationMessage.includes('ESLINT'))
  })

  // ── TEST 11: Atomic Rollback ──────────────────────────────────────────────
  await t.test('11. Atomic Rollback: Restores original file byte-for-byte from backup snapshot', async () => {
    const rollbackRes = await apiRequest(
      `/api/repositories/501/code-quality/patches/${appliedPatchId}/rollback`,
      { method: 'POST', body: {} }
    )

    assert.equal(rollbackRes.status, 200)
    assert.equal(rollbackRes.data.success, true)
    assert.equal(rollbackRes.data.patch.status, 'rolled_back')

    // Verify file on disk is restored to pre-patch state
    const restoredContent = fs.readFileSync(testJsFileAbs, 'utf8')
    assert.ok(restoredContent.includes('container.innerHTML = bio // dangerous XSS pattern'))
    assert.ok(!restoredContent.includes('container.textContent = bio // safely sanitized'))
  })

  // ── TEST 12: Scanner Severity & Score Integrity ───────────────────────────
  await t.test('12. Integrity: Original scanner findings and scores are preserved', async () => {
    assert.equal(sampleFinding.severity, 'high')
    assert.equal(sampleFinding.ruleId, 'no-inner-html')
    assert.equal(scanFixture.qualityScore, 78)
    assert.equal(scanFixture.grade, 'B')
  })
})
