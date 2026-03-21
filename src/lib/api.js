import { APP_CONFIG } from './config'
import { getAuthSession } from './storage'

function buildUrl(path) {
  const base = (APP_CONFIG.apiBaseUrl || '').replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

async function parseJsonSafely(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function apiRequest(path, options = {}) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), APP_CONFIG.requestTimeoutMs)

  try {
    const session = getAuthSession()
    const token = session?.token

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(buildUrl(path), {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    })

    const data = await parseJsonSafely(response)

    return {
      ok: response.ok,
      status: response.status,
      data,
    }
  } catch (error) {
    if (error?.name === 'AbortError') {
      return { ok: false, status: 408, data: { message: 'Request timeout.' } }
    }
    return { ok: false, status: 0, data: { message: 'Network error. Unable to reach API.' } }
  } finally {
    window.clearTimeout(timeoutId)
  }
}