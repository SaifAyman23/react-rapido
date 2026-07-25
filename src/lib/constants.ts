export const APP_NAME = import.meta.env.VITE_APP_NAME || 'React Rapido V1.0'
export const API_BASE_URL = import.meta.env.VITE_API_URL || ''

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
