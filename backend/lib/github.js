const GH_TIMEOUT_MS = 12000

function ghHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'SycnOps-AI/2.0'
  }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return headers
}

export function parseGitHubRepo(input) {
  if (!input?.trim()) return null
  const cleaned = input.trim().replace(/\/+$/, '')
  const urlMatch = cleaned.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?$/i)
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] }
  const slashMatch = cleaned.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/)
  if (slashMatch) return { owner: slashMatch[1], repo: slashMatch[2] }
  return null
}

export async function ghFetch(path) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), GH_TIMEOUT_MS)
  try {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: ghHeaders(),
      signal: ctrl.signal
    })
    if (res.status === 403) throw new Error('GitHub API rate limit reached. Add GITHUB_TOKEN in backend env and retry.')
    if (res.status === 404) throw new Error('Not found on GitHub.')
    if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('GitHub request timed out.')
    throw err
  } finally {
    clearTimeout(timer)
  }
}

function labelPriority(labels = []) {
  const names = labels.map((l) => (l.name || '').toLowerCase())
  if (names.some((n) => /critical|security|urgent|p0/.test(n))) return 'high'
  if (names.some((n) => /bug|error|crash|high/.test(n))) return 'high'
  if (names.some((n) => /medium|p1|p2/.test(n))) return 'medium'
  return names.length ? 'medium' : 'low'
}

function timeAgo(iso) {
  if (!iso) return ''
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000))
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function mapRepo(data, extra = {}) {
  return {
    id: extra.id || data.id,
    name: data.name,
    fullName: data.full_name,
    description: data.description || '',
    language: data.language || 'Unknown',
    stars: data.stargazers_count || 0,
    forks: data.forks_count || 0,
    openIssues: data.open_issues_count || 0,
    visibility: data.private ? 'private' : 'public',
    defaultBranch: data.default_branch || 'main',
    owner: data.owner?.login,
    avatarUrl: data.owner?.avatar_url || '',
    htmlUrl: data.html_url || '',
    topics: data.topics || [],
    watchers: data.watchers_count || 0,
    size: data.size || 0,
    updatedAt: timeAgo(data.updated_at) || data.updated_at,
    importedAt: extra.importedAt || new Date().toISOString(),
    source: 'github'
  }
}

export function mapIssue(issue, repoFullName) {
  const labels = issue.labels || []
  return {
    id: issue.id,
    number: issue.number,
    title: issue.title,
    repo: repoFullName,
    priority: labelPriority(labels),
    label: labels[0]?.name || (issue.pull_request ? 'pull-request' : 'issue'),
    state: issue.state,
    assignee: issue.assignee?.login || 'unassigned',
    htmlUrl: issue.html_url,
    createdAt: timeAgo(issue.created_at),
    createdAtRaw: issue.created_at
  }
}

export function mapPR(pr, repoFullName) {
  let status = pr.state
  if (pr.merged_at) status = 'merged'
  return {
    id: pr.id,
    number: pr.number,
    title: pr.title,
    repo: repoFullName,
    author: pr.user?.login || 'unknown',
    status,
    comments: pr.comments || 0,
    createdAt: timeAgo(pr.created_at),
    createdAtRaw: pr.created_at,
    htmlUrl: pr.html_url,
    draft: !!pr.draft,
    head: pr.head?.ref || null,
    base: pr.base?.ref || null,
    avatar: pr.user?.avatar_url || ''
  }
}


export function mapCommit(commit, repoFullName) {
  return {
    id: commit.sha?.substring(0, 7),
    fullSha: commit.sha,
    message: commit.commit?.message?.split('\n')[0] || '',
    author: commit.commit?.author?.name || commit.author?.login || 'unknown',
    time: timeAgo(commit.commit?.author?.date),
    date: commit.commit?.author?.date,
    htmlUrl: commit.html_url,
    avatar: commit.author?.avatar_url || '',
    repo: repoFullName
  }
}

export async function fetchRepoBundle(owner, repo) {
  const [meta, issuesRaw, pullsRaw, commitsRaw] = await Promise.all([
    ghFetch(`/repos/${owner}/${repo}`),
    ghFetch(`/repos/${owner}/${repo}/issues?state=open&per_page=50&sort=updated`).catch(() => []),
    ghFetch(`/repos/${owner}/${repo}/pulls?state=open&per_page=50&sort=updated`).catch(() => []),
    ghFetch(`/repos/${owner}/${repo}/commits?per_page=30`).catch(() => [])
  ])
  const fullName = meta.full_name
  const issues = (Array.isArray(issuesRaw) ? issuesRaw : []).filter((i) => !i.pull_request).map((i) => mapIssue(i, fullName))
  const pulls = (Array.isArray(pullsRaw) ? pullsRaw : []).map((p) => mapPR(p, fullName))
  const commits = (Array.isArray(commitsRaw) ? commitsRaw : []).map((c) => mapCommit(c, fullName))
  return { meta, issues, pulls, commits }
}

