import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRepositoryContext } from '@/context/RepositoryContext'

import {

  ShieldCheck,

  CheckCircle2,

  AlertTriangle,

  AlertCircle,

  RefreshCw,

  Search,

  Code2,

  Activity,

  Layers,

  Check,

  FileCode2,

  Info,

  ChevronLeft,

  ChevronRight,

  X,

  History,

  BarChart2,

  Play,

  Copy,

  FolderGit2,

  Sparkles,

  Lightbulb,

  RotateCcw,

  ShieldAlert,
  GitPullRequest,

} from 'lucide-react'

import {

  useRepositoriesQuery,

  useCodeQualityLatestQuery,

  useCodeQualityStatusQuery,

  useCodeQualityScanDetailsQuery,

  useCodeQualityHistoryQuery,

  useTriggerCodeQualityScanMutation,

  useFileFlowGraphQuery,

  useAIExplanationQuery,

  useGenerateAIExplanationMutation,

} from '@/hooks/useApi'

import {

  CodeQualityFinding,

  CodeQualitySeverity,

  CodeQualityScannerName,

  CodeQualityCategory,

  AIExplanation,

} from '@/services/api'



// ── Color & Badge Styling Helpers ───────────────────────────────────────────

const SEVERITY_COLORS: Record<CodeQualitySeverity, { bg: string; text: string; border: string }> = {

  critical: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.35)' },

  high: { bg: 'rgba(249, 115, 22, 0.15)', text: '#F97316', border: 'rgba(249, 115, 22, 0.35)' },

  medium: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.35)' },

  low: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA', border: 'rgba(59, 130, 246, 0.35)' },

  informational: { bg: 'rgba(156, 163, 175, 0.15)', text: '#9CA3AF', border: 'rgba(156, 163, 175, 0.35)' }

}



const SCANNER_COLORS: Record<CodeQualityScannerName, { bg: string; text: string; border: string }> = {

  eslint: { bg: 'rgba(75, 50, 195, 0.18)', text: '#A78BFA', border: 'rgba(167, 139, 250, 0.35)' },

  ruff: { bg: 'rgba(20, 184, 166, 0.18)', text: '#2DD4BF', border: 'rgba(45, 212, 191, 0.35)' },

  semgrep: { bg: 'rgba(236, 72, 153, 0.18)', text: '#F472B6', border: 'rgba(244, 114, 182, 0.35)' }

}



function getGradeColor(grade: string, score: number) {

  if (score >= 90 || grade === 'A') return '#34D399'

  if (score >= 80 || grade === 'B') return '#10B981'

  if (score >= 70 || grade === 'C') return '#FBBF24'

  if (score >= 60 || grade === 'D') return '#F97316'

  return '#EF4444'

}



