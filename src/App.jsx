import { useEffect, useMemo } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import AuthLayout from './components/Layout/AuthLayout'
import AppLayout from './components/Layout/AppLayout'

import HomePage from './pages/HomePage'
import LandingPage from './pages/landing/LandingPage'
import RegisterPage from './pages/register/RegisterPage'
import ProfilePage from './pages/profile/ProfilePage'
import SettingsPage from './pages/settings/SettingsPage'
import AdminPanelPage from './pages/admin/AdminPanelPage'

import { LoginForm } from './features/auth'
import { useAuthBootstrap } from './app/auth/useAuthBootstrap'
import { RequireAdmin, RequireAuth } from './app/router/guards'

function RootLayout({ session, user, isBootstrapping }) {
  if (!session?.token) return <LandingPage />

  return (
    <RequireAuth session={session} user={user} isBootstrapping={isBootstrapping}>
      <AppLayout user={user}>
        <Outlet />
      </AppLayout>
    </RequireAuth>
  )
}

function AuthModalLayout({ onClose }) {
  return (
    <AuthLayout onRequestClose={onClose}>
      <Outlet />
    </AuthLayout>
  )
}

export default function App() {
  const { session, user, isBootstrapping } = useAuthBootstrap()

  const navigate = useNavigate()
  const location = useLocation()

  // После успешного логина показываем success на форме и через 1с уходим на /
  useEffect(() => {
    if (!session?.token) return
    if (location.pathname !== '/login') return

    const t = window.setTimeout(() => {
      navigate('/', { replace: true })
    }, 1000)

    return () => window.clearTimeout(t)
  }, [session?.token, location.pathname, navigate])

  const homeElement = useMemo(() => <HomePage user={user} />, [user])
  const profileElement = useMemo(() => <ProfilePage user={user} />, [user])
  const adminElement = useMemo(
    () => (
      <RequireAdmin user={user}>
        <AdminPanelPage user={user} />
      </RequireAdmin>
    ),
    [user]
  )

  return (
    <Routes>
      <Route
        path="/"
        element={<RootLayout session={session} user={user} isBootstrapping={isBootstrapping} />}
      >
        <Route index element={homeElement} />
        <Route path="profile" element={profileElement} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="admin" element={adminElement} />
      </Route>

      <Route element={<AuthModalLayout onClose={() => navigate('/')} />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}