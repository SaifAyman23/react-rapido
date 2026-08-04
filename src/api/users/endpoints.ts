import { axiosInstance } from '@/api/axiosInstance'
import type { PaginatedResponse } from '@/api/types'

export interface User {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  is_verified: boolean
  status: string
  created_at: string
  updated_at: string
}

export const usersEndpoints = {
  list: '/accounts/users/',
  me: '/accounts/users/me/',
  retrieve: (id: string) => `/accounts/users/${id}/`,
}

export const usersApi = {
  list: (params?: { search?: string; page?: number }) =>
    axiosInstance.get<PaginatedResponse<User>>(usersEndpoints.list, { params }),

  me: () => axiosInstance.get<User>(usersEndpoints.me),

  retrieve: (id: string) => axiosInstance.get<User>(usersEndpoints.retrieve(id)),

  update: (id: string, data: Partial<User>) =>
    axiosInstance.patch<User>(usersEndpoints.retrieve(id), data),

  delete: (id: string) => axiosInstance.delete(usersEndpoints.retrieve(id)),
}
