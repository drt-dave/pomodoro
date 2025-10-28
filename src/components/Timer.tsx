/**
 * ===========================================================================
 * TIMER COMPONENT - Pomodoro Timer Display and Controls
 * ===========================================================================
 *
 * This component displays the countdown timer and provides controls to
 * start, pause, and reset the timer.
 *
 * KEY REACT CONCEPTS DEMONSTRATED:
 * ---------------------------------
 *
 * 1. FUNCTIONAL COMPONENTS
 *    Components are JavaScript functions that return JSX (React's HTML-like syntax)
 *
 * 2. CUSTOM HOOKS (usePomodoro)
 *    Reusable logic extracted into custom hooks for sharing state and functions
 *
 * 3. useEffect HOOK
 *    Runs side effects (like timers) and cleans them up properly
 *
 * 4. CONDITIONAL RENDERING
 *    Shows different UI based on state (e.g., "Pause" vs "Start" button)
 */

// Import React hooks from the React library
import { useEffect } from "react";

// Import our custom hook that provides Pomodoro timer state and functions
import { usePomodoro } from "../hooks/PomodoroContext";

/**
 * Timer Component
 * ---------------
 * A functional component that displays and controls the Pomodoro timer.
 *
 * WHAT IS A FUNCTIONAL COMPONENT?
 * A regular JavaScript function that returns JSX (UI elements).
 * Modern React primarily uses functional components instead of class components.
 *
 * COMPONENT NAMING CONVENTION:
 * - Component names must start with a capital letter (Timer, not timer)
 * - This tells React it's a component, not a regular HTML element
 */
