// import { useRef, useState } from 'react'
// import { loginUser, verifyTwoFactor } from '../api/userApi'
// import { saveAuthSession } from '../utils/authStorage'
// import '../styles/authForms.css'

// const MAX_ATTEMPTS = 5

// export function LoginForm() {
//   // Step 1 — credentials
//   const [identifier, setIdentifier] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)

//   // Step 2 — 2FA
//   const [sessionToken, setSessionToken] = useState<string | null>(null)
//   const [totpDigits, setTotpDigits] = useState(['', '', '', '', '', ''])
//   const digitRefs = useRef<Array<HTMLInputElement | null>>([])

//   // UI state
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [attempts, setAttempts] = useState(MAX_ATTEMPTS)
//   const [twoFaAttempts, setTwoFaAttempts] = useState(0)

//   const is2FA = sessionToken !== null
//   const totpCode = totpDigits.join('')

//   // ── OTP input helpers ─────────────────────────────────────────────────────

//   const onDigitChange = (index: number, value: string) => {
//     const digit = value.replace(/\D/g, '').slice(-1)
//     const next = [...totpDigits]
//     next[index] = digit
//     setTotpDigits(next)
//     if (digit && index < 5) digitRefs.current[index + 1]?.focus()
//   }

//   const onDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
//     if (e.key === 'Backspace' && !totpDigits[index] && index > 0) {
//       digitRefs.current[index - 1]?.focus()
//     }
//   }

//   const onDigitPaste = (e: React.ClipboardEvent) => {
//     e.preventDefault()
//     const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
//     if (pasted.length === 6) {
//       setTotpDigits(pasted.split(''))
//       digitRefs.current[5]?.focus()
//     }
//   }

//   // ── Submit credentials ────────────────────────────────────────────────────

//   const onSubmitCredentials = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     const id = identifier.includes('@')
//       ? identifier.trim().toLowerCase()
//       : identifier.trim()

//     if (!id || !password) {
//       setError('Preencha email/telefone e senha.')
//       return
//     }

//     setLoading(true)
//     try {
//       const res = await loginUser({ identifier: id, password })

//       if (res.twoFactorRequired && res.twoFactorSessionToken) {
//         // Backend requires 2FA — store session token and advance step
//         setSessionToken(res.twoFactorSessionToken)
//         setError('')
//         return
//       }

//       // Direct login (no 2FA)
//       saveAuthSession(res)
//       setSuccess('Sessão iniciada! A redirecionar...')
//       setTimeout(() => window.location.assign('/dashboard'), 600)
//     } catch (err) {
//       const next = Math.max(attempts - 1, 0)
//       setAttempts(next)
//       setError((err as Error).message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ── Submit 2FA ────────────────────────────────────────────────────────────
//   // Re-sends to POST /users/login with { identifier, password, twoFactorCode, twoFactorSessionToken }

//   const onSubmitTwoFactor = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     if (!sessionToken) return

//     if (totpCode.length !== 6) {
//       setError('Introduza o código de 6 dígitos.')
//       return
//     }

//     const id = identifier.includes('@')
//       ? identifier.trim().toLowerCase()
//       : identifier.trim()

//     setLoading(true)
//     try {
//       const res = await verifyTwoFactor(id, password, totpCode, sessionToken)
//       saveAuthSession(res)
//       setSuccess('2FA validado! A redirecionar...')
//       setTimeout(() => window.location.assign('/dashboard'), 600)
//     } catch (err) {
//       const next = twoFaAttempts + 1
//       setTwoFaAttempts(next)
//       setTotpDigits(['', '', '', '', '', ''])
//       digitRefs.current[0]?.focus()

//       if (next >= 3) {
//         setError('Demasiadas tentativas de 2FA. Tente novamente em 15 minutos.')
//       } else {
//         setError(`${(err as Error).message} — tentativa ${next} de 3.`)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const goBack = () => {
//     setSessionToken(null)
//     setTotpDigits(['', '', '', '', '', ''])
//     setTwoFaAttempts(0)
//     setError('')
//   }

//   // ── Render ────────────────────────────────────────────────────────────────

//   return (
//     <div className="auth-form">
//       <div className="form-header">
//         <div className="form-logo">
//           <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
//             <rect width="32" height="32" rx="10" fill="url(#g2)" />
//             <path d="M8 16 L14 22 L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//             <defs>
//               <linearGradient id="g2" x1="0" y1="0" x2="32" y2="32">
//                 <stop offset="0%" stopColor="#0EA5E9"/>
//                 <stop offset="100%" stopColor="#6366F1"/>
//               </linearGradient>
//             </defs>
//           </svg>
//           <span className="logo-text">NTUPAY</span>
//         </div>

//         {!is2FA ? (
//           <>
//             <h2>Bem-vindo de volta</h2>
//             <p>Aceda ao seu dashboard de merchant</p>
//           </>
//         ) : (
//           <>
//             <h2>Verificação em 2 etapas</h2>
//             <p>Abra a app autenticadora e introduza o código</p>
//           </>
//         )}
//       </div>

