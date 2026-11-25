import React, { useState, useEffect } from 'react'
import {
  GitPullRequest, Search, Clock, Filter,
  GitMerge, GitBranch, AlertCircle, FileCode,
  Users, RefreshCw, ExternalLink, Circle,
  Sparkles, CheckCircle2, XCircle, ShieldCheck, ShieldAlert,
  ArrowRight, FileDiff, Check, ChevronDown, ChevronUp, Lock
} from 'lucide-react'
import { usePullRequestsQuery, useRepositoriesQuery } from '@/hooks/useApi'
import { useRepositoryContext } from '@/context/RepositoryContext'
import {
  type AIPatch,
  type SyncOpsPRRecord,
  fetchRepoPatches,
  preparePullRequest,
  validatePullRequest,
  createPullRequest,
  syncPullRequestStatus
} from '@/services/api'

// Status badge config
const STATUS_CONFIG = {
  open: { label: 'Open', bg: 'rgba(56,189,248,0.12)', color: '#38BDF8', border: 'rgba(56,189,248,0.3)', icon: Circle },
  merged: { label: 'Merged', bg: 'rgba(16,185,129,0.12)', color: '#10B981', border: 'rgba(16,185,129,0.3)', icon: GitMerge },
  closed: { label: 'Closed', bg: 'rgba(239,68,68,0.12)', color: '#EF4444', border: 'rgba(239,68,68,0.3)', icon: AlertCircle },
  failed: { label: 'Failed', bg: 'rgba(220,38,38,0.18)', color: '#F87171', border: 'rgba(220,38,38,0.4)', icon: XCircle },
  draft: { label: 'Draft', bg: 'rgba(148,163,184,0.12)', color: '#94A3B8', border: 'rgba(148,163,184,0.3)', icon: FileCode },
}

