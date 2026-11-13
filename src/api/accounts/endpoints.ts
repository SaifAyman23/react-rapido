import { axiosInstance } from '@/api/axiosInstance'
import type {
  AccountSummary,
  AccountsResponse,
  AddAccountLoginRequest,
  AddAccountPendingResponse,
  AddAccountRequest,
  AddAccountResendRequest,
  AddAccountVerifyRequest,
  AppleSocialLoginRequest,
  AuthResponse,
  FacebookSocialLoginRequest,
  GoogleSocialLoginRequest,
  LoginRequest,
  LogoutRequest,
  MeResponse,
  MessageResponse,
  PasswordChangeRequest,
  PasswordResetConfirmRequest,
  PasswordResetRequest,
  RegisterRequest,
  ResendVerificationRequest,
  VerificationPendingResponse,
  VerifyEmailRequest,
} from '@/api/contracts'
import { AUTH_ROOT } from '@/lib/constants'

/** Every path is relative to `${VITE_API_URL}/api/v1`. */
export const authEndpoints = {
  register: `${AUTH_ROOT}/register/`,
  verifyEmail: `${AUTH_ROOT}/verify-email/`,
  resendVerification: `${AUTH_ROOT}/verify-email/resend/`,
  refresh: `${AUTH_ROOT}/token/refresh/`,
  login: `${AUTH_ROOT}/login/`,
  socialGoogle: `${AUTH_ROOT}/social/google/`,
  socialApple: `${AUTH_ROOT}/social/apple/`,
  socialFacebook: `${AUTH_ROOT}/social/facebook/`,
  logout: `${AUTH_ROOT}/logout/`,
  me: `${AUTH_ROOT}/me/`,
  accounts: `${AUTH_ROOT}/accounts/`,
  addLogin: `${AUTH_ROOT}/accounts/add/login/`,
  addRequest: `${AUTH_ROOT}/accounts/add/request/`,
  addVerify: `${AUTH_ROOT}/accounts/add/verify/`,
  addResend: `${AUTH_ROOT}/accounts/add/resend/`,
  removeAccount: (accountId: string) => `${AUTH_ROOT}/accounts/${accountId}/`,
  avatar: `${AUTH_ROOT}/avatar/`,
  passwordChange: `${AUTH_ROOT}/password/change/`,
  passwordResetRequest: `${AUTH_ROOT}/password-reset/request/`,
  passwordResetConfirm: `${AUTH_ROOT}/password-reset/confirm/`,
  deleteIdentity: `${AUTH_ROOT}/account/`,
} as const

const PUBLIC = { skipAuth: true, skipRefresh: true } as const

// Logout must never trigger the 401 refresh path: the access token may already
// be expired, and the refresh token is the one being blacklisted.
const NO_REFRESH = { skipRefresh: true, skipRedirect: true } as const

export const authApi = {
  register: (data: RegisterRequest) =>
    axiosInstance
      .post<VerificationPendingResponse>(authEndpoints.register, data, PUBLIC)
      .then((response) => response.data),

  verifyEmail: (data: VerifyEmailRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.verifyEmail, data, PUBLIC)
      .then((response) => response.data),

  resendVerification: (data: ResendVerificationRequest) =>
    axiosInstance.post<void>(authEndpoints.resendVerification, data, PUBLIC).then(() => undefined),

  login: (data: LoginRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.login, data, PUBLIC)
      .then((response) => response.data),

  socialGoogle: (data: GoogleSocialLoginRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.socialGoogle, data, PUBLIC)
      .then((response) => response.data),

  socialApple: (data: AppleSocialLoginRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.socialApple, data, PUBLIC)
      .then((response) => response.data),

  socialFacebook: (data: FacebookSocialLoginRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.socialFacebook, data, PUBLIC)
      .then((response) => response.data),

  logout: (data: LogoutRequest = {}) =>
    axiosInstance.post<void>(authEndpoints.logout, data, NO_REFRESH).then(() => undefined),

  me: () => axiosInstance.get<MeResponse>(authEndpoints.me).then((response) => response.data),

  accounts: () =>
    axiosInstance.get<AccountsResponse>(authEndpoints.accounts).then((response) => response.data),

  addAccountLogin: (data: AddAccountLoginRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.addLogin, data)
      .then((response) => response.data),

  requestAddAccount: (data: AddAccountRequest) =>
    axiosInstance
      .post<AddAccountPendingResponse>(authEndpoints.addRequest, data)
      .then((response) => response.data),

  verifyAddAccount: (data: AddAccountVerifyRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.addVerify, data)
      .then((response) => response.data),

  resendAddAccount: (data: AddAccountResendRequest) =>
    axiosInstance.post<void>(authEndpoints.addResend, data).then(() => undefined),

  removeAccount: (accountId: string) =>
    axiosInstance.delete<void>(authEndpoints.removeAccount(accountId)).then(() => undefined),

  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    return axiosInstance
      .post<AccountSummary>(authEndpoints.avatar, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data)
  },

  removeAvatar: () => axiosInstance.delete<void>(authEndpoints.avatar).then(() => undefined),

  passwordChange: (data: PasswordChangeRequest) =>
    axiosInstance
      .post<MessageResponse>(authEndpoints.passwordChange, data)
      .then((response) => response.data),

  requestPasswordReset: (data: PasswordResetRequest) =>
    axiosInstance
      .post<MessageResponse>(authEndpoints.passwordResetRequest, data, PUBLIC)
      .then((response) => response.data),

  confirmPasswordReset: (data: PasswordResetConfirmRequest) =>
    axiosInstance
      .post<MessageResponse>(authEndpoints.passwordResetConfirm, data, PUBLIC)
      .then((response) => response.data),

  deleteIdentity: () =>
    axiosInstance.delete<void>(authEndpoints.deleteIdentity).then(() => undefined),
}
