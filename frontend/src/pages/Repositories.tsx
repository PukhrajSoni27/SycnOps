import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRepositoriesQuery, useImportRepositoryMutation } from '@/hooks/useApi'
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
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)

  // Form fields for the import modal
  const [repoInput, setRepoInput] = useState('')
  const [language, setLanguage] = useState('TypeScript')
  const [visibility, setVisibility] = useState('public')

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
  const fetchPreview = useCallback(async (owner: string, repo: string) => {
    setPreviewLoading(true)
    setPreviewError('')
    setGhPreview(null)
    try {
      const data = await apiGet(`/repositories/github-info/${owner}/${repo}`)
      if (data.success && data.data) {
        setGhPreview(data.data)
      } else {
        setPreviewError(data.message || 'Repository not found on GitHub.')
      }
    } catch (err: any) {
      setPreviewError(err.message || 'Could not fetch repository info.')
    } finally {
      setPreviewLoading(false)
    }
  }, [])

  // Trigger preview when user types a valid GitHub URL
  useEffect(() => {
    setGhPreview(null)
    setPreviewError('')

    if (!parsed) return

    const timer = setTimeout(() => {
      fetchPreview(parsed.owner, parsed.repo)
    }, 600) // debounce 600ms

    return () => clearTimeout(timer)
  }, [repoInput]) // eslint-disable-line react-hooks/exhaustive-deps

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

    if (!parsed) {
      setModalError('Enter a GitHub URL or owner/repo, for example facebook/react.')
      return
    }

    try {
      const imported = await importMutation.mutateAsync({
        name: repoInput.trim()
      })

      // Success
      setImportSuccess(isGitHubInput
        ? `✅ Repository imported with live GitHub data!`
        : `✅ Repository imported successfully!`
      )

      // For GitHub imports: navigate to analysis after a short delay
      if (isGitHubInput && imported?.id) {
        setTimeout(() => {
          navigate(`/repositories/${imported.id}/analysis`)
        }, 1200)
      } else {
        // Auto-close modal for manual imports
        setTimeout(() => {
          setShowImportModal(false)
          setRepoInput('')
          setLanguage('TypeScript')
          setVisibility('public')
          setGhPreview(null)
          setImportSuccess('')
        }, 1500)
      }
    } catch (err: any) {
      setModalError(err.message || 'Import failed. Please try again.')
    }
  }

  function closeModal() {
    setShowImportModal(false)
    setRepoInput('')
    setLanguage('TypeScript')
    setVisibility('public')
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
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-.015em', color: 'var(--ink)', marginBottom: '8px' }}>
            Repositories
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-2)' }}>
            {repositories.length} repositories imported from GitHub.
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
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)' }}>
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
                          color: 'var(--ink-2)',
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
                  <td className="s-work__td s-work__meta" style={{ textTransform: 'capitalize' }}>{repo.visibility}</td>
                  <td className="s-work__td s-work__meta">
                    ★ {formatNumber(repo.stars)} &nbsp; ⑂ {formatNumber(repo.forks)} &nbsp; ⊙ {repo.openIssues}
                  </td>
                  <td className="s-work__td s-work__status s-work__status--active" style={{ paddingRight: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span>SYNCED</span>
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
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-2)' }}>
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
          <div className="s-panel" style={{ position: 'relative', zIndex: 101, width: '100%', maxWidth: '520px', backgroundColor: 'var(--ground-2)' }}>

            <h2 className="s-panel__title">Import Repository</h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-2)', marginBottom: '28px', lineHeight: 1.6 }}>
              Paste a GitHub repository URL, enter owner/repo, or type a custom name.
            </p>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>

              {/* Repo URL / Name */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-2)', marginBottom: '6px' }}>
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
                  border: '1px solid var(--hair)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--ink-2)',
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
                  fontSize: '11px',
                  color: '#e74c3c',
                  padding: '10px 14px',
                  border: '1px solid #e74c3c',
                  background: 'rgba(231,76,60,0.08)',
                  borderRadius: '6px'
                }}>
                  ⚠ {previewError}
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
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                        {ghPreview.fullName}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-2)' }}>
                        {ghPreview.language} · {ghPreview.visibility}
                      </div>
                    </div>
                  </div>
                  {ghPreview.description && (
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--ink-2)', marginBottom: '10px', lineHeight: 1.5 }}>
                      {ghPreview.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-2)' }}>
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

              {/* Only show language/visibility pickers for non-GitHub imports */}
              {!isGitHubInput && repoInput.trim() && (
                <>
                  {/* Language */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-2)', marginBottom: '6px' }}>
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

                  {/* Visibility */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-2)', marginBottom: '6px' }}>
                      VISIBILITY
                    </label>
                    <select
                      className="s-form__input"
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </>
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
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#e74c3c', padding: '10px 14px', border: '1px solid #e74c3c', background: 'rgba(231,76,60,0.08)', borderRadius: '6px' }}>
                  ⚠ {modalError}
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
                disabled={importMutation.isPending || (isGitHubInput && previewLoading) || !!importSuccess}
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

      {/* Inline CSS for spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  )
}
