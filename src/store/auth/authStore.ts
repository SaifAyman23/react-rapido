import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { APP_NAME } from '@/lib/constants'
import type { User } from '@/types'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
            error: null,
          }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error, isLoading: false }),
        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          }),
      }),
      {
        name: `${APP_NAME}-auth-storage`,
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    ),
    { name: `${APP_NAME}-auth-store` }
  )
)
