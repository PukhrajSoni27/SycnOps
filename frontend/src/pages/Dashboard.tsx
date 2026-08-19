import { useRepositoriesQuery, usePullRequestsQuery, useIssuesQuery } from '@/hooks/useApi'

export default function Dashboard() {
  const { data: repositories = [], isLoading: loadingRepos } = useRepositoriesQuery()
  const { data: pullRequests = [], isLoading: loadingPRs } = usePullRequestsQuery()
  const { data: issues = [], isLoading: loadingIssues } = useIssuesQuery()

  const getUserHandle = () => {
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
  const userHandle = getUserHandle()

  const mockCommits = [
    { id: 'a1b2c3d', message: 'feat(api): Implement token refresh flow', author: userHandle, time: '10m ago' },
    { id: 'f4e5d6c', message: 'fix(ui): Align sidebar navigation on mobile', author: userHandle, time: '1h ago' },
    { id: 'b7a8901', message: 'chore: Update dependencies', author: 'sallysmith', time: '3h ago' },
    { id: 'e2d3c4b', message: 'docs: Document new deployment protocol', author: userHandle, time: '5h ago' },
  ]

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Header */}
      <div>
        <span className="s-overline">OVERVIEW</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.03em', color: 'var(--text)', fontWeight: 300 }}>
          Telemetry
        </h1>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '32px 0' }}>
        <div className="s-metric">
          <span className="s-metric__label">Active Repos</span>
          <span className="s-metric__value">{loadingRepos ? '--' : repositories.length}</span>
        </div>
        <div className="s-metric">
          <span className="s-metric__label">Open PRs</span>
          <span className="s-metric__value">{loadingPRs ? '--' : pullRequests.length}</span>
        </div>
        <div className="s-metric">
          <span className="s-metric__label">Open Issues</span>
          <span className="s-metric__value">{loadingIssues ? '--' : issues.length}</span>
        </div>
        <div className="s-metric">
          <span className="s-metric__label">Velocity Score</span>
          <span className="s-metric__value">94.5<span style={{ fontSize: '20px', color: 'var(--emerald)' }}>%</span></span>
        </div>
      </div>

      {/* Two Column Layout for PRs and Commits */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Recent Commits */}
        <div className="s-panel" style={{ padding: 0 }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', letterSpacing: '-0.02em', color: 'var(--text)', fontWeight: 400 }}>Recent Commits</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {mockCommits.map((commit, i) => (
              <div key={commit.id} style={{ display: 'flex', gap: '16px', padding: '20px 32px', borderBottom: i !== mockCommits.length - 1 ? '1px solid var(--border-subtle)' : 'none', transition: 'background 0.2s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--emerald)', flexShrink: 0, paddingTop: '2px' }}>
                  {commit.id}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text)', marginBottom: '6px' }}>
                    {commit.message}
                  </div>
                  <div style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '.1em' }}>
                    @{commit.author} • {commit.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pull Requests */}
        <div className="s-panel" style={{ padding: 0 }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', letterSpacing: '-0.02em', color: 'var(--text)', fontWeight: 400 }}>Active Pull Requests</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {loadingPRs ? (
              <div style={{ padding: '32px', textAlign: 'center', fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '.2em' }}>SYNCING...</div>
            ) : (
              pullRequests.slice(0, 4).map((pr: any, i: number) => (
                <div key={pr.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderBottom: i !== Math.min(3, pullRequests.length - 1) ? '1px solid var(--border-subtle)' : 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text)', marginBottom: '6px', maxWidth: '30ch', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {pr.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '.1em' }}>
                      {pr.repo} • @{pr.author}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: pr.status === 'merged' ? 'var(--text-dim)' : 'var(--emerald)' }}>
                    {pr.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
