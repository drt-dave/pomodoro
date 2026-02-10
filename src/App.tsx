import { useState } from 'react';
import { usePomodoro } from './hooks/PomodoroContext';
import { useTheme } from './contexts/ThemeContext';
import { useLanguage } from './contexts/LanguageContext';
import { Timer } from './components/Timer';
import { TagSelector } from './components/TagSelector';
import { TagStats } from './components/TagStats';
import './App.css';
import type {Language} from './utils/translations';
import {SessionNote} from './components/SessionNote';

type ViewType = 'timer' | 'stats';

function App() {
  const { tag, setTag, mode } = usePomodoro();
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState<ViewType>('timer');
  const { language, setLanguage, translations } = useLanguage();

  return (
	<div className="app">
	  <header className="app-header">
		<button
		  className="theme-toggle"
		  onClick={() => {
			toggleTheme();
		  }}
		  aria-label="Toggle theme"
		>
		  {theme === 'light' ? '🌙' : '☀️'}
		</button>
		<h1 className="logo-title">🍅 PomoDoroto</h1>
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
		</select>
	  </header>

	  <main className="main-content">
		{activeView === 'timer' && (
		  <>
			<div className="card tagselector-card">
			  <TagSelector tag={tag} setTag={setTag} mode={mode} />
			</div>

			<div className="card timer-card">
			  <Timer />
			</div>
			<SessionNote />
		  </>
		)}

		{activeView === 'stats' && (
		  <div className="card stats-card">
			<TagStats />
		  </div>
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
		  {translations.timerTab}
		</button>

		<button
		  type="button"
		  className={`nav-item ${activeView === 'stats' ? 'active' : ''}`}
		  onClick={() => {
			setActiveView('stats');
		  }}
		  aria-label='Stats view'
		>
		  {translations.statsTab}
		</button>
	  </footer>
	</div>
  );
}

export default App;
