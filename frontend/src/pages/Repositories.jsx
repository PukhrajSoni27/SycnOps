import { useState } from 'react'
import { 
  GitBranch, 
  Star, 
  GitFork, 
  Clock, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  Lock,
  Globe
} from 'lucide-react'

const repositories = [
  {
    id: 1,
    name: 'frontend-app',
    description: 'Modern React frontend application with TypeScript and TailwindCSS',
    language: 'TypeScript',
    stars: 234,
    forks: 45,
    updated: '2 hours ago',
    visibility: 'public',
    status: 'active',
    commits: 1234
  },
  {
    id: 2,
    name: 'backend-api',
    description: 'RESTful API built with Node.js, Express, and PostgreSQL',
    language: 'JavaScript',
    stars: 156,
    forks: 32,
    updated: '5 hours ago',
    visibility: 'public',
    status: 'active',
    commits: 876
  },
  {
    id: 3,
    name: 'auth-service',
    description: 'Authentication and authorization microservice',
    language: 'Go',
    stars: 89,
    forks: 12,
    updated: '1 day ago',
    visibility: 'private',
    status: 'active',
    commits: 234
  },
  {
    id: 4,
    name: 'shared-utils',
    description: 'Shared utility functions and helpers across projects',
    language: 'TypeScript',
    stars: 67,
    forks: 18,
    updated: '2 days ago',
    visibility: 'public',
    status: 'active',
    commits: 567
  },
  {
    id: 5,
    name: 'mobile-app',
    description: 'React Native mobile application for iOS and Android',
    language: 'TypeScript',
    stars: 145,
    forks: 28,
    updated: '3 days ago',
    visibility: 'public',
    status: 'active',
    commits: 445
  },
  {
    id: 6,
    name: 'documentation',
    description: 'Project documentation and API references',
    language: 'Markdown',
    stars: 34,
    forks: 8,
    updated: '1 week ago',
    visibility: 'public',
    status: 'archived',
    commits: 123
  }
]

const languageColors = {
  'TypeScript': 'bg-blue-500',
  'JavaScript': 'bg-yellow-500',
  'Go': 'bg-cyan-500',
  'Markdown': 'bg-gray-500',
  'Python': 'bg-green-500',
  'Java': 'bg-red-500'
}

export default function Repositories() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredRepos = repositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repo.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || repo.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Repositories</h1>
          <p className="text-secondary-600 mt-1">Manage and monitor your GitHub repositories</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Repository
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            placeholder="Search repositories..."
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
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Repository Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <p className="text-2xl font-bold text-secondary-900">{repositories.length}</p>
          <p className="text-sm text-secondary-600">Total Repos</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <p className="text-2xl font-bold text-secondary-900">
            {repositories.filter(r => r.visibility === 'public').length}
          </p>
          <p className="text-sm text-secondary-600">Public</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <p className="text-2xl font-bold text-secondary-900">
            {repositories.filter(r => r.visibility === 'private').length}
          </p>
          <p className="text-sm text-secondary-600">Private</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <p className="text-2xl font-bold text-secondary-900">
            {repositories.reduce((acc, r) => acc + r.commits, 0).toLocaleString()}
          </p>
          <p className="text-sm text-secondary-600">Total Commits</p>
        </div>
      </div>

      {/* Repository List */}
      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
        <div className="divide-y divide-secondary-200">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="p-6 hover:bg-secondary-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-5 h-5 text-secondary-400" />
                    <h3 className="text-lg font-semibold text-secondary-900 hover:text-primary-600 cursor-pointer">
                      {repo.name}
                    </h3>
                    {repo.visibility === 'private' ? (
                      <Lock className="w-4 h-4 text-secondary-400" />
                    ) : (
                      <Globe className="w-4 h-4 text-secondary-400" />
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      repo.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {repo.status}
                    </span>
                  </div>
                  <p className="text-secondary-600 text-sm mb-3">{repo.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500">
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${languageColors[repo.language] || 'bg-gray-500'}`} />
                      <span>{repo.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{repo.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      <span>{repo.forks}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Updated {repo.updated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-secondary-100 transition-colors">
                    <ExternalLink className="w-5 h-5 text-secondary-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-secondary-100 transition-colors">
                    <MoreVertical className="w-5 h-5 text-secondary-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredRepos.length === 0 && (
          <div className="p-12 text-center">
            <GitBranch className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-500">No repositories found</p>
          </div>
        )}
      </div>
    </div>
  )
}
