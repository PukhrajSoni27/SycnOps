import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, GitFork, AlertCircle, GitPullRequest, GitCommit, Users, Shield, Activity, ExternalLink, Loader2 } from 'lucide-react'
import { apiGet } from '@/services/api'

export default function RepoDetail() {
  const { repoId } = useParams()
  const [detail, setDetail] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [analysisLoading, setAnalysisLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'prs' | 'commits'>('overview')

  useEffect(() => {
    async function load() {
      try {
        const json = await apiGet(`/repositories/${repoId}/details`)
        if (json.success) setDetail(json.data)
        else setError(json.message || 'Failed to load repo details')
      } catch (err: any) { setError(err.message || 'Backend offline.') }
      finally { setLoading(false) }
    }
    async function loadAnalysis() {
      try {
        const json = await apiGet(`/repositories/${repoId}/analysis`)
        if (json.success) setAnalysis(json.data)
      } catch {}
      finally { setAnalysisLoading(false) }
    }
    load()
    loadAnalysis()
  }, [repoId])

  function timeAgo(d: string) {
    if (!d) return ''
    const diff = Date.now() - new Date(d).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }
  function fmtNum(n: number) { return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString() }

  if (loading) return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 0', textAlign: 'center' }}>
      <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#10B981', margin: '0 auto 12px' }} />
      <p style={{ fontFamily: 'var(--font-tech)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '.15em' }}>LOADING REPOSITORY DATA...</p>
    </div>
  )
  if (error) return (
    <div style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center' }}>
      <p style={{ color: '#EF4444', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{error}</p>
      <Link to="/repositories" className="s-btn" style={{ marginTop: 16, display: 'inline-flex' }}>Back to Repositories</Link>
    </div>
  )

  const repo = detail?.repo || {}
  const langEntries = Object.entries(detail?.languages || {})
  const totalBytes = langEntries.reduce((s, [, v]: any) => s + v, 0)

  const langColors: Record<string, string> = {
    JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3572A5', Java: '#B07219',
    Go: '#00ADD8', Rust: '#DEA584', 'C++': '#F34B7D', C: '#555555', Ruby: '#CC342D',
    HTML: '#E34C26', CSS: '#563D7C', Shell: '#89E051', Swift: '#FA7343', Kotlin: '#A97BFF',
    PHP: '#4F5D95', Dart: '#00B4AB', Lua: '#000080', Scala: '#DC322F',
    Makefile: '#427819', Dockerfile: '#384D54', Starlark: '#76D275'
  }

  const healthColor = (analysis?.healthScore ?? 0) >= 75 ? '#10B981' : (analysis?.healthScore ?? 0) >= 50 ? '#F59E0B' : '#EF4444'

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Back + Header */}
      <Link to="/repositories" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-tech)', fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 24, letterSpacing: '.1em' }}>
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO REPOSITORIES
      </Link>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
        {repo.avatarUrl && <img src={repo.avatarUrl} alt="" style={{ width: 56, height: 56, borderRadius: 14, border: '1px solid var(--border)' }} />}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 300, color: 'var(--text)', letterSpacing: '-.02em' }}>
            {repo.fullName || repo.name}
          </h1>
          {repo.description && <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', marginTop: 4, maxWidth: 600 }}>{repo.description}</p>}
          <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap', fontFamily: 'var(--font-tech)', fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} /> {fmtNum(repo.stars || 0)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GitFork className="w-3.5 h-3.5" style={{ color: '#38BDF8' }} /> {fmtNum(repo.forks || 0)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle className="w-3.5 h-3.5" style={{ color: '#EF4444' }} /> {repo.openIssues} issues</span>
            <span>{repo.language}</span>
            {repo.htmlUrl && <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10B981', textDecoration: 'none' }}><ExternalLink className="w-3.5 h-3.5" /> GitHub</a>}
          </div>
          {(repo.topics || []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {repo.topics.map((t: string) => (
                <span key={t} style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '3px 10px', borderRadius: 10, backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>{t}</span>
              ))}
            </div>
          )}
        </div>
        {/* Full Analysis Button — only for GitHub repos */}
        {repo.source === 'github' && (
          <Link
            to={`/repositories/${repoId}/analysis`}
            className="s-btn"
            style={{ flexShrink: 0, background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none' }}
          >
            Full Analysis
          </Link>
        )}
      </div>

      {/* Analysis Banner */}
      {repo.source === 'github' && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          padding: '16px 24px', borderRadius: 14, marginBottom: 28,
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(56,189,248,0.04) 100%)',
          border: '1px solid rgba(16,185,129,0.25)', flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981', animation: 'count-pulse 2s ease-in-out infinite' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: 11, fontWeight: 600, color: '#10B981', letterSpacing: '.1em' }}>DEEP ANALYSIS AVAILABLE</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>View bugs, security issues, stale PRs, contributor health, and actionable recommendations</div>
            </div>
          </div>
          <Link to={`/repositories/${repoId}/analysis`} className="s-btn" style={{ fontSize: 11, padding: '10px 20px' }}>
            Run Analysis →
          </Link>
        </div>
      )}


      {/* Health Score + Analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 32 }}>
        {/* Health Score */}
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-tech)', fontSize: 10, letterSpacing: '.15em', color: 'var(--text-muted)', marginBottom: 8 }}>HEALTH SCORE</p>
          <div style={{ fontSize: 48, fontFamily: 'var(--font-serif)', fontWeight: 300, color: healthColor }}>
            {analysisLoading ? '...' : `${analysis?.healthScore ?? '—'}`}<span style={{ fontSize: 20 }}>%</span>
          </div>
        </div>
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 }}>
          <p style={{ fontFamily: 'var(--font-tech)', fontSize: 10, letterSpacing: '.15em', color: 'var(--text-muted)', marginBottom: 8 }}>BUG TRACKER</p>
          <div style={{ fontSize: 32, fontFamily: 'var(--font-serif)', fontWeight: 300, color: '#EF4444' }}>{analysisLoading ? '...' : analysis?.openBugs ?? 0}</div>
          <p style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>OPEN BUGS</p>
        </div>
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 }}>
          <p style={{ fontFamily: 'var(--font-tech)', fontSize: 10, letterSpacing: '.15em', color: 'var(--text-muted)', marginBottom: 8 }}>ISSUE CLOSE RATE</p>
          <div style={{ fontSize: 32, fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--text)' }}>{analysisLoading ? '...' : `${analysis?.issueCloseRate ?? 0}%`}</div>
        </div>
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 }}>
          <p style={{ fontFamily: 'var(--font-tech)', fontSize: 10, letterSpacing: '.15em', color: 'var(--text-muted)', marginBottom: 8 }}>PR MERGE RATE</p>
          <div style={{ fontSize: 32, fontFamily: 'var(--font-serif)', fontWeight: 300, color: '#38BDF8' }}>{analysisLoading ? '...' : `${analysis?.prMergeRate ?? 0}%`}</div>
        </div>
      </div>

      {/* AI Insights */}
      {analysis?.insights && (
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 400, color: 'var(--text)', marginBottom: 16 }}>
            <Activity className="w-5 h-5" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: '#10B981' }} />
            SycnOps AI Analysis
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {analysis.insights.map((line: string, i: number) => (
              <div key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: line.includes('⚠') ? '#F59E0B' : 'var(--text-muted)', lineHeight: 1.6, padding: '6px 0', borderBottom: i < analysis.insights.length - 1 ? '1px solid var(--border)' : 'none' }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages Breakdown */}
      {langEntries.length > 0 && (
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 400, color: 'var(--text)', marginBottom: 16 }}>Languages</h2>
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 10, marginBottom: 14 }}>
            {langEntries.map(([lang, bytes]: any) => (
              <div key={lang} style={{ width: `${(bytes / totalBytes) * 100}%`, backgroundColor: langColors[lang] || '#666', minWidth: 3 }} title={`${lang}: ${((bytes / totalBytes) * 100).toFixed(1)}%`} />
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {langEntries.map(([lang, bytes]: any) => (
              <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-tech)', fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: langColors[lang] || '#666' }} />
                {lang} <span style={{ color: 'var(--text-dim)' }}>{((bytes / totalBytes) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {(['overview', 'issues', 'prs', 'commits'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #10B981' : '2px solid transparent',
            fontFamily: 'var(--font-tech)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase',
            color: activeTab === tab ? '#10B981' : 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s'
          }}>
            {tab === 'prs' ? 'Pull Requests' : tab} {tab === 'issues' ? `(${detail?.issues?.length || 0})` : tab === 'prs' ? `(${detail?.pulls?.length || 0})` : tab === 'commits' ? `(${detail?.commits?.length || 0})` : ''}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          {/* Contributors */}
          <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users className="w-4 h-4" style={{ color: '#10B981' }} /> Top Contributors
            </h3>
            {(detail?.contributors || []).map((c: any) => (
              <a key={c.login} href={c.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}>
                <img src={c.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)', flex: 1 }}>{c.login}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>{c.contributions} commits</span>
              </a>
            ))}
          </div>
          {/* Bugs */}
          {analysis?.bugs?.length > 0 && (
            <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 18, padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, color: '#EF4444', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield className="w-4 h-4" /> Open Bugs
              </h3>
              {analysis.bugs.map((b: any) => (
                <a key={b.number} href={b.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#EF4444' }}>#{b.number}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)', marginLeft: 8 }}>{b.title}</span>
                  <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>by @{b.user} · {timeAgo(b.createdAt)}</div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'issues' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(detail?.issues || []).length === 0 ? (
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No open issues found.</p>
          ) : detail.issues.map((i: any) => (
            <a key={i.id} href={i.htmlUrl} target="_blank" rel="noopener noreferrer" className="s-spotlight" style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, padding: 20, backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 14, textDecoration: 'none', transition: 'border-color .2s'
            }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#F59E0B', marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginRight: 8 }}>#{i.number}</span>
                  {i.title}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {(i.labels || []).map((l: any) => (
                    <span key={l.name} style={{ fontSize: 9, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 10, backgroundColor: `#${l.color}22`, color: `#${l.color}`, border: `1px solid #${l.color}44` }}>{l.name}</span>
                  ))}
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-dim)' }}>@{i.user} · {timeAgo(i.createdAt)} · {i.comments} comments</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {activeTab === 'prs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(detail?.pulls || []).length === 0 ? (
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No open pull requests.</p>
          ) : detail.pulls.map((p: any) => (
            <a key={p.id} href={p.htmlUrl} target="_blank" rel="noopener noreferrer" className="s-spotlight" style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, padding: 20, backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 14, textDecoration: 'none', transition: 'border-color .2s'
            }}>
              <GitPullRequest className="w-4 h-4" style={{ color: '#10B981', marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginRight: 8 }}>#{p.number}</span>
                  {p.title} {p.draft && <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--text-dim)', marginLeft: 6 }}>DRAFT</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-dim)' }}>
                  @{p.user} · {p.head} → {p.base} · {timeAgo(p.createdAt)}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {activeTab === 'commits' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(detail?.commits || []).map((c: any) => (
            <a key={c.fullSha} href={c.htmlUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 12, textDecoration: 'none', transition: 'border-color .2s'
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#10B981', flexShrink: 0, width: 60 }}>{c.sha}</span>
              {c.avatar && <img src={c.avatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{c.author} · {timeAgo(c.date)}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
