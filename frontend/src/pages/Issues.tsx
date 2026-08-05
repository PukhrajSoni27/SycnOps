import { useState } from 'react'
import { AlertCircle, Search, User } from 'lucide-react'
import { useIssuesQuery } from '@/hooks/useApi'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export default function Issues() {
  const { data: issues = [], isLoading } = useIssuesQuery()
  const [search, setSearch] = useState('')

  const filtered = issues.filter(issue =>
    issue.title.toLowerCase().includes(search.toLowerCase()) ||
    issue.repo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Issues</h1>
          <p className="text-secondary-600 mt-1">Monitor, categorize, and resolve repository issues</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <Input
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-secondary-500">Loading issues...</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(issue => (
            <Card key={issue.id} className="hover:border-primary-300 transition-colors">
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-secondary-900">{issue.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-secondary-500">
                      <span>{issue.repo}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> Assignee: @{issue.assignee}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={issue.priority === 'high' ? 'destructive' : 'outline'}>
                    {issue.priority}
                  </Badge>
                  <Badge variant="secondary">{issue.label}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
