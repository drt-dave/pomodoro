/**
 * TagStats Component
 * Displays analytics about completed Pomodoro sessions.
 */

import { usePomodoro } from '../hooks/PomodoroContext';
import { formatTimeDuration } from '../utils/formatTime';
import styles from './TagStats.module.css';

export function TagStats() {
  const { sessions } = usePomodoro();

  // Aggregate sessions by tag
  const tagStats = sessions.reduce((acc, session) => {
    if (!acc[session.tag]) {
      acc[session.tag] = {
        count: 0,
        totalSeconds: 0,
      };
    }

    acc[session.tag].count += 1;
    acc[session.tag].totalSeconds += session.duration;

    return acc;
  }, {} as Record<string, { count: number; totalSeconds: number }>);

  // Convert to sorted array
  const sortedStats = Object.entries(tagStats)
    .map(([tag, stats]) => ({ tag, ...stats }))
    .sort((a, b) => b.count - a.count);

  // Calculate overall statistics
  const totalSessions = sessions.length;
  const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className={styles.statsContainer}>
      <h2>📊 Your Pomodoro Stats</h2>

      <div className={styles.statsContent}>
        <div className={styles.overallStats}>
          <h3>Overall</h3>
          <p>
            🍅 Total Sessions: <strong>{totalSessions}</strong>
          </p>
          <p>
            ⏱️ Total Time: <strong>{formatTimeDuration(totalSeconds)}</strong>
          </p>
        </div>

        <h3>By Category</h3>

        {sortedStats.length === 0 ? (
          <p className={styles.emptyState}>
            No completed sessions yet. Start a timer to see stats! 🚀
          </p>
        ) : (
          <div className={styles.tagStatsList}>
            {sortedStats.map(({ tag, count, totalSeconds }) => (
              <div key={tag} className={styles.tagStatCard}>
                <div className={styles.tagStatHeader}>
                  <h4>{tag}</h4>
                  <span className={styles.sessionBadge}>{count} sessions</span>
                </div>

                <div className={styles.tagStatTime}>
                  ⏱️ {formatTimeDuration(totalSeconds)}
                </div>

                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${(count / totalSessions) * 100}%` }}
                  />
                </div>

                <div className={styles.percentageText}>
                  {((count / totalSessions) * 100).toFixed(1)}% of total sessions
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
