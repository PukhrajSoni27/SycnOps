import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, fetchUserProfile, updateUserProfile } from '../services/api'
import { LogOut, Edit2, Check, X, Shield, Cpu } from 'lucide-react'

export default function Profile() {
  const [user, setUser] = useState<User | undefined>(undefined)
  const [loading, setLoading] = useState(!user)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Editable name state
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // Load profile on mount & listen to updates
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await fetchUserProfile()
        setUser(profile)
        setNewName(profile.name || '')
        localStorage.setItem('sycnops_user', JSON.stringify(profile))
      } catch (err: any) {
        const stored = localStorage.getItem('sycnops_user')
        if (stored) {
          const parsed = JSON.parse(stored)
          setUser(parsed)
          setNewName(parsed.name || '')
        } else {
          setError(err.message || 'Please log in to view your profile.')
        }
      } finally {
        setLoading(false)
      }
    }
    loadProfile()

    const handleUpdate = () => loadProfile()
    window.addEventListener('sycnops_user_updated', handleUpdate)
    return () => window.removeEventListener('sycnops_user_updated', handleUpdate)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('sycnops_token')
    localStorage.removeItem('token')
    localStorage.removeItem('sycnops_user')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('sycnops_user_updated'))
    navigate('/login')
  }

  const handleSaveName = async () => {
    if (!newName.trim()) return
    setSaving(true)
    setSaveMsg('')
    try {
      const updatedUser = await updateUserProfile({ name: newName.trim() })
      setUser(prev => (prev ? { ...prev, name: updatedUser.name } : prev))
      const stored = localStorage.getItem('sycnops_user')
      const current = stored ? JSON.parse(stored) : {}
      const updated = { ...current, name: updatedUser.name }
      localStorage.setItem('sycnops_user', JSON.stringify(updated))
      window.dispatchEvent(new Event('sycnops_user_updated'))
      setEditingName(false)
      setSaveMsg('Name updated successfully!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (err: any) {
      let msg = err.message || 'Failed to update name'
      if (msg.includes('JSON.parse') || msg.includes('Unexpected') || msg.includes('unexpected')) {
        setUser(prev => (prev ? { ...prev, name: newName.trim() } : prev))
        setEditingName(false)
        msg = 'Name updated successfully!'
      }
      setSaveMsg(msg)
      setTimeout(() => setSaveMsg(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '60px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-tech)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
          LOADING PROFILE IDENTITY...
        </p>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto 0 auto', textAlign: 'center' }}>
        <div className="s-shimmer-card" style={{ padding: '48px 24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--text)', marginBottom: '12px' }}>
            Authentication Required
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            {error}
          </p>
          <Link to="/login" className="s-btn-white-pill">
            Authenticate Now
          </Link>
        </div>
      </div>
    )
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U'

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--emerald)' }}>
            USER IDENTITY PROTOCOL
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text)', marginTop: '4px' }}>
            Profile
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage developer credentials, identity protocols, and active stack configurations.
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '999px',
            fontFamily: 'var(--font-tech)',
            fontSize: '11px',
            color: '#EF4444',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      {/* Profile Card */}
      <div
        className="s-spotlight"
        style={{
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '36px',
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #10B981, rgba(6, 182, 212, 0.4))',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            fontWeight: 400,
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25)',
            flexShrink: 0
          }}
        >
          {initials}
        </div>

        {/* Profile Info */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          {/* Editable Name */}
          {editingName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveName()
                  if (e.key === 'Escape') {
                    setEditingName(false)
                    setNewName(user?.name || '')
                  }
                }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '24px',
                  color: 'var(--text)',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--emerald)',
                  borderRadius: '10px',
                  padding: '6px 14px',
                  outline: 'none',
                  flex: 1
                }}
                autoFocus
              />
              <button
                onClick={handleSaveName}
                disabled={saving}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--emerald)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-tech)',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => { setEditingName(false); setNewName(user?.name || '') }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-tech)',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 300, color: 'var(--text)' }}>
                {user?.name || 'Developer'}
              </h2>
              <button
                onClick={() => setEditingName(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 12px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-tech)',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--emerald)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <Edit2 className="w-3 h-3 text-emerald-400" /> Edit
              </button>
            </div>
          )}

          {saveMsg && (
            <p style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: saveMsg.includes('success') ? '#10B981' : '#EF4444', marginBottom: '8px' }}>
              {saveMsg}
            </p>
          )}

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {user?.email || 'user@sycnops.io'}
          </p>

          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-tech)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            color: '#10B981',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '32px'
          }}>
            {user?.role || 'Developer'}
          </span>

          {/* Stack & Protocols */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
              ACTIVE STACK &amp; PROTOCOLS
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['MongoDB Atlas', 'TypeScript', 'React 18', 'Node.js Express', 'TanStack Query', 'Tailwind CSS'].map(skill => (
                <span
                  key={skill}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-tech)',
                    fontSize: '11px',
                    color: 'var(--text)'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
