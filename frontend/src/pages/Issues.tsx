import { useState } from 'react'
import { AlertCircle, Search, User, Plus, X } from 'lucide-react'
import { useIssuesQuery } from '@/hooks/useApi'

export default function Issues() {
  const { data: initialIssues = [], isLoading } = useIssuesQuery()
  const [search, setSearch] = useState('')
  const [extraIssues, setExtraIssues] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newRepo, setNewRepo] = useState('sycnops-ai-web')
  const [newPriority, setNewPriority] = useState('high')

  const issuesList = [...extraIssues, ...initialIssues]

  const filtered = issuesList.filter(issue =>
    issue.title.toLowerCase().includes(search.toLowerCase()) ||
    issue.repo.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const created = {
      id: Date.now(),
      title: newTitle.trim(),
      repo: newRepo,
      priority: newPriority,
      label: 'bug',
      state: 'open',
      assignee: 'current_user'
    }

    setExtraIssues(prev => [created, ...prev])
    setNewTitle('')
    setShowModal(false)
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--emerald)' }}>
            ISSUE TELEMETRY
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text)', marginTop: '4px' }}>
            Issues
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Monitor, prioritize, and resolve repository issues and system bug reports.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)' }}>
            Open Issues: <strong style={{ color: '#F59E0B' }}>{issuesList.length}</strong>
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="s-btn-white-pill"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus className="w-4 h-4" /> New Issue
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '440px' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search issues by title or repo..."
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

      {/* Issues List */}
      {isLoading ? (
        <div className="s-shimmer-card" style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-tech)', fontSize: '12px', color: 'var(--text-muted)' }}>
          Loading issue diagnostics...
        </div>
      ) : filtered.length === 0 ? (
        <div className="s-shimmer-card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)' }}>No issues found matching "{search}"</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filtered.map(issue => (
            <div
              key={issue.id}
              className="s-spotlight"
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
                transition: 'border-color 0.3s, transform 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', minWidth: '280px', flex: 1 }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: issue.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: issue.priority === 'high' ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: issue.priority === 'high' ? '#EF4444' : '#F59E0B',
                  flexShrink: 0
                }}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 400, color: 'var(--text)', marginBottom: '6px' }}>
                    {issue.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--emerald)', fontWeight: 500 }}>{issue.repo}</span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <User className="w-3.5 h-3.5 text-secondary-400" /> Assignee: @{issue.assignee}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontFamily: 'var(--font-tech)',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  backgroundColor: issue.priority === 'high' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  color: issue.priority === 'high' ? '#EF4444' : '#F59E0B',
                  border: issue.priority === 'high' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  {issue.priority} Priority
                </span>

                <span style={{
                  fontFamily: 'var(--font-tech)',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  color: 'var(--text)',
                  border: '1px solid rgba(255,255,255,0.12)'
                }}>
                  {issue.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Issue Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setShowModal(false)} />
          <div className="s-panel" style={{ position: 'relative', zIndex: 101, width: '100%', maxWidth: '520px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: '#10B981', letterSpacing: '0.2em' }}>CREATE ISSUE</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIssue} className="s-form">
              <div className="s-form__group">
                <label className="s-form__label">Issue Title</label>
                <input
                  type="text"
                  className="s-form__input"
                  placeholder="Describe the bug or task..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="s-form__group">
                <label className="s-form__label">Target Repository</label>
                <select
                  className="s-form__input"
                  value={newRepo}
                  onChange={(e) => setNewRepo(e.target.value)}
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'var(--text)' }}
                >
                  <option value="sycnops-ai-web">sycnops-ai-web</option>
                  <option value="workflow-engine">workflow-engine</option>
                  <option value="analytics-service">analytics-service</option>
                </select>
              </div>

              <div className="s-form__group">
                <label className="s-form__label">Priority</label>
                <select
                  className="s-form__input"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'var(--text)' }}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="s-btn s-btn--outline" style={{ padding: '8px 16px', fontSize: '12px' }}>Cancel</button>
                <button type="submit" className="s-btn-white-pill">Create Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
