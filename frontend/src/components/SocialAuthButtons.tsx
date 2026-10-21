import React from 'react'
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { auth } from '../lib/firebase'
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
  padding: '10px 16px',
  backgroundColor: 'var(--ground)',
  border: '1px solid var(--hair)',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--ink)',
  cursor: 'pointer',
  width: '100%',
  transition: 'background 0.15s',
}

// ── Google Sign-In ──────────────────────────────────────────────────────────
async function firebaseGoogleSignIn() {
  if (!auth) throw new Error('Firebase is not configured. Check your VITE_FIREBASE_* env variables.')
  const provider = new GoogleAuthProvider()
  provider.addScope('email')
  provider.addScope('profile')
  const result = await signInWithPopup(auth, provider)
  const user = result.user
  return {
    email: user.email ?? '',
    name: user.displayName ?? user.email?.split('@')[0] ?? 'User',
  }
}

// ── GitHub Sign-In ──────────────────────────────────────────────────────────
async function firebaseGitHubSignIn() {
  if (!auth) throw new Error('Firebase is not configured. Check your VITE_FIREBASE_* env variables.')
  const provider = new GithubAuthProvider()
  provider.addScope('user:email')
  const result = await signInWithPopup(auth, provider)
  const user = result.user
  // GitHub may return email as null if the user keeps it private — fall back to displayName
  const email = user.email ?? `${user.displayName?.toLowerCase().replace(/\s+/g, '') ?? 'user'}@github.noreply`
  return {
    email,
    name: user.displayName ?? email.split('@')[0],
  }
}

export default function SocialAuthButtons({ loading, onStart, onDone, onError, onSuccess }: Props) {

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    onStart()
    try {
      const userInfo = provider === 'google'
        ? await firebaseGoogleSignIn()
        : await firebaseGitHubSignIn()

      // Exchange Firebase identity for a SycnOps JWT from the backend
      const res = await socialLogin({
        provider,
        email: userInfo.email,
        name: userInfo.name,
      })

      if (res.token) {
        onSuccess(res.token, res.user)
      } else {
        onError(res.message || `${provider} sign-in failed.`)
      }
    } catch (err: any) {
      // Firebase popup-closed-by-user is not really an error
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        onError('')
      } else if (err?.code === 'auth/account-exists-with-different-credential') {
        onError('An account already exists with this email using a different sign-in method.')
      } else if (err?.code === 'auth/popup-blocked') {
        onError('Popup was blocked by your browser. Please allow popups for this site.')
      } else {
        onError(err.message || `Failed to sign in with ${provider}.`)
      }
    } finally {
      onDone()
    }
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {/* Google */}
        <button
          type="button"
          id="btn-google-signin"
          onClick={() => handleSocialAuth('google')}
          disabled={loading}
          style={btnStyle}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ground-2, rgba(0,0,0,0.04))')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--ground)')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        {/* GitHub */}
        <button
          type="button"
          id="btn-github-signin"
          onClick={() => handleSocialAuth('github')}
          disabled={loading}
          style={btnStyle}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ground-2, rgba(0,0,0,0.04))')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--ground)')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          Continue with GitHub
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 24px', gap: '12px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--hair)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          or continue with email
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--hair)' }} />
      </div>
    </>
  )
}
