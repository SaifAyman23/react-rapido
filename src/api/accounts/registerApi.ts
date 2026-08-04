import { authEndpoints } from '@/api/accounts/endpoints'
import { axiosInstance } from '@/api/axiosInstance'

export interface RegisterRequest {
  email: string
  username?: string
  first_name?: string
  last_name?: string
  password: string
  password_confirm: string
}

export interface RegisterResponse {
  message: string
  user_id?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  message: string
}

export interface CurrentUserResponse {
  id: string
  username: string
  email: string
  is_verified: boolean
  status: string
  created_at: string
}

export const registerApi = {
  register: (data: RegisterRequest) =>
    axiosInstance.post<RegisterResponse>(authEndpoints.register, data),

  login: (data: LoginRequest) => axiosInstance.post<LoginResponse>(authEndpoints.login, data),

  getCurrentUser: () => axiosInstance.get<CurrentUserResponse>(authEndpoints.me),

  logout: () => axiosInstance.post<{ message: string }>(authEndpoints.logout),
}
