import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { profileApi, type Resume, type UserProfile } from './endpoints'

import type { PaginatedResponse } from '@/api/types'

export const useProfiles = (params?: { page?: number }) =>
  useQuery<PaginatedResponse<UserProfile>>({
    queryKey: ['profiles', 'list', params],
    queryFn: () => profileApi.list(params).then((res) => res.data),
  })

export const useProfile = (id: string, enabled = true) =>
  useQuery<UserProfile>({
    queryKey: ['profiles', 'detail', id],
    queryFn: () => profileApi.retrieve(id).then((res) => res.data),
    enabled,
  })

export const useCurrentProfile = () =>
  useQuery<UserProfile>({
    queryKey: ['profiles', 'me'],
    queryFn: () => profileApi.me().then((res) => res.data),
    retry: false,
  })

export const useCreateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => profileApi.create(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | Partial<UserProfile> }) =>
      profileApi.update(id, data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profiles', 'detail', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['profiles', 'me'] })
    },
  })
}

export const useDeleteProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => profileApi.delete(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
  })
}

export const useResumes = (params?: { page?: number }) =>
  useQuery<PaginatedResponse<Resume>>({
    queryKey: ['resumes', 'list', params],
    queryFn: () => profileApi.resumeList(params).then((res) => res.data),
  })

export const useUploadResume = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => profileApi.resume(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
    },
  })
}

export const useDeleteResume = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => profileApi.resumeDelete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
    },
  })
}
