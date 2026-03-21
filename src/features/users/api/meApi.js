import { apiGet } from '../../../lib/api'

export async function meApi() {
    return apiGet('/api/me')
}