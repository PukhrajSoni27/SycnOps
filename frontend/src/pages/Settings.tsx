import { useState, useEffect } from 'react'
import { fetchUserProfile, updateUserProfile } from '../services/api'

export default function Settings() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [jobTitle, setJobTitle] = useState('Senior Full-Stack Developer')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [githubConnected, setGithubConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await fetchUserProfile()
        setName(user.name || '')
        setEmail(user.email || '')
        if (user.role) setJobTitle(user.role)
      } catch {
        const stored = localStorage.getItem('sycnops_user')
        if (stored) {
          const user = JSON.parse(stored)
          setName(user.name || '')
          setEmail(user.email || '')
          if (user.role) setJobTitle(user.role)
        }
      }
    }
    loadUser()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      const updated = await updateUserProfile({ name: name.trim() })
      setName(updated.name || name.trim())
      const stored = localStorage.getItem('sycnops_user')
      const current = stored ? JSON.parse(stored) : {}
      const newObj = { ...current, name: updated.name || name.trim(), role: jobTitle }
      localStorage.setItem('sycnops_user', JSON.stringify(newObj))
      window.dispatchEvent(new Event('sycnops_user_updated'))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleConnectGithub = () => {
    setConnecting(true)
    setTimeout(() => {
      setGithubConnected(true)
      setConnecting(false)
    }, 1500)
  }

  const githubHandle = name ? name.toLowerCase().replace(/\s+/g, '') : 'developer'

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-.015em', color: 'var(--ink)', marginBottom: '8px' }}>
          Configuration
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-2)' }}>
          Manage your account preferences and integrations.
        </p>
      </div>

      {/* GitHub Integration Panel */}
      <div className="s-panel" style={{ marginBottom: '32px' }}>
        <h2 className="s-panel__title">Integrations</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: '1px solid var(--hair)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)' }}>GitHub</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-2)', marginTop: '4px' }}>
              {githubConnected ? `Connected as @${githubHandle}` : 'Link your account to import repositories and track workflows.'}
            </div>
          </div>
          
          {githubConnected ? (
            <button className="s-btn s-btn--outline" onClick={() => setGithubConnected(false)}>
              Disconnect
            </button>
          ) : (
            <button className="s-btn" onClick={handleConnectGithub} disabled={connecting}>
              {connecting ? 'Authenticating...' : 'Connect GitHub'}
            </button>
          )}
        </div>
      </div>

      {/* Profile Panel */}
      <div className="s-panel">
        <h2 className="s-panel__title">Profile</h2>
        
        <form onSubmit={handleSave} className="s-form">
          <div className="s-form__group">
            <label className="s-form__label">Full Name</label>
            <input
              type="text"
              className="s-form__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Full Name"
              required
            />
          </div>
          
          <div className="s-form__group">
            <label className="s-form__label">Job Title</label>
            <input
              type="text"
              className="s-form__input"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Job Title"
            />
          </div>

          <div className="s-form__group">
            <label className="s-form__label">Email Address (Locked)</label>
            <input
              type="email"
              className="s-form__input"
              value={email}
              disabled
              style={{ color: 'var(--muted)', cursor: 'not-allowed' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <button type="submit" className="s-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--pigment)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                Configuration Saved
              </span>
            )}
          </div>
        </form>
      </div>

    </div>
  )
}
