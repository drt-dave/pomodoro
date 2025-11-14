import { useEffect, useState } from "react";
import { usePomodoro } from "../hooks/PomodoroContext";
import type {PomodoroMode, PomodoroSession} from "../types/pomodoro.types";
import { ConfirmModal } from "./ConfirmModal";
import { formatTimeMMSS } from "../utils/formatTime";
import {ModeIndicator} from "./ModeIndicator";
import { Toast } from "./Toast";
import styles from './Timer.module.css';

export const Timer = () => {
  const {
	timeLeft,
	setTimeLeft,
	isRunning,
	startTimer,
	pauseTimer,
	resetTimer,
	saveSession,
	tag,
	mode,
	setMode,
	defaultWorkTime,
	defaultBreakTime,
	showConfirmModal,
	setShowConfirmModal,
	wasRunningBeforeModal,
	setWasRunningBeforeModal
  } = usePomodoro();

  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState<{
	message: string;
	duration: number;
	type: 'work' | 'break';
  }>({
	message: '',
	duration: 0,
	type: 'work'
  });

  // Timer interval effect
  useEffect(() => {
	if (!isRunning || timeLeft <= 0) return;

	const interval = setInterval(() => {
	  setTimeLeft((prev) => prev - 1);
	}, 1000);

	return () => clearInterval(interval);
  }, [isRunning, timeLeft, setTimeLeft]);

  //Handle timer completion
  useEffect(() => {
	if( timeLeft === 0 && !showConfirmModal){
	  //Timer naturally completed
	  const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;
	  //1. Save the completed session
	  const session: PomodoroSession = {
		tag:tag,
		duration: initialTime, //Full duration since completed
		timestamp: Date.now(),
		completed: true, //Actually completed (not ended early)
	  };
	  saveSession(session);

	  // Show completion notification
	  const completionMessage = mode === 'work' 
	  ? '✅ Work session completed!'
	  : '☕ Break completed!';

	  setToastData({
		message: completionMessage,
		duration: initialTime,
		type: mode
	  });
	  setShowToast(true);

	  // 2. Determine next mode and switch
	  const nextMode: PomodoroMode = mode === 'work' ? 'break' : 'work';
	  setMode(nextMode);

	  // 3. Set timer to new mode's default duration
	  const nextDuration : number = nextMode === 'work' ? defaultWorkTime : defaultBreakTime;
	  setTimeLeft(nextDuration);

	  // 4. Keep timer paused (don't autostart)
	  pauseTimer(); 
	  //TODO: Play sound, show notification,etc.
	}
  }, [ timeLeft, showConfirmModal, mode, tag, defaultWorkTime, defaultBreakTime, saveSession, pauseTimer, setMode, setTimeLeft ]);

  // Stop timer and show confirmation modal
  const handlerFinishSession = () => {
	const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;

	// Don't allow finishing if timer hasn't been used at all
	if (!isRunning && timeLeft === initialTime) {
	  return; // Do nothing - timer was never started
	}

	setWasRunningBeforeModal(isRunning);
	pauseTimer();
	setShowConfirmModal(true);
  }

  // Actually finish the session after user confirms
  const confirmFinishSession = () => {
	const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;
	const duration = initialTime - timeLeft;

	const session: PomodoroSession = {
	  tag: tag,
	  duration: duration,
	  timestamp: Date.now(),
	  completed: true,
	};

	saveSession(session);
	resetTimer();
	setShowConfirmModal(false);
  }

  // Cancel finish and resume timer if it was running
  const cancelFinishSession = () => {
	setShowConfirmModal(false);
	if (wasRunningBeforeModal) {
	  startTimer();
	}
  }

  return (
	<div className={styles.timer}>

	  <ModeIndicator />
	  <div className={styles.timeDisplay}>
		{formatTimeMMSS(timeLeft)}
	  </div>

	  <div className={styles.timerControls}>
		<button
		  onClick={isRunning ? pauseTimer : startTimer}
		  disabled={showConfirmModal}
		>
		  {isRunning ? '⏸ Pause' : '▶️ Start'}
		</button>
		<button onClick={resetTimer}>🔄 Reset</button>
		<button
		  onClick={handlerFinishSession}
		  className={styles.fullWidthBtn}>FINISH</button>
	  </div>

	  <ConfirmModal
		isOpen={showConfirmModal}
		onConfirm={confirmFinishSession}
		onCancel={cancelFinishSession}
		title="Finish Session?"
		message="Are you sure you want to end this Pomodoro session early?"
	  />
	  <Toast
		isVisible={showToast}
		message={toastData.message}
		duration={toastData.duration}
		type={toastData.type}
		onClose={()=> setShowToast(false)}
	  />
	</div>
  );
};

