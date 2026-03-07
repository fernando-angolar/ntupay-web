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

export interface LoginRequest {
  identifier: string
  password: string
  twoFactorCode?: string
  twoFactorSessionToken?: string
}

export interface LoginResponse {
  twoFactorRequired: boolean
  twoFactorSessionToken: string | null
  accessToken: string | null
  refreshToken: string | null
  accessTokenExpiresInSeconds: number
  refreshTokenExpiresInSeconds: number
}

export interface ApiErrorResponse {
  status: number
  error: string
  message: string
  details: string[]
  timestamp: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  accessTokenExpiresInSeconds: number
  refreshTokenExpiresInSeconds: number
  savedAt: string
}
