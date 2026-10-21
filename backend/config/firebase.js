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
import { readFileSync } from 'fs'

let _db = null

export function initFirebase() {
  // Avoid re-initializing if already initialized
  if (getApps().length > 0) {
    _db = getFirestore()
    return _db
  }

  // Option 1: Use a service account JSON file path
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH

  // Option 2: Use individual environment variables (inline credentials)
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  try {
    if (serviceAccountPath) {
      // Load from JSON file (recommended for production)
      const raw = readFileSync(serviceAccountPath, 'utf8')
      const serviceAccount = JSON.parse(raw)
      initializeApp({ credential: cert(serviceAccount) })
      console.log('✅ Firebase Admin initialized via service account file')
    } else if (projectId && clientEmail && privateKey) {
      // Load from environment variables
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          // Replace escaped newlines from .env files
          privateKey: privateKey.replace(/\\n/g, '\n')
        })
      })
      console.log(`✅ Firebase Admin (Firestore) connected to project: ${projectId}`)
    } else {
      console.warn(
        '⚠️  Firebase Admin credentials not found in backend.env.\n' +
        '   → Option A: Set FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccount.json\n' +
        '   → Option B: Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY\n' +
        '   Get these from: Firebase Console → Project Settings → Service Accounts\n' +
        '   Falling back to in-memory storage.'
      )
      return null
    }

    _db = getFirestore()
    return _db
  } catch (err) {
    console.warn(`⚠️  Firebase Admin init failed: ${err.message}. Using in-memory fallback.`)
    return null
  }
}

export function getDB() {
  return _db
}

export function isFirestoreConnected() {
  return _db !== null
}
