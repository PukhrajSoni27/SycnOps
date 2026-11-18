/**
 * Firebase Client SDK initialization for SycnOps frontend.
 * Reads configuration from VITE_ environment variables.
 *
 * Firebase project: sycnops-cd9af
 */
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  type Auth
} from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'sycnops-cd9af.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sycnops-cd9af',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

/**
 * Validates that all required Firebase configuration keys are present.
 */
export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  )
}

/**
 * Returns configuration validation status and details for diagnostics.
 */
export function getFirebaseConfigStatus(): {
  configured: boolean
  missingKeys: string[]
  projectId: string
  authDomain: string
  origin: string
} {
  const missing: string[] = []
  if (!firebaseConfig.apiKey) missing.push('VITE_FIREBASE_API_KEY')
  if (!firebaseConfig.authDomain) missing.push('VITE_FIREBASE_AUTH_DOMAIN')
  if (!firebaseConfig.projectId) missing.push('VITE_FIREBASE_PROJECT_ID')
  if (!firebaseConfig.appId) missing.push('VITE_FIREBASE_APP_ID')

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return {
    configured: missing.length === 0,
    missingKeys: missing,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    origin
  }
}

/**
 * Dynamically resolves the current web origin without hardcoding.
 */
export function getCurrentOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return ''
}

let _app: FirebaseApp | null = null
let _auth: Auth | null = null
let _db: Firestore | null = null

if (isFirebaseConfigured()) {
  // Prevent initializing multiple Firebase app instances across HMR
  _app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
  _auth = getAuth(_app)
  _db = getFirestore(_app)
} else {
  console.warn(
    '⚠️ Firebase not fully configured. Missing keys:',
    getFirebaseConfigStatus().missingKeys.join(', ')
  )
}

// ── Pre-configured OAuth Providers ──────────────────────────────
export function createGoogleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider()
  provider.addScope('email')
  provider.addScope('profile')
  provider.setCustomParameters({ prompt: 'select_account' })
  return provider
}

export function createGitHubProvider(): GithubAuthProvider {
  const provider = new GithubAuthProvider()
  provider.addScope('user:email')
  return provider
}

export const app = _app
export const auth = _auth
export const firestore = _db
export const googleProvider = _auth ? createGoogleProvider() : null
export const githubProvider = _auth ? createGitHubProvider() : null

/**
 * Safely signs out of the Firebase client session if initialized.
 */
export async function signOutFirebase(): Promise<void> {
  if (_auth && _auth.currentUser) {
    try {
      await signOut(_auth)
    } catch (err) {
      console.warn('Firebase signOut error:', err)
    }
  }
}
