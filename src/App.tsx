import { useState } from 'react';
import { usePomodoro } from './hooks/PomodoroContext';
import { Timer } from './components/Timer';
import { TagSelector } from './components/TagSelector';
import { TagStats } from './components/TagStats';
import './App.css';

type ViewType = 'timer' | 'stats';

function App() {
  const { tag, setTag, mode } = usePomodoro();
  const [activeView, setActiveView] = useState<ViewType>('timer');

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="logo-title">🍅 PomoDoroto</h1>
      </header>

      <main className="main-content">
        {activeView === 'timer' && (
          <>
            <div className="card timer-card">
              <Timer />
            </div>
            <div className="card tagselector-card">
              <TagSelector tag={tag} setTag={setTag} mode={mode} />
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
