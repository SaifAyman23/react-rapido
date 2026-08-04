import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

let authToken: string | null = localStorage.getItem('auth_token')

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const setAuthToken = (token: string | null) => {
  authToken = token
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

export const getAuthToken = () => authToken

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (authToken && config.headers) {
      config.headers.Authorization = `Token ${authToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null)
      window.location.href = '/login'
    }

    const data = error.response?.data
    const errorObj = data?.error
    return Promise.reject({
      code: errorObj?.code || 'unknown',
      message: errorObj?.message || data?.message || error.message,
      details: errorObj?.details || null,
      detail: data?.detail || null,
      status: error.response?.status || 0,
    })
  }
)

interface ApiError {
  detail?: string
  message?: string
  details?: Record<string, unknown> | unknown
}

const extractErrorMessage = (err: unknown, fallback = 'An unexpected error occurred.'): string => {
  const error = err as ApiError | null | undefined
  if (!error) return fallback

  if (error.detail) return error.detail

  if (error.message && !error.message.startsWith('Request failed with')) {
    return error.message
  }

  const details = error.details
  if (details && typeof details === 'object' && !Array.isArray(details)) {
    const values = Object.values(details)
    if (values.length > 0) {
      const first = values[0]
      if (Array.isArray(first)) return first[0] as string
      if (typeof first === 'string') return first
      return String(first)
    }
  }

  return error.message || fallback
}

export { axiosInstance, API_BASE_URL, extractErrorMessage }
