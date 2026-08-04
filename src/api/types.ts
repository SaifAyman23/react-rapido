export interface ApiError {
  code: string
  message: string
  details: Record<string, unknown> | unknown[] | null
}

export interface ApiErrorResponse {
  error: ApiError
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface SuccessResponse<T = unknown> {
  message: string
  data?: T
}

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface RequestConfig {
  method: HttpMethod
  url: string
  data?: unknown
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

export type ErrorCode =
  | 'validation_error'
  | 'parse_error'
  | 'authentication_error'
  | 'permission_denied'
  | 'not_found'
  | 'method_not_allowed'
  | 'not_acceptable'
  | 'unsupported_media_type'
  | 'throttled'
  | 'api_error'
  | 'internal_server_error'
  | 'integrity_error'
  | 'data_error'
  | 'db_operational_error'
  | 'db_error'
  | 'protected_object'
  | 'multiple_objects'
  | 'field_does_not_exist'
  | 'bad_request'
