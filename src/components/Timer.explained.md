# Timer Component - Complete Explanation

## Overview
The Timer component is the heart of the UI - it displays the countdown, handles start/pause/reset controls, manages automatic mode switching (work → break), saves completed sessions, and shows notifications when sessions complete.

## Learning Concepts
- **Separation of Concerns**: Countdown logic moved to Context, UI stays here
- **Wall-Clock Timing**: Why `setInterval` was removed (see usePomodoro.explained.md)
- **Multiple useEffect**: Separating concerns
- **Conditional Rendering**: Showing UI based on state
- **Event Handlers**: User interactions (start, pause, reset, finish)
- **Modal Dialogs**: Confirmation before actions
- **Toast Notifications**: User feedback
- **CSS Modules**: Component-scoped styling

## Component Structure

```
Timer
├── usePomodoro (global state from context)
├── Local state (toast data)
├── [REMOVED] Effect 1: Countdown interval — moved to PomodoroContext
├── Effect: Auto mode-switching when time reaches 0
├── Event handlers (start, pause, reset, finish, confirm, cancel)
└── JSX (UI rendering)
    ├── ModeIndicator
    ├── Time display (+ opens SettingsPanel on click)
    ├── Control buttons (Play/Pause, Reset, Stop — lucide-react icons)
    ├── ConfirmModal
    ├── Toast
    └── SettingsPanel
```

## Imports

```typescript
import { useEffect, useState } from "react";
import { usePomodoro } from "../hooks/pomodoro/PomodoroContext";
import type {PomodoroMode, PomodoroSession} from "../types/pomodoro.types";
import { ConfirmModal } from "./ConfirmModal";
import { formatTimeMMSS } from "../utils/formatTime";
import { ModeIndicator } from "./ModeIndicator";
import { Toast } from "./Toast";
import styles from './Timer.module.css';
```

**CSS Modules:**
```typescript
import styles from './Timer.module.css';
```
- Imports styles as JavaScript object
- Class names are locally scoped
- Prevents CSS naming conflicts

**Usage:**
```typescript
<div className={styles.timer}>  {/* Becomes: <div class="Timer_timer__abc123"> */}
```

## State Management

### Global State (from Context)

```typescript
const {
  timeLeft,           // Current countdown time (seconds)
  setTimeLeft,        // Update time
  isRunning,          // Is timer counting down?
  startTimer,         // Start countdown
  pauseTimer,         // Pause countdown
  resetTimer,         // Reset to default time
  saveSession,        // Save completed session
  tag,                // Current tag (e.g., "Study", "Work")
  mode,               // Current mode ('work' or 'break')
  setMode,            // Switch mode
  defaultWorkTime,    // Default work duration (25 min)
  defaultBreakTime,   // Default break duration (5 min)
  showConfirmModal,   // Is confirmation modal visible?
  setShowConfirmModal,// Show/hide modal
  wasRunningBeforeModal, // Was timer running before modal opened?
  setWasRunningBeforeModal // Remember timer state
} = usePomodoro();
```

**Destructuring all needed values:**
- Avoids repeating `usePomodoro().timeLeft`
- Makes code cleaner
- All in one place

### Local State (Toast)

```typescript
const [showToast, setShowToast] = useState(false);
const [toastData, setToastData] = useState<{
  message: string;
  duration: number;
  type: 'work' | 'break';
}>({
  message: '',
  duration: 0,
  type: 'work'
});
```

**Why local instead of global?**
- Toast only relevant to Timer component
- Doesn't need to persist
- Other components don't need this state

**TypeScript inline type:**
```typescript
useState<{ message: string; duration: number; type: 'work' | 'break' }>({...})
         ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
         Inline interface definition
```

Could be extracted:
```typescript
interface ToastData {
  message: string;
  duration: number;
  type: 'work' | 'break';
}

const [toastData, setToastData] = useState<ToastData>({...});
```

## CHANGE: Countdown Timer (REMOVED from Timer.tsx)

> **CHANGE (wall-clock refactor):** The entire countdown effect was removed from this file.
> The timing logic now lives in `PomodoroContext.tsx`. See `PomodoroContext.explained.md`
> for the full explanation of the wall-clock approach.

### What was here before:

```typescript
// OLD CODE — DELETED
useEffect(() => {
  if (!isRunning || timeLeft <= 0) return;

  const interval = setInterval(() => {
    setTimeLeft((prev) => prev - 1);   // decrement by 1 each tick
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning, timeLeft, setTimeLeft]);
```

