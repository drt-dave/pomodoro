/**
 * PomodoroContext.tsx
 * Context provider for managing Pomodoro timer state across the application.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { PomodoroState, PomodoroMode, PomodoroSession } from '../types/pomodoro.types';

/**
 * Context type definition extending base state with setters and actions.
 */
interface PomodoroContextType extends PomodoroState {
  setTag: (tag: string) => void;
  setMode: (mode: PomodoroMode) => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  setIsRunning: (running: boolean) => void;
  sessions: PomodoroSession[];
  setSessions: (sessions: PomodoroSession[]) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  saveSession: (session: PomodoroSession) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

interface PomodoroProviderProps {
  children: ReactNode;
}

const SESSIONS_STORAGE_KEY = 'pomodoro_sessions';

const loadSessionsFromStorage = (): PomodoroSession[] => {
  try {
	const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
	if (stored) {
	  return JSON.parse(stored);
	}
  } catch (error) {
	console.error('Failed to load sessions from localStorage', error);
  }
  return [];
};

const saveSessionsToStorage = (sessions: PomodoroSession[]) => {
  try {
	localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
	console.error('Failed to save sessions to localStorage', error);
  }
};

export function PomodoroProvider({ children }: PomodoroProviderProps) {
  const [tag, setTag] = useState<string>('General');
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => loadSessionsFromStorage());

  useEffect(() => {
	saveSessionsToStorage(sessions);
  }, [sessions]);

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

  const saveSession = (session: PomodoroSession) => {
	setSessions((prev) => [...prev, session]);
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
		sessions,
		setSessions,
		startTimer,
		pauseTimer,
		resetTimer,
		saveSession,
	  }}
	>
	  {children}
	</PomodoroContext.Provider>
  );
}

/**
 * Custom hook to access Pomodoro context.
 * Must be used within PomodoroProvider.
 */
export function usePomodoro() {
  const context = useContext(PomodoroContext);

  if (context === undefined) {
	throw new Error('usePomodoro must be used within a PomodoroProvider');
  }

  return context;
}
