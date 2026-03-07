import type { LoginTokens, LoginUser } from '../types'

const AUTH_STORAGE_KEY = 'ntupay.auth.session'

interface AuthSession {
  tokens: LoginTokens
  user: LoginUser
  createdAt: string
}

export function saveAuthSession(tokens: LoginTokens, user: LoginUser): void {
  const payload: AuthSession = {
    tokens,
    user,
    createdAt: new Date().toISOString(),
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload))
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}