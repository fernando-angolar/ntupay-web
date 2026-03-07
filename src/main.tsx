import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { RegisterPage } from './pages/RegisterPage.tsx'
import { AuthPage } from './pages/AuthPage'
import './index.css'
// import App from './App.tsx'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthPage />
  </StrictMode>,
)
