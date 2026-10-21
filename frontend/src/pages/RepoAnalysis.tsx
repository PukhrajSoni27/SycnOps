import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { apiGet } from '@/services/api'
import {
  ArrowLeft, ExternalLink, Shield, AlertTriangle, Bug, Zap, BookOpen,
  GitBranch, GitPullRequest, Users, Clock, Star, GitFork, Package,
  Activity, TrendingUp, CheckCircle, XCircle, AlertCircle, Tag,
  Calendar, Lock, Globe, Loader2, ChevronDown, ChevronUp, Download
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Finding {
  severity: 'critical' | 'high' | 'medium' | 'low'
  icon: string
  category: string
  title: string
  detail: string
}

interface AnalysisData {
  healthScore: number
  healthTier: string
  issueCloseRate: number
  prMergeRate: number
  openBugs: number
  securityIssues: number
  perfIssues: number
  docIssues: number
  openFeatureRequests: number
  staleIssues: number
  oldBugs: number
  totalOpenIssues: number
  totalClosedIssues: number
  openPRs: number
  mergedPRs: number
  closedPRs: number
  draftPRs: number
  stalePRs: number
  recentCommits7d: number
  recentCommits30d: number
  daysSinceCommit: number | null
  lastCommitDate: string | null
  recentAuthors: string[]
  hasLicense: boolean
  licenseName: string | null
  hasDescription: boolean
  hasWiki: boolean
  hasTopics: boolean
  topicsCount: number
  isArchived: boolean
  isForked: boolean
  repoSize: number
  defaultBranch: string
  openIssuesCount: number
  watchersCount: number
  latestRelease: { tagName: string; name: string; publishedAt: string; htmlUrl: string; prerelease: boolean } | null
  daysSinceRelease: number | null
  totalReleases: number
  preReleases: number
  topContributor: { login: string; avatar: string; contributions: number; pct: number } | null
  contributorsCount: number
  busFactor: string
  bussFactorPct: number
  primaryLang: string
  langBreakdown: Array<{ lang: string; bytes: number; pct: number }>
  branchCount: number
  bugs: Array<{ number: number; title: string; htmlUrl: string; labels: Array<{ name: string; color: string }>; body: string; createdAt: string; user: string; avatar: string; daysOld: number; isOld: boolean; comments: number }>
  securityIssuesList: Array<{ number: number; title: string; htmlUrl: string; labels: string[]; createdAt: string; user: string; daysOld: number }>
  perfIssuesList: Array<{ number: number; title: string; htmlUrl: string; labels: string[]; createdAt: string; user: string }>
  stalePRsList: Array<{ number: number; title: string; htmlUrl: string; user: string; createdAt: string; updatedAt: string; draft: boolean; daysOld: number }>
  featureRequests: Array<{ number: number; title: string; htmlUrl: string; createdAt: string; user: string; comments: number }>
  recentCommits: Array<{ sha: string; message: string; author: string; avatar: string; date: string; htmlUrl: string }>
  staleIssuesList: Array<{ number: number; title: string; htmlUrl: string; createdAt: string; updatedAt: string; user: string; daysIdle: number }>
  findings: Finding[]
  recommendations: Array<{ priority: string; text: string }>
  insights: string[]
  summary: { criticalFindings: number; highFindings: number; mediumFindings: number; lowFindings: number }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(d: string | null) {
  if (!d) return 'N/A'
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

const langColors: Record<string, string> = {
  JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3572A5', Java: '#B07219',
  Go: '#00ADD8', Rust: '#DEA584', 'C++': '#F34B7D', C: '#555555', Ruby: '#CC342D',
  HTML: '#E34C26', CSS: '#563D7C', Shell: '#89E051', Swift: '#FA7343', Kotlin: '#A97BFF',
  PHP: '#4F5D95', Dart: '#00B4AB', Scala: '#DC322F', Makefile: '#427819'
}

const severityConfig = {
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'CRITICAL' },
  high:     { color: '#F97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', label: 'HIGH' },
  medium:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', label: 'MEDIUM' },
  low:      { color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', label: 'LOW' }
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 1200
    const step = 16
    const increment = value / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [value])
  return <>{display.toLocaleString()}{suffix}</>
}

// ─── Circular Health Gauge ────────────────────────────────────────────────────
function HealthGauge({ score }: { score: number }) {
  const radius = 56
  const circ = 2 * Math.PI * radius
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setProgress(score), 300)
    return () => clearTimeout(t)
  }, [score])

  const color = score >= 80 ? '#10B981' : score >= 65 ? '#F59E0B' : score >= 45 ? '#F97316' : '#EF4444'
  const offset = circ - (progress / 100) * circ

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 140, height: 140 }}>
      <svg width={140} height={140} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={70} cy={70} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
        <circle
          cx={70} cy={70} r={radius} fill="none"
          stroke={color} strokeWidth={12}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)', filter: `drop-shadow(0 0 8px ${color}66)` }}
        />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 300, color, lineHeight: 1 }}>
          {score}
        </div>
        <div style={{ fontFamily: 'var(--font-tech)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '.15em', marginTop: 2 }}>HEALTH</div>
      </div>
    </div>
  )
}

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: React.ReactNode; sub?: string; color?: string; icon?: any
}) {
  return (
    <div className="s-spotlight" style={{
      backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, textAlign: 'center'
    }}>
      {Icon && <Icon size={16} style={{ color: color || 'var(--text-muted)', margin: '0 auto 8px' }} />}
      <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, letterSpacing: '.15em', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 300, color: color || 'var(--text)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: 'var(--font-tech)', fontSize: 9, color: 'var(--text-dim)', marginTop: 4, letterSpacing: '.1em' }}>{sub}</div>}
    </div>
  )
}

