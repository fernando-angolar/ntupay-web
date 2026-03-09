// import { useState } from 'react'
// import { registerUser } from '../api/userApi'
// import type { UserRegistrationRequest } from '../types'
// import '../styles/AuthForms.css'

// const EMPTY: UserRegistrationRequest = {
//   name: '',
//   email: '',
//   phone: '',
//   password: '',
//   confirmPassword: '',
//   accountType: 'MERCHANT',
// }

// export default function RegisterForm() {

//   const [form, setForm] = useState<UserRegistrationRequest>(EMPTY)

//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const onChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }))
//   }

//   const onSubmit = async (e: React.FormEvent) => {

//     e.preventDefault()

//     setError('')
//     setMessage('')

//     if (form.password !== form.confirmPassword) {
//       setError('A senha e a confirmação não coincidem.')
//       return
//     }

//     setLoading(true)

//     try {

//       const res = await registerUser(form)

//       setMessage(res.message || 'Conta criada com sucesso.')

//       setForm(EMPTY)

//     } catch (err) {

//       setError((err as Error).message)

//     } finally {

//       setLoading(false)

//     }
//   }

//   return (
//     <form className="auth-form" onSubmit={onSubmit}>

//       <div className="form-header">
//         <h2>Criar conta</h2>
//         <p>Comece a receber pagamentos</p>
//       </div>

//       {message ? (
//         <div className="success-card">
//           <strong>{message}</strong>
//         </div>
//       ) : (
//         <>
//           <div className="field-group">

//             <div className="field">
//               <label>Nome</label>
//               <div className="input-wrap">
//                 <input
//                   name="name"
//                   value={form.name}
//                   onChange={onChange}
//                   placeholder="Nome completo"
//                 />
//               </div>
//             </div>

//             <div className="field">
//               <label>Email</label>
//               <div className="input-wrap">
//                 <input
//                   name="email"
//                   type="email"
//                   value={form.email}
//                   onChange={onChange}
//                 />
//               </div>
//             </div>

//             <div className="field">
//               <label>Telefone</label>
//               <div className="input-wrap">
//                 <input
//                   name="phone"
//                   value={form.phone}
//                   onChange={onChange}
//                   placeholder="+2449XXXXXXXX"
//                 />
//               </div>
//             </div>

//             <div className="field">
//               <label>Tipo de conta</label>
//               <div className="input-wrap">
//                 <select
//                   name="accountType"
//                   value={form.accountType}
//                   onChange={onChange}
//                 >
//                   <option value="MERCHANT">Merchant</option>
//                   <option value="PARTNER">Partner</option>
//                 </select>
//               </div>
//             </div>

//             <div className="field">
//               <label>Senha</label>
//               <div className="input-wrap">
//                 <input
//                   name="password"
//                   type="password"
//                   value={form.password}
//                   onChange={onChange}
//                 />
//               </div>
//             </div>

//             <div className="field">
//               <label>Confirmar senha</label>
//               <div className="input-wrap">
//                 <input
//                   name="confirmPassword"
//                   type="password"
//                   value={form.confirmPassword}
//                   onChange={onChange}
//                 />
//               </div>
//             </div>

//           </div>

//           {error && <div className="alert alert-error">{error}</div>}

//           <button className="submit-btn" type="submit" disabled={loading}>
//             {loading ? 'A criar conta...' : 'Criar conta'}
//           </button>
//         </>
//       )}
//     </form>
//   )
// }


import { useState } from 'react'
import { registerUser } from '../api/userApi'
import type { UserRegistrationRequest } from '../types'
import '../styles/AuthForms.css'

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
                  autoComplete="name"
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
                  placeholder="email@empresa.ao"
                  autoComplete="email"
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
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="field">
              <label>Tipo de conta</label>
              <div className="input-wrap">
                <select name="accountType" value={form.accountType} onChange={onChange}>
                  <option value="MERCHANT">Merchant — aceitar pagamentos</option>
                  <option value="PARTNER">Partner — integração técnica</option>
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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
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