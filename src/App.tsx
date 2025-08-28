import React, { useEffect , Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { useThemeStore } from '@/stores/theme'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import ErrorBoundary from '@/components/ErrorBoundary'
const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const GridTopology = lazy(() => import('@/pages/GridTopology'))
const Analytics = lazy(() => import('@/pages/Analytics'))
const Optimization = lazy(() => import('@/pages/Optimization'))
const AiMl = lazy(() => import('@/pages/AiMl'))
const AiAgents = lazy(() => import('@/pages/AiAgents'))
const Simulation = lazy(() => import('@/pages/Simulation'))
const Reports = lazy(() => import('@/pages/Reports'))
const Settings = lazy(() => import('@/pages/Settings'))
import { SecurityDashboard } from '@/components/security/SecurityDashboard'

function AppRoutes() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Login />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="grid-topology" element={<GridTopology />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="optimization" element={
          <ProtectedRoute requiredRole="operator">
            <Optimization />
          </ProtectedRoute>
        } />
        <Route path="ai-ml" element={
          <ProtectedRoute requiredRole="analyst">
            <AiMl />
          </ProtectedRoute>
        } />
        <Route path="ai-agents" element={
          <ProtectedRoute requiredRole="analyst">
            <AiAgents />
          </ProtectedRoute>
        } />
        <Route path="simulation" element={
          <ProtectedRoute requiredRole="operator">
            <Simulation />
          </ProtectedRoute>
        } />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="security" element={
          <ProtectedRoute requiredRole="admin">
            <SecurityDashboard />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    // Apply theme on mount
    const root = document.documentElement
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.toggle('dark', systemTheme === 'dark')
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App