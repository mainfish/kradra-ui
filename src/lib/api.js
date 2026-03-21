import { APP_CONFIG } from './config'
import { clearAuthSession, getAuthSession } from './storage'

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

function normalizeErrorData(data, status) {
  // Backend обычно возвращает { error: { code, message } }
  if (data && typeof data === 'object') {
    if (data.error && typeof data.error === 'object') {
      const code = data.error.code || (status === 401 ? 'unauthorized' : 'error')
      const message = data.error.message || data.message || `HTTP ${status}`
      return { ...data, error: { ...data.error, code, message } }
    }

    if (typeof data.message === 'string') {
      return {
        ...data,
        error: {
          code: status === 401 ? 'unauthorized' : 'error',
          message: data.message,
        },
      }
    }

    return {
      ...data,
      error: {
        code: status === 401 ? 'unauthorized' : 'error',
        message: `HTTP ${status}`,
      },
    }
  }

  return {
    error: {
      code: status === 401 ? 'unauthorized' : 'error',
      message: `HTTP ${status}`,
    },
  }
}

export async function apiRequest(path, options = {}) {
  const controller = new AbortController()
  const timeoutMs = APP_CONFIG.requestTimeoutMs ?? 10000
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

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

    // ✅ Централизованно: любой 401 чистит сессию
    if (response.status === 401) {
      clearAuthSession()
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data: normalizeErrorData(data, response.status),
      }
    }

    return {
      ok: true,
      status: response.status,
      data,
    }
  } catch (error) {
    if (error?.name === 'AbortError') {
      return {
        ok: false,
        status: 408,
        data: {
          error: { code: 'timeout', message: 'Request timeout.' },
          message: 'Request timeout.',
        },
      }
    }

    return {
      ok: false,
      status: 0,
      data: {
        error: { code: 'network_error', message: 'Network error. Unable to reach API.' },
        message: 'Network error. Unable to reach API.',
      },
    }
  } finally {
    window.clearTimeout(timeoutId)
  }
}