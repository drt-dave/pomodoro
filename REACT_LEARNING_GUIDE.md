[#](#) React TypeScript Learning Guide - Pomodoro Timer App

This guide explains how this Pomodoro Timer app works, file by file, to help you learn React with TypeScript.

---

## Table of Contents
[1](1). [Project Structure](#project-structure)
2. [Type Definitions](#type-definitions)
3. [Context API & State Management](#context-api--state-management)
4. [Components](#components)
5. [Utilities](#utilities)
6. [PWA Configuration](#pwa-configuration)
7. [Key Concepts](#key-concepts)

---

## Project Structure

```
pomodoro/
├── src/
│   ├── components/          # React components (UI)
│   │   ├── Timer.tsx        # Main timer component
│   │   ├── TagSelector.tsx  # Category selection
│   │   ├── ModeIndicator.tsx
│   │   ├── Toast.tsx
│   │   ├── ConfirmModal.tsx
│   │   └── *.module.css     # CSS Modules (scoped styles)
│   ├── contexts/            # React Context providers
│   │   └── ThemeContext.tsx # Dark/light theme management
│   ├── hooks/               # Custom React hooks
│   │   └── PomodoroContext.tsx # Pomodoro state management
│   ├── types/               # TypeScript type definitions
│   │   └── pomodoro.types.ts
│   ├── utils/               # Utility functions
│   │   └── formatTime.ts
│   ├── App.tsx              # Root component
│   └── main.tsx             # App entry point
├── index.html               # HTML template with PWA meta tags
├── vite.config.ts           # Vite + PWA configuration
└── package.json             # Dependencies
```

---

## Type Definitions

### `src/types/pomodoro.types.ts`

This file contains all TypeScript types and interfaces for type safety.

#### **PomodoroMode**
```typescript
export type PomodoroMode = 'work' | 'break';
```
- **What it is:** A union type (only allows 'work' or 'break')
- **Why use it:** Prevents typos and provides autocomplete
- **Where used:** Throughout the app to track current timer mode

#### **PomodoroState**
```typescript
export interface PomodoroState {
  tag: string;              // Category/label for the session
  mode: PomodoroMode;       // Current mode: 'work' or 'break'
  timeLeft: number;         // Remaining time in seconds
  isRunning: boolean;       // Timer running state
  defaultWorkTime: number;  // Default work session duration
  defaultBreakTime: number; // Default break session duration
}
```
- **What it is:** Interface defining the timer's state shape
- **Why use it:** Ensures all state has the correct properties
- **Where used:** Context type definition

#### **PomodoroSession**
```typescript
export interface PomodoroSession {
  tag: string;        // What the user was working on
  duration: number;   // How long they worked (seconds)
  timestamp: number;  // When completed (Unix timestamp)
  completed: boolean; // Whether session was finished or abandoned
}
```
- **What it is:** Shape of a completed session saved to history
- **Why use it:** Type-safe session tracking
- **Where used:** Session history in localStorage

**Key Concepts:**
- `type` vs `interface`: Use `type` for unions/primitives, `interface` for objects
- Interfaces are extendable and provide better error messages
- TypeScript catches errors at compile-time, not runtime

---

## Context API & State Management

### `src/contexts/ThemeContext.tsx`

**Purpose:** Manages dark/light theme across the entire app using React Context API.

#### **Why Context API?**
Without Context, you'd have to pass theme state through every component (prop drilling):
```
App → Component1 → Component2 → Component3 → needs theme
```

With Context, any component can access theme directly:
```
ThemeProvider wraps app → Any component uses useTheme()
```

#### **Implementation Pattern:**

**Step 1: Define Context Type**
```typescript
interface ThemeContextType {
  theme: Theme;                 // Current theme value
  toggleTheme: () => void;      // Function to switch themes
}
```

**Step 2: Create Context**
```typescript
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
```
- Generic `<ThemeContextType | undefined>` provides type safety
- `undefined` is default (context used outside provider)

**Step 3: Create Provider Component**
```typescript
export function ThemeProvider({children}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initializer function runs only once on mount
    const savedTheme = localStorage.getItem('pomodoro-theme') as Theme;
    if (savedTheme) return savedTheme;

    // Check browser's dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  // Sync theme to DOM and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pomodoro-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**Step 4: Custom Hook for Consuming Context**
```typescript
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
```
- Provides better DX (developer experience)
- Built-in error checking
- Cleaner than using `useContext` directly

**Usage in Components:**
```typescript
function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

**Key Concepts:**
- `createContext`: Creates a context object
- `Provider`: Makes values available to children
- `useContext`: Hook to consume context values
- `useState` initializer: Function runs once, useful for expensive operations
- `useEffect`: Side effects (DOM manipulation, localStorage)

---

### `src/hooks/PomodoroContext.tsx`

**Purpose:** Global state management for the Pomodoro timer (like a mini-Redux).

This is a more complex Context example with:
- Multiple state values
- localStorage persistence
- `useCallback` for performance
- Action functions (like Redux actions)

#### **Architecture:**

```typescript
interface PomodoroContextType extends PomodoroState {
  // State setters
  setTag: (tag: string) => void;
  setMode: (mode: PomodoroMode) => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  setIsRunning: (running: boolean) => void;

  // Session management
  sessions: PomodoroSession[];
  setSessions: (sessions: PomodoroSession[]) => void;

  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  saveSession: (session: PomodoroSession) => void;

  // Modal state
  showConfirmModal: boolean;
  setShowConfirmModal: (show: boolean) => void;
  wasRunningBeforeModal: boolean;
  setWasRunningBeforeModal: (wasRunning: boolean) => void;
}
```

#### **localStorage Helpers:**

```typescript
const loadSessionsFromStorage = (): PomodoroSession[] => {
  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load sessions', error);
  }
  return [];
};
```
- Always wrap localStorage in try-catch (can fail in private browsing)
- Return safe defaults on error

#### **State Initialization:**

```typescript
const savedState = loadStateFromStorage();

const [tag, setTag] = useState<string>(savedState.tag ?? 'General');
const [mode, setMode] = useState<PomodoroMode>(savedState.mode ?? 'work');
const [timeLeft, setTimeLeft] = useState<number>(savedState.timeLeft ?? defaultWorkTime);
```
- `??` (nullish coalescing): Use right side if left is null/undefined
- Loads from localStorage, falls back to defaults

#### **State Persistence:**

```typescript
useEffect(() => {
  saveStateToStorage({
    tag, mode, timeLeft, isRunning,
    showConfirmModal, wasRunningBeforeModal
  });
}, [tag, mode, timeLeft, isRunning, showConfirmModal, wasRunningBeforeModal]);
```
- Dependency array: Re-run when any value changes
- Automatically saves state on every change

#### **useCallback for Performance:**

```typescript
const startTimer = useCallback(() => {
  setIsRunning(true);
}, []);

const pauseTimer = useCallback(() => {
  setIsRunning(false);
}, []);

const resetTimer = useCallback(() => {
  setIsRunning(false);
  setTimeLeft(mode === 'work' ? defaultWorkTime : defaultBreakTime);
}, [mode]);
```

**Why useCallback?**
- Without it: Function recreated on every render
- With it: Same function reference unless dependencies change
- Important when passing functions to child components (prevents unnecessary re-renders)

**Dependency arrays:**
- `[]` = Never changes
- `[mode]` = Changes when mode changes

#### **Functional State Updates:**

```typescript
const saveSession = useCallback((session: PomodoroSession) => {
  setSessions((prev) => [...prev, session]);
}, []);
```
- `(prev) => newValue` ensures you're working with latest state
- Safer than `setSessions([...sessions, session])`
- Important in async scenarios

**Key Concepts:**
- Multiple `useState` hooks in one component
- `useCallback`: Memoize functions to prevent re-creation
- Functional updates: `(prev) => newValue` pattern
- localStorage integration with error handling
- Separation of concerns: helper functions outside component

---

## Components

### `src/components/Timer.tsx`

**Purpose:** Main timer component with countdown logic and controls.

#### **Hooks Used:**

```typescript
const {
  timeLeft, setTimeLeft, isRunning, startTimer, pauseTimer,
  resetTimer, saveSession, tag, mode, setMode, ...
} = usePomodoro();

const [showToast, setShowToast] = useState(false);
const [toastData, setToastData] = useState<{...}>({...});
```
- Destructures values from context
- Local state for toast (only this component needs it)

#### **useEffect #1: Countdown Interval**

```typescript
useEffect(() => {
  if (!isRunning || timeLeft <= 0) return;

  const interval = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning, timeLeft, setTimeLeft]);
```

**How it works:**
1. Guard clause: Only run if timer is active and time remains
2. `setInterval`: Creates repeating timer (1000ms = 1 second)
3. Functional update: `(prev) => prev - 1` decrements safely
4. Cleanup function: `return () => clearInterval(interval)`
   - Prevents memory leaks
   - Runs when component unmounts or before effect re-runs

**Dependency array:** `[isRunning, timeLeft, setTimeLeft]`
- Effect re-runs when any dependency changes
- Creates new interval when timer starts/stops

#### **useEffect #2: Timer Completion**

```typescript
useEffect(() => {
  if (timeLeft === 0 && !showConfirmModal) {
    const session: PomodoroSession = { tag, duration: initialTime, ... };
    saveSession(session);

    setToastData({ message: completionMessage, ... });
    setShowToast(true);

    const nextMode: PomodoroMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setTimeLeft(nextDuration);
    pauseTimer();
  }
}, [timeLeft, showConfirmModal, mode, ...]);
```

**What happens when timer hits zero:**
1. Save session to history
2. Show completion toast
3. Switch to next mode (work → break or break → work)
4. Reset time for next session
5. Auto-pause (user must manually start next session)

#### **Event Handlers:**

```typescript
const handlerFinishSession = () => {
  const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;

  if (!isRunning && timeLeft === initialTime) return;

  setWasRunningBeforeModal(isRunning);
  pauseTimer();
  setShowConfirmModal(true);
};
```
- Guard clause: Don't show modal if timer hasn't been used
- Remember running state to restore if user cancels

```typescript
const confirmFinishSession = () => {
  const duration = initialTime - timeLeft;
  const session: PomodoroSession = { tag, duration, ... };
  saveSession(session);
  resetTimer();
  setShowConfirmModal(false);
};
```
- Calculate partial duration (time actually worked)
- Save partial session
- Reset timer

#### **JSX Structure:**

```typescript
return (
  <div className={styles.timer}>
    <ModeIndicator />

    <div className={styles.timeDisplay}>
      {formatTimeMMSS(timeLeft)}
    </div>

    <div className={styles.timerControls}>
      <button onClick={isRunning ? pauseTimer : startTimer}>
        {isRunning ? '⏸ Pause' : '▶️ Start'}
      </button>

      <button onClick={resetTimer}>🔄 Reset</button>

      <button onClick={handlerFinishSession}>FINISH</button>
    </div>

    <ConfirmModal
      isOpen={showConfirmModal}
      onConfirm={confirmFinishSession}
      onCancel={cancelFinishSession}
      title="Finish Session?"
      message="Are you sure you want to end this Pomodoro session early?"
    />

    <Toast
      isVisible={showToast}
      onClose={() => setShowToast(false)}
      {...toastData}
    />
  </div>
);
```

**Key Patterns:**
- Conditional rendering: `{isRunning ? 'Pause' : 'Start'}`
- Ternary in props: `onClick={isRunning ? pauseTimer : startTimer}`
- Component composition: Building UI from smaller components
- Props spreading: `{...toastData}` passes all object properties
- Inline arrow functions: `() => setShowToast(false)` (use sparingly)

**Key Concepts:**
- Multiple `useEffect` hooks for different concerns
- Cleanup functions prevent memory leaks
- Guard clauses for early returns
- Functional state updates for safety
- Conditional rendering in JSX
- Event handler patterns

---

### `src/components/TagSelector.tsx`

**Purpose:** Category selection with ability to add custom tags.

#### **Props Interface:**

```typescript
interface TagSelectorProps {
  tag: string;
  setTag: (tag: string) => void;
  mode: PomodoroMode;
}

export function TagSelector({ tag, setTag, mode }: TagSelectorProps) {
  // Component body
}
```
- Destructured props in function parameters
- TypeScript ensures parent passes correct props
- `mode` used to disable tag changes during break

#### **Local State:**

```typescript
const [tags, setTags] = useState<string[]>(['General', 'Work', 'Study']);
const [showAddTag, setShowAddTag] = useState<boolean>(false);
const [newTagName, setNewTagName] = useState<string>('');
```
- `tags`: Array of available tags
- `showAddTag`: Toggle for add tag form
- `newTagName`: Controlled input value

#### **useEffect #1: Load Tags**

```typescript
useEffect(() => {
  const savedTags = localStorage.getItem('pomodoroTags');
  if (savedTags) {
    try {
      const parsed = JSON.parse(savedTags) as string[];
      setTags(parsed);
    } catch {
      // Ignore parse errors - use defaults
    }
  }
}, []);
```
- Empty dependency array `[]` = runs once on mount
- Type assertion: `as string[]` tells TypeScript the type
- Error handling: Silent fail with defaults

#### **useEffect #2: Save Tags**

```typescript
useEffect(() => {
  localStorage.setItem('pomodoroTags', JSON.stringify(tags));
}, [tags]);
```
- Runs whenever `tags` changes
- Automatically persists tag list

#### **useEffect #3: Sync Selected Tag**

```typescript
useEffect(() => {
  if (!tag || tag.trim() === '') {
    setTag('General');
    return;
  }

  if (!tags.includes(tag)) {
    setTags((prev) => [tag, ...prev]);
  }
}, [tag]);
```
- Ensures there's always a selected tag
- If tag from context isn't in list, add it
- Spread operator: `[tag, ...prev]` adds to start of array

#### **Event Handlers:**

```typescript
const handleAddTag = () => {
  const trimmedTag = newTagName.trim();

  if (trimmedTag && !tags.includes(trimmedTag)) {
    setTags([...tags, trimmedTag]);
    setTag(trimmedTag);
    setNewTagName('');
    setShowAddTag(false);
  }
};
```
- Validation: Check for empty and duplicates
- Immutable update: `[...tags, trimmedTag]` (never mutate state)
- Multiple state updates in sequence

#### **Controlled Input:**

```typescript
<input
  type="text"
  value={newTagName}
  onChange={(e) => setNewTagName(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
  placeholder="Tag name..."
  autoFocus
/>
```
- `value={newTagName}`: React controls input value
- `onChange`: Updates state on every keystroke
- `onKeyPress`: Submit on Enter key
- `autoFocus`: Focus input when form appears

#### **List Rendering:**

```typescript
<div className={styles.tagsList}>
  {tags.map((t) => (
    <button
      key={t}
      className={[styles.tagBtn, t === tag ? styles.active : ''].join(' ')}
      onClick={() => handleSelectTag(t)}
      disabled={mode === 'break'}
      aria-pressed={t === tag}
    >
      {t}
    </button>
  ))}
</div>
```

**Key patterns:**
- `.map()`: Transform array to JSX elements
- `key={t}`: Unique identifier (helps React track items)
- Dynamic className: `[...].join(' ')` combines classes
- Conditional class: `t === tag ? styles.active : ''`
- `aria-pressed`: Accessibility for screen readers

**Key Concepts:**
- Controlled components: React controls input value
- Immutable state updates: Always create new arrays/objects
- Array methods: `.map()`, `.includes()`, spread operator
- Multiple `useEffect` for different concerns
- Prop drilling: Passing `setTag` from parent
- Event handlers with validation

---

## Utilities

### `src/utils/formatTime.ts`

**Purpose:** Pure functions for formatting time.

```typescript
export const formatTimeMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
```

**How it works:**
- `Math.floor(seconds / 60)`: Get minutes (rounds down)
- `seconds % 60`: Get remaining seconds (modulo operator)
- `.toString().padStart(2, '0')`: Pad with leading zeros
  - `5` → `"05"`
  - `10` → `"10"`

**Example:**
```typescript
formatTimeMMSS(125) // "02:05" (125 seconds = 2 minutes 5 seconds)
formatTimeMMSS(7)   // "00:07"
```

```typescript
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
```

**Examples:**
```typescript
formatTimeDuration(45)   // "45 seconds"
formatTimeDuration(120)  // "2m"
formatTimeDuration(125)  // "2m 5s"
```

**Key Concepts:**
- Pure functions: Same input always gives same output
- No side effects (don't modify arguments or external state)
- Easy to test and reuse
- Math operations: `Math.floor()`, `Math.round()`, modulo `%`

---

## PWA Configuration

### `vite.config.ts`

**Purpose:** Configure Vite build tool and PWA plugin.

```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },

      manifest: {
        name: 'Pomodoro Timer',
        short_name: 'Pomodoro',
        description: 'A simple and effective Pomodoro timer app',
        theme_color: '#4a90e2',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [...]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [...]
      }
    })
  ]
})
```

**What it does:**
- `registerType: 'autoUpdate'`: Auto-update app when new version available
- `devOptions: { enabled: true }`: Enable PWA in dev mode
- `manifest`: App metadata (name, icon, colors)
- `workbox.globPatterns`: Which files to cache for offline use
- `runtimeCaching`: Cache external resources (like fonts)

**Generated files:**
- `dist/sw.js`: Service Worker (handles caching)
- `dist/manifest.webmanifest`: App manifest
- `dist/workbox-*.js`: Caching library

### `index.html`

```html
<!-- PWA Meta Tags -->
<meta name="theme-color" content="#4a90e2" />
<meta name="description" content="..." />
<link rel="apple-touch-icon" href="/vite.svg" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Pomodoro" />
```

**What these do:**
- `theme-color`: Colors the browser address bar
- `apple-touch-icon`: Icon when saved to iOS home screen
- `apple-mobile-web-app-capable`: Run as standalone app on iOS
- `apple-mobile-web-app-title`: App name on iOS home screen

---

## Key Concepts

### **React Fundamentals**

#### **Components**
- Functions that return JSX (JavaScript XML)
- Can have props (inputs) and state (internal data)
- Reusable and composable

#### **Props**
- Data passed from parent to child
- Read-only (immutable)
- Typed with TypeScript interfaces

#### **State**
- Component's internal data
- Changes trigger re-renders
- Use `useState` hook

#### **Effects**
- Side effects (API calls, timers, DOM manipulation)
- Use `useEffect` hook
- Cleanup functions prevent memory leaks

### **TypeScript Patterns**

#### **Interfaces vs Types**
```typescript
interface User {        // Use for objects
  name: string;
  age: number;
}

type Status = 'active' | 'inactive';  // Use for unions
```

#### **Generic Types**
```typescript
const [items, setItems] = useState<string[]>([]);  // Array of strings
const [user, setUser] = useState<User | null>(null);  // User or null
```

#### **Type Assertions**
```typescript
const data = JSON.parse(stored) as PomodoroSession[];
```

### **React Patterns**

#### **Controlled Components**
```typescript
<input
  value={state}
  onChange={(e) => setState(e.target.value)}
/>
```
- React controls input value
- Single source of truth

#### **Conditional Rendering**
```typescript
{isRunning ? <Pause /> : <Start />}
{showModal && <Modal />}
```

#### **List Rendering**
```typescript
{items.map(item => (
  <Item key={item.id} {...item} />
))}
```
- Always provide `key` prop
- Keys must be unique and stable

#### **Component Composition**
```typescript
<App>
  <Header />
  <Main>
    <Timer />
  </Main>
</App>
```

### **Performance Optimization**

#### **useCallback**
```typescript
const memoizedFunction = useCallback(() => {
  doSomething();
}, [dependency]);
```
- Prevents function recreation on every render
- Important when passing to child components

#### **CSS Modules**
```typescript
import styles from './Component.module.css';
<div className={styles.container} />
```
- Scoped styles (no global conflicts)
- Automatically generates unique class names

### **Best Practices**

1. **Immutability:** Never mutate state directly
   ```typescript
   // ❌ Wrong
   items.push(newItem);
   setItems(items);

   // ✅ Correct
   setItems([...items, newItem]);
   ```

2. **Functional Updates:** Use when new state depends on old
   ```typescript
   setCount(prev => prev + 1);  // Safe in async scenarios
   ```

3. **Dependency Arrays:** Include all used variables
   ```typescript
   useEffect(() => {
     doSomething(value);
   }, [value]);  // Include 'value'
   ```

4. **Error Handling:** Always handle localStorage errors
   ```typescript
   try {
     localStorage.setItem(key, value);
   } catch (error) {
     console.error('Storage failed', error);
   }
   ```

5. **Type Safety:** Define interfaces for all data structures
   ```typescript
   interface Props {
     name: string;
     age?: number;  // Optional
   }
   ```

---

## Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [CSS Modules](https://github.com/css-modules/css-modules)

---

## Practice Exercises

1. **Add a new feature:** Implement session statistics (total time worked)
2. **Create a component:** Build a Settings component to change default times
3. **Add persistence:** Save theme preference to localStorage
4. **Improve UX:** Add keyboard shortcuts (Space to start/pause)
5. **Extend types:** Create a `Settings` interface with work/break durations

---

This app demonstrates modern React patterns and is a great foundation for building more complex applications!
