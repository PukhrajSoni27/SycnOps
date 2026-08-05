import { useState } from 'react'
import { GitBranch, Star, GitFork, Search, Plus } from 'lucide-react'
import { useRepositoriesQuery } from '@/hooks/useApi'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Repositories() {
  const { data: repositories = [], isLoading } = useRepositoriesQuery()
  const [search, setSearch] = useState('')

  const filtered = repositories.filter(repo =>
    repo.name.toLowerCase().includes(search.toLowerCase()) ||
    repo.language.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Repositories</h1>
          <p className="text-secondary-600 mt-1">Manage and monitor connected GitHub repositories</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Connect Repository
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <Input
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-secondary-500">Loading repositories...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(repo => (
            <Card key={repo.id} className="hover:border-primary-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-secondary-900">{repo.name}</h3>
                      <p className="text-xs text-secondary-500">{repo.language}</p>
                    </div>
                  </div>
                  <Badge variant={repo.visibility === 'Public' ? 'default' : 'secondary'}>
                    {repo.visibility}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 mt-6 pt-4 border-t text-sm text-secondary-600">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    {repo.forks}
                  </span>
                  <span>{repo.openIssues} Open Issues</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
