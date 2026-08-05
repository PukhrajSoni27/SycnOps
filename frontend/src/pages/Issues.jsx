import { useState } from 'react'
import { 
  AlertCircle, 
  Clock, 
  MessageSquare, 
  CheckCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  GitBranch,
  User,
  Calendar
} from 'lucide-react'

const issues = [
  {
    id: 1,
    title: 'Memory leak in data fetching component',
    description: 'Application experiences memory degradation when fetching large datasets repeatedly',
    number: 456,
    repository: 'frontend-app',
    author: 'john_doe',
    status: 'open',
    priority: 'high',
    labels: ['bug', 'performance', 'critical'],
    comments: 8,
    created: '2 hours ago',
    updated: '1 hour ago',
    assignees: ['jane_smith']
  },
  {
    id: 2,
    title: 'Add dark mode support',
    description: 'Implement system-wide dark mode with user preference persistence',
    number: 455,
    repository: 'mobile-app',
    author: 'alice_johnson',
    status: 'open',
    priority: 'medium',
    labels: ['feature', 'ui', 'enhancement'],
    comments: 15,
    created: '1 day ago',
    updated: '5 hours ago',
    assignees: ['bob_wilson', 'alice_johnson']
  },
  {
    id: 3,
    title: 'API rate limiting not working correctly',
    description: 'Rate limiting middleware is not enforcing limits as expected',
    number: 454,
    repository: 'backend-api',
    author: 'jane_smith',
    status: 'open',
    priority: 'high',
    labels: ['bug', 'api'],
    comments: 6,
    created: '2 days ago',
    updated: '1 day ago',
    assignees: ['john_doe']
  },
  {
    id: 4,
    title: 'Improve error handling in auth service',
    description: 'Add better error messages and logging for authentication failures',
    number: 453,
    repository: 'auth-service',
    author: 'bob_wilson',
    status: 'closed',
    priority: 'medium',
    labels: ['enhancement', 'authentication'],
    comments: 4,
    created: '3 days ago',
    updated: '2 days ago',
    assignees: ['jane_smith']
  },
  {
    id: 5,
    title: 'Documentation needs update for new API endpoints',
    description: 'API documentation is outdated for recently added endpoints',
    number: 452,
    repository: 'documentation',
    author: 'alice_johnson',
    status: 'open',
    priority: 'low',
    labels: ['documentation', 'maintenance'],
    comments: 2,
    created: '1 week ago',
    updated: '3 days ago',
    assignees: []
  },
  {
    id: 6,
    title: 'Security vulnerability in dependency',
    description: 'Update vulnerable npm package to latest secure version',
    number: 451,
    repository: 'shared-utils',
    author: 'john_doe',
    status: 'closed',
    priority: 'critical',
    labels: ['security', 'dependency'],
    comments: 3,
    created: '1 week ago',
    updated: '5 days ago',
    assignees: ['bob_wilson', 'john_doe']
  }
]

const statusColors = {
  open: 'bg-green-100 text-green-700',
  closed: 'bg-red-100 text-red-700'
}

const priorityColors = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-blue-100 text-blue-700'
}

const labelColors = {
  'bug': 'bg-red-100 text-red-700',
  'feature': 'bg-blue-100 text-blue-700',
  'enhancement': 'bg-purple-100 text-purple-700',
  'performance': 'bg-yellow-100 text-yellow-700',
  'critical': 'bg-red-100 text-red-700',
  'ui': 'bg-pink-100 text-pink-700',
  'api': 'bg-cyan-100 text-cyan-700',
  'authentication': 'bg-indigo-100 text-indigo-700',
  'documentation': 'bg-gray-100 text-gray-700',
  'maintenance': 'bg-gray-100 text-gray-700',
  'security': 'bg-red-100 text-red-700',
  'dependency': 'bg-orange-100 text-orange-700'
}

export default function Issues() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.repository.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus
    const matchesPriority = filterPriority === 'all' || issue.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Issues</h1>
          <p className="text-secondary-600 mt-1">Track and manage issues across your repositories</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5" />
          New Issue
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-secondary-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Issue Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <p className="text-2xl font-bold text-secondary-900">
            {issues.filter(issue => issue.status === 'open').length}
          </p>
          <p className="text-sm text-secondary-600">Open Issues</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <p className="text-2xl font-bold text-secondary-900">
            {issues.filter(issue => issue.status === 'closed').length}
          </p>
          <p className="text-sm text-secondary-600">Closed</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <p className="text-2xl font-bold text-secondary-900">
            {issues.filter(issue => issue.priority === 'critical' || issue.priority === 'high').length}
          </p>
          <p className="text-sm text-secondary-600">High Priority</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <p className="text-2xl font-bold text-secondary-900">
            {issues.reduce((acc, issue) => acc + issue.comments, 0)}
          </p>
          <p className="text-sm text-secondary-600">Total Comments</p>
        </div>
      </div>

      {/* Issue List */}
      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
        <div className="divide-y divide-secondary-200">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="p-6 hover:bg-secondary-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <AlertCircle className={`w-5 h-5 ${
                      issue.status === 'open' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <h3 className="text-lg font-semibold text-secondary-900 hover:text-primary-600 cursor-pointer">
                      {issue.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[issue.status]}`}>
                      {issue.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}>
                      {issue.priority}
                    </span>
                    <span className="text-sm text-secondary-500">#{issue.number}</span>
                  </div>
                  
                  <p className="text-secondary-600 text-sm mb-3">{issue.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-secondary-500 mb-3">
                    <div className="flex items-center gap-1">
                      <GitBranch className="w-4 h-4" />
                      <span>{issue.repository}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{issue.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Opened {issue.created}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {issue.labels.map((label) => (
                      <span
                        key={label}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${labelColors[label] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-secondary-500">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{issue.comments} comments</span>
                    </div>
                    {issue.assignees.length > 0 && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{issue.assignees.length} assignee{issue.assignees.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {issue.status === 'closed' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Closed {issue.updated}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-secondary-100 transition-colors">
                  <MoreVertical className="w-5 h-5 text-secondary-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-500">No issues found</p>
          </div>
        )}
      </div>
    </div>
  )
}