function hasLabel(issue, re) {
  return (issue.labels || []).some((l) => re.test(l.name || ''))
}

export async function buildAnalysis(owner, name, storedRepo) {
  const [issues, pulls, repoData, commits, contributors, languages, releases, branches] = await Promise.all([
    ghFetch(`/repos/${owner}/${name}/issues?state=all&per_page=100`).catch(() => []),
    ghFetch(`/repos/${owner}/${name}/pulls?state=all&per_page=100`).catch(() => []),
    ghFetch(`/repos/${owner}/${name}`).catch(() => null),
    ghFetch(`/repos/${owner}/${name}/commits?per_page=100`).catch(() => []),
    ghFetch(`/repos/${owner}/${name}/contributors?per_page=20`).catch(() => []),
    ghFetch(`/repos/${owner}/${name}/languages`).catch(() => ({})),
    ghFetch(`/repos/${owner}/${name}/releases?per_page=10`).catch(() => []),
    ghFetch(`/repos/${owner}/${name}/branches?per_page=50`).catch(() => [])
  ])

  const now = Date.now()
  const openIssues = issues.filter((i) => i.state === 'open' && !i.pull_request)
  const closedIssues = issues.filter((i) => i.state === 'closed' && !i.pull_request)
  const bugIssues = openIssues.filter((i) => hasLabel(i, /bug|error|fix|crash|broken|regression|defect/i))
  const securityIssues = openIssues.filter((i) => hasLabel(i, /security|vulnerability|cve|exploit|xss|injection/i))
  const perfIssues = openIssues.filter((i) => hasLabel(i, /performance|slow|memory|leak|timeout|bottleneck/i))
  const featureIssues = openIssues.filter((i) => hasLabel(i, /feature|enhancement|request|improvement/i))
  const docIssues = openIssues.filter((i) => hasLabel(i, /docs?|documentation|readme|wiki/i))
  const staleCutoff = 90 * 24 * 60 * 60 * 1000
  const staleIssues = openIssues.filter((i) => now - new Date(i.updated_at).getTime() > staleCutoff)
  const oldBugCutoff = 180 * 24 * 60 * 60 * 1000
  const oldBugIssues = bugIssues.filter((i) => now - new Date(i.created_at).getTime() > oldBugCutoff)

  const openPRs = pulls.filter((p) => p.state === 'open')
  const mergedPRs = pulls.filter((p) => p.merged_at)
  const closedPRs = pulls.filter((p) => p.state === 'closed' && !p.merged_at)
  const draftPRs = openPRs.filter((p) => p.draft)
  const stalePRs = openPRs.filter((p) => now - new Date(p.updated_at).getTime() > staleCutoff)

  const commitDates = commits.map((c) => new Date(c.commit?.author?.date).getTime()).filter(Boolean)
  const recentCommits7d = commitDates.filter((d) => now - d < 7 * 24 * 60 * 60 * 1000).length
  const recentCommits30d = commitDates.filter((d) => now - d < 30 * 24 * 60 * 60 * 1000).length
  const lastCommitDate = commitDates.length ? new Date(Math.max(...commitDates)) : null
  const daysSinceCommit = lastCommitDate ? Math.floor((now - lastCommitDate.getTime()) / 86400000) : null
  const recentAuthors = [...new Set(commits.slice(0, 30).map((c) => c.commit?.author?.name || c.author?.login).filter(Boolean))]

  const totalBytes = Object.values(languages).reduce((s, v) => s + v, 0)
  const langBreakdown = Object.entries(languages).map(([lang, bytes]) => ({
    lang, bytes, pct: totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0
  })).sort((a, b) => b.bytes - a.bytes)
  const primaryLang = langBreakdown[0]?.lang || repoData?.language || 'Unknown'

  const latestRelease = releases[0] || null
  const daysSinceRelease = latestRelease
    ? Math.floor((now - new Date(latestRelease.published_at).getTime()) / 86400000)
    : null

  const topContributor = contributors[0] || null
  const totalContribs = contributors.reduce((s, c) => s + (c.contributions || 0), 0)
  const bussFactorPct = topContributor && totalContribs > 0
    ? Math.round((topContributor.contributions / totalContribs) * 100) : 0
  const busFactor = bussFactorPct > 60 ? 'HIGH RISK' : bussFactorPct > 40 ? 'MEDIUM RISK' : 'LOW RISK'

  const hasLicense = !!repoData?.license
  const hasDescription = !!(repoData?.description && repoData.description.trim())
  const hasTopics = (repoData?.topics || []).length > 0
  const issueCloseRate = closedIssues.length + openIssues.length > 0
    ? Math.round((closedIssues.length / (closedIssues.length + openIssues.length)) * 100) : 0
  const prMergeRate = mergedPRs.length + openPRs.length + closedPRs.length > 0
    ? Math.round((mergedPRs.length / (mergedPRs.length + openPRs.length + closedPRs.length)) * 100) : 0

  let healthScore = 60
  if (issueCloseRate > 80) healthScore += 12
  else if (issueCloseRate > 60) healthScore += 6
  else if (issueCloseRate < 30) healthScore -= 15
  if (prMergeRate > 75) healthScore += 8
  else if (prMergeRate < 40) healthScore -= 10
  if (bugIssues.length === 0) healthScore += 10
  else if (bugIssues.length > 20) healthScore -= 15
  if (securityIssues.length > 0) healthScore -= 10
  if (daysSinceCommit !== null && daysSinceCommit > 365) healthScore -= 20
  else if (daysSinceCommit !== null && daysSinceCommit < 7) healthScore += 5
  if (hasLicense) healthScore += 5
  if (hasDescription) healthScore += 3
  healthScore = Math.max(0, Math.min(100, healthScore))
  const healthTier = healthScore >= 80 ? 'Excellent' : healthScore >= 65 ? 'Good' : healthScore >= 45 ? 'Fair' : 'Needs Attention'

  const findings = []
  if (securityIssues.length) findings.push({ severity: 'critical', icon: '🚨', category: 'Security', title: `${securityIssues.length} security issue(s) open`, detail: 'Review and patch from GitHub.' })
  if (bugIssues.length > 0) findings.push({ severity: bugIssues.length > 15 ? 'high' : 'medium', icon: '🐛', category: 'Bugs', title: `${bugIssues.length} open bugs`, detail: 'Sourced from GitHub issue labels.' })
  if (!hasLicense) findings.push({ severity: 'high', icon: '📄', category: 'Legal', title: 'No license detected', detail: 'Add a license on GitHub.' })
  if (daysSinceCommit !== null && daysSinceCommit > 90) findings.push({ severity: 'medium', icon: '🕐', category: 'Activity', title: `Last commit ${daysSinceCommit} days ago`, detail: 'Repository activity from GitHub commits.' })
  if (stalePRs.length) findings.push({ severity: 'medium', icon: '🔀', category: 'Pull Requests', title: `${stalePRs.length} stale pull request(s)`, detail: 'Open PRs idle 90+ days.' })
  if (!findings.length) findings.push({ severity: 'low', icon: '✅', category: 'Health', title: 'No major issues flagged', detail: 'Based on current GitHub labels and activity.' })

  const insights = [
    `GitHub stats: ${(repoData?.stargazers_count || storedRepo?.stars || 0).toLocaleString()} stars, ${(repoData?.forks_count || 0).toLocaleString()} forks.`,
    `${bugIssues.length} open bugs of ${openIssues.length} open issues.`,
    `${openPRs.length} open PRs, merge rate ${prMergeRate}%.`,
    daysSinceCommit !== null ? `Last commit ${daysSinceCommit} day(s) ago; ${recentCommits30d} commits in 30 days.` : 'No commit history available.',
    `Primary language: ${primaryLang}.`
  ]

  const fmtIssue = (i) => ({
    number: i.number, title: i.title, htmlUrl: i.html_url,
    labels: (i.labels || []).map((l) => ({ name: l.name, color: l.color })),
    body: (i.body || '').substring(0, 300),
    createdAt: i.created_at, updatedAt: i.updated_at,
    user: i.user?.login, avatar: i.user?.avatar_url,
    daysOld: Math.floor((now - new Date(i.created_at).getTime()) / 86400000),
    comments: i.comments
  })

  return {
    healthScore, healthTier, issueCloseRate, prMergeRate,
    openBugs: bugIssues.length,
    securityIssues: securityIssues.length,
    perfIssues: perfIssues.length,
    docIssues: docIssues.length,
    openFeatureRequests: featureIssues.length,
    staleIssues: staleIssues.length,
    oldBugs: oldBugIssues.length,
    totalOpenIssues: openIssues.length,
    totalClosedIssues: closedIssues.length,
    openPRs: openPRs.length,
    mergedPRs: mergedPRs.length,
    closedPRs: closedPRs.length,
    draftPRs: draftPRs.length,
    stalePRs: stalePRs.length,
    recentCommits7d, recentCommits30d, daysSinceCommit,
    lastCommitDate: lastCommitDate?.toISOString() || null,
    recentAuthors,
    hasLicense,
    licenseName: repoData?.license?.spdx_id || repoData?.license?.name || null,
    hasDescription,
    hasWiki: !!repoData?.has_wiki,
    hasTopics,
    topicsCount: (repoData?.topics || []).length,
    isArchived: !!repoData?.archived,
    isForked: !!repoData?.fork,
    repoSize: repoData?.size || 0,
    defaultBranch: repoData?.default_branch || 'main',
    openIssuesCount: repoData?.open_issues_count || 0,
    watchersCount: repoData?.watchers_count || 0,
    latestRelease: latestRelease ? {
      tagName: latestRelease.tag_name, name: latestRelease.name,
      publishedAt: latestRelease.published_at, htmlUrl: latestRelease.html_url,
      prerelease: latestRelease.prerelease
    } : null,
    daysSinceRelease,
    totalReleases: releases.length,
    preReleases: releases.filter((r) => r.prerelease).length,
    topContributor: topContributor ? {
      login: topContributor.login, avatar: topContributor.avatar_url,
      contributions: topContributor.contributions, pct: bussFactorPct
    } : null,
    contributorsCount: contributors.length,
    busFactor, bussFactorPct, primaryLang, langBreakdown,
    branchCount: branches.length,
    bugs: bugIssues.slice(0, 20).map(fmtIssue),
    securityIssuesList: securityIssues.slice(0, 10).map(fmtIssue),
    perfIssuesList: perfIssues.slice(0, 10).map(fmtIssue),
    stalePRsList: stalePRs.slice(0, 10).map((p) => ({
      number: p.number, title: p.title, htmlUrl: p.html_url,
      user: p.user?.login, createdAt: p.created_at, updatedAt: p.updated_at,
      draft: p.draft,
      daysOld: Math.floor((now - new Date(p.updated_at).getTime()) / 86400000)
    })),
    featureRequests: featureIssues.slice(0, 10).map(fmtIssue),
    recentCommits: commits.slice(0, 15).map((c) => ({
      sha: c.sha?.substring(0, 7),
      message: c.commit?.message?.split('\n')[0] || '',
      author: c.commit?.author?.name || c.author?.login || 'unknown',
      avatar: c.author?.avatar_url || '',
      date: c.commit?.author?.date,
      htmlUrl: c.html_url
    })),
    staleIssuesList: staleIssues.slice(0, 10).map((i) => ({
      number: i.number, title: i.title, htmlUrl: i.html_url,
      createdAt: i.created_at, updatedAt: i.updated_at,
      user: i.user?.login,
      daysIdle: Math.floor((now - new Date(i.updated_at).getTime()) / 86400000)
    })),
    findings,
    recommendations: findings.slice(0, 6).map((f) => ({ priority: f.severity, text: f.title })),
    insights,
    summary: {
      criticalFindings: findings.filter((f) => f.severity === 'critical').length,
      highFindings: findings.filter((f) => f.severity === 'high').length,
      mediumFindings: findings.filter((f) => f.severity === 'medium').length,
      lowFindings: findings.filter((f) => f.severity === 'low').length
    }
  }
}

