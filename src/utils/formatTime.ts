/**
 * Converts seconds to MM:SS format for countdown display.
 * @param seconds - The number of seconds to format
 * @returns Formatted string in MM:SS format (e.g., "02:05")
 */
export const formatTimeMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Converts seconds to human-readable duration for statistics display.
 * @param seconds - The number of seconds to format
 * @returns Formatted string like "5m 30s" or "2m" or "45 seconds"
 */
export const formatTimeDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
};


/**
 * Parses user-typed time string into seconds for inline timer editing.
 * @param input - A time string in "MM:SS" or bare minutes format (e.g., "25:00", "30")
 * @returns Duration in seconds (e.g., "25:00" → 1500), or null if input is invalid
 */
export const parseTimeInput = (input: string): number | null => {
  if (/[a-zA-Z]/.test(input)) return null;

  let mins: number;
  let secs: number;

  if (input.includes(':')) {
    const [m, s] = input.split(':', 2);
    mins = parseInt(m);
    secs = parseInt(s);
  } else {
    mins = parseInt(input);
    secs = 0;
  }

  if (isNaN(mins) || isNaN(secs)) return null;
  if (mins < 0 || mins > 60) return null;
  if (secs < 0 || secs > 59) return null;
  if (mins * 60 + secs === 0) return null;

  return mins * 60 + secs;
};
