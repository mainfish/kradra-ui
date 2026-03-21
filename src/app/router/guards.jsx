import { Navigate } from 'react-router-dom'

import AppLayout from '../../components/Layout/AppLayout'

export function RequireAuth({ session, isBootstrapping, user, children }) {
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

export function RequireAdmin({ user, children }) {
    if (user?.role !== 'admin') return <Navigate to="/" replace />
    return children
}