import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { PomodoroState, PomodoroMode, PomodoroSession } from '../types/pomodoro.types';
import { useSettings } from '../contexts/SettingsContext';


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
  renameTag: (oldName: string, newName: string) => void;
  showConfirmModal: boolean;
  setShowConfirmModal: (show: boolean) => void;
  wasRunningBeforeModal: boolean;
  setWasRunningBeforeModal: (wasRunning: boolean) => void;
  sessionNote: string;
  setSessionNote: (note: string) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

interface PomodoroProviderProps {
  children: ReactNode;
}

const SESSIONS_STORAGE_KEY = 'pomodoro_sessions';
const STATE_STORAGE_KEY = 'pomodoro_state';


interface PersistedState {
  tag: string;
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  showConfirmModal: boolean;
  wasRunningBeforeModal: boolean;
  sessionNote: string;
  targetEndTime: number | null;
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
  const { workDuration, breakDuration } = useSettings();

  const defaultWorkTime = workDuration;
  const defaultBreakTime = breakDuration;

  const [savedState] = useState(() => loadStateFromStorage());

  // Restore targetEndTime: if timer was running when page closed, recover it
  const [initialTimeState] = useState(() => {
	const restoredEndTime = savedState.targetEndTime ?? null;
	if (restoredEndTime !== null) {
	  const remaining = Math.ceil((restoredEndTime - Date.now()) / 1000);
	  if (remaining > 0) {
		return { timeLeft: remaining, isRunning: true, targetEndTime: restoredEndTime };
	  }
	  // Timer expired while page was closed — timeLeft=0 triggers completion effect
	  return { timeLeft: 0, isRunning: false, targetEndTime: null };
	}
	return {
	  timeLeft: savedState.timeLeft ?? defaultWorkTime,
	  isRunning: false,
	  targetEndTime: null
	};
  });

  const [tag, setTag] = useState<string>(savedState.tag ?? 'General');
  const [mode, setMode] = useState<PomodoroMode>(savedState.mode ?? 'work');
  const [timeLeft, setTimeLeft] = useState<number>(initialTimeState.timeLeft);
  const [isRunning, setIsRunning] = useState<boolean>(initialTimeState.isRunning);
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => loadSessionsFromStorage());
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(savedState.showConfirmModal ?? false);
  const [wasRunningBeforeModal, setWasRunningBeforeModal] = useState<boolean>(savedState.wasRunningBeforeModal ?? false);
  const [sessionNote, setSessionNote] = useState<string>(savedState.sessionNote ?? '');
  const [targetEndTime, setTargetEndTime] = useState<number | null>(initialTimeState.targetEndTime);

  // Track previous durations to detect settings changes
  const prevWorkDuration = useRef(defaultWorkTime);
  const prevBreakDuration = useRef(defaultBreakTime);

  // Wall-clock countdown: calculate remaining time from targetEndTime
  useEffect(() => {
	if (!isRunning || targetEndTime === null) return;

	const tick = () => {
	  const remaining = Math.ceil((targetEndTime - Date.now()) / 1000);
	  setTimeLeft(remaining <= 0 ? 0 : remaining);
	};

	tick(); // immediate sync
	const interval = setInterval(tick, 1000);
	return () => clearInterval(interval);
  }, [isRunning, targetEndTime]);

  // Instant resync when tab becomes visible again (no 1s delay)
  useEffect(() => {
	const handleVisibility = () => {
	  if (!document.hidden && isRunning && targetEndTime !== null) {
		const remaining = Math.ceil((targetEndTime - Date.now()) / 1000);
		setTimeLeft(remaining <= 0 ? 0 : remaining);
	  }
	};
	document.addEventListener('visibilitychange', handleVisibility);
	return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isRunning, targetEndTime]);

  // Sync timer when settings change ( only if at reset state )
  useEffect(() => {
	if (!isRunning) {
	  if (mode === 'work' && timeLeft === prevWorkDuration.current){
		setTimeLeft(defaultWorkTime);
	  } else if (mode === 'break' && timeLeft === prevBreakDuration.current) {
		setTimeLeft(defaultBreakTime);
	  }
	}
	prevWorkDuration.current = defaultWorkTime;
	prevBreakDuration.current = defaultBreakTime;
  }, [defaultWorkTime, defaultBreakTime, mode, timeLeft, isRunning]);

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
	  sessionNote,
	  targetEndTime
	});
  }, [tag, mode, timeLeft, isRunning, showConfirmModal, wasRunningBeforeModal, sessionNote, targetEndTime]);

  const startTimer = useCallback(() => {
	setTargetEndTime(Date.now() + timeLeft * 1000);
	setIsRunning(true);
  }, [timeLeft]);

  const pauseTimer = useCallback(() => {
	setTargetEndTime((prev) => {
	  if (prev !== null) {
		const remaining = Math.max(0, Math.ceil((prev - Date.now()) / 1000));
		setTimeLeft(remaining);
	  }
	  return null;
	});
	setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
	setTargetEndTime(null);
	setIsRunning(false);
	setTimeLeft(mode === 'work' ? defaultWorkTime : defaultBreakTime);
  }, [mode, defaultWorkTime, defaultBreakTime]);

  const saveSession = useCallback((session: PomodoroSession) => {
	setSessions((prev) => [...prev, {...session, note: sessionNote}]);
	setSessionNote('');
  }, [sessionNote]);

  const renameTag = useCallback((oldName: string, newName: string)=>{
	// Update all saved sessions that use the old tag name
	setSessions((prev) => prev.map((s) =>(s.tag === oldName ? {...s, tag: newName} : s))
			   );
	// Update the active tag if it matches
			   if (tag === oldName) {
				 setTag(newName);
			   }
  }, [tag]);

  return (
	<PomodoroContext.Provider
	  value={{
		defaultBreakTime,
		defaultWorkTime,
		isRunning,
		mode,
		pauseTimer,
		renameTag,
		resetTimer,
		saveSession,
		sessionNote,
		sessions,
		setIsRunning,
		setMode,
		setSessionNote,
		setSessions,
		setShowConfirmModal,
		setTag,
		setTimeLeft,
		setWasRunningBeforeModal,
		showConfirmModal,
		startTimer,
		tag,
		timeLeft,
		wasRunningBeforeModal,
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
