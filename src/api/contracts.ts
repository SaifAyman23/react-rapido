/**
 * Wire contracts for the Rapido API (`/api/v1`).
 *
 * These mirror `backend/accounts/serializers.py` exactly: the backend is the
 * source of truth and rejects unknown request fields, so request types here
 * must stay closed rather than structural.
 */

export type AccountRole = 'client' | 'coach'

/** `UserSummarySerializer` — the person behind one or more accounts. */
export interface UserSummary {
  id: string
  email: string
  role: AccountRole | null
  is_email_verified: boolean
  onboarding_completed: boolean
}

/** `AccountSummarySerializer` — one role-scoped identity the person owns. */
export interface AccountSummary {
  id: string
  role: AccountRole
  full_name: string
  email: string
  is_active: boolean
  has_profile: boolean
  is_current: boolean
  unread_count: number
  needs_setup: boolean
  avatar_url: string | null
}

export interface AuthTokens {
  access: string
  refresh: string
}

/** `200/201 {user, account, access, refresh}` from login, social, verify. */
export interface AuthResponse extends AuthTokens {
  user: UserSummary
  account: AccountSummary
}

/** Register response: no tokens until the email is verified. */
export interface VerificationPendingResponse {
  user: UserSummary
  account: AccountSummary
  verification_required: boolean
  message: string
}

/** `GET /auth/me/` — the router's source of truth. */
export interface MeResponse {
  user: UserSummary
  account: AccountSummary | null
  is_email_verified: boolean
  onboarding_completed: boolean
}

/** `GET /auth/accounts/` */
export type AccountsResponse = AccountSummary[]

/** Add-account request response. */
export interface AddAccountPendingResponse {
  email: string
  role: AccountRole
  verification_required: boolean
  message: string
}

export interface MessageResponse {
  message: string
}

export interface TokenRefreshRequest {
  refresh: string
}

export interface TokenRefreshResponse {
  access: string
  refresh?: string
}

export interface RegisterRequest {
  email: string
  password: string
  role: AccountRole
}

export interface LoginRequest {
  email: string
  password: string
  account_id?: string
}

export interface VerifyEmailRequest {
  email: string
  code: string
  account_id?: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  email: string
  code: string
  new_password: string
}

export interface PasswordChangeRequest {
  current_password: string
  new_password: string
}

export interface LogoutRequest {
  refresh?: string
}

export interface AddAccountLoginRequest {
  email: string
  password: string
  account_id?: string
}

export interface AddAccountRequest {
  email: string
  role: AccountRole
}

export interface AddAccountVerifyRequest {
  email: string
  code: string
}

export interface AddAccountResendRequest {
  email: string
}

export interface GoogleSocialLoginRequest {
  id_token?: string
  code?: string
  redirect_uri?: string
  code_verifier?: string
  role?: AccountRole
}

export interface AppleSocialLoginRequest {
  identity_token: string
  role?: AccountRole
  nonce?: string
  full_name?: Record<string, unknown>
}

export interface FacebookSocialLoginRequest {
  access_token: string
  role?: AccountRole
}

export interface EmailChangeRequest {
  new_email: string
}

export interface EmailChangeConfirmRequest {
  new_email: string
  code: string
  refresh?: string
}

/** `StandardPagination` envelope: `pagination` + `links` + `results`. */
export interface Paginated<T> {
  pagination: {
    count: number
    page_size: number
    total_pages: number
    current_page: number
    has_next: boolean
    has_previous: boolean
  }
  links: { next: string | null; previous: string | null }
  results: T[]
}

/** Cursor envelope: `results` + `next` + `previous`. */
export interface CursorPaginated<T> {
  results: T[]
  next: string | null
  previous: string | null
}

export type NotificationType =
  'SYSTEM' | 'welcome' | 'generic' | 'REMINDER' | 'CUSTOM_REMINDER' | 'MEDICATION_REMINDER'

export interface NotificationItem {
  id: string
  type: NotificationType | string
  title: string
  body: string
  data: Record<string, unknown>
  is_read: boolean
  read_at: string | null
  scheduled_at: string | null
  delivery_status: string
  created_at: string
  related_object_type?: string | null
}

export interface NotificationsResponse {
  results: NotificationItem[]
  unread_count: number
}

export interface DeviceResponse {
  id: string
  token: string
  device_uuid: string
  platform: 'android' | 'ios' | 'web'
  device_name: string
  is_active: boolean
  notifications_enabled: boolean
  last_seen_at: string | null
}

export interface DeviceRegisterRequest {
  token: string
  device_uuid: string
  platform: 'android' | 'ios' | 'web'
  device_name?: string
}

export interface CustomReminderResponse {
  id: string
  name: string
  time: string
  days_of_week: number[]
  is_active: boolean
  created_at: string
}

export interface CustomReminderRequest {
  name: string
  time: string
  days_of_week: number[]
  is_active?: boolean
}

/** The backend's normalized error body. */
export interface ErrorPayload {
  code: string
  message: string
  message_ar?: string | null
  fields?: Record<string, string[]> | null
  detail?: unknown
}

export const ERROR_CODES = {
  UNKNOWN: 'unknown',
  NETWORK_ERROR: 'network_error',
  TIMEOUT: 'timeout',
  UNAUTHORIZED: 'not_authenticated',
  VALIDATION_ERROR: 'validation_error',
  PERMISSION_DENIED: 'permission_denied',
  NOT_FOUND: 'not_found',
  THROTTLED: 'throttled',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
