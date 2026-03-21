import { apiRequest } from '../../../lib/api'

export async function meApi() {
  return apiRequest('/api/me')
}
