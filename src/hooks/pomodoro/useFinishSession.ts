import { useCallback } from 'react';
import type { PomodoroSession } from '../../types/pomodoro.types';
import { usePomodoro } from './PomodoroContext';

export function useFinishSession() {
  const {
    mode,
    isRunning,
    timeLeft,
    tag,
    defaultWorkTime,
    defaultBreakTime,
    pauseTimer,
    startTimer,
    resetTimer,
    saveSession,
    setShowConfirmModal,
    wasRunningBeforeModal,
    setWasRunningBeforeModal,
  } = usePomodoro();

  const handleFinishSession = useCallback(() => {
    const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;

    if (!isRunning && timeLeft === initialTime) {
      return;
    }

    setWasRunningBeforeModal(isRunning);
    pauseTimer();
    setShowConfirmModal(true);
  }, [mode, isRunning, timeLeft, defaultWorkTime, defaultBreakTime, pauseTimer, setShowConfirmModal, setWasRunningBeforeModal]);

  const confirmFinishSession = useCallback(() => {
    const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;
    const duration = initialTime - timeLeft;

    const session: PomodoroSession = {
      tag,
      duration,
      timestamp: Date.now(),
      completed: true,
    };

    saveSession(session);
    resetTimer();
    setShowConfirmModal(false);
  }, [mode, timeLeft, tag, defaultWorkTime, defaultBreakTime, saveSession, resetTimer, setShowConfirmModal]);

  const cancelFinishSession = useCallback(() => {
    setShowConfirmModal(false);

    if (wasRunningBeforeModal) {
      startTimer();
    }
  }, [wasRunningBeforeModal, startTimer, setShowConfirmModal]);

  return { handleFinishSession, confirmFinishSession, cancelFinishSession };
}