export default function CodeQuality() {
  const navigate = useNavigate()

  // ── Repository Selection ──────────────────────────────────────────────────
  const { selectedRepo, selectedRepoId: contextRepoId } = useRepositoryContext()
  const { data: repositories = [], isLoading: reposLoading } = useRepositoriesQuery()
  const [selectedRepoId, setSelectedRepoId] = useState<string>(contextRepoId || '')

  // Initialize and sync selected repo
  useEffect(() => {
    if (contextRepoId) {
      setSelectedRepoId(contextRepoId)
    } else if (!selectedRepoId && repositories.length > 0) {
      setSelectedRepoId(String(repositories[0].id))
    }
  }, [contextRepoId, repositories, selectedRepoId])



  // ── Code Quality Queries ──────────────────────────────────────────────────

  const [isScanning, setIsScanning] = useState(false)

  const [currentScanId, setCurrentScanId] = useState<string | undefined>()

  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null)

  const [scanErrorMessage, setScanErrorMessage] = useState<string | null>(null)



  const {

    data: latestScan,

    isLoading: latestLoading,

    refetch: refetchLatest

  } = useCodeQualityLatestQuery(selectedRepoId)



  const { data: scanStatus } = useCodeQualityStatusQuery(selectedRepoId, currentScanId, isScanning)



  const {

    data: fullScanData,

    isLoading: fullScanLoading

  } = useCodeQualityScanDetailsQuery(selectedRepoId, latestScan?.scanId)

  const activeScanId = fullScanData?.scanId || latestScan?.scanId || currentScanId



  const [historyPage, _setHistoryPage] = useState(1)

  const { data: historyData, isLoading: historyLoading } = useCodeQualityHistoryQuery(selectedRepoId, historyPage, 5)



  // Architectural Health Query (Kept clearly segregated)

  const { data: graphData } = useFileFlowGraphQuery('sycnops')



  // Mutation to trigger real scan

  const triggerScanMutation = useTriggerCodeQualityScanMutation()



  // Monitor scan status transitions

  useEffect(() => {

    if (isScanning && scanStatus) {

      if (scanStatus.status === 'completed') {

        setIsScanning(false)

        setScanSuccessMessage('Code quality audit completed successfully.')

        refetchLatest()

        const timer = setTimeout(() => setScanSuccessMessage(null), 4000)

        return () => clearTimeout(timer)

      } else if (scanStatus.status === 'failed') {

        setIsScanning(false)

        setScanErrorMessage(scanStatus.error || 'Code quality audit failed.')

        const timer = setTimeout(() => setScanErrorMessage(null), 6000)

        return () => clearTimeout(timer)

      }

    }

  }, [scanStatus, isScanning, refetchLatest])



  // Trigger Scan Handler

  const handleRunScan = async () => {

    if (!selectedRepoId || isScanning) return

    setScanErrorMessage(null)

    setScanSuccessMessage(null)

    setIsScanning(true)



    try {

      const res = await triggerScanMutation.mutateAsync({ repoId: selectedRepoId })

      setCurrentScanId(res.scanId)

      if (res.status === 'completed') {

        setIsScanning(false)

        setScanSuccessMessage('Code quality audit completed.')

        refetchLatest()

      }

    } catch (err: any) {

      setIsScanning(false)

      setScanErrorMessage(err.message || 'Failed to trigger quality audit.')

    }

  }



  // ── Findings Explorer Filtering & Pagination ──────────────────────────────

  const [searchQuery, setSearchQuery] = useState('')

  const [severityFilter, setSeverityFilter] = useState<'all' | CodeQualitySeverity>('all')

  const [scannerFilter, setScannerFilter] = useState<'all' | CodeQualityScannerName>('all')

  const [categoryFilter, _setCategoryFilter] = useState<'all' | CodeQualityCategory>('all')

  const [findingsPage, setFindingsPage] = useState(1)

  const findingsPerPage = 10



  const allFindings: CodeQualityFinding[] = useMemo(() => {

    return fullScanData?.findings || []

  }, [fullScanData])



  const filteredFindings = useMemo(() => {

    return allFindings.filter((f) => {

      // Severity filter

      if (severityFilter !== 'all' && f.severity !== severityFilter) return false

      // Scanner filter

      if (scannerFilter !== 'all' && f.scanner !== scannerFilter) return false

      // Category filter

      if (categoryFilter !== 'all' && f.category !== categoryFilter) return false

      // Search query (matches ruleId, message, filePath, title)

      if (searchQuery.trim()) {

        const q = searchQuery.toLowerCase()

        const matches =

          f.ruleId.toLowerCase().includes(q) ||

          f.message.toLowerCase().includes(q) ||

          f.filePath.toLowerCase().includes(q) ||

          f.title.toLowerCase().includes(q)

        if (!matches) return false

      }

      return true

    })

  }, [allFindings, severityFilter, scannerFilter, categoryFilter, searchQuery])



  // Reset pagination on filter change

  useEffect(() => {

    setFindingsPage(1)

  }, [searchQuery, severityFilter, scannerFilter, categoryFilter])



  const totalFindingPages = Math.max(1, Math.ceil(filteredFindings.length / findingsPerPage))

  const paginatedFindings = useMemo(() => {

    const start = (findingsPage - 1) * findingsPerPage

    return filteredFindings.slice(start, start + findingsPerPage)

  }, [filteredFindings, findingsPage, findingsPerPage])



  // ── Modal Finding Detail State & Stage 4 AI Intelligence ──────────────────

  const [selectedFinding, setSelectedFinding] = useState<CodeQualityFinding | null>(null)

  const [copiedSnippet, setCopiedSnippet] = useState(false)

  const [copiedFix, setCopiedFix] = useState(false)

  const [localAIExplanation, setLocalAIExplanation] = useState<AIExplanation | null>(null)

  const [aiError, setAiError] = useState<string | null>(null)



  // Query cached AI explanation when finding modal opens

  const {

    data: fetchedAIExplanation,

    isLoading: isAIFetching

  } = useAIExplanationQuery(

    selectedRepoId,

    selectedFinding?.id,

    activeScanId,

    Boolean(selectedFinding)

  )



  // Mutation to generate or regenerate AI explanation

  const generateAIMutation = useGenerateAIExplanationMutation()



  // Reset or sync AI state when finding changes

  useEffect(() => {

    setLocalAIExplanation(null)

    setAiError(null)

    setCopiedFix(false)

  }, [selectedFinding?.id])



  useEffect(() => {

    if (fetchedAIExplanation) {

      setLocalAIExplanation(fetchedAIExplanation)

    }

  }, [fetchedAIExplanation])



  const activeAIExplanation = localAIExplanation || fetchedAIExplanation || null

  const isAIGenerating = generateAIMutation.isPending



  const handleCopySnippet = (text: string) => {

    navigator.clipboard.writeText(text)

    setCopiedSnippet(true)

    setTimeout(() => setCopiedSnippet(false), 2000)

  }



  const handleCopyFix = (text: string) => {

    navigator.clipboard.writeText(text)

    setCopiedFix(true)

    setTimeout(() => setCopiedFix(false), 2000)

  }



  const handleTriggerAI = async (regenerate = false) => {

    if (!selectedFinding || !selectedRepoId) return

    setAiError(null)

    try {

      const res = await generateAIMutation.mutateAsync({

        repoId: selectedRepoId,

        findingId: selectedFinding.id,

        scanId: activeScanId,

        regenerate

      })

      if (res && res.data) {

        setLocalAIExplanation(res.data)

      }

    } catch (err: any) {

      setAiError(err.message || 'Failed to generate AI explanation. Please try again.')

    }

  }



  // Active repository object

  const activeRepo = repositories.find((r) => String(r.id) === selectedRepoId)

  const qualityScore = latestScan?.qualityScore ?? 100

  const grade = latestScan?.grade || 'A'

  const gradeColor = getGradeColor(grade, qualityScore)



  return (

    <div

      className="s-page"

      style={{

        position: 'relative',

        minHeight: 'calc(100vh - 80px)',

        display: 'flex',

        flexDirection: 'column',

        color: '#E8D2B5',

        fontFamily: 'inherit'

      }}

    >

      {/* ── Top Header Bar ──────────────────────────────────────────────── */}

      <div

        style={{

          display: 'flex',

          flexWrap: 'wrap',

          alignItems: 'center',

          justifyContent: 'space-between',

          gap: 16,

          marginBottom: 16,

          padding: '16px 20px',

          background: 'linear-gradient(135deg, rgba(89, 9, 7, 0.45) 0%, rgba(20, 18, 16, 0.85) 100%)',

          borderRadius: 16,

          border: '1px solid rgba(89, 9, 7, 0.5)',

          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'

        }}

      >

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          <div

            style={{

              width: 38,

              height: 38,

              borderRadius: 10,

              backgroundColor: '#590907',

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'center',

              color: '#E8D2B5',

              border: '1px solid rgba(232, 210, 181, 0.35)',

              boxShadow: '0 0 12px rgba(89, 9, 7, 0.8)'

            }}

          >

            <ShieldCheck size={20} />

          </div>

          <div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

              <h1

                style={{

                  fontFamily: 'var(--font-serif)',

                  fontSize: '22px',

                  color: '#E8D2B5',

                  margin: 0,

                  letterSpacing: '-0.02em',

                  fontWeight: 600

                }}

              >

                Code Quality & Static Analysis

              </h1>

              {latestScan && (

                <span

                  style={{

                    fontSize: '10px',

                    fontFamily: 'var(--font-mono, monospace)',

                    padding: '2px 8px',

                    borderRadius: '999px',

                    backgroundColor: `${gradeColor}22`,

                    color: gradeColor,

                    border: `1px solid ${gradeColor}55`,

                    fontWeight: 700

                  }}

                >

                  GRADE {grade} • {qualityScore}/100

                </span>

              )}

            </div>

            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#A8A29E' }}>

              Multi-scanner static analysis (ESLint, Ruff, Semgrep) with automated severity scoring and rule triage.

            </p>

          </div>

        </div>



        {/* Repository Selector and Action Button */}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>

          {/* Repository Dropdown */}

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

            <FolderGit2 size={15} color="#A8A29E" />

            <select

              value={selectedRepoId}

              onChange={(e) => setSelectedRepoId(e.target.value)}

              disabled={isScanning || reposLoading}

              style={{

                backgroundColor: 'rgba(20, 18, 16, 0.9)',

                color: '#E8D2B5',

                border: '1px solid rgba(232, 210, 181, 0.25)',

                borderRadius: 8,

                padding: '7px 12px',

                fontSize: '12px',

                fontFamily: 'var(--font-mono, monospace)',

                outline: 'none',

                cursor: 'pointer'

              }}

            >

              {repositories.map((repo) => (

                <option key={repo.id} value={String(repo.id)} style={{ backgroundColor: '#141210', color: '#E8D2B5' }}>

                  {repo.fullName || repo.name}

                </option>

              ))}

            </select>

          </div>



          {/* Run Scan Button */}

          <button

            onClick={handleRunScan}

            disabled={isScanning || !selectedRepoId}

            style={{

              display: 'flex',

              alignItems: 'center',

              gap: 8,

              padding: '8px 18px',

              borderRadius: 8,

              backgroundColor: isScanning ? 'rgba(89, 9, 7, 0.4)' : '#590907',

              color: '#E8D2B5',

              border: '1px solid rgba(232, 210, 181, 0.35)',

              fontSize: '12px',

              fontWeight: 600,

              cursor: isScanning || !selectedRepoId ? 'not-allowed' : 'pointer',

              boxShadow: '0 2px 10px rgba(89, 9, 7, 0.6)',

              transition: 'all 0.2s ease'

            }}

          >

            {isScanning ? (

              <>

                <RefreshCw size={14} className="animate-spin" />

                {scanStatus?.status === 'running' ? 'Scanning Codebase...' : 'Queued in Engine...'}

              </>

            ) : scanSuccessMessage ? (

              <>

                <Check size={14} color="#34D399" />

                Audit Complete

              </>

            ) : (

              <>

                <Play size={13} fill="#E8D2B5" />

                Run Quality Audit

              </>

            )}

          </button>

        </div>

      </div>



      {/* ── Feedback Banners ────────────────────────────────────────────── */}

      {scanErrorMessage && (

        <div

          style={{

            backgroundColor: 'rgba(239, 68, 68, 0.12)',

            border: '1px solid rgba(239, 68, 68, 0.4)',

            color: '#F87171',

            padding: '10px 16px',

            borderRadius: 8,

            marginBottom: 16,

            fontSize: '12px',

            display: 'flex',

            alignItems: 'center',

            justifyContent: 'space-between',

            fontFamily: 'var(--font-mono, monospace)'

          }}

        >

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            <AlertCircle size={16} />

            <span>{scanErrorMessage}</span>

          </div>

          <button onClick={() => setScanErrorMessage(null)} style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer' }}>

            <X size={14} />

          </button>

        </div>

      )}



      {scanSuccessMessage && (

        <div

          style={{

            backgroundColor: 'rgba(16, 185, 129, 0.12)',

            border: '1px solid rgba(16, 185, 129, 0.4)',

            color: '#34D399',

            padding: '10px 16px',

            borderRadius: 8,

            marginBottom: 16,

            fontSize: '12px',

            display: 'flex',

            alignItems: 'center',

            gap: 8,

            fontFamily: 'var(--font-mono, monospace)'

          }}

        >

          <CheckCircle2 size={16} />

          <span>{scanSuccessMessage}</span>

        </div>

      )}



      {isScanning && (

        <div

          style={{

            backgroundColor: 'rgba(89, 9, 7, 0.25)',

            border: '1px solid rgba(89, 9, 7, 0.6)',

            padding: '12px 18px',

            borderRadius: 10,

            marginBottom: 16,

            display: 'flex',

            alignItems: 'center',

            justifyContent: 'space-between'

          }}

        >

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            <RefreshCw size={16} className="animate-spin" color="#E8D2B5" />

            <div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: '#E8D2B5' }}>

                Static Analysis in Progress for {activeRepo?.name || 'Repository'}...

              </div>

              <div style={{ fontSize: '11px', color: '#A8A29E', fontFamily: 'monospace' }}>

                Executing ESLint (JS/TS), Ruff (Python), and Semgrep (SAST security rules) with AST snippet capture.

              </div>

            </div>

          </div>

          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#FBBF24', textTransform: 'uppercase' }}>

            STATUS: {scanStatus?.status || 'RUNNING'}

          </div>

        </div>

      )}



      {/* ── Top Quality Metric Cards (Real Scanner Data) ────────────────── */}

      <div

        style={{

          display: 'grid',

          gridTemplateColumns: '260px repeat(auto-fit, minmax(150px, 1fr))',

          gap: 12,

          marginBottom: 16

        }}

      >

        {/* Quality Score Hero */}

        <div

          style={{

            padding: '16px 20px',

            borderRadius: 14,

            background: 'linear-gradient(135deg, rgba(89, 9, 7, 0.6) 0%, rgba(20, 18, 16, 0.9) 100%)',

            border: '1px solid rgba(232, 210, 181, 0.35)',

            display: 'flex',

            alignItems: 'center',

            gap: 16

          }}

        >

          <div

            style={{

              width: 54,

              height: 54,

              borderRadius: '50%',

              border: `3px solid ${gradeColor}`,

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'center',

              fontSize: '22px',

              fontWeight: 800,

              color: gradeColor,

              fontFamily: 'monospace',

              boxShadow: `0 0 16px ${gradeColor}33`

            }}

          >

            {latestLoading ? '…' : grade}

          </div>

          <div>

            <div style={{ fontSize: '11px', color: '#E8D2B5', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.04em' }}>

              Quality Index

            </div>

            <div style={{ fontSize: '26px', fontWeight: 800, color: '#F5F5F4', fontFamily: 'monospace' }}>

              {latestLoading ? '—' : qualityScore}

              <span style={{ fontSize: '13px', color: '#78716C' }}>/100</span>

            </div>

            {latestScan?.comparison?.scoreDifference !== undefined && (

              <div

                style={{

                  fontSize: '10px',

                  fontFamily: 'monospace',

                  color: latestScan.comparison.scoreDifference >= 0 ? '#34D399' : '#EF4444',

                  display: 'flex',

                  alignItems: 'center',

                  gap: 4

                }}

              >

                {latestScan.comparison.scoreDifference >= 0 ? '▲' : '▼'}{' '}

                {Math.abs(latestScan.comparison.scoreDifference)} pts vs prev scan

              </div>

            )}

          </div>

        </div>



        {/* Critical Severity Card */}

        <div style={{ padding: '12px 16px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(239, 68, 68, 0.3)' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <span style={{ fontSize: '10px', color: '#EF4444', textTransform: 'uppercase', fontWeight: 600, fontFamily: 'monospace' }}>

              Critical

            </span>

            <AlertCircle size={14} color="#EF4444" />

          </div>

          <div style={{ fontSize: '22px', fontWeight: 700, color: '#EF4444', fontFamily: 'monospace', marginTop: 4 }}>

            {latestLoading ? '…' : latestScan?.severityCounts.critical || 0}

          </div>

          <div style={{ fontSize: '10px', color: '#A8A29E', marginTop: 2 }}>Blockers & High Vulnerabilities</div>

        </div>



        {/* High Severity Card */}

        <div style={{ padding: '12px 16px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(249, 115, 22, 0.3)' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <span style={{ fontSize: '10px', color: '#F97316', textTransform: 'uppercase', fontWeight: 600, fontFamily: 'monospace' }}>

              High

            </span>

            <AlertTriangle size={14} color="#F97316" />

          </div>

          <div style={{ fontSize: '22px', fontWeight: 700, color: '#F97316', fontFamily: 'monospace', marginTop: 4 }}>

            {latestLoading ? '…' : latestScan?.severityCounts.high || 0}

          </div>

          <div style={{ fontSize: '10px', color: '#A8A29E', marginTop: 2 }}>High Risk Code Patterns</div>

        </div>



        {/* Medium Severity Card */}

        <div style={{ padding: '12px 16px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(245, 158, 11, 0.3)' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <span style={{ fontSize: '10px', color: '#FBBF24', textTransform: 'uppercase', fontWeight: 600, fontFamily: 'monospace' }}>

              Medium

            </span>

            <AlertTriangle size={14} color="#FBBF24" />

          </div>

          <div style={{ fontSize: '22px', fontWeight: 700, color: '#FBBF24', fontFamily: 'monospace', marginTop: 4 }}>

            {latestLoading ? '…' : latestScan?.severityCounts.medium || 0}

          </div>

          <div style={{ fontSize: '10px', color: '#A8A29E', marginTop: 2 }}>Warnings & Code Smells</div>

        </div>



        {/* Low Severity Card */}

        <div style={{ padding: '12px 16px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(59, 130, 246, 0.3)' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <span style={{ fontSize: '10px', color: '#60A5FA', textTransform: 'uppercase', fontWeight: 600, fontFamily: 'monospace' }}>

              Low

            </span>

            <Info size={14} color="#60A5FA" />

          </div>

          <div style={{ fontSize: '22px', fontWeight: 700, color: '#60A5FA', fontFamily: 'monospace', marginTop: 4 }}>

            {latestLoading ? '…' : latestScan?.severityCounts.low || 0}

          </div>

          <div style={{ fontSize: '10px', color: '#A8A29E', marginTop: 2 }}>Minor Code Hygiene</div>

        </div>



        {/* Informational Severity Card */}

        <div style={{ padding: '12px 16px', borderRadius: 12, backgroundColor: '#141210', border: '1px solid rgba(156, 163, 175, 0.3)' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <span style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600, fontFamily: 'monospace' }}>

              Info

            </span>

            <CheckCircle2 size={14} color="#9CA3AF" />

          </div>

          <div style={{ fontSize: '22px', fontWeight: 700, color: '#9CA3AF', fontFamily: 'monospace', marginTop: 4 }}>

            {latestLoading ? '…' : latestScan?.severityCounts.informational || 0}

          </div>

          <div style={{ fontSize: '10px', color: '#A8A29E', marginTop: 2 }}>Advisories & Suggestions</div>

        </div>

      </div>



      {/* ── Scanner Engine Breakdown & Category Distribution ────────────── */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12, marginBottom: 16 }}>

        {/* Scanner Engine Metrics */}

        <div

          style={{

            backgroundColor: '#141210',

            borderRadius: 14,

            border: '1px solid rgba(89, 9, 7, 0.35)',

            padding: '14px 18px'

          }}

        >

          <div style={{ fontSize: '11px', fontWeight: 600, color: '#E8D2B5', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace' }}>

            <BarChart2 size={13} color="#E8D2B5" /> Real Scanner Engine Breakdowns

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>

            {/* ESLint */}

            <div style={{ padding: 10, borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(167, 139, 250, 0.25)' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                <span style={{ fontSize: '11px', color: '#A78BFA', fontWeight: 600, fontFamily: 'monospace' }}>ESLint</span>

                <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: 4, backgroundColor: 'rgba(167, 139, 250, 0.15)', color: '#A78BFA' }}>

                  {latestScan?.scannersExecuted?.eslint?.status || 'ready'}

                </span>

              </div>

              <div style={{ fontSize: '20px', fontWeight: 700, color: '#F5F5F4', fontFamily: 'monospace', marginTop: 4 }}>

                {latestScan?.scannerBreakdown.eslint ?? '0'}

              </div>

              <div style={{ fontSize: '10px', color: '#78716C' }}>JavaScript & TS</div>

            </div>



            {/* Ruff */}

            <div style={{ padding: 10, borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(45, 212, 191, 0.25)' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                <span style={{ fontSize: '11px', color: '#2DD4BF', fontWeight: 600, fontFamily: 'monospace' }}>Ruff</span>

                <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: 4, backgroundColor: 'rgba(45, 212, 191, 0.15)', color: '#2DD4BF' }}>

                  {latestScan?.scannersExecuted?.ruff?.status || 'ready'}

                </span>

              </div>

              <div style={{ fontSize: '20px', fontWeight: 700, color: '#F5F5F4', fontFamily: 'monospace', marginTop: 4 }}>

                {latestScan?.scannerBreakdown.ruff ?? '0'}

              </div>

              <div style={{ fontSize: '10px', color: '#78716C' }}>Python AST & Lint</div>

            </div>



            {/* Semgrep */}

            <div style={{ padding: 10, borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(244, 114, 182, 0.25)' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                <span style={{ fontSize: '11px', color: '#F472B6', fontWeight: 600, fontFamily: 'monospace' }}>Semgrep</span>

                <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: 4, backgroundColor: 'rgba(244, 114, 182, 0.15)', color: '#F472B6' }}>

                  {latestScan?.scannersExecuted?.semgrep?.status || 'ready'}

                </span>

              </div>

              <div style={{ fontSize: '20px', fontWeight: 700, color: '#F5F5F4', fontFamily: 'monospace', marginTop: 4 }}>

                {latestScan?.scannerBreakdown.semgrep ?? '0'}

              </div>

              <div style={{ fontSize: '10px', color: '#78716C' }}>SAST Security Rules</div>

            </div>

          </div>

        </div>



        {/* Category Breakdown */}

        <div

          style={{

            backgroundColor: '#141210',

            borderRadius: 14,

            border: '1px solid rgba(89, 9, 7, 0.35)',

            padding: '14px 18px'

          }}

        >

          <div style={{ fontSize: '11px', fontWeight: 600, color: '#E8D2B5', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace' }}>

            <Layers size={13} color="#E8D2B5" /> Finding Categories

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

            {[

              { key: 'security', label: 'Security Patterns', color: '#EF4444' },

              { key: 'reliability', label: 'Reliability & Bugs', color: '#F97316' },

              { key: 'maintainability', label: 'Maintainability', color: '#FBBF24' },

              { key: 'readability', label: 'Readability & Style', color: '#60A5FA' },

              { key: 'performance', label: 'Performance', color: '#34D399' }

            ].map((cat) => {

              const count = (latestScan?.categoryBreakdown as any)?.[cat.key] || 0

              const total = latestScan?.totalFindings || 1

              const pct = Math.round((count / total) * 100)

              return (

                <div key={cat.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'monospace' }}>

                  <span style={{ color: '#D6D3D1', display: 'flex', alignItems: 'center', gap: 6 }}>

                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: cat.color }} />

                    {cat.label}

                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                    <div style={{ width: 60, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>

                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: cat.color }} />

                    </div>

                    <span style={{ color: '#F5F5F4', fontWeight: 600, minWidth: 20, textAlign: 'right' }}>{count}</span>

                  </div>

                </div>

              )

            })}

          </div>

        </div>

      </div>



      {/* ── Real Findings Explorer ───────────────────────────────────────── */}

      <div

        style={{

          backgroundColor: '#141210',

          borderRadius: 14,

          border: '1px solid rgba(89, 9, 7, 0.45)',

          padding: 16,

          display: 'flex',

          flexDirection: 'column',

          gap: 12,

          marginBottom: 16

        }}

      >

        {/* Explorer Header & Search */}

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8D2B5', textTransform: 'uppercase', fontFamily: 'monospace' }}>

              Findings Explorer ({filteredFindings.length} of {allFindings.length})

            </div>

            {fullScanLoading && <RefreshCw size={12} className="animate-spin" color="#A8A29E" />}

          </div>



          {/* Search Box */}

          <div

            style={{

              display: 'flex',

              alignItems: 'center',

              gap: 8,

              backgroundColor: '#0F0E0D',

              border: '1px solid rgba(255, 255, 255, 0.1)',

              borderRadius: 8,

              padding: '6px 12px',

              minWidth: 260

            }}

          >

            <Search size={14} color="#78716C" />

            <input

              type="text"

              placeholder="Filter by rule, file, or message..."

              value={searchQuery}

              onChange={(e) => setSearchQuery(e.target.value)}

              style={{

                background: 'transparent',

                border: 'none',

                outline: 'none',

                fontSize: '11px',

                color: '#F5F5F4',

                fontFamily: 'monospace',

                width: '100%'

              }}

            />

            {searchQuery && (

              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#78716C', cursor: 'pointer' }}>

                <X size={12} />

              </button>

            )}

          </div>

        </div>



        {/* Filter Controls Row */}

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, fontSize: '11px', fontFamily: 'monospace' }}>

          {/* Severity Filters */}

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

            <span style={{ color: '#78716C', marginRight: 4 }}>Severity:</span>

            {(['all', 'critical', 'high', 'medium', 'low', 'informational'] as const).map((sev) => (

              <button

                key={sev}

                onClick={() => setSeverityFilter(sev)}

                style={{

                  padding: '3px 8px',

                  borderRadius: 6,

                  fontSize: '10px',

                  fontFamily: 'monospace',

                  textTransform: 'uppercase',

                  cursor: 'pointer',

                  backgroundColor: severityFilter === sev ? '#590907' : 'rgba(255, 255, 255, 0.04)',

                  color: severityFilter === sev ? '#E8D2B5' : '#78716C',

                  border: severityFilter === sev ? '1px solid rgba(232, 210, 181, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',

                  transition: 'all 0.15s ease'

                }}

              >

                {sev}

              </button>

            ))}

          </div>



          {/* Scanner Filter */}

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

            <span style={{ color: '#78716C', marginRight: 4 }}>Scanner:</span>

            {(['all', 'eslint', 'ruff', 'semgrep'] as const).map((scn) => (

              <button

                key={scn}

                onClick={() => setScannerFilter(scn)}

                style={{

                  padding: '3px 8px',

                  borderRadius: 6,

                  fontSize: '10px',

                  fontFamily: 'monospace',

                  textTransform: 'uppercase',

                  cursor: 'pointer',

                  backgroundColor: scannerFilter === scn ? '#590907' : 'rgba(255, 255, 255, 0.04)',

                  color: scannerFilter === scn ? '#E8D2B5' : '#78716C',

                  border: scannerFilter === scn ? '1px solid rgba(232, 210, 181, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',

                  transition: 'all 0.15s ease'

                }}

              >

                {scn}

              </button>

            ))}

          </div>

        </div>



        {/* Findings Table */}

        <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.06)' }}>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px', fontFamily: 'monospace' }}>

            <thead>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#0D0C0B', color: '#78716C' }}>

                <th style={{ padding: '10px 12px' }}>Severity</th>

                <th style={{ padding: '10px 12px' }}>Rule ID</th>

                <th style={{ padding: '10px 12px' }}>Message</th>

                <th style={{ padding: '10px 12px' }}>File & Location</th>

                <th style={{ padding: '10px 12px' }}>Scanner</th>

                <th style={{ padding: '10px 12px' }}>Category</th>

                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>

              </tr>

            </thead>

            <tbody>

              {paginatedFindings.length === 0 ? (

                <tr>

                  <td colSpan={7} style={{ padding: '36px 16px', textAlign: 'center', color: '#78716C' }}>

                    {latestLoading || fullScanLoading ? (

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>

                        <RefreshCw size={14} className="animate-spin" /> Loading real findings from engine...

                      </div>

                    ) : allFindings.length === 0 ? (

                      <div>

                        <CheckCircle2 size={24} color="#34D399" style={{ margin: '0 auto 8px' }} />

                        <div style={{ color: '#E8D2B5', fontWeight: 600 }}>Zero quality findings detected.</div>

                        <div style={{ fontSize: '10px', marginTop: 4 }}>This codebase is clean across ESLint, Ruff, and Semgrep SAST checks.</div>

                      </div>

                    ) : (

                      <div>No findings match the selected filters.</div>

                    )}

                  </td>

                </tr>

              ) : (

                paginatedFindings.map((finding) => {

                  const sColor = SEVERITY_COLORS[finding.severity] || SEVERITY_COLORS.informational

                  const scColor = SCANNER_COLORS[finding.scanner] || SCANNER_COLORS.eslint

                  return (

                    <tr

                      key={finding.id}

                      onClick={() => setSelectedFinding(finding)}

                      style={{

                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',

                        color: '#D6D3D1',

                        cursor: 'pointer',

                        transition: 'background 0.15s ease'

                      }}

                      className="hover:bg-white/5"

                    >

                      {/* Severity Badge */}

                      <td style={{ padding: '10px 12px' }}>

                        <span

                          style={{

                            padding: '2px 7px',

                            borderRadius: 4,

                            backgroundColor: sColor.bg,

                            color: sColor.text,

                            border: `1px solid ${sColor.border}`,

                            fontWeight: 600,

                            textTransform: 'uppercase',

                            fontSize: '9px'

                          }}

                        >

                          {finding.severity}

                        </span>

                      </td>



                      {/* Rule ID */}

                      <td style={{ padding: '10px 12px', color: '#F5F5F4', fontWeight: 600 }}>

                        <span style={{ color: '#E8D2B5' }}>{finding.ruleId}</span>

                      </td>



                      {/* Message Preview */}

                      <td style={{ padding: '10px 12px', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>

                        {finding.message}

                      </td>



                      {/* Location */}

                      <td style={{ padding: '10px 12px', color: '#60A5FA' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

                          <FileCode2 size={12} color="#60A5FA" />

                          <span>

                            {finding.filePath}:{finding.line}

                          </span>

                        </div>

                      </td>



                      {/* Scanner */}

                      <td style={{ padding: '10px 12px' }}>

                        <span

                          style={{

                            padding: '2px 6px',

                            borderRadius: 4,

                            backgroundColor: scColor.bg,

                            color: scColor.text,

                            border: `1px solid ${scColor.border}`,

                            fontSize: '9px',

                            textTransform: 'uppercase'

                          }}

                        >

                          {finding.scanner}

                        </span>

                      </td>



                      {/* Category */}

                      <td style={{ padding: '10px 12px', color: '#A8A29E', textTransform: 'capitalize' }}>

                        {finding.category}

                      </td>



                      {/* Action */}

                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>

                        <button

                          type="button"

                          onClick={(e) => {

                            e.stopPropagation()

                            setSelectedFinding(finding)

                          }}

                          style={{

                            padding: '3px 8px',

                            borderRadius: 4,

                            backgroundColor: 'rgba(89, 9, 7, 0.4)',

                            border: '1px solid rgba(232, 210, 181, 0.3)',

                            color: '#E8D2B5',

                            fontSize: '10px',

                            cursor: 'pointer'

                          }}

                        >

                          Inspect

                        </button>

                      </td>

                    </tr>

                  )

                })

              )}

            </tbody>

          </table>

        </div>



        {/* Pagination Bar */}

        {totalFindingPages > 1 && (

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'monospace', paddingTop: 6 }}>

            <span style={{ color: '#78716C' }}>

              Showing {filteredFindings.length > 0 ? (findingsPage - 1) * findingsPerPage + 1 : 0} to{' '}

              {Math.min(findingsPage * findingsPerPage, filteredFindings.length)} of {filteredFindings.length}

            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

              <button

                disabled={findingsPage <= 1}

                onClick={() => setFindingsPage((p) => Math.max(1, p - 1))}

                style={{

                  padding: '4px 8px',

                  borderRadius: 4,

                  backgroundColor: '#0F0E0D',

                  border: '1px solid rgba(255,255,255,0.1)',

                  color: findingsPage <= 1 ? '#555' : '#E8D2B5',

                  cursor: findingsPage <= 1 ? 'not-allowed' : 'pointer'

                }}

              >

                <ChevronLeft size={12} />

              </button>

              <span style={{ color: '#E8D2B5' }}>

                Page {findingsPage} of {totalFindingPages}

              </span>

              <button

                disabled={findingsPage >= totalFindingPages}

                onClick={() => setFindingsPage((p) => Math.min(totalFindingPages, p + 1))}

                style={{

                  padding: '4px 8px',

                  borderRadius: 4,

                  backgroundColor: '#0F0E0D',

                  border: '1px solid rgba(255,255,255,0.1)',

                  color: findingsPage >= totalFindingPages ? '#555' : '#E8D2B5',

                  cursor: findingsPage >= totalFindingPages ? 'not-allowed' : 'pointer'

                }}

              >

                <ChevronRight size={12} />

              </button>

            </div>

          </div>

        )}

      </div>



      {/* ── Scan History Log ────────────────────────────────────────────── */}

      <div

        style={{

          backgroundColor: '#141210',

          borderRadius: 14,

          border: '1px solid rgba(89, 9, 7, 0.4)',

          padding: 16,

          marginBottom: 16

        }}

      >

        <div style={{ fontSize: '12px', fontWeight: 600, color: '#E8D2B5', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace' }}>

          <History size={14} /> Audit History & Trajectory

        </div>



        {historyLoading ? (

          <div style={{ padding: 16, textAlign: 'center', color: '#78716C', fontSize: '11px', fontFamily: 'monospace' }}>

            <RefreshCw size={12} className="animate-spin inline mr-2" /> Loading audit history...

          </div>

        ) : !historyData?.scans || historyData.scans.length === 0 ? (

          <div style={{ padding: 16, textAlign: 'center', color: '#78716C', fontSize: '11px', fontFamily: 'monospace' }}>

            No prior quality audits recorded for this repository.

          </div>

        ) : (

          <div style={{ overflowX: 'auto' }}>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px', fontFamily: 'monospace' }}>

              <thead>

                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#78716C' }}>

                  <th style={{ padding: '8px 10px' }}>Scan ID</th>

                  <th style={{ padding: '8px 10px' }}>Timestamp</th>

                  <th style={{ padding: '8px 10px' }}>Score & Grade</th>

                  <th style={{ padding: '8px 10px' }}>Delta</th>

                  <th style={{ padding: '8px 10px' }}>Total Findings</th>

                  <th style={{ padding: '8px 10px' }}>Scanned Files</th>

                  <th style={{ padding: '8px 10px' }}>Duration</th>

                </tr>

              </thead>

              <tbody>

                {historyData.scans.map((item) => (

                  <tr key={item.scanId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#D6D3D1' }}>

                    <td style={{ padding: '8px 10px', color: '#E8D2B5', fontWeight: 600 }}>{item.scanId}</td>

                    <td style={{ padding: '8px 10px', color: '#A8A29E' }}>

                      {new Date(item.createdAt).toLocaleString(undefined, {

                        month: 'short',

                        day: 'numeric',

                        hour: '2-digit',

                        minute: '2-digit'

                      })}

                    </td>

                    <td style={{ padding: '8px 10px' }}>

                      <span

                        style={{

                          padding: '1px 6px',

                          borderRadius: 4,

                          backgroundColor: `${getGradeColor(item.grade, item.qualityScore)}22`,

                          color: getGradeColor(item.grade, item.qualityScore),

                          fontWeight: 700

                        }}

                      >

                        {item.grade} • {item.qualityScore}

                      </span>

                    </td>

                    <td style={{ padding: '8px 10px' }}>

                      {item.comparison ? (

                        <span style={{ color: item.comparison.scoreDifference >= 0 ? '#34D399' : '#EF4444' }}>

                          {item.comparison.scoreDifference >= 0 ? `+${item.comparison.scoreDifference}` : item.comparison.scoreDifference} pts

                        </span>

                      ) : (

                        <span style={{ color: '#78716C' }}>—</span>

                      )}

                    </td>

                    <td style={{ padding: '8px 10px' }}>{item.findingsCount} findings</td>

                    <td style={{ padding: '8px 10px', color: '#A8A29E' }}>{item.scannedFilesCount || '—'} files</td>

                    <td style={{ padding: '8px 10px', color: '#78716C' }}>{(item.durationMs / 1000).toFixed(1)}s</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>



      {/* ── Separate Architecture & Dependency Hygiene Section ─────────── */}

      <div

        style={{

          backgroundColor: '#141210',

          borderRadius: 14,

          border: '1px solid rgba(232, 210, 181, 0.25)',

          padding: 16,

          marginBottom: 16

        }}

      >

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 600, color: '#E8D2B5', textTransform: 'uppercase', fontFamily: 'monospace' }}>

            <Activity size={14} color="#60A5FA" /> Architecture & Dependency Hygiene (FileFlow AST Engine)

          </div>

          <span

            style={{

              fontSize: '10px',

              fontFamily: 'monospace',

              color: '#60A5FA',

              backgroundColor: 'rgba(96, 165, 250, 0.1)',

              padding: '2px 8px',

              borderRadius: 4,

              border: '1px solid rgba(96, 165, 250, 0.3)'

            }}

          >

            AST Structural Analysis • Evaluated Separately from Linters

          </span>

        </div>



        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(255,255,255,0.05)' }}>

            <CheckCircle2 size={16} color="#34D399" style={{ marginTop: 2 }} />

            <div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: '#F5F5F4' }}>Strict TypeScript Build Passed</div>

              <div style={{ fontSize: '10px', color: '#78716C', marginTop: 2 }}>Zero compiler errors across active frontend components.</div>

            </div>

          </div>



          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(255,255,255,0.05)' }}>

            <CheckCircle2 size={16} color="#34D399" style={{ marginTop: 2 }} />

            <div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: '#F5F5F4' }}>

                {graphData?.summary?.circularDependenciesCount || 0} Circular Import Loops

              </div>

              <div style={{ fontSize: '10px', color: '#78716C', marginTop: 2 }}>Dependency DAG is free of mutually recursive module imports.</div>

            </div>

          </div>



          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(255,255,255,0.05)' }}>

            <AlertTriangle size={16} color="#FBBF24" style={{ marginTop: 2 }} />

            <div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: '#F5F5F4' }}>

                {graphData?.summary?.disconnectedFilesCount || 0} Isolated AST Files

              </div>

              <div style={{ fontSize: '10px', color: '#78716C', marginTop: 2 }}>Sample scripts or utility files without incoming import edges.</div>

            </div>

          </div>



          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(255,255,255,0.05)' }}>

            <CheckCircle2 size={16} color="#34D399" style={{ marginTop: 2 }} />

            <div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: '#F5F5F4' }}>Multi-Tenant Store Isolation</div>

              <div style={{ fontSize: '10px', color: '#78716C', marginTop: 2 }}>Workspace repository access authenticated and path-confined.</div>

            </div>

          </div>

        </div>

      </div>



      {/* ── Finding Inspection Modal ────────────────────────────────────── */}

      {selectedFinding && (

        <div

          onClick={() => setSelectedFinding(null)}

          style={{

            position: 'fixed',

            inset: 0,

            backgroundColor: 'rgba(0, 0, 0, 0.8)',

            backdropFilter: 'blur(8px)',

            zIndex: 1000,

            display: 'flex',

            alignItems: 'center',

            justifyContent: 'center',

            padding: 20

          }}

        >

          <div

            onClick={(e) => e.stopPropagation()}

            style={{

              backgroundColor: '#141210',

              border: '1px solid rgba(232, 210, 181, 0.4)',

              borderRadius: 14,

              maxWidth: 720,

              width: '100%',

              maxHeight: '85vh',

              overflowY: 'auto',

              padding: 24,

              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.9)',

              display: 'flex',

              flexDirection: 'column',

              gap: 16

            }}

          >

            {/* Modal Header */}

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>

              <div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>

                  <span

                    style={{

                      padding: '2px 8px',

                      borderRadius: 4,

                      backgroundColor: SEVERITY_COLORS[selectedFinding.severity].bg,

                      color: SEVERITY_COLORS[selectedFinding.severity].text,

                      border: `1px solid ${SEVERITY_COLORS[selectedFinding.severity].border}`,

                      fontSize: '10px',

                      fontWeight: 700,

                      textTransform: 'uppercase',

                      fontFamily: 'monospace'

                    }}

                  >

                    {selectedFinding.severity}

                  </span>

                  <span

                    style={{

                      padding: '2px 8px',

                      borderRadius: 4,

                      backgroundColor: SCANNER_COLORS[selectedFinding.scanner].bg,

                      color: SCANNER_COLORS[selectedFinding.scanner].text,

                      border: `1px solid ${SCANNER_COLORS[selectedFinding.scanner].border}`,

                      fontSize: '10px',

                      fontWeight: 600,

                      textTransform: 'uppercase',

                      fontFamily: 'monospace'

                    }}

                  >

                    {selectedFinding.scanner}

                  </span>

                  <span style={{ fontSize: '11px', color: '#A8A29E', fontFamily: 'monospace', textTransform: 'capitalize' }}>

                    • {selectedFinding.category}

                  </span>

                </div>

                <h3 style={{ margin: 0, fontSize: '16px', color: '#F5F5F4', fontFamily: 'monospace', fontWeight: 700 }}>

                  {selectedFinding.ruleId}

                </h3>

              </div>

              <button

                onClick={() => setSelectedFinding(null)}

                style={{

                  background: 'rgba(255,255,255,0.06)',

                  border: '1px solid rgba(255,255,255,0.1)',

                  borderRadius: 6,

                  color: '#E8D2B5',

                  padding: 6,

                  cursor: 'pointer'

                }}

              >

                <X size={16} />

              </button>

            </div>



            {/* Location & Title */}

            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(255,255,255,0.06)' }}>

              <div style={{ fontSize: '11px', color: '#78716C', fontFamily: 'monospace' }}>TARGET SOURCE FILE</div>

              <div style={{ fontSize: '12px', color: '#60A5FA', fontFamily: 'monospace', fontWeight: 600, marginTop: 2 }}>

                {selectedFinding.filePath} : Line {selectedFinding.line}, Column {selectedFinding.column}

              </div>

            </div>



            {/* Finding Message */}

            <div>

              <div style={{ fontSize: '11px', color: '#A8A29E', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 4 }}>

                Diagnostic Message

              </div>

              <div style={{ fontSize: '13px', color: '#F5F5F4', lineHeight: 1.5, backgroundColor: '#0F0E0D', padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>

                {selectedFinding.message}

              </div>

            </div>



            {/* Contextual Code Snippet */}

            {selectedFinding.codeSnippet && (

              <div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>

                  <div style={{ fontSize: '11px', color: '#A8A29E', textTransform: 'uppercase', fontFamily: 'monospace' }}>

                    Contextual Code Snippet

                  </div>

                  <button

                    onClick={() => handleCopySnippet(selectedFinding.codeSnippet || '')}

                    style={{

                      background: 'none',

                      border: 'none',

                      color: copiedSnippet ? '#34D399' : '#A8A29E',

                      fontSize: '11px',

                      cursor: 'pointer',

                      display: 'flex',

                      alignItems: 'center',

                      gap: 4

                    }}

                  >

                    {copiedSnippet ? <Check size={12} /> : <Copy size={12} />}

                    {copiedSnippet ? 'Copied' : 'Copy'}

                  </button>

                </div>

                <pre

                  style={{

                    backgroundColor: '#090807',

                    border: '1px solid rgba(89, 9, 7, 0.4)',

                    padding: '12px 16px',

                    borderRadius: 8,

                    fontSize: '11px',

                    fontFamily: 'var(--font-mono, monospace)',

                    color: '#E8D2B5',

                    overflowX: 'auto',

                    lineHeight: 1.6

                  }}

                >

                  {selectedFinding.codeSnippet}

                </pre>

              </div>

            )}



            {/* Suggested Fix */}

            {selectedFinding.suggestedFix && (

              <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>

                <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 600, fontFamily: 'monospace', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>

                  <CheckCircle2 size={13} /> Recommended Remediation

                </div>

                <div style={{ fontSize: '12px', color: '#E8D2B5', lineHeight: 1.5, fontFamily: 'monospace' }}>

                  {selectedFinding.suggestedFix}

                </div>

              </div>

            )}



            {/* ── Stage 4: AI Code Quality Intelligence ────────────────────────── */}

            <div

              style={{

                marginTop: 8,

                padding: '16px 18px',

                borderRadius: 12,

                backgroundColor: '#0A0908',

                border: '1px solid rgba(232, 210, 181, 0.28)',

                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',

                display: 'flex',

                flexDirection: 'column',

                gap: 14

              }}

            >

              {/* AI Header & Action Bar */}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                  <div

                    style={{

                      width: 24,

                      height: 24,

                      borderRadius: 6,

                      background: 'linear-gradient(135deg, #590907, #E8D2B5)',

                      display: 'flex',

                      alignItems: 'center',

                      justifyContent: 'center',

                      color: '#0D0C0A'

                    }}

                  >

                    <Sparkles size={14} />

                  </div>

                  <div>

                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#E8D2B5', fontFamily: 'monospace', letterSpacing: '0.04em' }}>

                      AI FINDING INTELLIGENCE

                    </div>

                    <div style={{ fontSize: '10px', color: '#78716C', fontFamily: 'monospace' }}>

                      Context-Aware Explanations & Remediation Guidance

                    </div>

                  </div>

                </div>



                {/* Explain / Regenerate Buttons */}

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                  {activeAIExplanation && !isAIGenerating && (

                    <button

                      type="button"

                      onClick={() => handleTriggerAI(true)}

                      disabled={isAIGenerating}

                      style={{

                        padding: '6px 12px',

                        borderRadius: 6,

                        backgroundColor: 'rgba(255, 255, 255, 0.05)',

                        border: '1px solid rgba(232, 210, 181, 0.3)',

                        color: '#E8D2B5',

                        fontSize: '11px',

                        fontFamily: 'monospace',

                        fontWeight: 600,

                        cursor: 'pointer',

                        display: 'flex',

                        alignItems: 'center',

                        gap: 6,

                        transition: 'all 0.2s ease'

                      }}

                    >

                      <RotateCcw size={12} />

                      Regenerate

                    </button>

                  )}



                  {!activeAIExplanation && (

                    <button

                      type="button"

                      onClick={() => handleTriggerAI(false)}

                      disabled={isAIGenerating || isAIFetching}

                      style={{

                        padding: '7px 16px',

                        borderRadius: 8,

                        background: 'linear-gradient(135deg, #590907 0%, rgba(89, 9, 7, 0.8) 100%)',

                        border: '1px solid rgba(232, 210, 181, 0.45)',

                        color: '#E8D2B5',

                        fontSize: '11px',

                        fontFamily: 'monospace',

                        fontWeight: 700,

                        cursor: isAIGenerating ? 'not-allowed' : 'pointer',

                        display: 'flex',

                        alignItems: 'center',

                        gap: 8,

                        boxShadow: '0 2px 14px rgba(89, 9, 7, 0.65)',

                        transition: 'all 0.2s ease'

                      }}

                    >

                      <Sparkles size={13} />

                      {isAIGenerating ? 'Analyzing with AI...' : 'Explain with AI'}

                    </button>

                  )}

                </div>

              </div>



              {/* Loading State */}

              {isAIGenerating && (

                <div

                  style={{

                    padding: '24px 16px',

                    borderRadius: 8,

                    backgroundColor: 'rgba(89, 9, 7, 0.15)',

                    border: '1px solid rgba(232, 210, 181, 0.2)',

                    display: 'flex',

                    flexDirection: 'column',

                    alignItems: 'center',

                    justifyContent: 'center',

                    gap: 12

                  }}

                >

                  <div

                    style={{

                      width: 24,

                      height: 24,

                      borderRadius: '50%',

                      border: '2px solid #E8D2B5',

                      borderTopColor: 'transparent',

                      animation: 'spin 0.8s linear infinite'

                    }}

                  />

                  <div style={{ textAlign: 'center' }}>

                    <div style={{ fontSize: '12px', color: '#E8D2B5', fontWeight: 600, fontFamily: 'monospace' }}>

                      Synthesizing Context-Aware AI Explanation...

                    </div>

                    <div style={{ fontSize: '11px', color: '#A8A29E', marginTop: 4, fontFamily: 'monospace' }}>

                      Evaluating scanner rule {selectedFinding.ruleId}, diagnostic root cause, and remediation steps

                    </div>

                  </div>

                </div>

              )}



              {/* Error State */}

              {aiError && !isAIGenerating && (

                <div

                  style={{

                    padding: '12px 14px',

                    borderRadius: 8,

                    backgroundColor: 'rgba(239, 68, 68, 0.1)',

                    border: '1px solid rgba(239, 68, 68, 0.35)',

                    display: 'flex',

                    flexDirection: 'column',

                    gap: 8

                  }}

                >

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#F87171', fontSize: '12px', fontWeight: 600, fontFamily: 'monospace' }}>

                    <AlertCircle size={14} />

                    <span>AI Provider Error</span>

                  </div>

                  <div style={{ fontSize: '11px', color: '#FCA5A5', lineHeight: 1.5, fontFamily: 'monospace' }}>

                    {aiError}

                  </div>

                  {aiError.toLowerCase().includes('gemini_api_key') || aiError.toLowerCase().includes('not configured') ? (

                    <div style={{ fontSize: '10px', color: '#A8A29E', fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: 4 }}>

                      Tip: Set <code style={{ color: '#E8D2B5' }}>GEMINI_API_KEY=your_key</code> in <code style={{ color: '#E8D2B5' }}>backend/.env</code> to activate Google Gemini intelligence.

                    </div>

                  ) : (

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                      <button

                        type="button"

                        onClick={() => handleTriggerAI(false)}

                        style={{

                          background: 'none',

                          border: 'none',

                          color: '#E8D2B5',

                          textDecoration: 'underline',

                          cursor: 'pointer',

                          fontSize: '11px',

                          fontFamily: 'monospace'

                        }}

                      >

                        Try Again

                      </button>

                    </div>

                  )}

                </div>

              )}



              {/* Unopened Initial Callout */}

              {!activeAIExplanation && !isAIGenerating && !aiError && (

                <div

                  style={{

                    padding: '14px 16px',

                    borderRadius: 8,

                    backgroundColor: 'rgba(255, 255, 255, 0.02)',

                    border: '1px dashed rgba(232, 210, 181, 0.2)',

                    display: 'flex',

                    alignItems: 'center',

                    justifyContent: 'space-between',

                    gap: 12

                  }}

                >

                  <div style={{ fontSize: '11px', color: '#A8A29E', lineHeight: 1.5, fontFamily: 'monospace' }}>

                    Click <strong style={{ color: '#E8D2B5' }}>Explain with AI</strong> to generate a comprehensive breakdown: beginner-friendly explanation, why it matters, root cause, verified remediation steps, and concrete code fixes.

                  </div>

                </div>

              )}



              {/* Rendered AI Intelligence Content */}

              {activeAIExplanation && !isAIGenerating && (

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {/* Safety & Advisory Disclaimer */}

                  <div

                    style={{

                      padding: '6px 10px',

                      borderRadius: 6,

                      backgroundColor: 'rgba(245, 158, 11, 0.08)',

                      border: '1px solid rgba(245, 158, 11, 0.25)',

                      display: 'flex',

                      alignItems: 'center',

                      gap: 8,

                      fontSize: '10px',

                      color: '#FBBF24',

                      fontFamily: 'monospace'

                    }}

                  >

                    <AlertTriangle size={12} />

                    <span>

                      AI-GENERATED ADVISORY • Suggested code fixes are proposals and must be reviewed and tested before production deployment.

                    </span>

                  </div>



                  {/* 1. Simple Explanation */}

                  <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(255,255,255,0.06)' }}>

                    <div style={{ fontSize: '11px', color: '#FBBF24', fontWeight: 600, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>

                      <Lightbulb size={13} /> Simple Explanation

                    </div>

                    <div style={{ fontSize: '12px', color: '#E8D2B5', lineHeight: 1.6 }}>

                      {activeAIExplanation.simpleExplanation}

                    </div>

                  </div>



                  {/* 2. Grid: Why It Matters & Root Cause */}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>

                    {/* Why It Matters */}

                    <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(255,255,255,0.06)' }}>

                      <div style={{ fontSize: '11px', color: '#F97316', fontWeight: 600, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>

                        <ShieldAlert size={13} /> Why It Matters

                      </div>

                      <div style={{ fontSize: '12px', color: '#D6D3D1', lineHeight: 1.5 }}>

                        {activeAIExplanation.whyItMatters}

                      </div>

                    </div>



                    {/* Root Cause */}

                    <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(255,255,255,0.06)' }}>

                      <div style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 600, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>

                        <Code2 size={13} /> Root Cause

                      </div>

                      <div style={{ fontSize: '12px', color: '#D6D3D1', lineHeight: 1.5 }}>

                        {activeAIExplanation.rootCause}

                      </div>

                    </div>

                  </div>



                  {/* 3. Risk Assessment */}

                  {activeAIExplanation.riskAssessment && (

                    <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(239, 68, 68, 0.25)' }}>

                      <div style={{ fontSize: '11px', color: '#F87171', fontWeight: 600, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>

                        <AlertTriangle size={13} /> Realistic Risk Assessment

                      </div>

                      <div style={{ fontSize: '12px', color: '#E8D2B5', lineHeight: 1.5 }}>

                        {activeAIExplanation.riskAssessment}

                      </div>

                    </div>

                  )}



                  {/* 4. How to Fix */}

                  <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(16, 185, 129, 0.25)' }}>

                    <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 600, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>

                      <CheckCircle2 size={13} /> Remediation Steps

                    </div>

                    <div style={{ fontSize: '12px', color: '#E8D2B5', lineHeight: 1.6, whiteSpace: 'pre-line' }}>

                      {activeAIExplanation.howToFix}

                    </div>

                  </div>



                  {/* 5. Suggested Code Fix */}

                  {activeAIExplanation.suggestedCodeFix && (

                    <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(16, 185, 129, 0.35)', backgroundColor: '#090807' }}>

                      <div

                        style={{

                          padding: '8px 14px',

                          backgroundColor: 'rgba(16, 185, 129, 0.1)',

                          borderBottom: '1px solid rgba(16, 185, 129, 0.25)',

                          display: 'flex',

                          alignItems: 'center',

                          justifyContent: 'space-between'

                        }}

                      >

                        <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 600, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6 }}>

                          <FileCode2 size={13} /> Suggested Code Fix (AI Proposed)

                        </div>

                        <button

                          type="button"

                          onClick={() => handleCopyFix(activeAIExplanation.suggestedCodeFix || '')}

                          style={{

                            background: 'none',

                            border: 'none',

                            color: copiedFix ? '#34D399' : '#E8D2B5',

                            fontSize: '11px',

                            cursor: 'pointer',

                            display: 'flex',

                            alignItems: 'center',

                            gap: 4,

                            fontFamily: 'monospace'

                          }}

                        >

                          {copiedFix ? <Check size={12} /> : <Copy size={12} />}

                          {copiedFix ? 'Copied!' : 'Copy Code Fix'}

                        </button>

                      </div>

                      <pre

                        style={{

                          margin: 0,

                          padding: '12px 16px',

                          fontSize: '11px',

                          fontFamily: 'var(--font-mono, monospace)',

                          color: '#E8D2B5',

                          overflowX: 'auto',

                          lineHeight: 1.6

                        }}

                      >

                        {activeAIExplanation.suggestedCodeFix}

                      </pre>

                    </div>

                  )}



                  {/* 6. Best Practices */}

                  {activeAIExplanation.bestPractices && activeAIExplanation.bestPractices.length > 0 && (

                    <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: '#0F0E0D', border: '1px solid rgba(255,255,255,0.06)' }}>

                      <div style={{ fontSize: '11px', color: '#A8A29E', fontWeight: 600, fontFamily: 'monospace', marginBottom: 6 }}>

                        RELEVANT STANDARDS & BEST PRACTICES

                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>

                        {activeAIExplanation.bestPractices.map((bp: string, idx: number) => (

                          <span

                            key={idx}

                            style={{

                              padding: '3px 8px',

                              borderRadius: 4,

                              backgroundColor: 'rgba(232, 210, 181, 0.08)',

                              border: '1px solid rgba(232, 210, 181, 0.2)',

                              color: '#E8D2B5',

                              fontSize: '10px',

                              fontFamily: 'monospace'

                            }}

                          >

                            ✓ {bp}

                          </span>

                        ))}

                      </div>

                    </div>

                  )}



                  {/* Footer metadata */}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9px', color: '#78716C', fontFamily: 'monospace', paddingTop: 4 }}>

                    <span>Model: {activeAIExplanation.modelUsed || 'gemini-2.5-flash'}</span>

                    <span>Fingerprint: {activeAIExplanation.fingerprint?.slice(0, 12)}</span>

                  <div style={{ marginTop: 14 }}>
                    <button
                      onClick={() => navigate(`/pull-requests?create=true&repoId=${selectedRepoId}`)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        width: '100%', padding: '10px 14px', borderRadius: 8,
                        background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                        border: '1px solid #F59E0B', color: '#FFF',
                        fontSize: '11px', fontFamily: 'monospace', fontWeight: 700,
                        cursor: 'pointer', letterSpacing: '0.05em'
                      }}
                    >
                      <GitPullRequest size={13} color="#FCD34D" />
                      <span>CREATE AI FIX PULL REQUEST</span>
                    </button>
                  </div>


                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>

  )

}

