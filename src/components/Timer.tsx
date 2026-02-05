import { useSound } from "../hooks/useSound";
import { useEffect, useState } from "react";
import { usePomodoro } from "../hooks/PomodoroContext";
import { useLanguage } from "../contexts/LanguageContext";
import type {PomodoroMode, PomodoroSession} from "../types/pomodoro.types";
import { ConfirmModal } from "./ConfirmModal";
import { formatTimeMMSS } from "../utils/formatTime";
import {ModeIndicator} from "./ModeIndicator";
import { Toast } from "./Toast";
import styles from './Timer.module.css';
import { requestNotificationPermission, sendNotification } from '../utils/notifications';
import { SettingsPanel } from './SettingsPanel';

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

  const { playWorkComplete, playBreakComplete } = useSound();

  const { translations } = useLanguage();

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
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
	if (!isRunning || timeLeft <= 0) return;

	const interval = setInterval(() => {
	  setTimeLeft((prev) => prev - 1);
	}, 1000);

	return () => clearInterval(interval);
  }, [isRunning, timeLeft, setTimeLeft]);

  useEffect(() => {
	if (timeLeft === 0 && !showConfirmModal) {

	  if (mode === 'work') {
		playWorkComplete();
	  } else {
		playBreakComplete();
	  }

	  const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;

	  const session: PomodoroSession = {
		tag: tag,
		duration: initialTime,
		timestamp: Date.now(),
		completed: true
	  };
	  saveSession(session);

	  const completionMessage = mode === 'work'
		? translations.workCompleted
		: translations.breakCompleted;

	  setToastData({
		message: completionMessage,
		duration: initialTime,
		type: mode
	  });
	  setShowToast(true);
	  // Browser notification
	  const notificationBody = mode === 'work'
		? translations.notificationWorkBody
		: translations.notificationBreakBody;
	  sendNotification(completionMessage, notificationBody);
	

	  const nextMode: PomodoroMode = mode === 'work' ? 'break' : 'work';
	  setMode(nextMode);

	  const nextDuration: number = nextMode === 'work' ? defaultWorkTime : defaultBreakTime;
	  setTimeLeft(nextDuration);

	  pauseTimer();
	}
  }, [timeLeft, showConfirmModal, mode, tag, defaultWorkTime, defaultBreakTime, saveSession, pauseTimer, setMode, setTimeLeft]);

  const handlerFinishSession = () => {
	const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;

	if (!isRunning && timeLeft === initialTime) {
	  return;
	}

	setWasRunningBeforeModal(isRunning);
	pauseTimer();
	setShowConfirmModal(true);
  }

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

  const cancelFinishSession = () => {
	setShowConfirmModal(false);

	if (wasRunningBeforeModal) {
	  startTimer();
	}
  }

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
			console.log(`Vi alklakis butonon! (${isRunning ? 'Pause' : 'Start'})`);
			if (!isRunning){
			  requestNotificationPermission();
			}
			isRunning ? pauseTimer() : startTimer();
		  }}
		  disabled={showConfirmModal}
		  className={styles.iconBtn}
		  aria-label={isRunning ? 'Pause' : 'Start'}
		>
		  {isRunning ? '⏸' : '▶'}
		</button>

		<button
		  onClick={() => {
			console.log('Vi alklakis butonon! (Reset)');
			resetTimer();
		  }}
		  className={styles.iconBtn}
		  aria-label="Reset"
		>
		  ↺
		</button>

		<button
		  onClick={() => {
			console.log('Vi alklakis butonon! (Finish)');
			handlerFinishSession();
		  }}
		  className={styles.iconBtn}
		  aria-label="Stop"
		>
		  ⏹
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
		onClose={() => setShowToast(false)}
	  />

	  <SettingsPanel
		isOpen={settingsOpen}
		onClose={() => setSettingsOpen(false)}
	  />
	</div>
  );
};