This was a classic `setInterval` countdown: every second, subtract 1 from `timeLeft`. It worked fine on desktop but **broke on mobile devices** — when the user locked their screen or switched apps, the browser suspended JavaScript, and `setInterval` stopped firing. The timer would freeze.

### What replaced it:

```typescript
// NEW — just a comment
// Countdown is now handled by PomodoroContext (wall-clock based)
```

The countdown moved to `PomodoroContext.tsx`, where it uses a **wall-clock approach**: instead of counting ticks (`timeLeft - 1`), it stores the exact timestamp when the timer should end (`targetEndTime`) and recalculates `remaining = targetEndTime - Date.now()` on each tick.

### Why the logic moved:

**Before:** Timer.tsx (UI component) owned the countdown logic.
**After:** PomodoroContext.tsx (state layer) owns the countdown logic.

This is **separation of concerns** — a professional React pattern:
- The Context manages *when* and *how* time updates (state logic)
- The Timer component just reads `timeLeft` and displays it (UI logic)
- Timer.tsx went from ~2 effects to ~1 effect (only the completion handler remains)

### What Timer.tsx still does:

Timer.tsx keeps the **completion effect** (Effect 2 below) — when `timeLeft` hits 0, it plays sounds, saves the session, shows the toast, and switches modes. That's UI behavior, so it stays here.

## Effect 2: Auto Mode Switching

```typescript
useEffect(() => {
  if (timeLeft === 0 && !showConfirmModal) {
    // ... save session, show toast, switch mode
  }
}, [timeLeft, showConfirmModal, mode, tag, defaultWorkTime, defaultBreakTime,
    saveSession, pauseTimer, setMode, setTimeLeft]);
```

### When This Runs

```typescript
if (timeLeft === 0 && !showConfirmModal) {
```

**Conditions:**
1. Timer reached zero
2. Modal not currently shown

**Why check `!showConfirmModal`?**
- Prevents running when user manually finishes (shows modal)
- Only runs for natural completion (countdown to 0)

### Save Session

```typescript
const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;

const session: PomodoroSession = {
  tag: tag,
  duration: initialTime,
  timestamp: Date.now(),
  completed: true
};
saveSession(session);
```

**Session object:**
```javascript
{
  tag: "Study",          // What they worked on
  duration: 1500,        // How long (in seconds)
  timestamp: 1703427600000, // When (Unix timestamp)
  completed: true        // Finished naturally (not manually stopped)
}
```

**`Date.now()`:**
- Returns current time as Unix timestamp (milliseconds since Jan 1, 1970)
- Example: `1703427600000` = December 24, 2024

### Show Completion Message

```typescript
const completionMessage = mode === 'work'
  ? '✅ Work session completed!'
  : '☕ Break completed!';

setToastData({
  message: completionMessage,
  duration: initialTime,
  type: mode
});
setShowToast(true);
```

**Ternary for different messages:**
```
mode = 'work'  → "✅ Work session completed!"
mode = 'break' → "☕ Break completed!"
```

**Toast data includes:**
- Message to show
- Duration of completed session (for display)
- Type (affects styling/icon)

### Switch to Next Mode

```typescript
const nextMode: PomodoroMode = mode === 'work' ? 'break' : 'work';
setMode(nextMode);

const nextDuration: number = nextMode === 'work' ? defaultWorkTime : defaultBreakTime;
setTimeLeft(nextDuration);

pauseTimer();
```

**Flow:**
```
1. Determine next mode:
   work → break
   break → work

2. Set new mode state

3. Determine duration for new mode:
   work → defaultWorkTime (25 min)
   break → defaultBreakTime (5 min)

4. Set new time

5. Pause timer (don't auto-start)
```

**Why pause?**
- Gives user chance to prepare
- User must explicitly start next session
- Prevents surprises

### Large Dependency Array

```typescript
}, [timeLeft, showConfirmModal, mode, tag, defaultWorkTime, defaultBreakTime,
    saveSession, pauseTimer, setMode, setTimeLeft]);
```

**Why so many dependencies?**

Every value used inside effect must be in array:
- `timeLeft` - checked in condition
- `showConfirmModal` - checked in condition
- `mode` - used to determine message and next mode
- `tag` - used in session object
- `defaultWorkTime`, `defaultBreakTime` - used for durations
- `saveSession`, `pauseTimer`, `setMode`, `setTimeLeft` - called

