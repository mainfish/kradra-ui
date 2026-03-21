import { registerApi } from '../api/registerApi'
import { loginAction } from './loginAction'

export async function registerAction({ username, password }) {
    const u = String(username || '').trim()
    const p = String(password || '')

    if (!u) return { ok: false, message: 'Username is required.' }
    if (p.length < 8) return { ok: false, message: 'Password must be at least 8 characters.' }

    const reg = await registerApi({ username: u, password: p })

    if (!reg.ok) {
        const msg = reg.data?.error?.message || reg.data?.message || 'Registration failed.'
        return { ok: false, message: msg, status: reg.status }
    }

    // ✅ Step 16: auto-login after successful registration
    const login = await loginAction({ username: u, password: p })

    if (!login.ok) {
        return {
            ok: false,
            message: login.message || 'Account created, but auto-login failed. Please log in manually.',
            status: login.errorCode || 500,
        }
    }

    return {
        ok: true,
        message: 'Registration successful. You are now signed in.',
        user: login.user || null,
        token: login.token || null,
    }
}