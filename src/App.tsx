/**
 * ===========================================================================
 * APP COMPONENT - Main Application Entry Point
 * ===========================================================================
 *
 * This is the root component of our Pomodoro application. It coordinates
 * all other components and manages the overall application structure.
 *
 * KEY REACT CONCEPTS DEMONSTRATED:
 * ---------------------------------
 *
 * 1. COMPONENT COMPOSITION
 *    Building complex UIs by combining smaller components
 *
 * 2. LOCAL STATE FOR UI MANAGEMENT
 *    Using useState to control which view is displayed
 *
 * 3. CONDITIONAL RENDERING
 *    Showing different components based on state
 *
 * 4. PROP DRILLING
 *    Passing props from context through to child components
 *
 * 5. TYPE ALIASES
 *    Using TypeScript types to restrict possible values
 *
 * 6. FRAGMENT SYNTAX (<>...</>)
 *    Grouping elements without adding extra DOM nodes
 */

import { useState } from 'react';
import { usePomodoro } from './hooks/PomodoroContext';
import { Timer } from './components/Timer';
import { TagSelector } from './components/TagSelector';
import { TagStats } from './components/TagStats';
import './App.css';

// ===========================================================================
// TYPE DEFINITIONS
// ===========================================================================

/**
 * ViewType
 * --------
 * Local type alias for view selection.
 *
 * WHY CREATE THIS TYPE?
 * Instead of using string everywhere, we restrict to only two valid values.
 * This prevents typos and makes the code more maintainable.
 *
 * UNION TYPE:
 * 'timer' | 'stats' means the value can ONLY be one of these two strings.
 *
 * DIFFERENCE FROM EXPORTED TYPES:
 * This type is NOT exported because it's only used within this file.
 * If other components needed it, we'd move it to pomodoro.types.ts and export it.
 *
 * Example usage:
 * ✅ const view: ViewType = 'timer';  // OK
 * ❌ const view: ViewType = 'home';   // TypeScript error!
 */
type ViewType = 'timer' | 'stats';

// ===========================================================================
// MAIN APP COMPONENT
// ===========================================================================

/**
 * App Component
 * -------------
 * The root component that renders the entire application.
 *
 * COMPONENT HIERARCHY:
 * App
 * ├── Header (logo/title)
 * ├── Main Content
 * │   ├── Timer view (conditional)
 * │   │   ├── Timer component
 * │   │   └── TagSelector component
 * │   └── Stats view (conditional)
 * │       └── TagStats component
 * └── Footer (navigation)
 *
 * This structure separates concerns:
 * - Header: Branding
 * - Main: Content (changes based on active view)
 * - Footer: Navigation
 */
