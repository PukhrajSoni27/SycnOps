import { useState } from 'react'
import { GitPullRequest, Search, MessageSquare, Clock } from 'lucide-react'
import { usePullRequestsQuery } from '@/hooks/useApi'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export default function PullRequests() {
  const { data: pullRequests = [], isLoading } = usePullRequestsQuery()
  const [search, setSearch] = useState('')

  const filtered = pullRequests.filter(pr =>
    pr.title.toLowerCase().includes(search.toLowerCase()) ||
    pr.repo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Pull Requests</h1>
          <p className="text-secondary-600 mt-1">Track pull requests, code reviews, and automated checks</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <Input
            placeholder="Search pull requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-secondary-500">Loading pull requests...</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(pr => (
            <Card key={pr.id} className="hover:border-primary-300 transition-colors">
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                    <GitPullRequest className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-secondary-900">{pr.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-secondary-500">
                      <span>{pr.repo}</span>
                      <span>•</span>
                      <span>by @{pr.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {pr.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm text-secondary-600">
                    <MessageSquare className="w-4 h-4" />
                    {pr.comments}
                  </span>
                  <Badge variant={pr.status === 'merged' ? 'success' : 'default'}>
                    {pr.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
