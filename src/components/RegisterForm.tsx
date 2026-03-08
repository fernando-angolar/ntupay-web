// import { useState } from 'react'
// import { registerUser } from '../api/userApi'
// import type { UserRegistrationRequest } from '../types'
// import '../styles/authForms.css'

// const EMPTY: UserRegistrationRequest = {
//   name: '',
//   email: '',
//   phone: '',
//   password: '',
//   confirmPassword: '',
//   accountType: 'MERCHANT',
// }

// const PASSWORD_HINT =
//   'Mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo (ex: @$!%*?&)'

// function PasswordStrength({ password }: { password: string }) {
//   if (!password) return null

//   const checks = [
//     password.length >= 8,
//     /[A-Z]/.test(password),
//     /[a-z]/.test(password),
//     /\d/.test(password),
//     /[@$!%*?&.#_+=\-]/.test(password),
//   ]
//   const score = checks.filter(Boolean).length
//   const label = ['', 'Fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'][score]
//   const cls = ['', 'weak', 'weak', 'fair', 'good', 'strong'][score]

//   return (
//     <div className="password-strength">
//       <div className="strength-bars">
//         {[1, 2, 3, 4, 5].map((i) => (
//           <span key={i} className={`bar ${i <= score ? cls : ''}`} />
//         ))}
//       </div>
//       {label && <span className={`strength-label ${cls}`}>{label}</span>}
//     </div>
//   )
// }

// export function RegisterForm() {
//   const [form, setForm] = useState<UserRegistrationRequest>(EMPTY)
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirm, setShowConfirm] = useState(false)

//   const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
//   }

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setMessage('')
//     setError('')

//     if (form.password !== form.confirmPassword) {
//       setError('A senha e a confirmação não coincidem.')
//       return
//     }

//     setLoading(true)
//     try {
//       const res = await registerUser(form)
//       setMessage(res.message || 'Conta criada! Verifique o seu email para activar a conta.')
//       setForm(EMPTY)
//     } catch (err) {
//       setError((err as Error).message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form className="auth-form" onSubmit={onSubmit} noValidate>
//       <div className="form-header">
//         <div className="form-logo">
//           <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
//             <rect width="32" height="32" rx="10" fill="url(#g1)" />
//             <path d="M8 16 L14 22 L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//             <defs>
//               <linearGradient id="g1" x1="0" y1="0" x2="32" y2="32">
//                 <stop offset="0%" stopColor="#0EA5E9"/>
//                 <stop offset="100%" stopColor="#6366F1"/>
//               </linearGradient>
//             </defs>
//           </svg>
//           <span className="logo-text">NTUPAY</span>
//         </div>
//         <h2>Criar conta</h2>
//         <p>Comece a receber pagamentos hoje mesmo</p>
//       </div>

//       {message ? (
//         <div className="success-card">
//           <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
//             <circle cx="24" cy="24" r="24" fill="#052e16" />
//             <path d="M14 24 L21 31 L34 17" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//           <strong>Conta criada com sucesso!</strong>
//           <p>{message}</p>
//         </div>
//       ) : (
//         <>
//           <div className="field-group">
//             <div className="field">
//               <label htmlFor="reg-name">Nome completo</label>
//               <div className="input-wrap">
//                 <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                   <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
//                 </svg>
//                 <input id="reg-name" name="name" type="text" placeholder="João Silva" value={form.name} onChange={onChange} required autoComplete="name"/>
//               </div>
//             </div>

//             <div className="field">
//               <label htmlFor="reg-email">Email</label>
//               <div className="input-wrap">
//                 <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                   <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>
//                 </svg>
//                 <input id="reg-email" name="email" type="email" placeholder="joao@empresa.ao" value={form.email} onChange={onChange} required autoComplete="email"/>
//               </div>
//             </div>

//             <div className="field">
//               <label htmlFor="reg-phone">
//                 Telefone
//                 <span className="field-hint">Angola (+244)</span>
//               </label>
//               <div className="input-wrap">
//                 <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                   <path d="M6.5 2h11A1.5 1.5 0 0 1 19 3.5v17A1.5 1.5 0 0 1 17.5 22h-11A1.5 1.5 0 0 1 5 20.5v-17A1.5 1.5 0 0 1 6.5 2z"/><circle cx="12" cy="18" r="1"/>
//                 </svg>
//                 <input id="reg-phone" name="phone" type="tel" placeholder="+2449XXXXXXXX" value={form.phone} onChange={onChange} required autoComplete="tel" pattern="^\+2449\d{8}$"/>
//               </div>
//             </div>

