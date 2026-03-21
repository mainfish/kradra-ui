import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import AuthLayout from './components/Layout/AuthLayout'
import AppLayout from './components/Layout/AppLayout'
import StarfieldBackground from './components/Background/StarfieldBackground'
import HomePage from './pages/HomePage'

import { LoginForm } from './features/auth'
import {
  AUTH_SESSION_CHANGED_EVENT,
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from './lib/storage'
import { meApi } from './features/users/api/meApi'

function ProfilePage({ user }) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Profile</h1>
      <p className="text-white/60">Placeholder page.</p>
      <pre className="text-white/70 text-sm whitespace-pre-wrap">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
      <p className="text-white/60">Placeholder page.</p>
    </div>
  )
}

function AdminPanelPage({ user }) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Admin panel</h1>
      <p className="text-white/60">Placeholder page.</p>
      <div className="text-white/70 text-sm">Role: {user?.role}</div>
    </div>
  )
}

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

function PublicLanding() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#05070b]">
      <StarfieldBackground />

      <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-md transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          Register
        </button>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-10">
        <div className="rounded-2xl border border-white/10 bg-slate-950/56 p-10 shadow-2xl backdrop-blur-md">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Kradra Portal</h1>
          <p className="mt-3 max-w-xl text-white/60">
            Welcome. Please log in or create an account to continue.
          </p>
        </div>
      </div>
    </div>
  )
}

function RegisterFormPlaceholder() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Create account</h1>
        <p className="mt-2 text-sm text-white/60">
          Registration UI placeholder. Backend wiring next.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          alert('Registration is not wired yet.')
        }}
      >
        <div className="space-y-2">
          <label className="text-sm text-white/70">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20 focus:ring-2 focus:ring-white/10"
            placeholder="username"
            autoComplete="username"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/70">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20 focus:ring-2 focus:ring-white/10"
            placeholder="password"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90"
        >
          Register
        </button>
      </form>

      <div className="text-center text-sm text-white/60">
        Already have an account?{' '}
        <button
          type="button"
          className="text-white underline underline-offset-4"
          onClick={() => navigate('/login')}
        >
          Log in
        </button>
      </div>
    </div>
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

  // ✅ ВАЖНО: редирект после логина С ЗАДЕРЖКОЙ 1 секунда,
  // чтобы успело показаться "Login successful." на форме.
  useEffect(() => {
    if (!session?.token) return
    if (location.pathname !== '/login') return

    const t = window.setTimeout(() => {
      navigate('/', { replace: true })
    }, 1000)

    return () => window.clearTimeout(t)
  }, [session?.token, location.pathname, navigate])

  const user = session?.user || null

  const rootElement = useMemo(() => {
    if (!session?.token) return <PublicLanding />

    return (
      <RequireAuth session={session} user={user} isBootstrapping={isBootstrapping}>
        <AppLayout user={user}>
          <HomePage user={user} />
        </AppLayout>
      </RequireAuth>
    )
  }, [session, user, isBootstrapping])

  return (
    <Routes>
      <Route path="/" element={rootElement} />

      <Route
        path="/login"
        element={
          <AuthLayout onRequestClose={() => navigate('/')}>
            <LoginForm />
          </AuthLayout>
        }
      />

      <Route
        path="/register"
        element={
          <AuthLayout onRequestClose={() => navigate('/')}>
            <RegisterFormPlaceholder />
          </AuthLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <RequireAuth session={session} user={user} isBootstrapping={isBootstrapping}>
            <AppLayout user={user}>
              <ProfilePage user={user} />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/settings"
        element={
          <RequireAuth session={session} user={user} isBootstrapping={isBootstrapping}>
            <AppLayout user={user}>
              <SettingsPage />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/admin"
        element={
          <RequireAuth session={session} user={user} isBootstrapping={isBootstrapping}>
            <RequireAdmin user={user}>
              <AppLayout user={user}>
                <AdminPanelPage user={user} />
              </AppLayout>
            </RequireAdmin>
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}