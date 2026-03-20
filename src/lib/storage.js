const AUTH_SESSION_KEY = 'kradra.auth.session'

export function saveAuthSession(session) {
  try {
    window.localStorage.setItem(
      AUTH_SESSION_KEY,
      JSON.stringify(session),
    )
  } catch (error) {
    console.error('Failed to save auth session', error)
  }
}

export function getAuthSession() {
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY)

    if (!raw) {
      return null
    }

    return JSON.parse(raw)
  } catch (error) {
    console.error('Failed to read auth session', error)
    return null
  }
}

export function clearAuthSession() {
  try {
    window.localStorage.removeItem(AUTH_SESSION_KEY)
  } catch (error) {
    console.error('Failed to clear auth session', error)
  }
}