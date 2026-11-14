import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import Plasma from '../components/Plasma'
import SocialAuthButtons from '../components/SocialAuthButtons'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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
        navigate('/dashboard')
      } else {
        setError(res.message || 'Sign in failed. Check your credentials.')
      }
    } catch (err: any) {
      setError(err.message || 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="s-auth">
      <div className="s-auth__brand">
        <Link to="/" className="s-nav__logo" style={{ color: 'var(--text)' }}>
          SycnOps<span className="s-nav__logo-period">.</span>
        </Link>
        <div>
          <h1 className="s-auth__title">
            Enter the <br />
            <span className="s-auth__title-em">studio</span>
          </h1>
          <p className="s-auth__prose">Sign in to import GitHub repositories and view live issues, PRs, and commits.</p>
        </div>
      </div>
      <div className="s-auth__panel">
        <Plasma color="#10b981" speed={0.5} direction="forward" scale={1.1} opacity={0.65} mouseInteractive={true} />
        <div className="s-auth__box">
          <div style={{ marginBottom: '24px' }}>
            <span className="s-overline">Sign in</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', letterSpacing: '-.015em', color: 'var(--text)' }}>Welcome back</h2>
          </div>
          <SocialAuthButtons
            loading={loading}
            onStart={() => { setError(''); setLoading(true) }}
            onDone={() => setLoading(false)}
            onError={setError}
            onSuccess={(token, user) => {
              localStorage.setItem('sycnops_token', token)
              localStorage.setItem('sycnops_user', JSON.stringify(user))
              window.dispatchEvent(new Event('sycnops_user_updated'))
              navigate('/dashboard')
            }}
          />
          {error && (
            <div style={{ backgroundColor: 'rgba(217, 83, 79, 0.1)', border: '1px solid rgba(217, 83, 79, 0.4)', color: '#d9534f', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.5' }}>
              <div>{error}</div>
              {error.toLowerCase().includes('popup') && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#A8A29E', borderTop: '1px solid rgba(217, 83, 79, 0.25)', paddingTop: '6px' }}>
                  💡 <strong>Tip:</strong> In Chrome/Edge/Brave, look at the right end of your browser's URL address bar for the <strong>🚫 Pop-up blocked</strong> icon &rarr; click it &rarr; select <em>"Always allow pop-ups and redirects for http://localhost:3000"</em>, or click the green redirect button above.
                </div>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className="s-form">
            <div className="s-form__group">
              <label className="s-form__label">Email</label>
              <input type="email" className="s-form__input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="s-form__group">
              <label className="s-form__label">Password</label>
              <input type="password" className="s-form__input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="s-btn" style={{ marginTop: '16px', width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            No account? <Link to="/register" style={{ color: 'var(--emerald)', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
