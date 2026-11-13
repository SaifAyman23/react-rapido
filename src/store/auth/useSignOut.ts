import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { authApi } from '@/api/accounts/endpoints'
import { clearSession, getRefreshToken } from '@/api/session'
import { ROUTES } from '@/lib/constants'
import { useAuthStore } from '@/store/auth/authStore'

/**
 * Blacklists the refresh token, clears the session, and returns to the gate.
 *
 * The single sign-out path: nothing else clears the token pair or the cache.
 */
export function useSignOut() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const client = useQueryClient()

  return useCallback(() => {
    const refresh = getRefreshToken()
    if (refresh) {
      void authApi.logout({ refresh }).catch(() => undefined)

      const rotated = getRefreshToken()
      if (rotated && rotated !== refresh) {
        void authApi.logout({ refresh: rotated }).catch(() => undefined)
      }
    }

    clearSession()
    logout()
    client.clear()
    navigate(ROUTES.LOGIN, { replace: true })
  }, [client, logout, navigate])
}
