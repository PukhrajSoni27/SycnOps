const BASE_URL = 'http://localhost:5000/api'

export interface Repository {
  id: number
  name: string
  stars: number
  forks: number
  openIssues: number
  language: string
  visibility: string
  updatedAt: string
}

export interface PullRequest {
  id: number
  title: string
  repo: string
  author: string
  status: string
  comments: number
  createdAt: string
}

export interface Issue {
  id: number
  title: string
  repo: string
  priority: string
  label: string
  state: string
  assignee: string
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

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health`)
  if (!res.ok) throw new Error('Health check failed')
  return res.json()
}

export async function fetchRepositories(): Promise<Repository[]> {
  const res = await fetch(`${BASE_URL}/repositories`)
  if (!res.ok) throw new Error('Failed to fetch repositories')
  const json = await res.json()
  return json.data
}

export async function fetchPullRequests(): Promise<PullRequest[]> {
  const res = await fetch(`${BASE_URL}/pull-requests`)
  if (!res.ok) throw new Error('Failed to fetch pull requests')
  const json = await res.json()
  return json.data
}

export async function fetchIssues(): Promise<Issue[]> {
  const res = await fetch(`${BASE_URL}/issues`)
  if (!res.ok) throw new Error('Failed to fetch issues')
  const json = await res.json()
  return json.data
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${BASE_URL}/analytics`)
  if (!res.ok) throw new Error('Failed to fetch analytics')
  const json = await res.json()
  return json.data
}

export async function sendAiPrompt(message: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/ai-assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
  if (!res.ok) throw new Error('Failed to process AI request')
  const json = await res.json()
  return json.response
}
