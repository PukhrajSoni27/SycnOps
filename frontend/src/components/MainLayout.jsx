import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  GitBranch, 
  GitPullRequest, 
  AlertCircle, 
  BarChart3, 
  Bot, 
  Bell, 
  Settings, 
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Repositories', href: '/repositories', icon: GitBranch },
  { name: 'Pull Requests', href: '/pull-requests', icon: GitPullRequest },
  { name: 'Issues', href: '/issues', icon: AlertCircle },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Bot },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-primary-600">SycnOps AI</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:w-64 lg:bg-white lg:shadow-lg">
        <div className="flex items-center gap-2 p-6 border-b">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-primary-600">SycnOps AI</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:hidden">
              <h1 className="text-lg font-semibold text-primary-600">SycnOps AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/notifications"
                className="relative p-2 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-secondary-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-secondary-900">John Doe</p>
                  <p className="text-xs text-secondary-500">Developer</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
