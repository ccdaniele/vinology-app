const API_HOST = process.env.REACT_APP_API_ENDPOINT || '127.0.0.1'
const API_PORT = process.env.REACT_APP_API_PORT || '3000'

export const API_BASE = `http://${API_HOST}:${API_PORT}/api/v1`

export function authHeaders(extra = {}) {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

export function apiFetch(path, options = {}) {
  const { headers, ...rest } = options
  return fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      ...authHeaders(),
      ...headers,
    },
  })
}
