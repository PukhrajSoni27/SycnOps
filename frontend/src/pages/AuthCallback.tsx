import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Firebase uses popup-based auth — this callback page is no longer used.
// If a user lands here directly, redirect them to login.
export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/login', { replace: true })
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--ground)',
      fontFamily: 'var(--font-mono)',
      color: 'var(--ink)'
    }}>
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--hair)',
          borderTopColor: 'var(--pigment)',
          borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: '13px' }}>Redirecting...</p>
      </div>
    </div>
  )
}
