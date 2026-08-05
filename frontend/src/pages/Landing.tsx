import { Link } from 'react-router-dom'
import { Bot, GitBranch, BarChart3, Zap, Shield, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  { icon: GitBranch, title: 'GitHub Integration', description: 'Monitor repositories, pull requests, commits, and issues in real-time.' },
  { icon: BarChart3, title: 'Advanced Analytics', description: 'Comprehensive insights into development workflow with detailed metrics.' },
  { icon: Bot, title: 'AI-Powered Features', description: 'Automatic summaries, documentation generation, and intelligent code recommendations.' },
  { icon: Zap, title: 'Workflow Automation', description: 'Automate repetitive tasks and streamline your development process.' },
  { icon: Shield, title: 'Secure & Reliable', description: 'Enterprise-grade security with encrypted data storage and reliable performance.' },
  { icon: Users, title: 'Team Collaboration', description: 'Enhance team productivity with shared insights and notifications.' }
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
              <Link to="/login" className="text-secondary-600 hover:text-primary-600 transition-colors">Login</Link>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-6xl font-bold text-secondary-900 mb-6">
            Automate Your Workflow with <span className="text-primary-600">SycnOps AI</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            Powered by TypeScript, Vite, Tailwind CSS, TanStack React Query & Shadcn UI.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/register">Start Free Trial <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="p-6 rounded-xl border hover:border-primary-300 transition-colors">
                <Icon className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-secondary-600 text-sm">{f.description}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
