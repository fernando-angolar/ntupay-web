import { useRef, useState } from 'react'
import { loginUser, verifyTwoFactor } from '../api/userApi'
import { saveAuthSession } from '../utils/authStorage'
import '../styles/AuthForms.css'

interface LoginFormProps {
  onForgotPassword?: () => void
}

const MAX_ATTEMPTS = 5

// export default function LoginForm() {
export default function LoginForm({ onForgotPassword }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [totpDigits, setTotpDigits] = useState(['', '', '', '', '', ''])
  const digitRefs = useRef<Array<HTMLInputElement | null>>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS)
  const [twoFaAttempts, setTwoFaAttempts] = useState(0)

  const is2FA = sessionToken !== null
  const totpCode = totpDigits.join('')

  const onDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...totpDigits]
    next[index] = digit
    setTotpDigits(next)
    if (digit && index < 5) digitRefs.current[index + 1]?.focus()
  }

  const onDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !totpDigits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus()
    }
  }

  const onDigitPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setTotpDigits(pasted.split(''))
      digitRefs.current[5]?.focus()
    }
  }

  const onSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // const id = identifier.includes('@')
    //   ? identifier.trim().toLowerCase()
    //   : identifier.trim()
    const id = identifier.includes('@') ? identifier.trim().toLowerCase() : identifier.trim()

    if (!id || !password) {
      setError('Preencha email/telefone e senha.')
      return
    }

    setLoading(true)

    try {
      const res = await loginUser({ identifier: id, password })

      if (res.twoFactorRequired && res.twoFactorSessionToken) {
        setSessionToken(res.twoFactorSessionToken)
        return
      }

      saveAuthSession(res)
      setSuccess('Sessão iniciada! A redirecionar...')
      setTimeout(() => window.location.assign('/dashboard'), 600)

    } catch (err) {
      const next = Math.max(attempts - 1, 0)
      setAttempts(next)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const onSubmitTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!sessionToken) return

    if (totpCode.length !== 6) {
      setError('Introduza o código de 6 dígitos.')
      return
    }

    // const id = identifier.includes('@')
    //   ? identifier.trim().toLowerCase()
    //   : identifier.trim()
    const id = identifier.includes('@') ? identifier.trim().toLowerCase() : identifier.trim()

    setLoading(true)

    try {
      const res = await verifyTwoFactor(id, password, totpCode, sessionToken)

      saveAuthSession(res)

      setSuccess('2FA validado! A redirecionar...')
      setTimeout(() => window.location.assign('/dashboard'), 600)

    } catch (err) {

      const next = twoFaAttempts + 1
      setTwoFaAttempts(next)

      setTotpDigits(['', '', '', '', '', ''])
      digitRefs.current[0]?.focus()

      if (next >= 3) {
        setError('Demasiadas tentativas de 2FA. Tente novamente em 15 minutos.')
      } else {
        setError(`${(err as Error).message} — tentativa ${next} de 3.`)
      }

    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    setSessionToken(null)
    setTotpDigits(['', '', '', '', '', ''])
    setTwoFaAttempts(0)
    setError('')
  }

  return (
    <div className="auth-form">

      <div className="form-header">
        <h2>{is2FA ? 'Verificação em 2 etapas' : 'Bem-vindo de volta'}</h2>
        {/* <p>
          {is2FA
            ? 'Abra a app autenticadora e introduza o código'
            : 'Aceda ao seu dashboard'}
        </p> */}
        <p>{is2FA ? 'Abra a app autenticadora e introduza o código' : 'Aceda ao seu dashboard'}</p>
      </div>

      {success ? (
        <div className="success-card">
          <strong>{success}</strong>
        </div>

      ) : !is2FA ? (

        <form onSubmit={onSubmitCredentials}>

          <div className="field-group">

            <div className="field">
              <label>Email ou telefone</label>

              <div className="input-wrap">
                <input
                  type="text"
                  placeholder="email@empresa.ao ou +2449XXXXXXXX"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

            </div>

            <div className="field">

              {/* <label>Senha</label> */}
              <div className="label-row">
                <label>Senha</label>
                <button type="button" className="forgot-link" onClick={onForgotPassword}>
                  Esqueceu a senha?
                </button>
              </div>

              <div className="input-wrap">

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  👁
                </button>

              </div>

            </div>

          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* <button
            className="submit-btn"
            type="submit"
            disabled={loading || attempts <= 0}
          > */}
          <button className="submit-btn" type="submit" disabled={loading || attempts <= 0}>
            {loading ? 'A verificar...' : 'Entrar'}
          </button>

        </form>

      ) : (

        <form onSubmit={onSubmitTwoFactor}>

          <div className="otp-grid" onPaste={onDigitPaste}>
            {totpDigits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  digitRefs.current[i] = el
                }}
                className="otp-input"
                maxLength={1}
                value={d}
                onChange={(e) => onDigitChange(i, e.target.value)}
                onKeyDown={(e) => onDigitKeyDown(i, e)}
              />
            ))}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button className="submit-btn" type="submit">
            Confirmar código
          </button>

          <button type="button" className="back-btn" onClick={goBack}>
            Voltar
          </button>

        </form>

      )}
    </div>
  )
}