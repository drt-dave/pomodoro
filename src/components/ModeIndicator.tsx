import { useState, useEffect } from 'react'
import { usePomodoro } from '../hooks/PomodoroContext';

export const ModeIndicator = () => {
  const { 
	mode,
	setMode,
	isRunning,
	pauseTimer,
	timeLeft,
	setTimeLeft,
	defaultWorkTime,
	defaultBreakTime
  } = usePomodoro();

  // Store the time left for each mode separately
  const [ workTimeLeft, setWorkTimeLeft ] = useState(defaultWorkTime);
  const [ breakTimeLeft, setBreakTimeLeft ] = useState(defaultBreakTime);

  // When timeLeft changes, update the appropiate mode's stored time
  useEffect(() => {
	if (mode === 'work') {
	  setWorkTimeLeft(timeLeft);
	} else {
	  setBreakTimeLeft(timeLeft);
	}
  }, [timeLeft, mode]);

  const modeConfig = {
    work: {
      icon: '💼',
      label: 'Work Session',
      className: 'mode-indicator--work'
    },
    break: {
      icon: '☕',
      label: 'Break Time',
      className: 'mode-indicator--break'
    }
  } as const;

  const handleToggle = () => { 
	// Don't allow toggle while timer is running
	if (isRunning) return;

	// Switch to opposite mode
	const newMode = mode === 'work' ? 'break' : 'work';

	// Restore the saved time for the new mode
	const savedTime = newMode === 'work' ? workTimeLeft : breakTimeLeft;

	// Update mode and restore timer to where it was
	setMode(newMode);
	setTimeLeft(savedTime);
	pauseTimer();
  }; 

  const config = modeConfig[mode];
  const nextMode = mode === 'work' ? 'break' : 'work'

  return (
    <div 
	  className={`mode-indicator ${config.className} ${!isRunning ? 'mode-indicator--clickable' : 'mode-indicator--disabled'}`}
	  onClick={handleToggle}
	  role="button"
	  tabIndex={isRunning ? -1 : 0}
	  aria-label={isRunning ? 'Timer Running - pause to switch modes' : `Click to switch to ${nextMode} mode`}
	>
      <span className="mode-indicator__icon" aria-hidden="true">
        {config.icon}
      </span>
      <span className="mode-indicator__label">
        {config.label}
      </span>
    </div>
  );
};
