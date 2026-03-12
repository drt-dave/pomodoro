import { useEffect, useState, useCallback } from 'react';
import type { PomodoroMode, PomodoroSession } from '../../types/pomodoro.types';
import { useSound } from '../useSound';
import { useLanguage } from '../../contexts/LanguageContext';
import { sendNotification } from '../../utils/notifications';

interface ToastData {
  message: string;
  duration: number;
  type: 'work' | 'break';
}

interface UseTimerCompletionProps {
  timeLeft: number;
  mode: PomodoroMode;
  tag: string;
  defaultWorkTime: number;
  defaultBreakTime: number;
  showConfirmModal: boolean;
  stopTimer: () => void;
  setMode: (mode: PomodoroMode) => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  saveSession: (session: PomodoroSession) => void;
}

export function useTimerCompletion({
  timeLeft,
  mode,
  tag,
  defaultWorkTime,
  defaultBreakTime,
  showConfirmModal,
  stopTimer,
  setMode,
  setTimeLeft,
  saveSession,
}: UseTimerCompletionProps) {
  const { playWorkComplete, playBreakComplete } = useSound();
  const { translations } = useLanguage();

  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState<ToastData>({
    message: '',
    duration: 0,
    type: 'work',
  });

  useEffect(() => {
    if (timeLeft === 0 && !showConfirmModal) {
      if (mode === 'work') {
        playWorkComplete();
      } else {
        playBreakComplete();
      }

      const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;

      const session: PomodoroSession = {
        tag,
        duration: initialTime,
        timestamp: Date.now(),
        completed: true,
      };
      saveSession(session);

      const completionMessage = mode === 'work'
        ? translations.workCompleted
        : translations.breakCompleted;

      setToastData({
        message: completionMessage,
        duration: initialTime,
        type: mode,
      });
      setShowToast(true);

      const notificationBody = mode === 'work'
        ? translations.notificationWorkBody
        : translations.notificationBreakBody;
      sendNotification(completionMessage, notificationBody);

      stopTimer();

      const nextMode: PomodoroMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);

      const nextDuration = nextMode === 'work' ? defaultWorkTime : defaultBreakTime;
      setTimeLeft(nextDuration);
    }
  }, [timeLeft, showConfirmModal, mode, tag, defaultWorkTime, defaultBreakTime, saveSession, stopTimer, setMode, setTimeLeft]);

  const closeToast = useCallback(() => setShowToast(false), []);

  return { showToast, toastData, closeToast };
}
