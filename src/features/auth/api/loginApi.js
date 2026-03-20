import { apiRequest } from '../../../lib/api'

export async function loginApi({ username, password }) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: {
      username: String(username || '').trim(),
      password: String(password || ''),
    },
  })
}
