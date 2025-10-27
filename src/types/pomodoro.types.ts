// Basic types
export type PomodoroMode = 'work' | 'break';

export interface PomodoroState {
  tag: string;
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  defaultWorkTime: number;
  defaultBreakTime: number;
}

export interface PomodoroSession {
  tag: string;
  duration: number;
  timestamp: number;
  completed: boolean;
}

