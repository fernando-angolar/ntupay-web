export type AccountType = 'MERCHANT' | 'PARTNER'

export interface UserRegistrationRequest {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  accountType: AccountType
}

export interface UserRegistrationResponse {
  id: string
  name: string
  email: string
  phone: string
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED'
  message: string
  createdAt: string
}

export interface ApiErrorResponse {
  status: number
  error: string
  message: string
  details: string[]
  timestamp: string
}