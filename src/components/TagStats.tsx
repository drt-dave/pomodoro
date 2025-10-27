import { usePomodoro } from '../hooks/PomodoroContext';

export function TagStats() {
  const { sessions } = usePomodoro();

  // Calculate statistics per tag
  const tagStats = sessions.reduce((acc, session) => {
    if (!acc[session.tag]) {
      acc[session.tag] = {
        count: 0,
        totalMinutes: 0,
      };
    }
    acc[session.tag].count += 1;
    acc[session.tag].totalMinutes += session.duration / 60;
    return acc;
  }, {} as Record<string, { count: number; totalMinutes: number }>);

  // Convert to array and sort by count
  const sortedStats = Object.entries(tagStats)
    .map(([tag, stats]) => ({ tag, ...stats }))
    .sort((a, b) => b.count - a.count);

  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration / 60, 0);

  return (
    <div className="stats-container">
      <h2>📊 Your Pomodoro Stats</h2>

      {/* Overall Stats */}
      <div className="overall-stats">
        <h3>Overall</h3>
        <p>🍅 Total Sessions: <strong>{totalSessions}</strong></p>
        <p>⏱️ Total Time: <strong>{Math.round(totalMinutes)} minutes</strong> ({(totalMinutes / 60).toFixed(1)} hours)</p>
      </div>

      {/* Per-Tag Stats */}
      <h3>By Category</h3>
      {sortedStats.length === 0 ? (
        <p className="empty-state">No completed sessions yet. Start a timer to see stats! 🚀</p>
      ) : (
        <div className="tag-stats-list">
          {sortedStats.map(({ tag, count, totalMinutes }) => (
            <div key={tag} className="tag-stat-card">
              <div className="tag-stat-header">
                <h4>{tag}</h4>
                <span className="session-badge">{count} sessions</span>
              </div>
              <div className="tag-stat-time">
                ⏱️ {Math.round(totalMinutes)} minutes ({(totalMinutes / 60).toFixed(1)} hours)
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(count / totalSessions) * 100}%` }}
                />
              </div>
              <div className="percentage-text">
                {((count / totalSessions) * 100).toFixed(1)}% of total sessions
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
