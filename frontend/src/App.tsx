import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Repositories from './pages/Repositories'
import PullRequests from './pages/PullRequests'
import Issues from './pages/Issues'
import Analytics from './pages/Analytics'
import AIAssistant from './pages/AIAssistant'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import AuthCallback from './pages/AuthCallback'
import MainLayout from './components/MainLayout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/google/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/repositories" element={<MainLayout><Repositories /></MainLayout>} />
        <Route path="/pull-requests" element={<MainLayout><PullRequests /></MainLayout>} />
        <Route path="/issues" element={<MainLayout><Issues /></MainLayout>} />
        <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
        <Route path="/ai-assistant" element={<MainLayout><AIAssistant /></MainLayout>} />
        <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

