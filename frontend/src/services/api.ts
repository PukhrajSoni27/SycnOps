import { queryClient } from '../lib/queryClient'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export interface Repository {
  id: number
  name: string
  fullName?: string
  description?: string
  stars: number
  forks: number
  openIssues: number
  language: string
  visibility: string
  updatedAt: string
  owner?: string
  avatarUrl?: string
  htmlUrl?: string
  defaultBranch?: string
  topics?: string[]
  watchers?: number
  size?: number
  source?: 'github' | 'manual'
  importedAt?: string
}

export interface PullRequest {
  id: number | string
  title: string
  repo: string
  author: string
  status: string
  comments: number
  createdAt: string
  htmlUrl?: string
  number?: number
  draft?: boolean
  head?: string
  base?: string
  aiFix?: boolean
  prId?: string
  patchIds?: string[]
  validationSummary?: {
    scannersExecuted?: string[]
    resolvedCount?: number
    remainingCount?: number
    newlyIntroducedCount?: number
    testsExecuted?: boolean
    testsPassed?: boolean | null
  }
}

export interface Issue {
  id: number
  title: string
  repo: string
  priority: string
  label: string
  labels?: string[]
  createdAt?: string
  state: string
  assignee: string
  htmlUrl?: string
  number?: number
}

export interface CommitItem {
  id: string
  message: string
  author: string
  time: string
  htmlUrl?: string
  repo?: string
}

export interface DailyActivity {
  day: string
  commits: number
  prs: number
}

export interface AnalyticsData {
  totalCommits: number
  mergedPRs: number
  issuesClosed: number
  codeReviewsCount: number
  velocityScore: number
  dailyActivity: DailyActivity[]
}

export interface PipelineStage {
  id: string
  name: string
  status: 'success' | 'running' | 'failed' | 'queued' | 'skipped'
  duration: string
  logs?: string[]
}

export interface PipelineRun {
  id: string
  name: string
  repo: string
  repoFullName?: string
  branch: string
  commit: string
  commitMessage: string
  author: string
  authorAvatar?: string
  status: 'success' | 'running' | 'failed' | 'queued'
  trigger: 'push' | 'pull_request' | 'manual' | 'schedule' | string
  startedAt: string
  duration: string
  environment: string
  stages: PipelineStage[]
}

export interface AnalysisPipelineStage {
  step: string
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  duration: string
  logs: string[]
  details?: Record<string, any>
}

export interface AnalysisPipelineMetrics {
  totalFilesScanned: number
  languagesDetected: number
  functionsAnalyzed: number
  dependenciesFound: number
  securityIssues: number
  pipelineDuration: string
  pipelineStatus: 'Completed' | 'Running' | 'Failed' | 'Pending' | string
}

export interface RepoAnalysisPipelineData {
  repository: {
    id: number | string
    name: string
    fullName: string
    url: string
    branch: string
    commit: string
    commitMessage: string
  }
  metrics: AnalysisPipelineMetrics
  stages: AnalysisPipelineStage[]
  summaryTable?: Array<{
    category: string
    countQuantity: string
    breakdown: string[]
  }>
  componentBreakdown?: Array<{
    metric: string
    frontend: string
    backend: string
    overall: string
  }>
  securityVulnerabilities?: Array<{
    severity: string
    issueType: string
    description: string
    target: string
    risk: string
  }>
  projectDependencies?: Array<{
    ecosystem: string
    scope: string
    packageCount: number
    keyPackages: string
  }>
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  token?: string
  user?: User
}

function authHeaders(json = false): HeadersInit {
  const token = localStorage.getItem('sycnops_token')
  const headers: Record<string, string> = {}
  if (json) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = { ...authHeaders((options.body as string | undefined) !== undefined), ...(options.headers || {}) }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const errorMsg = json.message || (res.status === 500 || res.status === 503
      ? 'Backend service is unavailable. Please ensure the backend server is running on port 5000.'
      : `Request failed (${res.status})`)
    throw new Error(errorMsg)
  }
  return json
}

