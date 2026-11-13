/**
 * Shared API types.
 *
 * `contracts.ts` is the single source of truth for wire shapes; this module
 * only re-exports it under the names feature folders already import.
 */
export * from './contracts'
export type { Paginated as PaginatedResponse } from './contracts'
