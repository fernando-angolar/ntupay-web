import React, { useState } from 'react'
import { registerUser } from '../api/userApi'
import type { UserRegistrationRequest } from '../types'

const initialState: UserRegistrationRequest = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  accountType: 'MERCHANT'
}

export function RegisterFrom() {
  const [form, setForm] = useState<UserRegistrationRequest>(initialState)
  const [message, setMessage] = useState<String>('') 
  const [error, setError] = useState<String>('') 
  const [loading, setloading] = useState<boolean>(false) 

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value}))
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(''),
    setError(''),
    setloading(true)

    try {
      const response = await registerUser(form)
      setMessage(response.message)
      setForm(initialState)
    } catch (requestError) {
      setError((requestError as Error).message)
    } finally {
      setloading(false)
    }
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <h1>Criar Conta NTUPAY</h1>
      <p>Registe-se para começar a receber pagamentos.</p>

      <input name="name" placeholder="Nome completo" value={form.name} onChange={onChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
      <input name="phone" placeholder="Telefone (+2449XXXXXXXX)" value={form.phone} onChange={onChange} required />
      <select name="accountType" value={form.accountType} onChange={onChange}>
        <option value="MERCHANT">Merchant</option>
        <option value="PARTNER">Partner</option>
      </select>
      <input name="password" type="password" placeholder="Senha" value={form.password} onChange={onChange} required />
      <input name="confirmPassword" type="password" placeholder="Confirmar senha" value={form.confirmPassword} onChange={onChange} required />

      <button disabled={loading} type="submit">{loading ? 'A criar...' : 'Criar Conta'}</button>
      {message && <span className="success">{message}</span>}
      {error && <span className="error">{error}</span>}
    </form>
  )
}