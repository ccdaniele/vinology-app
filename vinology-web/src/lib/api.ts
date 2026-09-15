import { clearToken, getToken } from './auth'
import type { ApiErrorBody, AuthResponse, Car, Query, User, VinLookupReport } from './types'

function apiBase() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://127.0.0.1:3000/api/v1'
  )
}

export class ApiError extends Error {
  status: number
  body: ApiErrorBody

  constructor(status: number, body: ApiErrorBody) {
    const detail = Array.isArray(body.error)
      ? body.error.join(', ')
      : body.error || body.message || `Request failed (${status})`
    super(detail)
    this.status = status
    this.body = body
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (auth) {
    const token = getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${apiBase()}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  const data = text ? (JSON.parse(text) as T | ApiErrorBody) : {}

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearToken()
    }
    throw new ApiError(response.status, data as ApiErrorBody)
  }

  return data as T
}

export const api = {
  register(input: {
    username: string
    email: string
    password: string
    name?: string
  }) {
    return request<AuthResponse>(
      '/users',
      { method: 'POST', body: JSON.stringify({ user: input }) },
      false
    )
  },

  login(username: string, password: string) {
    return request<AuthResponse>(
      '/login',
      {
        method: 'POST',
        body: JSON.stringify({ user: { username, password } }),
      },
      false
    )
  },

  currentUser() {
    return request<User>('/current_user')
  },

  listQueries() {
    return request<Query[]>('/queries')
  },

  createQuery(name: string) {
    return request<Query>('/queries', {
      method: 'POST',
      body: JSON.stringify({ query: { name } }),
    })
  },

  updateQuery(id: number, name: string) {
    return request<Query>(`/queries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ query: { name } }),
    })
  },

  deleteQuery(id: number) {
    return request<void>(`/queries/${id}`, { method: 'DELETE' })
  },

  getCar(id: number) {
    return request<Car>(`/cars/${id}`)
  },

  createCar(payload: Partial<Car> & { query_id: number; vin_number: string; report_payload?: VinLookupReport }) {
    return request<Car>('/cars', {
      method: 'POST',
      body: JSON.stringify({ car: payload }),
    })
  },

  deleteCar(id: number) {
    return request<void>(`/cars/${id}`, { method: 'DELETE' })
  },

  lookupVin(vin: string) {
    return request<VinLookupReport>('/vin_lookups', {
      method: 'POST',
      body: JSON.stringify({ vin }),
    })
  },
}
