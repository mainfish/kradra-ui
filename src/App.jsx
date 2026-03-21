import { useEffect, useMemo, useState } from 'react'
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import AuthLayout from './components/Layout/AuthLayout'
import AppLayout from './components/Layout/AppLayout'
import HomePage from './pages/HomePage'

import { LoginForm } from './features/auth'
import {
  AUTH_SESSION_CHANGED_EVENT,
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from './lib/storage'
import { meApi } from './features/users/api/meApi'

import LandingPage from './pages/landing/LandingPage'
import RegisterPage from './pages/register/RegisterPage'
import ProfilePage from './pages/profile/ProfilePage'
import SettingsPage from './pages/settings/SettingsPage'
import AdminPanelPage from './pages/admin/AdminPanelPage'

function RequireAuth({ session, isBootstrapping, user, children }) {
  if (!session?.token) return <Navigate to="/" replace />

  if (!user && isBootstrapping) {
    return (
      <AppLayout user={{ username: 'Loading...', role: '' }}>
        <div className="text-white/70">Loading profile…</div>
      </AppLayout>
    )
  }

  if (!user) {
    return (
      <AppLayout user={{ username: 'Unknown', role: '' }}>
        <div className="text-white/70">Signed in, but user profile is not available.</div>
      </AppLayout>
    )
  }

  return children
}

function RequireAdmin({ user, children }) {
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function RootLayout({ session, user, isBootstrapping }) {
  if (!session?.token) {
    return <LandingPage />
  }

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
  const [session, setSession] = useState(() => getAuthSession())
  const [isBootstrapping, setIsBootstrapping] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  // слушаем изменения сессии (после логина/логаута)
  useEffect(() => {
    const handler = () => setSession(getAuthSession())
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handler)
    return () => window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handler)
  }, [])

  // bootstrap: если токен есть, а user нет — подтянуть /api/me
  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!session?.token) return
      if (session?.user) return

      setIsBootstrapping(true)
      const me = await meApi()

      if (cancelled) return

      if (me.ok && me.data?.user) {
        saveAuthSession({ token: session.token, user: me.data.user })
        setSession(getAuthSession())
      } else if (me.status === 401) {
        clearAuthSession()
        setSession(null)
      }

      setIsBootstrapping(false)
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [session?.token, session?.user])

  // ✅ редирект после логина с задержкой 1 сек, чтобы успело показаться “Login successful.”
  // Важно: layout-компоненты вынесены наружу, чтобы форма логина не перемонтировалась
  // и не теряла локальный state с success-сообщением (React сохраняет state по позиции и типу компонента).
  useEffect(() => {
    if (!session?.token) return
    if (location.pathname !== '/login') return

    const t = window.setTimeout(() => {
      navigate('/', { replace: true })
    }, 1000)

    return () => window.clearTimeout(t)
  }, [session?.token, location.pathname, navigate])

  const user = session?.user || null

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