export async function fetchDetails(owner, name, repo) {
  const [issues, pulls, commits, languages, contributors] = await Promise.all([
    ghFetch(`/repos/${owner}/${name}/issues?state=open&per_page=15&sort=updated`).catch(() => []),
    ghFetch(`/repos/${owner}/${name}/pulls?state=open&per_page=15&sort=updated`).catch(() => []),
    ghFetch(`/repos/${owner}/${name}/commits?per_page=20`).catch(() => []),
    ghFetch(`/repos/${owner}/${name}/languages`).catch(() => ({})),
    ghFetch(`/repos/${owner}/${name}/contributors?per_page=10`).catch(() => [])
  ])
  return {
    repo,
    issues: (Array.isArray(issues) ? issues : []).filter((i) => !i.pull_request).map((i) => ({
      id: i.id, number: i.number, title: i.title, state: i.state,
      labels: (i.labels || []).map((l) => ({ name: l.name, color: l.color })),
      user: i.user?.login, avatar: i.user?.avatar_url,
      createdAt: i.created_at, updatedAt: i.updated_at,
      comments: i.comments, htmlUrl: i.html_url,
      body: (i.body || '').substring(0, 300)
    })),
    pulls: (Array.isArray(pulls) ? pulls : []).map((p) => ({
      id: p.id, number: p.number, title: p.title, state: p.state,
      user: p.user?.login, avatar: p.user?.avatar_url,
      createdAt: p.created_at, updatedAt: p.updated_at,
      draft: p.draft, htmlUrl: p.html_url,
      head: p.head?.ref, base: p.base?.ref
    })),
    commits: (Array.isArray(commits) ? commits : []).map((c) => mapCommit(c, repo.fullName)),
    languages,
    contributors: (Array.isArray(contributors) ? contributors : []).map((c) => ({
      login: c.login, avatar: c.avatar_url,
      contributions: c.contributions, htmlUrl: c.html_url
    }))
  }
}