export async function fetchHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`)
    return await res.json()
  } catch {
    return { status: 'offline' }
  }
}

export async function fetchRepositories(): Promise<Repository[]> {
  const json = await api('/repositories')
  return Array.isArray(json.data) ? json.data : []
}

export async function fetchPullRequests(repoId?: string | number): Promise<PullRequest[]> {
  const query = repoId ? `?repoId=${encodeURIComponent(repoId)}` : ''
  const json = await api(`/pull-requests${query}`)
  return Array.isArray(json.data) ? json.data : []
}

export async function fetchIssues(repoId?: string | number): Promise<Issue[]> {
  const query = repoId ? `?repoId=${encodeURIComponent(repoId)}` : ''
  const json = await api(`/issues${query}`)
  return Array.isArray(json.data) ? json.data : []
}

export async function fetchAnalytics(repoId?: string | number): Promise<AnalyticsData> {
  const query = repoId ? `?repoId=${encodeURIComponent(repoId)}` : ''
  const json = await api(`/analytics${query}`)
  return json.data
}

export async function fetchPipelines(params?: { status?: string; repo?: string }): Promise<PipelineRun[]> {
  const query = new URLSearchParams()
  if (params?.status && params.status !== 'all') query.set('status', params.status)
  if (params?.repo && params.repo !== 'all') query.set('repo', params.repo)
  const qs = query.toString() ? `?${query.toString()}` : ''
  const json = await api(`/pipelines${qs}`)
  return Array.isArray(json.data) ? json.data : []
}

export async function triggerPipelineRun(data: { repo: string; branch?: string; workflow?: string; environment?: string }): Promise<PipelineRun> {
  const json = await api('/pipelines/trigger', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return json.data
}

export async function cancelPipelineRun(id: string): Promise<PipelineRun> {
  const json = await api(`/pipelines/${id}/cancel`, {
    method: 'POST'
  })
  return json.data
}

export async function fetchRepoAnalysisPipeline(repoId?: string | number): Promise<RepoAnalysisPipelineData> {
  const query = repoId ? `?repoId=${encodeURIComponent(repoId)}` : ''
  const json = await api(`/pipeline/repo-analysis${query}`)
  return json.data
}

export async function runRepoAnalysisPipeline(repoId?: string | number): Promise<RepoAnalysisPipelineData> {
  const json = await api('/pipeline/repo-analysis/run', {
    method: 'POST',
    body: JSON.stringify({ repoId })
  })
  return json.data
}

export async function fetchDashboard(repoId?: string | number) {
  const query = repoId ? `?repoId=${encodeURIComponent(repoId)}` : ''
  const json = await api(`/dashboard${query}`)
  return json.data as {
    totalRepositories: number
    activePullRequests: number
    openIssues: number
    recentCommits: CommitItem[]
    selectedRepository?: Repository | null
  }
}

export async function registerUser(userData: { name: string; email: string; password: string; role?: string }): Promise<AuthResponse> {
  return api('/auth/register', { method: 'POST', body: JSON.stringify(userData) })
}

import { signOutFirebase } from '../lib/firebase'

export function establishUserSession(token: string, user: unknown): void {
  localStorage.removeItem('syncops_selected_repo_id')
  queryClient.clear()
  localStorage.setItem('sycnops_token', token)
  localStorage.setItem('sycnops_user', JSON.stringify(user ?? null))
  window.dispatchEvent(new Event('sycnops_user_updated'))
}

export async function loginUser(credentials: { email: string; password: string }): Promise<AuthResponse> {
  return api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
}

export async function logoutUser(): Promise<void> {
  try {
    await signOutFirebase()
  } catch (err) {
    console.warn('Firebase signOut error during logout:', err)
  }
  localStorage.removeItem('sycnops_token')
  localStorage.removeItem('token')
  localStorage.removeItem('sycnops_user')
  localStorage.removeItem('user')
  localStorage.removeItem('syncops_selected_repo_id')
  queryClient.clear()
  sessionStorage.removeItem('sycnops_pending_auth_provider')
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((k) => {
      if (k.startsWith('sycnops_auth_done_')) sessionStorage.removeItem(k)
    })
  }
  window.dispatchEvent(new Event('sycnops_user_updated'))
}

export async function socialLogin(data: {
  provider: 'google' | 'github'
  idToken: string
  email?: string
  name?: string
}): Promise<AuthResponse> {
  return api('/auth/social', { method: 'POST', body: JSON.stringify(data) })
}

export async function fetchUserProfile(): Promise<User> {
  const json = await api('/auth/me')
  return json.user
}

export async function updateUserProfile(data: { name: string }): Promise<User> {
  const json = await api('/auth/me', { method: 'PUT', body: JSON.stringify(data) })
  return json.user
}

export async function importRepository(data: { name: string; language?: string; visibility?: string; githubToken?: string }): Promise<Repository> {
  const json = await api('/repositories/import', { method: 'POST', body: JSON.stringify(data) })
  return json.data
}

export async function deleteRepository(id: number | string): Promise<{ success: boolean; message: string }> {
  return api(`/repositories/${id}`, { method: 'DELETE' })
}

export async function deleteAllRepositories(): Promise<{ success: boolean; message: string }> {
  return api('/repositories/all', { method: 'DELETE' })
}

export async function fetchGitHubRepoInfo(owner: string, repo: string, token?: string): Promise<any> {
  const query = token ? `?token=${encodeURIComponent(token)}` : ''
  const json = await api(`/repositories/github-info/${owner}/${repo}${query}`)
  return json.data
}

export async function apiGet(path: string) {
  return api(path)
}

export interface CodeFlowNode {
  id: string
  stepNumber: number
  name: string
  type: string
  category: string
  filePath: string
  line: number
  params: string[]
  calls: string[]
  calledBy: string[]
  apiEndpoint: string
  dbOperation: string
  branchConditions: string[]
  errorHandling: string
  summary: string
  codeSnippet: string
}

export interface CodeFlowOperation {
  id: string
  title: string
  repository: string
  description: string
  trigger: string
  apiEndpoint: string
  databaseOperation: string
  totalSteps: number
  nodes: CodeFlowNode[]
}

export async function fetchCodeFlowOperations(repoId?: string | number): Promise<CodeFlowOperation[]> {
  const query = repoId ? `?repoId=${encodeURIComponent(repoId)}` : ''
  const json = await api(`/code-flow/operations${query}`)
  return json.data || []
}

export async function fetchCodeFlowTrace(operation: string, repoId?: string | number): Promise<CodeFlowOperation> {
  const query = repoId ? `&repoId=${encodeURIComponent(repoId)}` : ''
  const json = await api(`/code-flow/trace?operation=${encodeURIComponent(operation)}${query}`)
  return json.data
}

export async function analyzeFileAST(code?: string, filePath?: string): Promise<any> {
  const json = await api('/code-flow/analyze-file', {
    method: 'POST',
    body: JSON.stringify({ code, filePath })
  })
  return json.data
}

// ── File Flow Architecture Types & APIs ────────────────────────

export interface FileFlowNodeData {
  [key: string]: any
  id: string
  label: string
  path: string
  name: string
  category?: 'frontend' | 'backend' | 'database' | 'config' | string
  language?: string
  size?: number
  lines?: number
  linesCount?: number
  functionsCount?: number
  importsCount?: number
  exportsCount?: number
  apiCallsCount?: number
  routesCount?: number
  incomingEdgesCount?: number
  outgoingEdgesCount?: number
  isCircular?: boolean
  isDisconnected?: boolean
  isOrphan?: boolean
  statusLabel?: string
  method?: string
  route?: string
  collection?: string
  operation?: string
  type?: string
  status?: string
}

export interface FileFlowNode {
  id: string
  label?: string
  path?: string
  type: 'fileNode' | 'apiNode' | 'databaseNode' | 'mlNode' | string
  category?: 'frontend' | 'backend' | 'database' | 'config' | string
  position?: { x: number; y: number }
  data: FileFlowNodeData
}

export interface FileFlowEdge {
  id: string
  source: string
  target: string
  type: string
  confidence?: 'high' | 'inferred' | 'unresolved' | string
  evidence?: string
  animated?: boolean
  label?: string
  isCircular?: boolean
}

export interface FileFlowSummary {
  totalFiles: number
  totalNodes: number
  totalEdges: number
  languages: Record<string, number>
  apiEndpointsDetected: number
  matchedConnections: number
  brokenConnections: number
  databaseOperations: number
  circularDependenciesCount?: number
  disconnectedFilesCount?: number
  orphanFilesCount?: number
}

export interface FileFlowGraphResponse {
  projectId: string
  analysisId?: string
  analyzedAt?: string
  timestamp?: string
  scanDuration?: string
  nodes: FileFlowNode[]
  edges: FileFlowEdge[]
  summary: FileFlowSummary
  circularDependencies?: string[][]
}

export interface FileDetailResponse {
  path: string
  name: string
  language: string
  code: string
  linesCount: number
  sizeBytes: number
  functions: Array<{ name: string; line: number; params: string[]; isAsync?: boolean }>
  imports: Array<{ source: string; line: number; specifiers: string[] }>
  exports: Array<{ name: string; line: number; type: string }>
  apiCalls: Array<{ method: string; path: string; line: number; matchedEndpoint?: string }>
  routes: Array<{ method: string; path: string; line: number; handler: string }>
  dbOperations: Array<{ operation: string; collection: string; line: number }>
}

export async function scanFileFlow(projectId = 'sycnops'): Promise<FileFlowGraphResponse> {
  const json = await api('/file-flow/scan', {
    method: 'POST',
    body: JSON.stringify({ projectId })
  })
  return json.data
}

export async function fetchFileFlowGraph(projectId = 'sycnops'): Promise<FileFlowGraphResponse> {
  const json = await api(`/file-flow/graph?projectId=${encodeURIComponent(projectId)}`)
  return json.data
}

export async function fetchFileFlowFiles(projectId = 'sycnops'): Promise<FileFlowNodeData[]> {
  const json = await api(`/file-flow/files?projectId=${encodeURIComponent(projectId)}`)
  return json.data || []
}

export async function fetchFileDetails(filePath: string, projectId?: string): Promise<FileDetailResponse> {
  const repoParam = projectId ? `&projectId=${encodeURIComponent(projectId)}&repoId=${encodeURIComponent(projectId)}` : ''
  const json = await api(`/file-flow/file-details?path=${encodeURIComponent(filePath)}${repoParam}`)
  return json.data
}

export async function fetchFileFlowPaths(
  source: string,
  target: string,
  projectId = 'sycnops'
): Promise<Array<Array<{ id: string; edge: any }>>> {
  const json = await api(
    `/file-flow/paths?source=${encodeURIComponent(source)}&target=${encodeURIComponent(
      target
    )}&projectId=${encodeURIComponent(projectId)}`
  )
  return json.data || []
}

// ── File Topology Interfaces & API Clients ───────────────────────────────────

export interface TopologyTreeNode {
  id: string
  name: string
  path: string
  isDirectory: boolean
  extension?: string
  language?: string
  languageColor?: string
  category?: 'frontend' | 'backend' | 'database' | 'components' | 'utilities' | 'configuration' | 'documentation' | 'middleware' | string
  role?: string
  sizeBytes?: number
  linesCount?: number
  isEntryPoint?: boolean
  isManifest?: boolean
  isSensitive?: boolean
  inDegree?: number
  outDegree?: number
  hasCircularDep?: boolean
  imports?: string[]
  exports?: string[]
  children?: TopologyTreeNode[]
  fileCount?: number
  folderCount?: number
  totalLines?: number
  totalSize?: number
}

export interface TopologySummary {
  totalFiles: number
  totalFolders: number
  totalLines: number
  totalSizeBytes: number
  languages: Record<string, { count: number; lines: number; percentage: number; color?: string }>
  categories: Record<string, number>
  circularDependencies: string[][]
  circularFilesCount?: number
  entryPoints: string[]
  manifests: string[]
  totalEdges: number
}

export interface TopologyData {
  projectId: string
  repositoryId?: string
  analysisId?: string
  scanTimestamp?: string
  summary: TopologySummary
  tree: TopologyTreeNode
  nodes: any[]
  edges: any[]
  files: any[]
}

export interface TopologyFileDetail {
  projectId: string
  file: any
  incomingDependencies: string[]
  outgoingDependencies: string[]
  inDegree: number
  outDegree: number
}

export async function fetchTopology(projectId = 'sycnops'): Promise<TopologyData> {
  const json = await api(`/projects/${encodeURIComponent(projectId)}/topology`)
  return json.data
}

export async function fetchTopologyTree(projectId = 'sycnops'): Promise<{ tree: TopologyTreeNode; summary: TopologySummary }> {
  const json = await api(`/projects/${encodeURIComponent(projectId)}/topology/tree`)
  return json.data
}

export async function fetchTopologyDependencies(projectId = 'sycnops'): Promise<any> {
  const json = await api(`/projects/${encodeURIComponent(projectId)}/topology/dependencies`)
  return json.data
}

export async function fetchTopologyFile(projectId: string, fileId: string): Promise<TopologyFileDetail> {
  const json = await api(`/projects/${encodeURIComponent(projectId)}/topology/file/${encodeURIComponent(fileId)}`)
  return json.data
}

export async function rescanTopology(projectId = 'sycnops'): Promise<TopologyData> {
  const json = await api(`/projects/${encodeURIComponent(projectId)}/topology/rescan`, {
    method: 'POST'
  })
  return json.data
}

// ── Code Quality Interfaces & API Clients (Stage 2B / Stage 3) ───────────────

export type CodeQualitySeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational'
export type CodeQualityScannerName = 'eslint' | 'ruff' | 'semgrep'
export type CodeQualityCategory = 'security' | 'reliability' | 'maintainability' | 'readability' | 'performance'

export interface CodeQualityFinding {
  id: string
  ruleId: string
  title: string
  severity: CodeQualitySeverity
  message: string
  filePath: string
  line: number
  column: number
  endLine?: number
  endColumn?: number
  scanner: CodeQualityScannerName
  category: CodeQualityCategory
  suggestedFix?: string | null
  codeSnippet?: string | null
}

export interface CodeQualitySummary {
  totalFindings: number
  critical: number
  high: number
  medium: number
  low: number
  informational: number
  errors: number
  warnings: number
  byCategory: {
    security: number
    reliability: number
    maintainability: number
    readability: number
    performance: number
  }
  byScanner: {
    eslint: number
    ruff: number
    semgrep: number
  }
  byLanguage: Record<string, number>
  penaltyBreakdown?: Record<string, number>
}

export interface CodeQualityComparison {
  previousScanId?: string
  previousScore?: number
  scoreDifference: number
  newFindingsCount: number
  resolvedFindingsCount: number
  persistentFindingsCount: number
  escalatedCount?: number
  reducedCount?: number
}

export interface CodeQualityLatestScan {
  scanId: string
  repositoryId: string
  repoName: string
  status: 'completed' | 'failed' | 'running' | 'queued'
  qualityScore: number
  grade: string
  penaltiesTotal?: number
  totalFindings: number
  severityCounts: {
    critical: number
    high: number
    medium: number
    low: number
    informational: number
  }
  scannerBreakdown: {
    eslint: number
    ruff: number
    semgrep: number
  }
  categoryBreakdown: {
    security: number
    reliability: number
    maintainability: number
    readability: number
    performance: number
  }
  languageBreakdown: Record<string, number>
  scanDuration: number
  durationMs: number
  lastScanTimestamp: string
  createdAt: string
  previousScore?: number | null
  scoreDifference?: number
  comparison?: CodeQualityComparison | null
  languagesDetected: string[]
  scannersExecuted: Record<string, { status: string; durationMs: number; findingsCount: number; error?: string; reason?: string }>
  scannedFilesCount: number
  summary: CodeQualitySummary
}

export interface CodeQualityScanStatus {
  success: boolean
  repositoryId: string
  scanId?: string
  status: 'idle' | 'queued' | 'running' | 'completed' | 'failed'
  createdAt?: string
  startedAt?: string
  completedAt?: string
  durationMs?: number
  qualityScore?: number
  grade?: string
  summary?: CodeQualitySummary
  error?: string
  message?: string
}

export interface CodeQualityHistoryItem {
  scanId: string
  repositoryId: string
  userId?: string
  repoName: string
  status: string
  qualityScore: number
  grade: string
  penaltiesTotal?: number
  summary: CodeQualitySummary
  findingsCount: number
  languagesDetected?: string[]
  scannersExecuted?: Record<string, any>
  scannedFilesCount?: number
  durationMs: number
  createdAt: string
  comparison?: CodeQualityComparison
}

export interface CodeQualityHistoryResponse {
  scans: CodeQualityHistoryItem[]
  pagination: {
    total: number
    page: number
    totalPages: number
    limit: number
  }
}

export interface CodeQualityFullScan extends CodeQualityLatestScan {
  findings: CodeQualityFinding[]
}

export async function fetchCodeQualityLatest(repoId: string | number): Promise<CodeQualityLatestScan | null> {
  try {
    const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality`)
    return json.data || null
  } catch (err: any) {
    if (err.message?.includes('404') || err.message?.toLowerCase().includes('not found')) {
      return null
    }
    throw err
  }
}

