import { useCallback, useEffect, useMemo, useState } from 'react'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import ResetPasswordForm from '../components/ResetPasswordForm'
import '../styles/global.css'


type View = 'login' | 'register' | 'forgotPassword' | 'resetPassword'

function parseRoute(pathname: string): { view: View; token: string | null } {
  const resetMatch = pathname.match(/^\/reset-password\/([^/]+)$/)

  if (resetMatch) {
    return {
      view: 'resetPassword',
      token: decodeURIComponent(resetMatch[1]),
    }
  }

// import { useState } from 'react'
// import LoginForm from '../components/LoginForm'
// import RegisterForm from '../components/RegisterForm'
// import "../styles/global.css";
    if (pathname === '/forgot-password') {
    return { view: 'forgotPassword', token: null }
  }

// type View = "login" | "register"
  return { view: 'login', token: null }
}

export function AuthPage() {
  // const [view, setView] = useState<View>("login")
    const initialRoute = useMemo(() => parseRoute(window.location.pathname), [])
  const [view, setView] = useState<View>(initialRoute.view)
  const [resetToken, setResetToken] = useState<string | null>(initialRoute.token)

  const navigate = useCallback((nextView: View, token: string | null = null) => {
    const path =
      nextView === 'forgotPassword'
        ? '/forgot-password'
        : nextView === 'resetPassword' && token
          ? `/reset-password/${encodeURIComponent(token)}`
          : '/'

    window.history.pushState({}, '', path)
    setView(nextView)
    setResetToken(token)
  }, [])

  useEffect(() => {
    const onPopState = () => {
      const route = parseRoute(window.location.pathname)
      setView(route.view)
      setResetToken(route.token)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return (
    <div className="auth-layout">

      {/* <nav className="auth-tabs">
        <button
          type="button"
          className={`auth-tab ${view === "login" ? "active" : ""}`}
          onClick={() => setView("login")}
        >
          Entrar
        </button> */}
        {(view === 'login' || view === 'register') && (
        <nav className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${view === 'login' ? 'active' : ''}`}
            onClick={() => navigate('login')}
          >
            Entrar
          </button>

        {/* <button
          type="button"
          className={`auth-tab ${view === "register" ? "active" : ""}`}
          onClick={() => setView("register")}
        >
          Criar conta
        </button>
      </nav> */}
      <button
            type="button"
            className={`auth-tab ${view === 'register' ? 'active' : ''}`}
            onClick={() => navigate('register')}
          >
            Criar conta
          </button>
        </nav>
      )}

      <div className="auth-container">
        {/* {view === "login" ? <LoginForm /> : <RegisterForm />} */}
        {view === 'login' && <LoginForm onForgotPassword={() => navigate('forgotPassword')} />}
        {view === 'register' && <RegisterForm />}
        {view === 'forgotPassword' && (
          <ForgotPasswordForm onBackToLogin={() => navigate('login')} />
        )}
        {view === 'resetPassword' && resetToken && (
          <ResetPasswordForm
            token={resetToken}
            onBackToRequest={() => navigate('forgotPassword')}
            onBackToLogin={() => navigate('login')}
          />
        )}
      </div>

    </div>
  )
}