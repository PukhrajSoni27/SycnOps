import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopmentPurposesOnly",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "localhost",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abc123def456",
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || "BC_dummy_vapid_key_for_notifications"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()

// Safe Firebase Messaging Initialization
let messagingInstance: any = null

export const getFirebaseMessaging = async () => {
  if (messagingInstance) return messagingInstance
  try {
    const supported = await isSupported()
    if (supported) {
      messagingInstance = getMessaging(app)
      return messagingInstance
    }
  } catch (err) {
    console.warn('Firebase Messaging not supported in current environment:', err)
  }
  return null
}

// Request Notification Permission and FCM token
export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      return { success: false, message: 'Browser does not support notifications.' }
    }

    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const msg = await getFirebaseMessaging()
      if (msg) {
        try {
          const token = await getToken(msg, { vapidKey: firebaseConfig.vapidKey })
          if (token) {
            localStorage.setItem('fcm_token', token)
            return { success: true, token, message: 'Push notifications enabled successfully!' }
          }
        } catch (tokenErr) {
          console.warn('FCM token fetch warning:', tokenErr)
        }
      }
      return { success: true, message: 'Notification permission granted!' }
    } else {
      return { success: false, message: 'Notification permission denied.' }
    }
  } catch (err: any) {
    return { success: false, message: err.message || 'Error requesting notification permission.' }
  }
}

// Listen to foreground FCM messages
export const onForegroundNotification = async (callback: (payload: any) => void) => {
  const msg = await getFirebaseMessaging()
  if (msg) {
    onMessage(msg, (payload) => {
      callback(payload)
    })
  }
}

