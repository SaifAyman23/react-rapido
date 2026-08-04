import { axiosInstance } from '@/api/axiosInstance'

export const authEndpoints = {
  login: '/accounts/login/',
  register: '/accounts/users/register/',
  verify: '/accounts/users/verify/',
  sendCode: '/accounts/users/send-verification-code/',
  resetPassword: '/accounts/users/reset-password/',
  verifyOnboarding: '/accounts/users/verify-onboarding-token/',
  logout: '/accounts/users/logout/',
  me: '/accounts/users/me/',
}

export type OTPurpose = 'email_verification' | 'password_reset'

export interface VerifyOTPResponse {
  onboarding_token?: string
  token?: string
  message?: string
  verified?: boolean
}

export interface SendCodeResponse {
  message: string
  code_sent?: boolean
}

export const authApi = {
  login: (data: { email: string; password: string }) =>
    axiosInstance.post<{ token: string; message: string }>(authEndpoints.login, data),

  register: (data: {
    email: string
    username: string
    password: string
    password_confirm: string
  }) => axiosInstance.post<{ message: string }>(authEndpoints.register, data),

  verify: (data: { code: string; email?: string; purpose?: OTPurpose }) =>
    axiosInstance.post<VerifyOTPResponse>(authEndpoints.verify, data),

  sendCode: (data: { email: string; type: OTPurpose }) =>
    axiosInstance.post<SendCodeResponse>(authEndpoints.sendCode, data),

  resetPassword: (data: { token: string; password: string; password_confirm: string }) =>
    axiosInstance.post<{ message: string }>(authEndpoints.resetPassword, data),

  verifyOnboarding: (data: { token: string }) =>
    axiosInstance.post<{ message: string }>(authEndpoints.verifyOnboarding, data),

  logout: () => axiosInstance.post<{ message: string }>(authEndpoints.logout),
}