export async function fetchCodeQualityStatus(repoId: string | number, scanId?: string): Promise<CodeQualityScanStatus> {
  const query = scanId ? `?scanId=${encodeURIComponent(scanId)}` : ''
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/status${query}`)
  return json
}

export async function triggerCodeQualityScan(
  repoId: string | number,
  sync = false
): Promise<{ success: boolean; scanId: string; status: string; statusUrl?: string; qualityScore?: number; grade?: string; summary?: any }> {
  const query = sync ? '?sync=true' : ''
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/scan${query}`, {
    method: 'POST'
  })
  return json
}

export async function fetchCodeQualityHistory(
  repoId: string | number,
  page = 1,
  limit = 10
): Promise<CodeQualityHistoryResponse> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/history?page=${page}&limit=${limit}`)
  return {
    scans: json.data || [],
    pagination: json.pagination || { total: 0, page, totalPages: 0, limit }
  }
}

export async function fetchCodeQualityScanDetails(repoId: string | number, scanId: string): Promise<CodeQualityFullScan> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/scans/${encodeURIComponent(scanId)}`)
  return json.data
}

export async function fetchCodeQualityFinding(
  repoId: string | number,
  findingId: string,
  scanId?: string
): Promise<{ scanId: string; repositoryId: string; finding: CodeQualityFinding }> {
  const query = scanId ? `?scanId=${encodeURIComponent(scanId)}` : ''
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/findings/${encodeURIComponent(findingId)}${query}`)
  return json.data
}

// ── Stage 4: AI Code Quality Intelligence ──────────────────────────────────

export interface AIExplanation {
  simpleExplanation: string
  whyItMatters: string
  rootCause: string
  howToFix: string
  suggestedCodeFix?: string | null
  bestPractices: string[]
  riskAssessment: string
  isAIGenerated: boolean
  disclaimer: string
  modelUsed?: string
  fingerprint?: string
  generatedAt?: string
}

export interface AIProviderStatus {
  available: boolean
  provider: string
  model: string
  hasKey: boolean
}

export async function fetchAIProviderStatus(repoId: string | number): Promise<AIProviderStatus> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/ai-status`)
  return json.data
}

