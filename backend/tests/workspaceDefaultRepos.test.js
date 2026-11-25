/**
 * Verifies that new users (local registration or social auth workspaces)
 * start with 0 connected repositories, never receive hardcoded demo repos,
 * and deleted repositories remain absent across reloads.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { app, server, workspace } from '../index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const USERS_CACHE_FILE = path.resolve(__dirname, '../.users_cache.json')
const WORKSPACE_CACHE_FILE = path.resolve(__dirname, '../.workspace_cache.json')

test('Empty default workspace & persistent repository deletion suite', async (t) => {
  const prevUsersCache = fs.existsSync(USERS_CACHE_FILE) ? fs.readFileSync(USERS_CACHE_FILE, 'utf8') : null
  const prevWorkspaceCache = fs.existsSync(WORKSPACE_CACHE_FILE) ? fs.readFileSync(WORKSPACE_CACHE_FILE, 'utf8') : null

  const testServer = http.createServer(app)
  await new Promise((resolve) => testServer.listen(0, '127.0.0.1', resolve))
  const port = testServer.address().port
  const baseUrl = `http://127.0.0.1:${port}`

  t.after(() => {
    testServer.close()
    if (server && server.listening) {
      server.close()
    }
    if (prevUsersCache !== null) fs.writeFileSync(USERS_CACHE_FILE, prevUsersCache, 'utf8')
    if (prevWorkspaceCache !== null) fs.writeFileSync(WORKSPACE_CACHE_FILE, prevWorkspaceCache, 'utf8')
  })

  // 1. New registered account starts with 0 repositories
  const email = `empty_ws_${Date.now()}@syncops.test`
  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Empty Workspace Tester',
      email,
      password: 'password123'
    })
  })
  assert.equal(regRes.status, 201)
  const regData = await regRes.json()
  const token = regData.token
  assert.ok(token)

  const reposRes = await fetch(`${baseUrl}/api/repositories`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  assert.equal(reposRes.status, 200)
  const reposData = await reposRes.json()
  assert.equal(reposData.count, 0)
  assert.deepEqual(reposData.data, [])

  // 2. Social-style workspace ID also starts with 0 repositories and 0 pipelines
  const socialWs = workspace(`usr_social_test_${Date.now()}`)
  assert.deepEqual(socialWs.repos, [])
  assert.deepEqual(socialWs.pipelines, [])

  // 3. Importing a custom repo, removing it, and re-fetching stays empty
  const importRes = await fetch(`${baseUrl}/api/repositories/import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name: 'my-custom-repo', language: 'TypeScript', visibility: 'public' })
  })
  assert.equal(importRes.status, 201)
  const importData = await importRes.json()
  const createdId = importData.data?.id
  assert.ok(createdId)

  const delRes = await fetch(`${baseUrl}/api/repositories/${createdId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  assert.equal(delRes.status, 200)

  const afterDelRes = await fetch(`${baseUrl}/api/repositories`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  assert.equal(afterDelRes.status, 200)
  const afterDelData = await afterDelRes.json()
  assert.equal(afterDelData.count, 0)
  assert.deepEqual(afterDelData.data, [])
})
