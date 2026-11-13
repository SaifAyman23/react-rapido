export type UserRole = 'client' | 'coach' | 'user' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: UserRole
  createdAt?: string
  updatedAt?: string
}
