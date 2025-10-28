/**
 * ===========================================================================
 * TAG STATS COMPONENT - Session Statistics Display
 * ===========================================================================
 *
 * This component displays analytics about completed Pomodoro sessions:
 * - Overall statistics (total sessions, total time)
 * - Per-category breakdown with progress bars
 * - Sorted by most-used categories
 *
 * KEY REACT + JAVASCRIPT CONCEPTS DEMONSTRATED:
 * ----------------------------------------------
 *
 * 1. DATA TRANSFORMATION with .reduce()
 *    Converting array of sessions into aggregated statistics
 *
 * 2. OBJECT MANIPULATION
 *    Working with dynamic object keys and values
 *
 * 3. ARRAY METHODS CHAINING
 *    Using .map(), .sort(), .reduce() together
 *
 * 4. CONDITIONAL RENDERING
 *    Showing different UI for empty vs populated data
 *
 * 5. INLINE STYLES with JavaScript
 *    Dynamically calculating CSS values based on data
 *
 * 6. DESTRUCTURING in .map()
 *    Extracting object properties elegantly
 */

import { usePomodoro } from '../hooks/PomodoroContext';

/**
 * TagStats Component
 * ------------------
 * A presentational component that calculates and displays session statistics.
 *
 * NO LOCAL STATE:
 * This component doesn't use useState - it's a "pure" component that just
 * transforms props/context data into UI. This makes it easy to test and reason about.
 *
 * DATA FLOW:
 * 1. Get sessions array from context
 * 2. Transform sessions into statistics
 * 3. Render statistics with visual elements
 */