function App() {
  // ===========================================================================
  // CONTEXT CONSUMPTION
  // ===========================================================================

  /**
   * Getting state from PomodoroContext
   * -----------------------------------
   * usePomodoro() gives us access to the global application state.
   *
   * We destructure only what we need:
   * - tag: Currently selected category
   * - setTag: Function to update the category
   * - mode: Whether we're in 'work' or 'break' mode
   *
   * WHY NOT GET EVERYTHING?
   * Destructuring only what we use makes code clearer and shows dependencies.
   *
   * CONTEXT vs PROPS:
   * Context lets us access shared state without passing props through every level.
   * If we didn't use context, we'd have to pass these from PomodoroProvider
   * → App → TagSelector (called "prop drilling").
   */
  const { tag, setTag, mode } = usePomodoro();

  // ===========================================================================
  // LOCAL COMPONENT STATE
  // ===========================================================================

  /**
   * activeView State
   * ----------------
   * Controls which view is currently displayed: timer or stats.
   *
   * TYPE ANNOTATION: useState<ViewType>('timer')
   * This tells TypeScript that activeView can only be 'timer' or 'stats'.
   *
   * INITIAL VALUE: 'timer'
   * The app starts showing the timer view.
   *
   * WHY LOCAL STATE AND NOT CONTEXT?
   * The active view is UI-only state that doesn't need to be shared with
   * other parts of the app. It's specific to this component.
   *
   * RULE OF THUMB:
   * - Data that multiple components need → Context or prop drilling
   * - UI-only state (which tab is active, is modal open) → Local state
   * - Form input values → Local state (unless you need them elsewhere)
   */
  const [activeView, setActiveView] = useState<ViewType>('timer');

  // ===========================================================================
  // JSX RETURN - Application Layout
  // ===========================================================================

  return (
    /**
     * ROOT CONTAINER
     * --------------
     * className="app" - The outermost container for the entire application.
     * Styled in App.css to provide the basic layout structure.
     */
    <div className="app">
      {/* ===================================================================
          HEADER SECTION
          =================================================================== */}

      {/**
       * APP HEADER
       * ----------
       * Contains the application logo and title.
       *
       * SEMANTIC HTML:
       * <header> tag clearly indicates this is the header section.
       * Screen readers and search engines understand the page structure better.
       *
       * EMOJI IN TITLE:
       * 🍅 (tomato) is the classic Pomodoro Technique symbol.
       * The technique was named after a tomato-shaped kitchen timer.
       */}
      <header className="app-header">
        <h1 className="logo-title">🍅 PomoDoroto</h1>
      </header>

      {/* ===================================================================
          MAIN CONTENT SECTION
          =================================================================== */}

      {/**
       * MAIN CONTENT AREA
       * -----------------
       * <main> tag indicates the primary content of the page.
       * Only one <main> element should exist per page.
       *
       * CONDITIONAL RENDERING:
       * We use JavaScript expressions {condition && <Component />} to show
       * different content based on the activeView state.
       */}
      <main className="main-content">
        {/**
         * TIMER VIEW
         * ----------
         * Shown when activeView === 'timer'
         *
         * CONDITIONAL RENDERING WITH &&:
         * {condition && <Component />}
         *
         * If condition is true: Render the component
         * If condition is false: Render nothing
         *
         * This is equivalent to:
         * {condition ? <Component /> : null}
         *
         * WHY USE && INSTEAD OF TERNARY?
         * When you don't need an "else" case, && is cleaner and more readable.
         */}
        {activeView === 'timer' && (
          /**
           * REACT FRAGMENT - Short Syntax
           * ------------------------------
           * <>...</> is shorthand for <React.Fragment>...</React.Fragment>
           *
           * WHY USE FRAGMENTS?
           * React components must return a single root element.
           * But we want to render two cards (Timer and TagSelector) without
           * wrapping them in an extra <div>.
           *
           * Fragments let us group elements without adding DOM nodes.
           *
           * Example of the difference:
           *
           * With Fragment:
           * <main>
           *   <div class="card">Timer</div>
           *   <div class="card">TagSelector</div>
           * </main>
           *
           * Without Fragment (using <div>):
           * <main>
           *   <div>  ← Extra unnecessary div!
           *     <div class="card">Timer</div>
           *     <div class="card">TagSelector</div>
           *   </div>
           * </main>
           *
           * WHEN TO USE:
           * - Avoiding extra wrapper divs
           * - Meeting React's single-root requirement
           * - Keeping DOM structure clean
           */
          <>
            {/**
             * TIMER CARD
             * ----------
             * Displays the countdown timer with controls.
             *
             * COMPONENT COMPOSITION:
             * We import Timer from './components/Timer' and use it here.
             * Timer is a self-contained component that manages its own logic.
             *
             * <Timer /> is self-closing because it doesn't have children.
             *
             * NO PROPS:
             * Timer gets all its data from usePomodoro() hook, not from props.
             * This keeps the parent component simple.
             */}
            <div className="card timer-card">
              <Timer />
            </div>

            {/**
             * TAG SELECTOR CARD
             * -----------------
             * Allows user to select/create categories.
             *
             * PASSING PROPS:
             * <TagSelector tag={tag} setTag={setTag} mode={mode} />
             *
             * We pass three props:
             * - tag: Current category (from context)
             * - setTag: Function to change category (from context)
             * - mode: Current timer mode (from context)
             *
             * DATA FLOW:
             * 1. App gets tag, setTag, mode from PomodoroContext
             * 2. App passes them as props to TagSelector
             * 3. TagSelector uses them to display/modify the selected category
             *
             * This is called PROP DRILLING (passing props through layers).
             * We could avoid this by having TagSelector call usePomodoro() directly,
             * but sometimes explicitly passing props makes data flow clearer.
             */}
            <div className="card tagselector-card">
              <TagSelector tag={tag} setTag={setTag} mode={mode} />
            </div>
          </>
        )}

        {/**
         * STATS VIEW
         * ----------
         * Shown when activeView === 'stats'
         *
         * This displays session statistics and analytics.
         */}
        {activeView === 'stats' && (
          <div className="card stats-card">
            {/**
             * TAG STATS COMPONENT
             * -------------------
             * Displays session statistics grouped by category.
             *
             * NO PROPS NEEDED:
             * TagStats gets all data from usePomodoro() context hook.
             * It reads the sessions array and calculates statistics.
             *
             * PRESENTATIONAL COMPONENT:
             * TagStats doesn't modify data, only displays it.
             * All the logic is in data transformation, not state updates.
             */}
            <TagStats />
          </div>
        )}
      </main>

      {/* ===================================================================
          FOOTER NAVIGATION
          =================================================================== */}

      {/**
       * BOTTOM NAVIGATION BAR
       * ---------------------
       * Allows switching between Timer and Stats views.
       *
       * SEMANTIC HTML:
       * <footer> indicates this is footer content (even though it's a nav bar).
       * For a navigation bar, we could also use <nav>, but footer makes sense
       * since it's at the bottom of the page.
       */}
      <footer className="bottom-nav">
        {/**
         * TIMER NAV ITEM
         * --------------
         * Switches to the timer view when clicked.
         *
         * DYNAMIC CLASSNAME:
         * className={`nav-item ${activeView === 'timer' ? 'active' : ''}`}
         *
         * TEMPLATE LITERAL BREAKDOWN:
         * - Base class: 'nav-item' (always present)
         * - Conditional class: 'active' (only when this view is active)
         *
         * Result examples:
         * - activeView === 'timer': className="nav-item active"
         * - activeView === 'stats': className="nav-item "
         *
         * CSS USAGE:
         * .nav-item.active { ... } can style the active navigation item differently.
         *
         * onClick HANDLER:
         * onClick={() => setActiveView('timer')}
         *
         * When clicked, update activeView state to 'timer'.
         * This causes a re-render, hiding the stats view and showing the timer view.
         *
         * ARROW FUNCTION:
         * We need () => setActiveView('timer') because we're passing an argument.
         * Can't just write onClick={setActiveView('timer')} - that would call
         * the function immediately during render!
         */}
        <div
          className={`nav-item ${activeView === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveView('timer')}
        >
          {/**
           * EMOJI + TEXT
           * ------------
           * ⏱️ Timer symbol
           * <span>Timer</span> - Text label
           *
           * WHY USE <span>?
           * Allows styling the text separately from the emoji if needed.
           * For example, we could hide the text on mobile but keep the emoji.
           */}
          ⏱️<span>Timer</span>
        </div>

        {/**
         * STATS NAV ITEM
         * --------------
         * Switches to the stats view when clicked.
         *
         * Same pattern as the timer nav item, but for the stats view.
         */}
        <div
          className={`nav-item ${activeView === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveView('stats')}
        >
          📊<span>Stats</span>
        </div>
      </footer>
    </div>
  );
}

/**
 * DEFAULT EXPORT
 * --------------
 * export default App;
 *
 * Makes this component available for import in other files.
 * Default export means it can be imported with any name:
 *
 * import App from './App';        ✅ Common convention
 * import MyApp from './App';      ✅ Also works
 * import Whatever from './App';   ✅ Still works
 *
 * NAMED EXPORT vs DEFAULT EXPORT:
 *
 * Named export (what we used in other components):
 * export function Timer() { ... }
 * import { Timer } from './Timer';  // Must use exact name
 *
 * Default export (what we use here):
 * export default App;
 * import App from './App';  // Can use any name
 *
 * CONVENTION:
 * - Use default export for main component of a file
 * - Use named exports for utilities, types, and helper functions
 * - One file usually has at most one default export
 */
export default App;
