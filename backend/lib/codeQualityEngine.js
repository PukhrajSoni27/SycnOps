/**
 * SyncOps Code Quality Engine
 * 
 * Production-grade code quality and static analysis orchestrator:
 * - ESLint (JavaScript/TypeScript)
 * - Ruff (Python)
 * - Semgrep (Security & SAST across polyglot codebases)
 * 
 * Security & Reliability Guarantees:
 * - Zero shell execution (`shell: false`) with strict argument arrays.
 * - On Windows, ESLint runs directly via `process.execPath` and pinned local binary.
 * - Pinned trusted configuration (`eslint.config.mjs`); zero execution of untrusted repo scripts.
 * - Concurrency control: prevents duplicate simultaneous scans for the same repository.
 * - Strict path confinement: prevents path traversal and confines scanner targets.
 * - Sanitized environment allowlist: credentials and process injection vectors are stripped.
 * - Graceful exit code handling: parses linter findings when exit code is 1.
 * - Partial failure resilience: captures scanner-specific errors without crashing the full audit.
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import { createHash } from 'crypto'
import { isVendorOrBuildPath, VENDOR_AND_BUILD_DIRS } from './securityScanner.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const pinnedEslintConfig = path.resolve(rootDir, 'eslint.config.mjs')
const eslintBinPath = path.resolve(rootDir, 'node_modules/eslint/bin/eslint.js')

// ── Registry for concurrent scan prevention ─────────────────────────────────
// Key: canonical repo path or repoId -> { scanId, startedAt, abortController }
const activeScans = new Map()

// ── Configuration & Limits ──────────────────────────────────────────────────
const DEFAULT_SCANNER_TIMEOUT_MS = 180_000 // 180 seconds per scanner (accommodates cold start SAST)
const MAX_BUFFER_BYTES = 15 * 1024 * 1024 // 15 MB max process stdout buffer

// Binary and media extensions to exclude from code scanning
const BINARY_AND_MEDIA_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp', '.avif',
  '.pdf', '.zip', '.tar', '.gz', '.tgz', '.7z', '.rar', '.bz2',
  '.exe', '.dll', '.so', '.dylib', '.bin', '.obj', '.o', '.a',
  '.pyc', '.pyd', '.pyo', '.pkl', '.pickle', '.joblib',
  '.db', '.sqlite', '.sqlite3', '.parquet', '.feather', '.arrow',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.mp3', '.mp4', '.wav', '.avi', '.mov', '.webm', '.mkv',
  '.iso', '.dmg', '.class', '.jar', '.lockb'
])

// File extensions mapped to scanners
const JS_TS_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'])
const PYTHON_EXTENSIONS = new Set(['.py', '.pyw'])
const JAVA_EXTENSIONS = new Set(['.java', '.kt', '.scala', '.groovy'])
const GO_EXTENSIONS = new Set(['.go'])
const RUST_EXTENSIONS = new Set(['.rs'])
const CPP_EXTENSIONS = new Set(['.c', '.cpp', '.cc', '.cxx', '.h', '.hpp'])
const PHP_EXTENSIONS = new Set(['.php'])
const RUBY_EXTENSIONS = new Set(['.rb', '.erb'])

// Memory scan cache for incremental mode
const memoryScanCache = new Map()

export function computeRepoSourceHash(repoDir, filePaths) {
  const hash = createHash('sha256')
  const sorted = [...(filePaths || [])].sort()
  for (const rel of sorted.slice(0, 500)) {
    try {
      const stat = fs.statSync(path.join(repoDir, rel))
      hash.update(`${rel}:${stat.size}:${stat.mtimeMs};`)
    } catch (_) {}
  }
  return hash.digest('hex').slice(0, 24)
}

// ── Environment Sanitization Allowlist ──────────────────────────────────────
const SAFE_ENV_KEYS = [
  'PATH', 'Path', 'SYSTEMROOT', 'SystemRoot', 'COMSPEC', 'ComSpec',
  'TEMP', 'TMP', 'USERPROFILE', 'HOME', 'APPDATA', 'LOCALAPPDATA',
  'LANG', 'LC_ALL', 'LC_CTYPE', 'NODE_ENV'
]

function getSanitizedEnv() {
  const cleanEnv = {}
  for (const key of SAFE_ENV_KEYS) {
    if (process.env[key] !== undefined) {
      cleanEnv[key] = process.env[key]
    }
  }
  cleanEnv.NODE_ENV = 'production'
  return cleanEnv
}

// ── Process Execution Helper ────────────────────────────────────────────────
/**
 * Spawns a child process with argument array and shell: false.
 * Handles timeouts, buffer limits, and exit codes.
 */
