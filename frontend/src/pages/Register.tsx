import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'
import SocialAuthButtons from '../components/SocialAuthButtons'

export default function Register() {
  const [name, setName] = useState('')
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
      const res = await registerUser({ name, email, password })
      if (res.token) {
        localStorage.setItem('sycnops_token', res.token)
        localStorage.setItem('sycnops_user', JSON.stringify(res.user))
        window.dispatchEvent(new Event('sycnops_user_updated'))
      }
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Could not create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="s-auth">
      <div className="s-auth__brand">
        <Link to="/" className="s-nav__logo" style={{ color: 'var(--ground)' }}>
          SycnOps<span className="s-nav__logo-period">.</span>
        </Link>
        <div>
          <h1 className="s-auth__title">
            Begin the <br />
            <span className="s-auth__title-em">practice</span>
          </h1>
          <p className="s-auth__prose">Create an account, then import public GitHub repositories to see live data.</p>
        </div>
      </div>
      <div className="s-auth__panel">
        <div className="s-auth__box">
          <div style={{ marginBottom: '24px' }}>
            <span className="s-overline">Create account</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', letterSpacing: '-.015em', color: 'var(--ink)' }}>Get started</h2>
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
            <div style={{ backgroundColor: 'rgba(217, 83, 79, 0.1)', border: '1px solid rgba(217, 83, 79, 0.4)', color: '#d9534f', padding: '12px 16px', borderRadius: '4px', marginBottom: '24px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="s-form">
            <div className="s-form__group">
              <label className="s-form__label">Full name</label>
              <input type="text" className="s-form__input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="s-form__group">
              <label className="s-form__label">Email</label>
              <input type="email" className="s-form__input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="s-form__group">
              <label className="s-form__label">Password (min 6 characters)</label>
              <input type="password" className="s-form__input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" className="s-btn" style={{ marginTop: '16px', width: '100%' }} disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--hair)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-2)' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--pigment)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
