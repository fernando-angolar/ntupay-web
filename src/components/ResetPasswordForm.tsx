// import { useEffect, useMemo, useState } from 'react'
// import { completePasswordReset, validatePasswordResetToken } from '../api/userApi'
// import '../styles/AuthForms.css'

// const PASSWORD_RULES = [
//   { label: 'mínimo 8 caracteres', test: (value: string) => value.length >= 8 },
//   { label: 'uma letra maiúscula', test: (value: string) => /[A-Z]/.test(value) },
//   { label: 'uma letra minúscula', test: (value: string) => /[a-z]/.test(value) },
//   { label: 'um número', test: (value: string) => /\d/.test(value) },
//   { label: 'um símbolo (@$!%*?&)', test: (value: string) => /[@$!%*?&.#_+=-]/.test(value) },
// ]

// interface ResetPasswordFormProps {
//   token: string
//   onBackToRequest: () => void
//   onBackToLogin: () => void
// }

// function getPasswordValidationMessage(password: string): string | null {
//   const failedRules = PASSWORD_RULES.filter((rule) => !rule.test(password))

//   if (failedRules.length === 0) return null

//   return `Senha fraca: faltam ${failedRules.map((rule) => rule.label).join(', ')}.`
// }

// export default function ResetPasswordForm({ token, onBackToRequest, onBackToLogin }: ResetPasswordFormProps) {
//   const [newPassword, setNewPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [loadingValidation, setLoadingValidation] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [tokenError, setTokenError] = useState('')
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')

//   const passwordStrengthError = useMemo(
//     () => getPasswordValidationMessage(newPassword),
//     [newPassword],
//   )

//   useEffect(() => {
//     let active = true

//     async function validateToken() {
//       setLoadingValidation(true)
//       setTokenError('')

//       try {
//         await validatePasswordResetToken(token)
//       } catch {
//         if (active) {
//           setTokenError('Link de recuperação inválido ou expirado. Solicite um novo link.')
//         }
//       } finally {
//         if (active) {
//           setLoadingValidation(false)
//         }
//       }
//     }

//     validateToken()

//     return () => {
//       active = false
//     }
//   }, [token])

//   const onSubmit = async (event: React.FormEvent) => {
//     event.preventDefault()
//     setError('')

//     if (passwordStrengthError) {
//       setError(passwordStrengthError)
//       return
//     }

//     if (newPassword !== confirmPassword) {
//       setError('As senhas não coincidem.')
//       return
//     }

//     setSubmitting(true)

//     try {
//       const response = await completePasswordReset({
//         token,
//         newPassword,
//         confirmPassword,
//       })

//       setSuccess(response.message || 'Senha alterada com sucesso. Redirecionando para o login...')
//       setTimeout(() => onBackToLogin(), 1800)
//     } catch (err) {
//       setError((err as Error).message)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (loadingValidation) {
//     return (
//       <div className="auth-form">
//         <div className="form-header">
//           <h2>Validando link de recuperação</h2>
//           <p>Aguarde alguns segundos...</p>
//         </div>
//       </div>
//     )
//   }

//   if (tokenError) {
//     return (
//       <div className="auth-form">
//         <div className="form-header">
//           <h2>Link inválido</h2>
//           <p>{tokenError}</p>
//         </div>

//         <button type="button" className="submit-btn" onClick={onBackToRequest}>
//           Solicitar novo link
//         </button>
//       </div>
//     )
//   }

//   return (
//     <form className="auth-form" onSubmit={onSubmit}>
//       <div className="form-header">
//         <h2>Definir nova senha</h2>
//         <p>Escolha uma senha forte e diferente da senha atual.</p>
//       </div>

//       <div className="field-group">
//         <div className="field">
//           <label>Nova senha</label>
//           <div className="input-wrap">
//             <input
//               type="password"
//               value={newPassword}
//               onChange={(event) => setNewPassword(event.target.value)}
//               autoComplete="new-password"
//             />
//           </div>
//         </div>

