/**
 * PomodoroContext.tsx
 * 
 * This file implements the CONTEXT API pattern in React.
 * Context allows you to share state across multiple components without prop drilling.
 * 
 * KEY CONCEPTS:
 * - Context API: Global state management for React
 * - Custom Hooks: Reusable logic encapsulation
 * - TypeScript: Type safety for better developer experience
 */

// IMPORTS SECTION
// -----------------------------------------------------------------------------

// Runtime imports - actual React functions we'll use
import { createContext, useContext, useState } from 'react';

// Type-only imports - only exist at compile time, not in final JavaScript
// The "type" keyword tells TypeScript these are types, not values
import type { ReactNode } from 'react';
import type { PomodoroState, PomodoroMode } from '../types/pomodoro.types';

/**
 * LEARNING NOTE: Import vs Import Type
 * 
 * import { useState } from 'react';           ← Imports actual code
 * import type { ReactNode } from 'react';     ← Imports only the type definition
 * 
 * Type-only imports are removed during compilation and don't increase bundle size.
 */


// 1. CONTEXT INTERFACE DEFINITION
// -----------------------------------------------------------------------------

/**
 * PomodoroContextType defines the "contract" of what our context provides.
 * 
 * KEY CONCEPT: Interface Extension
 * "extends PomodoroState" means this interface inherits all properties from PomodoroState
 * (tag, mode, timeLeft, isRunning, defaultWorkTime, defaultBreakTime)
 * and then adds additional methods below.
 */
interface PomodoroContextType extends PomodoroState {
  // Setter functions - allow components to update state
  setTag: (tag: string) => void;
  setMode: (mode: PomodoroMode) => void;
  setTimeLeft: (time: number) => void;
  setIsRunning: (running: boolean) => void;
  