**ESLint will warn if you miss any!**

## Event Handlers

### Start/Pause Toggle

```typescript
<button
  onClick={() => {
    console.log(`Vi alklakis butonon! (${isRunning ? 'Pause' : 'Start'})`);
    isRunning ? pauseTimer() : startTimer();
  }}
  disabled={showConfirmModal}
>
  {isRunning ? '⏸ Pause' : '▶️ Start'}
</button>
```

**Inline arrow function:**
```typescript
onClick={() => { ... }}
```

**Alternative (extracted):**
```typescript
const handleStartPause = () => {
  isRunning ? pauseTimer() : startTimer();
};

<button onClick={handleStartPause}>
```

**Ternary operator:**
```
isRunning = true  → pauseTimer() called → "⏸ Pause" shown
isRunning = false → startTimer() called → "▶️ Start" shown
```

**Disabled during modal:**
```typescript
disabled={showConfirmModal}
```
- Can't start/pause while modal open
- Prevents weird states

### Reset Handler

```typescript
<button onClick={() => {
  console.log('Vi alklakis butonon! (Reset)');
  resetTimer();
}}>🔄 Reset</button>
```

**What `resetTimer()` does:**
- Pauses timer
- Resets time to default for current mode
- (Defined in PomodoroContext)

### Finish Session Handler

```typescript
const handlerFinishSession = () => {
  const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;

  if (!isRunning && timeLeft === initialTime) {
    return;
  }

  setWasRunningBeforeModal(isRunning);
  pauseTimer();
  setShowConfirmModal(true);
}
```

**Guard condition:**
```typescript
if (!isRunning && timeLeft === initialTime) {
  return;
}
```

**Prevents finishing if:**
- Timer not running AND
- Time hasn't changed (still at default)

**Why?**
- Nothing to finish (no time elapsed)
- Avoids saving 0-duration sessions

**Before showing modal:**
```typescript
setWasRunningBeforeModal(isRunning);
```
- Remember if timer was running
- Used when canceling (resume if was running)

```typescript
pauseTimer();
setShowConfirmModal(true);
```
- Pause timer while deciding
- Show confirmation modal

### Confirm Finish

```typescript
const confirmFinishSession = () => {
  const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;
  const duration = initialTime - timeLeft;

  const session: PomodoroSession = {
    tag: tag,
    duration: duration,
    timestamp: Date.now(),
    completed: true,
  };

  saveSession(session);
  resetTimer();
  setShowConfirmModal(false);
}
```

**Calculate partial duration:**
```typescript
const duration = initialTime - timeLeft;
```

**Example:**
```
Initial time: 1500 seconds (25 minutes)
Time left: 900 seconds (15 minutes)
Duration worked: 1500 - 900 = 600 seconds (10 minutes)
```

**Session saved with partial time:**
- User worked for 10 minutes
- Finished early
- Still counts as completed session

### Cancel Finish

```typescript
const cancelFinishSession = () => {
  setShowConfirmModal(false);

  if (wasRunningBeforeModal) {
    startTimer();
  }
}
```

**Smart resume:**
- If timer was running before modal → resume
- If timer was paused before modal → stay paused

**Flow:**
```
1. User clicks "Finish" while timer running
2. wasRunningBeforeModal = true
3. Timer pauses, modal shows
4. User clicks "Cancel"
5. Modal closes
6. Timer resumes automatically ✓
```

## JSX Rendering

### Mode Indicator

```typescript
<ModeIndicator />
```

Shows current mode (Work/Break) with visual styling.

### Time Display

```typescript
<div className={styles.timeDisplay}>
  {formatTimeMMSS(timeLeft)}
</div>
```

**formatTimeMMSS utility:**
```typescript
formatTimeMMSS(125) → "02:05"
formatTimeMMSS(59)  → "00:59"
```

### Control Buttons

```typescript
<div className={styles.timerControls}>
  <button>Start/Pause</button>
  <button>Reset</button>
  <button>Finish</button>
</div>
```

All buttons in a flex container for layout.

### Conditional Modal

```typescript
<ConfirmModal
  isOpen={showConfirmModal}
  onConfirm={confirmFinishSession}
  onCancel={cancelFinishSession}
  title="Finish Session?"
  message="Are you sure you want to end this Pomodoro session early?"
/>
```

