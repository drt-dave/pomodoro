import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { PomodoroState, PomodoroMode, PomodoroSession } from '../types/pomodoro.types';

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
  showConfirmModal: boolean;
  setShowConfirmModal: (show: boolean) => void;
  wasRunningBeforeModal: boolean;
  setWasRunningBeforeModal: (wasRunning: boolean) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

interface PomodoroProviderProps {
  children: ReactNode;
}

const SESSIONS_STORAGE_KEY = 'pomodoro_sessions';
const STATE_STORAGE_KEY = 'pomodoro_state';

const defaultWorkTime = 25; //* 60;
const defaultBreakTime = 5; //* 60;

interface PersistedState {
  tag: string;
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  showConfirmModal: boolean;
  wasRunningBeforeModal: boolean;
}

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

const loadStateFromStorage = (): Partial<PersistedState> => {
  try {
	const stored = localStorage.getItem(STATE_STORAGE_KEY);
	if (stored) {
	  return JSON.parse(stored);
	}
  } catch (error) {
	console.error('Failed to load state from localStorage', error);
  }
  return {};
};

const saveStateToStorage = (state: PersistedState) => {
  try {
	localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
	console.error('Failed to save state to localStorage', error);
  }
};

export function PomodoroProvider({ children }: PomodoroProviderProps) {
  const savedState = loadStateFromStorage();

  const [tag, setTag] = useState<string>(savedState.tag ?? 'General');
  const [mode, setMode] = useState<PomodoroMode>(savedState.mode ?? 'work');
  const [timeLeft, setTimeLeft] = useState<number>(savedState.timeLeft ?? defaultWorkTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => loadSessionsFromStorage());
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(savedState.showConfirmModal ?? false);
  const [wasRunningBeforeModal, setWasRunningBeforeModal] = useState<boolean>(savedState.wasRunningBeforeModal ?? false);

  useEffect(() => {
	saveSessionsToStorage(sessions);
  }, [sessions]);

  useEffect(() => {
	saveStateToStorage({
	  tag,
	  mode,
	  timeLeft,
	  isRunning,
	  showConfirmModal,
	  wasRunningBeforeModal,
	});
  }, [tag, mode, timeLeft, isRunning, showConfirmModal, wasRunningBeforeModal]);

  const startTimer = useCallback(() => {
	setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
	setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
	setIsRunning(false);
	setTimeLeft(mode === 'work' ? defaultWorkTime : defaultBreakTime);
  }, [mode]);

  const saveSession = useCallback((session: PomodoroSession) => {
	setSessions((prev) => [...prev, session]);
  }, []);

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
		showConfirmModal,
		setShowConfirmModal,
		wasRunningBeforeModal,
		setWasRunningBeforeModal,
	  }}
	>
	  {children}
	</PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);

  if (context === undefined) {
	throw new Error('usePomodoro must be used within a PomodoroProvider');
  }

  return context;
}
