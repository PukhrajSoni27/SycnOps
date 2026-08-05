import { Link } from 'react-router-dom'
import { 
  GitBranch, 
  GitPullRequest, 
  AlertCircle, 
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  Activity
} from 'lucide-react'

const stats = [
  {
    title: 'Total Repositories',
    value: '24',
    change: '+3 this month',
    icon: GitBranch,
    color: 'bg-blue-500',
    link: '/repositories'
  },
  {
    title: 'Open Pull Requests',
    value: '12',
    change: '+5 this week',
    icon: GitPullRequest,
    color: 'bg-purple-500',
    link: '/pull-requests'
  },
  {
    title: 'Active Issues',
    value: '8',
    change: '-2 from yesterday',
    icon: AlertCircle,
    color: 'bg-orange-500',
    link: '/issues'
  },
  {
    title: 'Productivity Score',
    value: '92%',
    change: '+5% improvement',
    icon: TrendingUp,
    color: 'bg-green-500',
    link: '/analytics'
  }
]

const recentActivity = [
  {
    type: 'pr',
    title: 'New pull request opened',
    description: 'Feature: Add user authentication',
    repo: 'frontend-app',
    time: '2 hours ago',
    status: 'open'
  },
  {
    type: 'issue',
    title: 'Issue closed',
    description: 'Bug: Login page not responsive',
    repo: 'backend-api',
    time: '4 hours ago',
    status: 'closed'
  },
  {
    type: 'commit',
    title: 'Commit pushed',
    description: 'Fix: Update dependencies',
    repo: 'shared-utils',
    time: '6 hours ago',
    status: 'merged'
  },
  {
    type: 'pr',
    title: 'Pull request merged',
    description: 'Hotfix: Security patch',
    repo: 'auth-service',
    time: '1 day ago',
    status: 'merged'
  }
]

const quickActions = [
  {
    title: 'Connect Repository',
    description: 'Link a new GitHub repository',
    icon: GitBranch,
    link: '/repositories'
  },
  {
    title: 'Create Pull Request',
    description: 'Start a new PR workflow',
    icon: GitPullRequest,
    link: '/pull-requests'
  },
  {
    title: 'Report Issue',
    description: 'Track and manage issues',
    icon: AlertCircle,
    link: '/issues'
  },
  {
    title: 'View Analytics',
    description: 'Check productivity insights',
    icon: Activity,
    link: '/analytics'
  }
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600 mt-1">Welcome back! Here's an overview of your development activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 hover:shadow-md hover:border-primary-300 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-lg bg-secondary-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <Icon className="w-6 h-6 text-secondary-600 group-hover:text-primary-600" />
                </div>
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                <p className="text-sm text-secondary-600 mt-1">{stat.title}</p>
                <p className="text-xs text-secondary-500 mt-2">{stat.change}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <h2 className="text-lg font-semibold text-secondary-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const statusColors = {
                  open: 'bg-green-100 text-green-700',
                  closed: 'bg-red-100 text-red-700',
                  merged: 'bg-purple-100 text-purple-700'
                }
                const iconColors = {
                  pr: 'text-purple-500',
                  issue: 'text-orange-500',
                  commit: 'text-green-500'
                }
                const icons = {
                  pr: GitPullRequest,
                  issue: AlertCircle,
                  commit: CheckCircle
                }
                const ActivityIcon = icons[activity.type]
                
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center ${iconColors[activity.type]}`}>
                      <ActivityIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-secondary-900">{activity.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[activity.status]}`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600 mt-1">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-secondary-500">{activity.repo}</span>
                        <span className="text-secondary-300">•</span>
                        <span className="text-xs text-secondary-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2">
              View all activity
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <h2 className="text-lg font-semibold text-secondary-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex items-center gap-3 p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                      <Icon className="w-5 h-5 text-secondary-600 group-hover:text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">{action.title}</p>
                      <p className="text-sm text-secondary-600">{action.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-secondary-400 group-hover:text-primary-600" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">AI-Powered Insights Ready</h3>
            <p className="text-primary-100">
              Get intelligent code summaries, documentation generation, and productivity recommendations.
            </p>
          </div>
          <Link
            to="/ai-assistant"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium whitespace-nowrap"
          >
            Try AI Assistant
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
