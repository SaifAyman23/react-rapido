export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Rapido'

/** Origin of the Django API, without a trailing slash. */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(
  /\/+$/,
  ''
)

/** Everything the app talks to lives under `/api/v1`. */
export const API_V1_ROOT = API_BASE_URL.endsWith('/api/v1')
  ? API_BASE_URL
  : `${API_BASE_URL}/api/v1`

/** Accounts are mounted here by `project/urls.py`. */
export const AUTH_ROOT = '/auth'

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
  LINKEDIN: 'linkedin',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_OTP: '/verify-otp',
  RESET_PASSWORD: '/reset-password',
} as const

export const CONTACT = {
  email: import.meta.env.VITE_CONTACT_EMAIL || '',
  github: import.meta.env.VITE_GITHUB_URL || '',
  linkedin: import.meta.env.VITE_LINKEDIN_URL || '',
} as const
