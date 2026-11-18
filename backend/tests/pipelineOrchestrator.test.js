/**
 * pipelineOrchestrator.test.js
 * 
 * Security and functionality test suite for SyncOps pipeline execution engine.
 * Tests:
 *  1. Legitimate scanner and CLI execution (node, git, npm)
 *  2. Unapproved executables rejection (strict allowlist)
 *  3. Shell injection payloads neutralization (shell: false)
 *  4. Path traversal defense (workspace boundaries enforcement)
 *  5. Invalid argument handling (types, null bytes, control newlines, count limits)
 *  6. Process timeout protection
 *  7. Process cleanup and cancellation lifecycle tracking
 *  8. Sensitive credential masking in logs
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  runCommand,
  validateWorkingDirectory,
  validateArguments,
  validateExecutablePolicy,
  sanitizeEnvironment,
  isTrustedRepository,
  isIsolationAvailable,
  maskSensitiveData,
  ALLOWED_EXECUTABLES,
  activeProcesses,
  cancelPipeline,
  createPipelineExecutionRecord,
  executePipeline
} from '../lib/pipelineOrchestrator.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const frontendDir = path.resolve(rootDir, 'frontend')
const backendDir = path.resolve(rootDir, 'backend')

// ── 1. Legitimate Scanner Execution ──────────────────────────────────────────

test('1. Legitimate execution: approved node binary executes and streams output', async () => {
  const logs = []
  const result = await runCommand(
    'node',
    ['-e', 'console.log("SyncOps pipeline engine active")'],
    backendDir,
    'test_legit_node',
    (line) => logs.push(line)
  )

  assert.equal(result.success, true)
  assert.equal(result.exitCode, 0)
  assert.equal(typeof result.duration, 'string')
  assert.ok(logs.some((l) => l.includes('SyncOps pipeline engine active')), 'Output was captured')
})

test('1b. Legitimate execution: approved git CLI returns version', async () => {
  const logs = []
  const result = await runCommand(
    'git',
    ['--version'],
    rootDir,
    'test_legit_git',
    (line) => logs.push(line)
  )

  assert.equal(result.success, true)
  assert.equal(result.exitCode, 0)
  assert.ok(logs.some((l) => l.toLowerCase().includes('git version')), 'Git version output was captured')
})

test('1c. Legitimate execution: approved npm launcher returns version', async () => {
  const logs = []
  const result = await runCommand(
    'npm',
    ['--version'],
    frontendDir,
    'test_legit_npm',
    (line) => logs.push(line)
  )

  assert.equal(result.success, true)
  assert.equal(result.exitCode, 0)
  assert.ok(logs.some((l) => /^\d+\.\d+\.\d+/.test(l.trim())), 'npm version number was captured')
})

// ── 2. Unapproved Executables Rejection ──────────────────────────────────────

test('2. Strict allowlist: unapproved executables are rejected immediately', async () => {
  const unapproved = ['bash', 'sh', 'cmd', 'powershell', 'curl', 'wget', 'calc.exe', '/bin/sh']

  for (const exe of unapproved) {
    const logs = []
    const result = await runCommand(
      exe,
      ['--help'],
      backendDir,
      'test_unapproved_' + exe.replace(/[^a-z]/g, ''),
      (line) => logs.push(line)
    )

    assert.equal(result.success, false)
    assert.equal(result.exitCode, 1)
    assert.ok(result.error.includes('SecurityError: Unapproved executable identifier'), `Expected rejection for: ${exe}`)
    assert.equal(activeProcesses.has('test_unapproved_' + exe), false)
  }
})

// ── 3. Shell Injection Payloads Neutralization ───────────────────────────────

test('3. Shell injection in executable identifier is blocked', async () => {
  const injectionPayloads = [
    'npm; rm -rf /',
    'node && dir',
    'git | whoami',
    '`calc.exe`',
    '$(whoami)',
    'node\nwhoami'
  ]

  for (const payload of injectionPayloads) {
    const result = await runCommand(
      payload,
      ['-v'],
      backendDir,
      'test_inject_exe',
      () => {}
    )

    assert.equal(result.success, false)
    assert.ok(result.error.includes('SecurityError: Unapproved executable identifier'))
  }
})

test('3b. Shell injection in arguments is passed harmlessly as literal string without shell evaluation', async () => {
  const logs = []
  // Without shell, passing '; echo INJECTED' as an argument to node evaluates only the script
  const result = await runCommand(
    'node',
    ['-e', 'console.log("ARG_COUNT=" + process.argv.slice(1).length)', '; echo INJECTED'],
    backendDir,
    'test_inject_args',
    (line) => logs.push(line)
  )

  assert.equal(result.success, true)
  assert.equal(result.exitCode, 0)
  // The injection payload was received as a harmless literal argument (argv[1]), never executed as a shell command
  assert.ok(logs.some((l) => l.includes('ARG_COUNT=1')), 'Passed as literal argument vector element')
  assert.ok(!logs.some((l) => l === 'INJECTED'), 'Shell command was NOT executed')
})

// ── 4. Path Traversal Defense ────────────────────────────────────────────────

test('4. Path traversal: directory traversal sequences (..) are rejected', () => {
  assert.throws(
    () => validateWorkingDirectory('../../Windows/System32'),
    /Path traversal detected/
  )
  assert.throws(
    () => validateWorkingDirectory('frontend/../../../etc'),
    /Path traversal detected/
  )
})

test('4b. Path traversal: paths outside authorized workspace roots are rejected', () => {
  // Pass an existing system directory outside the repository
  const systemDir = process.platform === 'win32' ? 'C:\\Windows' : '/etc'
  assert.throws(
    () => validateWorkingDirectory(systemDir),
    /Path traversal detected/
  )
})

test('4c. Path traversal: non-existent directories are rejected', () => {
  assert.throws(
    () => validateWorkingDirectory(path.join(rootDir, 'non_existent_folder_xyz_123')),
    /Working directory does not exist/
  )
})

test('4d. Path traversal: authorized workspaces are accepted and normalized', () => {
  const resolvedRoot = validateWorkingDirectory(rootDir)
  assert.equal(resolvedRoot, path.resolve(rootDir))

  const resolvedFrontend = validateWorkingDirectory(frontendDir)
  assert.equal(resolvedFrontend, path.resolve(frontendDir))

  const resolvedBackend = validateWorkingDirectory(backendDir)
  assert.equal(resolvedBackend, path.resolve(backendDir))
})

// ── 5. Invalid Argument Handling ─────────────────────────────────────────────

test('5. Invalid arguments: non-array arguments throw TypeError', () => {
  assert.throws(
    () => validateArguments('not an array'),
    /Command arguments must be an array of strings/
  )
})

test('5b. Invalid arguments: null bytes throw security error', () => {
  assert.throws(
    () => validateArguments(['run', 'lint\0malicious']),
    /contains null byte/
  )
})

test('5c. Invalid arguments: control newlines throw security error', () => {
  assert.throws(
    () => validateArguments(['run', 'lint\nevil']),
    /contains control newline characters/
  )
  assert.throws(
    () => validateArguments(['run', 'lint\revil']),
    /contains control newline characters/
  )
})

test('5d. Invalid arguments: non-string element throws TypeError', () => {
  assert.throws(
    () => validateArguments(['run', 42]),
    /Invalid argument type at index 1: expected string, got number/
  )
})

// ── 6. Process Timeout Protection ────────────────────────────────────────────

test('6. Process timeout: runaway process is terminated when timeout exceeded', async () => {
  const logs = []
  // Process that would sleep for 30 seconds
  const result = await runCommand(
    'node',
    ['-e', 'setTimeout(() => { console.log("awake"); }, 30000)'],
    backendDir,
    'test_timeout_pipe',
    (line) => logs.push(line),
    { timeoutMs: 500 } // Short 500ms timeout
  )

  assert.equal(result.success, false)
  assert.equal(result.exitCode, 124) // Standard timeout exit code
  assert.ok(result.error.includes('Process timed out'), 'Error reports timeout')
  assert.ok(logs.some((l) => l.includes('timed out after 0.5s')), 'Timeout was logged')
  assert.equal(activeProcesses.has('test_timeout_pipe'), false, 'Process cleaned up from active map')
})

// ── 7. Process Cleanup and Lifecycle Tracking ─────────────────────────────────

test('7. Process cleanup: failed process cleans up active map entry', async () => {
  const pipeId = 'test_cleanup_failure'
  const result = await runCommand(
    'node',
    ['-e', 'process.exit(42)'],
    backendDir,
    pipeId,
    () => {}
  )

  assert.equal(result.success, false)
  assert.equal(result.exitCode, 42)
  assert.equal(activeProcesses.has(pipeId), false, 'Child process removed from tracking map')
})

test('7b. Process cancellation: cancelPipeline terminates child process and updates record', async () => {
  const pipeline = createPipelineExecutionRecord({
    repo: 'test-repo',
    workflow: 'cancellation-test'
  })

  // Start a background process
  const runPromise = runCommand(
    'node',
    ['-e', 'setTimeout(() => {}, 20000)'],
    backendDir,
    pipeline.id,
    () => {}
  )

  // Allow process to spawn
  await new Promise((r) => setTimeout(r, 200))
  assert.equal(activeProcesses.has(pipeline.id), true, 'Process is tracked while running')

  // Cancel pipeline
  await cancelPipeline(pipeline)

  assert.equal(pipeline.status, 'failed')
  assert.ok(pipeline.duration.includes('cancelled'))
  assert.equal(activeProcesses.has(pipeline.id), false, 'Process was deleted from active map')

  // Await original promise
  const result = await runPromise
  assert.equal(result.success, false)
})

// ── 8. Sensitive Credential Masking in Logs ──────────────────────────────────

test('8. Sensitive credential masking: tokens and passwords are redacted', () => {
  const dummyGhToken = ['ghp', '_', 'TESTTOKEN1234567890abcdef1234567890'].join('')
  const masked1 = maskSensitiveData(`--token=${dummyGhToken}`)
  assert.ok(!masked1.includes(dummyGhToken), 'GitHub PAT redacted')
  assert.ok(masked1.includes('***REDACTED***'))

  const dummyApiKey = ['AIza', 'SyTESTKEY1234567890abcdef1234567890'].join('')
  const masked2 = maskSensitiveData(`API_KEY=${dummyApiKey}`)
  assert.ok(!masked2.includes(dummyApiKey), 'Firebase key redacted')
  assert.ok(masked2.includes('***REDACTED***'))

  const masked3 = maskSensitiveData('Authorization: Bearer my-secret-jwt-token-string')
  assert.ok(!masked3.includes('my-secret-jwt-token-string'), 'Bearer token redacted')
  assert.ok(masked3.includes('***REDACTED***'))

  const masked4 = maskSensitiveData('--password=SuperSecretPassword123!')
  assert.ok(!masked4.includes('SuperSecretPassword123!'), 'Password redacted')
  assert.ok(masked4.includes('***REDACTED***'))
})

// ── 9. Untrusted Repository Scripts & Isolation Enforcement ──────────────────

test('9. Untrusted repository detection: external repos and repos_cache are marked untrusted', () => {
  assert.equal(isTrustedRepository({ repository: 'sycnops' }, frontendDir), true)
  assert.equal(isTrustedRepository({ repository: 'Estate-Luxe', isExternal: true }, frontendDir), false)
  assert.equal(isTrustedRepository({ repository: 'untrusted-user-repo' }, path.join(backendDir, '.repos_cache', 'evil-repo')), false)
})

test('9b. Untrusted repository scripts: npm run scripts disabled on host without container sandbox', async () => {
  const result = await runCommand(
    'npm',
    ['run', 'lint'],
    frontendDir,
    'test_untrusted_npm',
    () => {},
    { untrusted: true } // simulate untrusted target
  )

  assert.equal(result.success, false)
  assert.equal(result.exitCode, 126)
  assert.ok(result.error.includes('Execution of untrusted package.json scripts is disabled on the host'))
})

test('9c. Pipeline orchestrator skips script stages for untrusted repository when isolation unavailable', async () => {
  const pipeline = createPipelineExecutionRecord({
    repo: 'untrusted-attacker-repo',
    workflow: 'security-audit-test'
  })
  pipeline.isExternal = true // Untrusted external repo

  const updatedPipeline = await executePipeline(pipeline)

  const lintStage = updatedPipeline.stages.find((s) => s.id === 'stg_3')
  const testStage = updatedPipeline.stages.find((s) => s.id === 'stg_4')
  const buildStage = updatedPipeline.stages.find((s) => s.id === 'stg_5')

  assert.equal(lintStage.status, 'skipped')
  assert.ok(lintStage.logs.some((l) => l.includes('Untrusted repository detected')))

  assert.equal(testStage.status, 'skipped')
  assert.equal(buildStage.status, 'skipped')
})

// ── 10. Executable-Specific Argument Policy Enforcement ───────────────────────

test('10. npm policy: dangerous flags like --script-shell and --node-options are prohibited', () => {
  assert.throws(
    () => validateExecutablePolicy('npm', ['run', 'lint', '--script-shell=/bin/sh']),
    /Prohibited npm flag/
  )
  assert.throws(
    () => validateExecutablePolicy('npm', ['run', 'lint', '--node-options=--inspect']),
    /Prohibited npm flag/
  )
  assert.throws(
    () => validateExecutablePolicy('npm', ['publish']),
    /Prohibited npm subcommand/
  )
  assert.throws(
    () => validateExecutablePolicy('npm', ['run', 'evil;whoami']),
    /Invalid or prohibited npm script identifier/
  )
})

test('10b. npx policy: unapproved tools and shell flags are prohibited', () => {
  assert.throws(
    () => validateExecutablePolicy('npx', ['malicious-package']),
    /Prohibited npx tool invocation/
  )
  assert.throws(
    () => validateExecutablePolicy('npx', ['--shell', 'eslint']),
    /Prohibited npx argument/
  )
  // Approved tools pass
  assert.equal(validateExecutablePolicy('npx', ['eslint', 'src/']), true)
  assert.equal(validateExecutablePolicy('npx', ['vitest', 'run']), true)
})

test('10c. node policy: dangerous flags like --inspect, -r, --loader are prohibited', () => {
  assert.throws(
    () => validateExecutablePolicy('node', ['--inspect']),
    /Prohibited node option/
  )
  assert.throws(
    () => validateExecutablePolicy('node', ['--require=evil.js', 'script.js']),
    /Prohibited node option/
  )
  assert.throws(
    () => validateExecutablePolicy('node', ['-e', 'process.exit(0)'], { allowInlineEval: false }),
    /Arbitrary node code evaluation \(-e\/--eval\) is prohibited/
  )
})

test('10d. git policy: dangerous flags (-c, --upload-pack) and arbitrary subcommands are prohibited', () => {
  assert.throws(
    () => validateExecutablePolicy('git', ['-c', 'core.fsmonitor=calc.exe', 'status']),
    /Prohibited git option/
  )
  assert.throws(
    () => validateExecutablePolicy('git', ['--upload-pack=evil.sh', 'fetch']),
    /Prohibited git option/
  )
  assert.throws(
    () => validateExecutablePolicy('git', ['config', '--global', 'user.name', 'evil']),
    /Prohibited git subcommand/
  )
  assert.throws(
    () => validateExecutablePolicy('git', ['hook', 'run']),
    /Prohibited git subcommand/
  )
  // Approved subcommands pass
  assert.equal(validateExecutablePolicy('git', ['status']), true)
  assert.equal(validateExecutablePolicy('git', ['branch']), true)
  assert.equal(validateExecutablePolicy('git', ['log', '-n', '1']), true)
})

// ── 11. Environment Variable Sanitization & Credential Protection ────────────

test('11. Environment sanitization: NODE_OPTIONS, credentials, and Git injection vectors are stripped', () => {
  const dummyGh = ['ghp', '_', 'ENVTEST123456789012345678901234567890'].join('')
  const customEnv = {
    NODE_OPTIONS: '--require malicious.js',
    LD_PRELOAD: '/tmp/evil.so',
    GIT_SSH_COMMAND: 'malicious_ssh',
    GITHUB_TOKEN: dummyGh,
    VITE_FIREBASE_API_KEY: 'secret_key_value',
    JWT_SECRET: 'super_secret_jwt',
    SAFE_VAR: 'hello_world'
  }

  const clean = sanitizeEnvironment(customEnv)

  // Verify dangerous variables stripped
  assert.equal(clean.NODE_OPTIONS, undefined, 'NODE_OPTIONS must be stripped')
  assert.equal(clean.LD_PRELOAD, undefined, 'LD_PRELOAD must be stripped')
  assert.equal(clean.GIT_SSH_COMMAND, undefined, 'GIT_SSH_COMMAND must be stripped')
  assert.equal(clean.GITHUB_TOKEN, undefined, 'GITHUB_TOKEN must be stripped')
  assert.equal(clean.VITE_FIREBASE_API_KEY, undefined, 'VITE_FIREBASE_API_KEY must be stripped')
  assert.equal(clean.JWT_SECRET, undefined, 'JWT_SECRET must be stripped')

  // Verify safe variable preserved
  assert.equal(clean.SAFE_VAR, 'hello_world')
})

test('11b. Environment sanitization: relative paths and empty entries are stripped from PATH', () => {
  const customPath = ['.', '..', path.resolve(backendDir), ''].join(path.delimiter)
  const clean = sanitizeEnvironment({ PATH: customPath })

  const segments = clean.PATH.split(path.delimiter)
  assert.ok(!segments.includes('.'), 'Relative dot path stripped')
  assert.ok(!segments.includes('..'), 'Relative dot-dot path stripped')
  assert.ok(!segments.includes(''), 'Empty segment stripped')
  assert.ok(segments.includes(path.resolve(backendDir)), 'Absolute valid path preserved')
})

// ── 12. Timeout Escalation with Process Ignoring SIGTERM ─────────────────────

test('12. Timeout escalation: child process that ignores SIGTERM is forcefully terminated via SIGKILL', async () => {
  const logs = []
  // Script that catches SIGTERM and deliberately ignores it
  const ignoreSigtermScript = [
    'process.on("SIGTERM", () => { console.log("SIGTERM_IGNORED"); });',
    'setInterval(() => {}, 1000);'
  ].join(' ')

  const pipeId = 'test_sigterm_ignore_' + Date.now()
  const result = await runCommand(
    'node',
    ['-e', ignoreSigtermScript],
    backendDir,
    pipeId,
    (line) => logs.push(line),
    {
      timeoutMs: 300,      // Trigger timeout quickly
      gracePeriodMs: 400   // Short grace period before SIGKILL escalation
    }
  )

  assert.equal(result.success, false)
  assert.equal(result.exitCode, 124, 'Exited with timeout status 124')
  assert.ok(result.error.includes('Process timed out'), 'Reported process timeout')
  assert.equal(activeProcesses.has(pipeId), false, 'Removed from active process registry')
})