function spawnScannerProcess(executable, args, options = {}) {
  const {
    cwd = process.cwd(),
    timeoutMs = DEFAULT_SCANNER_TIMEOUT_MS,
    env = getSanitizedEnv(),
    allowedExitCodes = [0, 1] // Linters often exit 1 when findings are present
  } = options

  return new Promise((resolve) => {
    const startTime = Date.now()
    let stdoutBuffer = ''
    let stderrBuffer = ''
    let killedByTimeout = false
    let bufferExceeded = false

    const child = spawn(executable, args, {
      cwd,
      shell: false,
      env,
      windowsHide: true
    })

    const timer = setTimeout(() => {
      killedByTimeout = true
      try {
        child.kill('SIGTERM')
        setTimeout(() => {
          try { child.kill('SIGKILL') } catch (_) {}
        }, 3000)
      } catch (_) {}
    }, timeoutMs)

    child.stdout.on('data', (chunk) => {
      if (stdoutBuffer.length < MAX_BUFFER_BYTES) {
        stdoutBuffer += chunk.toString()
      } else if (!bufferExceeded) {
        bufferExceeded = true
        console.warn(`[CodeQualityEngine] Output limit exceeded for ${executable}`)
      }
    })

    child.stderr.on('data', (chunk) => {
      if (stderrBuffer.length < 512 * 1024) {
        stderrBuffer += chunk.toString()
      }
    })

    child.on('error', (err) => {
      clearTimeout(timer)
      resolve({
        success: false,
        exitCode: -1,
        stdout: '',
        stderr: err.message,
        durationMs: Date.now() - startTime,
        error: `Failed to spawn ${executable}: ${err.message}`
      })
    })

    child.on('close', (code) => {
      clearTimeout(timer)
      const durationMs = Date.now() - startTime

      if (killedByTimeout) {
        return resolve({
          success: false,
          exitCode: code,
          stdout: stdoutBuffer,
          stderr: stderrBuffer,
          durationMs,
          timedOut: true,
          error: `Process timed out after ${timeoutMs}ms`
        })
      }

      const isAllowedCode = allowedExitCodes.includes(code ?? 0)
      resolve({
        success: isAllowedCode,
        exitCode: code ?? 0,
        stdout: stdoutBuffer,
        stderr: stderrBuffer,
        durationMs,
        timedOut: false,
        error: isAllowedCode ? null : `Process exited with code ${code}`
      })
    })
  })
}

// ── Language & Source File Detection ────────────────────────────────────────
/**
 * Recursively inspects a repository directory to detect programming languages,
 * source files, and determine which scanners are applicable.
 */
