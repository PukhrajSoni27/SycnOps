import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, GitCommit, GitPullRequest, CheckCircle } from 'lucide-react'
import { useAnalyticsQuery } from '@/hooks/useApi'

export default function Analytics() {
  const { data: analytics, isLoading } = useAnalyticsQuery()
  const dailyActivity = analytics?.dailyActivity || []

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#050505',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '10px',
          padding: '10px 14px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
          fontFamily: 'var(--font-tech)',
          fontSize: '12px'
        }}>
          <p style={{ color: 'var(--emerald)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
          <p style={{ color: '#EBEBEB' }}>{payload[0].name}: <strong style={{ color: '#10B981' }}>{payload[0].value}</strong></p>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--emerald)' }}>
          PERFORMANCE METRICS
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text)', marginTop: '4px' }}>
          Analytics
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Real-time productivity telemetry, daily commit velocity, and PR merge trends.
        </p>
      </div>

      {/* Overview Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        {/* Total Commits */}
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: '18px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Total Commits
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 300, color: 'var(--text)', marginTop: '4px' }}>
              {isLoading ? '...' : analytics?.totalCommits}
            </h3>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
            <GitCommit className="w-6 h-6" />
          </div>
        </div>

        {/* Merged PRs */}
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: '18px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Merged PRs
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 300, color: 'var(--text)', marginTop: '4px' }}>
              {isLoading ? '...' : analytics?.mergedPRs}
            </h3>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
            <GitPullRequest className="w-6 h-6" />
          </div>
        </div>

        {/* Issues Closed */}
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: '18px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Issues Closed
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 300, color: 'var(--text)', marginTop: '4px' }}>
              {isLoading ? '...' : analytics?.issuesClosed}
            </h3>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A855F7' }}>
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Velocity Score */}
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: '18px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Velocity Score
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 300, color: '#10B981', marginTop: '4px' }}>
              {isLoading ? '...' : `${analytics?.velocityScore}%`}
            </h3>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '32px' }}>
        
        {/* Daily Commit Velocity Chart */}
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(16px)', border: '1px solid var(--border)', borderRadius: '24px', padding: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 400, color: 'var(--text)', marginBottom: '20px' }}>
            Daily Commit Velocity
          </h2>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(235,235,235,0.4)" tick={{ fontFamily: 'var(--font-tech)', fontSize: 11 }} />
                <YAxis stroke="rgba(235,235,235,0.4)" tick={{ fontFamily: 'var(--font-tech)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="commits" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PR Merge Trends Chart */}
        <div className="s-spotlight" style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(16px)', border: '1px solid var(--border)', borderRadius: '24px', padding: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 400, color: 'var(--text)', marginBottom: '20px' }}>
            Pull Request Merge Trends
          </h2>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(235,235,235,0.4)" tick={{ fontFamily: 'var(--font-tech)', fontSize: 11 }} />
                <YAxis stroke="rgba(235,235,235,0.4)" tick={{ fontFamily: 'var(--font-tech)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="prs" stroke="#06B6D4" strokeWidth={3} dot={{ fill: '#06B6D4', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}
