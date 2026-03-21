import { apiPost } from '../../lib/api'
import { clearAuthSession } from '../../lib/storage'

function getCookie(name) {
    const raw = typeof document !== 'undefined' ? document.cookie : ''
    if (!raw) return null

    for (const part of raw.split(';')) {
        const trimmed = part.trim()
        if (!trimmed) continue
        const eq = trimmed.indexOf('=')
        if (eq === -1) continue
        const k = trimmed.slice(0, eq).trim()
        if (k !== name) continue
        return decodeURIComponent(trimmed.slice(eq + 1).trim())
    }
    return null
}

export async function logout() {
    try {
        // Backend expects csrf_token cookie + x-csrf-token header for web requests.  [oai_citation:5‡GitHub](https://raw.githubusercontent.com/mainfish/kradra-backend/master/kradra-api/src/http/cookies/csrf.rs)
        const csrf = getCookie('csrf_token')

        // Even if csrf is missing, still try (server will reject, but we still clear local session).
        await apiPost(
            '/api/auth/logout',
            {}, // body can be empty; refresh token is resolved from cookie or body.  [oai_citation:6‡GitHub](https://raw.githubusercontent.com/mainfish/kradra-backend/master/kradra-api/src/http/cookies/refresh.rs)
            csrf
                ? {
                    headers: {
                        'x-csrf-token': csrf,
                    },
                }
                : undefined
        )
    } catch {
        // ignore
    } finally {
        // Always clear local session
        clearAuthSession()
    }
}