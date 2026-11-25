import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  parseGitHubRepo,
  checkRepoPublic,
  fetchRepoBundle,
  mapRepo
} from '../lib/github.js'

describe('GitHub Public Repository Import & Preview Suite', () => {
  it('1. parseGitHubRepo parses standard URLs, .git URLs, and owner/repo formats', () => {
    const r1 = parseGitHubRepo('https://github.com/PukhrajSoni27/Estate-Luxe.git')
    assert.deepEqual(r1, { owner: 'PukhrajSoni27', repo: 'Estate-Luxe' })

    const r2 = parseGitHubRepo('https://github.com/PukhrajSoni27/Estate-Luxe')
    assert.deepEqual(r2, { owner: 'PukhrajSoni27', repo: 'Estate-Luxe' })

    const r3 = parseGitHubRepo('PukhrajSoni27/Estate-Luxe')
    assert.deepEqual(r3, { owner: 'PukhrajSoni27', repo: 'Estate-Luxe' })

    const r4 = parseGitHubRepo('https://github.com/facebook/react.git/')
    assert.deepEqual(r4, { owner: 'facebook', repo: 'react' })
  })

  it('2. checkRepoPublic confirms Estate-Luxe is a public GitHub repository', async () => {
    const isPublic = await checkRepoPublic('PukhrajSoni27', 'Estate-Luxe')
    assert.equal(isPublic, true)
  })

  it('3. checkRepoPublic returns false for non-existent or inaccessible repository', async () => {
    const isPublic = await checkRepoPublic('PukhrajSoni27', 'definitely-non-existent-repo-999999999')
    assert.equal(isPublic, false)
  })

  it('4. fetchRepoBundle returns public metadata and does not treat public repo as private', async () => {
    const bundle = await fetchRepoBundle('PukhrajSoni27', 'Estate-Luxe.git')
    assert.ok(bundle.meta, 'Should return bundle meta')
    assert.equal(bundle.meta.name, 'Estate-Luxe')
    assert.equal(bundle.meta.visibility, 'public')
    assert.equal(bundle.meta.private, false)

    const mapped = mapRepo(bundle.meta, { visibility: 'public', private: false })
    assert.equal(mapped.visibility, 'public')
    assert.equal(mapped.name, 'Estate-Luxe')
  })
})

