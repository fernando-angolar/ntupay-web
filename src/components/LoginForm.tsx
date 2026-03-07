import { useMemo, useState } from 'react'
import { getLoginStatus, loginUser, verifyTwoFactorCode } from '../api/userApi'
import { saveAuthSession } from '../utils/authStorage'

const MAX_FAILED_ATTEMPTS = 5
const MAX_2FA_ATTEMPTS = 3
const TWO_FACTOR_BLOCK_MINUTES = 15
const RETRY_DELAY_MS = 2000

function isEmail(value: string): boolean {
  return /.+@.+\..+/.test(value)
}

function formatIdentifier(identifier: string): string {
  return isEmail(identifier) ? identifier.trim().toLowerCase() : identifier.trim()
}

function getClientIp(): string | undefined {
  return undefined
}

export function LoginForm() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [temporarySessionToken, setTemporarySessionToken] = useState<string | null>(null)
  const [twoFactorAttempts, setTwoFactorAttempts] = useState(0)
  const [twoFactorBlockedUntil, setTwoFactorBlockedUntil] = useState<number | null>(null)
  const [remainingAttempts, setRemainingAttempts] = useState(MAX_FAILED_ATTEMPTS)

  const twoFactorLocked = useMemo(() => {
    if (!twoFactorBlockedUntil) {
      return false
    }

    if (Date.now() >= twoFactorBlockedUntil) {
      setTwoFactorBlockedUntil(null)
      setTwoFactorAttempts(0)
      return false
    }

    return true
  }, [twoFactorBlockedUntil])

  const resetFeedback = () => {
    setMessage('')
    setError('')
  }

  const waitRetryWindow = () => new Promise((resolve) => window.setTimeout(resolve, RETRY_DELAY_MS))

  const handleSuccessfulAuthentication = (responseMessage: string, redirectTo?: string) => {
    setMessage(responseMessage)

    window.setTimeout(() => {
      window.location.assign(redirectTo || '/dashboard')
    }, 400)
  }

  const onSubmitCredentials = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetFeedback()

    const normalizedIdentifier = formatIdentifier(identifier)

    if (!normalizedIdentifier || !password) {
      setError('Preencha email/telefone e senha para entrar.')
      return
    }

    setLoading(true)

    try {
      const status = await getLoginStatus(normalizedIdentifier)

      if (status.isLocked) {
        setError(
          'Sua conta foi bloqueada por múltiplas tentativas de login. Verifique seu email para instruções de desbloqueio.',
        )
        return
      }

      const response = await loginUser(
        { identifier: normalizedIdentifier, password },
        { ipAddress: getClientIp(), userAgent: window.navigator.userAgent },
      )

      setRemainingAttempts(MAX_FAILED_ATTEMPTS)

      if (response.requiresTwoFactor && response.temporarySessionToken) {
        setTemporarySessionToken(response.temporarySessionToken)
        setMessage('2FA habilitado. Informe o código do autenticador para continuar.')
        return
      }

      if (response.tokens && response.user) {
        saveAuthSession(response.tokens, response.user)
      }

      handleSuccessfulAuthentication(response.message, response.redirectTo)
    } catch {
      const nextRemainingAttempts = Math.max(remainingAttempts - 1, 0)
      setRemainingAttempts(nextRemainingAttempts)

      if (nextRemainingAttempts <= 0) {
        setError(
          'Sua conta foi bloqueada por múltiplas tentativas de login. Verifique seu email para instruções de desbloqueio.',
        )
        return
      }

      await waitRetryWindow()
      setError('Email/telefone ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  const onSubmitTwoFactor = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetFeedback()

    if (!temporarySessionToken) {
      setError('Sessão 2FA expirada. Faça login novamente.')
      return
    }

    if (twoFactorLocked) {
      setError('Muitas tentativas no 2FA. Aguarde 15 minutos para tentar novamente.')
      return
    }

    const normalizedCode = totpCode.trim()

    if (!/^\d{6}$/.test(normalizedCode)) {
      setError('O código TOTP deve conter 6 dígitos.')
      return
    }

    setLoading(true)

    try {
      const response = await verifyTwoFactorCode(
        { temporarySessionToken, code: normalizedCode },
        { ipAddress: getClientIp(), userAgent: window.navigator.userAgent },
      )

      if (response.tokens && response.user) {
        saveAuthSession(response.tokens, response.user)
      }

      setTwoFactorAttempts(0)
      handleSuccessfulAuthentication(response.message, response.redirectTo)
    } catch {
      const attempts = twoFactorAttempts + 1
      setTwoFactorAttempts(attempts)

      if (attempts >= MAX_2FA_ATTEMPTS) {
        setTwoFactorBlockedUntil(Date.now() + TWO_FACTOR_BLOCK_MINUTES * 60 * 1000)
        setError('2FA bloqueado temporariamente por 15 minutos após 3 tentativas inválidas.')
        return
      }

      setError(`Código inválido. Tentativa ${attempts} de ${MAX_2FA_ATTEMPTS}.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card">
      <h1>Entrar no NTUPAY</h1>
      <p>Use email ou telefone para aceder ao dashboard do merchant.</p>

      {!temporarySessionToken ? (
        <form className="form-grid" onSubmit={onSubmitCredentials}>
          <input
            name="identifier"
            placeholder="Email ou telefone"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            autoComplete="username"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
          <button disabled={loading} type="submit">
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
      ) : (
        <form className="form-grid" onSubmit={onSubmitTwoFactor}>
          <input
            name="totpCode"
            placeholder="Código 2FA (6 dígitos)"
            value={totpCode}
            maxLength={6}
            onChange={(event) => setTotpCode(event.target.value.replace(/\D/g, ''))}
            required
          />
          <button disabled={loading || twoFactorLocked} type="submit">
            {loading ? 'A verificar...' : 'Validar 2FA'}
          </button>
        </form>
      )}

      <small className="hint">Tentativas restantes antes de bloqueio: {remainingAttempts}</small>
      {message && <span className="success">{message}</span>}
      {error && <span className="error">{error}</span>}
    </section>
  )
}