export async function fetchAIExplanation(
  repoId: string | number,
  findingId: string,
  scanId?: string
): Promise<AIExplanation | null> {
  try {
    const query = scanId ? `?scanId=${encodeURIComponent(scanId)}` : ''
    const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/findings/${encodeURIComponent(findingId)}/explain${query}`)
    return json.data || null
  } catch (err: any) {
    if (err.message?.includes('404') || err.message?.toLowerCase().includes('no ai explanation')) {
      return null
    }
    throw err
  }
}

export async function generateAIExplanation(
  repoId: string | number,
  findingId: string,
  options: { scanId?: string; regenerate?: boolean } = {}
): Promise<{ cached: boolean; data: AIExplanation }> {
  const query = options.scanId ? `?scanId=${encodeURIComponent(options.scanId)}` : ''
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/findings/${encodeURIComponent(findingId)}/explain${query}`, {
    method: 'POST',
    body: JSON.stringify(options)
  })
  return {
    cached: Boolean(json.cached),
    data: json.data
  }
}



// ── Stage 5: AI Fix Assistant ──────────────────────────────────────────────

export interface AIPatch {
  patchId: string
  userId: string
  repositoryId: string
  scanId?: string | null
  findingId: string
  filePath: string
  language: string
  scanner: string
  ruleId: string
  originalContentHash: string
  explanation: string
  originalSnippet: string
  proposedSnippet: string
  unifiedDiff: string
  startLine: number
  endLine: number
  addedLinesCount: number
  removedLinesCount: number
  status: 'proposed' | 'applied' | 'rejected' | 'rolled_back'
  validationResult?: 'resolved' | 'changed' | 'still_present' | null
  validationMessage?: string | null
  scannerExecuted?: string | null
  createdAt: string
  updatedAt: string
  appliedAt?: string | null
  rolledBackAt?: string | null
}

