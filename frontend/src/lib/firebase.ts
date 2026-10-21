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
  type Auth
} from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  )
}

let _app: FirebaseApp | null = null
let _auth: Auth | null = null
let _db: Firestore | null = null

if (isFirebaseConfigured()) {
  // Avoid duplicate initialization in hot-reload environments
  _app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
  _auth = getAuth(_app)
  _db = getFirestore(_app)
  console.log(`🔥 Firebase connected to project: ${firebaseConfig.projectId}`)
} else {
  console.warn(
    '⚠️ Firebase not configured. Add VITE_FIREBASE_* variables to frontend/.env'
  )
}

export const app = _app
export const auth = _auth
export const firestore = _db
export const googleProvider = _auth ? new GoogleAuthProvider() : null
export const githubProvider = _auth ? new GithubAuthProvider() : null
