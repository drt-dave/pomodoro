import { useState } from 'react';
import { Moon, Sun, Timer as TimerIcon, BarChart3 } from 'lucide-react';
import { usePomodoro } from './hooks/pomodoro/PomodoroContext';
import { useTheme } from './contexts/ThemeContext';
import { useLanguage } from './contexts/LanguageContext';
import { Timer } from './components/Timer';
import { TagSelector } from './components/TagSelector';
import { Stats } from './components/Stats';
import './App.css';
import type {Language} from './utils/translations';
import {SessionNote} from './components/SessionNote';
import {Logo} from './components/Logo';
import {ErrorBoundary} from './components/ErrorBoundary';

type ViewType = 'timer' | 'stats';

function App() {
  const { tag, setTag, mode } = usePomodoro();
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState<ViewType>('timer');
  const { language, setLanguage, translations } = useLanguage();

  return (
	<div className="app">
	  <header className="app-header">
		<h1 className="logo-title"><Logo size={44} /> PomoDoroto</h1>
		<div className="header-controls">
		  <select
			className="language-select"
			value={language}
			onChange={(e) => setLanguage(e.target.value as Language)}
			aria-label="Select language"
		  >
			<option value="en">🇬🇧 </option>
			<option value="es">🇪🇸 </option>
			<option value="fr">🇫🇷 </option>
			<option value="eo">⭐ </option>
			<option value="ru">🇷🇺 </option>
		  </select>	<button
			className="theme-toggle"
			onClick={() => {
			  toggleTheme();
			}}
			aria-label="Toggle theme"
		  >
			{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
		  </button>
		</div>
	  </header>

	  <main className="main-content">
		{activeView === 'timer' && (
		  <ErrorBoundary
			fallbackTitle={translations.errorBoundaryTitle}
			fallbackMessage={translations.errorBoundaryMessage}
			fallbackResetLabel={translations.errorBoundaryReset}
		  >
			<div className="card tagselector-card">
			  <TagSelector tag={tag} setTag={setTag} mode={mode} />
			</div>

			<div className="card timer-card">
			  <Timer />
			</div>
			<SessionNote />
		  </ErrorBoundary>
		)}

		{activeView === 'stats' && (
		  <ErrorBoundary
			fallbackTitle={translations.errorBoundaryTitle}
			fallbackMessage={translations.errorBoundaryMessage}
			fallbackResetLabel={translations.errorBoundaryReset}
		  >
			<div className="card stats-card">
			  <Stats />
			</div>
		  </ErrorBoundary>
		)}
	  </main>

	  <footer className="bottom-nav">
		<button
		  type="button"
		  className={`nav-item ${activeView === 'timer' ? 'active' : ''}`}
		  onClick={() => {
			setActiveView('timer');
		  }}
		  aria-label='Timer view'
		>
		  <TimerIcon size={20} /> {translations.timerTab}
		</button>

		<button
		  type="button"
		  className={`nav-item ${activeView === 'stats' ? 'active' : ''}`}
		  onClick={() => {
			setActiveView('stats');
		  }}
		  aria-label='Stats view'
		>
		  <BarChart3 size={20} /> {translations.statsTab}
		</button>
	  </footer>
	</div>
  );
}

export default App;
