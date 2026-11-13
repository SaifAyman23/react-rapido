import { isAxiosError } from 'axios'

import { ERROR_CODES, type ErrorCode, type ErrorPayload } from '@/api/contracts'
import i18n from '@/i18n'

export interface ApiErrorInit {
  code: ErrorCode | string
  message: string
  status: number
  messageAr?: string | null
  fields?: Record<string, string[]> | null
  detail?: unknown
  retryAfter?: number | null
  originalError?: unknown
}

/**
 * The one error shape the app handles.
 *
 * Every axios rejection is normalised into this before it reaches a hook, so
 * `onError` never has to inspect an axios or DRF-specific shape.
 */
export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly messageAr: string | null
  readonly fields: Record<string, string[]> | null
  readonly detail: unknown
  readonly retryAfter: number | null
  readonly originalError: unknown

  constructor(init: ApiErrorInit) {
    super(init.message || 'An unexpected error occurred.')
    this.message = init.message || 'An unexpected error occurred.'
    this.name = 'ApiError'
    this.code = init.code
    this.status = init.status
    this.messageAr = init.messageAr ?? null
    this.fields = init.fields ?? null
    this.detail = init.detail ?? null
    this.retryAfter = init.retryAfter ?? null
    this.originalError = init.originalError ?? null
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  get isNetworkError(): boolean {
    return this.status === 0
  }

  get isTimeout(): boolean {
    return this.code === ERROR_CODES.TIMEOUT
  }

  get isUnauthorized(): boolean {
    return this.status === 401
  }

  get isForbidden(): boolean {
    return this.status === 403
  }

  get isNotFound(): boolean {
    return this.status === 404
  }

  get isValidation(): boolean {
    return this.status === 400 || this.status === 422
  }

  get isRateLimited(): boolean {
    return this.status === 429
  }

  /** The first field message, in the order the backend emitted it. */
  get firstFieldError(): string | null {
    if (!this.fields) return null
    for (const messages of Object.values(this.fields)) {
      if (messages.length > 0 && messages[0]) return messages[0]
    }
    return null
  }

  fieldError(field: string): string | null {
    const messages = this.fields?.[field]
    return messages && messages.length > 0 ? messages[0] : null
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError
}

export function isErrorCode(value: unknown, code: ErrorCode | string): boolean {
  return isApiError(value) && value.code === code
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toStringList(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (typeof value === 'number' || typeof value === 'boolean') return [String(value)]
  if (Array.isArray(value)) return value.flatMap(toStringList)
  if (isRecord(value)) return Object.values(value).flatMap(toStringList)
  return []
}

function normalizeFields(value: unknown): Record<string, string[]> | null {
  if (!isRecord(value)) return null
  const fields: Record<string, string[]> = {}
  for (const [key, raw] of Object.entries(value)) {
    const messages = toStringList(raw)
    if (messages.length > 0) fields[key] = messages
  }
  return Object.keys(fields).length > 0 ? fields : null
}

function parseRetryAfter(headers: unknown, detail: unknown): number | null {
  if (isRecord(detail)) {
    const value = detail.retry_after
    if (typeof value === 'number' && Number.isFinite(value)) return value
  }
  if (!isRecord(headers)) return null
  const raw = (headers as Record<string, unknown>)['retry-after']
  if (typeof raw !== 'string' && typeof raw !== 'number') return null
  const seconds = Number(raw)
  if (Number.isFinite(seconds)) return seconds
  const date = Date.parse(String(raw))
  if (Number.isNaN(date)) return null
  return Math.max(0, Math.round((date - Date.now()) / 1000))
}

function readEnvelope(data: unknown): ErrorPayload | null {
  if (!isRecord(data) || !isRecord(data.error)) return null
  const {
    code,
    message,
    message_ar: messageAr,
    fields,
    detail,
  } = data.error as Record<string, unknown>
  return {
    code: typeof code === 'string' ? code : ERROR_CODES.UNKNOWN,
    message: typeof message === 'string' ? message : i18n.t('errors.requestFailed'),
    message_ar: typeof messageAr === 'string' ? messageAr : null,
    fields: isRecord(fields) ? (fields as Record<string, string[]>) : null,
    detail,
  }
}

function fallbackMessage(data: unknown): string | null {
  if (!isRecord(data)) return null
  if (typeof data.detail === 'string') return data.detail
  if (typeof data.message === 'string') return data.message
  return null
}

export function normalizeApiError(input: unknown): ApiError {
  if (input instanceof ApiError) return input

  if (isAxiosError(input)) {
    if (!input.response) {
      const timedOut = input.code === 'ECONNABORTED' || input.code === 'ETIMEDOUT'
      return new ApiError({
        code: timedOut ? ERROR_CODES.TIMEOUT : ERROR_CODES.NETWORK_ERROR,
        message: timedOut ? i18n.t('errors.timeout') : i18n.t('errors.network'),
        status: 0,
        originalError: input,
      })
    }

    const { response } = input
    const envelope = readEnvelope(response.data)
    const fields = normalizeFields(envelope?.fields) ?? normalizeFields(response.data)
    const message =
      envelope?.message ??
      fallbackMessage(response.data) ??
      (response.statusText || i18n.t('errors.status', { status: response.status }))

    return new ApiError({
      code: envelope?.code ?? ERROR_CODES.UNKNOWN,
      message,
      status: response.status,
      messageAr: envelope?.message_ar ?? null,
      fields,
      detail: envelope?.detail ?? null,
      retryAfter: parseRetryAfter(response.headers, envelope?.detail),
      originalError: input,
    })
  }

  if (input instanceof Error) {
    return new ApiError({
      code: ERROR_CODES.NETWORK_ERROR,
      message: input.message || i18n.t('errors.unexpected'),
      status: 0,
      originalError: input,
    })
  }

  return new ApiError({
    code: ERROR_CODES.UNKNOWN,
    message: i18n.t('errors.unexpected'),
    status: 0,
    originalError: input,
  })
}

/** A message a screen can render: field error first, then the envelope message. */
export function extractErrorMessage(error: unknown, fallback?: string): string {
  const apiError = normalizeApiError(error)
  if (apiError.isValidation && apiError.firstFieldError) return apiError.firstFieldError
  return apiError.message || apiError.firstFieldError || fallback || i18n.t('errors.unexpected')
}
