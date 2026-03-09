// import { useState } from 'react'
// import { requestPasswordReset } from '../api/userApi'
// import '../styles/AuthForms.css'

// const GENERIC_SUCCESS_MESSAGE =
//   'Se o email estiver cadastrado, você receberá instruções de recuperação.'

// interface ForgotPasswordFormProps {
//   onBackToLogin: () => void
//   onRateLimit?: () => void
// }

// export default function ForgotPasswordForm({ onBackToLogin, onRateLimit }: ForgotPasswordFormProps) {
//   const [email, setEmail] = useState('')
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const onSubmit = async (event: React.FormEvent) => {
//     event.preventDefault()
//     setError('')
//     setMessage('')

//     if (!email.trim()) {
//       setError('Informe um email válido.')
//       return
//     }

//     setLoading(true)

//     try {
//       await requestPasswordReset({ email: email.trim().toLowerCase() })
//       setMessage(GENERIC_SUCCESS_MESSAGE)
//     } catch (err) {
//       const messageText = (err as Error).message

//       if (messageText.includes('5 minutos') || messageText.includes('429')) {
//         onRateLimit?.()
//         setError('Aguarde 5 minutos antes de solicitar novo link.')
//       } else {
//         setMessage(GENERIC_SUCCESS_MESSAGE)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form className="auth-form" onSubmit={onSubmit}>
//       <div className="form-header">
//         <h2>Recuperar senha</h2>
//         <p>Insira o email da sua conta merchant para receber o link de recuperação.</p>
//       </div>

//       <div className="field-group">
//         <div className="field">
//           <label>Email</label>
//           <div className="input-wrap">
//             <input
//               type="email"
//               placeholder="merchant@empresa.ao"
//               autoComplete="email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       {error && <div className="alert alert-error">{error}</div>}
//       {message && <div className="success-card">{message}</div>}

//       <button className="submit-btn" type="submit" disabled={loading}>
//         {loading ? 'A processar...' : 'Recuperar Senha'}
//       </button>

//       <button className="back-btn" type="button" onClick={onBackToLogin}>
//         Voltar para login
//       </button>
//     </form>
//   )
// }

import { useState } from 'react'
import { AxiosError } from 'axios'
import { requestPasswordReset } from '../api/userApi'
import '../styles/AuthForms.css'

const GENERIC_SUCCESS_MESSAGE =
  'Se o email estiver cadastrado, você receberá instruções de recuperação.'

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
  onRateLimit?: () => void
}

export default function ForgotPasswordForm({
  onBackToLogin,
  onRateLimit,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!email.trim()) {
      setError('Informe um email válido.')
      return
    }

    setLoading(true)

    try {
      await requestPasswordReset({ email: email.trim().toLowerCase() })
      setMessage(GENERIC_SUCCESS_MESSAGE)
    } catch (err) {
      // CORRIGIDO: antes usava string matching frágil (messageText.includes('5 minutos'))
      // Agora detecta rate limit pelo status HTTP 429 — robusto e independente da mensagem
      const axiosError = err as AxiosError
      if (axiosError.response?.status === 429) {
        onRateLimit?.()
        setError('Aguarde 5 minutos antes de solicitar novo link.')
      } else {
        // Para qualquer outro erro, mostramos a mensagem genérica por segurança
        // (não revelar se o email existe ou não)
        setMessage(GENERIC_SUCCESS_MESSAGE)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <div className="form-header">
        <h2>Recuperar senha</h2>
        <p>Insira o email da sua conta merchant para receber o link de recuperação.</p>
      </div>

      <div className="field-group">
        <div className="field">
          <label>Email</label>
          <div className="input-wrap">
            <input
              type="email"
              placeholder="merchant@empresa.ao"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="success-card">{message}</div>}

      <button className="submit-btn" type="submit" disabled={loading}>
        {loading ? 'A processar...' : 'Recuperar Senha'}
      </button>

      <button className="back-btn" type="button" onClick={onBackToLogin}>
        Voltar para login
      </button>
    </form>
  )
}