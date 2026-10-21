import { useState } from 'react'
import { AlertCircle, Search, User, Filter } from 'lucide-react'
import { useIssuesQuery, useRepositoriesQuery } from '@/hooks/useApi'

export default function Issues() {
  const { data: issues = [], isLoading, error } = useIssuesQuery()
  const { data: repositories = [] } = useRepositoriesQuery()
  const [search, setSearch] = useState('')
  const [repoFilter, setRepoFilter] = useState('all')

  const filtered = issues.filter(issue => {
    const matchSearch = issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.repo.toLowerCase().includes(search.toLowerCase())
    const matchRepo = repoFilter === 'all' || issue.repo === repoFilter ||
      issue.repo.startsWith(repoFilter + '/') || issue.repo.endsWith('/' + repoFilter)
    return matchSearch && matchRepo
  })

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--emerald)' }}>GITHUB ISSUES</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text)', marginTop: '4px' }}>Issues</h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Open issues from your imported GitHub repositories.{' '}
          <span style={{ color: 'var(--emerald)' }}>{issues.length} total</span>
        </p>
      </div>

      <div style={{ marginBottom: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '440px' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 40px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)', fontSize: '13px', outline: 'none' }}
          />
        </div>
        {/* Repo Filter */}
        {repositories.length > 0 && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter style={{ width: 14, height: 14, color: 'var(--text-dim)' }} />
            <select
              value={repoFilter}
              onChange={e => setRepoFilter(e.target.value)}
              style={{ padding: '11px 14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">All Repositories ({issues.length})</option>
              {repositories.map(repo => {
                const count = issues.filter(i => i.repo === repo.fullName || i.repo === repo.name).length
                return (
                  <option key={repo.id} value={repo.fullName || repo.name}>
                    {repo.fullName || repo.name} ({count})
                  </option>
                )
              })}
            </select>
          </div>
        )}
      </div>

      {isLoading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading issues from GitHub...</div>
      ) : error ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#EF4444' }}>{(error as Error).message}</div>
      ) : filtered.length === 0 ? (
        <div className="s-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          {search || repoFilter !== 'all' ? 'No issues match your filters.' : 'No open issues. Import a repository first, or the repo has no open issues.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filtered.map(issue => {
            const Card = issue.htmlUrl ? 'a' : 'div'
            return (
              <Card
                key={issue.id}
                href={issue.htmlUrl}
                target={issue.htmlUrl ? '_blank' : undefined}
                rel="noreferrer"
                className="s-spotlight"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: issue.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: issue.priority === 'high' ? '#EF4444' : '#F59E0B' }}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 400, marginBottom: '6px' }}>{issue.title}</h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--emerald)' }}>{issue.repo}{issue.number ? ` #${issue.number}` : ''}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User className="w-3.5 h-3.5" /> @{issue.assignee}</span>
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '999px', color: '#F59E0B', height: 'fit-content' }}>{issue.label}</span>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
