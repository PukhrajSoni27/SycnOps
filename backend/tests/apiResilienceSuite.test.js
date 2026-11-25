/**
 * SyncOps Complete Backend API Resilience & Route Verification Test Suite
 * 
 * Verifies all core API endpoints, authentication boundaries,
 * error handling, response schemas, and database persistence.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { app, workspace } from '../index.js'

test('Backend API Resilience & Route Verification Suite', async (t) => {
  // Spin up ephemeral test server
  const testServer = http.createServer(app)
  await new Promise((resolve) => testServer.listen(0, '127.0.0.1', resolve))
  const port = testServer.address().port
  const baseUrl = `http://127.0.0.1:${port}`

  // Register a live test user via the public endpoint
  const testUserEmail = `resilience_${Date.now()}@syncops.test`
  const registerRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Resilience Test User',
      email: testUserEmail,
      password: 'password123',
      role: 'developer'
    })
  })
  assert.equal(registerRes.status, 201, 'User registration must succeed with 201')
  const registerData = await registerRes.json()
  const testUser = registerData.user
  const testAuthToken = registerData.token
  assert.ok(testAuthToken, 'Must receive auth token')

  // Initialize user's workspace with a test repo
  const ws = workspace(testUser.id)
  const testRepo = {
    id: 'resilience-test-repo-1',
    name: 'campus-lost-found',
    fullName: 'syncops/campus-lost-found',
    description: 'Campus Lost and Found Registry',
    language: 'JavaScript',
    defaultBranch: 'main',
    visibility: 'public',
    stars: 5,
    forks: 1,
    openIssues: 2,
    source: 'manual',
    importedAt: new Date().toISOString()
  }
  ws.repos = [testRepo]

  t.after(() => {
    testServer.close()
  })

  // 1. Health Endpoint
  await t.test('1. GET /api/health returns 200 with online status and service metadata', async () => {
    const res = await fetch(`${baseUrl}/api/health`)
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.status, 'online')
    assert.equal(body.service, 'SycnOps AI Backend')
    assert.ok(body.timestamp)
    assert.ok(body.version)
  })

  // 2. 404 Unknown Route Handling
  await t.test('2. GET /api/unknown-route returns 404 with structured JSON error', async () => {
    const res = await fetch(`${baseUrl}/api/unknown-endpoint-404`)
    assert.equal(res.status, 404)
    const body = await res.json()
    assert.equal(body.success, false)
    assert.match(body.message, /Route not found/i)
  })

  // 3. Auth Rejection: Missing Token
  await t.test('3. GET /api/auth/me rejects unauthenticated request with 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`)
    assert.equal(res.status, 401)
    const body = await res.json()
    assert.equal(body.success, false)
  })

  // 4. Auth Rejection: Forged Token
  await t.test('4. GET /api/auth/me rejects forged/invalid JWT with 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: 'Bearer invalid.forged.jwt.token' }
    })
    assert.equal(res.status, 401)
  })

  // 5. Authorized Auth: GET /api/auth/me
  await t.test('5. GET /api/auth/me returns user profile for valid Bearer token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.equal(body.user.id, testUser.id)
    assert.equal(body.user.email, testUserEmail)
  })

  // 6. Profile Update: PUT /api/auth/me
  await t.test('6. PUT /api/auth/me updates user profile and persists changes', async () => {
    const updatedName = 'Updated Resilience User Name'
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testAuthToken}`
      },
      body: JSON.stringify({ name: updatedName })
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.equal(body.user.name, updatedName)

    // Verify persistence
    const recheck = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    const recheckBody = await recheck.json()
    assert.equal(recheckBody.user.name, updatedName)
  })

  // 7. Dashboard Endpoint
  await t.test('7. GET /api/dashboard returns 200 with dashboard summary data', async () => {
    const res = await fetch(`${baseUrl}/api/dashboard`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(body.data !== undefined)
  })

  // 8. Repositories List
  await t.test('8. GET /api/repositories returns 200 with repository list', async () => {
    const res = await fetch(`${baseUrl}/api/repositories`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(Array.isArray(body.data), 'data must be an array')
    assert.equal(body.count, 1)
    assert.equal(body.data[0].id, 'resilience-test-repo-1')
  })

  // 9. Repository Details 404 for Unknown ID
  await t.test('9. GET /api/repositories/:id/details returns 404 for unknown repository', async () => {
    const res = await fetch(`${baseUrl}/api/repositories/non-existent-repo-99999/details`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 404)
    const body = await res.json()
    assert.equal(body.success, false)
  })

  // 10. Pull Requests List
  await t.test('10. GET /api/pull-requests returns 200 with PR array', async () => {
    const res = await fetch(`${baseUrl}/api/pull-requests`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(Array.isArray(body.data), 'Pull requests data must be an array')
  })

  // 11. Issues List
  await t.test('11. GET /api/issues returns 200 with issues array', async () => {
    const res = await fetch(`${baseUrl}/api/issues`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(Array.isArray(body.data), 'Issues data must be an array')
  })

  // 12. Analytics Endpoint
  await t.test('12. GET /api/analytics returns 200 with metrics and activity series', async () => {
    const res = await fetch(`${baseUrl}/api/analytics`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(body.data !== undefined)
  })

  // 13. Pipelines List
  await t.test('13. GET /api/pipelines returns 200 with pipelines list', async () => {
    const res = await fetch(`${baseUrl}/api/pipelines`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(Array.isArray(body.data), 'Pipelines data must be an array')
  })

  // 14. Repo Analysis Pipeline Status
  await t.test('14. GET /api/pipeline/repo-analysis returns 200 with stages and metrics', async () => {
    const res = await fetch(`${baseUrl}/api/pipeline/repo-analysis?repoId=resilience-test-repo-1`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(Array.isArray(body.data.stages))
  })

  // 15. Repo Analysis Pipeline Run Trigger
  await t.test('15. POST /api/pipeline/repo-analysis/run executes 7-stage analysis pipeline', async () => {
    const res = await fetch(`${baseUrl}/api/pipeline/repo-analysis/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testAuthToken}`
      },
      body: JSON.stringify({ repoId: 'resilience-test-repo-1' })
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(Array.isArray(body.data.stages))
  })

  // 16. File Flow Graph
  await t.test('16. GET /api/file-flow/graph returns dependency nodes and edges', async () => {
    const res = await fetch(`${baseUrl}/api/file-flow/graph?projectId=sycnops`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(body.data.nodes)
    assert.ok(body.data.edges)
  })

  // 17. File Flow Scan
  await t.test('17. POST /api/file-flow/scan runs file dependency discovery', async () => {
    const res = await fetch(`${baseUrl}/api/file-flow/scan?projectId=sycnops`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(body.data)
  })

  // 18. File Flow Files List
  await t.test('18. GET /api/file-flow/files returns discovered files list', async () => {
    const res = await fetch(`${baseUrl}/api/file-flow/files?projectId=sycnops`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(Array.isArray(body.data))
  })

  // 19. Projects Topology
  await t.test('19. GET /api/projects/:projectId/topology returns hierarchy tree and breakdown', async () => {
    const res = await fetch(`${baseUrl}/api/projects/sycnops/topology`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(body.data.tree)
    assert.ok(body.data.summary)
  })

  // 20. Code Quality Status
  await t.test('20. GET /api/repositories/:id/code-quality/status returns active scanning status', async () => {
    const res = await fetch(`${baseUrl}/api/repositories/resilience-test-repo-1/code-quality/status`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(['idle', 'running', 'completed'].includes(body.status))
  })

  // 21. Code Quality AI Provider Status
  await t.test('21. GET /api/repositories/:id/code-quality/ai-status reports AI model status', async () => {
    const res = await fetch(`${baseUrl}/api/repositories/resilience-test-repo-1/code-quality/ai-status`, {
      headers: { Authorization: `Bearer ${testAuthToken}` }
    })
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.success, true)
    assert.ok(body.data.provider)
    assert.equal(typeof body.data.available, 'boolean')
  })

  // 22. AI Fix Generation for Unknown Finding
  await t.test('22. POST /api/repositories/:id/code-quality/findings/:findingId/generate-fix rejects unknown finding', async () => {
    const res = await fetch(`${baseUrl}/api/repositories/resilience-test-repo-1/code-quality/findings/non-existent-finding-1234/generate-fix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testAuthToken}`
      },
      body: JSON.stringify({})
    })
    assert.ok(res.status === 404 || res.status === 400)
    const body = await res.json()
    assert.equal(body.success, false)
  })

  // 23. PR Creation Validation
  await t.test('23. POST /api/repositories/:id/pull-requests/prepare validates request body parameters', async () => {
    const res = await fetch(`${baseUrl}/api/repositories/resilience-test-repo-1/pull-requests/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testAuthToken}`
      },
      body: JSON.stringify({}) // Missing patchIds / branch
    })
    assert.ok(res.status === 400 || res.status === 422)
    const body = await res.json()
    assert.equal(body.success, false)
  })
})
