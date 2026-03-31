import {screen, render} from '@testing-library/react'
import { describe , expect} from 'vitest'
import App from './App'
import {PomodoroProvider} from './hooks/pomodoro/PomodoroContext'
import {SettingsProvider} from './contexts/SettingsContext'
import {LanguageProvider} from './contexts/LanguageContext'
import {ThemeProvider} from './contexts/ThemeContext'

describe("Setup verification", () => {
  it("should render the timer", () => {
    render(
      <SettingsProvider>
        <LanguageProvider>
          <ThemeProvider>
            <PomodoroProvider>
              <App/>
            </PomodoroProvider>
          </ThemeProvider>
        </LanguageProvider>
      </SettingsProvider>
    )
    expect(screen.getByText('25:00')).toBeTruthy()

  })
}) 