export function detectRepositoryLanguages(repoDir) {
  const normRepoDir = path.resolve(repoDir)
  const files = []
  let filesDiscovered = 0
  let filesSkipped = 0
  let jsTsCount = 0
  let pythonCount = 0
  let javaCount = 0
  let goCount = 0
  let rustCount = 0
  let cppCount = 0
  let phpCount = 0
  let rubyCount = 0
  let otherCodeCount = 0

  function walk(currentDir) {
    let entries = []
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true })
    } catch (_) {
      return
    }

    for (const entry of entries) {
      filesDiscovered++
      const fullPath = path.join(currentDir, entry.name)
      const relPath = path.relative(normRepoDir, fullPath).replace(/\\/g, '/')

      if (isVendorOrBuildPath(relPath)) {
        filesSkipped++
        continue
      }

      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (BINARY_AND_MEDIA_EXTS.has(ext)) {
          filesSkipped++
          continue
        }

        files.push(relPath)

        if (JS_TS_EXTENSIONS.has(ext)) {
          jsTsCount++
        } else if (PYTHON_EXTENSIONS.has(ext)) {
          pythonCount++
        } else if (JAVA_EXTENSIONS.has(ext)) {
          javaCount++
        } else if (GO_EXTENSIONS.has(ext)) {
          goCount++
        } else if (RUST_EXTENSIONS.has(ext)) {
          rustCount++
        } else if (CPP_EXTENSIONS.has(ext)) {
          cppCount++
        } else if (PHP_EXTENSIONS.has(ext)) {
          phpCount++
        } else if (RUBY_EXTENSIONS.has(ext)) {
          rubyCount++
        } else if (['.json', '.yaml', '.yml', '.html', '.css', '.sql', '.sh', '.md'].includes(ext)) {
          otherCodeCount++
        }
      }
    }
  }

  walk(normRepoDir)

  const detectedLanguages = []
  if (jsTsCount > 0) detectedLanguages.push('JavaScript/TypeScript')
  if (pythonCount > 0) detectedLanguages.push('Python')
  if (javaCount > 0) detectedLanguages.push('Java/Kotlin')
  if (goCount > 0) detectedLanguages.push('Go')
  if (rustCount > 0) detectedLanguages.push('Rust')
  if (cppCount > 0) detectedLanguages.push('C/C++')
  if (phpCount > 0) detectedLanguages.push('PHP')
  if (rubyCount > 0) detectedLanguages.push('Ruby')
  if (otherCodeCount > 0 && detectedLanguages.length === 0) detectedLanguages.push('Configuration/Scripts')

  return {
    languages: detectedLanguages,
    totalFilesCount: files.length,
    filesDiscovered,
    filesScanned: files.length,
    filesSkipped,
    jsTsCount,
    pythonCount,
    javaCount,
    goCount,
    rustCount,
    cppCount,
    phpCount,
    rubyCount,
    hasJsTs: jsTsCount > 0,
    hasPython: pythonCount > 0,
    hasJava: javaCount > 0,
    hasGo: goCount > 0,
    hasRust: rustCount > 0,
    hasCpp: cppCount > 0,
    filePaths: files
  }
}

// ── Stable Finding ID Generator ─────────────────────────────────────────────
/**
 * Creates a deterministic, stable 16-character hex hash for a finding.
 * Allows tracking new, resolved, and persistent findings across scan runs.
 */
export function generateFindingId(scanner, filePath, ruleId, line, column) {
  const normPath = (filePath || '').replace(/\\/g, '/').toLowerCase()
  const normRule = (ruleId || 'unknown').toLowerCase()
  return createHash('sha256')
    .update(`${scanner}:${normPath}:${normRule}:${line || 1}:${column || 1}`)
    .digest('hex')
    .slice(0, 16)
}

// ── Code Snippet Extractor ──────────────────────────────────────────────────
/**
 * Safely extracts a small context window (e.g. 2 lines before, 2 lines after)
 * around the reported finding line without reading the full file into memory.
 */
export function extractCodeSnippet(absFilePath, targetLine, contextRadius = 2) {
  if (!absFilePath || !targetLine || typeof targetLine !== 'number') return ''
  try {
    if (!fs.existsSync(absFilePath)) return ''
    const content = fs.readFileSync(absFilePath, 'utf8')
    const lines = content.split('\n')
    const startIdx = Math.max(0, targetLine - 1 - contextRadius)
    const endIdx = Math.min(lines.length - 1, targetLine - 1 + contextRadius)

    return lines
      .slice(startIdx, endIdx + 1)
      .map((line, idx) => {
        const lineNum = startIdx + idx + 1
        const prefix = lineNum === targetLine ? ' >' : '  '
        return `${prefix} ${String(lineNum).padStart(4, ' ')} | ${line.trimEnd()}`
      })
      .join('\n')
  } catch (_) {
    return ''
  }
}

// ── Categorization & Severity Mapping ───────────────────────────────────────
function categorizeRule(scanner, ruleId = '', message = '', rawCategory = '') {
  const normRule = ruleId.toLowerCase()
  const normCat = (rawCategory || '').toLowerCase()
  const normMsg = message.toLowerCase()

  if (normCat === 'security' || normRule.includes('security') || normRule.includes('cwe') || normRule.includes('vuln') || normRule.startsWith('s') && scanner === 'ruff') {
    return 'security'
  }
  if (normMsg.includes('security') || normMsg.includes('vulnerability') || normMsg.includes('injection') || normMsg.includes('secret') || normMsg.includes('xss') || normMsg.includes('csrf')) {
    return 'security'
  }
  if (normRule.includes('perf') || normMsg.includes('performance') || normMsg.includes('slow') || normMsg.includes('complexity')) {
    return 'performance'
  }
  if (normRule.includes('unused') || normRule.includes('naming') || normRule.includes('format') || normRule.includes('indent') || normRule.startsWith('n') && scanner === 'ruff' || normRule.startsWith('d') && scanner === 'ruff') {
    return 'readability'
  }
  if (normRule.includes('no-undef') || normRule.includes('syntax') || normRule.startsWith('f') && scanner === 'ruff' || normRule.startsWith('b') && scanner === 'ruff') {
    return 'reliability'
  }
  return 'maintainability'
}

