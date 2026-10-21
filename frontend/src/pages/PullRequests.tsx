import { useState } from 'react'
import {
  GitPullRequest, Search, Clock, Filter,
  GitMerge, GitBranch, AlertCircle, FileCode,
  Users, MessageSquare, RefreshCw, ExternalLink, Circle
} from 'lucide-react'
import { usePullRequestsQuery, useRepositoriesQuery } from '@/hooks/useApi'

// Status badge config
const STATUS_CONFIG = {
  open:   { label: 'Open',   bg: 'rgba(56,189,248,0.12)',  color: '#38BDF8', border: 'rgba(56,189,248,0.3)',  icon: Circle },
  merged: { label: 'Merged', bg: 'rgba(16,185,129,0.12)',  color: '#10B981', border: 'rgba(16,185,129,0.3)',  icon: GitMerge },
  closed: { label: 'Closed', bg: 'rgba(239,68,68,0.12)',   color: '#EF4444', border: 'rgba(239,68,68,0.3)',   icon: AlertCircle },
  draft:  { label: 'Draft',  bg: 'rgba(148,163,184,0.12)', color: '#94A3B8', border: 'rgba(148,163,184,0.3)', icon: FileCode },
}

function StatusBadge({ status, draft }: { status: string; draft?: boolean }) {
  const key = draft ? 'draft' : (status in STATUS_CONFIG ? status : 'open')
  const cfg = STATUS_CONFIG[key as keyof typeof STATUS_CONFIG]
  const Icon = cfg.icon
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600,
      letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 12px',
      borderRadius: '999px', backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`
    }}>
      <Icon style={{ width: 10, height: 10 }} />
      {cfg.label}
    </span>
  )
}

// Summary stat pill
function StatPill({ label, value, color = 'var(--text-muted)' }: { label: string; value: number | string; color?: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '16px 20px', borderRadius: '14px',
      backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', minWidth: 90
    }}>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 300, color }}>{value}</span>
      <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 4 }}>{label}</span>
    </div>
  )
}

export default function PullRequests() {
  const { data: pullRequests = [], isLoading, refetch, isFetching } = usePullRequestsQuery()
  const { data: repositories = [] } = useRepositoriesQuery()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'merged' | 'closed'>('all')
  const [repoFilter, setRepoFilter] = useState('all')

  // Compute summary stats
  const open   = pullRequests.filter(p => p.status === 'open').length
  const merged = pullRequests.filter(p => p.status === 'merged').length
  const closed = pullRequests.filter(p => p.status === 'closed').length
  const drafts = pullRequests.filter((p: any) => p.draft).length
  const mergeRate = pullRequests.length > 0 ? Math.round((merged / pullRequests.length) * 100) : 0

  // Unique authors
  const authors = [...new Set(pullRequests.map(p => p.author).filter(Boolean))]

  // Filter logic
  const filtered = pullRequests.filter(pr => {
    const matchSearch = pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.author?.toLowerCase().includes(search.toLowerCase()) ||
      pr.repo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || pr.status === statusFilter
    const matchRepo = repoFilter === 'all' || pr.repo === repoFilter ||
      pr.repo.startsWith(repoFilter + '/') || pr.repo.endsWith('/' + repoFilter)
    return matchSearch && matchStatus && matchRepo
  })

  // Group by repo for the repo breakdown section
  const byRepo = repositories.map(repo => {
    const repoPRs = pullRequests.filter(p =>
      p.repo === repo.fullName || p.repo === repo.name ||
      p.repo?.startsWith(repo.name) || p.repo?.endsWith(repo.name)
    )
    return {
      repo,
      total: repoPRs.length,
      open: repoPRs.filter(p => p.status === 'open').length,
      merged: repoPRs.filter(p => p.status === 'merged').length,
      closed: repoPRs.filter(p => p.status === 'closed' && p.status !== 'merged').length,
    }
  }).filter(r => r.total > 0)

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
            CODE REVIEW PIPELINE
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text)', marginTop: 4 }}>
            Pull Requests
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: 4 }}>
            Live PR data pulled directly from GitHub — all states, all repos.
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
          <StatPill label="Total PRs" value={pullRequests.length} color="var(--text)" />
          <StatPill label="Open" value={open} color="#38BDF8" />
          <StatPill label="Merged" value={merged} color="#10B981" />
          <StatPill label="Closed" value={closed} color="#EF4444" />
          <StatPill label="Drafts" value={drafts} color="#94A3B8" />
          <StatPill label="Merge Rate" value={`${mergeRate}%`} color={mergeRate >= 60 ? '#10B981' : mergeRate >= 30 ? '#F59E0B' : '#EF4444'} />
          <StatPill label="Contributors" value={authors.length} color="#A78BFA" />
        </div>
      )}

      {/* ── Repo Breakdown Cards ── */}
      {!isLoading && byRepo.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
            BY REPOSITORY
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {byRepo.map(({ repo, total, open: o, merged: m, closed: cl }) => (
              <div key={repo.id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {repo.avatarUrl && (
                    <img src={repo.avatarUrl} alt="" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)' }} />
                  )}
                  <div>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--text)', fontWeight: 400 }}>{repo.fullName || repo.name}</p>
                    <p style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>{repo.language} · {repo.stars} ★</p>
                  </div>
                </div>
                {/* Mini progress bar: open/merged/closed */}
                {total > 0 && (
                  <div style={{ display: 'flex', height: 6, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
                    {o > 0 && <div style={{ flex: o, backgroundColor: '#38BDF8', borderRadius: 999 }} title={`${o} open`} />}
                    {m > 0 && <div style={{ flex: m, backgroundColor: '#10B981', borderRadius: 999 }} title={`${m} merged`} />}
                    {cl > 0 && <div style={{ flex: cl, backgroundColor: '#EF4444', borderRadius: 999 }} title={`${cl} closed`} />}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-tech)', fontSize: '11px' }}>
                  <span style={{ color: '#38BDF8' }}>{o} open</span>
                  <span style={{ color: '#10B981' }}>{m} merged</span>
                  <span style={{ color: '#EF4444' }}>{cl} closed</span>
                </div>
                {repo.htmlUrl && (
                  <a href={`${repo.htmlUrl}/pulls`} target="_blank" rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--emerald)', textDecoration: 'none', letterSpacing: '0.08em' }}>
                    <ExternalLink style={{ width: 10, height: 10 }} /> VIEW ON GITHUB
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Filters Bar ── */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search by title, author, repo…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 36px',
              backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--text)', fontFamily: 'var(--font-sans)',
              fontSize: '13px', outline: 'none'
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--emerald)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: 4, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {(['all', 'open', 'merged', 'closed'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-tech)', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                backgroundColor: statusFilter === s ? 'rgba(16,185,129,0.15)' : 'transparent',
                color: statusFilter === s ? 'var(--emerald)' : 'var(--text-muted)',
                transition: 'all 0.15s'
              }}>
              {s === 'all' ? `All (${pullRequests.length})` : s === 'open' ? `Open (${open})` : s === 'merged' ? `Merged (${merged})` : `Closed (${closed})`}
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
              style={{ padding: '9px 12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">All Repos</option>
              {repositories.map(r => <option key={r.id} value={r.fullName || r.name}>{r.fullName || r.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* ── PR List ── */}
      {isLoading || isFetching ? (
        <div style={{ ...cardStyle, padding: '48px', textAlign: 'center' }}>
          <RefreshCw style={{ width: 24, height: 24, color: 'var(--emerald)', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontFamily: 'var(--font-tech)', fontSize: '12px', color: 'var(--text-muted)' }}>
            Fetching live PR data from GitHub…
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ ...cardStyle, padding: '64px', textAlign: 'center' }}>
          <GitPullRequest style={{ width: 40, height: 40, color: 'var(--text-dim)', margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text)', marginBottom: 8 }}>
            {pullRequests.length === 0 ? 'No pull requests found' : `No ${statusFilter !== 'all' ? statusFilter : ''} pull requests`}
          </h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
            {pullRequests.length === 0
              ? 'Import a GitHub repository to see its pull requests here.'
              : search ? `No PRs match "${search}"` : 'Try changing the filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          <p style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
            SHOWING {filtered.length} OF {pullRequests.length} PULL REQUESTS
          </p>
          {filtered.map((pr: any) => (
            <a
              key={pr.id}
              href={pr.htmlUrl}
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
                  borderLeft: `3px solid ${pr.status === 'merged' ? '#10B981' : pr.status === 'open' ? '#38BDF8' : '#EF4444'}`
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >
                {/* Left: icon + info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 260 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0, marginTop: 2,
                    backgroundColor: pr.status === 'merged' ? 'rgba(16,185,129,0.1)' : pr.status === 'open' ? 'rgba(56,189,248,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${pr.status === 'merged' ? 'rgba(16,185,129,0.25)' : pr.status === 'open' ? 'rgba(56,189,248,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: pr.status === 'merged' ? '#10B981' : pr.status === 'open' ? '#38BDF8' : '#EF4444'
                  }}>
                    {pr.status === 'merged' ? <GitMerge style={{ width: 16, height: 16 }} /> : <GitPullRequest style={{ width: 16, height: 16 }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-dim)' }}>#{pr.number}</span>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>
                        {pr.title}
                      </h3>
                      {pr.draft && <span style={{ fontFamily: 'var(--font-tech)', fontSize: '9px', padding: '2px 8px', borderRadius: 999, backgroundColor: 'rgba(148,163,184,0.15)', color: '#94A3B8', border: '1px solid rgba(148,163,184,0.25)' }}>DRAFT</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--emerald)', fontWeight: 500 }}>{pr.repo}</span>
                      <span>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Users style={{ width: 11, height: 11 }} /> @{pr.author}
                      </span>
                      <span>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock style={{ width: 11, height: 11 }} /> {pr.createdAt}
                      </span>
                      {pr.comments > 0 && (
                        <>
                          <span>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MessageSquare style={{ width: 11, height: 11 }} /> {pr.comments}
                          </span>
                        </>
                      )}
                      {(pr.head || pr.base) && (
                        <>
                          <span>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <GitBranch style={{ width: 11, height: 11 }} />
                            {pr.head && <span style={{ color: '#A78BFA' }}>{pr.head}</span>}
                            {pr.head && pr.base && <span> → </span>}
                            {pr.base && <span>{pr.base}</span>}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Right: status + link */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <StatusBadge status={pr.status} draft={pr.draft} />
                  <ExternalLink style={{ width: 14, height: 14, color: 'var(--text-dim)' }} />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* spin keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