export function TagStats() {
  // ===========================================================================
  // CONTEXT DATA
  // ===========================================================================

  /**
   * Get sessions array from PomodoroContext.
   * This is the raw data - an array of PomodoroSession objects.
   *
   * Example sessions array:
   * [
   *   { tag: 'Work', duration: 1500, timestamp: 1698765432000, completed: true },
   *   { tag: 'Study', duration: 1500, timestamp: 1698765433000, completed: true },
   *   { tag: 'Work', duration: 1500, timestamp: 1698765434000, completed: true },
   * ]
   */
  const { sessions } = usePomodoro();

  // ===========================================================================
  // DATA TRANSFORMATION #1: Aggregate sessions by tag
  // ===========================================================================

  /**
   * THE .reduce() METHOD - Aggregating Data
   * ----------------------------------------
   * .reduce() is one of the most powerful array methods. It "reduces" an array
   * to a single value by applying a function to each element.
   *
   * SYNTAX:
   * array.reduce((accumulator, currentItem) => {
   *   // Transform accumulator based on currentItem
   *   return newAccumulator;
   * }, initialValue);
   *
   * PARAMETERS:
   * - accumulator (acc): The value being built up (starts as initialValue)
   * - currentItem: The current array element being processed
   * - initialValue: Starting value for the accumulator
   *
   * In our case:
   * - accumulator (acc): An object mapping tag names to statistics
   * - currentItem (session): Each PomodoroSession in the sessions array
   * - initialValue: {} (empty object)
   *
   * WHAT WE'RE BUILDING:
   * {
   *   'Work': { count: 2, totalMinutes: 50 },
   *   'Study': { count: 1, totalMinutes: 25 }
   * }
   */
  const tagStats = sessions.reduce((acc, session) => {
    /**
     * STEP 1: Initialize tag entry if it doesn't exist
     * -------------------------------------------------
     * On first encounter of a tag, create an entry with count: 0, totalMinutes: 0
     *
     * acc[session.tag] checks if this tag already exists in the accumulator.
     * If not, we initialize it.
     *
     * Example:
     * First 'Work' session: acc['Work'] doesn't exist → create it
     * Second 'Work' session: acc['Work'] exists → skip initialization
     */
    if (!acc[session.tag]) {
      acc[session.tag] = {
        count: 0,         // Number of sessions for this tag
        totalMinutes: 0,  // Total time spent on this tag
      };
    }

    /**
     * STEP 2: Update statistics for this tag
     * ---------------------------------------
     * Increment the session count and add the duration.
     *
     * session.duration is in SECONDS (from PomodoroSession type)
     * We divide by 60 to convert to MINUTES for easier display
     */
    acc[session.tag].count += 1;                       // Add 1 to session count
    acc[session.tag].totalMinutes += session.duration / 60; // Add minutes

    /**
     * STEP 3: Return the updated accumulator
     * ---------------------------------------
     * .reduce() requires us to return the accumulator on each iteration.
     * The returned value becomes the accumulator for the next iteration.
     *
     * IMPORTANT: We must return acc, not the modified property!
     */
    return acc;

    /**
     * TYPE ANNOTATION:
     * {} as Record<string, { count: number; totalMinutes: number }>
     *
     * This tells TypeScript the accumulator's type:
     * - Record<string, ...>: An object with string keys
     * - { count: number; totalMinutes: number }: Value type for each key
     *
     * Record<K, V> is a utility type meaning "object with keys of type K and values of type V"
     * Equivalent to: { [key: string]: { count: number; totalMinutes: number } }
     */
  }, {} as Record<string, { count: number; totalMinutes: number }>);

  // ===========================================================================
  // DATA TRANSFORMATION #2: Convert object to sorted array
  // ===========================================================================

  /**
   * CHAINING ARRAY METHODS
   * -----------------------
   * We chain three methods together to transform our data:
   * 1. Object.entries() - Convert object to array of [key, value] pairs
   * 2. .map() - Transform each pair into a nicer format
   * 3. .sort() - Order by most sessions first
   */

  /**
   * STEP 1: Object.entries()
   * -------------------------
   * Converts an object into an array of [key, value] pairs.
   *
   * Input (tagStats):
   * { 'Work': { count: 2, totalMinutes: 50 }, 'Study': { count: 1, totalMinutes: 25 } }
   *
   * Output:
   * [
   *   ['Work', { count: 2, totalMinutes: 50 }],
   *   ['Study', { count: 1, totalMinutes: 25 }]
   * ]
   *
   * WHY? Objects can't be sorted or mapped directly. Arrays can!
   */
  const sortedStats = Object.entries(tagStats)
    /**
     * STEP 2: .map() with Destructuring
     * ----------------------------------
     * Transform each [key, value] pair into a flatter object.
     *
     * PARAMETER DESTRUCTURING:
     * .map(([tag, stats]) => ...)
     *
     * Instead of:
     * .map((entry) => { const tag = entry[0]; const stats = entry[1]; ... })
     *
     * We destructure the array directly in the parameter:
     * [tag, stats] means: first element → tag, second element → stats
     *
     * OBJECT SPREADING:
     * { tag, ...stats }
     *
     * This creates a new object with:
     * - tag property from the tag variable
     * - All properties from stats object (...stats spreads them)
     *
     * Example transformation:
     * ['Work', { count: 2, totalMinutes: 50 }]
     * →
     * { tag: 'Work', count: 2, totalMinutes: 50 }
     *
     * SHORTHAND PROPERTY:
     * { tag } is shorthand for { tag: tag }
     * When property name matches variable name, you can use this shorthand.
     */
    .map(([tag, stats]) => ({ tag, ...stats }))

    /**
     * STEP 3: .sort() by count
     * -------------------------
     * Sorts the array by session count, highest first.
     *
     * SORT COMPARATOR FUNCTION:
     * .sort((a, b) => comparison)
     *
     * Returns:
     * - Negative number: a comes before b
     * - Positive number: b comes before a
     * - Zero: keep original order
     *
     * b.count - a.count: Sorts in DESCENDING order (largest count first)
     * If we wanted ascending: a.count - b.count
     *
     * Example:
     * Before: [{ tag: 'Study', count: 1 }, { tag: 'Work', count: 2 }]
     * After: [{ tag: 'Work', count: 2 }, { tag: 'Study', count: 1 }]
     */
    .sort((a, b) => b.count - a.count);

  // ===========================================================================
  // CALCULATE OVERALL STATISTICS
  // ===========================================================================

  /**
   * Total sessions: Simply the length of the sessions array.
   * This counts how many sessions have been completed.
   */
  const totalSessions = sessions.length;

  /**
   * Total minutes: Sum of all session durations converted to minutes.
   *
   * We use .reduce() again, but this time for simple summation:
   * - Start with 0
   * - Add each session's duration (converted to minutes) to the sum
   * - Return the final sum
   *
   * ARROW FUNCTION IMPLICIT RETURN:
   * (sum, s) => sum + s.duration / 60
   * No curly braces = expression is automatically returned
   *
   * Equivalent to:
   * (sum, s) => { return sum + s.duration / 60; }
   */
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration / 60, 0);

  // ===========================================================================
  // JSX RETURN - Component UI
  // ===========================================================================

  return (
    <div className="stats-container">
      <h2>📊 Your Pomodoro Stats</h2>

      {/* OVERALL STATS SECTION */}
      <div className="overall-stats">
        <h3>Overall</h3>

        {/**
         * EMBEDDING EXPRESSIONS IN JSX
         * ----------------------------
         * We use {expression} to insert JavaScript values into JSX.
         *
         * <strong>{totalSessions}</strong>
         * This displays the totalSessions number inside a <strong> tag.
         *
         * Math.round(totalMinutes)
         * Rounds to nearest integer (25.7 → 26)
         *
         * (totalMinutes / 60).toFixed(1)
         * Converts minutes to hours and formats to 1 decimal place (50.0 → 0.8)
         * .toFixed(1) returns a string like "0.8"
         */}
        <p>
          🍅 Total Sessions: <strong>{totalSessions}</strong>
        </p>
        <p>
          ⏱️ Total Time: <strong>{Math.round(totalMinutes)} minutes</strong> (
          {(totalMinutes / 60).toFixed(1)} hours)
        </p>
      </div>

      {/* PER-TAG STATS SECTION */}
      <h3>By Category</h3>

      {/**
       * CONDITIONAL RENDERING - TERNARY OPERATOR
       * -----------------------------------------
       * {condition ? <WhenTrue /> : <WhenFalse />}
       *
       * If sortedStats.length === 0 (no data):
       *   Show empty state message
       * Else:
       *   Show the stats list
       *
       * This provides a better user experience than showing an empty list.
       */}
      {sortedStats.length === 0 ? (
        // EMPTY STATE: No sessions yet
        <p className="empty-state">
          No completed sessions yet. Start a timer to see stats! 🚀
        </p>
      ) : (
        // POPULATED STATE: Show statistics for each tag
        <div className="tag-stats-list">
          {/**
           * LIST RENDERING WITH DESTRUCTURING
           * ----------------------------------
           * sortedStats.map(({ tag, count, totalMinutes }) => ...)
           *
           * We destructure each object in the map callback:
           * Instead of: sortedStats.map((stat) => ... stat.tag ... stat.count ...)
           * We use: sortedStats.map(({ tag, count, totalMinutes }) => ...)
           *
           * This extracts the properties we need directly from each object.
           *
           * OBJECT DESTRUCTURING IN PARAMETERS:
           * Same concept as array destructuring, but with objects.
           * The names must match the object property names.
           */}
          {sortedStats.map(({ tag, count, totalMinutes }) => (
            /**
             * TAG STAT CARD
             * -------------
             * Each card displays statistics for one category/tag.
             *
             * KEY PROP:
             * key={tag} - React needs this to track which items changed.
             * Tag names are unique, so they make good keys.
             */
            <div key={tag} className="tag-stat-card">
              {/* CARD HEADER - Tag name and session count */}
              <div className="tag-stat-header">
                <h4>{tag}</h4>
                <span className="session-badge">{count} sessions</span>
              </div>

              {/* TIME INFORMATION */}
              <div className="tag-stat-time">
                ⏱️ {Math.round(totalMinutes)} minutes ({(totalMinutes / 60).toFixed(1)}{' '}
                hours)
              </div>

              {/* PROGRESS BAR - Visual representation */}
              <div className="progress-bar">
                {/**
                 * INLINE STYLES WITH JAVASCRIPT
                 * ------------------------------
                 * style={{ width: `${(count / totalSessions) * 100}%` }}
                 *
                 * In React, the 'style' prop takes a JavaScript object, not a string.
                 *
                 * DOUBLE CURLY BRACES:
                 * - Outer {}: Says "this is JavaScript expression in JSX"
                 * - Inner {}: Creates a JavaScript object
                 *
                 * So style={{...}} is really: style={objectExpression}
                 *
                 * CALCULATING WIDTH:
                 * (count / totalSessions) * 100
                 * - Divides this tag's sessions by total sessions (e.g., 2/5 = 0.4)
                 * - Multiplies by 100 to get percentage (0.4 * 100 = 40)
                 * - Result: 40% width
                 *
                 * TEMPLATE LITERAL:
                 * `${value}%` - Converts number to string with % unit
                 * Example: 40 → "40%"
                 *
                 * CSS PROPERTY NAMES:
                 * In JSX style objects, use camelCase:
                 * - CSS: background-color → JSX: backgroundColor
                 * - CSS: font-size → JSX: fontSize
                 * - CSS: width → JSX: width (already camelCase)
                 */}
                <div
                  className="progress-fill"
                  style={{ width: `${(count / totalSessions) * 100}%` }}
                />
              </div>

              {/* PERCENTAGE TEXT */}
              <div className="percentage-text">
                {/**
                 * PERCENTAGE CALCULATION AND FORMATTING
                 * --------------------------------------
                 * ((count / totalSessions) * 100).toFixed(1)
                 *
                 * 1. (count / totalSessions): Fraction (e.g., 0.4)
                 * 2. * 100: Percentage (e.g., 40)
                 * 3. .toFixed(1): Format to 1 decimal place (e.g., "40.0")
                 *
                 * .toFixed() returns a string, which is fine for display.
                 *
                 * We add '% of total sessions' for context.
                 */}
                {((count / totalSessions) * 100).toFixed(1)}% of total sessions
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
