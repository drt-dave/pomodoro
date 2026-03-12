import { useState } from "react";
import { Play, Pause, RotateCcw, Square } from "lucide-react";
import { usePomodoro } from "../hooks/pomodoro/PomodoroContext";
import { useTimerCompletion } from "../hooks/pomodoro/useTimerCompletion";
import { useFinishSession } from "../hooks/pomodoro/useFinishSession";
import { useLanguage } from "../contexts/LanguageContext";
import { ConfirmModal } from "./ConfirmModal";
import { formatTimeMMSS } from "../utils/formatTime";
import { ModeIndicator } from "./ModeIndicator";
import { Toast } from "./Toast";
import styles from './Timer.module.css';
import { requestNotificationPermission } from '../utils/notifications';
import { SettingsPanel } from './SettingsPanel';

export const Timer = () => {
  const {
	timeLeft,
	setTimeLeft,
	isRunning,
	startTimer,
	pauseTimer,
	stopTimer,
	resetTimer,
	tag,
	mode,
	setMode,
	defaultWorkTime,
	defaultBreakTime,
	showConfirmModal,
	saveSession,
  } = usePomodoro();

  const { translations } = useLanguage();

  const { showToast, toastData, closeToast } = useTimerCompletion({
	timeLeft,
	mode,
	tag,
	defaultWorkTime,
	defaultBreakTime,
	showConfirmModal,
	stopTimer,
	setMode,
	setTimeLeft,
	saveSession,
  });

  const { handleFinishSession, confirmFinishSession, cancelFinishSession } = useFinishSession();

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
	<div className={styles.timer}>
	  <ModeIndicator />

	  <div className={styles.timeWrapper}>
		<div
		  className={styles.timeDisplay}
		  onClick={() => setSettingsOpen(true)}
		>
		  {formatTimeMMSS(timeLeft)}
		</div>
	  </div>

	  <div className={styles.timerControls}>
		<button
		  onClick={() => {
			if (!isRunning){
			  requestNotificationPermission();
			}
			isRunning ? pauseTimer() : startTimer();
		  }}
		  disabled={showConfirmModal}
		  className={styles.iconBtn}
		  aria-label={isRunning ? 'Pause' : 'Start'}
		>
		  {isRunning ? <Pause size={20} /> : <Play size={20} />}
		</button>

		<button
		  onClick={resetTimer}
		  className={styles.iconBtn}
		  aria-label="Reset"
		>
		  <RotateCcw size={20} />
		</button>

		<button
		  onClick={handleFinishSession}
		  className={styles.iconBtn}
		  aria-label="Stop"
		>
		  <Square size={20} />
		</button>
	  </div>

	  <ConfirmModal
		isOpen={showConfirmModal}
		onConfirm={confirmFinishSession}
		onCancel={cancelFinishSession}
		title={translations.confirmFinish}
		message={translations.confirmFinishMessage}
	  />

	  <Toast
		isVisible={showToast}
		message={toastData.message}
		duration={toastData.duration}
		type={toastData.type}
		onClose={closeToast}
	  />

	  <SettingsPanel
		isOpen={settingsOpen}
		onClose={() => setSettingsOpen(false)}
	  />
	</div>
  );
};
