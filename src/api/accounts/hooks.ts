import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { authApi } from '@/api/accounts/endpoints'
import type {
  AccountSummary,
  AddAccountLoginRequest,
  AddAccountRequest,
  AddAccountResendRequest,
  AddAccountVerifyRequest,
  AppleSocialLoginRequest,
  AuthResponse,
  FacebookSocialLoginRequest,
  GoogleSocialLoginRequest,
  LoginRequest,
  MeResponse,
  PasswordChangeRequest,
  PasswordResetConfirmRequest,
  PasswordResetRequest,
  RegisterRequest,
  ResendVerificationRequest,
  UserSummary,
  VerifyEmailRequest,
} from '@/api/contracts'
import { extractErrorMessage } from '@/api/errors'
import { saveAuthSession } from '@/api/session'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/store/auth/authStore'
import type { User, UserRole } from '@/types'

/** Map the wire payload onto the shape screens render. */
export function toUser(source: { user: UserSummary; account: AccountSummary | null }): User {
  const { user, account } = source
  const role: UserRole | undefined = account?.role ?? user.role ?? undefined
  return {
    id: user.id,
    name: account?.full_name || user.email,
    email: account?.email || user.email,
    role,
    avatar: account?.avatar_url ?? undefined,
  }
}

export const useLogin = () => {
  const client = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const setError = useAuthStore((s) => s.setError)

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await authApi.login(data)
      saveAuthSession(res)
      return res
    },
    onSuccess: (res) => {
      setUser(toUser(res))
      client.removeQueries({ queryKey: queryKeys.auth.me })
    },
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useRegister = () => {
  const setError = useAuthStore((s) => s.setError)
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useVerifyEmail = () => {
  const client = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const setError = useAuthStore((s) => s.setError)

  return useMutation({
    mutationFn: async (data: VerifyEmailRequest) => {
      const res = await authApi.verifyEmail(data)
      saveAuthSession(res)
      return res
    },
    onSuccess: (res) => {
      setUser(toUser(res))
      client.removeQueries({ queryKey: queryKeys.auth.me })
    },
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useResendVerification = () => {
  const setError = useAuthStore((s) => s.setError)
  return useMutation({
    mutationFn: (data: ResendVerificationRequest) => authApi.resendVerification(data),
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useRequestPasswordReset = () => {
  const setError = useAuthStore((s) => s.setError)
  return useMutation({
    mutationFn: (data: PasswordResetRequest) => authApi.requestPasswordReset(data),
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useConfirmPasswordReset = () => {
  const setError = useAuthStore((s) => s.setError)
  return useMutation({
    mutationFn: (data: PasswordResetConfirmRequest) => authApi.confirmPasswordReset(data),
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useChangePassword = () => {
  const setError = useAuthStore((s) => s.setError)
  return useMutation({
    mutationFn: (data: PasswordChangeRequest) => authApi.passwordChange(data),
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useAuthCurrentUser = () => {
  const hasSession = useAuthStore((s) => s.hasSession)
  const setUser = useAuthStore((s) => s.setUser)

  const query = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.me,
    enabled: hasSession,
  })

  const me: MeResponse | undefined = query.data
  useEffect(() => {
    if (me) setUser(toUser(me))
  }, [me, setUser])

  return query
}

export const useAccounts = () => {
  const hasSession = useAuthStore((s) => s.hasSession)
  return useQuery({
    queryKey: queryKeys.auth.accounts,
    queryFn: authApi.accounts,
    enabled: hasSession,
  })
}

export const useLoginToAccount = () => {
  const client = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const setError = useAuthStore((s) => s.setError)

  return useMutation({
    mutationFn: async (data: AddAccountLoginRequest) => {
      const res = await authApi.addAccountLogin(data)
      saveAuthSession(res)
      return res
    },
    onSuccess: async (res) => {
      setUser(toUser(res))
      await client.clear()
    },
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useRequestAddAccount = () => {
  const setError = useAuthStore((s) => s.setError)
  return useMutation({
    mutationFn: (data: AddAccountRequest) => authApi.requestAddAccount(data),
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useVerifyAddAccount = () => {
  const client = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const setError = useAuthStore((s) => s.setError)

  return useMutation({
    mutationFn: async (data: AddAccountVerifyRequest) => {
      const res = await authApi.verifyAddAccount(data)
      saveAuthSession(res)
      return res
    },
    onSuccess: async (res) => {
      setUser(toUser(res))
      await client.clear()
    },
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useResendAddAccount = () => {
  const setError = useAuthStore((s) => s.setError)
  return useMutation({
    mutationFn: (data: AddAccountResendRequest) => authApi.resendAddAccount(data),
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useRemoveAccount = () => {
  const setError = useAuthStore((s) => s.setError)
  const client = useQueryClient()

  return useMutation({
    mutationFn: (accountId: string) => authApi.removeAccount(accountId),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: queryKeys.auth.accounts })
      await client.invalidateQueries({ queryKey: queryKeys.auth.me })
    },
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useUploadAvatar = () => {
  const setError = useAuthStore((s) => s.setError)
  const client = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => authApi.uploadAvatar(file),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: queryKeys.auth.me })
      await client.invalidateQueries({ queryKey: queryKeys.auth.accounts })
    },
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export const useRemoveAvatar = () => {
  const setError = useAuthStore((s) => s.setError)
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.removeAvatar(),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: queryKeys.auth.me })
      await client.invalidateQueries({ queryKey: queryKeys.auth.accounts })
    },
    onError: (error) => setError(extractErrorMessage(error)),
  })
}

export type SocialLoginInput =
  | { provider: 'google'; payload: GoogleSocialLoginRequest }
  | { provider: 'apple'; payload: AppleSocialLoginRequest }
  | { provider: 'facebook'; payload: FacebookSocialLoginRequest }

export const useSocialLogin = () => {
  const client = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const setError = useAuthStore((s) => s.setError)

  return useMutation({
    mutationFn: async (input: SocialLoginInput) => {
      let res: AuthResponse
      if (input.provider === 'google') res = await authApi.socialGoogle(input.payload)
      else if (input.provider === 'apple') res = await authApi.socialApple(input.payload)
      else res = await authApi.socialFacebook(input.payload)
      saveAuthSession(res)
      return res
    },
    onSuccess: async (res) => {
      setUser(toUser(res))
      await client.clear()
    },
    onError: (error) => setError(extractErrorMessage(error)),
  })
}
