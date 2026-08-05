import { Link } from 'react-router-dom'
import { GitBranch, GitPullRequest, AlertCircle, TrendingUp, Plus, ArrowUpRight } from 'lucide-react'
import { useRepositoriesQuery, usePullRequestsQuery, useIssuesQuery } from '@/hooks/useApi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const { data: repositories = [], isLoading: loadingRepos } = useRepositoriesQuery()
  const { data: pullRequests = [], isLoading: loadingPRs } = usePullRequestsQuery()
  const { data: issues = [], isLoading: loadingIssues } = useIssuesQuery()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600 mt-1">Welcome back, John! Here's your workflow overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link to="/repositories">View All Repos</Link>
          </Button>
          <Button asChild>
            <Link to="/ai-assistant">
              <Plus className="w-4 h-4 mr-2" />
              New AI Automation
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Active Repositories</p>
              <h3 className="text-2xl font-bold text-secondary-900 mt-1">
                {loadingRepos ? '...' : repositories.length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Open Pull Requests</p>
              <h3 className="text-2xl font-bold text-secondary-900 mt-1">
                {loadingPRs ? '...' : pullRequests.length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <GitPullRequest className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Open Issues</p>
              <h3 className="text-2xl font-bold text-secondary-900 mt-1">
                {loadingIssues ? '...' : issues.length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Velocity Score</p>
              <h3 className="text-2xl font-bold text-secondary-900 mt-1">94.5%</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Repositories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Monitored Repositories</CardTitle>
            <Link to="/repositories" className="text-sm font-medium text-primary-600 hover:underline inline-flex items-center gap-1">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {repositories.map(repo => (
              <div key={repo.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary-200 transition-colors">
                <div>
                  <h4 className="font-semibold text-secondary-900">{repo.name}</h4>
                  <p className="text-xs text-secondary-500 mt-1">{repo.language} • Updated {repo.updatedAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">★ {repo.stars}</Badge>
                  <Badge variant="secondary">{repo.visibility}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent PRs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Recent Pull Requests</CardTitle>
            <Link to="/pull-requests" className="text-sm font-medium text-primary-600 hover:underline inline-flex items-center gap-1">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {pullRequests.map(pr => (
              <div key={pr.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary-200 transition-colors">
                <div>
                  <h4 className="font-semibold text-secondary-900">{pr.title}</h4>
                  <p className="text-xs text-secondary-500 mt-1">{pr.repo} • by @{pr.author}</p>
                </div>
                <Badge variant={pr.status === 'merged' ? 'success' : 'default'}>
                  {pr.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
