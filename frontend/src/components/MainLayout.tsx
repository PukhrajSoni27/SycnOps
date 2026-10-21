import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

interface NavItem {
  name: string
  href: string
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Repositories', href: '/repositories' },
  { name: 'Pull Requests', href: '/pull-requests' },
  { name: 'Issues', href: '/issues' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Profile', href: '/profile' },
]

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()


  const getUserDisplayName = (): string => {
    try {
      const stored = localStorage.getItem('sycnops_user')
      if (stored) {
        const user = JSON.parse(stored)
        if (user.name && user.name.trim()) {
          return user.name.trim().toUpperCase()
      }
        if (user.email) {
          const local = user.email.split('@')[0]
          return local.replace(/[^a-zA-Z]/g, ' ').trim().toUpperCase() || 'USER'
        }
      }
    } catch {}
    return 'USER'
  }

  const [displayName, setDisplayName] = useState(getUserDisplayName)

  
  useEffect(() => {
    const handleStorageUpdate = () => {
      setDisplayName(getUserDisplayName())
    }

  window.addEventListener('sycnops_user_updated', handleStorageUpdate)
   window.addEventListener('storage', handleStorageUpdate)
    setDisplayName(getUserDisplayName())

    return () => {
      window.removeEventListener('sycnops_user_updated', handleStorageUpdate)
      window.removeEventListener('storage', handleStorageUpdate)
    }
  }, [location.pathname])

  return (
    <div className="s-dash">
      
      {/* Morphing Background Glows */}
      <div className="s-glow s-glow--1" />
      <div className="s-glow s-glow--2" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`s-sidebar ${sidebarOpen ? 'open' : 'hidden md:flex'}`}>
        <div className="s-sidebar__header">
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text)', fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 400, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '28px', height: '28px', background: 'var(--text)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg)', fontSize: '14px', fontWeight: 700 }}>S</span>
            SycnOps<span style={{ color: 'var(--emerald)' }}>.</span>
          </Link>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', float: 'right', color: 'var(--text)' }}>
              <X size={20} />
            </button>
          )}
        </div>
        
        <nav className="s-sidebar__nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`s-sidebar__link ${location.pathname === item.href ? 'is-active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '0 24px' }}>
          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '.2em', textTransform: 'uppercase' }}>
            VERSION 2.0.26
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="s-main">
        
        {/* Topbar */}
        <header className="s-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="md:hidden" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text)' }}>
              <Menu size={22} />
            </button>
            {/* Emerald pulse dot + status */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)', animation: 'count-pulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Studio Instance — Active
              </span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', fontWeight: 600, letterSpacing: '.15em', color: 'var(--text)' }}>
              {displayName}
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--emerald), rgba(16,185,129,0.4))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-tech)' }}>
              {displayName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="s-content">
          {children}
        </div>
      </main>

    </div>
  )
}
