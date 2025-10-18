import { createContext, useContext, useState, ReactNode } from 'react';
import type { PomodoroState, PomodoroMode } from '../types/pomodoro.types';

// 1. Define the context interface
interface PomodoroContextType extends PomodoroState {
  setTag: (tag: string) => void;
  setMode: (mode: PomodoroMode) => void;
  setTimeLeft: (time: number) => void;
  setIsRunning: (running: boolean) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

// 2. Create the context
const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

// 3. Provider props
interface PomodoroProviderProps {
  children: ReactNode;
}

// 4. Create the Provider
export function PomodoroProvider({ children }: PomodoroProviderProps) {
  const [tag, setTag] = useState<string>('General');
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const defaultWorkTime = 25 * 60;
  const defaultBreakTime = 5 * 60;

  const startTimer = () => {
	setIsRunning(true);
  };

  const pauseTimer = () => {
	setIsRunning(false);
  };

  const resetTimer = () => {
	setIsRunning(false);
	setTimeLeft(mode === 'work' ? defaultWorkTime : defaultBreakTime);
  };

  return (
	<PomodoroContext.Provider
	  value={{
		tag,
		mode,
		timeLeft,
		isRunning,
		defaultWorkTime,
		defaultBreakTime,
		setTag,
		setMode,
		setTimeLeft,
		setIsRunning,
		startTimer,
		pauseTimer,
		resetTimer,
	  }}
	>
	  {children}
	</PomodoroContext.Provider>
  );
}

// 5. Custom hook to use the context
export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
	throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
}