export async function fetchAIFix(
  repoId: string | number,
  findingId: string,
  scanId?: string
): Promise<AIPatch | null> {
  try {
    const query = scanId ? `?scanId=${encodeURIComponent(scanId)}` : ''
    const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/findings/${encodeURIComponent(findingId)}/fix${query}`)
    return json.data || null
  } catch (err: any) {
    if (err.message?.includes('404') || err.message?.toLowerCase().includes('no ai fix')) {
      return null
    }
    throw err
  }
}

export async function generateAIFix(
  repoId: string | number,
  findingId: string,
  options: { scanId?: string } = {}
): Promise<AIPatch> {
  const query = options.scanId ? `?scanId=${encodeURIComponent(options.scanId)}` : ''
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/findings/${encodeURIComponent(findingId)}/generate-fix${query}`, {
    method: 'POST',
    body: JSON.stringify(options)
  })
  return json.data
}

export async function applyAIFix(
  repoId: string | number,
  patchId: string,
  options: { confirmed: boolean; skipValidation?: boolean } = { confirmed: true }
): Promise<{ success: boolean; data: AIPatch; validationResult?: string; validationMessage?: string }> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/patches/${encodeURIComponent(patchId)}/apply`, {
    method: 'POST',
    body: JSON.stringify({ ...options, confirmed: true })
  })
  return json
}

export async function rollbackAIFix(
  repoId: string | number,
  patchId: string
): Promise<{ success: boolean; message: string; patch: AIPatch }> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/patches/${encodeURIComponent(patchId)}/rollback`, {
    method: 'POST'
  })
  return json
}

