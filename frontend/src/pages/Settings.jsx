import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Github,
  Save,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

export default function Settings() {
  const [settings, setSettings] = useState({
    // Profile Settings
    email: 'john.doe@example.com',
    username: 'john_doe',
    fullName: 'John Doe',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    desktopNotifications: false,
    weeklyDigest: true,
    
    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    
    // Appearance Settings
    theme: 'light',
    language: 'en',
    
    // Integration Settings
    githubConnected: true,
    githubUsername: 'johndoe',
    
    // Privacy Settings
    profileVisibility: 'public',
    activityVisible: true
  })

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Simulate save
    console.log('Settings saved:', settings)
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
          <p className="text-secondary-600 mt-1">Manage your account settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
            <nav className="divide-y divide-secondary-200">
              {[
                { id: 'profile', icon: User, label: 'Profile' },
                { id: 'notifications', icon: Bell, label: 'Notifications' },
                { id: 'security', icon: Shield, label: 'Security' },
                { id: 'appearance', icon: Palette, label: 'Appearance' },
                { id: 'integrations', icon: Github, label: 'Integrations' },
                { id: 'privacy', icon: Globe, label: 'Privacy' }
              ].map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary-50 transition-colors text-left"
                >
                  <item.icon className="w-5 h-5 text-secondary-500" />
                  <span className="text-secondary-700">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-secondary-400 ml-auto" />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={settings.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Username</label>
                <input
                  type="text"
                  value={settings.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </h2>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email notifications' },
                { key: 'pushNotifications', label: 'Push notifications' },
                { key: 'desktopNotifications', label: 'Desktop notifications' },
                { key: 'weeklyDigest', label: 'Weekly digest email' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-secondary-700">{item.label}</span>
                  <button
                    onClick={() => handleToggle(item.key)}
                    className="relative"
                  >
                    {settings[item.key] ? (
                      <ToggleRight className="w-12 h-6 text-primary-600" />
                    ) : (
                      <ToggleLeft className="w-12 h-6 text-secondary-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary-700">Two-factor authentication</span>
                <button
                  onClick={() => handleToggle('twoFactorAuth')}
                  className="relative"
                >
                  {settings.twoFactorAuth ? (
                    <ToggleRight className="w-12 h-6 text-primary-600" />
                  ) : (
                    <ToggleLeft className="w-12 h-6 text-secondary-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-700">Login alerts</span>
                <button
                  onClick={() => handleToggle('loginAlerts')}
                  className="relative"
                >
                  {settings.loginAlerts ? (
                    <ToggleRight className="w-12 h-6 text-primary-600" />
                  ) : (
                    <ToggleLeft className="w-12 h-6 text-secondary-400" />
                  )}
                </button>
              </div>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Change password →
              </button>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Integration Settings */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
              <Github className="w-5 h-5" />
              Integrations
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Github className="w-6 h-6" />
                  <div>
                    <p className="font-medium text-secondary-900">GitHub</p>
                    <p className="text-sm text-secondary-600">
                      {settings.githubConnected ? `Connected as @${settings.githubUsername}` : 'Not connected'}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700">
                  {settings.githubConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Privacy
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Profile visibility</label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => handleChange('profileVisibility', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-700">Show activity on profile</span>
                <button
                  onClick={() => handleToggle('activityVisible')}
                  className="relative"
                >
                  {settings.activityVisible ? (
                    <ToggleRight className="w-12 h-6 text-primary-600" />
                  ) : (
                    <ToggleLeft className="w-12 h-6 text-secondary-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                Deactivate account
              </button>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete account permanently
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
