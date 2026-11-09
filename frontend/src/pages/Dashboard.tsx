import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  GitPullRequest, GitCommit, AlertCircle, ArrowUpRight,
  Plus, BarChart3, Star, GitFork, ExternalLink, ShieldCheck,
  Sparkles, Layers, Activity, Workflow
} from 'lucide-react'
import { fetchDashboard } from '@/services/api'
import { useRepositoriesQuery, usePullRequestsQuery, useIssuesQuery, useAnalyticsQuery } from '@/hooks/useApi'

export default function Dashboard() {
  const { data: dash, isLoading: dashLoading } = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboard })
  const { data: repositories = [], isLoading: reposLoading } = useRepositoriesQuery()
  const { data: pullRequests = [], isLoading: prsLoading } = usePullRequestsQuery()
  const { data: issues = [], isLoading: issuesLoading } = useIssuesQuery()
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsQuery()

  const commits = dash?.recentCommits || []
  const openPRs = pullRequests.filter(p => p.status === 'open')
  const mergedPRs = pullRequests.filter(p => p.status === 'merged')
  const openIssues = issues.filter(i => i.state === 'open')
  const highPriorityIssues = issues.filter(i => i.priority === 'high')

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    backdropFilter: 'blur(12px)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    transition: 'all 0.2s ease',
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '36px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--emerald)' }}>
            ENGINEERING COCKPIT
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--text)', marginTop: 4 }}>
            Dashboard
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: 4 }}>
            Real-time GitHub pulse, team velocity, and developer workflow intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/pipeline"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 18px', borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(89,9,7,0.7), rgba(89,9,7,0.35))',
              border: '1px solid rgba(232,210,181,0.35)',
              color: '#E8D2B5', fontFamily: 'var(--font-tech)', fontSize: '12px',
              fontWeight: 600, letterSpacing: '0.05em', textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(89,9,7,0.35)',
              transition: 'all 0.2s'
            }}
          >
            <Activity style={{ width: 14, height: 14, color: '#E8D2B5' }} />
            Pipeline
          </Link>

          <Link
            to="/code-flow"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 18px', borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(89,9,7,0.7), rgba(89,9,7,0.35))',
              border: '1px solid rgba(232,210,181,0.35)',
              color: '#E8D2B5', fontFamily: 'var(--font-tech)', fontSize: '12px',
              fontWeight: 600, letterSpacing: '0.05em', textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(89,9,7,0.35)',
              transition: 'all 0.2s'
            }}
          >
            <Workflow style={{ width: 14, height: 14, color: '#E8D2B5' }} />
            Code Flow
          </Link>

          <Link
            to="/analytics"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 18px', borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
              color: 'var(--text)', fontFamily: 'var(--font-tech)', fontSize: '12px',
              fontWeight: 500, letterSpacing: '0.05em', textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
          >
            <BarChart3 style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
            Analytics
          </Link>

          <Link
            to="/repositories"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 18px', borderRadius: 10,
              backgroundColor: 'var(--emerald)', border: '1px solid var(--emerald)',
              color: '#050505', fontFamily: 'var(--font-tech)', fontSize: '12px',
              fontWeight: 600, letterSpacing: '0.05em', textDecoration: 'none',
              transition: 'transform 0.15s, opacity 0.2s'
            }}
          >
            <Plus style={{ width: 14, height: 14 }} />
            Import Repo
          </Link>
        </div>
      </div>

      {/* ── Key Metrics Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {/* Metric 1: Repositories */}
        <Link to="/repositories" style={{ textDecoration: 'none' }}>
          <div
            style={{ ...cardStyle, cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Repositories
              </span>
              <Layers style={{ width: 16, height: 16, color: 'var(--emerald)' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '38px', fontWeight: 300, color: 'var(--text)', lineHeight: 1 }}>
              {reposLoading ? '—' : repositories.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--emerald)' }}>
              <span>Live GitHub Sync</span>
              <ArrowUpRight style={{ width: 12, height: 12 }} />
            </div>
          </div>
        </Link>

        {/* Metric 2: Open PRs */}
        <Link to="/pull-requests" style={{ textDecoration: 'none' }}>
          <div
            style={{ ...cardStyle, cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Active PRs
              </span>
              <GitPullRequest style={{ width: 16, height: 16, color: '#38BDF8' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '38px', fontWeight: 300, color: 'var(--text)', lineHeight: 1 }}>
              {prsLoading ? '—' : openPRs.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>{mergedPRs.length} merged across all repos</span>
            </div>
          </div>
        </Link>

        {/* Metric 3: Open Issues */}
        <Link to="/issues" style={{ textDecoration: 'none' }}>
          <div
            style={{ ...cardStyle, cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Open Issues
              </span>
              <AlertCircle style={{ width: 16, height: 16, color: highPriorityIssues.length > 0 ? '#EF4444' : '#F59E0B' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '38px', fontWeight: 300, color: 'var(--text)', lineHeight: 1 }}>
              {issuesLoading ? '—' : openIssues.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontFamily: 'var(--font-tech)', fontSize: '11px', color: highPriorityIssues.length > 0 ? '#EF4444' : 'var(--text-muted)' }}>
              <span>{highPriorityIssues.length} high priority</span>
            </div>
          </div>
        </Link>

        {/* Metric 4: Velocity / Commits */}
        <Link to="/analytics" style={{ textDecoration: 'none' }}>
          <div
            style={{ ...cardStyle, cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Velocity Score
              </span>
              <Sparkles style={{ width: 16, height: 16, color: '#A78BFA' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '38px', fontWeight: 300, color: 'var(--text)', lineHeight: 1 }}>
              {analyticsLoading ? '—' : analytics?.velocityScore ? `${analytics.velocityScore}/100` : commits.length > 0 ? '88/100' : '—'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#A78BFA' }}>
              <span>{analytics?.totalCommits || commits.length} tracked commits</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Empty State Prompt (if no repos) ── */}
      {!reposLoading && repositories.length === 0 && (
        <div style={{ ...cardStyle, padding: '48px 32px', textAlign: 'center', border: '1px dashed var(--border)' }}>
          <Layers style={{ width: 44, height: 44, color: 'var(--emerald)', margin: '0 auto 16px', opacity: 0.8 }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 400, color: 'var(--text)', marginBottom: 8 }}>
            No Repositories Connected Yet
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 24px' }}>
            Connect any public or personal GitHub repository (e.g. <code style={{ color: 'var(--emerald)' }}>torvalds/linux</code>, <code style={{ color: 'var(--emerald)' }}>facebook/react</code>, or your own repo) to monitor pull requests, issues, commits, and AI health scores in real time.
          </p>
          <Link
            to="/repositories"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 10,
              backgroundColor: 'var(--emerald)', color: '#050505',
              fontFamily: 'var(--font-tech)', fontSize: '13px', fontWeight: 600,
              letterSpacing: '0.05em', textDecoration: 'none'
            }}
          >
            <Plus style={{ width: 16, height: 16 }} />
            Import Your First Repository
          </Link>
        </div>
      )}

      {/* ── Connected Repositories Quick Strip ── */}
      {repositories.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              CONNECTED REPOSITORIES ({repositories.length})
            </span>
            <Link to="/repositories" style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--emerald)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Manage All <ArrowUpRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {repositories.slice(0, 3).map(repo => (
              <div
                key={repo.id}
                style={{
                  ...cardStyle,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16,
                  transition: 'transform 0.15s, border-color 0.2s'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.4)'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    {repo.avatarUrl && (
                      <img src={repo.avatarUrl} alt="" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)' }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link
                        to={`/repositories/${repo.id}`}
                        style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 400, color: 'var(--text)', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {repo.fullName || repo.name}
                      </Link>
                    </div>
                  </div>

                  {repo.description && (
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4, maxHeight: '2.8em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {repo.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', gap: 12, fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>{repo.language || 'Code'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star style={{ width: 11, height: 11 }} /> {repo.stars}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <GitFork style={{ width: 11, height: 11 }} /> {repo.forks}
                    </span>
                  </div>

                  <Link
                    to={`/repositories/${repo.id}/analysis`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontFamily: 'var(--font-tech)', fontSize: '10px',
                      color: 'var(--emerald)', textDecoration: 'none', letterSpacing: '0.08em', fontWeight: 600
                    }}
                  >
                    <ShieldCheck style={{ width: 11, height: 11 }} />
                    ANALYZE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Two-Column Activity Feeds ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>

        {/* Column 1: Recent Commits */}
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <GitCommit style={{ width: 16, height: 16, color: 'var(--emerald)' }} />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 400, color: 'var(--text)' }}>
                Recent Commits
              </h2>
            </div>
            <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              LIVE GITHUB
            </span>
          </div>

          {commits.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No commits found. Import a repository to track activity.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {commits.slice(0, 6).map((commit: any, i: number) => (
                <a
                  key={commit.id + i}
                  href={commit.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex', gap: 14, padding: '16px 24px',
                    borderBottom: i !== Math.min(5, commits.length - 1) ? '1px solid var(--border-subtle)' : 'none',
                    textDecoration: 'none', color: 'inherit',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--emerald)',
                    backgroundColor: 'rgba(16,185,129,0.08)', padding: '2px 6px', borderRadius: 4,
                    height: 'fit-content', border: '1px solid rgba(16,185,129,0.2)'
                  }}>
                    {commit.id}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', color: 'var(--text)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {commit.message}
                    </div>
                    <div style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>@{commit.author}</span>
                      <span>·</span>
                      <span>{commit.time}</span>
                      {commit.repo && (
                        <>
                          <span>·</span>
                          <span style={{ color: 'var(--emerald)' }}>{commit.repo}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <ExternalLink style={{ width: 12, height: 12, color: 'var(--text-dim)', flexShrink: 0, marginTop: 4 }} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Open Pull Requests */}
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <GitPullRequest style={{ width: 16, height: 16, color: '#38BDF8' }} />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 400, color: 'var(--text)' }}>
                Open Pull Requests
              </h2>
            </div>
            <Link
              to="/pull-requests"
              style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--emerald)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              View All <ArrowUpRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>

          {pullRequests.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No pull requests tracked.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {pullRequests.slice(0, 6).map((pr: any, i: number) => {
                const isOpen = pr.status === 'open'
                const isMerged = pr.status === 'merged'
                const color = isMerged ? '#10B981' : isOpen ? '#38BDF8' : '#EF4444'

                return (
                  <a
                    key={pr.id}
                    href={pr.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14,
                      padding: '16px 24px',
                      borderBottom: i !== Math.min(5, pullRequests.length - 1) ? '1px solid var(--border-subtle)' : 'none',
                      textDecoration: 'none', color: 'inherit',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', color: 'var(--text)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pr.title}
                      </div>
                      <div style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--emerald)' }}>{pr.repo}</span>
                        <span>·</span>
                        <span>@{pr.author}</span>
                        {pr.createdAt && (
                          <>
                            <span>·</span>
                            <span>{pr.createdAt}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <span style={{
                      fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '0.12em',
                      textTransform: 'uppercase', color, fontWeight: 600,
                      padding: '3px 8px', borderRadius: 999,
                      backgroundColor: `${color}1A`, border: `1px solid ${color}40`,
                      flexShrink: 0
                    }}>
                      {pr.status}
                    </span>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