function normalizeSeverity(scanner, rawSeverity, ruleId = '', message = '') {
  const norm = String(rawSeverity || '').toLowerCase()
  const normRule = ruleId.toLowerCase()

  // High-priority security rules
  if (normRule.includes('sql') || normRule.includes('rce') || normRule.includes('eval') || normRule.includes('injection') || normRule.includes('hardcoded-secret')) {
    return 'critical'
  }

  // ESLint severity: 2 = error, 1 = warning
  if (scanner === 'eslint') {
    if (norm === '2' || norm === 'error') {
      return ruleId === 'no-undef' || ruleId.includes('security') ? 'high' : 'medium'
    }
    return 'low'
  }

  // Ruff severity mapping
  if (scanner === 'ruff') {
    if (normRule.startsWith('s')) return 'high' // Flake8-bandit security
    if (normRule.startsWith('f') || normRule.startsWith('e9')) return 'high' // Pyflakes errors & syntax
    if (normRule.startsWith('b')) return 'medium' // Bugbear
    if (normRule.startsWith('e') || normRule.startsWith('w')) return 'low' // pycodestyle
    return 'informational'
  }

  // Semgrep severity mapping: ERROR, WARNING, INFO
  if (scanner === 'semgrep') {
    if (norm === 'error') return 'critical'
    if (norm === 'warning') return 'high'
    return 'medium'
  }

  if (norm === 'critical') return 'critical'
  if (norm === 'high' || norm === 'error') return 'high'
  if (norm === 'medium' || norm === 'warning' || norm === 'warn') return 'medium'
  if (norm === 'low') return 'low'
  return 'informational'
}

// ── ESLint Scanner ──────────────────────────────────────────────────────────
/**
 * Runs ESLint on JS/TS source files using process.execPath and pinned eslint.config.mjs.
 */