  // Action functions - higher-level operations
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

/**
 * LEARNING NOTE: Function Type Signatures
 * 
 * setTag: (tag: string) => void
 *         ↑            ↑    ↑
 *         |            |    └─ Returns nothing
 *         |            └────── Takes a string parameter named 'tag'
 *         └─────────────────── Function name
 */


// 2. CREATE THE CONTEXT
// -----------------------------------------------------------------------------

/**
 * createContext creates a Context object.
 * 
 * IMPORTANT: We initialize it with 'undefined' because initially there's no value.
 * The actual value is provided by the Provider component below.
 * 
 * The type <PomodoroContextType | undefined> means:
 * - Either it has all the properties from PomodoroContextType
 * - Or it's undefined (when used outside the Provider)
 */
const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

/**
 * LEARNING NOTE: Why initialize with undefined?
 * 
 * We could initialize with a default value, but undefined is better because:
 * 1. It forces us to use the Provider (good practice)
 * 2. Our custom hook can detect if it's used incorrectly
 * 3. We avoid creating fake/dummy default values
 */


// 3. PROVIDER PROPS INTERFACE
// -----------------------------------------------------------------------------

/**
 * Props interface for our Provider component.
 * 
 * ReactNode is a TypeScript type that represents anything React can render:
 * - JSX elements: <div>Hello</div>
 * - Strings: "text"
 * - Numbers: 42
 * - Arrays of elements: [<div />, <span />]
 * - null, undefined, booleans (render nothing)
 * - Fragments: <>...</>
 */
interface PomodoroProviderProps {
  children: ReactNode;
}

/**
 * LEARNING NOTE: Why ReactNode instead of JSX.Element?
 * 
 * JSX.Element is too restrictive - only accepts a single React element.
 * ReactNode is flexible - accepts anything React can render.
 * 
 * Example:
 * children: JSX.Element     ← Only accepts <App />
 * children: ReactNode       ← Accepts <App />, "text", null, [<div />, <span />], etc.
 */


// 4. PROVIDER COMPONENT
// -----------------------------------------------------------------------------

/**
 * The Provider component wraps part of your app and makes the context available
 * to all children components.
 * 
 * PATTERN: This is the "Provider" part of the Context API pattern.
 * It holds the actual state and provides it to descendants.
 */
export function PomodoroProvider({ children }: PomodoroProviderProps) {
  
  // STATE DECLARATIONS
  // ---------------------------------------------------------------------------
  
  /**
   * LEARNING NOTE: useState with TypeScript
   * 
   * useState<string>('General')
   *          ↑       ↑
   *          |       └─ Initial value
   *          └───────── Type annotation (optional but explicit)
   * 
   * TypeScript can infer the type from the initial value, but explicit
   * typing is clearer and catches mistakes early.
   */
  
  // Current category/tag for the pomodoro session
  const [tag, setTag] = useState<string>('General');
  
  // Current mode: 'work' or 'break'
  const [mode, setMode] = useState<PomodoroMode>('work');
  
  // Time remaining in seconds (25 minutes = 1500 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  
  // Whether the timer is currently running
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  // CONSTANTS
  // ---------------------------------------------------------------------------
  
  /**
   * Default durations in seconds.
   * These are constants (not state) because they don't change during runtime.
   * 
   * LEARNING NOTE: When to use const vs useState?
   * - useState: Value changes over time (timeLeft, isRunning)
   * - const: Value never changes (defaultWorkTime, defaultBreakTime)
   */
  const defaultWorkTime = 25 * 60;   // 25 minutes in seconds
  const defaultBreakTime = 5 * 60;   // 5 minutes in seconds
  
  // ACTION FUNCTIONS
  // ---------------------------------------------------------------------------
  
  /**
   * These functions encapsulate common operations.
   * Instead of components calling setIsRunning(true), they call startTimer().
   * 
   * BENEFIT: If we need to add logic (like playing a sound), we only change it here.
   */
  
  const startTimer = () => {
    setIsRunning(true);
  };
  
  const pauseTimer = () => {
    setIsRunning(false);
  };
  
  /**
   * resetTimer restores the timer to its initial state for the current mode.
   */
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? defaultWorkTime : defaultBreakTime);
  };
  
  // PROVIDER RETURN
  // ---------------------------------------------------------------------------
  
  /**
   * The Provider component returns the Context.Provider with a value prop.
   * 
   * IMPORTANT: Every component inside {children} can access this value
   * using our usePomodoro() hook.
   * 
   * The value object contains:
   * - All state variables (tag, mode, timeLeft, isRunning)
   * - All setter functions (setTag, setMode, etc.)
   * - All action functions (startTimer, pauseTimer, resetTimer)
   * - All constants (defaultWorkTime, defaultBreakTime)
   */
  return (
    <PomodoroContext.Provider
      value={{
        // State values
        tag,
        mode,
        timeLeft,
        isRunning,
        
        // Constants
        defaultWorkTime,
        defaultBreakTime,
        
        // Setters
        setTag,
        setMode,
        setTimeLeft,
        setIsRunning,
        
        // Actions
        startTimer,
        pauseTimer,
        resetTimer,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

// 5. CUSTOM HOOK
// -----------------------------------------------------------------------------

/**
 * usePomodoro is a CUSTOM HOOK that provides a safer way to access the context.
 * 
 * BENEFITS:
 * 1. Simpler API: Just call usePomodoro() instead of useContext(PomodoroContext)
 * 2. Error handling: Throws a helpful error if used outside Provider
 * 3. Type safety: Guarantees the context is never undefined
 */
export function usePomodoro() {
  // Try to get the context value
  const context = useContext(PomodoroContext);
  
  /**
   * If context is undefined, it means usePomodoro was called
   * in a component that's NOT wrapped by <PomodoroProvider>.
   * 
   * LEARNING NOTE: Error Throwing
   * Throwing an error here is good because:
   * 1. Fails fast - you know immediately if you made a mistake
   * 2. Clear message - tells you exactly what's wrong
   * 3. Prevents silent bugs - better than returning undefined
   */
  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  
  /**
   * TypeScript now knows context is NOT undefined.
   * This is called "type narrowing" - we've narrowed the type
   * from "PomodoroContextType | undefined" to just "PomodoroContextType".
   */
  return context;
}

/**
 * USAGE EXAMPLE:
 * 
 * // In any component within the Provider:
 * function Timer() {
 *   const { timeLeft, isRunning, startTimer, pauseTimer } = usePomodoro();
 *   
 *   return (
 *     <div>
 *       <p>Time: {timeLeft}</p>
 *       <button onClick={isRunning ? pauseTimer : startTimer}>
 *         {isRunning ? 'Pause' : 'Start'}
 *       </button>
 *     </div>
 *   );
 * }
 * 
 * // If you try to use it outside the Provider:
 * function BadComponent() {
 *   const pomodoro = usePomodoro(); // ❌ Throws error!
 *   // Error: "usePomodoro must be used within a PomodoroProvider"
 * }
 */

/**
 * SUMMARY OF KEY CONCEPTS:
 * 
 * 1. Context API: Share state without prop drilling
 * 2. Provider Pattern: Component that holds and provides state
 * 3. Custom Hooks: Encapsulate reusable logic (usePomodoro)
 * 4. TypeScript: Type safety for interfaces and function signatures
 * 5. Type-only imports: Import types without affecting bundle size
 * 6. Error boundaries: Throw errors for misuse (context outside Provider)
 * 7. Interface extension: Inherit properties with "extends"
 * 8. Object shorthand: Simplified object property syntax
 * 9. Type narrowing: TypeScript understands our undefined check
 */
