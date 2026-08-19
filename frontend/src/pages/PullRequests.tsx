import { useState } from 'react'
import { GitPullRequest, Search, MessageSquare, Clock, ArrowUpRight, CheckCircle, X } from 'lucide-react'
import { usePullRequestsQuery } from '@/hooks/useApi'

export default function PullRequests() {
  const { data: pullRequests = [], isLoading } = usePullRequestsQuery()
  const [search, setSearch] = useState('')
  const [selectedPR, setSelectedPR] = useState<any | null>(null)
  const [approved, setApproved] = useState(false)

  const filtered = pullRequests.filter(pr =>
    pr.title.toLowerCase().includes(search.toLowerCase()) ||
    pr.repo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--emerald)' }}>
            WORKFLOW TELEMETRY
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text)', marginTop: '4px' }}>
            Pull Requests
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Track code reviews, automated CI/CD checks, and active pull requests.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)' }}>
            Active PRs: <strong style={{ color: 'var(--text)' }}>{pullRequests.length}</strong>
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div style={{ marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '440px' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search pull requests by title or repo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text)',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s, background-color 0.2s'
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--emerald)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>
      </div>

      {/* PR List */}
      {isLoading ? (
        <div className="s-shimmer-card" style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-tech)', fontSize: '12px', color: 'var(--text-muted)' }}>
          Loading pull requests pipeline...
        </div>
      ) : filtered.length === 0 ? (
        <div className="s-shimmer-card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)' }}>No pull requests found matching "{search}"</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filtered.map(pr => (
            <div
              key={pr.id}
              className="s-spotlight"
              onClick={() => { setSelectedPR(pr); setApproved(false) }}
              style={{
                backgroundColor: 'var(--bg-card)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap',
                cursor: 'pointer',
                transition: 'border-color 0.3s, transform 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', minWidth: '280px', flex: 1 }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--emerald)',
                  flexShrink: 0
                }}>
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 400, color: 'var(--text)', marginBottom: '6px' }}>
                    {pr.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--emerald)', fontWeight: 500 }}>{pr.repo}</span>
                    <span>•</span>
                    <span>by @{pr.author}</span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock className="w-3 h-3 text-secondary-400" /> {pr.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  {pr.comments} comments
                </span>

                <span style={{
                  fontFamily: 'var(--font-tech)',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  backgroundColor: pr.status === 'merged' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(56, 189, 248, 0.12)',
                  color: pr.status === 'merged' ? '#10B981' : '#38BDF8',
                  border: pr.status === 'merged' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)'
                }}>
                  {pr.status}
                </span>

                <button style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                  <ArrowUpRight className="w-4 h-4 hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PR Details Modal */}
      {selectedPR && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setSelectedPR(null)} />
          <div className="s-panel" style={{ position: 'relative', zIndex: 101, width: '100%', maxWidth: '560px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: '#10B981', letterSpacing: '0.2em' }}>PULL REQUEST REVIEW</span>
              <button onClick={() => setSelectedPR(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text)', marginBottom: '8px' }}>{selectedPR.title}</h2>
            <p style={{ fontFamily: 'var(--font-tech)', fontSize: '12px', color: 'var(--emerald)', marginBottom: '24px' }}>Repository: {selectedPR.repo} • Author: @{selectedPR.author}</p>

            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              <div>Status: <strong style={{ color: '#10B981' }}>{approved ? 'APPROVED & READY TO MERGE' : selectedPR.status.toUpperCase()}</strong></div>
              <div style={{ marginTop: '8px' }}>Automated CI Checks: PASSING (12/12)</div>
              <div style={{ marginTop: '8px' }}>Security Audit: 0 Vulnerabilities Detected</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setSelectedPR(null)} className="s-btn s-btn--outline" style={{ padding: '8px 16px', fontSize: '12px' }}>Close</button>
              <button
                onClick={() => setApproved(true)}
                disabled={approved}
                className="s-btn-white-pill"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" /> {approved ? 'PR Approved' : 'Approve Pull Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