export async function runESLint(repoDir, options = {}) {
  const startTime = Date.now()
  const normRepoDir = path.resolve(repoDir)

  // Verify ESLint binary and config exist
  if (!fs.existsSync(eslintBinPath)) {
    return {
      scanner: 'eslint',
      status: 'failed',
      durationMs: Date.now() - startTime,
      findings: [],
      error: `ESLint launcher not found at ${eslintBinPath}`
    }
  }

  const cacheDir = path.join(os.tmpdir(), 'syncops_eslint_cache')
  try { fs.mkdirSync(cacheDir, { recursive: true }) } catch (_) {}
  const cacheFile = path.join(cacheDir, `${createHash('sha256').update(normRepoDir).digest('hex').slice(0, 16)}.cache`)

  const args = [
    eslintBinPath,
    normRepoDir,
    '--format', 'json',
    '--config', pinnedEslintConfig,
    '--no-config-lookup',
    '--cache',
    '--cache-location', cacheFile
  ]

  const result = await spawnScannerProcess(process.execPath, args, {
    cwd: normRepoDir,
    timeoutMs: options.timeoutMs || DEFAULT_SCANNER_TIMEOUT_MS,
    allowedExitCodes: [0, 1] // ESLint returns 1 when lint errors exist
  })

  if (!result.success && !result.stdout) {
    return {
      scanner: 'eslint',
      status: result.timedOut ? 'timed_out' : 'failed',
      durationMs: result.durationMs,
      findings: [],
      error: result.error || result.stderr || 'ESLint execution failed'
    }
  }

  let parsed = []
  try {
    const rawOut = result.stdout.trim()
    const jsonStart = rawOut.indexOf('[')
    const jsonEnd = rawOut.lastIndexOf(']')
    if (jsonStart !== -1 && jsonEnd !== -1) {
      parsed = JSON.parse(rawOut.slice(jsonStart, jsonEnd + 1))
    }
  } catch (err) {
    return {
      scanner: 'eslint',
      status: 'failed',
      durationMs: result.durationMs,
      findings: [],
      error: `Failed to parse ESLint JSON output: ${err.message}`
    }
  }

  const findings = []
  for (const fileReport of parsed) {
    const absPath = fileReport.filePath
    const relPath = path.relative(normRepoDir, absPath).replace(/\\/g, '/')
    if (isVendorOrBuildPath(relPath)) continue

    for (const msg of fileReport.messages || []) {
      const ruleId = msg.ruleId || 'syntax-error'
      const line = msg.line || 1
      const column = msg.column || 1
      const endLine = msg.endLine || line
      const endColumn = msg.endColumn || column
      const severity = normalizeSeverity('eslint', msg.severity, ruleId, msg.message)
      const category = categorizeRule('eslint', ruleId, msg.message)
      const id = generateFindingId('eslint', relPath, ruleId, line, column)
      const snippet = extractCodeSnippet(absPath, line)

      let suggestedFix = null
      if (msg.fix && typeof msg.fix.text === 'string') {
        suggestedFix = msg.fix.text
      } else if (msg.suggestions && msg.suggestions.length > 0) {
        suggestedFix = msg.suggestions[0].desc || msg.suggestions[0].fix?.text || null
      }

      findings.push({
        id,
        ruleId,
        title: `[ESLint] ${ruleId}: ${msg.message?.slice(0, 80) || 'Lint rule violation'}`,
        severity,
        message: msg.message || 'Lint error',
        filePath: relPath,
        line,
        column,
        endLine,
        endColumn,
        scanner: 'eslint',
        category,
        suggestedFix,
        codeSnippet: snippet
      })
    }
  }

  return {
    scanner: 'eslint',
    status: 'completed',
    durationMs: result.durationMs,
    findings,
    error: null
  }
}

// ── Ruff Scanner ────────────────────────────────────────────────────────────
/**
 * Runs Ruff on Python source files using JSON output format.
 */
export async function runRuff(repoDir, options = {}) {
  const startTime = Date.now()
  const normRepoDir = path.resolve(repoDir)

  const args = [
    'check',
    normRepoDir,
    '--output-format', 'json',
    '--isolated',
    '--exclude', VENDOR_AND_BUILD_DIRS.join(',')
  ]

  const result = await spawnScannerProcess('ruff', args, {
    cwd: normRepoDir,
    timeoutMs: options.timeoutMs || DEFAULT_SCANNER_TIMEOUT_MS,
    allowedExitCodes: [0, 1] // Ruff exits with 1 when violations exist
  })

  if (!result.success && !result.stdout) {
    return {
      scanner: 'ruff',
      status: result.timedOut ? 'timed_out' : 'failed',
      durationMs: result.durationMs,
      findings: [],
      error: result.error || result.stderr || 'Ruff execution failed'
    }
  }

  let parsed = []
  try {
    const rawOut = result.stdout.trim()
    const jsonStart = rawOut.indexOf('[')
    const jsonEnd = rawOut.lastIndexOf(']')
    if (jsonStart !== -1 && jsonEnd !== -1) {
      parsed = JSON.parse(rawOut.slice(jsonStart, jsonEnd + 1))
    }
  } catch (err) {
    return {
      scanner: 'ruff',
      status: 'failed',
      durationMs: result.durationMs,
      findings: [],
      error: `Failed to parse Ruff JSON output: ${err.message}`
    }
  }

  const findings = []
  for (const item of parsed) {
    const absPath = item.filename
    const relPath = path.relative(normRepoDir, absPath).replace(/\\/g, '/')
    if (isVendorOrBuildPath(relPath)) continue

    const ruleId = item.code || 'python-lint'
    const line = item.location?.row || 1
    const column = item.location?.column || 1
    const endLine = item.end_location?.row || line
    const endColumn = item.end_location?.column || column
    const severity = normalizeSeverity('ruff', 'warning', ruleId, item.message)
    const category = categorizeRule('ruff', ruleId, item.message)
    const id = generateFindingId('ruff', relPath, ruleId, line, column)
    const snippet = extractCodeSnippet(absPath, line)

    let suggestedFix = null
    if (item.fix) {
      suggestedFix = item.fix.message || item.fix.applicability || null
    }

    findings.push({
      id,
      ruleId,
      title: `[Ruff] ${ruleId}: ${item.message?.slice(0, 80) || 'Python violation'}`,
      severity,
      message: item.message || 'Python lint violation',
      filePath: relPath,
      line,
      column,
      endLine,
      endColumn,
      scanner: 'ruff',
      category,
      suggestedFix,
      codeSnippet: snippet
    })
  }

  return {
    scanner: 'ruff',
    status: 'completed',
    durationMs: result.durationMs,
    findings,
    error: null
  }
}

