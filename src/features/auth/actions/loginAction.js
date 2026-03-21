import { apiPost } from '../../../lib/api'
import { saveAuthSession } from '../../../lib/storage'

function pickToken(data) {
  return (
    data?.token ||
    data?.access_token ||
    data?.accessToken ||
    data?.data?.token ||
    data?.data?.access_token ||
    null
  )
}

function mapLoginErrorMessage(status) {
  // User request:
  // NotFound, BadRequest, Conflict => Incorrect login or password
  if (status === 400 || status === 404 || status === 409) {
    return 'Incorrect login or password.'
  }

  // Network / timeout / server down
  if (status === 0 || status === 408 || status >= 500) {
    return 'Server is unavailable. Please try again.'
  }

  return 'Login failed. Please try again.'
}

export async function loginAction({ username, password }) {
  const res = await apiPost('/api/auth/login', { username, password })

  if (!res.ok) {
    // We intentionally do not surface backend messages for these statuses
    // to avoid user/account enumeration and keep UX consistent.  [oai_citation:2‡OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html?utm_source=chatgpt.com)
    return { ok: false, message: mapLoginErrorMessage(res.status) }
  }

  const token = pickToken(res.data)
  if (!token) {
    return { ok: false, message: 'Server is unavailable. Please try again.' }
  }

  // user подтянется bootstrap-ом через /api/me
  saveAuthSession({ token, user: null })

  return { ok: true, message: 'Login successful.' }
}