/**
 * Timer Component
 * Displays the Pomodoro countdown timer and provides controls.
 */

import { useEffect } from "react";
import { usePomodoro } from "../hooks/PomodoroContext";
import type {PomodoroSession} from "../types/pomodoro.types";
import { ConfirmModal } from "./ConfirmModal";
import { formatTimeMMSS } from "../utils/formatTime";
import {ModeIndicator} from "./ModeIndicator";

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
	defaultWorkTime,
	defaultBreakTime,
	showConfirmModal,
	setShowConfirmModal,
	wasRunningBeforeModal,
	setWasRunningBeforeModal
  } = usePomodoro();

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
	  const session: PomodoroSession = {
		tag:tag,
		duration: initialTime, //Full duration since completed
		timestamp: Date.now(),
		completed: true, //Actually completed (not ended early)
	  };
	  saveSession(session);
	  pauseTimer(); //Stop the timer
	  resetTimer(); //Reset back to default time
	  //TODO: Play sound, show notification,etc.
	}
  }, [ timeLeft, showConfirmModal, mode, tag, defaultWorkTime, defaultBreakTime, saveSession, pauseTimer, resetTimer ]);

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
	<div className="timer">
		
	  <ModeIndicator />
	  <div className="time-display">
		{formatTimeMMSS(timeLeft)}
	  </div>

	  <div className="timer-controls">
		<button 
		  onClick={isRunning ? pauseTimer : startTimer}
		  disabled={showConfirmModal}
		>
		  {isRunning ? '⏸ Pause' : '▶️ Start'}
		</button>
		<button onClick={resetTimer}>🔄 Reset</button>
		<button
		  onClick={handlerFinishSession}
		  className="full-width-btn">FINISH</button>
	  </div>

	  <ConfirmModal
		isOpen={showConfirmModal}
		onConfirm={confirmFinishSession}
		onCancel={cancelFinishSession}
		title="Finish Session?"
		message="Are you sure you want to end this Pomodoro session early?"
	  />
	</div>
  );
};

