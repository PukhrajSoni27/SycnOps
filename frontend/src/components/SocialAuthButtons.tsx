import React, { useState, useEffect, useRef } from 'react'
import {
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth'
import {
  auth,
  createGoogleProvider,
  createGitHubProvider,
  isFirebaseConfigured,
  getFirebaseConfigStatus
} from '../lib/firebase'
import { socialLogin } from '../services/api'

type Props = {
  loading: boolean
  onStart: () => void
  onDone: () => void
  onError: (message: string) => void
  onSuccess: (token: string, user: unknown) => void
}

const btnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  padding: '12px 16px',
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  borderRadius: '12px',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--text, #EBEBEB)',
  cursor: 'pointer',
  width: '100%',
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
}

/**
 * Maps Firebase authentication error codes to helpful, user-friendly messages.
 */
function formatAuthError(err: any): string {
  if (!err) return 'Authentication failed.'
  const code = err.code || ''
  const msg = err.message || ''
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'this domain'

  if (msg.includes('NetworkError') || msg.toLowerCase().includes('failed to fetch')) {
    return 'Browser privacy protection or an ad-blocker blocked the Google Auth request. If using Firefox or Brave, click the Shield icon 🛡️ in the address bar to turn off Tracking Protection for localhost, or click "Redirect" mode above, or use Email sign-in below.'
  }

  if (msg.includes('missing initial state') || code === 'auth/missing-initial-state') {
    return 'Browser storage partitioning blocked the OAuth redirect state. Switch to "Popup" mode above to sign in without redirect storage loss.'
  }

  switch (code) {
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups for localhost or use Redirect mode.'
    case 'auth/popup-closed-by-user':
      return ''
    case 'auth/unauthorized-domain':
      return `Domain "${hostname}" is not authorized for OAuth in Firebase. Please add "${hostname}" to Firebase Console → Authentication → Settings → Authorized domains.`
    case 'auth/operation-not-allowed':
      return 'This sign-in provider is disabled in Firebase. Please enable it in Firebase Console → Authentication → Sign-in method.'
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.'
    case 'auth/network-request-failed':
      return 'Network connection error during authentication. Please check your internet connection and try again.'
    case 'auth/user-disabled':
      return 'This user account has been disabled.'
    case 'auth/redirect-cancelled-by-user':
      return ''
    default:
      return msg || 'Social sign-in failed. Please try again.'
  }
}

