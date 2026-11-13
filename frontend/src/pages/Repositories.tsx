import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Globe, Trash2 } from 'lucide-react'
import { useRepositoriesQuery, useImportRepositoryMutation, useDeleteRepositoryMutation } from '@/hooks/useApi'
import { apiGet } from '@/services/api'

/**
 * Try to parse a GitHub identifier from:
 *   https://github.com/owner/repo
 *   github.com/owner/repo
 *   owner/repo
 * Returns { owner, repo } or null.
 */
function parseGitHubInput(input: string): { owner: string; repo: string } | null {
  if (!input?.trim()) return null
  const cleaned = input.trim().replace(/\/+$/, '')

  const urlMatch = cleaned.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?$/i
  )
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] }

  const slashMatch = cleaned.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/)
  if (slashMatch) return { owner: slashMatch[1], repo: slashMatch[2] }

  return null
}

export default function Repositories() {
  const { data: repositories = [], isLoading } = useRepositoriesQuery()
  const importMutation = useImportRepositoryMutation()
  const deleteMutation = useDeleteRepositoryMutation()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [repoToDelete, setRepoToDelete] = useState<any | null>(null)

  // Form fields for the import modal
  const [repoInput, setRepoInput] = useState('')
  const [language, setLanguage] = useState('TypeScript')
  const [visibility, setVisibility] = useState('public')
  const [githubToken, setGithubToken] = useState('')

  // GitHub preview state
  const [ghPreview, setGhPreview] = useState<any>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState('')

  // Import state
  const [modalError, setModalError] = useState('')
  const [importSuccess, setImportSuccess] = useState('')

  // Detect if input is a GitHub URL/owner-repo
  const parsed = parseGitHubInput(repoInput)
  const isGitHubInput = !!parsed

  // Debounced GitHub preview fetch
  const fetchPreview = useCallback(async (owner: string, repo: string, token?: string) => {
    setPreviewLoading(true)
    setPreviewError('')
    setGhPreview(null)
    try {
      const url = token
        ? `/repositories/github-info/${owner}/${repo}?token=${encodeURIComponent(token)}`
        : `/repositories/github-info/${owner}/${repo}`
      const data = await apiGet(url)
      if (data.success && data.data) {
        setGhPreview(data.data)
        if (data.data.visibility) {
          setVisibility(data.data.visibility)
        }
      } else {
        setVisibility('private')
        setPreviewError(data.message || "This repository is private. We can't access it.")
      }
    } catch (err: any) {
      setVisibility('private')
      setPreviewError(err.message || "This repository is private. We can't access it.")
    } finally {
      setPreviewLoading(false)
    }
  }, [])

  // Trigger preview when user types a valid GitHub URL or modifies token
  useEffect(() => {
    setGhPreview(null)
    setPreviewError('')

    if (!parsed) return

    const timer = setTimeout(() => {
      fetchPreview(parsed.owner, parsed.repo, githubToken.trim() || undefined)
    }, 600) // debounce 600ms

    return () => clearTimeout(timer)
  }, [repoInput, githubToken])

  // Filter the repo list by the search input
  const filtered = repositories.filter(repo =>
    repo.name.toLowerCase().includes(search.toLowerCase()) ||
    (repo.language || '').toLowerCase().includes(search.toLowerCase()) ||
    (repo.fullName && repo.fullName.toLowerCase().includes(search.toLowerCase())) ||
    (repo.description && repo.description.toLowerCase().includes(search.toLowerCase()))
  )

  // Called when the user clicks "Import Repository" button in the modal
  async function handleImport() {
    setModalError('')
    setImportSuccess('')

    const trimmed = repoInput.trim()
    if (!trimmed) {
      setModalError('Please enter a GitHub repository (e.g. facebook/react) or a custom name.')
      return
    }

    if (isGitHubInput && previewError) {
      setModalError(previewError)
      return
    }

    try {
      const imported = await importMutation.mutateAsync({
        name: trimmed,
        language: !isGitHubInput ? language : undefined,
        visibility: visibility, // Always preserve chosen visibility (public or private)
        githubToken: githubToken.trim() || undefined
      })

      // Success
      setImportSuccess(isGitHubInput
        ? (visibility === 'private'
            ? `✅ Private repository imported successfully!`
            : `✅ Repository imported with live GitHub data!`)
        : `✅ Repository "${trimmed}" created successfully!`
      )

      if (imported?.id) {
        setTimeout(() => {
          navigate(`/repositories/${imported.id}/analysis`)
        }, 1200)
      } else {
        setTimeout(() => {
          closeModal()
        }, 1200)
      }
    } catch (err: any) {
      setModalError(err.message || "This repository is private. We can't access it.")
    }
  }

  function closeModal() {
    setShowImportModal(false)
    setRepoInput('')
    setLanguage('TypeScript')
    setVisibility('public')
    setGithubToken('')
    setGhPreview(null)
    setPreviewError('')
    setModalError('')
    setImportSuccess('')
  }

  // Format large numbers
  function formatNumber(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
    return n.toString()
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-.015em', color: 'var(--text)', marginBottom: '8px' }}>
            Repositories
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
            {repositories.length} repositories in your studio workspace.
          </p>
        </div>
        <button className="s-btn" onClick={() => setShowImportModal(true)}>
          Import Repository
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '32px' }}>
        <input
          type="text"
          className="s-form__input"
          placeholder="Search by name, language, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Repository Table */}
      <div className="s-panel" style={{ padding: '0', overflowX: 'auto' }}>
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' }}>
            LOADING REPOSITORIES...
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
                  <td className="s-work__td" style={{ paddingLeft: '32px' }}>
                    <div>
                      <div className="s-work__name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link to={`/repositories/${repo.id}`} style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color .2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#10B981'} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}>
                          {repo.fullName || repo.name}
                        </Link>
                        {repo.source === 'github' && (
                          <span style={{
                            fontSize: '9px',
                            fontFamily: 'var(--font-mono)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            color: '#10B981',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            fontWeight: 600
                          }}>
                            GITHUB
                          </span>
                        )}
                      </div>
                      {repo.description && (
                        <div style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          marginTop: '4px',
                          maxWidth: '340px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {repo.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="s-work__td s-work__meta">{repo.language}</td>
                  <td className="s-work__td s-work__meta">
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      backgroundColor: repo.visibility === 'private' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.1)',
                      color: repo.visibility === 'private' ? '#F87171' : '#10B981',
                      border: `1px solid ${repo.visibility === 'private' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.25)'}`,
                      fontWeight: 600,
                      letterSpacing: '0.04em'
                    }}>
                      {repo.visibility === 'private' ? <Lock size={11} /> : <Globe size={11} />}
                      {repo.visibility === 'private' ? 'Private' : 'Public'}
                    </span>
                  </td>
                  <td className="s-work__td s-work__meta">
                    ★ {formatNumber(repo.stars)} &nbsp; ⑂ {formatNumber(repo.forks)} &nbsp; ⊙ {repo.openIssues}
                  </td>
                  <td className="s-work__td s-work__status s-work__status--active" style={{ paddingRight: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>SYNCED</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Link
                          to={`/pipeline?repoId=${repo.id}`}
                          style={{
                            fontSize: '9px',
                            fontFamily: 'var(--font-mono)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'linear-gradient(135deg, rgba(89,9,7,0.7), rgba(89,9,7,0.35))',
                            color: '#E8D2B5',
                            border: '1px solid rgba(232,210,181,0.3)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            textDecoration: 'none',
                            textAlign: 'center'
                          }}
                        >
                          PIPELINE
                        </Link>
                        <Link
                          to={`/code-flow?repoId=${repo.id}`}
                          style={{
                            fontSize: '9px',
                            fontFamily: 'var(--font-mono)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'linear-gradient(135deg, rgba(89,9,7,0.7), rgba(89,9,7,0.35))',
                            color: '#E8D2B5',
                            border: '1px solid rgba(232,210,181,0.3)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            textDecoration: 'none',
                            textAlign: 'center'
                          }}
                        >
                          CODE FLOW
                        </Link>
                      </div>
                      {repo.source === 'github' && (
                        <Link
                          to={`/repositories/${repo.id}/analysis`}
                          style={{
                            fontSize: '9px',
                            fontFamily: 'var(--font-mono)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#10B981',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            textDecoration: 'none'
                          }}
                        >
                          ANALYZE
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => setRepoToDelete(repo)}
                        title="Remove repository from workspace"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#F87171',
                          cursor: 'pointer',
                          fontSize: '9px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)'
                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'
                        }}
                      >
                        <Trash2 size={11} />
                        <span>REMOVE</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {search ? 'NO REPOSITORIES MATCH YOUR SEARCH' : 'NO REPOSITORIES YET — CLICK "IMPORT REPOSITORY" TO ADD ONE'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Import Modal ─────────────────────────────────────────────────────── */}
      {showImportModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

          {/* Backdrop — click to close */}
          <div
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26,25,23,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={closeModal}
          />

          {/* Modal Card */}
          <div className="s-panel" style={{ position: 'relative', zIndex: 101, width: '100%', maxWidth: '520px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>

            <h2 className="s-panel__title">Import Repository</h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
              Paste a GitHub repository URL, enter owner/repo, or type a custom name.
            </p>

            {/* Quick Sample Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>QUICK SAMPLES:</span>
              {[
                { name: 'facebook/react', label: 'React' },
                { name: 'vercel/next.js', label: 'Next.js' },
                { name: 'tailwindlabs/tailwindcss', label: 'Tailwind' }
              ].map(s => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => {
                    setRepoInput(s.name)
                    setModalError('')
                    setImportSuccess('')
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#10B981'
                    e.currentTarget.style.color = '#10B981'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>

              {/* Repo URL / Name */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  GITHUB URL OR REPOSITORY NAME *
                </label>
                <input
                  type="text"
                  className="s-form__input"
                  placeholder="e.g. https://github.com/facebook/react or owner/repo"
                  value={repoInput}
                  onChange={(e) => {
                    setRepoInput(e.target.value)
                    setModalError('')
                    setImportSuccess('')
                  }}
                  style={{ width: '100%' }}
                  autoFocus
                />
                {isGitHubInput && (
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#10B981',
                    marginTop: '4px',
                    letterSpacing: '0.05em'
                  }}>
                    ✓ GitHub repository detected — will fetch live data
                  </div>
                )}
              </div>

              {/* GitHub Preview Card */}
              {isGitHubInput && previewLoading && (
                <div style={{
                  padding: '16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid #10B981',
                    borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Fetching repository data from GitHub...
                </div>
              )}

              {isGitHubInput && previewError && (
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#EF4444',
                  padding: '14px 16px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <Lock size={15} color="#EF4444" />
                    <span>{previewError}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    This repository is private or inaccessible. We can't access it without authentication. If you own or have access to this repository, enter your GitHub Personal Access Token (PAT) below to authenticate.
                  </div>
                </div>
              )}

              {isGitHubInput && ghPreview && (
                <div style={{
                  padding: '16px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.04)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    {ghPreview.avatarUrl && (
                      <img
                        src={ghPreview.avatarUrl}
                        alt={ghPreview.owner}
                        style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                      />
                    )}
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                        {ghPreview.fullName}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span>{ghPreview.language}</span>
                        <span>·</span>
                        <span style={{
                          color: visibility === 'private' ? '#EF4444' : '#10B981',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          {visibility === 'private' ? <Lock size={10} /> : <Globe size={10} />}
                          {visibility}
                        </span>
                      </div>
                    </div>
                  </div>
                  {ghPreview.description && (
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.5 }}>
                      {ghPreview.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>★ {formatNumber(ghPreview.stars)}</span>
                    <span>⑂ {formatNumber(ghPreview.forks)}</span>
                    <span>⊙ {ghPreview.openIssues} issues</span>
                    <span>👁 {formatNumber(ghPreview.watchers)}</span>
                  </div>
                  {ghPreview.topics && ghPreview.topics.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      {ghPreview.topics.slice(0, 6).map((topic: string) => (
                        <span key={topic} style={{
                          fontSize: '9px',
                          fontFamily: 'var(--font-mono)',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: '#10B981',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Language selection for custom non-GitHub repos */}
              {!isGitHubInput && repoInput.trim() && (
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    LANGUAGE
                  </label>
                  <select
                    className="s-form__input"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {/* Visibility Selector - ALWAYS available */}
              {repoInput.trim() && (
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    VISIBILITY
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setVisibility('public')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${visibility === 'public' ? '#10B981' : 'var(--border)'}`,
                        backgroundColor: visibility === 'public' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        color: visibility === 'public' ? '#10B981' : 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Globe size={13} />
                      <span>Public</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibility('private')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${visibility === 'private' ? '#EF4444' : 'var(--border)'}`,
                        backgroundColor: visibility === 'private' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        color: visibility === 'private' ? '#EF4444' : 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Lock size={13} />
                      <span>Private</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Optional GitHub Token for private repository live access */}
              {isGitHubInput && (visibility === 'private' || !!previewError) && (
                <div style={{
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.04)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#F87171', fontWeight: 600 }}>
                      GITHUB ACCESS TOKEN {previewError ? '(REQUIRED FOR ACCESS)' : '(OPTIONAL)'}
                    </label>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
                      repo scope
                    </span>
                  </div>
                  <input
                    type="password"
                    className="s-form__input"
                    placeholder="ghp_... (paste classic PAT to authenticate private access)"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    style={{ width: '100%', fontSize: '11px' }}
                  />
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
                    🔒 Used securely to authenticate with GitHub and verify access to private repositories.
                  </div>
                </div>
              )}

              {/* Success message */}
              {importSuccess && (
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#10B981',
                  padding: '14px 16px',
                  border: '1px solid rgba(16,185,129,0.4)',
                  background: 'rgba(16,185,129,0.08)',
                  borderRadius: '8px',
                  lineHeight: 1.7
                }}>
                  <div>{importSuccess}</div>
                  {isGitHubInput && (
                    <div style={{ marginTop: 6, color: 'rgba(16,185,129,0.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', border: '2px solid #10B981', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                      Launching deep analysis...
                    </div>
                  )}
                </div>
              )}

              {/* Error message */}
              {modalError && (
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#EF4444',
                  padding: '12px 16px',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600
                }}>
                  <Lock size={15} color="#EF4444" />
                  <span>{modalError}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="s-btn s-btn--outline" onClick={closeModal} disabled={importMutation.isPending}>
                Cancel
              </button>
              <button
                className="s-btn"
                onClick={handleImport}
                disabled={importMutation.isPending || (isGitHubInput && previewLoading) || (isGitHubInput && !!previewError) || !!importSuccess}
              >
                {importMutation.isPending
                  ? 'Importing...'
                  : isGitHubInput
                    ? 'Import from GitHub'
                    : 'Import Repository'
                }
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Remove Repository Confirmation Modal ────────────────────────────── */}
      {repoToDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10, 9, 8, 0.75)', backdropFilter: 'blur(6px)' }}
            onClick={() => !deleteMutation.isPending && setRepoToDelete(null)}
          />

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#141210',
              borderRadius: '16px',
              border: '1px solid rgba(89, 9, 7, 0.65)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 32px rgba(89, 9, 7, 0.35)',
              padding: '24px',
              zIndex: 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F87171',
                  flexShrink: 0
                }}
              >
                <Trash2 size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: '0 0 6px',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '19px',
                    color: '#F5F5F4',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Remove Repository
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#A8A29E', lineHeight: '1.5' }}>
                  Are you sure you want to remove <strong style={{ color: '#E8D2B5', fontFamily: 'monospace' }}>{repoToDelete.fullName || repoToDelete.name}</strong> from your studio workspace? This will unlink the repository and its active pipeline records.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                className="s-btn s-btn--outline"
                onClick={() => setRepoToDelete(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deleteMutation.mutateAsync(repoToDelete.id)
                    setRepoToDelete(null)
                  } catch (err: any) {
                    alert(err.message || 'Failed to remove repository')
                  }
                }}
                disabled={deleteMutation.isPending}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#590907',
                  border: '1px solid rgba(232, 210, 181, 0.35)',
                  color: '#E8D2B5',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                  cursor: deleteMutation.isPending ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 12px rgba(89, 9, 7, 0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 size={13} />
                {deleteMutation.isPending ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline CSS for spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  )
}
