/**
 * Firebase Admin SDK initialization for SycnOps backend.
 * Connects to the Firebase project using a service account or
 * environment variable credentials.
 *
 * To get credentials:
 * 1. Go to Firebase Console → Project Settings → Service Accounts
 * 2. Click "Generate new private key" → download the JSON
 * 3. Either set FIREBASE_SERVICE_ACCOUNT_PATH to the JSON file path,
 *    OR copy the three fields into your backend.env as shown below.
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { readFileSync, existsSync } from 'fs'

let _db = null
let _auth = null

export function initFirebase() {
  // Avoid re-initializing if already initialized
  if (getApps().length > 0) {
    try {
      _db = getFirestore()
    } catch {
      _db = null
    }
    try {
      _auth = getAuth()
    } catch {
      _auth = null
    }
    return { db: _db, auth: _auth }
  }

  // Option 1: Use a service account JSON file path
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH

  // Option 2: Use individual environment variables (inline credentials)
  const projectId = process.env.FIREBASE_PROJECT_ID || 'sycnops-cd9af'
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  const isPlaceholder = (value) =>
    !value ||
    value.includes('YOUR_PRIVATE_KEY_HERE') ||
    value.includes('xxxx')

  const validCredentials = Boolean(
    projectId &&
    clientEmail &&
    (clientEmail.endsWith('.iam.gserviceaccount.com') || clientEmail.includes('@')) &&
    !isPlaceholder(clientEmail) &&
    privateKey &&
    !isPlaceholder(privateKey) &&
    privateKey.length >= 100
  )

  try {
    let app = null
    if (serviceAccountPath && existsSync(serviceAccountPath)) {
      // Load from JSON file (recommended for production)
      const raw = readFileSync(serviceAccountPath, 'utf8')
      const serviceAccount = JSON.parse(raw)
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId
      })
      console.log('✅ Firebase Admin initialized via service account file')
    } else if (validCredentials) {
      // Load from environment variables
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          // Replace escaped newlines from .env files
          privateKey: privateKey.replace(/\\n/g, '\n')
        }),
        projectId
      })
      console.log(`✅ Firebase Admin (Firestore & Auth) connected to project: ${projectId}`)
    } else if (projectId) {
      // Initialize with projectId alone: enables verifyIdToken() against Google's public JWKS certificates
      app = initializeApp({ projectId })
      console.log(`ℹ️  Firebase Admin initialized with project ID (${projectId}) — ID token verification enabled, in-memory DB fallback active.`)
    } else {
      console.log('ℹ️  Firebase project not configured — running in in-memory mode.')
      return null
    }

    // Try connecting Firestore if full credentials available
    if (serviceAccountPath || validCredentials) {
      try {
        _db = getFirestore()
      } catch (dbErr) {
        console.warn('⚠️ Firestore initialization skipped:', dbErr.message)
        _db = null
      }
    } else {
      _db = null
    }

    try {
      _auth = getAuth(app)
    } catch (authErr) {
      console.warn('⚠️ Firebase Auth initialization skipped:', authErr.message)
      _auth = null
    }

    return { db: _db, auth: _auth }
  } catch (err) {
    console.warn(`⚠️  Firebase Admin init failed: ${err.message}. Using in-memory fallback.`)
    return null
  }
}

export function getDB() {
  return _db
}

export function getAdminAuth() {
  return _auth
}

export function isFirestoreConnected() {
  return _db !== null
}

export function isAuthConnected() {
  return _auth !== null
}

/**
 * Verify a Firebase ID token sent from the client.
 * Returns the decoded token containing verified uid, email, and provider.
 */
export async function verifyFirebaseIdToken(idToken) {
  if (!_auth) {
    initFirebase()
  }
  if (!_auth) {
    throw new Error('Firebase Admin Auth is not initialized.')
  }
  return await _auth.verifyIdToken(idToken)
}
