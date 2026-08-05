import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { 
  TrendingUp, 
  Clock, 
  GitBranch, 
  GitPullRequest, 
  AlertCircle,
  Calendar,
  Download
} from 'lucide-react'

const commitData = [
  { name: 'Mon', commits: 12, prs: 3, issues: 2 },
  { name: 'Tue', commits: 19, prs: 5, issues: 4 },
  { name: 'Wed', commits: 15, prs: 4, issues: 3 },
  { name: 'Thu', commits: 22, prs: 6, issues: 5 },
  { name: 'Fri', commits: 18, prs: 4, issues: 3 },
  { name: 'Sat', commits: 8, prs: 2, issues: 1 },
  { name: 'Sun', commits: 5, prs: 1, issues: 0 }
]

const productivityData = [
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 78 },
  { month: 'Mar', score: 82 },
  { month: 'Apr', score: 79 },
  { month: 'May', score: 85 },
  { month: 'Jun', score: 88 },
  { month: 'Jul', score: 92 }
]

const languageData = [
  { name: 'TypeScript', value: 45, color: '#3178c6' },
  { name: 'JavaScript', value: 25, color: '#f7df1e' },
  { name: 'Go', value: 15, color: '#00add8' },
  { name: 'Python', value: 10, color: '#3776ab' },
  { name: 'Other', value: 5, color: '#8b8b8b' }
]

const repoActivity = [
  { name: 'frontend-app', activity: 85 },
  { name: 'backend-api', activity: 72 },
  { name: 'auth-service', activity: 65 },
  { name: 'shared-utils', activity: 58 },
  { name: 'mobile-app', activity: 45 }
]

const stats = [
  {
    title: 'Total Commits',
    value: '1,234',
    change: '+12% from last month',
    icon: GitBranch,
    color: 'bg-blue-500'
  },
  {
    title: 'Pull Requests',
    value: '45',
    change: '+8% from last month',
    icon: GitPullRequest,
    color: 'bg-purple-500'
  },
  {
    title: 'Issues Resolved',
    value: '32',
    change: '+15% from last month',
    icon: AlertCircle,
    color: 'bg-green-500'
  },
  {
    title: 'Productivity Score',
    value: '92%',
    change: '+5% from last month',
    icon: TrendingUp,
    color: 'bg-orange-500'
  }
]

export default function Analytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Analytics</h1>
          <p className="text-secondary-600 mt-1">Track your development productivity and insights</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-lg bg-secondary-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-secondary-600" />
                </div>
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                <p className="text-sm text-secondary-600 mt-1">{stat.title}</p>
                <p className="text-xs text-secondary-500 mt-2">{stat.change}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary-900">Weekly Activity</h2>
            <div className="flex items-center gap-2 text-sm text-secondary-500">
              <Calendar className="w-4 h-4" />
              <span>Last 7 days</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={commitData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="commits" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Commits" />
              <Bar dataKey="prs" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="PRs" />
              <Bar dataKey="issues" fill="#f97316" radius={[4, 4, 0, 0]} name="Issues" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Productivity Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary-900">Productivity Trend</h2>
            <div className="flex items-center gap-2 text-sm text-secondary-500">
              <TrendingUp className="w-4 h-4" />
              <span>Last 7 months</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Language Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Repository Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Repository Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={repoActivity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                width={100}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="activity" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">AI-Powered Insights</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm text-primary-100 mb-2">Peak Productivity</p>
            <p className="text-2xl font-bold">Thursday</p>
            <p className="text-xs text-primary-200 mt-1">Most commits and PRs</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm text-primary-100 mb-2">Top Repository</p>
            <p className="text-2xl font-bold">frontend-app</p>
            <p className="text-xs text-primary-200 mt-1">85% activity score</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm text-primary-100 mb-2">Recommendation</p>
            <p className="text-lg font-bold">Focus on TypeScript</p>
            <p className="text-xs text-primary-200 mt-1">45% of your codebase</p>
          </div>
        </div>
      </div>
    </div>
  )
}
