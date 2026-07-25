export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: 'user' | 'admin'
  createdAt?: string
  updatedAt?: string
}
