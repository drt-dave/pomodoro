import { useState } from 'react';
import { usePomodoro } from './hooks/PomodoroContext';
import './App.css';

import { Timer } from './components/Timer';

type ViewType = 'timer' | 'stats';

function App() {
  const { tag } = usePomodoro();
  const [activeView, setActiveView] = useState<ViewType>('timer');

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="logo-title">🍅 Pomodoro</h1>
      </header>

      <main className="main-content">
        <p>Vista activa: {activeView}</p>
        <p>Tag actual: {tag}</p>
      </main>

      <footer className="bottom-nav">
        <div
          className={`nav-item ${activeView === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveView('timer')}
        >
          ⏱
		  <Timer/>
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



