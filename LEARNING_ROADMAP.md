# Learning Branch Roadmap

> **Purpose:** Guide for rebuilding all features from `main` on this `learning` branch.
> **Checkpoint:** `9ad3f2b` (learning) → Target: `5e2fc73` (main)
> **Files changed:** 12 files, ~298 lines added, ~60 removed

---

## Features to Rebuild (in order)

### Feature 1: `parseTimeInput` utility
**File:** `src/utils/formatTime.ts`
**Lines:** ~32 new lines
**Concepts:** Pure functions, inverse operations, input validation, guard clauses
**What:** Create the inverse of `formatTimeMMSS` — parse user-typed time strings into seconds.
- Accept: `"25:00"` → 1500, `"5:30"` → 330, `"30"` → 1800 (bare number = minutes)
- Return `number | null` (null = invalid)
- Validate: minutes 0–60, seconds 0–59, total > 0
**Why first:** Pure utility with zero dependencies. Can be tested in isolation. Required by Feature 3.

---

### Feature 2: `sessionDuration` ref in useTimer
**Files:** `src/hooks/pomodoro/useTimer.ts`, `types.ts`, `PomodoroContext.tsx`
**Lines:** ~7 new lines across 3 files
**Concepts:** `useRef` for mutable values that don't trigger re-renders, ref vs state, data flow through context
**What:**
- Add `sessionDuration = useRef<number>(initialTimeState.timeLeft)` in `useTimer`
- Capture `timeLeft` into `sessionDuration.current` when `startTimer()` is called
- Add `sessionDuration: React.RefObject<number>` to `PomodoroContextType` in `types.ts`
- Expose `sessionDuration` through `PomodoroContext.tsx` provider
**Why:** Toast and session history must show the *actual* duration the user worked (which might differ from the default if they edited the timer inline). Without this, the toast always shows the default duration.

---

### Feature 3: `useTimerEdit` hook (inline timer editing)
**Files:** `src/hooks/pomodoro/useTimerEdit.ts` (NEW), `src/components/Timer.tsx`, `src/components/Timer.module.css`
**Lines:** ~75 new (hook) + ~40 modified (Timer)
**Concepts:** Custom hooks, controlled inputs, `useRef` for DOM access, `isCancelling` ref pattern, input masking, conditional rendering
**What:**
- **Hook** (`useTimerEdit.ts`): manages `isEditing`/`editValue` state, `inputRef` for auto-focus, `isCancelling` ref to prevent blur conflicts with Escape. Only calls `setTimeLeft` (NOT `setWorkDuration`/`setBreakDuration` — session time, not default time).
- **Input mask**: strips non-digits, auto-inserts colon after 2 digits (`handleEditChange`)
- **Timer.tsx**: conditional render — `<input>` when editing, `<div>` when not. `startEditing` is guarded by `!isRunning`. Remove `SettingsPanel` import and `settingsOpen` state from Timer.
- **Timer.module.css**: add `.timeInput` class (matches `.timeDisplay` but for `<input>`), `.timeDisplayDisabled` (cursor: default when running), change `.timeDisplay` font-size to `clamp(4.5rem, 15vw, 10rem)`, remove redundant mobile font-size override

### Key edge cases to handle:
1. `onBlur` vs `Escape` — use `isCancelling` ref so blur doesn't confirm when user pressed Escape
2. Running timer — `startEditing` returns early, cursor stays default
3. Invalid input — on confirm with invalid value, cancel silently (no save)
4. Auto-focus + select all — `useEffect` watching `isEditing`

---

### Feature 4: `sessionDuration` in useTimerCompletion
**File:** `src/hooks/pomodoro/useTimerCompletion.ts`
**Lines:** ~8 lines changed
**Concepts:** Ref consumption, accurate data reporting
**What:**
- Add `sessionDuration: React.RefObject<number>` to the props interface
- Replace `const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime` with `const actualDuration = sessionDuration.current`
- Use `actualDuration` for both saved session duration AND toast display
- Wire `sessionDuration` prop in Timer.tsx when calling `useTimerCompletion`
**Why:** Without this, the toast shows "25:00" even if the user edited the timer to 1:00 and ran that. The session history also records the wrong duration.

---

### Feature 5: Unified Settings Menu
**Files:** `src/components/SettingsPanel.tsx`, `src/components/SettingsPanel.module.css`, `src/App.tsx`, `src/utils/translations.ts`
**Lines:** ~80 modified
**Concepts:** Component composition, lifting state up, CSS toggle switches, i18n
**What:**
- **SettingsPanel.tsx**: Add dark mode toggle (imports `useTheme`), language selector (imports `useLanguage`), keep existing duration inputs + sound toggle + clear data
- **SettingsPanel.module.css**: Add `.toggleBtn`, `.toggleTrack`, `.toggleThumb`, `.toggleActive` for custom dark mode toggle switch
- **App.tsx**: Replace language `<select>` + theme toggle `<button>` with single hamburger `<Menu>` icon. Move `settingsOpen` state here. Render `<SettingsPanel>` from App (not Timer). Remove `useTheme` and `useLanguage` imports from App.
- **translations.ts**: Add `darkMode` and `language` keys to `Translations` interface + all 5 language objects

---

## Architecture Diagram

```
BEFORE (learning branch):
┌─ App.tsx ─────────────────────────┐
│  Language select + Theme toggle   │  ← controls in header
│  ┌─ Timer.tsx ─────────────────┐  │
│  │  Click timer → SettingsPanel│  │  ← settings opened from Timer
│  │  (durations + sound + clear)│  │
│  └─────────────────────────────┘  │
└───────────────────────────────────┘

AFTER (main branch):
┌─ App.tsx ─────────────────────────┐
│  Hamburger menu → SettingsPanel   │  ← unified menu from header
│  (dark mode, durations, language, │
│   sound, clear data)              │
│  ┌─ Timer.tsx ─────────────────┐  │
│  │  Click timer → inline edit  │  │  ← MM:SS input in-place
│  │  (session time only)        │  │
│  └─────────────────────────────┘  │
└───────────────────────────────────┘
```

## Two Time Concepts

```
DEFAULT TIME (SettingsPanel)          SESSION TIME (inline edit)
─────────────────────────             ─────────────────────────
setWorkDuration(seconds)              setTimeLeft(seconds)
setBreakDuration(seconds)
Persists in localStorage              Resets to default after completion
Applies on next reset/completion      Only affects current countdown
```

## Verification Checklist

After rebuilding all features, verify:
- [ ] Click timer when paused → inline MM:SS input appears
- [ ] Type "30:00" + Enter → timer shows 30:00
- [ ] Press Escape during edit → no change
- [ ] Click outside during edit → confirms the value
- [ ] Timer running → clicking does nothing (cursor: default)
- [ ] Hamburger icon in header → opens settings menu
- [ ] Settings menu has: dark mode toggle, durations, language, sound, clear data
- [ ] No language select or theme button in header (moved to menu)
- [ ] Set default work to 25min, inline edit to 1min → toast shows "1m" not "25m"
- [ ] After session completes, timer resets to default (25:00), not session time (1:00)
- [ ] `npx vite build` — no errors
- [ ] `npx tsc --noEmit` — no errors
