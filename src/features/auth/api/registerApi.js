import { apiPost } from '../../../lib/api'

export async function registerApi({ username, password }) {
    return apiPost('/api/auth/register', { username, password })
}