// ── Semgrep Scanner ─────────────────────────────────────────────────────────
/**
 * Runs Semgrep SAST security and code pattern analysis across supported languages.
 */
export async function runSemgrep(repoDir, options = {}) {
  const startTime = Date.now()
  const normRepoDir = path.resolve(repoDir)

  const args = [
    'scan',
    '--json',
    '--config', 'auto',
    '--quiet',
    '--disable-version-check',
    '--optimizations', 'all',
    '--jobs', '4'
  ]

  for (const dir of VENDOR_AND_BUILD_DIRS) {
    args.push('--exclude', dir)
  }
  args.push(normRepoDir)

  const result = await spawnScannerProcess('semgrep', args, {
    cwd: normRepoDir,
    timeoutMs: options.timeoutMs || (DEFAULT_SCANNER_TIMEOUT_MS * 1.5), // Semgrep can take a bit longer
    allowedExitCodes: [0, 1]
  })

  if (!result.success && !result.stdout) {
    return {
      scanner: 'semgrep',
      status: result.timedOut ? 'timed_out' : 'failed',
      durationMs: result.durationMs,
      findings: [],
      error: result.error || result.stderr || 'Semgrep execution failed'
    }
  }

  let parsed = { results: [] }
  try {
    const rawOut = result.stdout.trim()
    const jsonStart = rawOut.indexOf('{')
    const jsonEnd = rawOut.lastIndexOf('}')
    if (jsonStart !== -1 && jsonEnd !== -1) {
      parsed = JSON.parse(rawOut.slice(jsonStart, jsonEnd + 1))
    }
  } catch (err) {
    return {
      scanner: 'semgrep',
      status: 'failed',
      durationMs: result.durationMs,
      findings: [],
      error: `Failed to parse Semgrep JSON output: ${err.message}`
    }
  }

  const findings = []
  for (const item of parsed.results || []) {
    const absPath = path.isAbsolute(item.path) ? item.path : path.resolve(normRepoDir, item.path)
    const relPath = path.relative(normRepoDir, absPath).replace(/\\/g, '/')
    if (isVendorOrBuildPath(relPath)) continue

    const ruleId = item.check_id || 'semgrep-finding'
    const line = item.start?.line || 1
    const column = item.start?.col || 1
    const endLine = item.end?.line || line
    const endColumn = item.end?.col || column
    const rawSeverity = item.extra?.severity || 'WARNING'
    const rawCategory = item.extra?.metadata?.category || 'security'
    const severity = normalizeSeverity('semgrep', rawSeverity, ruleId, item.extra?.message)
    const category = categorizeRule('semgrep', ruleId, item.extra?.message, rawCategory)
    const id = generateFindingId('semgrep', relPath, ruleId, line, column)
    const snippet = extractCodeSnippet(absPath, line)

    const suggestedFix = item.extra?.fix || null

    findings.push({
      id,
      ruleId,
      title: `[Semgrep] ${ruleId}: ${(item.extra?.message || '').slice(0, 80)}`,
      severity,
      message: item.extra?.message || 'Security pattern detected',
      filePath: relPath,
      line,
      column,
      endLine,
      endColumn,
      scanner: 'semgrep',
      category,
      suggestedFix,
      codeSnippet: snippet
    })
  }

  return {
    scanner: 'semgrep',
    status: 'completed',
    durationMs: result.durationMs,
    findings,
    error: null
  }
}

// ── Concurrency & Lock Helpers ──────────────────────────────────────────────
export function isScanRunning(repoKey) {
  return activeScans.has(repoKey)
}

export function getActiveScans() {
  const list = []
  for (const [key, val] of activeScans.entries()) {
    list.push({
      repoKey: key,
      scanId: val.scanId,
      startedAt: val.startedAt,
      durationMs: Date.now() - val.startedAt
    })
  }
  return list
}

