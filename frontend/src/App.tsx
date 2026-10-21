import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Repositories from './pages/Repositories'
import RepoDetail from './pages/RepoDetail'
import RepoAnalysis from './pages/RepoAnalysis'
import PullRequests from './pages/PullRequests'
import Issues from './pages/Issues'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import MainLayout from './components/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'

function Guard({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
        <Route path="/repositories" element={<Guard><Repositories /></Guard>} />
        <Route path="/repositories/:repoId" element={<Guard><RepoDetail /></Guard>} />
        <Route path="/repositories/:repoId/analysis" element={<Guard><RepoAnalysis /></Guard>} />
        <Route path="/pull-requests" element={<Guard><PullRequests /></Guard>} />
        <Route path="/issues" element={<Guard><Issues /></Guard>} />
        <Route path="/analytics" element={<Guard><Analytics /></Guard>} />
        <Route path="/profile" element={<Guard><Profile /></Guard>} />
      </Routes>
    </BrowserRouter>
  )
}
