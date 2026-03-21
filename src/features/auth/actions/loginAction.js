import { loginApi } from '../api/loginApi'
import { meApi } from '../../users/api/meApi'
import { saveAuthSession, clearAuthSession } from '../../../lib/storage'

export async function loginAction({ username, password }) {
  try {
    const result = await loginApi({ username, password })

    if (!result.ok) {
      clearAuthSession()
      return {
        ok: false,
        message: result.data?.error?.message || result.data?.message || 'Login failed.',
        errorCode: result.status || 500,
        user: null,
        token: null,
      }
    }

    const token = result.data?.access_token || null
    if (!token) {
      clearAuthSession()
      return {
        ok: false,
        message: 'Login response did not include access_token.',
        errorCode: 500,
        user: null,
        token: null,
      }
    }

    saveAuthSession({ token, user: null })

    const me = await meApi()

    if (me.ok && me.data?.user) {
      saveAuthSession({ token, user: me.data.user })
      return {
        ok: true,
        message: 'Login successful.',
        errorCode: null,
        user: me.data.user,
        token,
      }
    }

    saveAuthSession({ token, user: null })
    return {
      ok: true,
      message: 'Login successful (user not loaded).',
      errorCode: null,
      user: null,
      token,
    }
  } catch {
    clearAuthSession()
    return {
      ok: false,
      message: 'Unexpected error. Please try again.',
      errorCode: 500,
      user: null,
      token: null,
    }
  }
}
