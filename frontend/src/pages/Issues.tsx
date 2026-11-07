import { useState } from 'react'
import {
  AlertCircle, Search, User, Filter, Clock, ExternalLink,
  RefreshCw, CheckCircle2, CircleDot, Tag, ShieldAlert
} from 'lucide-react'
import { useIssuesQuery, useRepositoriesQuery } from '@/hooks/useApi'

// Priority styling configuration
const PRIORITY_CONFIG = {
  high: { label: 'High Priority', bg: 'rgba(239,68,68,0.12)', color: '#EF4444', border: 'rgba(239,68,68,0.25)' },
  medium: { label: 'Medium', bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
  low: { label: 'Low', bg: 'rgba(148,163,184,0.12)', color: '#94A3B8', border: 'rgba(148,163,184,0.25)' },
}

function StatPill({ label, value, color = 'var(--text)' }: { label: string; value: number | string; color?: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '16px 20px', borderRadius: '14px',
      backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', minWidth: 95
    }}>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 300, color }}>{value}</span>
      <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 4 }}>{label}</span>
    </div>
  )
}

export default function Issues() {
  const { data: issues = [], isLoading, isFetching, refetch, error } = useIssuesQuery()
  const { data: repositories = [] } = useRepositoriesQuery()

  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState<'all' | 'open' | 'closed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [repoFilter, setRepoFilter] = useState('all')

  // Stats calculation
  const totalCount = issues.length
  const openCount = issues.filter(i => i.state === 'open').length
  const closedCount = issues.filter(i => i.state === 'closed').length
  const highPriorityCount = issues.filter(i => i.priority === 'high').length
  const uniqueAssignees = [...new Set(issues.map(i => i.assignee).filter(a => a && a !== 'unassigned'))]

  // Filtering
  const filtered = issues.filter(issue => {
    const term = search.toLowerCase()
    const matchSearch =
      (issue.title || '').toLowerCase().includes(term) ||
      (issue.repo || '').toLowerCase().includes(term) ||
      (issue.assignee || '').toLowerCase().includes(term) ||
      (issue.number ? `#${issue.number}`.includes(term) : false) ||
      (issue.labels || []).some((l: string) => l.toLowerCase().includes(term))

    const matchState = stateFilter === 'all' || issue.state === stateFilter
    const matchPriority = priorityFilter === 'all' || issue.priority === priorityFilter
    const matchRepo = repoFilter === 'all' || issue.repo === repoFilter ||
      (issue.repo || '').startsWith(repoFilter + '/') || (issue.repo || '').endsWith('/' + repoFilter)

    return matchSearch && matchState && matchPriority && matchRepo
  })

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(12px)',
    border: '1px solid var(--border)', borderRadius: '16px', padding: '24px',
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--emerald)' }}>
            GITHUB ISSUE TRACKER
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text)', marginTop: 4 }}>
            Issues
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: 4 }}>
            Live issues aggregated across all connected repositories with real-time status.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 10,
            backgroundColor: isFetching ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)', color: 'var(--emerald)',
            fontFamily: 'var(--font-tech)', fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.08em', cursor: isFetching ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <RefreshCw style={{ width: 14, height: 14, animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* ── Summary Stats Row ── */}
      {!isLoading && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <StatPill label="Total Issues" value={totalCount} color="var(--text)" />
          <StatPill label="Open" value={openCount} color="#10B981" />
          <StatPill label="Closed" value={closedCount} color="#A78BFA" />
          <StatPill label="High Priority" value={highPriorityCount} color="#EF4444" />
          <StatPill label="Repositories" value={repositories.length} color="#38BDF8" />
          <StatPill label="Assignees" value={uniqueAssignees.length} color="var(--text-muted)" />
        </div>
      )}

      {/* ── Filters Bar ── */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 240, maxWidth: 380 }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search by title, #number, author, repo…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 36px',
              backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--text)', fontFamily: 'var(--font-sans)',
              fontSize: '13px', outline: 'none', transition: 'border-color 0.2s'
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--emerald)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* State tabs */}
        <div style={{ display: 'flex', gap: 4, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {(['all', 'open', 'closed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStateFilter(s)}
              style={{
                padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-tech)', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                backgroundColor: stateFilter === s ? 'rgba(16,185,129,0.15)' : 'transparent',
                color: stateFilter === s ? 'var(--emerald)' : 'var(--text-muted)',
                transition: 'all 0.15s'
              }}
            >
              {s === 'all' ? `All (${totalCount})` : s === 'open' ? `Open (${openCount})` : `Closed (${closedCount})`}
            </button>
          ))}
        </div>

        {/* Priority tabs */}
        <div style={{ display: 'flex', gap: 4, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {(['all', 'high', 'medium', 'low'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              style={{
                padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-tech)', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                backgroundColor: priorityFilter === p ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: priorityFilter === p ? 'var(--text)' : 'var(--text-muted)',
                transition: 'all 0.15s'
              }}
            >
              {p === 'all' ? 'All Priority' : p}
            </button>
          ))}
        </div>

        {/* Repo filter */}
        {repositories.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter style={{ width: 13, height: 13, color: 'var(--text-dim)' }} />
            <select
              value={repoFilter}
              onChange={e => setRepoFilter(e.target.value)}
              style={{
                padding: '9px 12px', backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)', borderRadius: 10,
                color: 'var(--text)', fontSize: '12px', outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="all">All Repositories</option>
              {repositories.map(r => (
                <option key={r.id} value={r.fullName || r.name}>{r.fullName || r.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Issues List ── */}
      {isLoading || isFetching ? (
        <div style={{ ...cardStyle, padding: '48px', textAlign: 'center' }}>
          <RefreshCw style={{ width: 24, height: 24, color: 'var(--emerald)', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontFamily: 'var(--font-tech)', fontSize: '12px', color: 'var(--text-muted)' }}>
            Fetching live issues from GitHub…
          </p>
        </div>
      ) : error ? (
        <div style={{ ...cardStyle, padding: '48px', textAlign: 'center', borderColor: 'rgba(239,68,68,0.3)' }}>
          <AlertCircle style={{ width: 32, height: 32, color: '#EF4444', margin: '0 auto 12px' }} />
          <p style={{ color: '#EF4444', fontSize: '14px' }}>{(error as Error).message}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ ...cardStyle, padding: '64px', textAlign: 'center' }}>
          <CircleDot style={{ width: 40, height: 40, color: 'var(--text-dim)', margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text)', marginBottom: 8 }}>
            {issues.length === 0 ? 'No issues found' : `No ${stateFilter !== 'all' ? stateFilter : ''} issues match`}
          </h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
            {issues.length === 0
              ? 'Import a GitHub repository to monitor open and closed issues.'
              : search || priorityFilter !== 'all' || repoFilter !== 'all'
                ? 'Try adjusting your search query or filter options.'
                : 'No issues available.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          <p style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
            SHOWING {filtered.length} OF {issues.length} ISSUES
          </p>

          {filtered.map(issue => {
            const isOpen = issue.state === 'open'
            const pKey = (issue.priority in PRIORITY_CONFIG ? issue.priority : 'medium') as keyof typeof PRIORITY_CONFIG
            const priorityCfg = PRIORITY_CONFIG[pKey]
            const labelsList: string[] = Array.isArray(issue.labels) && issue.labels.length > 0
              ? issue.labels
              : (issue.label ? [issue.label] : [])

            return (
              <a
                key={issue.id}
                href={issue.htmlUrl}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    ...cardStyle,
                    display: 'flex', alignItems: 'flex-start',
                    justifyContent: 'space-between', gap: 20, flexWrap: 'wrap',
                    cursor: 'pointer', transition: 'border-color 0.2s, transform 0.15s',
                    borderLeft: `3px solid ${isOpen ? '#10B981' : '#A78BFA'}`
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.5)'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  }}
                >
                  {/* Left: state icon + main details */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 260 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0, marginTop: 2,
                      backgroundColor: isOpen ? 'rgba(16,185,129,0.1)' : 'rgba(167,139,250,0.1)',
                      border: `1px solid ${isOpen ? 'rgba(16,185,129,0.25)' : 'rgba(167,139,250,0.25)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isOpen ? '#10B981' : '#A78BFA'
                    }}>
                      {isOpen ? <CircleDot style={{ width: 17, height: 17 }} /> : <CheckCircle2 style={{ width: 17, height: 17 }} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                        {issue.number && (
                          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500 }}>
                            #{issue.number}
                          </span>
                        )}
                        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>
                          {issue.title}
                        </h3>
                      </div>

                      {/* Meta line */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--emerald)', fontWeight: 500 }}>{issue.repo}</span>
                        <span>·</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <User style={{ width: 11, height: 11 }} /> @{issue.assignee || 'unassigned'}
                        </span>
                        {issue.createdAt && (
                          <>
                            <span>·</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock style={{ width: 11, height: 11 }} /> {issue.createdAt}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Label pills */}
                      {labelsList.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                          {labelsList.slice(0, 4).map((lbl, idx) => (
                            <span
                              key={idx}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 3,
                                fontFamily: 'var(--font-tech)', fontSize: '9px',
                                padding: '2px 8px', borderRadius: '6px',
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-muted)'
                              }}
                            >
                              <Tag style={{ width: 8, height: 8 }} />
                              {lbl}
                            </span>
                          ))}
                          {labelsList.length > 4 && (
                            <span style={{ fontFamily: 'var(--font-tech)', fontSize: '9px', color: 'var(--text-dim)' }}>
                              +{labelsList.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: State + Priority Badges + External Link */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {/* State Badge */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600,
                      letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 12px',
                      borderRadius: 999,
                      backgroundColor: isOpen ? 'rgba(16,185,129,0.12)' : 'rgba(167,139,250,0.12)',
                      color: isOpen ? '#10B981' : '#A78BFA',
                      border: `1px solid ${isOpen ? 'rgba(16,185,129,0.3)' : 'rgba(167,139,250,0.3)'}`
                    }}>
                      {isOpen ? <CircleDot style={{ width: 10, height: 10 }} /> : <CheckCircle2 style={{ width: 10, height: 10 }} />}
                      {isOpen ? 'Open' : 'Closed'}
                    </span>

                    {/* Priority Badge */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600,
                      letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 12px',
                      borderRadius: 999,
                      backgroundColor: priorityCfg.bg,
                      color: priorityCfg.color,
                      border: `1px solid ${priorityCfg.border}`
                    }}>
                      {issue.priority === 'high' && <ShieldAlert style={{ width: 10, height: 10 }} />}
                      {priorityCfg.label}
                    </span>

                    <ExternalLink style={{ width: 14, height: 14, color: 'var(--text-dim)' }} />
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}

      {/* spin keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
