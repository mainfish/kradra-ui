import { loginApi } from '../api/loginApi'
import { saveAuthSession, clearAuthSession } from '../../../lib/storage'

export async function loginAction({ username, password }) {
  try {
    const result = await loginApi({ username, password })

    if (!result.ok) {
      clearAuthSession()

      return {
        ok: false,
        message: result.data?.message || 'Login failed.',
        errorCode: result.status || 500,
        user: null,
        token: null,
      }
    }

    const session = {
      token: result.data?.token || null,
      user: result.data?.user || null,
    }

    saveAuthSession(session)

    return {
      ok: true,
      message: result.data?.message || 'Login successful.',
      errorCode: null,
      user: session.user,
      token: session.token,
    }
  } catch (error) {
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