**Props explained:**
- `isOpen`: Controls visibility (true/false)
- `onConfirm`: Callback when user confirms
- `onCancel`: Callback when user cancels
- `title`, `message`: Modal content

**Modal only renders when `isOpen={true}`**

### Toast Notification

```typescript
<Toast
  isVisible={showToast}
  message={toastData.message}
  duration={toastData.duration}
  type={toastData.type}
  onClose={() => setShowToast(false)}
/>
```

**Auto-dismissing notification:**
- Shows after session completes
- Displays completion message
- Auto-hides after a few seconds
- User can manually dismiss

## Key Patterns Demonstrated

### 1. Separation of Concerns (CHANGE)

**Before:** Timer.tsx had two effects — one for countdown, one for mode switching.
**After:** Timer.tsx only has the mode-switching effect. Countdown moved to PomodoroContext.

```typescript
// PomodoroContext.tsx — handles the counting (state layer)
useEffect(() => { /* wall-clock countdown */ }, [isRunning, targetEndTime]);

// Timer.tsx — handles what happens at zero (UI layer)
useEffect(() => { /* completion: sound, toast, mode switch */ }, [timeLeft, ...]);
```

**Why this split is better:**
- Context owns "how time works" — a single source of truth
- Timer owns "what the user sees and hears" — UI behavior
- If you build another component that needs the timer, it just reads `timeLeft` from context

### 2. Cleanup Functions

```typescript
return () => clearInterval(interval);
```

**Prevents:**
- Memory leaks
- Zombie timers
- Performance issues

### 3. Guard Clauses

```typescript
if (!isRunning || timeLeft <= 0) return;
```

**Early returns:**
- Cleaner than nested ifs
- Shows exceptional cases first
- Main logic less indented

### 4. Functional State Updates

```typescript
setTimeLeft((prev) => prev - 1)
```

**Always uses latest state:**
- No stale closures
- No race conditions

### 5. CSS Modules

```typescript
import styles from './Timer.module.css';
<div className={styles.timer}>
```

**Scoped styling:**
- No global pollution
- No naming conflicts
- Co-located with component

## Common Mistakes to Avoid

❌ **Forgetting cleanup**
```typescript
useEffect(() => {
  setInterval(() => {
    setTimeLeft(prev => prev - 1);
  }, 1000);
  // ❌ Missing: return () => clearInterval(...)
}, [isRunning]);
```

❌ **Direct state in interval**
```typescript
setInterval(() => {
  setTimeLeft(timeLeft - 1);  // ❌ Stale closure
}, 1000);
```

❌ **Missing dependencies**
```typescript
useEffect(() => {
  console.log(mode);  // Uses 'mode'
}, []);  // ❌ Missing 'mode' in dependencies
```

❌ **Not guarding interval creation**
```typescript
useEffect(() => {
  // ❌ Creates interval even when paused
  const interval = setInterval(...);
  return () => clearInterval(interval);
}, [isRunning]);
```

## Potential Improvements

### 1. Extract Handlers

```typescript
const useTimerHandlers = () => {
  // Move all handler functions here
  return {
    handleStartPause,
    handleReset,
    handleFinish,
    confirmFinish,
    cancelFinish
  };
};
```

### 2. Use useReducer

```typescript
const [toastState, dispatch] = useReducer(toastReducer, initialState);

dispatch({ type: 'SHOW_TOAST', payload: { message, duration } });
```

### 3. Extract Timer Logic

```typescript
const useTimerCountdown = (isRunning, timeLeft, setTimeLeft) => {
  useEffect(() => {
    // Countdown logic
  }, [isRunning, timeLeft, setTimeLeft]);
};
```

### 4. Add Sound Notifications

```typescript
useEffect(() => {
  if (timeLeft === 0) {
    new Audio('/notification.mp3').play();
  }
}, [timeLeft]);
```

## Summary

Timer component is the main UI for the Pomodoro timer:
- **One effect** for completion handling (countdown moved to PomodoroContext)
- Smart pause/resume during modals
- Automatic mode switching (work → break → work)
- User feedback via Toast and browser notifications
- Type-safe throughout

**Key change (wall-clock refactor):** The `setInterval` countdown was removed from here. Timer.tsx no longer manages *how* time passes — it only manages *what happens* when time runs out. This is separation of concerns: state logic in the Context, UI logic in the component.

---

*Location: `/src/components/Timer.tsx`*
*Related: Timer.module.css, PomodoroContext, formatTime utility*
