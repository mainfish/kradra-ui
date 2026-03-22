import { clearAuthSession } from '../../../lib/storage'
import { logoutApi } from '../api/logoutApi'

export async function logoutAction() {
    try {
        await logoutApi()
    } catch {
        // ignore (best-effort)
    } finally {
        // Always clear local session no matter what.
        clearAuthSession()
    }

    return { ok: true }
}