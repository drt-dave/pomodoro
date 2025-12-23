import { useState } from 'react';
import { usePomodoro } from './hooks/PomodoroContext';
import { useTheme } from './contexts/ThemeContext';
import { Timer } from './components/Timer';
import { TagSelector } from './components/TagSelector';
import { TagStats } from './components/TagStats';
import './App.css';

type ViewType = 'timer' | 'stats';

function App() {
  const { tag, setTag, mode } = usePomodoro();
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState<ViewType>('timer');

  return (
	<div className="app">
	  <header className="app-header">
		<h1 className="logo-title">🍅 PomoDoroto</h1>
		<button
		  className="theme-toggle"
		  onClick={toggleTheme}
		  aria-label="Toggle theme"
		>
		  {theme === 'light' ? '🌙' : '☀️'}
		</button>
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
		  </>
		)}

		{activeView === 'stats' && (
		  <div className="card stats-card">
			<TagStats />
		  </div>
		)}
	  </main>

	  <footer className="bottom-nav">
		<div
		  className={`nav-item ${activeView === 'timer' ? 'active' : ''}`}
		  onClick={() => setActiveView('timer')}
		>
		  ⏱️<span>Timer</span>
		</div>

		<div
		  className={`nav-item ${activeView === 'stats' ? 'active' : ''}`}
		  onClick={() => setActiveView('stats')}
		>
		  📊<span>Stats</span>
		</div>
	  </footer>
	</div>
  );
}

export default App;
