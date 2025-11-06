/**
 * Time Formatting Utilities
 * Provides various time formatting functions for the Pomodoro application.
 */

/**
 * Format seconds to MM:SS format (for countdown timer display)
 * @param seconds - The number of seconds to format
 * @returns Formatted string in MM:SS format
 * @example formatTimeMMSS(125) => "02:05"
 */
export const formatTimeMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format seconds to human-readable duration (for statistics display)
 * @param seconds - The number of seconds to format
 * @returns Formatted string like "5m 30s" or "2m" or "45 seconds"
 * @example formatTimeDuration(330) => "5m 30s"
 * @example formatTimeDuration(120) => "2m"
 * @example formatTimeDuration(45) => "45 seconds"
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
