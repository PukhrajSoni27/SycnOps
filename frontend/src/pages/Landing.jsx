import { Link } from 'react-router-dom'
import { 
  Bot, 
  GitBranch, 
  BarChart3, 
  Zap, 
  Shield, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const features = [
  {
    icon: GitBranch,
    title: 'GitHub Integration',
    description: 'Monitor repositories, pull requests, commits, and issues in real-time with seamless GitHub integration.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Get comprehensive insights into your development workflow with detailed analytics and productivity metrics.'
  },
  {
    icon: Bot,
    title: 'AI-Powered Features',
    description: 'Leverage AI for automatic summaries, documentation generation, and intelligent code recommendations.'
  },
  {
    icon: Zap,
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks and streamline your development process with intelligent automation.'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with encrypted data storage and reliable performance for your critical workflows.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Enhance team productivity with shared insights, notifications, and collaborative features.'
  }
]

const benefits = [
  'Real-time GitHub monitoring',
  'AI-powered code summaries',
  'Automated documentation generation',
  'Productivity insights and analytics',
  'Smart notifications and alerts',
  'Customizable dashboard',
  'Multi-repository support',
  'Team collaboration tools'
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-600">SycnOps AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-secondary-600 hover:text-primary-600 transition-colors">Features</a>
              <a href="#benefits" className="text-secondary-600 hover:text-primary-600 transition-colors">Benefits</a>
              <Link to="/login" className="text-secondary-600 hover:text-primary-600 transition-colors">Login</Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Developer Workflow
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6">
              Automate Your Development Workflow with{' '}
              <span className="text-primary-600">SycnOps AI</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
              Integrate with GitHub, monitor repositories, automate tasks, and boost productivity with AI-powered insights and automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-secondary-300 text-secondary-700 rounded-lg hover:border-primary-600 hover:text-primary-600 transition-colors text-lg font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Powerful Features for Developers
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Everything you need to streamline your development workflow and boost productivity
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl border border-secondary-200 hover:border-primary-300 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">{feature.title}</h3>
                  <p className="text-secondary-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-6">
                Why Choose SycnOps AI?
              </h2>
              <p className="text-xl text-secondary-600 mb-8">
                Join thousands of developers who have transformed their workflow with our intelligent automation platform.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-secondary-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-primary-100 mb-6">
                Start your free trial today and experience the future of developer workflow automation.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SycnOps AI</span>
            </div>
            <p className="text-secondary-400">
              © 2024 SycnOps AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
