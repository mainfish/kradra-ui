import { registerApi } from '../api/registerApi'
import { loginAction } from './loginAction'
import { mapRegisterErrorMessage } from '../lib/mapAuthErrorMessage'

export async function registerAction({ username, password }) {
    const u = String(username || '').trim()
    const p = String(password || '')

    if (!u) return { ok: false, message: 'Username is required.' }
    if (p.length < 8) return { ok: false, message: 'Password must be at least 8 characters.' }

    const reg = await registerApi({ username: u, password: p })

    if (!reg.ok) {
        return { ok: false, message: mapRegisterErrorMessage(reg.status), status: reg.status }
    }

    // Auto-login after successful registration
    const login = await loginAction({ username: u, password: p })
    if (!login.ok) {
        return {
            ok: false,
            message: 'Account created, but auto-login failed. Please log in manually.',
        }
    }

    return {
        ok: true,
        message: 'Registration successful. You are now signed in.',
    }
}