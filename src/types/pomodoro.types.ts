/**
 * ===========================================================================
 * POMODORO TYPES - Type Definitions for the Pomodoro Application
 * ===========================================================================
 *
 * This file contains all TypeScript type definitions used across the app.
 * Types help catch errors during development and provide better IntelliSense.
 *
 * LEARNING NOTES:
 * ---------------
 *
 * 1. TYPE vs INTERFACE
 * ====================
 * Both 'type' and 'interface' can define object shapes, but have differences:
 *
 * - TYPE ALIAS: More flexible, can define unions, intersections, primitives
 *   Example: type ID = string | number;
 *   Example: type Status = 'active' | 'inactive';
 *
 * - INTERFACE: Best for object shapes, can be extended/implemented by classes
 *   Example: interface User { name: string; age: number; }
 *   Can be extended: interface Admin extends User { role: string; }
 *
 * Rule of thumb: Use 'type' for unions/primitives, 'interface' for objects.
 *
 * 2. UNION TYPES (|)
 * ==================
 * A union type means "one of these values". The | symbol means "OR".
 * Example: type Color = 'red' | 'blue' | 'green';
 * This means Color can ONLY be one of these three strings, nothing else.
 *
 * 3. EXPORTING TYPES
 * ==================
 * We export types so other files can import and use them.
 * Without 'export', types would only be available in this file.
 */

// ===========================================================================
// UNION TYPES
// ===========================================================================

/**
 * PomodoroMode
 * ------------
 * Represents the two possible states of a Pomodoro timer.
 *
 * This is a UNION TYPE with only two possible string values:
 * - 'work': The focus/work period (typically 25 minutes)
 * - 'break': The rest period (typically 5 minutes)
 *
 * WHY USE A UNION TYPE?
 * Instead of using just 'string', we restrict to only these two values.
 * This prevents typos and makes code safer:
 *
 * ❌ BAD (with string):  mode = 'wrk'  // typo, no error
 * ✅ GOOD (with union):  mode = 'wrk'  // TypeScript error!
 *
 * TypeScript will show an error if you try to assign anything other than
 * 'work' or 'break' to a variable of type PomodoroMode.
 */
export type PomodoroMode = 'work' | 'break';

// ===========================================================================
// INTERFACES
// ===========================================================================

/**
 * PomodoroState
 * -------------
 * Defines the shape of the main application state.
 *
 * This interface describes what properties our Pomodoro context must have.
 * Think of it as a contract: any object claiming to be PomodoroState
 * MUST have all these properties with the correct types.
 *
 * PROPERTY EXPLANATIONS:
 *
 * @property tag - The current category/tag for the session (e.g., "Work", "Study")
 *                 Type: string - can be any text
 *
 * @property mode - Whether we're in work or break mode
 *                  Type: PomodoroMode - can only be 'work' or 'break'
 *
 * @property timeLeft - Remaining seconds in the current session
 *                      Type: number - integer representing seconds
 *
 * @property isRunning - Whether the timer is currently counting down
 *                       Type: boolean - true (running) or false (paused)
 *
 * @property defaultWorkTime - Default duration for work sessions (in seconds)
 *                             Type: number - typically 1500 (25 minutes)
 *
 * @property defaultBreakTime - Default duration for break sessions (in seconds)
 *                              Type: number - typically 300 (5 minutes)
 *
 * EXAMPLE USAGE:
 * ```typescript
 * const state: PomodoroState = {
 *   tag: 'Study',
 *   mode: 'work',
 *   timeLeft: 1500,
 *   isRunning: false,
 *   defaultWorkTime: 1500,
 *   defaultBreakTime: 300
 * };
 * ```
 */
export interface PomodoroState {
  tag: string;
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  defaultWorkTime: number;
  defaultBreakTime: number;
}

/**
 * PomodoroSession
 * ---------------
 * Represents a completed (or in-progress) Pomodoro session.
 *
 * This interface is used to store historical data about each Pomodoro session
 * for statistics and tracking purposes.
 *
 * PROPERTY EXPLANATIONS:
 *
 * @property tag - The category this session belonged to (e.g., "Work", "Study")
 *                 Type: string - links the session to a specific category
 *
 * @property duration - How long the session lasted (in seconds)
 *                      Type: number - actual time spent, not target time
 *
 * @property timestamp - When the session occurred
 *                       Type: number - Unix timestamp (milliseconds since Jan 1, 1970)
 *                       Can be created with: Date.now() or new Date().getTime()
 *                       Can be converted back with: new Date(timestamp)
 *
 * @property completed - Whether the session was finished or abandoned
 *                       Type: boolean - true if user completed, false if stopped early
 *
 * EXAMPLE USAGE:
 * ```typescript
 * const session: PomodoroSession = {
 *   tag: 'Work',
 *   duration: 1500,           // 25 minutes in seconds
 *   timestamp: 1698765432000, // specific date/time
 *   completed: true           // user finished the full session
 * };
 * ```
 *
 * WHY STORE SESSIONS?
 * This data allows us to:
 * - Show statistics (total time per category, number of sessions, etc.)
 * - Track productivity over time
 * - Generate reports and visualizations
 * - Persist user history across app sessions
 */
export interface PomodoroSession {
  tag: string;
  duration: number;
  timestamp: number;
  completed: boolean;
}