// ─── Bug Row ─────────────────────────────────────────────────────────────────
function BugRow({ bug }: { bug: AnalysisData['bugs'][0] }) {
  return (
    <a
      href={bug.htmlUrl} target="_blank" rel="noopener noreferrer"
      style={{
        display: 'block', padding: '14px 0', borderBottom: '1px solid var(--border)',
        textDecoration: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          {bug.isOld
            ? <AlertTriangle size={14} style={{ color: '#EF4444' }} />
            : <Bug size={14} style={{ color: '#F97316' }} />
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#EF4444' }}>#{bug.number}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)' }}>{bug.title}</span>
            {bug.isOld && (
              <span style={{ fontSize: 8, fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: 4, backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>6MO+ OLD</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {(bug.labels || []).slice(0, 4).map((l: any) => (
              <span key={l.name} style={{ fontSize: 9, fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: 8, backgroundColor: `#${l.color}22`, color: `#${l.color}`, border: `1px solid #${l.color}44` }}>{l.name}</span>
            ))}
            <span style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-dim)' }}>@{bug.user} · {bug.daysOld}d old · {bug.comments} comments</span>
          </div>
        </div>
        <ExternalLink size={12} style={{ color: 'var(--text-dim)', flexShrink: 0, marginTop: 2 }} />
      </div>
    </a>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
// ─── Download Report Generator ───────────────────────────────────────────────
function generateReportHTML(repo: any, a: AnalysisData): string {
  const now = new Date().toLocaleString()
  const healthColor = a.healthScore >= 80 ? '#10B981' : a.healthScore >= 65 ? '#F59E0B' : a.healthScore >= 45 ? '#F97316' : '#EF4444'

  const severityBadge = (s: string) => {
    const colors: Record<string, string> = { critical: '#EF4444', high: '#F97316', medium: '#F59E0B', low: '#10B981' }
    return `<span style="background:${colors[s] || '#999'}22;color:${colors[s] || '#999'};border:1px solid ${colors[s] || '#999'}44;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;letter-spacing:.08em">${s.toUpperCase()}</span>`
  }

  const section = (title: string, content: string) =>
    `<div class="section"><h2>${title}</h2>${content}</div>`

  const row = (label: string, value: string) =>
    `<div class="row"><span class="label">${label}</span><span class="value">${value}</span></div>`

  const bugRows = (a.bugs || []).slice(0, 30).map(b =>
    `<tr><td>#${b.number}</td><td><a href="${b.htmlUrl}" target="_blank">${b.title}</a></td><td>@${b.user}</td><td>${b.daysOld}d</td><td>${b.comments}</td></tr>`
  ).join('')

  const secRows = (a.securityIssuesList || []).map(s =>
    `<tr><td>#${s.number}</td><td><a href="${s.htmlUrl}" target="_blank">${s.title}</a></td><td>@${s.user}</td><td>${s.daysOld}d</td></tr>`
  ).join('')

  const prRows = (a.stalePRsList || []).map(p =>
    `<tr><td>#${p.number}</td><td><a href="${p.htmlUrl}" target="_blank">${p.title}</a></td><td>@${p.user}</td><td>${p.daysOld}d</td><td>${p.draft ? 'Draft' : 'Open'}</td></tr>`
  ).join('')

  const commitRows = (a.recentCommits || []).slice(0, 20).map(c =>
    `<tr><td><a href="${c.htmlUrl}" target="_blank">${c.sha}</a></td><td>${c.message.slice(0, 80)}${c.message.length > 80 ? '…' : ''}</td><td>@${c.author}</td><td>${c.date ? new Date(c.date).toLocaleDateString() : 'N/A'}</td></tr>`
  ).join('')

  const langBar = (a.langBreakdown || []).map(l => {
    const colors: Record<string, string> = { JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3572A5', Go: '#00ADD8', Rust: '#DEA584', 'C++': '#F34B7D', Java: '#B07219', CSS: '#563D7C', HTML: '#E34C26', Ruby: '#CC342D' }
    return `<div style="display:inline-block;padding:4px 10px;border-radius:12px;margin:3px;background:${colors[l.lang] || '#555'}22;color:${colors[l.lang] || '#aaa'};border:1px solid ${colors[l.lang] || '#555'}44;font-size:12px">${l.lang} ${l.pct}%</div>`
  }).join('')

  const findingRows = (a.findings || []).map(f =>
    `<tr><td>${f.icon}</td><td>${severityBadge(f.severity)}</td><td><strong>${f.title}</strong><br><small style="color:#aaa">${f.detail}</small></td><td>${f.category}</td></tr>`
  ).join('')

  const checklistItems = [
    { label: 'License', ok: a.hasLicense, detail: (a as any).licenseName || (a.hasLicense ? 'Present' : 'Missing') },
    { label: 'Description', ok: (a as any).hasDescription, detail: (a as any).hasDescription ? 'Present' : 'Missing' },
    { label: 'Topics/Tags', ok: (a as any).hasTopics, detail: (a as any).hasTopics ? `${(a as any).topicsCount} tags` : 'None set' },
    { label: 'Releases', ok: a.totalReleases > 0, detail: a.latestRelease ? a.latestRelease.tagName : 'No releases' },
    { label: 'Active (90d)', ok: a.daysSinceCommit !== null && (a.daysSinceCommit ?? 999) < 90, detail: a.daysSinceCommit !== null ? `${a.daysSinceCommit}d since last commit` : 'No commits' },
  ].map(c => `<div style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;margin:3px;background:${c.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'};border:1px solid ${c.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};font-size:12px"><span>${c.ok ? '✅' : '❌'}</span><span style="color:${c.ok ? '#10B981' : '#EF4444'}">${c.label}</span><span style="color:#aaa">${c.detail}</span></div>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>SycnOps Report — ${repo.fullName || repo.name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #e5e7eb; line-height: 1.6; }
  a { color: #10B981; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .container { max-width: 960px; margin: 0 auto; padding: 40px 24px; }
  .header { border-bottom: 1px solid #1f2937; padding-bottom: 32px; margin-bottom: 32px; }
  .header h1 { font-size: 32px; font-weight: 300; color: #fff; letter-spacing: -.02em; margin-bottom: 8px; }
  .meta { display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px; color: #9ca3af; margin-top: 8px; }
  .meta span { display: flex; align-items: center; gap: 4px; }
  .health-badge { display: inline-flex; align-items: center; gap: 10px; background: ${healthColor}18; border: 1px solid ${healthColor}44; border-radius: 12px; padding: 12px 20px; margin: 20px 0; }
  .health-score { font-size: 48px; font-weight: 300; color: ${healthColor}; line-height: 1; }
  .health-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: .12em; }
  .section { background: #111; border: 1px solid #1f2937; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
  .section h2 { font-size: 18px; font-weight: 400; color: #fff; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #1f2937; }
  .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px; }
  .row:last-child { border-bottom: none; }
  .label { color: #9ca3af; }
  .value { color: #e5e7eb; font-weight: 500; text-align: right; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { text-align: left; color: #6b7280; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; padding: 8px 12px; border-bottom: 1px solid #1f2937; }
  td { padding: 10px 12px; border-bottom: 1px solid #111; vertical-align: top; color: #e5e7eb; }
  tr:hover td { background: rgba(255,255,255,0.02); }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .metric-box { background: #0d0d0d; border: 1px solid #1f2937; border-radius: 10px; padding: 16px; text-align: center; }
  .metric-val { font-size: 28px; font-weight: 300; color: #fff; }
  .metric-lbl { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: .1em; margin-top: 4px; }
  .footer { text-align: center; padding: 32px 0; color: #4b5563; font-size: 12px; border-top: 1px solid #1f2937; margin-top: 40px; }
  .insights li { margin-bottom: 8px; color: #d1d5db; font-size: 13px; line-height: 1.7; }
  @media print { body { background: #fff; color: #111; } .section { border-color: #e5e7eb; background: #f9f9f9; } }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      ${repo.avatarUrl ? `<img src="${repo.avatarUrl}" style="width:56px;height:56px;border-radius:12px;border:1px solid #1f2937" />` : ''}
      <div>
        <h1>${repo.fullName || repo.name || 'Repository'}</h1>
        ${repo.description ? `<p style="color:#9ca3af;font-size:14px;margin-top:4px">${repo.description}</p>` : ''}
      </div>
    </div>
    <div class="meta">
      <span>⭐ ${(repo.stars || 0).toLocaleString()} stars</span>
      <span>⑂ ${(repo.forks || 0).toLocaleString()} forks</span>
      <span>👁 ${(a.watchersCount || 0).toLocaleString()} watchers</span>
      <span>🌿 ${a.branchCount || 0} branches</span>
      ${repo.htmlUrl ? `<span><a href="${repo.htmlUrl}" target="_blank">View on GitHub →</a></span>` : ''}
    </div>
    <div class="health-badge">
      <div><div class="health-score">${a.healthScore}</div><div class="health-label">/ 100 Health Score</div></div>
      <div style="margin-left:12px">
        <div style="font-size:16px;font-weight:500;color:${healthColor}">${(a.healthTier || 'Unknown').toUpperCase()}</div>
        <div style="font-size:11px;color:#9ca3af">Overall Repository Health</div>
        <div style="font-size:11px;color:#6b7280;margin-top:4px">Generated: ${now}</div>
      </div>
    </div>
  </div>

  ${section('Key Metrics', `
    <div class="grid2">
      <div class="metric-box"><div class="metric-val" style="color:${a.openBugs > 0 ? '#F97316' : '#10B981'}">${a.openBugs}</div><div class="metric-lbl">Open Bugs</div></div>
      <div class="metric-box"><div class="metric-val" style="color:${a.securityIssues > 0 ? '#EF4444' : '#10B981'}">${a.securityIssues}</div><div class="metric-lbl">Security Issues</div></div>
      <div class="metric-box"><div class="metric-val" style="color:${a.issueCloseRate > 70 ? '#10B981' : '#F59E0B'}">${a.issueCloseRate}%</div><div class="metric-lbl">Issue Close Rate</div></div>
      <div class="metric-box"><div class="metric-val" style="color:${a.prMergeRate > 70 ? '#10B981' : '#F59E0B'}">${a.prMergeRate}%</div><div class="metric-lbl">PR Merge Rate</div></div>
      <div class="metric-box"><div class="metric-val">${a.totalOpenIssues}</div><div class="metric-lbl">Open Issues</div></div>
      <div class="metric-box"><div class="metric-val">${a.totalClosedIssues}</div><div class="metric-lbl">Closed Issues</div></div>
      <div class="metric-box"><div class="metric-val">${a.openPRs}</div><div class="metric-lbl">Open PRs</div></div>
      <div class="metric-box"><div class="metric-val">${a.mergedPRs}</div><div class="metric-lbl">Merged PRs</div></div>
      <div class="metric-box"><div class="metric-val">${a.recentCommits30d}</div><div class="metric-lbl">Commits / 30d</div></div>
      <div class="metric-box"><div class="metric-val">${a.totalReleases}</div><div class="metric-lbl">Total Releases</div></div>
      <div class="metric-box"><div class="metric-val">${a.contributorsCount}</div><div class="metric-lbl">Contributors</div></div>
      <div class="metric-box"><div class="metric-val">${a.staleIssues}</div><div class="metric-lbl">Stale Issues</div></div>
    </div>
  `)}

  ${section('Severity Summary', `
    ${row('Critical Findings', String(a.summary.criticalFindings))}
    ${row('High Findings', String(a.summary.highFindings))}
    ${row('Medium Findings', String(a.summary.mediumFindings))}
    ${row('Low Findings', String(a.summary.lowFindings))}
  `)}

  ${section('Repository Checklist', `<div style="line-height:2">${checklistItems}</div>`)}

  ${a.langBreakdown.length > 0 ? section('Language Breakdown', `<div>${langBar}</div>`) : ''}

  ${a.findings.length > 0 ? section('All Findings', `
    <table>
      <thead><tr><th></th><th>Severity</th><th>Finding</th><th>Category</th></tr></thead>
      <tbody>${findingRows}</tbody>
    </table>
  `) : section('Findings', '<p style="color:#10B981">✅ No major issues found — repository looks healthy!</p>')}

  ${a.bugs.length > 0 ? section(`Open Bugs (${a.openBugs})`, `
    <table>
      <thead><tr><th>#</th><th>Title</th><th>Author</th><th>Age</th><th>Comments</th></tr></thead>
      <tbody>${bugRows}</tbody>
    </table>
    ${a.bugs.length > 30 ? `<p style="color:#6b7280;font-size:12px;margin-top:8px">Showing 30 of ${a.openBugs} bugs</p>` : ''}
  `) : ''}

  ${a.securityIssuesList.length > 0 ? section(`Security Issues (${a.securityIssues})`, `
    <table>
      <thead><tr><th>#</th><th>Title</th><th>Author</th><th>Age</th></tr></thead>
      <tbody>${secRows}</tbody>
    </table>
  `) : section('Security', '<p style="color:#10B981">✅ No open security issues — great!</p>')}

  ${a.stalePRsList.length > 0 ? section(`Stale Pull Requests (${a.stalePRs})`, `
    <table>
      <thead><tr><th>#</th><th>Title</th><th>Author</th><th>Idle</th><th>Status</th></tr></thead>
      <tbody>${prRows}</tbody>
    </table>
  `) : ''}

  ${a.recentCommits.length > 0 ? section('Recent Commits', `
    <table>
      <thead><tr><th>SHA</th><th>Message</th><th>Author</th><th>Date</th></tr></thead>
      <tbody>${commitRows}</tbody>
    </table>
  `) : ''}

  ${a.topContributor ? section('Contributor Health', `
    ${row('Top Contributor', `@${a.topContributor.login} (${a.topContributor.contributions} commits)`)}
    ${row('Total Contributors', String(a.contributorsCount))}
    ${row('Bus Factor Risk', a.busFactor)}
    ${row('Top Contributor %', `${a.bussFactorPct}%`)}
    ${row('Commits Last 7d', String(a.recentCommits7d))}
    ${row('Commits Last 30d', String(a.recentCommits30d))}
  `) : ''}

  ${a.latestRelease ? section('Latest Release', `
    ${row('Tag', `<a href="${a.latestRelease.htmlUrl}" target="_blank">${a.latestRelease.tagName}</a>`)}
    ${row('Name', a.latestRelease.name || a.latestRelease.tagName)}
    ${row('Published', new Date(a.latestRelease.publishedAt).toLocaleDateString())}
    ${row('Pre-release', a.latestRelease.prerelease ? 'Yes' : 'No')}
    ${row('Total Releases', String(a.totalReleases))}
  `) : ''}

  ${a.recommendations.length > 0 ? section('Action Plan & Recommendations', `
    <ul class="insights">
      ${a.recommendations.map(r => `<li>${severityBadge(r.priority)} ${r.text}</li>`).join('')}
    </ul>
  `) : ''}

  ${a.insights.length > 0 ? section('AI Insights', `
    <ul class="insights">${a.insights.map(i => `<li>${i}</li>`).join('')}</ul>
  `) : ''}

  <div class="footer">
    <p>Generated by <strong style="color:#10B981">SycnOps</strong> · ${now}</p>
    <p style="margin-top:4px">Repository: <a href="${repo.htmlUrl || '#'}">${repo.fullName || repo.name}</a></p>
  </div>
</div>
</body>
</html>`
}

function downloadReport(repo: any, a: AnalysisData) {
  const html = generateReportHTML(repo, a)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const repoName = (repo.fullName || repo.name || 'repo').replace(/\//g, '_')
  link.href = url
  link.download = `sycnops_report_${repoName}_${new Date().toISOString().slice(0, 10)}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function RepoAnalysis() {
  const { repoId } = useParams()

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [repoMeta, setRepoMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'findings' | 'bugs' | 'security' | 'prs' | 'commits' | 'insights'>('findings')
  const [progressVisible, setProgressVisible] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [detail, anal] = await Promise.all([
          apiGet(`/repositories/${repoId}/details`),
          apiGet(`/repositories/${repoId}/analysis`)
        ])

        if (!anal.success) { setError(anal.message || 'Analysis failed.'); return }
        if (detail.success) setRepoMeta(detail.data?.repo || {})
        setAnalysis(anal.data)
        setTimeout(() => setProgressVisible(true), 500)
      } catch {
        setError('Could not reach backend. Make sure the server is running.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [repoId])

  if (loading) return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 0', textAlign: 'center' }}>
      <Loader2 size={48} style={{ color: '#10B981', animation: 'spin 1s linear infinite', margin: '0 auto 20px', display: 'block' }} />
      <div style={{ fontFamily: 'var(--font-tech)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.2em' }}>RUNNING DEEP ANALYSIS...</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-dim)', marginTop: 8 }}>Scanning issues, PRs, commits, contributors, releases...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (error) return (
    <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center' }}>
      <AlertTriangle size={40} style={{ color: '#EF4444', margin: '0 auto 16px', display: 'block' }} />
      <p style={{ color: '#EF4444', fontFamily: 'var(--font-mono)', fontSize: 14, marginBottom: 20 }}>{error}</p>
      <Link to={`/repositories/${repoId}`} className="s-btn">Back to Repository</Link>
    </div>
  )

  if (!analysis) return null

  const a = analysis
  const repo = repoMeta || {}

  const tabs = [
    { id: 'findings' as const, label: 'Findings', count: a.findings?.length || 0 },
    { id: 'bugs' as const, label: 'Bugs', count: a.openBugs },
    { id: 'security' as const, label: 'Security', count: a.securityIssues },
    { id: 'prs' as const, label: 'Stale PRs', count: a.stalePRs },
    { id: 'commits' as const, label: 'Commits', count: a.recentCommits?.length || 0 },
    { id: 'insights' as const, label: 'AI Insights', count: a.insights?.length || 0 },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
        <Link to="/repositories" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-tech)', fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '.1em' }}>
          <ArrowLeft size={14} /> REPOSITORIES
        </Link>
        <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>/</span>
        <Link to={`/repositories/${repoId}`} style={{ fontFamily: 'var(--font-tech)', fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '.1em' }}>
          {repo.fullName || repo.name || 'REPOSITORY'}
        </Link>
        <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>/</span>
        <span style={{ fontFamily: 'var(--font-tech)', fontSize: 11, color: '#10B981', letterSpacing: '.1em' }}>ANALYSIS</span>
      </div>

      {/* Hero Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          {repo.avatarUrl && <img src={repo.avatarUrl} alt="" style={{ width: 64, height: 64, borderRadius: 16, border: '1px solid var(--border)', flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 300, color: 'var(--text)', letterSpacing: '-.02em' }}>
                {repo.fullName || repo.name || 'Repository Analysis'}
              </h1>
              {a.isArchived && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: 6, backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>ARCHIVED</span>}
              {a.isForked && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: 6, backgroundColor: 'rgba(56,189,248,0.1)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.25)' }}>FORK</span>}
            </div>
            {repo.description && <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', marginBottom: 12, maxWidth: 600 }}>{repo.description}</p>}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontFamily: 'var(--font-tech)', fontSize: 12, color: 'var(--text-muted)', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} style={{ color: '#F59E0B' }} /> {(repo.stars || 0).toLocaleString()}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GitFork size={12} style={{ color: '#38BDF8' }} /> {(repo.forks || 0).toLocaleString()}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} style={{ color: '#10B981' }} /> {a.watchersCount.toLocaleString()} watching</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GitBranch size={12} /> {a.branchCount} branches</span>
              {repo.htmlUrl && <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10B981', textDecoration: 'none' }}><ExternalLink size={12} /> View on GitHub</a>}
            </div>
          </div>
          {/* Download Report Button */}
          <button
            id="download-report-btn"
            onClick={() => {
              setDownloading(true)
              setTimeout(() => {
                downloadReport(repo, a)
                setDownloading(false)
              }, 100)
            }}
            disabled={downloading}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px',
              background: downloading ? 'rgba(16,185,129,0.06)' : 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(56,189,248,0.08) 100%)',
              border: '1px solid rgba(16,185,129,0.4)',
              borderRadius: 10,
              color: downloading ? 'rgba(16,185,129,0.5)' : '#10B981',
              fontFamily: 'var(--font-tech)',
              fontSize: 11,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              cursor: downloading ? 'wait' : 'pointer',
              transition: 'all .2s',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!downloading) e.currentTarget.style.background = 'rgba(16,185,129,0.2)' }}
            onMouseLeave={e => { if (!downloading) e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(56,189,248,0.08) 100%)' }}
          >
            <Download size={14} style={{ animation: downloading ? 'bounce 0.6s infinite' : 'none' }} />
            {downloading ? 'Generating...' : 'Download Report'}
          </button>
        </div>
      </div>

      {/* Health Score + Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, marginBottom: 32, alignItems: 'start' }}>
        {/* Health Gauge */}
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, minWidth: 200 }}>
          <HealthGauge score={a.healthScore} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', color: a.healthScore >= 80 ? '#10B981' : a.healthScore >= 65 ? '#F59E0B' : a.healthScore >= 45 ? '#F97316' : '#EF4444' }}>
              {(a.healthTier || 'Unknown').toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-dim)', marginTop: 4, letterSpacing: '.1em' }}>OVERALL HEALTH</div>
          </div>
          {/* Severity summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            {[
              { label: 'Critical', count: a.summary.criticalFindings, ...severityConfig.critical },
              { label: 'High',     count: a.summary.highFindings,     ...severityConfig.high },
              { label: 'Medium',   count: a.summary.mediumFindings,   ...severityConfig.medium },
              { label: 'Low',      count: a.summary.lowFindings,      ...severityConfig.low }
            ].map(({ label, count, color, bg }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 10px', borderRadius: 8, backgroundColor: bg }}>
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color, letterSpacing: '.1em' }}>{label.toUpperCase()}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color, fontWeight: 600 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 14 }}>
          <MetricCard label="Open Bugs" value={<AnimatedNumber value={a.openBugs} />} color={a.openBugs > 10 ? '#EF4444' : a.openBugs > 0 ? '#F97316' : '#10B981'} icon={Bug} />
          <MetricCard label="Security" value={<AnimatedNumber value={a.securityIssues} />} color={a.securityIssues > 0 ? '#EF4444' : '#10B981'} icon={Shield} sub={a.securityIssues > 0 ? 'NEEDS ATTENTION' : 'ALL CLEAR'} />
          <MetricCard label="Issue Close %" value={<AnimatedNumber value={a.issueCloseRate} suffix="%" />} color={a.issueCloseRate > 70 ? '#10B981' : a.issueCloseRate > 40 ? '#F59E0B' : '#EF4444'} icon={CheckCircle} />
          <MetricCard label="PR Merge %" value={<AnimatedNumber value={a.prMergeRate} suffix="%" />} color={a.prMergeRate > 70 ? '#10B981' : '#F59E0B'} icon={GitPullRequest} />
          <MetricCard label="Commits/30d" value={<AnimatedNumber value={a.recentCommits30d} />} color={a.recentCommits30d > 10 ? '#10B981' : '#F59E0B'} icon={Activity} />
          <MetricCard label="Stale Issues" value={<AnimatedNumber value={a.staleIssues} />} color={a.staleIssues > 10 ? '#EF4444' : a.staleIssues > 0 ? '#F59E0B' : '#10B981'} icon={Clock} />
          <MetricCard label="Stale PRs" value={<AnimatedNumber value={a.stalePRs} />} color={a.stalePRs > 0 ? '#F59E0B' : '#10B981'} icon={GitPullRequest} />
          <MetricCard label="Releases" value={<AnimatedNumber value={a.totalReleases} />} color="#38BDF8" icon={Package} sub={a.latestRelease ? `LATEST: ${a.latestRelease.tagName}` : 'NO RELEASES YET'} />
        </div>
      </div>

      {/* Language Breakdown */}
      {a.langBreakdown.length > 0 && (
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, color: 'var(--text)', marginBottom: 14 }}>Language Breakdown</h2>
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 8, marginBottom: 14 }}>
            {a.langBreakdown.map(({ lang, pct }) => (
              <div key={lang} style={{ width: `${pct}%`, backgroundColor: langColors[lang] || '#666', minWidth: pct > 1 ? 4 : 0 }} title={`${lang}: ${pct}%`} />
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {a.langBreakdown.map(({ lang, pct }) => (
              <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-tech)', fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: langColors[lang] || '#666' }} />
                {lang} <span style={{ color: 'var(--text-dim)' }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Repository Checklist */}
      <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, color: 'var(--text)', marginBottom: 16 }}>Repository Checklist</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
          {[
            { label: 'License', ok: a.hasLicense, detail: a.licenseName || 'Missing', icon: Lock },
            { label: 'Description', ok: a.hasDescription, detail: a.hasDescription ? 'Present' : 'Missing', icon: BookOpen },
            { label: 'Topics/Tags', ok: a.hasTopics, detail: a.hasTopics ? `${a.topicsCount} tags` : 'None set', icon: Tag },
            { label: 'Releases', ok: a.totalReleases > 0, detail: a.latestRelease ? a.latestRelease.tagName : 'No releases', icon: Package },
            { label: 'Wiki', ok: a.hasWiki, detail: a.hasWiki ? 'Enabled' : 'Disabled', icon: BookOpen },
            { label: 'Active (90d)', ok: a.daysSinceCommit !== null && a.daysSinceCommit < 90, detail: a.daysSinceCommit !== null ? `${a.daysSinceCommit}d since last commit` : 'No commits', icon: Activity },
            { label: 'Visibility', ok: true, detail: repo.visibility || 'public', icon: Globe },
            { label: 'Not Forked', ok: !a.isForked, detail: a.isForked ? 'Yes (fork)' : 'Original', icon: GitFork },
          ].map(({ label, ok, detail, icon: Icon }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, backgroundColor: ok ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
              {ok ? <CheckCircle size={14} style={{ color: '#10B981', flexShrink: 0 }} /> : <XCircle size={14} style={{ color: '#EF4444', flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.08em' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: ok ? 'var(--text)' : '#EF4444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contributor Health */}
      {a.topContributor && (
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, color: 'var(--text)', marginBottom: 16 }}>Contributor Health</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.12em', marginBottom: 8 }}>TOP CONTRIBUTOR</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={a.topContributor.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)' }}>@{a.topContributor.login}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{a.topContributor.contributions} commits</div>
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.12em', marginBottom: 8 }}>BUS FACTOR RISK</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 300, color: a.busFactor === 'HIGH RISK' ? '#EF4444' : a.busFactor === 'MEDIUM RISK' ? '#F59E0B' : '#10B981' }}>{a.bussFactorPct}%</div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, letterSpacing: '.1em', color: a.busFactor === 'HIGH RISK' ? '#EF4444' : a.busFactor === 'MEDIUM RISK' ? '#F59E0B' : '#10B981' }}>{a.busFactor}</div>
              </div>
              <div style={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, width: progressVisible ? `${a.bussFactorPct}%` : '0%', backgroundColor: a.bussFactorPct > 60 ? '#EF4444' : a.bussFactorPct > 40 ? '#F59E0B' : '#10B981', transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)' }} />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.12em', marginBottom: 8 }}>COMMIT ACTIVITY</div>
              <div style={{ display: 'flex', gap: 20 }}>
                {[{ v: a.recentCommits7d, l: 'LAST 7D' }, { v: a.recentCommits30d, l: 'LAST 30D' }, { v: a.contributorsCount, l: 'CONTRIBUTORS' }].map(({ v, l }) => (
                  <div key={l}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 300, color: 'var(--text)' }}>{v}</div>
                    <div style={{ fontFamily: 'var(--font-tech)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: '.1em' }}>{l}</div>
                  </div>
                ))}
              </div>
              {a.lastCommitDate && <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-dim)', marginTop: 8 }}>Last commit: {timeAgo(a.lastCommitDate)}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Latest Release */}
      {a.latestRelease && (
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 18, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Package size={18} style={{ color: '#38BDF8' }} />
            <div>
              <span style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.12em' }}>LATEST RELEASE</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                <a href={a.latestRelease.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#38BDF8', textDecoration: 'none' }}>{a.latestRelease.tagName}</a>
                {a.latestRelease.prerelease && <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: 4, backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>PRE-RELEASE</span>}
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: 11, color: 'var(--text-dim)' }}>{timeAgo(a.latestRelease.publishedAt)}</span>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 300, color: 'var(--text)' }}>{a.totalReleases}</div>
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: '.1em' }}>TOTAL RELEASES</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Plan */}
      {a.recommendations.length > 0 && (
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 18, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 20, borderRadius: 2, backgroundColor: '#10B981' }} />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, color: 'var(--text)' }}>Action Plan</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, padding: '2px 8px', borderRadius: 6, backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>{a.recommendations.length}</span>
          </div>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {a.recommendations.map((rec, i) => {
              const cfg = severityConfig[rec.priority as keyof typeof severityConfig] || severityConfig.low
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 10, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <TrendingUp size={14} style={{ color: cfg.color, marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: cfg.color, marginRight: 8, letterSpacing: '.08em' }}>{cfg.label}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)' }}>{rec.text}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tabbed Sections */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', overflowX: 'auto', marginBottom: 24 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '12px 18px', background: 'none', border: 'none',
            borderBottom: activeTab === tab.id ? '2px solid #10B981' : '2px solid transparent',
            fontFamily: 'var(--font-tech)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase',
            color: activeTab === tab.id ? '#10B981' : 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap', flexShrink: 0
          }}>
            {tab.label}
            {tab.count > 0 && (
              <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', padding: '1px 5px', borderRadius: 4, backgroundColor: activeTab === tab.id ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', color: activeTab === tab.id ? '#10B981' : 'var(--text-dim)' }}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* FINDINGS TAB */}
      {activeTab === 'findings' && (
        <div>
          {a.findings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <CheckCircle size={40} style={{ color: '#10B981', margin: '0 auto 12px', display: 'block' }} />
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: 12, color: '#10B981', letterSpacing: '.1em' }}>NO ISSUES FOUND — REPOSITORY LOOKS HEALTHY!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {a.findings.map((f, i) => {
                const cfg = severityConfig[f.severity]
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'start', padding: '16px 20px', borderRadius: 14, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                    <div style={{ fontSize: 20 }}>{f.icon}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{f.title}</span>
                        <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: 4, backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{f.category}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.detail}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '3px 8px', borderRadius: 6, backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, letterSpacing: '.08em', whiteSpace: 'nowrap' }}>{cfg.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* BUGS TAB */}
      {activeTab === 'bugs' && (
        <div>
          {a.bugs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <CheckCircle size={40} style={{ color: '#10B981', margin: '0 auto 12px', display: 'block' }} />
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: 12, color: '#10B981', letterSpacing: '.1em' }}>NO OPEN BUGS FOUND!</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                {a.oldBugs > 0 && <div style={{ padding: '8px 14px', borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#EF4444' }}>⚠ {a.oldBugs} bug{a.oldBugs > 1 ? 's' : ''} older than 6 months</span></div>}
                <div style={{ padding: '8px 14px', borderRadius: 10, backgroundColor: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#F97316' }}>{a.openBugs} total open bugs</span></div>
              </div>
              {a.bugs.map(bug => <BugRow key={bug.number} bug={bug} />)}
            </>
          )}
        </div>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <div>
          {a.securityIssuesList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Shield size={40} style={{ color: '#10B981', margin: '0 auto 12px', display: 'block' }} />
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: 12, color: '#10B981', letterSpacing: '.1em' }}>NO OPEN SECURITY ISSUES — GREAT!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '10px 16px', borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#EF4444' }}>🚨 {a.securityIssues} open security issue{a.securityIssues > 1 ? 's' : ''} require immediate attention</span>
              </div>
              {a.securityIssuesList.map(issue => (
                <a key={issue.number} href={issue.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderRadius: 12, backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', textDecoration: 'none' }}>
                  <Shield size={14} style={{ color: '#EF4444', flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#EF4444' }}>#{issue.number}</span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)' }}>{issue.title}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-dim)' }}>@{issue.user} · {issue.daysOld} days old</div>
                  </div>
                  <ExternalLink size={12} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                </a>
              ))}
            </div>
          )}
          {a.perfIssuesList.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: 11, color: '#F59E0B', letterSpacing: '.12em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={14} /> PERFORMANCE ISSUES ({a.perfIssuesList.length})
              </div>
              {a.perfIssuesList.map(issue => (
                <a key={issue.number} href={issue.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, backgroundColor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', textDecoration: 'none', marginBottom: 8 }}>
                  <Zap size={13} style={{ color: '#F59E0B', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F59E0B' }}>#{issue.number}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)', flex: 1 }}>{issue.title}</span>
                  <ExternalLink size={12} style={{ color: 'var(--text-dim)' }} />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STALE PRs TAB */}
      {activeTab === 'prs' && (
        <div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            {[{ label: 'Open', value: a.openPRs, color: '#10B981' }, { label: 'Merged', value: a.mergedPRs, color: '#8B5CF6' }, { label: 'Closed', value: a.closedPRs, color: '#6B7280' }, { label: 'Draft', value: a.draftPRs, color: '#F59E0B' }, { label: 'Stale', value: a.stalePRs, color: '#EF4444' }].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', padding: '12px 16px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 300, color }}>{value}</div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: '.1em', marginTop: 2 }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>
          {a.stalePRsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle size={36} style={{ color: '#10B981', margin: '0 auto 12px', display: 'block' }} />
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: 12, color: '#10B981', letterSpacing: '.1em' }}>NO STALE PULL REQUESTS!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {a.stalePRsList.map(pr => (
                <a key={pr.number} href={pr.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px', borderRadius: 12, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', textDecoration: 'none' }}>
                  <GitPullRequest size={14} style={{ color: '#F59E0B', marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F59E0B' }}>#{pr.number}</span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)' }}>{pr.title}</span>
                      {pr.draft && <span style={{ fontSize: 8, fontFamily: 'var(--font-mono)', padding: '1px 5px', borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--text-dim)' }}>DRAFT</span>}
                    </div>
                    <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-dim)' }}>@{pr.user} · idle {pr.daysOld} days</div>
                  </div>
                  <ExternalLink size={12} style={{ color: 'var(--text-dim)' }} />
                </a>
              ))}
            </div>
          )}
          {a.staleIssuesList.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.12em', marginBottom: 12 }}>STALE ISSUES (90+ DAYS IDLE)</div>
              {a.staleIssuesList.map(issue => (
                <a key={issue.number} href={issue.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}>
                  <AlertCircle size={13} style={{ color: '#F59E0B', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>#{issue.number}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.title}</span>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-dim)', flexShrink: 0 }}>{issue.daysIdle}d idle</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COMMITS TAB */}
      {activeTab === 'commits' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {a.recentCommits.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', fontFamily: 'var(--font-tech)', fontSize: 12, color: 'var(--text-muted)' }}>No commits found.</div>
          ) : a.recentCommits.map(c => (
            <a key={c.sha} href={c.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, textDecoration: 'none' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#10B981', flexShrink: 0, width: 54 }}>{c.sha}</span>
              {c.avatar && <img src={c.avatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{c.author} · {timeAgo(c.date)}</div>
              </div>
              <ExternalLink size={12} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
            </a>
          ))}
        </div>
      )}

      {/* AI INSIGHTS TAB */}
      {activeTab === 'insights' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {a.insights.map((line, i) => {
            const isCritical = line.includes('🚨') || line.includes('CRITICAL')
            const isWarning = line.includes('⚠')
            const color = isCritical ? '#EF4444' : isWarning ? '#F59E0B' : 'var(--text-muted)'
            return (
              <div key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color, lineHeight: 1.7, padding: '10px 16px', borderRadius: 10, backgroundColor: isCritical ? 'rgba(239,68,68,0.06)' : isWarning ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isCritical ? 'rgba(239,68,68,0.2)' : isWarning ? 'rgba(245,158,11,0.2)' : 'var(--border)'}` }}>{line}</div>
            )
          })}
          {a.featureRequests.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: 'var(--font-tech)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.12em', marginBottom: 12 }}>FEATURE REQUESTS ({a.openFeatureRequests})</div>
              {a.featureRequests.map(f => (
                <a key={f.number} href={f.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}>
                  <Star size={12} style={{ color: '#38BDF8', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>#{f.number}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)', flex: 1 }}>{f.title}</span>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: 10, color: 'var(--text-dim)' }}>{f.comments} comments</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA Footer */}
      <div style={{ marginTop: 40, padding: '24px', borderRadius: 18, background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(56,189,248,0.04) 100%)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--text)', marginBottom: 4 }}>View Full Repository Details</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)' }}>Browse issues, pull requests, commits, contributors and more.</div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => { setDownloading(true); setTimeout(() => { downloadReport(repo, a); setDownloading(false) }, 100) }}
            disabled={downloading}
            className="s-btn s-btn--outline"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={14} />
            {downloading ? 'Generating...' : 'Download Full Report'}
          </button>
          <Link to={`/repositories/${repoId}`} className="s-btn s-btn--outline">Repository Detail</Link>
          {repo.htmlUrl && <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="s-btn">Open on GitHub</a>}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
      `}</style>
    </div>
  )
}
