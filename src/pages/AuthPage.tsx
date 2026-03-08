// import { useState } from 'react'
// import LoginForm from '../components/LoginForm'
// import RegisterForm from '../components/RegisterForm'
// import '../styles/global.css'

// type View = 'login' | 'register'

// export function AuthPage() {
//   const [view, setView] = useState<View>('login')

//   return (
//     <div className="auth-layout">
//       <nav className="auth-tabs">
//         <button
//           type="button"
//           className={`auth-tab ${view === 'login' ? 'active' : ''}`}
//           onClick={() => setView('login')}
//         >
//           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
//           </svg>
//           Entrar
//         </button>
//         <button
//           type="button"
//           className={`auth-tab ${view === 'register' ? 'active' : ''}`}
//           onClick={() => setView('register')}
//         >
//           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
//           </svg>
//           Criar conta
//         </button>
//       </nav>

//       <main className="auth-container">
//         {view === 'login' ? <LoginForm /> : <RegisterForm />}
//       </main>
//     </div>
//   )
// }

import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import "../styles/global.css";

type View = "login" | "register"

export function AuthPage() {
  const [view, setView] = useState<View>("login")

  return (
    <div className="auth-layout">
      
      <nav className="auth-tabs">
        <button
          type="button"
          className={`auth-tab ${view === "login" ? "active" : ""}`}
          onClick={() => setView("login")}
        >
          Entrar
        </button>

        <button
          type="button"
          className={`auth-tab ${view === "register" ? "active" : ""}`}
          onClick={() => setView("register")}
        >
          Criar conta
        </button>
      </nav>

      <div className="auth-container">
        {view === "login" ? <LoginForm /> : <RegisterForm />}
      </div>

    </div>
  )
}