export const Timer = () => {
  // ===========================================================================
  // CUSTOM HOOK USAGE - Consuming Context
  // ===========================================================================

  /**
   * DESTRUCTURING FROM CUSTOM HOOK
   * -------------------------------
   * We use the usePomodoro() hook to access shared state and functions.
   * This is called "destructuring" - extracting specific properties from an object.
   *
   * Without destructuring:
   *   const pomodoro = usePomodoro();
   *   const timeLeft = pomodoro.timeLeft;
   *   const isRunning = pomodoro.isRunning;
   *   // ... etc
   *
   * With destructuring (cleaner):
   *   const { timeLeft, isRunning, ... } = usePomodoro();
   *
   * WHAT WE'RE GETTING:
   * - timeLeft: number of seconds remaining
   * - setTimeLeft: function to update timeLeft
   * - isRunning: boolean indicating if timer is active
   * - startTimer: function to start the countdown
   * - pauseTimer: function to pause the countdown
   * - resetTimer: function to reset to default time
   */
  const { timeLeft, setTimeLeft, isRunning, startTimer, pauseTimer, resetTimer } = usePomodoro();

  // ===========================================================================
  // useEffect HOOK - Side Effect Management
  // ===========================================================================

  /**
   * THE useEffect HOOK
   * ------------------
   * useEffect lets you perform "side effects" in functional components.
   *
   * WHAT IS A SIDE EFFECT?
   * Any operation that affects something outside the component:
   * - Setting timers/intervals
   * - Fetching data from an API
   * - Directly manipulating the DOM
   * - Subscribing to external events
   *
   * SYNTAX:
   * useEffect(() => {
   *   // Effect code runs here
   *   return () => {
   *     // Cleanup code runs here (optional)
   *   };
   * }, [dependencies]);
   *
   * WHEN DOES IT RUN?
   * - After the component first renders
   * - After any re-render where dependencies changed
   *
   * WHY DO WE NEED IT FOR TIMERS?
   * We can't just use setInterval directly in the component body because:
   * 1. Component body runs on every render
   * 2. We'd create multiple intervals (memory leak!)
   * 3. useEffect ensures proper cleanup when component unmounts
   */
  useEffect(() => {
    /**
     * EARLY RETURN PATTERN (Guard Clause)
     * -----------------------------------
     * If timer is not running OR time is up, don't start an interval.
     * This prevents unnecessary work and potential bugs.
     *
     * Why check timeLeft <= 0?
     * When timer reaches zero, we want to stop automatically.
     */
    if (!isRunning || timeLeft <= 0) return;

    /**
     * CREATE THE INTERVAL
     * -------------------
     * setInterval runs a function repeatedly at specified intervals.
     *
     * Parameters:
     * - Callback function: what to run repeatedly
     * - Delay: 1000 milliseconds = 1 second
     *
     * setInterval returns an interval ID that we store in 'interval'.
     * We need this ID later to stop the interval (cleanup).
     */
    const interval = setInterval(() => {
      /**
       * UPDATE STATE WITH FUNCTIONAL UPDATE
       * ------------------------------------
       * setTimeLeft((prev) => prev - 1)
       *
       * WHY USE A FUNCTION INSTEAD OF JUST: setTimeLeft(timeLeft - 1)?
       *
       * Because 'timeLeft' might be stale inside the interval callback.
       * React state updates are asynchronous, and the interval closure
       * captures the timeLeft value from when the interval was created.
       *
       * Using the functional form (prev => prev - 1):
       * - 'prev' is guaranteed to be the LATEST value
       * - React ensures the update is based on current state
       * - Prevents race conditions and stale state bugs
       *
       * Example of the problem with non-functional update:
       *   timeLeft = 25
       *   setInterval starts, captures timeLeft = 25
       *   After 1 second: setTimeLeft(timeLeft - 1) => setTimeLeft(24)
       *   After 2 seconds: setTimeLeft(timeLeft - 1) => setTimeLeft(24) // WRONG! Still uses old timeLeft
       *
       * With functional update:
       *   After 1 second: setTimeLeft(prev => prev - 1) => 25 - 1 = 24
       *   After 2 seconds: setTimeLeft(prev => prev - 1) => 24 - 1 = 23 // CORRECT!
       */
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    /**
     * CLEANUP FUNCTION
     * ----------------
     * This function runs when:
     * 1. The component unmounts (is removed from the screen)
     * 2. Before the effect runs again (dependencies changed)
     *
     * WHY IS CLEANUP CRITICAL?
     * Without cleanup, intervals keep running even after component unmounts.
     * This causes:
     * - Memory leaks (intervals running forever)
     * - Errors (trying to update unmounted component state)
     * - Performance issues (multiple intervals running simultaneously)
     *
     * clearInterval(interval) stops the interval using its ID.
     */
    return () => clearInterval(interval);

    /**
     * DEPENDENCY ARRAY
     * ----------------
     * [isRunning, timeLeft, setTimeLeft]
     *
     * This array tells React: "Re-run this effect whenever any of these values change."
     *
     * - isRunning: When user starts/pauses, we need to start/stop the interval
     * - timeLeft: When time changes, we check if it reached zero
     * - setTimeLeft: Function from context (usually stable, but good practice to include)
     *
     * WHY IS THE DEPENDENCY ARRAY IMPORTANT?
     * - Empty array []: Effect runs once on mount
     * - No array: Effect runs after every render (usually bad!)
     * - With dependencies [a, b]: Effect runs when a or b changes
     *
     * React will warn you if you use a value inside the effect but don't
     * include it in the dependency array. This helps prevent bugs!
     */
  }, [isRunning, timeLeft, setTimeLeft]);

  // ===========================================================================
  // HELPER FUNCTION - Format Time Display
  // ===========================================================================

  /**
   * formatTime Function
   * -------------------
   * Converts seconds to MM:SS format for display.
   *
   * PARAMETERS:
   * @param seconds - The number to convert (e.g., 125)
   *
   * RETURN TYPE:
   * @returns string - Formatted time (e.g., "02:05")
   *
   * TYPE ANNOTATION:
   * (seconds: number): string
   * - Input parameter 'seconds' must be a number
   * - Function returns a string
   * TypeScript will error if you try to pass a string or return a number
   *
   * IMPLEMENTATION:
   * 1. Math.floor(seconds / 60) - Get whole minutes
   *    Example: 125 / 60 = 2.08... → Math.floor → 2
   *
   * 2. seconds % 60 - Get remaining seconds (modulo operator)
   *    Example: 125 % 60 = 5
   *
   * 3. .toString() - Convert number to string
   *
   * 4. .padStart(2, '0') - Ensure two digits by adding leading zeros
   *    Example: "2" → "02", "15" → "15"
   *
   * 5. Template literal (`${mins}:${secs}`) - Combine into "MM:SS" format
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ===========================================================================
  // JSX RETURN - Component UI
  // ===========================================================================

  /**
   * WHAT IS JSX?
   * ------------
   * JSX (JavaScript XML) is a syntax extension that looks like HTML but
   * is actually JavaScript. React transforms JSX into React.createElement() calls.
   *
   * JSX RULES:
   * 1. Must return a single parent element (here: <div className="timer">)
   * 2. Use className instead of class (class is a JavaScript keyword)
   * 3. Can embed JavaScript expressions inside {} curly braces
   * 4. Self-closing tags need a slash: <img /> not <img>
   *
   * COMPONENT STRUCTURE:
   * We return a timer UI with two sections:
   * - Time display (shows formatted countdown)
   * - Controls (buttons to start/pause/reset)
   */
  return (
    <div className="timer">
      {/* TIME DISPLAY SECTION */}
      <div className="time-display">
        {/**
         * EMBEDDING EXPRESSIONS IN JSX
         * ----------------------------
         * {formatTime(timeLeft)}
         *
         * The curly braces {} let us embed JavaScript expressions in JSX.
         * This calls our formatTime function with the current timeLeft value.
         *
         * Example: if timeLeft = 125, this displays "02:05"
         */}
        {formatTime(timeLeft)}
      </div>

      {/* TIMER CONTROLS SECTION */}
      <div className="timer-controls">
        {/**
         * CONDITIONAL RENDERING WITH TERNARY OPERATOR
         * --------------------------------------------
         * Syntax: condition ? valueIfTrue : valueIfFalse
         *
         * We use this pattern twice here:
         *
         * 1. For onClick handler:
         *    onClick={isRunning ? pauseTimer : startTimer}
         *    - If timer is running → call pauseTimer when clicked
         *    - If timer is paused → call startTimer when clicked
         *
         * 2. For button text:
         *    {isRunning ? '⏸ Pause' : '▶️ Start'}
         *    - If timer is running → show "Pause"
         *    - If timer is paused → show "Start"
         *
         * This creates a single button that toggles between two states.
         */}
        <button onClick={isRunning ? pauseTimer : startTimer}>
          {isRunning ? '⏸ Pause' : '▶️ Start'}
        </button>

        {/**
         * RESET BUTTON
         * ------------
         * onClick={resetTimer}
         *
         * Simple event handler: when clicked, call the resetTimer function.
         * This resets the timer to its default value and stops it.
         *
         * NOTE: We write onClick={resetTimer} NOT onClick={resetTimer()}
         * - onClick={resetTimer}   ✅ Pass the function (React calls it on click)
         * - onClick={resetTimer()} ❌ Call the function immediately (wrong!)
         */}
        <button onClick={resetTimer}>🔄 Reset</button>
      </div>
    </div>
  );
}; 

