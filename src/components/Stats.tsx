import { usePomodoro } from '../hooks/PomodoroContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatTimeDuration } from '../utils/formatTime';
import styles from './Stats.module.css';

export function Stats() {
  const { sessions } = usePomodoro();
  const { translations } = useLanguage();

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
	  <h2>{translations.statsTitle}</h2>

	  <div className={styles.statsContent}>
		<div className={styles.overallStats}>
		  <h3>{translations.overall}</h3>
		  <p>
			{translations.totalSessions} <strong>{totalSessions}</strong>
		  </p>
		  <p>
			{translations.totalTime} <strong>{formatTimeDuration(totalSeconds)}</strong>
		  </p>
		</div>

		<h3>{translations.byCategory}</h3>

		{sortedStats.length === 0 ? (
		  <p className={styles.emptyState}>
			{translations.noSessionsYet}
		  </p>
		) : (
		  <div className={styles.tagStatsList}>
			{sortedStats.map(({ tag, count, totalSeconds }) => (
			  <div key={tag} className={styles.tagStatCard}>
				<div className={styles.tagStatHeader}>
				  <h4>{tag}</h4>
				  <span className={styles.sessionBadge}>{count} {translations.sessions}</span>
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
				  {((count / totalSessions) * 100).toFixed(1)}% {translations.ofTotalSessions}
				</div>
			  </div>
			))}
		  </div>
		)}
		{sessions.length > 0 && (
		  <>
			<h3>{translations.sessionHistory}</h3>
			<div className={ styles.sessionList }>
			  {[...sessions].reverse().map((session) => (
				<div 
				  key={session.timestamp}
				  className={ styles.sessionItem }>
				  <div className={ styles.sessionHeader }>
					<span className={ styles.sessionDate }>
					  {new Date(session.timestamp).toLocaleDateString(undefined, {
						month: 'short',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					  })}
					</span>
					<span className={ styles.sessionTag }>
					  {session.tag}
					</span>
					<span className={ styles.sessionDuration }>
					  {formatTimeDuration(session.duration)}
					</span>
				  </div>
				  {session.note && (
					<p className={ styles.sessionNote }>{session.note}</p>
				  )}
				</div>

			  ))}
			</div>
		  </>
		)}
	  </div>
	</div>
  );
}