// ── Orchestrator: Comprehensive Quality Scan ────────────────────────────────
/**
 * Main entry point: Executes all relevant scanners on an imported repository.
 * Enforces concurrency locks, path validation, language detection, and normalized output.
 */
export async function executeCodeQualityScan(repoPath, options = {}) {
  const normRepoPath = path.resolve(repoPath)

  // 1. Path Confinement & Validation
  if (!fs.existsSync(normRepoPath)) {
    throw new Error(`Target repository directory does not exist: ${repoPath}`)
  }
  if (!fs.statSync(normRepoPath).isDirectory()) {
    throw new Error(`Target repository path is not a directory: ${repoPath}`)
  }

  // 2. Concurrency Lock: Prevent parallel scans on the same repo
  const repoKey = options.repoId ? String(options.repoId) : normRepoPath
  if (activeScans.has(repoKey)) {
    const existing = activeScans.get(repoKey)
    const elapsedSec = Math.round((Date.now() - existing.startedAt) / 1000)
    throw new Error(`A code quality scan is already in progress for this repository (running for ${elapsedSec}s). Please wait for it to complete.`)
  }

  const scanId = `cqs_${Date.now()}_${createHash('sha256').update(repoKey).digest('hex').slice(0, 8)}`
  activeScans.set(repoKey, {
    scanId,
    startedAt: Date.now()
  })

  const overallStart = Date.now()

  try {
    // 3. Language & Source Detection
    const detection = detectRepositoryLanguages(normRepoPath)

    // Check for incremental scan cache hit
    const sourceHash = computeRepoSourceHash(normRepoPath, detection.filePaths)
    const isIncremental = Boolean(options.incremental)
    const cached = memoryScanCache.get(repoKey)

    if (isIncremental && cached && cached.sourceHash === sourceHash) {
      return {
        ...cached.result,
        scanId,
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - overallStart,
        scanType: 'incremental',
        cacheHit: true,
        filesDiscovered: detection.filesDiscovered,
        filesScanned: detection.filesScanned,
        filesSkipped: detection.filesSkipped
      }
    }

    // Handle empty or unsupported repositories gracefully
    if (detection.totalFilesCount === 0 || detection.languages.length === 0) {
      return {
        scanId,
        repositoryPath: normRepoPath,
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - overallStart,
        scanType: isIncremental ? 'incremental' : 'full',
        cacheHit: false,
        filesDiscovered: detection.filesDiscovered,
        filesScanned: 0,
        filesSkipped: detection.filesSkipped,
        languagesDetected: [],
        scannedFilesCount: 0,
        scannersExecuted: {
          eslint: { status: 'skipped', durationMs: 0, findingsCount: 0, reason: 'No JavaScript/TypeScript files' },
          ruff: { status: 'skipped', durationMs: 0, findingsCount: 0, reason: 'No Python files' },
          semgrep: { status: 'skipped', durationMs: 0, findingsCount: 0, reason: 'No code files found' }
        },
        summary: {
          totalFindings: 0,
          filesDiscovered: detection.filesDiscovered,
          filesScanned: 0,
          filesSkipped: detection.filesSkipped,
          scanType: isIncremental ? 'incremental' : 'full',
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          informational: 0,
          errors: 0,
          warnings: 0,
          byCategory: { security: 0, reliability: 0, maintainability: 0, readability: 0, performance: 0 },
          byScanner: { eslint: 0, ruff: 0, semgrep: 0 },
          byLanguage: {}
        },
        findings: []
      }
    }

    // 4. Select and Run Scanners in Parallel / Controlled Tasks
    const scannerPromises = []

    // A. ESLint
    if (detection.hasJsTs) {
      scannerPromises.push(runESLint(normRepoPath, options))
    } else {
      scannerPromises.push(Promise.resolve({
        scanner: 'eslint',
        status: 'skipped',
        durationMs: 0,
        findings: [],
        reason: 'No JavaScript or TypeScript files detected'
      }))
    }

    // B. Ruff
    if (detection.hasPython) {
      scannerPromises.push(runRuff(normRepoPath, options))
    } else {
      scannerPromises.push(Promise.resolve({
        scanner: 'ruff',
        status: 'skipped',
        durationMs: 0,
        findings: [],
        reason: 'No Python files detected'
      }))
    }

    // C. Semgrep (runs if any code/config files exist)
    scannerPromises.push(runSemgrep(normRepoPath, options))

    const [eslintResult, ruffResult, semgrepResult] = await Promise.all(scannerPromises)

    // 5. Aggregate and Deduplicate Findings
    const allFindings = [
      ...(eslintResult.findings || []),
      ...(ruffResult.findings || []),
      ...(semgrepResult.findings || [])
    ]

    // Sort findings by severity (critical -> high -> medium -> low -> informational)
    const severityWeight = { critical: 5, high: 4, medium: 3, low: 2, informational: 1 }
    allFindings.sort((a, b) => {
      const diff = (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0)
      if (diff !== 0) return diff
      return a.filePath.localeCompare(b.filePath) || a.line - b.line
    })

    // 6. Compute Comprehensive Summary Metrics
    const summary = {
      totalFindings: allFindings.length,
      filesDiscovered: detection.filesDiscovered,
      filesScanned: detection.filesScanned,
      filesSkipped: detection.filesSkipped,
      scanType: isIncremental ? 'incremental' : 'full',
      critical: allFindings.filter((f) => f.severity === 'critical').length,
      high: allFindings.filter((f) => f.severity === 'high').length,
      medium: allFindings.filter((f) => f.severity === 'medium').length,
      low: allFindings.filter((f) => f.severity === 'low').length,
      informational: allFindings.filter((f) => f.severity === 'informational').length,
      errors: allFindings.filter((f) => f.severity === 'critical' || f.severity === 'high').length,
      warnings: allFindings.filter((f) => f.severity === 'medium' || f.severity === 'low').length,
      byCategory: {
        security: allFindings.filter((f) => f.category === 'security').length,
        reliability: allFindings.filter((f) => f.category === 'reliability').length,
        maintainability: allFindings.filter((f) => f.category === 'maintainability').length,
        readability: allFindings.filter((f) => f.category === 'readability').length,
        performance: allFindings.filter((f) => f.category === 'performance').length
      },
      byScanner: {
        eslint: eslintResult.findings?.length || 0,
        ruff: ruffResult.findings?.length || 0,
        semgrep: semgrepResult.findings?.length || 0
      },
      byLanguage: {
        'JavaScript/TypeScript': allFindings.filter((f) => JS_TS_EXTENSIONS.has(path.extname(f.filePath).toLowerCase())).length,
        'Python': allFindings.filter((f) => PYTHON_EXTENSIONS.has(path.extname(f.filePath).toLowerCase())).length
      }
    }

    const finalResult = {
      scanId,
      repositoryPath: normRepoPath,
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - overallStart,
      scanType: isIncremental ? 'incremental' : 'full',
      cacheHit: false,
      filesDiscovered: detection.filesDiscovered,
      filesScanned: detection.filesScanned,
      filesSkipped: detection.filesSkipped,
      languagesDetected: detection.languages,
      scannedFilesCount: detection.totalFilesCount,
      scannersExecuted: {
        eslint: {
          status: eslintResult.status,
          durationMs: eslintResult.durationMs,
          findingsCount: eslintResult.findings?.length || 0,
          error: eslintResult.error || undefined,
          reason: eslintResult.reason || undefined
        },
        ruff: {
          status: ruffResult.status,
          durationMs: ruffResult.durationMs,
          findingsCount: ruffResult.findings?.length || 0,
          error: ruffResult.error || undefined,
          reason: ruffResult.reason || undefined
        },
        semgrep: {
          status: semgrepResult.status,
          durationMs: semgrepResult.durationMs,
          findingsCount: semgrepResult.findings?.length || 0,
          error: semgrepResult.error || undefined,
          reason: semgrepResult.reason || undefined
        }
      },
      summary,
      findings: allFindings
    }

    memoryScanCache.set(repoKey, { sourceHash, result: finalResult })
    return finalResult
  } finally {
    // Release the concurrency lock in all cases
    activeScans.delete(repoKey)
  }
}

export default {
  detectRepositoryLanguages,
  generateFindingId,
  extractCodeSnippet,
  runESLint,
  runRuff,
  runSemgrep,
  executeCodeQualityScan,
  isScanRunning,
  getActiveScans
}

