import { useEffect, useMemo, useRef } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import AuthLayout from '../../components/Layout/AuthLayout'
import AppLayout from '../../components/Layout/AppLayout'

import HomePage from '../../pages/HomePage'
import LandingPage from '../../pages/landing/LandingPage'
import ProfilePage from '../../pages/profile/ProfilePage'
import SettingsPage from '../../pages/settings/SettingsPage'
import AdminPanelPage from '../../pages/admin/AdminPanelPage'

import { LoginForm, RegisterForm } from '../../features/auth'
import { RequireAdmin, RequireAuth } from './guards'
import { useAuth } from '../auth/AuthProvider'

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

function AuthModalLayout({ onRequestClose }) {
    return (
        <AuthLayout onRequestClose={onRequestClose}>
            <Outlet />
        </AuthLayout>
    )
}

export default function AppRoutes() {
    const { session, user, isBootstrapping } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const isAuthModalRoute = location.pathname === '/login' || location.pathname === '/register'

    // ✅ 1) синхронно читаем backgroundLocation из state (на первом рендере!)
    const bgFromState = location.state?.backgroundLocation || null

    // ✅ 2) и держим его в ref, чтобы при переключении /login <-> /register фон не терялся
    const backgroundRef = useRef(bgFromState)

    // ✅ 3) если модалка открылась и ref пустой, заполняем его синхронно
    if (isAuthModalRoute && bgFromState && !backgroundRef.current) {
        backgroundRef.current = bgFromState
    }

    // ✅ 4) когда вышли из модалок — сбрасываем фон
    useEffect(() => {
        if (!isAuthModalRoute) backgroundRef.current = null
    }, [isAuthModalRoute])

    const backgroundLocation = backgroundRef.current

    function closeAuthModal() {
        // Закрываем строго на backgroundLocation, а не navigate(-1),
        // иначе “закрыть” может переключать /login <-> /register.
        if (backgroundLocation) {
            navigate(backgroundLocation, { replace: true })
        } else {
            navigate('/', { replace: true })
        }
    }

    // После успешного логина показываем success на форме и через 1с уходим на /
    useEffect(() => {
        if (!session?.token) return
        if (location.pathname !== '/login') return

        const t = window.setTimeout(() => {
            navigate('/', { replace: true })
        }, 800)

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
        <>
            {/* Основные роуты: если есть backgroundLocation — рендерим фон под модалкой */}
            <Routes location={backgroundLocation || location}>
                <Route
                    path="/"
                    element={<RootLayout session={session} user={user} isBootstrapping={isBootstrapping} />}
                >
                    <Route index element={homeElement} />
                    <Route path="profile" element={profileElement} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="admin" element={adminElement} />
                </Route>

                {/* Deep link: если открыть /login напрямую, будет как “страница” */}
                <Route element={<AuthModalLayout onRequestClose={closeAuthModal} />}>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Если есть backgroundLocation — рендерим модалки вторым слоем поверх */}
            {backgroundLocation ? (
                <Routes>
                    <Route element={<AuthModalLayout onRequestClose={closeAuthModal} />}>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                    </Route>
                </Routes>
            ) : null}
        </>
    )
}