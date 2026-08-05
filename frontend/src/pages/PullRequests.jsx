import { useState } from 'react'
import { 
  GitPullRequest, 
  Clock, 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  GitBranch,
  User,
  Calendar
} from 'lucide-react'

const pullRequests = [
  {
    id: 1,
    title: 'Feature: Add user authentication system',
    description: 'Implement OAuth2 authentication with Google and GitHub providers',
    number: 234,
    repository: 'frontend-app',
    author: 'john_doe',
    status: 'open',
    labels: ['feature', 'authentication'],
    comments: 12,
    additions: 234,
    deletions: 45,
    created: '2 hours ago',
    updated: '1 hour ago',
    reviewers: ['jane_smith', 'bob_wilson']
  },
  {
    id: 2,
    title: 'Bug fix: Resolve memory leak in data fetching',
    description: 'Fixed memory leak issue when fetching large datasets',
    number: 233,
    repository: 'backend-api',
    author: 'jane_smith',
    status: 'open',
    labels: ['bug', 'performance'],
    comments: 8,
    additions: 56,
    deletions: 23,
    created: '5 hours ago',
    updated: '3 hours ago',
    reviewers: ['john_doe']
  },
  {
    id: 3,
    title: 'Refactor: Update API response handling',
    description: 'Refactored error handling and response parsing',
    number: 232,
    repository: 'shared-utils',
    author: 'bob_wilson',
    status: 'merged',
    labels: ['refactor'],
    comments: 15,
    additions: 189,
    deletions: 123,
    created: '1 day ago',
    updated: '12 hours ago',
    reviewers: ['john_doe', 'jane_smith']
  },
  {
    id: 4,
    title: 'Hotfix: Security patch for XSS vulnerability',
    description: 'Critical security fix for cross-site scripting vulnerability',
    number: 231,
    repository: 'auth-service',
    author: 'john_doe',
    status: 'merged',
    labels: ['security', 'hotfix'],
    comments: 6,
    additions: 34,
    deletions: 12,
    created: '2 days ago',
    updated: '1 day ago',
    reviewers: ['jane_smith', 'bob_wilson', 'alice_johnson']
  },
  {
    id: 5,
    title: 'Feature: Implement dark mode support',
    description: 'Add dark mode toggle and theme switching capabilities',
    number: 230,
    repository: 'mobile-app',
    author: 'alice_johnson',
    status: 'draft',
    labels: ['feature', 'ui'],
    comments: 3,
    additions: 145,
    deletions: 67,
    created: '3 days ago',
    updated: '2 days ago',
    reviewers: []
  },
  {
    id: 6,
    title: 'Docs: Update API documentation',
    description: 'Comprehensive update to API documentation and examples',
    number: 229,
    repository: 'documentation',
    author: 'bob_wilson',
    status: 'closed',
    labels: ['documentation'],
    comments: 4,
    additions: 567,
    deletions: 234,
    created: '1 week ago',
    updated: '5 days ago',
    reviewers: ['john_doe']
  }
]

const statusColors = {
  open: 'bg-green-100 text-green-700',
  merged: 'bg-purple-100 text-purple-700',
  closed: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-700'
}

const statusIcons = {
  open: GitPullRequest,
  merged: CheckCircle,
  closed: AlertCircle,
  draft: GitPullRequest
}

const labelColors = {
  'feature': 'bg-blue-100 text-blue-700',
  'bug': 'bg-red-100 text-red-700',
  'refactor': 'bg-yellow-100 text-yellow-700',
  'security': 'bg-orange-100 text-orange-700',
  'hotfix': 'bg-red-100 text-red-700',
  'documentation': 'bg-purple-100 text-purple-700',
  'authentication': 'bg-cyan-100 text-cyan-700',
  'performance': 'bg-green-100 text-green-700',
  'ui': 'bg-pink-100 text-pink-700'
}

export default function PullRequests() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredPRs = pullRequests.filter(pr => {
    const matchesSearch = pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pr.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pr.repository.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || pr.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Pull Requests</h1>
          <p className="text-secondary-600 mt-1">Review and manage pull requests across your repositories</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5" />
          New Pull Request
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            placeholder="Search pull requests..."
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
            <option value="merged">Merged</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* PR Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <p className="text-2xl font-bold text-secondary-900">
            {pullRequests.filter(pr => pr.status === 'open').length}
          </p>
          <p className="text-sm text-secondary-600">Open PRs</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <p className="text-2xl font-bold text-secondary-900">
            {pullRequests.filter(pr => pr.status === 'merged').length}
          </p>
          <p className="text-sm text-secondary-600">Merged</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <p className="text-2xl font-bold text-secondary-900">
            {pullRequests.filter(pr => pr.status === 'draft').length}
          </p>
          <p className="text-sm text-secondary-600">Drafts</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <p className="text-2xl font-bold text-secondary-900">
            {pullRequests.reduce((acc, pr) => acc + pr.comments, 0)}
          </p>
          <p className="text-sm text-secondary-600">Total Comments</p>
        </div>
      </div>

      {/* PR List */}
      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
        <div className="divide-y divide-secondary-200">
          {filteredPRs.map((pr) => {
            const StatusIcon = statusIcons[pr.status]
            return (
              <div
                key={pr.id}
                className="p-6 hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <StatusIcon className={`w-5 h-5 ${
                        pr.status === 'open' ? 'text-green-500' :
                        pr.status === 'merged' ? 'text-purple-500' :
                        pr.status === 'closed' ? 'text-red-500' :
                        'text-gray-400'
                      }`} />
                      <h3 className="text-lg font-semibold text-secondary-900 hover:text-primary-600 cursor-pointer">
                        {pr.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[pr.status]}`}>
                        {pr.status}
                      </span>
                      <span className="text-sm text-secondary-500">#{pr.number}</span>
                    </div>
                    
                    <p className="text-secondary-600 text-sm mb-3">{pr.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-secondary-500 mb-3">
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-4 h-4" />
                        <span>{pr.repository}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{pr.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Opened {pr.created}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {pr.labels.map((label) => (
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
                        <span>{pr.comments} comments</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <span>+{pr.additions}</span>
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <span>-{pr.deletions}</span>
                      </div>
                      {pr.reviewers.length > 0 && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{pr.reviewers.length} reviewer{pr.reviewers.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-secondary-100 transition-colors">
                    <MoreVertical className="w-5 h-5 text-secondary-400" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filteredPRs.length === 0 && (
          <div className="p-12 text-center">
            <GitPullRequest className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-500">No pull requests found</p>
          </div>
        )}
      </div>
    </div>
  )
}
