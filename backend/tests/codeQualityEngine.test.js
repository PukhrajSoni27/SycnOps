/**
 * Test Suite for SyncOps Code Quality Engine
 * Verifies real scanner execution, JSON parsing, finding normalization,
 * language detection, concurrent scan prevention, and error resilience.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import {
  detectRepositoryLanguages,
  generateFindingId,
  extractCodeSnippet,
  runESLint,
  runRuff,
  runSemgrep,
  executeCodeQualityScan,
  isScanRunning
} from '../lib/codeQualityEngine.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const testRepoPath = path.resolve(rootDir, 'backend/.repos_cache/Estate-Luxe')

test('Code Quality Scanner Engine Suite', async (t) => {
  // Test 1: Language Detection & Vendor Filtering
  await t.test('1. detectRepositoryLanguages detects JS/TS and Python in real repo, skips vendor dirs', () => {
    assert.ok(fs.existsSync(testRepoPath), `Test repo must exist at ${testRepoPath}`)
    const detection = detectRepositoryLanguages(testRepoPath)

    assert.ok(detection.languages.includes('JavaScript/TypeScript'), 'Should detect JavaScript/TypeScript')
    assert.ok(detection.languages.includes('Python'), 'Should detect Python')
    assert.equal(detection.hasJsTs, true)
    assert.equal(detection.hasPython, true)
    assert.ok(detection.jsTsCount > 20, 'Should detect significant JS/TS source files')
    assert.ok(detection.pythonCount >= 1, 'Should detect Python source files')
    assert.ok(detection.totalFilesCount > 50, 'Total clean source files should exceed 50')

    // Ensure no vendor paths leaked
    const hasNodeModules = detection.filePaths.some((p) => p.includes('node_modules'))
    const hasVenv = detection.filePaths.some((p) => p.includes('.venv') || p.includes('venv/'))
    assert.equal(hasNodeModules, false, 'Should not contain node_modules files')
    assert.equal(hasVenv, false, 'Should not contain .venv files')
  })

  // Test 2: Deterministic Finding IDs
  await t.test('2. generateFindingId produces stable, unique 16-hex deterministic IDs', () => {
    const id1 = generateFindingId('eslint', 'src/App.tsx', 'no-unused-vars', 10, 5)
    const id2 = generateFindingId('eslint', 'src/App.tsx', 'no-unused-vars', 10, 5)
    const idDifferentLine = generateFindingId('eslint', 'src/App.tsx', 'no-unused-vars', 11, 5)
    const idDifferentScanner = generateFindingId('ruff', 'src/App.tsx', 'no-unused-vars', 10, 5)

    assert.equal(id1, id2, 'Same parameters must produce identical IDs')
    assert.notEqual(id1, idDifferentLine, 'Different lines must produce distinct IDs')
    assert.notEqual(id1, idDifferentScanner, 'Different scanners must produce distinct IDs')
    assert.equal(id1.length, 16, 'Finding ID should be a 16-character hex string')
  })

  // Test 3: Safe Code Snippet Extractor
  await t.test('3. extractCodeSnippet safely returns context window around target line', () => {
    const sampleFile = path.resolve(testRepoPath, 'Real-estate-project-backend/Backend/main.py')
    if (fs.existsSync(sampleFile)) {
      const snippet = extractCodeSnippet(sampleFile, 3, 2)
      assert.ok(snippet.includes('>'), 'Snippet should contain the target line indicator ">"')
      assert.ok(snippet.includes('fastapi'), 'Snippet should contain actual source text')
    }
  })

  // Test 4: ESLint Execution & JSON Parsing
  await t.test('4. ESLint executes via process.execPath with pinned config and returns normalized findings', async () => {
    const result = await runESLint(testRepoPath)
    assert.equal(result.scanner, 'eslint')
    assert.equal(result.status, 'completed')
    assert.ok(Array.isArray(result.findings), 'Findings must be an array')
    assert.ok(result.findings.length > 0, 'Real repository must produce ESLint findings')

    const first = result.findings[0]
    assert.ok(first.id, 'Finding must have an id')
    assert.ok(first.ruleId, 'Finding must have a ruleId')
    assert.ok(first.title, 'Finding must have a title')
    assert.ok(['critical', 'high', 'medium', 'low', 'informational'].includes(first.severity))
    assert.ok(first.message, 'Finding must have a message')
    assert.ok(first.filePath, 'Finding must have a filePath')
    assert.ok(first.line >= 1, 'Finding must have a positive line number')
    assert.equal(first.scanner, 'eslint')
  })

  // Test 5: Ruff Execution & Exit Code 1 Handling
  await t.test('5. Ruff executes on Python files and correctly parses JSON findings when exit code is 1', async () => {
    const result = await runRuff(testRepoPath)
    assert.equal(result.scanner, 'ruff')
    assert.equal(result.status, 'completed')
    assert.ok(Array.isArray(result.findings))
    assert.ok(result.findings.length > 0, 'Python backend files must produce real Ruff findings')

    const f401 = result.findings.find((f) => f.ruleId === 'F401')
    if (f401) {
      assert.equal(f401.scanner, 'ruff')
      assert.equal(f401.severity, 'high')
      assert.ok(f401.filePath.endsWith('.py'))
      assert.ok(f401.suggestedFix?.includes('Remove unused import') || f401.message.includes('unused'))
    }
  })

  // Test 6: Semgrep Execution & SAST Detection
  await t.test('6. Semgrep executes SAST rules and detects security findings with metadata', async () => {
    const result = await runSemgrep(testRepoPath)
    assert.equal(result.scanner, 'semgrep')
    assert.equal(result.status, 'completed')
    assert.ok(Array.isArray(result.findings))
    assert.ok(result.findings.length > 0, 'Semgrep should detect real security patterns')

    const secFinding = result.findings.find((f) => f.severity === 'critical' || f.category === 'security')
    assert.ok(secFinding, 'Should detect at least one security finding in Estate-Luxe')
    assert.equal(secFinding.scanner, 'semgrep')
    assert.ok(secFinding.ruleId.includes('jwt') || secFinding.ruleId.includes('security') || secFinding.ruleId.includes('react'))
  })

  // Test 7: Unified Orchestrator on Polyglot Repo
  await t.test('7. executeCodeQualityScan orchestrates all scanners and aggregates findings', async () => {
    const fullScan = await executeCodeQualityScan(testRepoPath, { repoId: 'estate-luxe-test' })

    assert.ok(fullScan.scanId.startsWith('cqs_'))
    assert.ok(fullScan.durationMs > 0)
    assert.equal(fullScan.scannedFilesCount > 50, true)
    assert.equal(fullScan.scannersExecuted.eslint.status, 'completed')
    assert.equal(fullScan.scannersExecuted.ruff.status, 'completed')
    assert.equal(fullScan.scannersExecuted.semgrep.status, 'completed')

    const sum = fullScan.summary
    assert.ok(sum.totalFindings > 50, 'Total findings should exceed 50 across scanners')
    assert.equal(sum.totalFindings, sum.critical + sum.high + sum.medium + sum.low + sum.informational)
    assert.equal(sum.totalFindings, sum.errors + sum.warnings + sum.informational)
    assert.ok(sum.byCategory.security > 0, 'Should categorize security findings')
    assert.ok(sum.byScanner.eslint > 0)
    assert.ok(sum.byScanner.ruff > 0)
    assert.ok(sum.byScanner.semgrep > 0)
  })

  // Test 8: Empty Directory & Unsupported Language Handling
  await t.test('8. Empty or non-code directory returns zero findings and skipped scanners', async () => {
    const emptyTestDir = path.resolve(rootDir, 'backend/.test_empty_repo')
    fs.mkdirSync(emptyTestDir, { recursive: true })
    try {
      // Add a non-code file
      fs.writeFileSync(path.join(emptyTestDir, 'README.txt'), 'Sample readme without code')

      const scanResult = await executeCodeQualityScan(emptyTestDir, { repoId: 'test-empty-repo' })
      assert.equal(scanResult.summary.totalFindings, 0)
      assert.equal(scanResult.findings.length, 0)
      assert.equal(scanResult.scannersExecuted.eslint.status, 'skipped')
      assert.equal(scanResult.scannersExecuted.ruff.status, 'skipped')
    } finally {
      fs.rmSync(emptyTestDir, { recursive: true, force: true })
    }
  })

  // Test 9: Path Validation Rejects Non-Existent Target
  await t.test('9. Path validation rejects non-existent repository directories', async () => {
    await assert.rejects(
      async () => {
        await executeCodeQualityScan(path.resolve(rootDir, 'backend/.repos_cache/non_existent_repo_dir'))
      },
      (err) => {
        assert.match(err.message, /does not exist/i)
        return true
      }
    )
  })

  // Test 10: Concurrency Lock Prevents Duplicate Scans
  await t.test('10. Concurrency lock prevents parallel scans for the same repository', async () => {
    const repoKey = 'concurrency-test-repo'
    // Start first scan in background
    const scan1Promise = executeCodeQualityScan(testRepoPath, { repoId: repoKey })

    // Immediately try to start second scan on the same repo
    await assert.rejects(
      async () => {
        await executeCodeQualityScan(testRepoPath, { repoId: repoKey })
      },
      (err) => {
        assert.match(err.message, /already in progress/i)
        return true
      }
    )

    // Await first scan to finish cleanly
    const result1 = await scan1Promise
    assert.ok(result1.scanId)
    // Verify lock is released after scan completes
    assert.equal(isScanRunning(repoKey), false, 'Lock must be released after completion')
  })
})

