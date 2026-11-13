import { authApi } from '@/api/accounts/endpoints'
import { toUser } from '@/api/accounts/hooks'
import type { MeResponse } from '@/api/contracts'
import { clearSession } from '@/api/session'
import { queryClient } from '@/lib/queryClient'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/store/auth/authStore'

/**
 * Granular session-reset helpers.
 *
 * These are the single source of truth for "wipe local state for the current
 * account" so callers (account switch, sign out, account deletion) stay
 * decoupled from the individual stores and the React Query cache.
 */

/** Drop every cached query (auth/me, accounts, ...). */
export async function clearQueryCache(): Promise<void> {
  await queryClient.clear()
}

/** Remove the signed-in user from the auth store (role becomes undefined). */
export function clearAuthUser(): void {
  useAuthStore.getState().setUser(null)
}

/** Populate the auth store from an auth response (login / switch / verify). */
export function setAuthUser(
  res: { user: MeResponse['user']; account: MeResponse['account'] } | null | undefined
): void {
  if (!res) return
  useAuthStore.getState().setUser(toUser(res))
}

/** Fetch a fresh /auth/me and sync the auth store with it. */
export async function refreshAuthMe(): Promise<MeResponse> {
  const me = await queryClient.fetchQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.me,
  })
  useAuthStore.getState().setUser(toUser(me))
  return me
}

/** Wipe all local session state (auth user, query cache). */
export async function resetSessionState(): Promise<void> {
  clearAuthUser()
  await clearQueryCache()
}

/**
 * Full account-switch sequence: nullify role, clear cache, populate the new
 * account's role, fetch a fresh /auth/me, then return. Callers handle the
 * actual navigation afterwards.
 */
export async function switchAccountSession(
  res: { user: MeResponse['user']; account: MeResponse['account'] } | null | undefined
): Promise<void> {
  clearAuthUser()
  await clearQueryCache()
  setAuthUser(res)
  try {
    await refreshAuthMe()
  } catch {
    // The gate will retry on its own.
  }
}

/** Clear the persisted session tokens (used on sign out). */
export function clearPersistedSession(): void {
  clearSession()
}