//             <div className="field">
//               <label htmlFor="reg-accountType">Tipo de conta</label>
//               <div className="input-wrap select-wrap">
//                 <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                   <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
//                 </svg>
//                 <select id="reg-accountType" name="accountType" value={form.accountType} onChange={onChange}>
//                   <option value="MERCHANT">Merchant — aceitar pagamentos</option>
//                   <option value="PARTNER">Partner — integração técnica</option>
//                 </select>
//                 <svg className="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M6 9l6 6 6-6"/>
//                 </svg>
//               </div>
//             </div>

//             <div className="field">
//               <label htmlFor="reg-password">Senha</label>
//               <div className="input-wrap">
//                 <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                   <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
//                 </svg>
//                 <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Senha segura" value={form.password} onChange={onChange} required autoComplete="new-password"/>
//                 <button type="button" className="eye-btn" onClick={() => setShowPassword(p => !p)} aria-label="Mostrar senha">
//                   {showPassword
//                     ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
//                     : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
//                   }
//                 </button>
//               </div>
//               <PasswordStrength password={form.password} />
//               <small className="hint">{PASSWORD_HINT}</small>
//             </div>

//             <div className="field">
//               <label htmlFor="reg-confirmPassword">Confirmar senha</label>
//               <div className={`input-wrap ${form.confirmPassword && form.password !== form.confirmPassword ? 'input-error' : ''}`}>
//                 <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                   <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
//                 </svg>
//                 <input id="reg-confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Repetir senha" value={form.confirmPassword} onChange={onChange} required autoComplete="new-password"/>
//                 <button type="button" className="eye-btn" onClick={() => setShowConfirm(p => !p)} aria-label="Mostrar confirmação">
//                   {showConfirm
//                     ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
//                     : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
//                   }
//                 </button>
//               </div>
//               {form.confirmPassword && form.password !== form.confirmPassword && (
//                 <small className="field-error-msg">As senhas não coincidem</small>
//               )}
//             </div>
//           </div>

//           {error && (
//             <div className="alert alert-error">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
//               </svg>
//               {error}
//             </div>
//           )}

//           <button className="submit-btn" type="submit" disabled={loading}>
//             {loading ? (
//               <><span className="spinner"/><span>A criar conta...</span></>
//             ) : (
//               <><span>Criar conta</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
//             )}
//           </button>
//         </>
//       )}
//     </form>
//   )
// }

import { useState } from 'react'
import { registerUser } from '../api/userApi'
import type { UserRegistrationRequest } from '../types'
import '../styles/authForms.css'

const EMPTY: UserRegistrationRequest = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  accountType: 'MERCHANT',
}

export default function RegisterForm() {

  const [form, setForm] = useState<UserRegistrationRequest>(EMPTY)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    setError('')
    setMessage('')

    if (form.password !== form.confirmPassword) {
      setError('A senha e a confirmação não coincidem.')
      return
    }

    setLoading(true)

    try {

      const res = await registerUser(form)

      setMessage(res.message || 'Conta criada com sucesso.')

      setForm(EMPTY)

    } catch (err) {

      setError((err as Error).message)

    } finally {

      setLoading(false)

    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit}>

      <div className="form-header">
        <h2>Criar conta</h2>
        <p>Comece a receber pagamentos</p>
      </div>

      {message ? (
        <div className="success-card">
          <strong>{message}</strong>
        </div>
      ) : (
        <>
          <div className="field-group">

            <div className="field">
              <label>Nome</label>
              <div className="input-wrap">
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Nome completo"
                />
              </div>
            </div>

            <div className="field">
              <label>Email</label>
              <div className="input-wrap">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="field">
              <label>Telefone</label>
              <div className="input-wrap">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="+2449XXXXXXXX"
                />
              </div>
            </div>

            <div className="field">
              <label>Tipo de conta</label>
              <div className="input-wrap">
                <select
                  name="accountType"
                  value={form.accountType}
                  onChange={onChange}
                >
                  <option value="MERCHANT">Merchant</option>
                  <option value="PARTNER">Partner</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Senha</label>
              <div className="input-wrap">
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="field">
              <label>Confirmar senha</label>
              <div className="input-wrap">
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={onChange}
                />
              </div>
            </div>

          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'A criar conta...' : 'Criar conta'}
          </button>
        </>
      )}
    </form>
  )
}