//         <div className="field">
//           <label>Confirmar nova senha</label>
//           <div className="input-wrap">
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(event) => setConfirmPassword(event.target.value)}
//               autoComplete="new-password"
//             />
//           </div>
//         </div>
//       </div>

//       {error && <div className="alert alert-error">{error}</div>}
//       {success && <div className="success-card">{success}</div>}

//       <button className="submit-btn" type="submit" disabled={submitting || Boolean(success)}>
//         {submitting ? 'A atualizar...' : 'Atualizar senha'}
//       </button>

//       <button className="back-btn" type="button" onClick={onBackToLogin}>
//         Voltar para login
//       </button>
//     </form>
//   )
// }

import { useEffect, useMemo, useState } from 'react'
import { completePasswordReset, validatePasswordResetToken } from '../api/userApi'
import '../styles/AuthForms.css'

const PASSWORD_RULES = [
  { label: 'mínimo 8 caracteres', test: (value: string) => value.length >= 8 },
  { label: 'uma letra maiúscula', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'uma letra minúscula', test: (value: string) => /[a-z]/.test(value) },
  { label: 'um número', test: (value: string) => /\d/.test(value) },
  { label: 'um símbolo (@$!%*?&)', test: (value: string) => /[@$!%*?&.#_+=-]/.test(value) },
]

interface ResetPasswordFormProps {
  token: string
  onBackToRequest: () => void
  onBackToLogin: () => void
}

function getPasswordValidationMessage(password: string): string | null {
  const failedRules = PASSWORD_RULES.filter((rule) => !rule.test(password))
  if (failedRules.length === 0) return null
  return `Senha fraca: faltam ${failedRules.map((rule) => rule.label).join(', ')}.`
}

export default function ResetPasswordForm({
  token,
  onBackToRequest,
  onBackToLogin,
}: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingValidation, setLoadingValidation] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [tokenError, setTokenError] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const passwordStrengthError = useMemo(
    () => getPasswordValidationMessage(newPassword),
    [newPassword],
  )

  useEffect(() => {
    let active = true

    async function validateToken() {
      setLoadingValidation(true)
      setTokenError('')

      try {
        // CORRIGIDO: antes verificava response.valid (que não existe no backend)
        // Agora basta a chamada não lançar erro — se o backend responder 200 o token é válido
        await validatePasswordResetToken(token)
      } catch {
        if (active) {
          setTokenError('Link de recuperação inválido ou expirado. Solicite um novo link.')
        }
      } finally {
        if (active) {
          setLoadingValidation(false)
        }
      }
    }

    validateToken()

    return () => {
      active = false
    }
  }, [token])

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (passwordStrengthError) {
      setError(passwordStrengthError)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setSubmitting(true)

    try {
      const response = await completePasswordReset({
        token,
        newPassword,
        confirmPassword,
      })

      setSuccess(response.message || 'Senha alterada com sucesso. A redirecionar...')
      setTimeout(() => onBackToLogin(), 1800)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingValidation) {
    return (
      <div className="auth-form">
        <div className="form-header">
          <h2>A validar link de recuperação</h2>
          <p>Aguarde alguns segundos...</p>
        </div>
      </div>
    )
  }

  if (tokenError) {
    return (
      <div className="auth-form">
        <div className="form-header">
          <h2>Link inválido</h2>
          <p>{tokenError}</p>
        </div>
        <button type="button" className="submit-btn" onClick={onBackToRequest}>
          Solicitar novo link
        </button>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <div className="form-header">
        <h2>Definir nova senha</h2>
        <p>Escolha uma senha forte e diferente da senha atual.</p>
      </div>

      <div className="field-group">
        <div className="field">
          <label>Nova senha</label>
          <div className="input-wrap">
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="field">
          <label>Confirmar nova senha</label>
          <div className="input-wrap">
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="success-card">{success}</div>}

      <button className="submit-btn" type="submit" disabled={submitting || Boolean(success)}>
        {submitting ? 'A atualizar...' : 'Atualizar senha'}
      </button>

      <button className="back-btn" type="button" onClick={onBackToLogin}>
        Voltar para login
      </button>
    </form>
  )
}