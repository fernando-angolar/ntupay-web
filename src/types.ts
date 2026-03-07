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

export interface LoginRequest {
  identifier: string
  password: string
}

export interface LoginTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  refreshExpiresIn: number
}

export interface LoginUser {
  id: string
  name: string
  email: string
  phone: string
  accountType: AccountType
}

export interface LoginResponse {
  message: string
  requiresTwoFactor: boolean
  temporarySessionToken?: string
  tokens?: LoginTokens
  user?: LoginUser
  redirectTo?: string
  loginAttemptId?: string
}

export interface TwoFactorVerifyRequest {
  temporarySessionToken: string
  code: string
}

export interface LoginStatusResponse {
  remainingAttempts: number
  isLocked: boolean
  lockUntil: string | null
  retryAfterSeconds: number
}

export interface LoginAuditMetadata {
  ipAddress?: string
  userAgent?: string
}