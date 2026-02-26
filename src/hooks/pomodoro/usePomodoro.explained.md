# usePomodoro — Global State Module (Explained)

## Overview

The `hooks/pomodoro/` folder is the state management core of the app. It was refactored from a single 263-line file into 5 single-responsibility modules following SOLID principles.

## Architecture

```
hooks/pomodoro/
├── types.ts              ← Interfaces (no logic)
├── storage.ts            ← localStorage read/write (pure functions, no React)
├── useTimer.ts           ← Wall-clock countdown, start/pause/reset
├── useSessions.ts        ← Session history, saveSession, renameTag
└── PomodoroContext.tsx   ← Thin Provider that composes hooks + usePomodoro()
```

**Data flow:**
```
useSettings() ──→ PomodoroProvider
                      ├── useTimer()      → timeLeft, isRunning, start/pause/reset
                      ├── useSessions()   → sessions, saveSession, renameTag
                      ├── localStorage    ← storage.ts (auto-persist via useEffect)
                      └── usePomodoro()   ← components consume this hook
```

## File: types.ts

Defines two interfaces:

- **PomodoroContextType** — the public API shape. Extends `PomodoroState` with setters, timer controls, session management, modal state, and session notes. Every value exposed by `usePomodoro()` is defined here.
- **PersistedState** — what gets saved to localStorage: tag, mode, timeLeft, isRunning, modal state, sessionNote, and `targetEndTime` (for wall-clock timer recovery on page reload).

**Key concept:** Separating the "what we expose" (ContextType) from "what we persist" (PersistedState) keeps the contract clear.

## File: storage.ts

Four pure functions with no React dependency:

| Function | Input | Output | localStorage key |
|---|---|---|---|
| `loadSessionsFromStorage` | — | `PomodoroSession[]` | `pomodoro_sessions` |
| `saveSessionsToStorage` | `PomodoroSession[]` | void | `pomodoro_sessions` |
| `loadStateFromStorage` | — | `Partial<PersistedState>` | `pomodoro_state` |
| `saveStateToStorage` | `PersistedState` | void | `pomodoro_state` |

**Pattern:** All use try/catch for resilience — localStorage can fail in private browsing, when quota is exceeded, or if data is corrupted. On failure, load functions return empty defaults; save functions log and continue silently.

**Why `Partial<PersistedState>`?** Stored data might be from an older app version missing newer fields. Using `??` (nullish coalescing) when reading ensures safe defaults.

## File: useTimer.ts

Custom hook managing the wall-clock countdown. Receives `defaultWorkTime`, `defaultBreakTime`, `mode`, and `savedState` as props.

### State recovery (initialTimeState)

On mount, checks if a `targetEndTime` was saved:
- **Timer still running:** calculates remaining seconds, starts as `isRunning: true`
- **Timer expired while page was closed:** sets `timeLeft: 0` (triggers completion effect in Timer.tsx)
- **No active timer:** restores `timeLeft` from saved state or defaults

### Three effects

1. **Wall-clock countdown** — `setInterval` that recalculates `remaining = targetEndTime - Date.now()` every second. Unlike a simple `prev - 1` decrement, this survives browser throttling, screen lock, and tab suspension.

2. **Visibility resync** — listens to `visibilitychange` event. When the user returns to the tab, instantly recalculates remaining time (no 1-second lag from waiting for the next interval tick).

3. **Settings sync** — when user changes work/break duration in settings, updates `timeLeft` if the timer is at its reset position. Uses `useRef` to track previous durations.

### Timer controls

- **startTimer** — calculates `targetEndTime = Date.now() + timeLeft * 1000`, sets `isRunning: true`
- **pauseTimer** — snapshots remaining time from `targetEndTime`, clears `targetEndTime`, sets `isRunning: false`. Uses updater form `setTargetEndTime((prev) => ...)` to avoid stale closures.
- **resetTimer** — clears `targetEndTime`, stops timer, resets `timeLeft` to default for current mode

### Returns
`{ timeLeft, setTimeLeft, isRunning, setIsRunning, targetEndTime, startTimer, pauseTimer, resetTimer }`

## File: useSessions.ts

Custom hook managing session history. Receives `tag`, `setTag`, `sessionNote`, and `setSessionNote` as props.

### State
- `sessions` — loaded from localStorage on mount via lazy initialization

### Auto-persist effect
`useEffect(() => saveSessionsToStorage(sessions), [sessions])` — reactive persistence. Any change to sessions (add, rename) automatically saves.

### Functions
- **saveSession** — appends a new session with the current `sessionNote`, then clears the note
- **renameTag** — maps through all sessions replacing `oldName` with `newName`, also updates active tag if it matches

### Returns
`{ sessions, setSessions, saveSession, renameTag }`

## File: PomodoroContext.tsx

The **Facade** — composes all hooks into a single context.

### What it does
1. Reads settings from `useSettings()`
2. Loads persisted state from `storage.ts`
3. Declares simple state: `tag`, `mode`, `showConfirmModal`, `wasRunningBeforeModal`, `sessionNote`
4. Calls `useTimer()` and `useSessions()` with the state they need
5. Persists everything to localStorage via a single `useEffect`
6. Passes all values/functions through `<PomodoroContext.Provider value={...}>`

### usePomodoro() hook
Calls `useContext(PomodoroContext)` with a safety check — throws a clear error if used outside the Provider.

**Key concept — Facade Pattern:** Components call `usePomodoro()` and get a flat object. They don't know the logic is split across `useTimer` and `useSessions`. The internal architecture can change without touching any component.

## Design Decisions

**Why hooks instead of separate contexts?**
Separate contexts would cause components to subscribe to only what they need (better performance), but adds complexity. Hooks inside one context is simpler and sufficient at this app's scale.

**Why props instead of importing context in hooks?**
`useTimer` and `useSessions` receive values as props instead of calling `usePomodoro()` themselves. This avoids circular dependencies (the hooks are used *inside* the Provider, so the context doesn't exist yet when they run).
