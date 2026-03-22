import { apiPost } from '../../../lib/api'
import { saveAuthSession } from '../../../lib/storage'
import { mapLoginErrorMessage } from '../lib/mapAuthErrorMessage'

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

export async function loginAction({ username, password }) {
  const res = await apiPost('/api/auth/login', { username, password })

  if (!res.ok) {
    // Important: keep messages generic to reduce account/user enumeration risk.  [oai_citation:2‡OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html?utm_source=chatgpt.com)
    return { ok: false, message: mapLoginErrorMessage(res.status) }
  }

  const token = pickToken(res.data)
  if (!token) {
    // Treat missing token as server-side failure.
    return { ok: false, message: 'Server is unavailable. Please try again.' }
  }

  // user will be bootstrapped via /api/me
  saveAuthSession({ token, user: null })

  return { ok: true, message: 'Login successful.' }
}