function StatusBadge({ status, draft }: { status: string; draft?: boolean }) {
  const key = draft ? 'draft' : (status in STATUS_CONFIG ? status : 'open')
  const cfg = STATUS_CONFIG[key as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.open
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
  const { selectedRepo, selectedRepoId: contextRepoId } = useRepositoryContext()
  const [repoFilter, setRepoFilter] = useState('selected')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'merged' | 'closed'>('all')

  const effectiveRepoId =
    repoFilter === 'all'
      ? undefined
      : repoFilter !== 'selected'
        ? repoFilter
        : (contextRepoId || undefined)

  const { data: pullRequests = [], isLoading, refetch, isFetching } = usePullRequestsQuery(effectiveRepoId)
  const { data: repositories = [] } = useRepositoriesQuery()

  // Reset local filter when global topbar repository changes
  useEffect(() => {
    setRepoFilter('selected')
  }, [contextRepoId])

  // PR Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [selectedRepoId, setSelectedRepoId] = useState<string>(contextRepoId || '')
  const [availablePatches, setAvailablePatches] = useState<AIPatch[]>([])
  const [selectedPatchIds, setSelectedPatchIds] = useState<string[]>([])
  const [expandedDiffId, setExpandedDiffId] = useState<string | null>(null)
  const [loadingPatches, setLoadingPatches] = useState(false)

  // Step 2: Branch & Commit
  const [branchName, setBranchName] = useState('')
  const [baseBranch, setBaseBranch] = useState('main')
  const [commitMessage, setCommitMessage] = useState('')
  const [workingTreeClean, setWorkingTreeClean] = useState<boolean | null>(null)
  const [uncommittedFiles, setUncommittedFiles] = useState<string[]>([])
  const [checkingWorkingTree, setCheckingWorkingTree] = useState(false)

  // Step 3: Validation
  const [runTests, setRunTests] = useState(true)
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [overrideValidation, setOverrideValidation] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Step 4: Review & Create
  const [prTitle, setPrTitle] = useState('')
  const [prDescription, setPrDescription] = useState('')
  const [githubToken, setGithubToken] = useState('')
  const [isDraftPR, setIsDraftPR] = useState(false)
  const [confirmedByUser, setConfirmedByUser] = useState(false)
  const [isCreatingPR, setIsCreatingPR] = useState(false)
  const [createdPR, setCreatedPR] = useState<SyncOpsPRRecord | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)

  // Syncing status on single PR card
  const [syncingPrId, setSyncingPrId] = useState<string | null>(null)

  // Compute summary stats
  const open = pullRequests.filter(p => p.status === 'open').length
  const merged = pullRequests.filter(p => p.status === 'merged').length
  const closed = pullRequests.filter(p => p.status === 'closed').length
  const drafts = pullRequests.filter((p: any) => p.draft).length
  const aiRemediations = pullRequests.filter((p: any) => p.aiFix).length
  const mergeRate = pullRequests.length > 0 ? Math.round((merged / pullRequests.length) * 100) : 0
  const authors = [...new Set(pullRequests.map(p => p.author).filter(Boolean))]

  // Handle URL query parameters (e.g. ?create=true&repoId=501&patchId=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('create') === 'true') {
      const paramRepo = params.get('repoId')
      const paramPatch = params.get('patchId')
      if (paramRepo) setSelectedRepoId(paramRepo)
      if (paramPatch) setSelectedPatchIds([paramPatch])
      setIsModalOpen(true)
      // Clean query string
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  // Auto-select first repo if none selected when modal opens
  useEffect(() => {
    if (isModalOpen && !selectedRepoId && repositories.length > 0) {
      setSelectedRepoId(String(repositories[0].id))
    }
  }, [isModalOpen, selectedRepoId, repositories])

  // Fetch patches whenever selectedRepoId changes in modal
  useEffect(() => {
    if (!isModalOpen || !selectedRepoId) return
    let active = true
    setLoadingPatches(true)
    fetchRepoPatches(selectedRepoId)
      .then((patches) => {
        if (!active) return
        setAvailablePatches(patches)
        // If no patch selected yet, select proposed and applied patches by default
        if (selectedPatchIds.length === 0 && patches.length > 0) {
          const defaultSelect = patches.filter(p => p.status === 'proposed' || p.status === 'applied').map(p => p.patchId)
          if (defaultSelect.length > 0) setSelectedPatchIds(defaultSelect)
          else setSelectedPatchIds([patches[0].patchId])
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch repo patches:', err)
        setAvailablePatches([])
      })
      .finally(() => {
        if (active) setLoadingPatches(false)
      })
    return () => { active = false }
  }, [isModalOpen, selectedRepoId])

  // Filter logic
  const filtered = pullRequests.filter(pr => {
    const matchSearch = pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.author?.toLowerCase().includes(search.toLowerCase()) ||
      pr.repo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || pr.status === statusFilter
    const matchRepo = repoFilter === 'selected' || repoFilter === 'all' || pr.repo === repoFilter ||
      pr.repo.startsWith(repoFilter + '/') || pr.repo.endsWith('/' + repoFilter)
    return matchSearch && matchStatus && matchRepo
  })

  // Group by repo
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
      closed: repoPRs.filter(p => p.status === 'closed').length,
    }
  }).filter(r => r.total > 0)

  // ── Step 1 -> Step 2: Prepare PR details
  const handleProceedToStep2 = async () => {
    if (selectedPatchIds.length === 0) return
    setCheckingWorkingTree(true)
    setWorkingTreeClean(null)
    setUncommittedFiles([])

    try {
      const res = await preparePullRequest(selectedRepoId, {
        patchIds: selectedPatchIds,
        baseBranch: baseBranch || 'main'
      })

      if (res.success && res.data) {
        setBranchName(res.data.branchName)
        setBaseBranch(res.data.baseBranch)
        setCommitMessage(res.data.proposedCommit)
        setPrTitle(res.data.proposedTitle)
        setPrDescription(res.data.proposedDescription)
        setWorkingTreeClean(true)
        setModalStep(2)
      } else {
        if (res.error === 'UNCOMMITTED_CHANGES') {
          setWorkingTreeClean(false)
          setUncommittedFiles(res.modifiedFiles || [])
        }
      }
    } catch (err: any) {
      if (err.message?.includes('uncommitted') || err.error === 'UNCOMMITTED_CHANGES') {
        setWorkingTreeClean(false)
        setUncommittedFiles(err.modifiedFiles || ['Working tree files'])
      } else {
        alert(err.message || 'Failed to prepare pull request')
      }
    } finally {
      setCheckingWorkingTree(false)
    }
  }

  // ── Step 2 -> Step 3: Run Validation
  const handleProceedToStep3 = async () => {
    // Validate branch name locally
    const norm = branchName.trim().toLowerCase()
    if (norm === 'main' || norm === 'master' || norm === baseBranch.toLowerCase()) {
      alert(`Branch name cannot match protected base branch "${baseBranch}". Please specify an isolated fix branch.`)
      return
    }

    setModalStep(3)
    setIsValidating(true)
    setValidationError(null)
    setValidationResult(null)

    try {
      const res = await validatePullRequest(selectedRepoId, {
        patchIds: selectedPatchIds,
        branchName: branchName.trim(),
        baseBranch: baseBranch.trim(),
        runTests
      })

      if (res.success && res.data) {
        setValidationResult(res.data.validation)
      } else {
        setValidationError(res.message || 'Quality validation encountered an issue.')
      }
    } catch (err: any) {
      setValidationError(err.message || 'Failed to execute quality validation.')
    } finally {
      setIsValidating(false)
    }
  }

  // ── Step 3 -> Step 4: Review PR
  const handleProceedToStep4 = () => {
    setModalStep(4)
  }

  // ── Step 4 -> Create PR on GitHub
  const handleCreatePR = async () => {
    if (!confirmedByUser) {
      alert('Please check the confirmation box to authorize creating this commit and pull request.')
      return
    }

    setIsCreatingPR(true)
    setCreateError(null)

    try {
      const res = await createPullRequest(selectedRepoId, {
        patchIds: selectedPatchIds,
        branchName: branchName.trim(),
        baseBranch: baseBranch.trim(),
        commitMessage: commitMessage.trim(),
        title: prTitle.trim(),
        description: prDescription.trim(),
        githubToken: githubToken.trim() || undefined,
        overrideValidation,
        runTests,
        draft: isDraftPR,
        confirmed: true
      })

      if (res.success && res.data) {
        setCreatedPR(res.data)
        setModalStep(5)
        refetch()
      } else {
        setCreateError(res.message || 'Failed to create pull request.')
      }
    } catch (err: any) {
      setCreateError(err.message || 'An error occurred while creating the GitHub Pull Request.')
    } finally {
      setIsCreatingPR(false)
    }
  }

  // Single PR Live Status Sync
  const handleSyncPR = async (pr: any) => {
    const repoMatch = repositories.find(r => r.fullName === pr.repo || r.name === pr.repo)
    const repoId = repoMatch?.id || pr.repositoryId || selectedRepoId
    if (!repoId) return

    setSyncingPrId(String(pr.id))
    try {
      await syncPullRequestStatus(repoId, pr.prId || pr.id)
      await refetch()
    } catch (err) {
      console.warn('Sync failed:', err)
    } finally {
      setSyncingPrId(null)
    }
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(12px)',
    border: '1px solid var(--border)', borderRadius: '16px', padding: '24px',
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B' }}>
            STAGE 6 · AUTOMATED AI REMEDIATION PIPELINE
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text)', marginTop: 4 }}>
            Pull Requests
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: 4 }}>
            Live GitHub synchronization and automated AI fix pull request generation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Create AI Fix PR Button */}
          <button
            onClick={() => {
              setModalStep(1)
              setCreatedPR(null)
              setCreateError(null)
              setIsModalOpen(true)
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 10,
              background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
              border: '1px solid #F59E0B',
              color: '#FFF',
              boxShadow: '0 4px 15px rgba(220, 38, 38, 0.35)',
              fontFamily: 'var(--font-tech)', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.08em', cursor: 'pointer',
              transition: 'all 0.25s'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.35)' }}
          >
            <Sparkles style={{ width: 15, height: 15, color: '#FCD34D' }} />
            CREATE AI FIX PR
          </button>

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
      </div>

      {/* ── Summary Stats Row ── */}
      {!isLoading && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <StatPill label="Total PRs" value={pullRequests.length} color="var(--text)" />
          <StatPill label="Open" value={open} color="#38BDF8" />
          <StatPill label="Merged" value={merged} color="#10B981" />
          <StatPill label="Closed" value={closed} color="#EF4444" />
          <StatPill label="AI Fix PRs" value={aiRemediations} color="#F59E0B" />
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

        {repositories.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter style={{ width: 13, height: 13, color: 'var(--text-dim)' }} />
            <select
              value={repoFilter}
              onChange={e => setRepoFilter(e.target.value)}
              style={{ padding: '9px 12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="selected">Active Repo ({selectedRepo?.name || 'Workspace'})</option>
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
              ? 'Import a GitHub repository and generate an AI Fix to create pull requests here.'
              : search ? `No PRs match "${search}"` : 'Try changing the filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          <p style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
            SHOWING {filtered.length} OF {pullRequests.length} PULL REQUESTS
          </p>
          {filtered.map((pr: any) => (
            <div
              key={pr.id}
              style={{
                ...cardStyle,
                display: 'flex', alignItems: 'flex-start',
                justifyContent: 'space-between', gap: 20, flexWrap: 'wrap',
                transition: 'border-color 0.2s, transform 0.15s',
                borderLeft: pr.aiFix
                  ? '3px solid #F59E0B'
                  : `3px solid ${pr.status === 'merged' ? '#10B981' : pr.status === 'open' ? '#38BDF8' : '#EF4444'}`
              }}
            >
              {/* Left: icon + info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 260 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0, marginTop: 2,
                  backgroundColor: pr.aiFix
                    ? 'rgba(245, 158, 11, 0.15)'
                    : pr.status === 'merged' ? 'rgba(16,185,129,0.1)' : pr.status === 'open' ? 'rgba(56,189,248,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${pr.aiFix ? 'rgba(245, 158, 11, 0.4)' : pr.status === 'merged' ? 'rgba(16,185,129,0.25)' : pr.status === 'open' ? 'rgba(56,189,248,0.25)' : 'rgba(239,68,68,0.25)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: pr.aiFix ? '#F59E0B' : pr.status === 'merged' ? '#10B981' : pr.status === 'open' ? '#38BDF8' : '#EF4444'
                }}>
                  {pr.aiFix ? <Sparkles style={{ width: 17, height: 17 }} /> : pr.status === 'merged' ? <GitMerge style={{ width: 16, height: 16 }} /> : <GitPullRequest style={{ width: 16, height: 16 }} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    {pr.number && <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-dim)' }}>#{pr.number}</span>}
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>
                      {pr.title}
                    </h3>

                    {/* AI Fix Badge */}
                    {pr.aiFix && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontFamily: 'var(--font-tech)', fontSize: '9px', fontWeight: 700,
                        letterSpacing: '0.1em', padding: '2px 8px', borderRadius: 999,
                        backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FCD34D',
                        border: '1px solid rgba(245, 158, 11, 0.35)'
                      }}>
                        <ShieldCheck style={{ width: 10, height: 10 }} /> AI FIX REMEDIATION
                      </span>
                    )}

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

                    {/* Validation Summary if AI PR */}
                    {pr.validationSummary && (
                      <>
                        <span>·</span>
                        <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <CheckCircle2 style={{ width: 11, height: 11 }} /> {pr.validationSummary.resolvedCount} Resolved
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: status + Sync + GitHub link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <StatusBadge status={pr.status} draft={pr.draft} />

                {/* Sync status button */}
                <button
                  onClick={() => handleSyncPR(pr)}
                  disabled={syncingPrId === String(pr.id)}
                  title="Synchronize status live with GitHub"
                  style={{
                    padding: '6px 10px', borderRadius: 8,
                    backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                    color: 'var(--text-muted)', cursor: syncingPrId === String(pr.id) ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4, fontSize: '10px', fontFamily: 'var(--font-tech)',
                    transition: 'all 0.15s'
                  }}
                >
                  <RefreshCw style={{ width: 11, height: 11, animation: syncingPrId === String(pr.id) ? 'spin 1s linear infinite' : 'none' }} />
                  {syncingPrId === String(pr.id) ? 'Syncing…' : 'Sync'}
                </button>

                {pr.htmlUrl && (
                  <a
                    href={pr.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 12px', borderRadius: 8,
                      backgroundColor: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)',
                      color: '#38BDF8', textDecoration: 'none', fontSize: '11px', fontFamily: 'var(--font-tech)'
                    }}
                  >
                    <span>GitHub PR</span>
                    <ExternalLink style={{ width: 11, height: 11 }} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          AI FIX PULL REQUEST CREATION MODAL WORKFLOW
          ══════════════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(7, 7, 9, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            width: '100%', maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto',
            backgroundColor: '#0D0D12', border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '20px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(220, 38, 38, 0.2)'
          }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid #DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FCD34D' }}>
                  <Sparkles style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#FFF', fontWeight: 400 }}>
                    Create AI Fix Pull Request
                  </h2>
                  <p style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                    STAGE 6 · AUTOMATED QUALITY REMEDIATION & GITHUB PR
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--text-muted)',
                  fontSize: '20px', cursor: 'pointer', padding: 4
                }}
              >
                ✕
              </button>
            </div>

            {/* Stepper Indicator */}
            {modalStep < 5 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, position: 'relative' }}>
                {[
                  { step: 1, label: 'Patches' },
                  { step: 2, label: 'Branch & Commit' },
                  { step: 3, label: 'Validation' },
                  { step: 4, label: 'Review & Create' },
                ].map(({ step, label }) => {
                  const active = modalStep === step
                  const done = modalStep > step
                  return (
                    <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1, flex: 1 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        backgroundColor: done ? '#10B981' : active ? '#DC2626' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${done ? '#10B981' : active ? '#F59E0B' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontFamily: 'var(--font-tech)', fontWeight: 700,
                        color: done || active ? '#FFF' : 'var(--text-muted)'
                      }}>
                        {done ? <Check style={{ width: 14, height: 14 }} /> : step}
                      </div>
                      <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? '#F59E0B' : done ? 'var(--emerald)' : 'var(--text-muted)' }}>
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── STEP 1: Repository & Patch Selection ── */}
            {modalStep === 1 && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#E8D2B5', marginBottom: 8, letterSpacing: '0.08em' }}>
                    1. SELECT TARGET REPOSITORY
                  </label>
                  <select
                    value={selectedRepoId}
                    onChange={(e) => {
                      setSelectedRepoId(e.target.value)
                      setSelectedPatchIds([])
                    }}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                      color: '#FFF', fontSize: '13px', outline: 'none'
                    }}
                  >
                    {repositories.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.fullName || r.name} ({r.language || 'Unknown'}) — Default branch: {r.defaultBranch || 'main'}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <label style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#E8D2B5', letterSpacing: '0.08em' }}>
                      2. SELECT APPROVED AI PATCHES TO INCLUDE ({selectedPatchIds.length} SELECTED)
                    </label>
                    {availablePatches.length > 0 && (
                      <button
                        onClick={() => {
                          if (selectedPatchIds.length === availablePatches.length) setSelectedPatchIds([])
                          else setSelectedPatchIds(availablePatches.map(p => p.patchId))
                        }}
                        style={{
                          background: 'transparent', border: 'none', color: 'var(--emerald)',
                          fontFamily: 'var(--font-tech)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline'
                        }}
                      >
                        {selectedPatchIds.length === availablePatches.length ? 'Deselect All' : 'Select All'}
                      </button>
                    )}
                  </div>

                  {loadingPatches ? (
                    <div style={{ padding: '32px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid var(--border)' }}>
                      <RefreshCw style={{ width: 18, height: 18, color: '#F59E0B', margin: '0 auto 8px', animation: 'spin 1s linear infinite' }} />
                      <p style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)' }}>Loading AI fixes for repository…</p>
                    </div>
                  ) : availablePatches.length === 0 ? (
                    <div style={{ padding: '36px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px dashed var(--border)' }}>
                      <AlertCircle style={{ width: 28, height: 28, color: '#F59E0B', margin: '0 auto 10px' }} />
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#FFF', marginBottom: 4 }}>No AI patches found for this repository.</p>
                      <p style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)' }}>
                        Go to the Code Quality scanner, run a scan, and generate AI fixes on findings first.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: 10, maxHeight: '340px', overflowY: 'auto' }}>
                      {availablePatches.map(patch => {
                        const isSelected = selectedPatchIds.includes(patch.patchId)
                        const isExpanded = expandedDiffId === patch.patchId
                        return (
                          <div
                            key={patch.patchId}
                            style={{
                              padding: '14px 16px', borderRadius: 12,
                              backgroundColor: isSelected ? 'rgba(220, 38, 38, 0.08)' : 'rgba(255,255,255,0.02)',
                              border: `1px solid ${isSelected ? 'rgba(245, 158, 11, 0.5)' : 'var(--border)'}`,
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedPatchIds(prev => [...prev, patch.patchId])
                                    else setSelectedPatchIds(prev => prev.filter(id => id !== patch.patchId))
                                  }}
                                  style={{ cursor: 'pointer', accentColor: '#DC2626' }}
                                />
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{
                                      fontFamily: 'var(--font-tech)', fontSize: '9px', fontWeight: 700,
                                      padding: '2px 6px', borderRadius: 4,
                                      backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)'
                                    }}>
                                      {patch.scanner.toUpperCase()}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#FFF', fontWeight: 600 }}>
                                      {patch.ruleId}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)' }}>
                                      {patch.filePath}:{patch.startLine}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#10B981' }}>
                                      +{patch.addedLinesCount || 0}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#EF4444' }}>
                                      -{patch.removedLinesCount || 0}
                                    </span>
                                  </div>
                                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
                                    {patch.explanation}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => setExpandedDiffId(isExpanded ? null : patch.patchId)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 4,
                                  background: 'transparent', border: 'none', color: '#E8D2B5',
                                  fontSize: '11px', fontFamily: 'var(--font-tech)', cursor: 'pointer'
                                }}
                              >
                                <FileDiff style={{ width: 12, height: 12 }} />
                                {isExpanded ? <ChevronUp style={{ width: 12, height: 12 }} /> : <ChevronDown style={{ width: 12, height: 12 }} />}
                              </button>
                            </div>

                            {/* Unified Diff Accordion */}
                            {isExpanded && patch.unifiedDiff && (
                              <div style={{ marginTop: 12, padding: 12, backgroundColor: '#070709', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.5, margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                                  {patch.unifiedDiff.split('\n').map((line, idx) => {
                                    const isAdd = line.startsWith('+') && !line.startsWith('+++')
                                    const isRem = line.startsWith('-') && !line.startsWith('---')
                                    return (
                                      <div key={idx} style={{ color: isAdd ? '#34D399' : isRem ? '#F87171' : 'var(--text-muted)' }}>
                                        {line}
                                      </div>
                                    )
                                  })}
                                </pre>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Working Tree Dirty Alert if any */}
                {workingTreeClean === false && (
                  <div style={{ marginBottom: 20, padding: 14, backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #DC2626', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#F87171', fontWeight: 600, fontSize: '13px' }}>
                      <ShieldAlert style={{ width: 16, height: 16 }} />
                      <span>Uncommitted Developer Changes Detected</span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#EBEBEB', marginTop: 4 }}>
                      To prevent accidental loss or overwriting, SyncOps requires working tree changes to be committed or stashed before creating an AI fix branch:
                    </p>
                    <ul style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#F87171', marginTop: 6, paddingLeft: 18 }}>
                      {uncommittedFiles.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{ padding: '10px 18px', borderRadius: 10, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleProceedToStep2}
                    disabled={selectedPatchIds.length === 0 || checkingWorkingTree}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 22px', borderRadius: 10,
                      background: selectedPatchIds.length > 0 ? 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${selectedPatchIds.length > 0 ? '#F59E0B' : 'var(--border)'}`,
                      color: selectedPatchIds.length > 0 ? '#FFF' : 'var(--text-muted)',
                      fontFamily: 'var(--font-tech)', fontSize: '12px', fontWeight: 700,
                      cursor: selectedPatchIds.length > 0 && !checkingWorkingTree ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {checkingWorkingTree ? (
                      <>
                        <RefreshCw style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
                        Checking Working Tree…
                      </>
                    ) : (
                      <>
                        <span>Configure Branch & Commit</span>
                        <ArrowRight style={{ width: 14, height: 14 }} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Branch & Commit Configuration ── */}
            {modalStep === 2 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#E8D2B5', marginBottom: 6 }}>
                      BASE BRANCH (PROTECTED DEFAULT)
                    </label>
                    <input
                      type="text"
                      value={baseBranch}
                      onChange={e => setBaseBranch(e.target.value)}
                      placeholder="main"
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 10,
                        backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                        color: 'var(--text-muted)', fontSize: '13px', outline: 'none'
                      }}
                    />
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-tech)', marginTop: 4, display: 'block' }}>
                      Never committed to directly.
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#E8D2B5', marginBottom: 6 }}>
                      ISOLATED FIX BRANCH NAME *
                    </label>
                    <input
                      type="text"
                      value={branchName}
                      onChange={e => setBranchName(e.target.value)}
                      placeholder="syncops/fix-security-findings"
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 10,
                        backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid #F59E0B',
                        color: '#FFF', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-mono)'
                      }}
                    />
                    <span style={{ fontSize: '10px', color: '#10B981', fontFamily: 'var(--font-tech)', marginTop: 4, display: 'block' }}>
                      Isolated branch for AI patch commit.
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#E8D2B5', marginBottom: 6 }}>
                    CONVENTIONAL COMMIT MESSAGE (PROPOSED PREVIEW)
                  </label>
                  <textarea
                    rows={6}
                    value={commitMessage}
                    onChange={e => setCommitMessage(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                      color: '#FFF', fontSize: '12px', outline: 'none', fontFamily: 'var(--font-mono)', lineHeight: 1.5
                    }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-tech)', marginTop: 4, display: 'block' }}>
                    Summarizes affected files and scanner diagnostic issues. Editable before submission.
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setModalStep(1)}
                    style={{ padding: '10px 18px', borderRadius: 10, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Back to Patches
                  </button>

                  <button
                    onClick={handleProceedToStep3}
                    disabled={!branchName.trim()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 22px', borderRadius: 10,
                      background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                      border: '1px solid #F59E0B', color: '#FFF',
                      fontFamily: 'var(--font-tech)', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    <span>Run Quality Validation</span>
                    <ArrowRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Quality Validation & Safe Test Policy ── */}
            {modalStep === 3 && (
              <div>
                <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#FFF', fontWeight: 500 }}>
                        Safe Execution Policy & Quality Check
                      </h4>
                      <p style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
                        Re-runs ESLint, Ruff, Semgrep and checks whether any new issues are introduced.
                      </p>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#E8D2B5' }}>
                      <input
                        type="checkbox"
                        checked={runTests}
                        onChange={e => setRunTests(e.target.checked)}
                        style={{ accentColor: '#10B981' }}
                      />
                      Run Safe Repository Tests
                    </label>
                  </div>
                </div>

                {isValidating ? (
                  <div style={{ padding: '48px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 20 }}>
                    <RefreshCw style={{ width: 28, height: 28, color: '#F59E0B', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: '#FFF' }}>Executing Quality Validation…</h4>
                    <p style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
                      Validating patch application on branch {branchName} against ESLint, Ruff, Semgrep and test policies.
                    </p>
                  </div>
                ) : validationResult ? (
                  <div style={{ marginBottom: 20 }}>
                    {/* Status Banner */}
                    <div style={{
                      padding: '16px', borderRadius: 12, marginBottom: 16,
                      backgroundColor: validationResult.passed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${validationResult.passed ? '#10B981' : '#DC2626'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {validationResult.passed ? (
                          <ShieldCheck style={{ width: 22, height: 22, color: '#10B981' }} />
                        ) : (
                          <ShieldAlert style={{ width: 22, height: 22, color: '#EF4444' }} />
                        )}
                        <div>
                          <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: validationResult.passed ? '#10B981' : '#F87171' }}>
                            {validationResult.passed ? 'Quality Validation Passed' : 'Quality Validation Warning'}
                          </h4>
                          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#EBEBEB', marginTop: 2 }}>
                            {validationResult.passed
                              ? `All ${validationResult.resolvedFindings?.length || 0} findings verified resolved with zero new issues introduced.`
                              : `${validationResult.newlyIntroducedFindings?.length || 0} newly introduced finding(s) or test failure detected.`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                      <div style={{ padding: '12px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#10B981' }}>{validationResult.resolvedFindings?.length || 0}</span>
                        <span style={{ display: 'block', fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>RESOLVED</span>
                      </div>
                      <div style={{ padding: '12px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#F59E0B' }}>{validationResult.remainingFindings?.length || 0}</span>
                        <span style={{ display: 'block', fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>REMAINING</span>
                      </div>
                      <div style={{ padding: '12px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: validationResult.newlyIntroducedFindings?.length > 0 ? '#EF4444' : '#10B981' }}>
                          {validationResult.newlyIntroducedFindings?.length || 0}
                        </span>
                        <span style={{ display: 'block', fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>NEW FINDINGS</span>
                      </div>
                      <div style={{ padding: '12px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: validationResult.testResults?.executed ? (validationResult.testResults.passed ? '#10B981' : '#EF4444') : 'var(--text-muted)' }}>
                          {validationResult.testResults?.executed ? (validationResult.testResults.passed ? 'PASS' : 'FAIL') : 'SKIPPED'}
                        </span>
                        <span style={{ display: 'block', fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>TEST SUITE</span>
                      </div>
                    </div>

                    {/* Override Toggle if validation failed */}
                    {!validationResult.passed && (
                      <div style={{ padding: '14px', borderRadius: 10, backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid #DC2626', marginBottom: 16 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={overrideValidation}
                            onChange={e => setOverrideValidation(e.target.checked)}
                            style={{ accentColor: '#DC2626' }}
                          />
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#FFF' }}>
                            <strong>Explicit Override:</strong> I acknowledge the validation warnings and explicitly authorize proceeding with PR creation.
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                ) : validationError ? (
                  <div style={{ padding: '16px', borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #DC2626', marginBottom: 20 }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#F87171' }}>{validationError}</p>
                  </div>
                ) : null}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setModalStep(2)}
                    style={{ padding: '10px 18px', borderRadius: 10, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Back to Configuration
                  </button>

                  <button
                    onClick={handleProceedToStep4}
                    disabled={!validationResult || (!validationResult.passed && !overrideValidation)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 22px', borderRadius: 10,
                      background: (validationResult && (validationResult.passed || overrideValidation))
                        ? 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)'
                        : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${(validationResult && (validationResult.passed || overrideValidation)) ? '#F59E0B' : 'var(--border)'}`,
                      color: (validationResult && (validationResult.passed || overrideValidation)) ? '#FFF' : 'var(--text-muted)',
                      fontFamily: 'var(--font-tech)', fontSize: '12px', fontWeight: 700,
                      cursor: (validationResult && (validationResult.passed || overrideValidation)) ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <span>Proceed to Review & PR</span>
                    <ArrowRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Review & Create GitHub PR ── */}
            {modalStep === 4 && (
              <div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#E8D2B5', marginBottom: 6 }}>
                    PULL REQUEST TITLE
                  </label>
                  <input
                    type="text"
                    value={prTitle}
                    onChange={e => setPrTitle(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                      color: '#FFF', fontSize: '13px', outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#E8D2B5', marginBottom: 6 }}>
                    PR DESCRIPTION (MARKDOWN PREVIEW)
                  </label>
                  <textarea
                    rows={7}
                    value={prDescription}
                    onChange={e => setPrDescription(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                      color: '#EBEBEB', fontSize: '12px', outline: 'none', fontFamily: 'var(--font-mono)', lineHeight: 1.5
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 20, alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#E8D2B5', marginBottom: 6 }}>
                      <Lock style={{ width: 11, height: 11 }} /> GITHUB PERSONAL ACCESS TOKEN (OPTIONAL IF PRECONFIGURED)
                    </label>
                    <input
                      type="password"
                      placeholder="ghp_••••••••••••••••••••••••••••••••••••"
                      value={githubToken}
                      onChange={e => setGithubToken(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 10,
                        backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                        color: '#FFF', fontSize: '13px', outline: 'none'
                      }}
                    />
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-tech)', marginTop: 4, display: 'block' }}>
                      Never logged or stored. Requires repo scope.
                    </span>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#E8D2B5', marginTop: 14 }}>
                    <input
                      type="checkbox"
                      checked={isDraftPR}
                      onChange={e => setIsDraftPR(e.target.checked)}
                      style={{ accentColor: '#38BDF8' }}
                    />
                    Create as Draft PR
                  </label>
                </div>

                {/* Explicit confirmation checkbox */}
                <div style={{ padding: '14px 16px', borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={confirmedByUser}
                      onChange={e => setConfirmedByUser(e.target.checked)}
                      style={{ accentColor: '#DC2626' }}
                    />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#FFF' }}>
                      <strong>Developer Confirmation:</strong> I have reviewed the proposed branch, commit message, and quality checks, and explicitly authorize pushing to GitHub.
                    </span>
                  </label>
                </div>

                {createError && (
                  <div style={{ padding: '14px', borderRadius: 10, backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #DC2626', marginBottom: 20 }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#F87171' }}>{createError}</p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setModalStep(3)}
                    style={{ padding: '10px 18px', borderRadius: 10, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Back to Validation
                  </button>

                  <button
                    onClick={handleCreatePR}
                    disabled={!confirmedByUser || isCreatingPR}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '12px 26px', borderRadius: 10,
                      background: confirmedByUser && !isCreatingPR
                        ? 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)'
                        : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${confirmedByUser && !isCreatingPR ? '#F59E0B' : 'var(--border)'}`,
                      color: confirmedByUser && !isCreatingPR ? '#FFF' : 'var(--text-muted)',
                      fontFamily: 'var(--font-tech)', fontSize: '13px', fontWeight: 700,
                      cursor: confirmedByUser && !isCreatingPR ? 'pointer' : 'not-allowed',
                      boxShadow: confirmedByUser ? '0 4px 15px rgba(220, 38, 38, 0.35)' : 'none'
                    }}
                  >
                    {isCreatingPR ? (
                      <>
                        <RefreshCw style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />
                        Committing, Pushing & Creating PR…
                      </>
                    ) : (
                      <>
                        <Sparkles style={{ width: 15, height: 15, color: '#FCD34D' }} />
                        Create Pull Request on GitHub
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 5: Success Screen ── */}
            {modalStep === 5 && createdPR && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10B981',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981',
                  margin: '0 auto 16px'
                }}>
                  <CheckCircle2 style={{ width: 32, height: 32 }} />
                </div>

                <span style={{ fontFamily: 'var(--font-tech)', fontSize: '11px', color: '#F59E0B', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  PULL REQUEST CREATED SUCCESSFULLY
                </span>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: '#FFF', marginTop: 6, marginBottom: 8 }}>
                  #{createdPR.number || 'PR'} · {createdPR.title}
                </h3>

                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto 24px' }}>
                  The AI-verified fix has been pushed to branch <code style={{ color: '#FCD34D' }}>{createdPR.headBranch}</code> and the pull request is now active on GitHub.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
                  {createdPR.htmlUrl && (
                    <a
                      href={createdPR.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '12px 24px', borderRadius: 10,
                        backgroundColor: '#10B981', color: '#070709', fontWeight: 600,
                        textDecoration: 'none', fontFamily: 'var(--font-tech)', fontSize: '12px', letterSpacing: '0.08em'
                      }}
                    >
                      <span>OPEN ON GITHUB</span>
                      <ExternalLink style={{ width: 14, height: 14 }} />
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setIsModalOpen(false)
                      refetch()
                    }}
                    style={{
                      padding: '12px 24px', borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
                      color: '#FFF', fontFamily: 'var(--font-tech)', fontSize: '12px', cursor: 'pointer'
                    }}
                  >
                    Done & Refresh List
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* spin keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
