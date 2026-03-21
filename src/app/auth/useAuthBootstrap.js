import { useEffect, useState } from 'react'

import {
    AUTH_SESSION_CHANGED_EVENT,
    clearAuthSession,
    getAuthSession,
    saveAuthSession,
} from '../../lib/storage'
import { meApi } from '../../features/users/api/meApi'

export function useAuthBootstrap() {
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

    return {
        session,
        user: session?.user || null,
        isBootstrapping,
    }
}