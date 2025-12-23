import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { PomodoroProvider } from './hooks/PomodoroContext.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <PomodoroProvider>
        <App />
      </PomodoroProvider>
    </ThemeProvider>
  </StrictMode>,
)
