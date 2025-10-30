/**
 * Timer Component
 * Displays the Pomodoro countdown timer and provides controls.
 */

import { useEffect } from "react";
import { usePomodoro } from "../hooks/PomodoroContext";
import type {PomodoroSession} from "../types/pomodoro.types";

export const Timer = () => {
  const { timeLeft, setTimeLeft, isRunning, startTimer, pauseTimer, resetTimer, saveSession, tag, mode, defaultWorkTime, defaultBreakTime } = usePomodoro();

  // Timer interval effect
  useEffect(() => {
	if (!isRunning || timeLeft <= 0) return;

	const interval = setInterval(() => {
	  setTimeLeft((prev) => prev - 1);
	}, 1000);

	return () => clearInterval(interval);
  }, [isRunning, timeLeft, setTimeLeft]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlerFinishSession = () => {
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
  }

  return (
	<div className="timer">
	  <div className="time-display">
		{formatTime(timeLeft)}
	  </div>

	  <div className="timer-controls">
		<button onClick={isRunning ? pauseTimer : startTimer}>
		  {isRunning ? '⏸ Pause' : '▶️ Start'}
		</button>
		<button onClick={resetTimer}>🔄 Reset</button>
		<button
		  onClick={handlerFinishSession}
		  className="full-width-btn">FINISH</button>
	  </div>
	</div>
  );
};

