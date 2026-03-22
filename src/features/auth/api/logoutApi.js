import { apiPost } from '../../../lib/api'

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

export async function logoutApi() {
    const csrf = getCookie('csrf_token')

    // Backend requires x-csrf-token header for web requests (when Origin exists).
    // If csrf is missing, we still try; server may reject, but local session will be cleared by action.
    return apiPost(
        '/api/auth/logout',
        {},
        csrf
            ? {
                headers: {
                    'x-csrf-token': csrf,
                },
            }
            : undefined
    )
}