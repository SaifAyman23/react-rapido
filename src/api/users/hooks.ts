import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { usersApi, type User } from './endpoints'

import type { PaginatedResponse } from '@/api/types'

export const useUsers = (params?: { search?: string; page?: number }) =>
  useQuery<PaginatedResponse<User>>({
    queryKey: ['users', 'list', params],
    queryFn: () => usersApi.list(params).then((res) => res.data),
  })

export const useUser = (id: string, enabled = true) =>
  useQuery<User>({
    queryKey: ['users', 'detail', id],
    queryFn: () => usersApi.retrieve(id).then((res) => res.data),
    enabled,
  })

export const useCurrentUser = () =>
  useQuery<User>({
    queryKey: ['users', 'me'],
    queryFn: () => usersApi.me().then((res) => res.data),
    retry: false,
  })

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersApi.update(id, data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'detail', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}