export async function rejectAIFix(
  repoId: string | number,
  patchId: string
): Promise<{ success: boolean; message: string; data: AIPatch }> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/patches/${encodeURIComponent(patchId)}/reject`, {
    method: 'POST'
  })
  return json
}


// ── Stage 6: GitHub Integration & AI Fix PR Automation ─────────────────────

export interface SyncOpsPRRecord {
  id: string
  prId: string
  userId: string
  repositoryId: string
  repoFullName: string
  number: number | null
  title: string
  description: string
  headBranch: string
  baseBranch: string
  commitSha: string | null
  htmlUrl: string | null
  status: 'open' | 'merged' | 'closed' | 'failed'
  draft: boolean
  patchIds: string[]
  affectedFiles: string[]
  validationSummary: {
    scannersExecuted: string[]
    resolvedCount: number
    remainingCount: number
    newlyIntroducedCount: number
    testsExecuted: boolean
    testsPassed: boolean | null
  }
  createdAt: string
  updatedAt: string
  mergedAt?: string | null
  closedAt?: string | null
  githubSyncedAt?: string | null
}

export interface PreparePRPayload {
  patchIds: string[]
  branchName?: string
  baseBranch?: string
  customCommitMessage?: string
  customTitle?: string
  customDescription?: string
}

export interface PreparePRResponse {
  success: boolean
  data: {
    branchName: string
    baseBranch: string
    affectedFiles: string[]
    patches: AIPatch[]
    proposedCommit: string
    proposedTitle: string
    proposedDescription: string
  }
  error?: string
  message?: string
  modifiedFiles?: string[]
}

export interface ValidatePRPayload {
  patchIds: string[]
  branchName?: string
  baseBranch?: string
  runTests?: boolean
}

export interface ValidatePRResponse {
  success: boolean
  data: {
    branch: string
    baseBranch: string
    affectedFiles: string[]
    appliedPatches: AIPatch[]
    validation: {
      passed: boolean
      passedQuality: boolean
      passedTests: boolean
      scannersExecuted: string[]
      resolvedFindings: any[]
      remainingFindings: any[]
      newlyIntroducedFindings: any[]
      testResults: {
        executed: boolean
        passed: boolean
        output?: string
        durationMs?: number
      }
    }
  }
  error?: string
  message?: string
}

export interface CreatePRPayload {
  patchIds: string[]
  branchName: string
  baseBranch?: string
  confirmed: boolean
  commitMessage?: string
  title?: string
  description?: string
  githubToken?: string
  overrideValidation?: boolean
  force?: boolean
  runTests?: boolean
  draft?: boolean
}

export async function preparePullRequest(
  repoId: string | number,
  payload: PreparePRPayload
): Promise<PreparePRResponse> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/pull-requests/prepare`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  return json
}

