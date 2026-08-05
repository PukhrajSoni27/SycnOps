import { useState } from 'react'
import { Bell, GitPullRequest, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'pr' | 'issue' | 'system'
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'New PR Review Assigned', description: 'Alex assigned you to review PR #101', time: '10 min ago', read: false, type: 'pr' },
    { id: '2', title: 'High Priority Issue Opened', description: 'Issue #201: OAuth token refresh failing', time: '1 hour ago', read: false, type: 'issue' },
    { id: '3', title: 'AI Automation Completed', description: 'Weekly documentation summary successfully generated', time: '2 hours ago', read: true, type: 'system' }
  ])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Notifications</h1>
          <p className="text-secondary-600 mt-1">Stay updated with repository events and workflow alerts</p>
        </div>
        <button onClick={markAllRead} className="text-sm font-medium text-primary-600 hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map(item => (
          <Card key={item.id} className={item.read ? 'opacity-75' : 'border-l-4 border-l-primary-600'}>
            <CardContent className="p-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mt-1">
                  {item.type === 'pr' ? (
                    <GitPullRequest className="w-5 h-5 text-primary-600" />
                  ) : item.type === 'issue' ? (
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">{item.title}</h3>
                  <p className="text-sm text-secondary-600 mt-0.5">{item.description}</p>
                  <span className="text-xs text-secondary-400 mt-2 block">{item.time}</span>
                </div>
              </div>
              {!item.read && <Badge variant="default">New</Badge>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
