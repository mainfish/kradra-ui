import { apiRequest } from '../../../lib/api'

export async function loginApi({ username, password }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: {
      username: String(username || '').trim(),
      password: String(password || ''),
    },
  })
}
