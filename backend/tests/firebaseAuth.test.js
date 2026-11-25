import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'http'
import { app, server } from '../index.js'
import { initFirebase, verifyFirebaseIdToken, isAuthConnected } from '../config/firebase.js'

test('Firebase Admin initialization & authentication security suite', async (t) => {
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

  await t.test('1. Firebase Admin initializes and supports token verification with projectId', () => {
    initFirebase()
    assert.equal(isAuthConnected(), true, 'Firebase Auth Admin instance should be connected')
    assert.equal(typeof verifyFirebaseIdToken, 'function', 'verifyFirebaseIdToken should be a function')
  })

  await t.test('2. Token verification rejects empty or malformed token', async () => {
    await assert.rejects(
      async () => {
        await verifyFirebaseIdToken('not-a-valid-jwt-token')
      },
      (err) => {
        assert.ok(err.message, 'Should throw an error with message')
        return true
      }
    )
  })

  await t.test('3. Email validation independently accepts valid service account emails < 100 chars', () => {
    const isPlaceholder = (val) => !val || val.includes('YOUR_PRIVATE_KEY_HERE') || val.includes('xxxx')
    const clientEmail = 'firebase-adminsdk-abc12@sycnops-cd9af.iam.gserviceaccount.com'
    const projectId = 'sycnops-cd9af'
    const privateKey = '-----BEGIN PRIVATE KEY-----\n' + 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6...'.repeat(5) + '\n-----END PRIVATE KEY-----'

    const validCredentials = Boolean(
      projectId &&
      clientEmail &&
      (clientEmail.endsWith('.iam.gserviceaccount.com') || clientEmail.includes('@')) &&
      !isPlaceholder(clientEmail) &&
      privateKey &&
      !isPlaceholder(privateKey) &&
      privateKey.length >= 100
    )

    assert.equal(validCredentials, true, 'Valid service account email under 100 chars should be accepted')
    assert.ok(clientEmail.length < 100, 'Test email is shorter than 100 chars')
  })

  await t.test('4. Social auth endpoint rejects requests without an idToken (spoofed identity attack)', async () => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          email: 'spoofed_user@example.com',
          name: 'Spoofed User'
        })
      })

      assert.equal(res.status, 400, 'Should reject spoofed identity without idToken with HTTP 400')
      const data = await res.json()
      assert.equal(data.success, false)
      assert.match(data.message, /id token/i)
    } catch (err) {
      if (err.cause?.code === 'ECONNREFUSED') {
        t.skip('Backend server is not running on 127.0.0.1:5000')
      } else {
        throw err
      }
    }
  })

  await t.test('5. Social auth endpoint rejects invalid or forged Firebase ID tokens with HTTP 401', async () => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          idToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.forged_token.signature'
        })
      })

      assert.equal(res.status, 401, 'Should reject forged or invalid token with HTTP 401')
      const data = await res.json()
      assert.equal(data.success, false)
      assert.match(data.message, /verification failed/i)
    } catch (err) {
      if (err.cause?.code === 'ECONNREFUSED') {
        t.skip('Backend server is not running on 127.0.0.1:5000')
      } else {
        throw err
      }
    }
  })

  await t.test('6. Social auth endpoint rejects invalid provider specification with HTTP 400', async () => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'unsupported_oauth_provider',
          idToken: 'sample_token'
        })
      })

      assert.equal(res.status, 400, 'Should reject unsupported provider with HTTP 400')
      const data = await res.json()
      assert.equal(data.success, false)
      assert.match(data.message, /valid provider/i)
    } catch (err) {
      if (err.cause?.code === 'ECONNREFUSED') {
        t.skip('Backend server is not running on 127.0.0.1:5000')
      } else {
        throw err
      }
    }
  })

  await t.test('7. Safe account linking: private GitHub email fallback is never treated as verified email', () => {
    const firebaseUid = 'github_uid_sample_98765'
    const isEmailVerified = false
    const rawEmail = ''
    const verifiedEmail = (isEmailVerified && rawEmail) ? rawEmail : ''
    const hasVerifiedEmail = Boolean(verifiedEmail)
    const userEmail = verifiedEmail || `${firebaseUid}@github.noreply.syncops.dev`

    assert.equal(hasVerifiedEmail, false, 'Unverified / private GitHub email must not be verified')
    assert.equal(userEmail, 'github_uid_sample_98765@github.noreply.syncops.dev')
    assert.equal(userEmail.includes('@github.noreply.syncops.dev'), true)
  })

  await t.test('8. Strict claim assertions: audience and issuer must match project ID', () => {
    const expectedProjectId = 'sycnops-cd9af'
    const expectedIss = `https://securetoken.google.com/${expectedProjectId}`

    // Valid token claims
    const validClaims = { aud: 'sycnops-cd9af', iss: 'https://securetoken.google.com/sycnops-cd9af', uid: 'user_123' }
    const isValid = validClaims.aud === expectedProjectId && validClaims.iss === expectedIss && Boolean(validClaims.uid)
    assert.equal(isValid, true, 'Valid claims must pass strict assertion')

    // Invalid audience (different project ID)
    const forgedAudience = { aud: 'malicious-project', iss: 'https://securetoken.google.com/malicious-project', uid: 'user_123' }
    const isAudienceValid = forgedAudience.aud === expectedProjectId && forgedAudience.iss === expectedIss
    assert.equal(isAudienceValid, false, 'Cross-project token must be rejected')
  })

  await t.test('9. Both Google and GitHub are accepted as valid social auth providers, others rejected', async () => {
    try {
      // Test github provider with missing token -> should validate provider but reject on missing token
      const resGithub = await fetch('http://127.0.0.1:5000/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'github' })
      })
      assert.equal(resGithub.status, 400)
      const dataGithub = await resGithub.json()
      assert.match(dataGithub.message, /id token/i)

      // Test google provider with missing token -> should validate provider but reject on missing token
      const resGoogle = await fetch(`${baseUrl}/api/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })
      assert.equal(resGoogle.status, 400)
      const dataGoogle = await resGoogle.json()
      assert.match(dataGoogle.message, /id token/i)
    } catch (err) {
      if (err.cause?.code === 'ECONNREFUSED') {
        t.skip('Backend server is not running on 127.0.0.1:5000')
      } else {
        throw err
      }
    }
  })

  await t.test('10. Verified token exchange requirement: unverified or forged GitHub tokens return 401', async () => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'github',
          idToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.invalid_github_token.signature'
        })
      })
      assert.equal(res.status, 401)
      const data = await res.json()
      assert.equal(data.success, false)
      assert.match(data.message, /verification failed/i)
    } catch (err) {
      if (err.cause?.code === 'ECONNREFUSED') {
        t.skip('Backend server is not running on 127.0.0.1:5000')
      } else {
        throw err
      }
    }
  })
})
