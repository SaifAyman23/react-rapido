import { useMutation, useQuery } from '@tanstack/react-query'

import type { OTPurpose, VerifyOTPResponse } from '@/api/accounts/endpoints'
import { authApi } from '@/api/accounts/endpoints'
import { registerApi, type RegisterRequest } from '@/api/accounts/registerApi'
import { setAuthToken } from '@/api/axiosInstance'
import { useAuthStore } from '@/store'

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser)
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      registerApi.login(data).then((res) => res.data),
    onSuccess: (data) => {
      setAuthToken(data.token)
      setUser({ id: '', name: '', email: '' })
    },
  })
}

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterRequest) => registerApi.register(data).then((res) => res.data),
  })

export const useVerifyOTP = () =>
  useMutation({
    mutationFn: (data: { code: string; email?: string; purpose?: OTPurpose }) =>
      authApi.verify(data).then((res) => res.data) as Promise<VerifyOTPResponse>,
    onSuccess: (data) => {
      if (data.onboarding_token) {
        localStorage.setItem('onboarding_token', data.onboarding_token)
      }
    },
  })

export const useSendVerificationCode = () =>
  useMutation({
    mutationFn: (data: { email: string; type: OTPurpose }) =>
      authApi.sendCode(data).then((res) => res.data),
  })

export const useResetPassword = () =>
  useMutation({
    mutationFn: (data: { token: string; password: string; password_confirm: string }) =>
      authApi.resetPassword(data).then((res) => res.data),
  })

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout)
  return useMutation({
    mutationFn: () => registerApi.logout().then((res) => res.data),
    onSuccess: () => {
      setAuthToken(null)
      localStorage.removeItem('onboarding_token')
      logout()
    },
  })
}

export const useAuthCurrentUser = () =>
  useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: () => registerApi.getCurrentUser().then((res) => res.data),
  })

export const useRegisterWithZustand = () => {
  const { setLoading, setError } = useAuthStore()
  return useMutation({
    mutationFn: (data: RegisterRequest) => registerApi.register(data).then((res) => res.data),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      setLoading(false)
    },
    onError: (error) => {
      setError(error.message)
    },
  })
}