export default function SocialAuthButtons({ loading, onStart, onDone, onError, onSuccess }: Props) {
  const [activeProvider, setActiveProvider] = useState<'google' | 'github' | null>(null)
  const isHandlingAuthRef = useRef(false)

  // Detect localhost environment: on localhost/127.0.0.1, modern Chromium & WebKit enforce
  // storage partitioning which isolates cross-domain redirect sessionStorage between localhost
  // and *.firebaseapp.com, producing "auth/missing-initial-state".
  // Default to popup on localhost for seamless zero-config developer experience, while offering redirect mode.
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.') ||
    window.location.hostname.startsWith('172.') ||
    window.location.hostname.endsWith('.local')
  )

  // Default to 'popup' to avoid browser storage partitioning (CHIPS) cross-domain redirect failure
  const [authMethod, setAuthMethod] = useState<'popup' | 'redirect'>('popup')
  const popupTimerRef = useRef<any>(null)

  const handleCancel = () => {
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current)
      popupTimerRef.current = null
    }
    onDone()
    setActiveProvider(null)
    sessionStorage.removeItem('sycnops_pending_auth_provider')
    isHandlingAuthRef.current = false
  }

  useEffect(() => {
    return () => {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current)
    }
  }, [])

  // ── Helper to verify ID token on backend and establish SyncOps session ────────
  const exchangeTokenAndLogin = async (user: FirebaseUser, provider: 'google' | 'github') => {
    if (isHandlingAuthRef.current) return
    isHandlingAuthRef.current = true

    try {
      onStart()
      // 1. Obtain cryptographic Firebase ID Token
      const idToken = await user.getIdToken()

      // 2. Exchange ID Token with backend for verified SyncOps session
      const res = await socialLogin({
        provider,
        idToken,
      })

      if (res.token) {
        onSuccess(res.token, res.user)
      } else {
        onError(res.message || `${provider} sign-in failed.`)
      }
    } catch (err: any) {
      console.error('Failed to exchange Firebase token:', err)
      onError(formatAuthError(err))
    } finally {
      onDone()
      setActiveProvider(null)
      sessionStorage.removeItem('sycnops_pending_auth_provider')
      isHandlingAuthRef.current = false
    }
  }

  // ── Handle OAuth Return via getRedirectResult & onAuthStateChanged ──────────
  useEffect(() => {
    if (!auth) {
      if (!isFirebaseConfigured()) {
        const status = getFirebaseConfigStatus()
        console.warn('Firebase configuration incomplete:', status.missingKeys)
      }
      return
    }

    let isMounted = true

    // A. Check getRedirectResult when the page reloads from OAuth redirect
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result?.user || !isMounted) return

        const user = result.user
        const dedupeKey = `sycnops_auth_done_${user.uid}_${user.metadata.lastSignInTime}`
        if (sessionStorage.getItem(dedupeKey)) return
        sessionStorage.setItem(dedupeKey, 'true')

        const providerId = result.providerId || user.providerData?.[0]?.providerId || ''
        const provider: 'google' | 'github' = providerId.includes('github') ? 'github' : 'google'

        await exchangeTokenAndLogin(user, provider)
      })
      .catch((err) => {
        if (!isMounted) return
        sessionStorage.removeItem('sycnops_pending_auth_provider')
        const formatted = formatAuthError(err)
        if (formatted) onError(formatted)
        onDone()
      })

    // B. Handle persistent Firebase state fallback
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !isMounted) return

      const pendingProvider = sessionStorage.getItem('sycnops_pending_auth_provider') as 'google' | 'github' | null
      const existingToken = localStorage.getItem('sycnops_token')

      if (pendingProvider && !existingToken && !isHandlingAuthRef.current) {
        const dedupeKey = `sycnops_auth_done_${user.uid}_${user.metadata.lastSignInTime}`
        if (sessionStorage.getItem(dedupeKey)) return
        sessionStorage.setItem(dedupeKey, 'true')

        await exchangeTokenAndLogin(user, pendingProvider)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  // ── Unified Sign-In: initiates signInWithPopup or signInWithRedirect ────────
  const handleSignIn = async (provider: 'google' | 'github', forceMethod?: 'popup' | 'redirect') => {
    if (!auth) {
      onError('Firebase is not configured. Please verify your VITE_FIREBASE_* environment variables.')
      return
    }

    onError('')
    setActiveProvider(provider)
    onStart()

    const authProvider = provider === 'google'
      ? createGoogleProvider()
      : createGitHubProvider()

    // On localhost or local network IPs, always enforce 'popup' mode.
    // Modern browser storage partitioning isolates sessionStorage between localhost and firebaseapp.com,
    // which causes signInWithRedirect to fail with "missing initial state".
    const method = forceMethod || authMethod

    if (method === 'popup') {
      try {
        if (popupTimerRef.current) clearTimeout(popupTimerRef.current)
        popupTimerRef.current = setTimeout(() => {
          onDone()
          setActiveProvider(null)
          onError('Google sign-in window is taking longer than expected. Check if the popup was opened in the background or blocked by your browser, or switch to "Redirect" mode above.')
        }, 35000)

        const result = await signInWithPopup(auth, authProvider)
        if (popupTimerRef.current) clearTimeout(popupTimerRef.current)
        if (result?.user) {
          await exchangeTokenAndLogin(result.user, provider)
        } else {
          onDone()
          setActiveProvider(null)
        }
      } catch (err: any) {
        if (popupTimerRef.current) clearTimeout(popupTimerRef.current)
        onDone()
        setActiveProvider(null)
        if (err.code === 'auth/popup-closed-by-user') {
          return
        }
        if (err.code === 'auth/popup-blocked') {
          onError('Popup was blocked by your browser. Please allow popups or switch to "Redirect" mode above.')
          return
        }
        onError(formatAuthError(err))
      }
    } else {
      try {
        sessionStorage.setItem('sycnops_pending_auth_provider', provider)
        await signInWithRedirect(auth, authProvider)
      } catch (err: any) {
        sessionStorage.removeItem('sycnops_pending_auth_provider')
        onDone()
        setActiveProvider(null)
        onError(formatAuthError(err))
      }
    }
  }

  const isGoogleLoading = loading && activeProvider === 'google'
  const isGithubLoading = loading && activeProvider === 'github'

  return (
    <>
      {/* OAuth Mode Indicator & Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        padding: '6px 10px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: authMethod === 'popup' ? '#10b981' : '#60a5fa' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: authMethod === 'popup' ? '#10b981' : '#60a5fa' }} />
          <span>OAuth Mode: {authMethod === 'popup' ? 'Popup' : 'Redirect'}</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            type="button"
            onClick={() => setAuthMethod('popup')}
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              borderRadius: '5px',
              border: authMethod === 'popup' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
              background: authMethod === 'popup' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: authMethod === 'popup' ? '#10b981' : 'var(--text-dim, #888)',
              cursor: 'pointer',
              fontWeight: authMethod === 'popup' ? 600 : 400
            }}
          >
            Popup
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('redirect')}
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              borderRadius: '5px',
              border: authMethod === 'redirect' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
              background: authMethod === 'redirect' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: authMethod === 'redirect' ? '#60a5fa' : 'var(--text-dim, #888)',
              cursor: 'pointer',
              fontWeight: authMethod === 'redirect' ? 600 : 400
            }}
          >
            Redirect
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {loading && activeProvider && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: '#93c5fd'
          }}>
            <span>Waiting for {activeProvider === 'google' ? 'Google' : 'GitHub'} window...</span>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '2px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              Cancel
            </button>
          </div>
        )}
        {/* Google */}
        <button
          type="button"
          id="btn-google-signin"
          onClick={() => handleSignIn('google')}
          disabled={loading}
          style={{
            ...btnStyle,
            opacity: loading && !isGoogleLoading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'
            }
          }}
          onMouseLeave={e => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)'
            }
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          {isGoogleLoading
            ? (authMethod === 'redirect' ? 'Redirecting to Google...' : 'Signing in with Google...')
            : 'Continue with Google'}
        </button>

        {/* GitHub */}
        <button
          type="button"
          id="btn-github-signin"
          onClick={() => handleSignIn('github')}
          disabled={loading}
          style={{
            ...btnStyle,
            opacity: loading && !isGithubLoading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'
            }
          }}
          onMouseLeave={e => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)'
            }
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          {isGithubLoading
            ? (authMethod === 'redirect' ? 'Redirecting to GitHub...' : 'Signing in with GitHub...')
            : 'Continue with GitHub'}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 24px', gap: '12px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          or continue with email
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
      </div>
    </>
  )
}
