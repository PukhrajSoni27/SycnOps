import { useState } from 'react'
import { 
  Bell, 
  GitPullRequest, 
  AlertCircle, 
  CheckCircle,
  MessageSquare,
  Star,
  GitBranch,
  X,
  Check,
  Filter,
  Clock,
  User
} from 'lucide-react'

const notifications = [
  {
    id: 1,
    type: 'pr',
    title: 'Pull request approved',
    description: 'Your PR "Feature: Add user authentication" was approved by jane_smith',
    repository: 'frontend-app',
    time: '2 minutes ago',
    read: false,
    icon: GitPullRequest,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100'
  },
  {
    id: 2,
    type: 'issue',
    title: 'New issue assigned',
    description: 'You were assigned to issue "Memory leak in data fetching"',
    repository: 'backend-api',
    time: '15 minutes ago',
    read: false,
    icon: AlertCircle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100'
  },
  {
    id: 3,
    type: 'comment',
    title: 'New comment on your PR',
    description: 'bob_wilson commented on your pull request',
    repository: 'shared-utils',
    time: '1 hour ago',
    read: false,
    icon: MessageSquare,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  {
    id: 4,
    type: 'star',
    title: 'Repository starred',
    description: 'alice_johnson starred your repository',
    repository: 'auth-service',
    time: '2 hours ago',
    read: true,
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100'
  },
  {
    id: 5,
    type: 'merge',
    title: 'Pull request merged',
    description: 'Your PR "Hotfix: Security patch" was merged',
    repository: 'auth-service',
    time: '3 hours ago',
    read: true,
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  },
  {
    id: 6,
    type: 'fork',
    title: 'Repository forked',
    description: 'external_user forked your repository',
    repository: 'frontend-app',
    time: '5 hours ago',
    read: true,
    icon: GitBranch,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100'
  },
  {
    id: 7,
    type: 'mention',
    title: 'You were mentioned',
    description: 'jane_smith mentioned you in a comment',
    repository: 'mobile-app',
    time: '1 day ago',
    read: true,
    icon: User,
    color: 'text-pink-500',
    bgColor: 'bg-pink-100'
  },
  {
    id: 8,
    type: 'issue',
    title: 'Issue closed',
    description: 'Issue "API rate limiting issue" was closed',
    repository: 'backend-api',
    time: '1 day ago',
    read: true,
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  }
]

export default function Notifications() {
  const [filter, setFilter] = useState('all')
  const [notificationsList, setNotificationsList] = useState(notifications)

  const filteredNotifications = notificationsList.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  })

  const markAsRead = (id) => {
    setNotificationsList(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotificationsList(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id) => {
    setNotificationsList(prev =>
      prev.filter(notif => notif.id !== id)
    )
  }

  const unreadCount = notificationsList.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-8 h-8 text-secondary-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Notifications</h1>
            <p className="text-secondary-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors text-sm"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-secondary-400" />
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-600 hover:bg-secondary-100 border border-secondary-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-600 hover:bg-secondary-100 border border-secondary-300'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'read'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-600 hover:bg-secondary-100 border border-secondary-300'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-secondary-200">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-secondary-50 transition-colors ${
                    !notification.read ? 'bg-primary-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${notification.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${notification.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-secondary-900 ${!notification.read ? 'text-primary-700' : ''}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-secondary-600 mb-2">{notification.description}</p>
                          <div className="flex items-center gap-3 text-xs text-secondary-500">
                            <div className="flex items-center gap-1">
                              <GitBranch className="w-3 h-3" />
                              <span>{notification.repository}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{notification.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1.5 rounded-lg hover:bg-secondary-200 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-secondary-400" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1.5 rounded-lg hover:bg-secondary-200 transition-colors"
                            title="Delete"
                          >
                            <X className="w-4 h-4 text-secondary-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-500">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications found'}
            </p>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-secondary-200 p-6">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            'Pull requests',
            'Issues',
            'Comments and mentions',
            'Repository stars and forks',
            'Security alerts'
          ].map((item, index) => (
            <label key={index} className="flex items-center justify-between cursor-pointer">
              <span className="text-secondary-700">{item}</span>
              <input
                type="checkbox"
                defaultChecked={index < 3}
                className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
