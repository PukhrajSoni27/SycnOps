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
  id: number
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
}

export interface Issue {
  id: number
  title: string
  repo: string
  priority: string
  label: string
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

export async function fetchPullRequests(): Promise<PullRequest[]> {
  const json = await api('/pull-requests')
  return Array.isArray(json.data) ? json.data : []
}

export async function fetchIssues(): Promise<Issue[]> {
  const json = await api('/issues')
  return Array.isArray(json.data) ? json.data : []
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const json = await api('/analytics')
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

export async function fetchDashboard() {
  const json = await api('/dashboard')
  return json.data as {
    totalRepositories: number
    activePullRequests: number
    openIssues: number
    recentCommits: CommitItem[]
  }
}

export async function registerUser(userData: { name: string; email: string; password: string; role?: string }): Promise<AuthResponse> {
  return api('/auth/register', { method: 'POST', body: JSON.stringify(userData) })
}

export async function loginUser(credentials: { email: string; password: string }): Promise<AuthResponse> {
  return api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
}

export async function socialLogin(data: { provider: 'google' | 'github'; email: string; name?: string }): Promise<AuthResponse> {
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

export async function fetchCodeFlowOperations(): Promise<CodeFlowOperation[]> {
  const json = await api('/code-flow/operations')
  return json.data || []
}

export async function fetchCodeFlowTrace(operation = 'report-lost-item'): Promise<CodeFlowOperation> {
  const json = await api(`/code-flow/trace?operation=${encodeURIComponent(operation)}`)
  return json.data
}

export async function analyzeFileAST(code?: string, filePath?: string): Promise<any> {
  const json = await api('/code-flow/analyze-file', {
    method: 'POST',
    body: JSON.stringify({ code, filePath })
  })
  return json.data
}
