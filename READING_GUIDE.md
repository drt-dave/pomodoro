# 🍅 Pomodoro Timer - Project Reading Guide

**A comprehensive guide for React + TypeScript learners**

This guide will help you understand how the Pomodoro Timer application is structured and how the different pieces work together. Follow the suggested reading order to build your understanding progressively.

---

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Suggested Reading Order](#suggested-reading-order)
5. [File-by-File Guide](#file-by-file-guide)
6. [Key Concepts Explained](#key-concepts-explained)
7. [Data Flow Diagram](#data-flow-diagram)
8. [Learning Recommendations](#learning-recommendations)

---

## 🎯 Project Overview

**What is this app?**
A Pomodoro Timer that helps users manage their time using the Pomodoro Technique (25-minute work sessions followed by 5-minute breaks). Users can categorize sessions with tags and view statistics about their productivity.

**Key Features:**
- ⏱️ Countdown timer with work/break modes
- 🏷️ Tag sessions by category (Work, Study, Exercise, etc.)
- 💾 Automatic state persistence (survives page refresh)
- 📊 Statistics and session history
- ✅ Confirmation modal when finishing sessions early

---

## 🛠️ Technology Stack

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **React 19** | UI framework for building components | [react.dev](https://react.dev) |
| **TypeScript** | Type-safe JavaScript | [typescriptlang.org](https://www.typescriptlang.org) |
| **Vite** | Build tool & dev server | [vitejs.dev](https://vitejs.dev) |
| **Context API** | State management across components | [React Context](https://react.dev/reference/react/createContext) |
| **localStorage** | Browser storage for persistence | [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) |

**Why these choices?**
- **React**: Component-based, easy to learn, excellent ecosystem
- **TypeScript**: Catches errors early, better IDE support, self-documenting code
- **Vite**: Fast development experience, modern build tool
- **Context API**: Built-in React solution for sharing state (no external libraries needed)
- **localStorage**: Simple persistent storage for small amounts of data

---

## 🏗️ Project Architecture

```
src/
├── main.tsx                    # App entry point (start here!)
├── App.tsx                     # Root component with navigation
├── App.css                     # Global styles (reset, variables, layout)
├── types/
│   └── pomodoro.types.ts      # TypeScript type definitions
├── hooks/
│   └── PomodoroContext.tsx    # Global state management
├── contexts/                   # NEW: Theme and context providers
│   └── ThemeContext.tsx       # Dark mode theme system (in progress)
├── components/
│   ├── Timer.tsx              # Main timer display and controls
│   ├── Timer.module.css       # ← CSS Module (scoped styles)
│   ├── ModeIndicator.tsx      # Mode display component
│   ├── ModeIndicator.module.css # ← CSS Module
│   ├── Toast.tsx              # Toast notification component
│   ├── Toast.module.css       # ← CSS Module
│   ├── TagSelector.tsx        # Category selector dropdown
│   ├── TagSelector.module.css # ← CSS Module
│   ├── TagStats.tsx           # Statistics view
│   ├── TagStats.module.css    # ← CSS Module
│   ├── ConfirmModal.tsx       # Modal for confirming early finish
│   └── ConfirmModal.module.css # ← CSS Module
└── utils/
    └── formatTime.ts          # Time formatting helpers
```

**Architecture Patterns:**
- **Centralized State Management:** React Context pattern - all shared state lives in `PomodoroContext`, components access via `usePomodoro()` hook
- **CSS Modules:** Co-located component styles with scoped CSS (`.module.css` files) - prevents style conflicts and improves maintainability
- **Component Co-location:** Each component has its TypeScript file and CSS Module in the same directory

---

## 📖 Suggested Reading Order

### Phase 1: Understanding Types (Start Here!)
**Goal:** Learn what data structures the app uses

1. **`src/types/pomodoro.types.ts`** ⭐ START HERE
   - Heavily commented with learning notes
   - Explains `type` vs `interface`
   - Shows all data structures used in the app
   - **Time:** 10 minutes

### Phase 2: Entry Points
**Goal:** Understand how the app initializes

2. **`src/main.tsx`**
   - App entry point (where React starts)
   - Shows provider wrapping pattern
   - **Time:** 5 minutes

3. **`src/App.tsx`**
   - Root component structure
   - View switching logic (timer vs stats)
   - Component composition pattern
   - **Time:** 10 minutes

### Phase 3: State Management (Core Concept!)
**Goal:** Master React Context and state persistence

4. **`src/hooks/PomodoroContext.tsx`** ⭐ IMPORTANT
   - Complete state management solution
   - localStorage integration
   - Custom hook pattern
   - Well-documented with inline comments
   - **Time:** 20-30 minutes

### Phase 4: Main Components
**Goal:** See how components use the shared state

5. **`src/components/Timer.tsx`**
   - Main timer logic
   - useEffect for intervals
   - Event handlers
   - Session saving logic
   - **Time:** 20 minutes

6. **`src/components/TagSelector.tsx`**
   - Dropdown component
   - Conditional rendering
   - **Time:** 10 minutes

7. **`src/components/TagStats.tsx`**
   - Data aggregation and display
   - Array methods (filter, reduce)
   - Statistics calculations
   - **Time:** 15 minutes

8. **`src/components/ConfirmModal.tsx`**
   - Modal UI pattern
   - Conditional rendering
   - **Time:** 10 minutes

### Phase 5: Utilities
**Goal:** Understand helper functions

9. **`src/utils/formatTime.ts`**
   - Pure functions
   - Time formatting logic
   - **Time:** 5 minutes

**Total Estimated Reading Time:** 2-2.5 hours (take breaks!)

---

## 📄 File-by-File Guide

### 📍 `src/main.tsx` - Application Entry Point

**What it does:** Bootstraps the React application and renders it to the DOM.

**Key Concepts:**
```typescript
createRoot(document.getElementById('root')!)
```
- `!` is TypeScript's "non-null assertion operator"
- Tells TypeScript "trust me, this element exists"

```typescript
<StrictMode>
  <PomodoroProvider>
    <App />
  </PomodoroProvider>
</StrictMode>
```
- **StrictMode**: React development mode helper (finds bugs)
- **Provider wrapping**: `PomodoroProvider` makes state available to all child components
- This is called the "Provider Pattern"

**What to learn:**
- How React apps start
- The Provider Pattern for context
- Component composition

---

### 📍 `src/types/pomodoro.types.ts` - Type Definitions

**What it does:** Defines all TypeScript types and interfaces used in the app.

**Already heavily commented!** This file has extensive learning notes built-in. Key types:

1. **`PomodoroMode`**: Union type `'work' | 'break'`
2. **`PomodoroState`**: Shape of the timer state
3. **`PomodoroSession`**: Structure for saved sessions

**What to learn:**
- Type vs Interface (when to use each)
- Union types with `|`
- How to document types with JSDoc comments
- Creating "contracts" for data structures

---

### 📍 `src/hooks/PomodoroContext.tsx` - State Management ⭐

**What it does:** Central hub for ALL application state and logic.

**This is the heart of the application!** Understanding this file is crucial.

**Key React Patterns:**

1. **Context Pattern**
```typescript
const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);
```
- Creates a "context" that can be accessed by any child component
- Like a "global state" that doesn't need prop drilling

2. **Custom Hook Pattern**
```typescript
export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
}
```
- Wraps `useContext` with error checking
- Components use `usePomodoro()` instead of `useContext(PomodoroContext)`
- Cleaner API and better error messages

3. **State Persistence**
```typescript
// Initialize from localStorage (lazy initialization)
const [sessions, setSessions] = useState<PomodoroSession[]>(() =>
  loadSessionsFromStorage()
);

// Save whenever state changes
useEffect(() => {
  saveSessionsToStorage(sessions);
}, [sessions]);
```
- Lazy initialization: Function only runs once on mount
- useEffect: Runs side effect when dependencies change
- This creates automatic sync with localStorage!

**What to learn:**
- How Context API works
- useState with lazy initialization
- useEffect for side effects and synchronization
- localStorage API (getItem, setItem)
- JSON.stringify/parse for storing objects
- Error handling with try/catch
- Custom hooks pattern

**Important Note:**
The timer defaults are currently set to seconds for development:
```typescript
const defaultWorkTime = 25; // * 60; (commented out)
```
For production, uncomment the `* 60` to use minutes.

---

### 📍 `src/App.tsx` - Root Component

**What it does:** Main application shell with view switching.

**Key React Patterns:**

1. **Local State for UI**
```typescript
const [activeView, setActiveView] = useState<ViewType>('timer');
```
- TypeScript union type: `'timer' | 'stats'`
- Local state (doesn't need to be global)

2. **Conditional Rendering**
```typescript
{activeView === 'timer' && (
  <>
    <TagSelector />
    <Timer />
  </>
)}
```
- `&&` operator: If left is true, render right
- `<>...</>` is React Fragment (groups without adding DOM node)

3. **Dynamic Classes**
```typescript
className={`nav-item ${activeView === 'timer' ? 'active' : ''}`}
```
- Template literals for dynamic class names
- Ternary operator for conditional class

**What to learn:**
- Component composition (building UI from smaller pieces)
- Conditional rendering patterns
- Template literals and dynamic classes
- Event handling with onClick
- Fragment syntax `<></>`

---

### 📍 `src/components/Timer.tsx` - Timer Logic

**What it does:** Displays countdown timer and handles all timer operations.

**Key React Patterns:**

1. **Timer Effect**
```typescript
useEffect(() => {
  if (!isRunning || timeLeft <= 0) return;

  const interval = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning, timeLeft, setTimeLeft]);
```
- **Early return**: Exit if conditions aren't met
- **setInterval**: JavaScript timer API (runs every 1000ms = 1 second)
- **Functional update**: `(prev) => prev - 1` gets current value safely
- **Cleanup function**: `return () => clearInterval(interval)` stops timer
- Cleanup runs when component unmounts or dependencies change

2. **Auto-completion Effect**
```typescript
useEffect(() => {
  if (timeLeft === 0 && !showConfirmModal) {
    // Timer completed naturally - save session
    const session: PomodoroSession = {
      tag: tag,
      duration: initialTime,
      timestamp: Date.now(),
      completed: true,
    };
    saveSession(session);
    // ... reset timer
  }
}, [timeLeft, showConfirmModal, /* other deps */]);
```
- Watches for timer reaching zero
- Automatically saves completed session
- Shows how multiple effects can coexist

3. **Event Handlers**
```typescript
const handlerFinishSession = () => {
  // Don't allow finishing if timer never started
  if (!isRunning && timeLeft === initialTime) {
    return;
  }
  // ... show confirmation modal
}
```
- Guard clause pattern (early return)
- Button click handlers
- Business logic before showing UI

**What to learn:**
- useEffect for side effects (timers, subscriptions)
- Cleanup functions in useEffect
- setInterval/clearInterval
- Multiple useEffect hooks in one component
- When to use functional updates with setState
- Event handler patterns
- Guard clauses for validation

---

### 📍 `src/components/TagSelector.tsx` - Dropdown Component

**What it does:** Dropdown for selecting session categories.

**Key Concepts:**
- Controlled component pattern
- Select element handling
- Disabled state during timer running
- Predefined tags array

**What to learn:**
- Controlled vs uncontrolled components
- Select/option elements in React
- Mapping arrays to elements
- Conditional prop spreading

---

### 📍 `src/components/TagStats.tsx` - Statistics View

**What it does:** Aggregates and displays session statistics.

**Key JavaScript/TypeScript Patterns:**

1. **Array Filtering**
```typescript
const filteredSessions = sessions.filter(s => s.tag === tag);
```
- Creates new array with only matching items

2. **Array Reduction**
```typescript
const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);
```
- Aggregates array into single value
- `0` is the initial value of `sum`

3. **Object as Map**
```typescript
const tagStats: Record<string, number> = {};
sessions.forEach(session => {
  tagStats[session.tag] = (tagStats[session.tag] || 0) + 1;
});
```
- `Record<string, number>` is TypeScript utility type
- Creates object like `{ "Work": 5, "Study": 3 }`
- `|| 0` provides default value if undefined

**What to learn:**
- Array methods: filter, reduce, forEach, map
- TypeScript utility types: Record
- Data aggregation patterns
- Conditional rendering with data

---

### 📍 `src/components/ConfirmModal.tsx` - Modal Component

**What it does:** Reusable modal component for confirmations.

**Key React Patterns:**

1. **Conditional Rendering**
```typescript
if (!show) return null;
```
- Return `null` to render nothing
- Component still exists, just invisible

2. **Props Interface**
```typescript
interface ConfirmModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}
```
- Defines component API
- `() => void` is a function that takes no params and returns nothing

**What to learn:**
- Component props typing
- Callback props pattern
- Conditional rendering with null
- Modal/overlay UI patterns
- Event propagation (stopPropagation)

---

### 📍 `src/utils/formatTime.ts` - Utility Functions

**What it does:** Pure functions for formatting time values.

**Key Concepts:**

1. **Pure Functions**
```typescript
export const formatTimeMMSS = (seconds: number): string => {
  // Same input always produces same output
  // No side effects
  // Predictable and testable
}
```

2. **String Padding**
```typescript
const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
```
- `padStart(2, '0')` ensures 2 digits: "5" → "05"

**What to learn:**
- Pure functions concept
- Math operations (floor, division)
- String manipulation (padStart)
- Export/import syntax

---

## 🧠 Key Concepts Explained

### 1. React Hooks

**What are hooks?**
Functions that let you "hook into" React features. They start with `use`.

**Hooks used in this project:**

| Hook | Purpose | Example |
|------|---------|---------|
| `useState` | Store component state | `const [count, setCount] = useState(0)` |
| `useEffect` | Side effects (timers, storage) | `useEffect(() => {...}, [deps])` |
| `useContext` | Access context values | `const value = useContext(MyContext)` |

**Rules of Hooks:**
1. ✅ Only call at top level (not in loops/conditions)
2. ✅ Only call from React functions (components/custom hooks)

### 2. TypeScript in React

**Type annotations:**
```typescript
const [timeLeft, setTimeLeft] = useState<number>(1500);
//                                       ^^^^^^^^ type annotation
```

**Interface for props:**
```typescript
interface TimerProps {
  initialTime: number;
  onComplete: () => void;
}

export const Timer = ({ initialTime, onComplete }: TimerProps) => {
  // Component implementation
}
```

**Benefits:**
- Autocomplete in IDE
- Catch errors before runtime
- Self-documenting code
- Refactoring confidence

### 3. Context API Pattern

**The Problem:** Prop drilling (passing props through many levels)

```typescript
// ❌ Prop drilling
<App>
  <Header user={user} />
  <Sidebar user={user} />
  <Content>
    <Profile user={user} />
  </Content>
</App>
```

**The Solution:** Context (direct access without props)

```typescript
// ✅ Context API
<UserProvider value={user}>
  <App>
    <Header />           {/* uses useUser() */}
    <Sidebar />          {/* uses useUser() */}
    <Content>
      <Profile />        {/* uses useUser() */}
    </Content>
  </App>
</UserProvider>
```

**Steps to implement:**
1. Create context: `createContext()`
2. Create provider component: `<MyProvider>`
3. Create custom hook: `useMyContext()`
4. Wrap app with provider
5. Use hook in components

### 4. State Management Principles

**Where should state live?**

- **Local state** (`useState` in component): UI state that only one component needs
  - Example: Form inputs, dropdown open/closed, hover state

- **Shared state** (Context): Data needed by multiple components
  - Example: User info, theme, app settings, timer state

**State updates are asynchronous:**
```typescript
// ❌ BAD - may use stale state
setCount(count + 1);
setCount(count + 1); // Won't add 2!

// ✅ GOOD - functional update
setCount(prev => prev + 1);
setCount(prev => prev + 1); // Correctly adds 2
```

### 5. useEffect Deep Dive

**Anatomy of useEffect:**
```typescript
useEffect(() => {
  // SETUP: Runs after render
  const id = setInterval(() => {
    console.log('tick');
  }, 1000);

  // CLEANUP: Runs before next effect or unmount
  return () => clearInterval(id);
}, [dependency]); // DEPENDENCIES: When to re-run
```

**Dependency array rules:**
- `[]` → Run once on mount
- `[a, b]` → Run when `a` or `b` change
- No array → Run after every render (usually wrong!)

**Common use cases:**
- Timers/intervals
- API calls
- Subscriptions
- localStorage sync
- Event listeners

### 6. localStorage Persistence

**Why localStorage?**
- Survives page refresh
- Survives browser restart
- 5-10MB capacity (enough for most apps)
- Simple synchronous API

**Important: Only stores strings!**
```typescript
// ❌ WRONG - saves "[object Object]"
localStorage.setItem('user', myUser);

// ✅ CORRECT - convert to JSON string
localStorage.setItem('user', JSON.stringify(myUser));

// Reading back
const user = JSON.parse(localStorage.getItem('user') || '{}');
```

**Pattern used in this app:**
```typescript
// Load on mount (lazy initialization)
const [state, setState] = useState(() => loadFromStorage());

// Save on change
useEffect(() => {
  saveToStorage(state);
}, [state]);
```

This creates automatic two-way sync! 🔄

### 7. CSS Modules

**What are CSS Modules?**
A build-time feature that scopes CSS to specific components, preventing global style conflicts.

**The Problem:** Global CSS can cause conflicts
```css
/* App.css - styles apply globally */
.button {
  background: blue;
}

/* Another file also has .button class - CONFLICT! */
.button {
  background: red; /* Which one wins? */
}
```

**The Solution:** CSS Modules scope styles locally
```typescript
// Timer.tsx
import styles from './Timer.module.css';

export const Timer = () => {
  return <div className={styles.timer}>...</div>;
  // Becomes: <div className="Timer_timer__abc123">
};
```

**Benefits:**
- **No conflicts:** Classes are automatically scoped (e.g., `Timer_timer__abc123`)
- **Co-location:** Styles live next to the component that uses them
- **Maintainability:** Easy to find and update component-specific styles
- **Portability:** Can move component + CSS Module together

**Key conventions in this project:**
- File naming: `ComponentName.module.css`
- Class naming: camelCase (e.g., `modeIndicator`, `toastContainer`)
- Import pattern: `import styles from './Component.module.css'`
- Usage: `className={styles.className}`

**Dynamic classes:**
```typescript
// Single class
<div className={styles.timer}>

// Multiple classes
<div className={`${styles.timer} ${styles.active}`}>

// Array join pattern (cleaner for many classes)
<div className={[styles.timer, isActive && styles.active].filter(Boolean).join(' ')}>
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      localStorage                            │
│  { sessions: [...], state: {...} }                          │
└───────────────▲─────────────────┬───────────────────────────┘
                │                 │
                │ save            │ load
                │                 │
┌───────────────┴─────────────────▼───────────────────────────┐
│              PomodoroContext (Global State)                  │
│  • tag, mode, timeLeft, isRunning                           │
│  • sessions array                                            │
│  • startTimer(), pauseTimer(), saveSession()                │
└──────────────┬─────────────────┬────────────────────────────┘
               │                 │
        usePomodoro()      usePomodoro()
               │                 │
       ┌───────▼──────┐   ┌─────▼────────┐
       │   Timer.tsx  │   │ TagStats.tsx │
       │              │   │              │
       │ • Display    │   │ • Calculate  │
       │ • Controls   │   │ • Display    │
       │ • Countdown  │   │   stats      │
       └──────────────┘   └──────────────┘
```

**Reading the diagram:**
1. Context loads initial state from localStorage
2. Components access state via `usePomodoro()` hook
3. User interactions trigger state updates
4. State updates automatically save to localStorage
5. On page reload, cycle repeats

---

## 🎓 Learning Recommendations

### For React Beginners

**Before diving into this codebase:**
1. Complete React official tutorial: [react.dev/learn](https://react.dev/learn)
2. Understand these concepts:
   - Components and props
   - State with useState
   - Effects with useEffect
   - Conditional rendering
   - Lists and keys

**Then explore this project in the suggested reading order!**

### For TypeScript Beginners

**Start with:**
1. TypeScript Handbook: [typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook/)
2. Focus on these chapters:
   - Basic Types
   - Interfaces
   - Type Aliases
   - Union Types
   - Generics (for understanding `useState<T>`)

**This project is TypeScript-friendly:**
- Well-typed props and state
- Documented type definitions
- Good examples of React + TypeScript patterns

### Hands-On Learning Exercises

**Once you understand the code, try these:**

1. **Easy:**
   - Add a new tag option to the predefined tags
   - Change the default work/break times
   - Add a "Clear All Sessions" button

2. **Medium:**
   - Add a "Pause and Abandon" button (saves as not completed)
   - Show today's total time on the stats page
   - Add sound notification when timer completes

3. **Advanced:**
   - Add a "long break" mode (15 minutes after 4 work sessions)
   - Create a chart visualization for statistics (🔄 Issue #7 planned)
   - Add export/import functionality for session data
   - ✅ Implement dark mode toggle (🔄 Issue #8 in progress)
   - ✅ Refactor to CSS Modules (COMPLETED - Issue #6)

### Debugging Tips

**React DevTools:**
1. Install React DevTools browser extension
2. Inspect component tree
3. View props and state in real-time
4. Track state changes

**Chrome DevTools:**
1. **Console**: View logs and errors
2. **Application tab → Local Storage**: Inspect stored data
3. **Sources**: Set breakpoints in code
4. **Network**: Monitor any API calls (none in this app currently)

**Common Issues:**

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Timer doesn't start | Missing `isRunning` state | Check context value |
| State resets on refresh | localStorage not saving | Check useEffect dependencies |
| TypeScript errors | Type mismatch | Read error message carefully, check type definitions |
| Timer keeps running in background | Missing cleanup in useEffect | Add `return () => clearInterval(id)` |

### Reading Code Tips

1. **Start small**: Don't try to understand everything at once
2. **Follow imports**: Track where functions/types come from
3. **Use IDE features**: Hover for type info, Cmd+Click to jump to definition
4. **Add console.logs**: See values at runtime
5. **Experiment**: Change values, see what breaks
6. **Read error messages**: They're usually helpful!
7. **Draw diagrams**: Visualize component tree and data flow

### Next Steps

**After mastering this codebase:**

1. **Build something similar:**
   - Todo app with categories
   - Habit tracker with streaks
   - Simple time logger

2. **Learn related topics:**
   - React Router (multi-page apps)
   - Form libraries (Formik, React Hook Form)
   - Styling solutions (Styled Components, Tailwind)
   - State management libraries (Zustand, Redux)
   - Backend integration (REST APIs, GraphQL)

3. **Read others' code:**
   - Open source React projects on GitHub
   - Study different patterns and approaches
   - Learn from various coding styles

---

## 🤔 Frequently Asked Questions

**Q: Why use Context instead of props?**
A: Context prevents "prop drilling" (passing props through many levels). The timer state is needed in multiple components, so Context is cleaner.

**Q: Why TypeScript? Isn't JavaScript easier?**
A: TypeScript catches errors during development (not at runtime). The autocomplete and type checking save time and prevent bugs. The learning curve is worth it!

**Q: What's the difference between `const` and `let`?**
A: `const` means the binding can't be reassigned. `let` allows reassignment. Always prefer `const` unless you need to reassign.

**Q: Why functional components instead of classes?**
A: Modern React prefers functional components with hooks. They're simpler, more composable, and easier to test. Class components are legacy.

**Q: Should every component be in its own file?**
A: Generally yes for reusable components. Small helper components can sometimes live in the same file as their parent.

**Q: When should I extract a custom hook?**
A: When you have stateful logic that's reused across components. This project's `usePomodoro` is a perfect example!

**Q: How do I decide between useState and useReducer?**
A: `useState` for simple state. `useReducer` for complex state with many update operations. This project uses `useState` because state is simple.

---

## 📝 Summary Checklist

**After reading this guide and the code, you should understand:**

- [ ] How React apps are structured
- [ ] What TypeScript types are and why they're useful
- [ ] How Context API shares state across components
- [ ] How useState manages component state
- [ ] How useEffect handles side effects and cleanup
- [ ] How localStorage persists data
- [ ] How timer intervals work in React
- [ ] How to read and write TypeScript interfaces
- [ ] How components communicate (props, context, callbacks)
- [ ] How to structure a React project

**If you don't understand something:**
1. Re-read the relevant section
2. Add console.logs to see values
3. Make small changes and observe results
4. Ask specific questions about what confuses you
5. Draw diagrams of data flow

---

## 🚀 You're Ready!

Start with `src/types/pomodoro.types.ts` and follow the suggested reading order. Take your time, experiment with the code, and most importantly—have fun learning! 🎉

Remember: Every expert was once a beginner. Reading real code is one of the best ways to learn. You've got this! 💪

---

**Questions or stuck?** Check out these resources:
- [React Official Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org)
- [Stack Overflow](https://stackoverflow.com)

Happy coding! 🍅✨
