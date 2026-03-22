import { useEffect, useMemo } from 'react'
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
import { useModalBackgroundLocation } from './useModalBackgroundLocation'
import { AUTH_REDIRECT_DELAY_MS, ROUTES, isAuthModalPath } from './constants'

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

    const isAuthModalRoute = isAuthModalPath(location.pathname)
    const backgroundLocation = useModalBackgroundLocation(isAuthModalRoute)

    function closeAuthModal() {
        // Close to background, not navigate(-1), to avoid toggling between /login and /register
        if (backgroundLocation) navigate(backgroundLocation, { replace: true })
        else navigate(ROUTES.ROOT, { replace: true })
    }

    // After successful login show success on form, then go to /
    useEffect(() => {
        if (!session?.token) return
        if (location.pathname !== ROUTES.LOGIN) return

        const t = window.setTimeout(() => {
            navigate(ROUTES.ROOT, { replace: true })
        }, AUTH_REDIRECT_DELAY_MS)

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
        <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#05070b]">
            <StarfieldBackground />

            <div className="relative z-10">
                {/* Main routes render with backgroundLocation if modal opened contextually */}
                <Routes location={backgroundLocation || location}>
                    <Route path={ROUTES.ROOT} element={<RootLayout session={session} user={user} isBootstrapping={isBootstrapping} />}>
                        <Route index element={homeElement} />
                        <Route path={ROUTES.PROFILE.slice(1)} element={profileElement} />
                        <Route path={ROUTES.SETTINGS.slice(1)} element={<SettingsPage />} />
                        <Route path={ROUTES.ADMIN.slice(1)} element={adminElement} />
                    </Route>

                    {/* Deep link: /login opened directly => renders as a page */}
                    <Route element={<AuthModalLayout onRequestClose={closeAuthModal} />}>
                        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
                        <Route path={ROUTES.REGISTER} element={<RegisterForm />} />
                    </Route>

                    <Route path="*" element={<Navigate to={ROUTES.ROOT} replace />} />
                </Routes>

                {/* If there is a background and the current route is an auth modal, render auth routes again as true overlays */}
                {backgroundLocation && isAuthModalRoute ? (
                    <Routes>
                        <Route element={<AuthModalLayout onRequestClose={closeAuthModal} />}>
                            <Route path={ROUTES.LOGIN} element={<LoginForm />} />
                            <Route path={ROUTES.REGISTER} element={<RegisterForm />} />
                        </Route>
                    </Routes>
                ) : null}
            </div>
        </div>
    )
}