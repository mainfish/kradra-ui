import { useEffect, useMemo, useRef } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import StarfieldBackground from '../../components/Background/StarfieldBackground'
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

    // Read backgroundLocation synchronously on first render
    const bgFromState = location.state?.backgroundLocation || null

    // Persist background so switching /login <-> /register doesn't lose it
    const backgroundRef = useRef(bgFromState)

    if (isAuthModalRoute && bgFromState && !backgroundRef.current) {
        backgroundRef.current = bgFromState
    }

    useEffect(() => {
        if (!isAuthModalRoute) backgroundRef.current = null
    }, [isAuthModalRoute])

    const backgroundLocation = backgroundRef.current

    function closeAuthModal() {
        // Close to the background location (NOT navigate(-1))
        if (backgroundLocation) {
            navigate(backgroundLocation, { replace: true })
        } else {
            navigate('/', { replace: true })
        }
    }

    // After successful login show success on form, then go to /
    useEffect(() => {
        if (!session?.token) return
        if (location.pathname !== '/login') return

        const t = window.setTimeout(() => {
            navigate('/', { replace: true })
        }, 500)

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
        // ✅ Keep the background mounted across logout/login so the page doesn't "restart"
        <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#05070b]">
            <StarfieldBackground />

            <div className="relative z-10">
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

                    {/* Deep link: /login opened directly => renders as a page */}
                    <Route element={<AuthModalLayout onRequestClose={closeAuthModal} />}>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {/* If there's a background, render auth routes again as a true overlay */}
                {backgroundLocation ? (
                    <Routes>
                        <Route element={<AuthModalLayout onRequestClose={closeAuthModal} />}>
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<RegisterForm />} />
                        </Route>
                    </Routes>
                ) : null}
            </div>
        </div>
    )
}