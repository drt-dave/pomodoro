import {useEffect} from "react";
import {usePomodoro} from "../hooks/PomodoroContext";

export const Timer = () => { 

  const {timeLeft,setTimeLeft,  isRunning, startTimer, pauseTimer, resetTimer } = usePomodoro();

  useEffect(() => {
  	if (!isRunning || timeLeft <= 0) return;

	const interval = setInterval(() => { 
	  setTimeLeft((prev ) => prev - 1 );
	}, 1000);

	return () => clearInterval(interval);
  }, [isRunning, timeLeft, setTimeLeft]);

  const formatTime = (seconds: number): string => { 
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2,'0')}`
  }; 

  return (
	<div className="timer">
	  <div className="time-display">
		{formatTime(timeLeft)}
	  </div>
	  <div className="timer-controls">
		<button onClick={isRunning ? pauseTimer : startTimer}>
		  {isRunning ? '⏸Pause' : '▶️ start'}
		</button>
		<button onClick={resetTimer}>🔄 Reset</button>
	  </div>
	</div>
  );
} 

