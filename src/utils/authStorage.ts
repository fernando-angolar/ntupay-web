import type { AuthSession, LoginResponse } from '../types'

const AUTH_KEY = 'ntupay.auth.session'

export function saveAuthSession(response: LoginResponse): void {
  if (!response.accessToken || !response.refreshToken) return

  const session: AuthSession = {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    accessTokenExpiresInSeconds: response.accessTokenExpiresInSeconds,
    refreshTokenExpiresInSeconds: response.refreshTokenExpiresInSeconds,
    savedAt: new Date().toISOString(),
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(session))
}

export function getAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function isSessionValid(): boolean {
  const session = getAuthSession()
  if (!session) return false

  const savedAt = new Date(session.savedAt).getTime()
  const expiresAt = savedAt + session.accessTokenExpiresInSeconds * 1000
  return Date.now() < expiresAt
}