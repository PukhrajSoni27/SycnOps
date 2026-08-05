import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Profile() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">User Profile</h1>
        <p className="text-secondary-600 mt-1">Manage developer profile and activity stats</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
          <div>
            <CardTitle>John Doe</CardTitle>
            <p className="text-sm text-secondary-500">Senior Full-Stack Developer</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-secondary-700 mb-2">Skills & Technologies</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">TypeScript</Badge>
              <Badge variant="default">React 18</Badge>
              <Badge variant="default">TanStack React Query</Badge>
              <Badge variant="default">Shadcn UI</Badge>
              <Badge variant="default">Tailwind CSS</Badge>
              <Badge variant="default">Node.js Express</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
