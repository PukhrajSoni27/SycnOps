import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider, githubProvider } from '../lib/firebase'
import { loginUser, socialLogin } from '../services/api'
import NeuronCanvas from '../components/NeuronCanvas'
import Plasma from '../components/Plasma'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      const displayName = user.displayName || (user.email ? user.email.split('@')[0] : '')

      const res = await socialLogin({
        provider: 'google',
        email: user.email!,
        name: displayName || undefined
      })

      if (res.token) {
        localStorage.setItem('sycnops_token', res.token)
        localStorage.setItem('sycnops_user', JSON.stringify(res.user))
        window.dispatchEvent(new Event('sycnops_user_updated'))
      }
      navigate('/dashboard')
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        const raw = err.message || ''
        const clean = (raw.includes('NetworkError') || raw.includes('fetch'))
          ? 'Unable to connect to backend server.'
          : raw || 'Failed to authenticate with Google.'
        setError(clean)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, githubProvider)
      const user = result.user

      const res = await socialLogin({
        provider: 'github',
        email: user.email!,
        name: user.displayName || undefined
      })

      if (res.token) {
        localStorage.setItem('sycnops_token', res.token)
        localStorage.setItem('sycnops_user', JSON.stringify(res.user))
        window.dispatchEvent(new Event('sycnops_user_updated'))
      }
      navigate('/dashboard')
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        const raw = err.message || ''
        const clean = (raw.includes('NetworkError') || raw.includes('fetch'))
          ? 'Unable to connect to backend server.'
          : raw || 'Failed to authenticate with GitHub.'
        setError(clean)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await loginUser({ email, password })
      if (res.token) {
        localStorage.setItem('sycnops_token', res.token)
        localStorage.setItem('sycnops_user', JSON.stringify(res.user))
        window.dispatchEvent(new Event('sycnops_user_updated'))
      }
      navigate('/dashboard')
    } catch (err: any) {
      const raw = err.message || ''
      const clean = (raw.includes('NetworkError') || raw.includes('fetch'))
        ? 'Unable to connect to authentication server.'
        : raw || 'Authentication failed. Please check your email and password.'
      setError(clean)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="s-auth">

      {/* Brand Panel */}
      <div className="s-auth__brand">
        <Link to="/" className="s-nav__logo" style={{ color: 'var(--ground)' }}>
          SycnOps<span className="s-nav__logo-period">.</span>
        </Link>
        <div>
          <h1 className="s-auth__title">
            Enter the <br />
            <span className="s-auth__title-em">studio</span>
          </h1>
          <p className="s-auth__prose">
            Authenticate to access your automated architectures and client portal.
          </p>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(231,227,218,0.5)' }}>
          SECURE PROTOCOL / 2026
        </div>
      </div>

      {/* Auth Panel */}
      <div className="s-auth__panel">
        <Plasma color="#ff6b35" speed={0.6} direction="forward" scale={1.1} opacity={0.85} mouseInteractive={true} />
        <div className="s-auth__box">
          <div style={{ marginBottom: '24px' }}>
            <span className="s-overline">Authorization</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', letterSpacing: '-.015em', color: 'var(--ink)' }}>Sign In</h2>
          </div>

          {/* Social Auth Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={loading}
              style={{
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
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--ink-2)')}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--hair)')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={loading}
              style={{
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
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--ink-2)')}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--hair)')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--hair)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--hair)' }} />
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(217, 83, 79, 0.1)',
              border: '1px solid rgba(217, 83, 79, 0.4)',
              color: '#d9534f',
              padding: '12px 16px',
              borderRadius: '4px',
              marginBottom: '24px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="s-form">
            <div className="s-form__group">
              <label className="s-form__label">Email Address</label>
              <input
                type="email"
                className="s-form__input"
                placeholder="architect@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="s-form__group">
              <label className="s-form__label">Password</label>
              <input
                type="password"
                className="s-form__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="s-btn"
              style={{ marginTop: '16px', width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>

          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--hair)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-2)' }}>
            No existing credentials? <Link to="/register" style={{ color: 'var(--pigment)', textDecoration: 'none', fontWeight: 600 }}>Request Access</Link>
          </div>
        </div>
      </div>

    </div>
  )
}
