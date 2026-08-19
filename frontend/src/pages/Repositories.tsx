import { useState } from 'react'
import { useRepositoriesQuery } from '@/hooks/useApi'

export default function Repositories() {
  const { data: repositories = [], isLoading } = useRepositoriesQuery()
  const [search, setSearch] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const getHandle = () => {
    try {
      const stored = localStorage.getItem('sycnops_user')
      if (stored) {
        const u = JSON.parse(stored)
        if (u.name) return u.name.toLowerCase().replace(/\s+/g, '')
        if (u.email) return u.email.split('@')[0]
      }
    } catch {}
    return 'developer'
  }
  const userHandle = getHandle()

  const filtered = repositories.filter(repo =>
    repo.name.toLowerCase().includes(search.toLowerCase()) ||
    repo.language.toLowerCase().includes(search.toLowerCase())
  )

  const handleImport = () => {
    setIsImporting(true)
    setTimeout(() => {
      setIsImporting(false)
      setShowImportModal(false)
    }, 2000)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-.015em', color: 'var(--ink)', marginBottom: '8px' }}>
            Repositories
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-2)' }}>
            Manage and monitor your connected source architectures.
          </p>
        </div>
        <button className="s-btn" onClick={() => setShowImportModal(true)}>
          Import Repository
        </button>
      </div>

      {/* Filter / Search */}
      <div style={{ marginBottom: '32px' }}>
        <input
          type="text"
          className="s-form__input"
          placeholder="Search registered architectures..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Table */}
      <div className="s-panel" style={{ padding: '0', overflowX: 'auto' }}>
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)' }}>
            INITIALIZING DATA LAYER...
          </div>
        ) : (
          <table className="s-work__table">
            <thead>
              <tr>
                <th className="s-work__th" style={{ paddingLeft: '32px' }}>Repository</th>
                <th className="s-work__th">Language</th>
                <th className="s-work__th">Visibility</th>
                <th className="s-work__th">Metrics</th>
                <th className="s-work__th s-work__th--right" style={{ paddingRight: '32px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(repo => (
                <tr key={repo.id} className="s-work__tr">
                  <td className="s-work__td s-work__name" style={{ paddingLeft: '32px' }}>{repo.name}</td>
                  <td className="s-work__td s-work__meta">{repo.language}</td>
                  <td className="s-work__td s-work__meta">{repo.visibility}</td>
                  <td className="s-work__td s-work__meta">
                    ★ {repo.stars} &nbsp; ⑂ {repo.forks} &nbsp; ⊙ {repo.openIssues}
                  </td>
                  <td className="s-work__td s-work__status s-work__status--active" style={{ paddingRight: '32px' }}>
                    SYNCED
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-2)' }}>
                    NO REPOSITORIES MATCH QUERY
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26,25,23,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowImportModal(false)} />
          
          <div className="s-panel" style={{ position: 'relative', zIndex: 101, width: '100%', maxWidth: '500px', backgroundColor: 'var(--ground-2)' }}>
            <h2 className="s-panel__title">Import from GitHub</h2>
            
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-2)', marginBottom: '24px', lineHeight: 1.6 }}>
              Select a repository from your connected GitHub account (@{userHandle}) to begin monitoring and automation.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--hair)', background: 'var(--ground)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600 }}>{userHandle}/sycnops-frontend</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--pigment)' }}>IMPORTED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--ink)', background: 'var(--ground)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600 }}>{userHandle}/sycnops-api</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--muted)' }}>SELECT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--hair)', background: 'var(--ground)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600 }}>{userHandle}/infrastructure-as-code</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--muted)' }}>SELECT</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="s-btn s-btn--outline" onClick={() => setShowImportModal(false)}>Cancel</button>
              <button className="s-btn" onClick={handleImport} disabled={isImporting}>
                {isImporting ? 'Importing...' : 'Import Selected'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
