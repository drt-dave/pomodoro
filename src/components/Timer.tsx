import { Play, Pause, RotateCcw, Square } from "lucide-react";
import { usePomodoro } from "../hooks/pomodoro/PomodoroContext";
import { useTimerCompletion } from "../hooks/pomodoro/useTimerCompletion";
import { useFinishSession } from "../hooks/pomodoro/useFinishSession";
import { useTimerEdit } from "../hooks/pomodoro/useTimerEdit";
import { useLanguage } from "../contexts/LanguageContext";
import { ConfirmModal } from "./ConfirmModal";
import { formatTimeMMSS } from "../utils/formatTime";
import { ModeIndicator } from "./ModeIndicator";
import { Toast } from "./Toast";
import styles from './Timer.module.css';
import { requestNotificationPermission } from '../utils/notifications';

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
	sessionDuration,
  } = usePomodoro();

  const { translations } = useLanguage();

  const { showToast, toastData, closeToast } = useTimerCompletion({
	timeLeft,
	mode,
	tag,
	defaultWorkTime,
	defaultBreakTime,
	showConfirmModal,
	sessionDuration,
	stopTimer,
	setMode,
	setTimeLeft,
	saveSession,
  });

  const { handleFinishSession, confirmFinishSession, cancelFinishSession } = useFinishSession();

  const {
	isEditing,
	editValue,
	inputRef,
	startEditing,
	confirmEdit,
	handleEditChange,
	handleEditKeyDown,
  } = useTimerEdit({
	isRunning,
	timeLeft,
	setTimeLeft,
  });

  return (
	<div className={styles.timer}>
	  <ModeIndicator />

	  <div className={styles.timeWrapper}>
		{isEditing ? (
		  <input
			ref={inputRef}
			className={styles.timeInput}
			value={editValue}
			onChange={(e) => handleEditChange(e.target.value)}
			onBlur={confirmEdit}
			onKeyDown={handleEditKeyDown}
			aria-label="Edit timer duration"
			maxLength={5}
		  />
		) : (
		  <div
			className={`${styles.timeDisplay} ${isRunning ? styles.timeDisplayDisabled : ''}`}
			onClick={startEditing}
			role="button"
			tabIndex={0}
			aria-label={isRunning ? 'Timer running' : 'Click to edit duration'}
		  >
			{formatTimeMMSS(timeLeft)}
		  </div>
		)}
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
	</div>
  );
};
