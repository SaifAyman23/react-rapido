import { axiosInstance } from '@/api/axiosInstance'
import type { PaginatedResponse } from '@/api/types'

export interface UserProfile {
  id: string
  full_name: string
  phone_number: string
  position: string
  country: string
  biography: string
  profile_image: string | null
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  file: string
  original_filename: string
  file_size: number
  parsed_data: Record<string, unknown> | null
  parse_status: string
  is_default: boolean
  created_at: string
}

export const profileEndpoints = {
  list: '/accounts/profile/',
  me: '/accounts/profile/me/',
  resume: '/accounts/resumes/',
  retrieve: (id: string) => `/accounts/profile/${id}/`,
  resumeRetrieve: (id: string) => `/accounts/resumes/${id}/`,
}

export const profileApi = {
  list: (params?: { page?: number }) =>
    axiosInstance.get<PaginatedResponse<UserProfile>>(profileEndpoints.list, { params }),

  me: () => axiosInstance.get<UserProfile>(profileEndpoints.me),

  retrieve: (id: string) => axiosInstance.get<UserProfile>(profileEndpoints.retrieve(id)),

  create: (data: FormData) =>
    axiosInstance.post<UserProfile>(profileEndpoints.list, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: FormData | Partial<UserProfile>) =>
    axiosInstance.patch<UserProfile>(profileEndpoints.retrieve(id), data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: string) => axiosInstance.delete(profileEndpoints.retrieve(id)),

  resume: (data: FormData) =>
    axiosInstance.post<Resume>(profileEndpoints.resume, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  resumeDelete: (id: string) => axiosInstance.delete(profileEndpoints.resumeRetrieve(id)),

  resumeUpdate: (id: string, data: FormData) =>
    axiosInstance.patch<Resume>(profileEndpoints.resumeRetrieve(id), data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  resumeList: (params?: { page?: number }) =>
    axiosInstance.get<PaginatedResponse<Resume>>(profileEndpoints.resume, { params }),
}
