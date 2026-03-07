import { useState } from 'react'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'

type AuthView = 'login' | 'register'

export function AuthPage() {
  const [view, setView] = useState<AuthView>('login')

  return (
    <>
      <nav className="auth-switch">
        <button
          type="button"
          className={view === 'login' ? 'active' : ''}
          onClick={() => setView('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={view === 'register' ? 'active' : ''}
          onClick={() => setView('register')}
        >
          Criar conta
        </button>
      </nav>
      {view === 'login' ? <LoginPage /> : <RegisterPage />}
    </>
  )
}