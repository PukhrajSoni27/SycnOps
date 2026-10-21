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
  if (!res.ok) throw new Error(json.message || `Request failed (${res.status})`)
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

export async function importRepository(data: { name: string }): Promise<Repository> {
  const json = await api('/repositories/import', { method: 'POST', body: JSON.stringify(data) })
  return json.data
}

export async function fetchGitHubRepoInfo(owner: string, repo: string): Promise<any> {
  const json = await api(`/repositories/github-info/${owner}/${repo}`)
  return json.data
}

export async function apiGet(path: string) {
  return api(path)
}
