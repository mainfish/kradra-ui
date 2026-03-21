import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import {
    AUTH_SESSION_CHANGED_EVENT,
    clearAuthSession,
    getAuthSession,
    saveAuthSession,
} from '../../lib/storage'
import { meApi } from '../../features/users/api/meApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [session, setSession] = useState(() => getAuthSession())
    const [isBootstrapping, setIsBootstrapping] = useState(false)

    // Подписка на изменения session (login/logout)
    useEffect(() => {
        const handler = () => setSession(getAuthSession())
        window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handler)
        return () => window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handler)
    }, [])

    // Bootstrap: если токен есть, но user ещё не загружен — дергаем /api/me
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

    const value = useMemo(
        () => ({
            session,
            user: session?.user || null,
            isBootstrapping,
            isAuthed: Boolean(session?.token),
        }),
        [session, isBootstrapping]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth() must be used inside <AuthProvider>')
    }
    return ctx
}