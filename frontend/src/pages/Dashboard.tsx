import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchDashboard, fetchPullRequests } from '@/services/api'

export default function Dashboard() {
  const { data: dash, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboard })
  const { data: pullRequests = [] } = useQuery({ queryKey: ['pull-requests'], queryFn: fetchPullRequests })
  const commits = dash?.recentCommits || []

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div>
        <span className="s-overline">OVERVIEW</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.03em', color: 'var(--text)', fontWeight: 300 }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>
          Live GitHub data from repositories you import.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '32px 0' }}>
        <div className="s-metric">
          <span className="s-metric__label">Imported Repos</span>
          <span className="s-metric__value">{isLoading ? '--' : dash?.totalRepositories ?? 0}</span>
        </div>
        <div className="s-metric">
          <span className="s-metric__label">Open PRs</span>
          <span className="s-metric__value">{isLoading ? '--' : dash?.activePullRequests ?? 0}</span>
        </div>
        <div className="s-metric">
          <span className="s-metric__label">Open Issues</span>
          <span className="s-metric__value">{isLoading ? '--' : dash?.openIssues ?? 0}</span>
        </div>
      </div>

      {!isLoading && (dash?.totalRepositories ?? 0) === 0 && (
        <div className="s-panel" style={{ padding: '32px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No repositories yet. Import a public GitHub repo to see real issues, PRs, and commits.</p>
          <Link to="/repositories" className="s-btn">Import a repository</Link>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="s-panel" style={{ padding: 0 }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 400 }}>Recent Commits</h2>
          </div>
          {commits.length === 0 ? (
            <div style={{ padding: '32px', color: 'var(--text-muted)', fontSize: '13px' }}>No commits yet.</div>
          ) : commits.map((commit, i) => (
            <a key={commit.id + i} href={commit.htmlUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '16px', padding: '20px 32px', borderBottom: i !== commits.length - 1 ? '1px solid var(--border-subtle)' : 'none', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--emerald)', flexShrink: 0 }}>{commit.id}</div>
              <div>
                <div style={{ fontSize: '13px', marginBottom: '6px' }}>{commit.message}</div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-dim)' }}>@{commit.author} • {commit.time}{commit.repo ? ` • ${commit.repo}` : ''}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="s-panel" style={{ padding: 0 }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 400 }}>Open Pull Requests</h2>
          </div>
          {pullRequests.length === 0 ? (
            <div style={{ padding: '32px', color: 'var(--text-muted)', fontSize: '13px' }}>No open pull requests.</div>
          ) : pullRequests.slice(0, 6).map((pr: any, i: number) => (
            <a key={pr.id} href={pr.htmlUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderBottom: i !== Math.min(5, pullRequests.length - 1) ? '1px solid var(--border-subtle)' : 'none', textDecoration: 'none', color: 'inherit' }}>
              <div>
                <div style={{ fontSize: '13px', marginBottom: '6px' }}>{pr.title}</div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-dim)' }}>{pr.repo} • @{pr.author}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--emerald)' }}>{pr.status}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
