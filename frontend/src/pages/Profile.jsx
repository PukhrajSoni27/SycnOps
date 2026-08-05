import { useState } from 'react'
import { 
  User, 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Calendar,
  Edit,
  Camera,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Award,
  GitBranch,
  GitPullRequest,
  AlertCircle,
  TrendingUp
} from 'lucide-react'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'John Doe',
    username: 'john_doe',
    email: 'john.doe@example.com',
    bio: 'Full-stack developer passionate about building great products. Love working with React, Node.js, and cloud technologies.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    company: 'Tech Corp',
    joined: 'January 2024'
  })

  const stats = {
    repositories: 24,
    pullRequests: 156,
    issuesResolved: 89,
    contributions: 1234
  }

  const recentActivity = [
    {
      type: 'commit',
      repo: 'frontend-app',
      message: 'Fix: Update responsive layout',
      time: '2 hours ago'
    },
    {
      type: 'pr',
      repo: 'backend-api',
      message: 'Merged PR: Add rate limiting',
      time: '5 hours ago'
    },
    {
      type: 'issue',
      repo: 'auth-service',
      message: 'Closed issue: Token expiration',
      time: '1 day ago'
    }
  ]

  const skills = ['React', 'TypeScript', 'Node.js', 'Python', 'Go', 'PostgreSQL', 'AWS', 'Docker']

  const handleSave = () => {
    setIsEditing(false)
    // Simulate save
    console.log('Profile saved:', profile)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Profile</h1>
          <p className="text-secondary-600 mt-1">Manage your public profile and information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <Edit className="w-5 h-5" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800" />
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-secondary-200 border-4 border-white flex items-center justify-center text-3xl font-bold text-secondary-600">
                JD
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-secondary-900">{profile.name}</h2>
              <p className="text-secondary-600">@{profile.username}</p>
            </div>
            <div className="flex gap-2">
              <a href="#" className="p-2 rounded-lg bg-secondary-100 hover:bg-secondary-200 transition-colors">
                <Github className="w-5 h-5 text-secondary-600" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary-100 hover:bg-secondary-200 transition-colors">
                <Twitter className="w-5 h-5 text-secondary-600" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary-100 hover:bg-secondary-200 transition-colors">
                <Linkedin className="w-5 h-5 text-secondary-600" />
              </a>
            </div>
          </div>

          {isEditing ? (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-secondary-700">{profile.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  <a href={profile.website} className="hover:text-primary-600" target="_blank" rel="noopener noreferrer">
                    {profile.website}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{profile.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {profile.joined}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-secondary-600">Repositories</span>
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.repositories}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center gap-2 mb-2">
            <GitPullRequest className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-secondary-600">Pull Requests</span>
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.pullRequests}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-secondary-600">Issues Resolved</span>
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.issuesResolved}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-secondary-600">Contributions</span>
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.contributions}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Skills */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Skills & Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.type === 'commit' ? 'bg-green-100' :
                  activity.type === 'pr' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  {activity.type === 'commit' && <GitBranch className="w-4 h-4 text-green-600" />}
                  {activity.type === 'pr' && <GitPullRequest className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'issue' && <AlertCircle className="w-4 h-4 text-orange-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900">{activity.message}</p>
                  <p className="text-xs text-secondary-500 mt-1">{activity.repo} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