export async function validatePullRequest(
  repoId: string | number,
  payload: ValidatePRPayload
): Promise<ValidatePRResponse> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/pull-requests/validate`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  return json
}

export async function createPullRequest(
  repoId: string | number,
  payload: CreatePRPayload
): Promise<{ success: boolean; message: string; data: SyncOpsPRRecord }> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/pull-requests/create`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  return json
}


export async function fetchRepoPatches(
  repoId: string | number
): Promise<AIPatch[]> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/code-quality/patches`)
  return json.data || []
}

export async function fetchRepoPullRequests(
  repoId: string | number
): Promise<SyncOpsPRRecord[]> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/pull-requests`)
  return json.data || []
}

export async function fetchPullRequestDetails(
  repoId: string | number,
  prId: string
): Promise<SyncOpsPRRecord> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/pull-requests/${encodeURIComponent(prId)}`)
  return json.data
}

export async function syncPullRequestStatus(
  repoId: string | number,
  prId: string,
  githubToken?: string
): Promise<{ success: boolean; message: string; data: SyncOpsPRRecord }> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/pull-requests/${encodeURIComponent(prId)}/sync`, {
    method: 'POST',
    body: JSON.stringify({ githubToken })
  })
  return json
}

export async function rollbackFixBranch(
  repoId: string | number,
  payload: { patchIds: string[]; baseBranch?: string }
): Promise<{ success: boolean; message: string }> {
  const json = await api(`/repositories/${encodeURIComponent(repoId)}/pull-requests/rollback`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  return json
}
