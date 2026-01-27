import { useCallback } from 'react';
import {useSettings} from '../contexts/SettingsContext';

import workCompleteSound from '../assets/sounds/work-complete.mp3'; 
import breakCompleteSound from '../assets/sounds/break-complete.mp3'; 

export function useSound() {
  const { soundEnabled } = useSettings();

  const playWorkComplete = useCallback(() => { 
	if (soundEnabled) {
	  new Audio(workCompleteSound).play().catch(() => {});
	}
  },[soundEnabled]);

  const playBreakComplete = useCallback(() => { 
	if (soundEnabled) {
	  new Audio(breakCompleteSound).play().catch(() => {});
	}
  },[soundEnabled]);

  return { playWorkComplete, playBreakComplete };
}