//       {success ? (
//         <div className="success-card">
//           <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
//             <circle cx="24" cy="24" r="24" fill="#052e16"/>
//             <path d="M14 24 L21 31 L34 17" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//           <strong>{success}</strong>
//         </div>
//       ) : !is2FA ? (
//         // ── Step 1: credentials form ──────────────────────────────────────
//         <form onSubmit={onSubmitCredentials} noValidate>
//           <div className="field-group">
//             <div className="field">
//               <label htmlFor="login-id">Email ou telefone</label>
//               <div className="input-wrap">
//                 <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                   <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>
//                 </svg>
//                 <input
//                   id="login-id"
//                   type="text"
//                   placeholder="email@exemplo.ao ou +2449XXXXXXXX"
//                   value={identifier}
//                   onChange={e => setIdentifier(e.target.value)}
//                   autoComplete="username"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="field">
//               <div className="label-row">
//                 <label htmlFor="login-pwd">Senha</label>
//                 <a href="/forgot-password" className="forgot-link">Esqueceu a senha?</a>
//               </div>
//               <div className="input-wrap">
//                 <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                   <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
//                 </svg>
//                 <input
//                   id="login-pwd"
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="Senha"
//                   value={password}
//                   onChange={e => setPassword(e.target.value)}
//                   autoComplete="current-password"
//                   required
//                 />
//                 <button type="button" className="eye-btn" onClick={() => setShowPassword(p => !p)} aria-label="Ver senha">
//                   {showPassword
//                     ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
//                     : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
//                   }
//                 </button>
//               </div>
//             </div>
//           </div>

//           {attempts < MAX_ATTEMPTS && (
//             <div className="attempts-bar">
//               <div className="attempts-dots">
//                 {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
//                   <span key={i} className={`dot ${i < attempts ? 'active' : 'used'}`} />
//                 ))}
//               </div>
//               <span className="attempts-text">
//                 {attempts > 0 ? `${attempts} tentativas restantes` : 'Conta bloqueada'}
//               </span>
//             </div>
//           )}

//           {error && (
//             <div className="alert alert-error">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
//               </svg>
//               {error}
//             </div>
//           )}

//           <button className="submit-btn" type="submit" disabled={loading || attempts <= 0}>
//             {loading
//               ? <><span className="spinner"/><span>A verificar...</span></>
//               : <><span>Entrar</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
//             }
//           </button>
//         </form>
//       ) : (
//         // ── Step 2: TOTP form ─────────────────────────────────────────────
//         <form onSubmit={onSubmitTwoFactor} noValidate>
//           <div className="totp-section">
//             <div className="totp-icon">
//               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
//               </svg>
//             </div>
//             <p className="totp-description">
//               O código renova-se a cada 30 segundos na app autenticadora.
//             </p>
//           </div>

//           <div className="otp-grid" onPaste={onDigitPaste}>
//             {totpDigits.map((d, i) => (
//               <input
//                 key={i}
//                 ref={el => { digitRefs.current[i] = el }}
//                 className={`otp-input ${d ? 'filled' : ''}`}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={1}
//                 value={d}
//                 onChange={e => onDigitChange(i, e.target.value)}
//                 onKeyDown={e => onDigitKeyDown(i, e)}
//                 autoFocus={i === 0}
//                 aria-label={`Dígito ${i + 1}`}
//               />
//             ))}
//           </div>

//           {error && (
//             <div className="alert alert-error">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
//               </svg>
//               {error}
//             </div>
//           )}

//           <button
//             className="submit-btn"
//             type="submit"
//             disabled={loading || totpCode.length !== 6 || twoFaAttempts >= 3}
//           >
//             {loading
//               ? <><span className="spinner"/><span>A validar...</span></>
//               : <><span>Confirmar código</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
//             }
//           </button>

//           <button type="button" className="back-btn" onClick={goBack}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M19 12H5M12 19l-7-7 7-7"/>
//             </svg>
//             Voltar ao login
//           </button>
//         </form>
//       )}
//     </div>
//   )
// }

import { useRef, useState } from 'react'
import { loginUser, verifyTwoFactor } from '../api/userApi'
import { saveAuthSession } from '../utils/authStorage'
import '../styles/authForms.css'

const MAX_ATTEMPTS = 5

export default function LoginForm() {
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

    const id = identifier.includes('@')
      ? identifier.trim().toLowerCase()
      : identifier.trim()

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

    const id = identifier.includes('@')
      ? identifier.trim().toLowerCase()
      : identifier.trim()

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
        <p>
          {is2FA
            ? 'Abra a app autenticadora e introduza o código'
            : 'Aceda ao seu dashboard'}
        </p>
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

              <label>Senha</label>

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

          <button
            className="submit-btn"
            type="submit"
            disabled={loading || attempts <= 0}
          >
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