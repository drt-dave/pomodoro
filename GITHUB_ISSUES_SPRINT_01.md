# GitHub Issues - Sprint 01: Auto Mode Switching & Mode Visibility

## Milestone Setup

**Milestone Name:** Sprint 01 - Auto Mode Switching & Mode Visibility
**Description:** Implement automatic session transitions and mode visibility to improve user workflow and reduce manual interactions.
**Due Date:** [Set based on sprint planning]
**Total Story Points:** 10

---

## Issue #1: Implement Automatic Mode Switching Between Sessions

**Labels:** `feature`, `priority: high`, `story-points: 3`, `user-facing`

### Description

Implement automatic mode transitions when Pomodoro sessions complete. The timer should intelligently switch between work and break modes without user intervention, following the Pomodoro technique best practices.

### User Story

```
As a Pomodoro user
I want the timer to automatically switch to break mode when a work session ends
So that I can maintain focus without manual mode management
```

### Acceptance Criteria

- [ ] When work timer reaches 0:00, session is saved with `completed: true`
- [ ] Mode automatically switches from `work` → `break` after work session completes
- [ ] Mode automatically switches from `break` → `work` after break session completes
- [ ] Timer resets to appropriate default time based on new mode
- [ ] Timer remains paused after mode switch (no auto-start)
- [ ] Current tag selection persists across mode switches
- [ ] Success notification displays with session type and duration
- [ ] Mode state persists in localStorage for page refresh scenarios

### Technical Implementation

**Files to Modify:**
- `src/components/Timer.tsx` - Update timer completion logic (lines 43-58)
- `src/hooks/PomodoroContext.tsx` - Ensure `setMode` is properly exposed

**Current Behavior:**
```typescript
// Timer.tsx:43-58
if(timeLeft === 0 && !showConfirmModal) {
  saveSession(session);
  pauseTimer();
  resetTimer(); // ❌ Just resets - no mode switching
}
```

**Expected Behavior:**
```typescript
if(timeLeft === 0 && !showConfirmModal) {
  // 1. Save completed session
  saveSession(session);

  // 2. Determine and switch to next mode
  const nextMode = mode === 'work' ? 'break' : 'work';
  setMode(nextMode);

  // 3. Set timer to new mode's default duration
  const nextDuration = nextMode === 'work' ? defaultWorkTime : defaultBreakTime;
  setTimeLeft(nextDuration);

  // 4. Trigger notification
  showNotification({
    type: mode,
    duration: initialTime
  });

  // 5. Keep timer paused
  pauseTimer();
}
```

### Testing Checklist

**Unit Tests:**
- [ ] Mode switches correctly after work session completion
- [ ] Mode switches correctly after break session completion
- [ ] Timer value matches new mode's default time
- [ ] Session is saved before mode switch occurs

**Manual Tests:**
- [ ] Complete work session → verify break mode + break timer
- [ ] Complete break session → verify work mode + work timer
- [ ] Verify tag persists across transitions
- [ ] Refresh page → verify mode state is preserved
- [ ] Check localStorage contains correct mode value

**Edge Cases:**
- [ ] Mode switch works when on Stats tab (not viewing Timer)
- [ ] Multiple rapid completions don't create race conditions
- [ ] Session save failure doesn't prevent mode switch

### Definition of Done

- [ ] All acceptance criteria met
- [ ] Code reviewed by at least one team member
- [ ] No console errors or warnings
- [ ] Follows project TypeScript patterns and conventions
- [ ] State management uses existing context patterns
- [ ] Feature works on Chrome, Firefox, Safari
- [ ] Mobile responsive behavior verified

### Dependencies

None

### Related Issues

- Blocked by: None
- Blocks: #4 (needs mode switch to trigger notifications)
- Related to: #2 (mode visibility shows switched state)

---

## Issue #2: Add Visual Mode Indicator Component

**Labels:** `feature`, `priority: high`, `story-points: 2`, `ui/ux`, `user-facing`

### Description

Create a prominent visual indicator that clearly displays the current session mode (work or break). Users need constant awareness of their current context to maintain proper work/break separation.

### User Story

```
As a user
I want to see which mode I'm currently in (work or break)
So that I know whether I should be working or taking a break at a glance
```

### Acceptance Criteria

- [ ] Mode indicator is prominently visible on Timer view
- [ ] Clear visual distinction between work and break modes (color, icon, text)
- [ ] Mode indicator updates immediately when mode changes
- [ ] Design is consistent with existing UI patterns
- [ ] Indicator is accessible (proper color contrast, semantic HTML)
- [ ] Responsive design works on mobile devices (320px+)
- [ ] State persists across page refreshes

### Technical Implementation

**New File to Create:**
- `src/components/ModeIndicator.tsx`

**Component Structure:**
```typescript
import { usePomodoro } from '../hooks/PomodoroContext';
import '../styles/ModeIndicator.css';

export const ModeIndicator = () => {
  const { mode } = usePomodoro();

  const modeConfig = {
    work: {
      icon: '💼',
      label: 'Work Session',
      className: 'mode-indicator--work'
    },
    break: {
      icon: '☕',
      label: 'Break Time',
      className: 'mode-indicator--break'
    }
  };

  const config = modeConfig[mode];

  return (
    <div className={`mode-indicator ${config.className}`}>
      <span className="mode-indicator__icon" aria-hidden="true">
        {config.icon}
      </span>
      <span className="mode-indicator__label">
        {config.label}
      </span>
    </div>
  );
};
```

**Styling Requirements:**
```css
/* Work Mode: Professional, focused gradient */
.mode-indicator--work {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Break Mode: Relaxed, warm gradient */
.mode-indicator--break {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}
```

**Integration Point:**
- Add to `src/App.tsx` above or below `<TagSelector />`

### Design Requirements

- Minimum height: 48px (adequate touch target)
- Border radius: 8px (consistent with existing cards)
- Font weight: 600 (medium bold)
- Padding: 0.75rem 1rem
- Transition: 0.3s ease for smooth mode changes

### Accessibility Requirements

- [ ] ARIA label describes current mode
- [ ] Color contrast ratio meets WCAG AA (4.5:1 minimum)
- [ ] Text remains readable for colorblind users
- [ ] Icon has `aria-hidden="true"` (decorative)

### Testing Checklist

**Visual Tests:**
- [ ] Work mode displays correctly styled
- [ ] Break mode displays correctly styled
- [ ] Smooth transition animation between modes
- [ ] Readable on all screen sizes (320px - 1920px)

**Integration Tests:**
- [ ] Updates when mode changes via auto-switching
- [ ] Updates when mode changes via manual toggle
- [ ] Persists on page refresh

**Browser Testing:**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (iOS + macOS)

### Definition of Done

- [ ] Component created and rendering correctly
- [ ] CSS follows existing project patterns (variables, naming)
- [ ] Integrated into main Timer view
- [ ] Accessibility audit passed (axe DevTools)
- [ ] Responsive design verified on mobile
- [ ] Code reviewed and approved

### Dependencies

None

### Related Issues

- Related to: #1 (displays mode from auto-switching)
- Related to: #3 (shows manual mode changes)

---

## Issue #3: Implement Manual Mode Toggle Control

**Labels:** `feature`, `priority: medium`, `story-points: 2`, `user-facing`

### Description

Provide users with manual control to switch between work and break modes when needed. This gives flexibility for users who want to adjust their session flow without waiting for automatic transitions.

### User Story

```
As a user
I want to manually switch between work and break modes
So that I have flexibility to adjust my workflow when needed
```

### Acceptance Criteria

- [ ] Toggle button is visible and clearly labeled
- [ ] Button switches mode: `work` ↔ `break`
- [ ] Timer resets to new mode's default duration on toggle
- [ ] Timer automatically pauses when mode is switched manually
- [ ] Button is disabled when timer is running
- [ ] Disabled state shows tooltip: "Pause timer to switch modes"
- [ ] Current tag selection is preserved during toggle
- [ ] Toggle action is logged for analytics/debugging

### Technical Implementation

**New File to Create:**
- `src/components/ModeToggle.tsx`

**Component Structure:**
```typescript
import { usePomodoro } from '../hooks/PomodoroContext';

interface ModeToggleProps {
  className?: string;
}

export const ModeToggle = ({ className = '' }: ModeToggleProps) => {
  const {
    mode,
    setMode,
    isRunning,
    pauseTimer,
    setTimeLeft,
    defaultWorkTime,
    defaultBreakTime
  } = usePomodoro();

  const handleToggle = () => {
    if (isRunning) return; // Button should be disabled

    const newMode = mode === 'work' ? 'break' : 'work';
    const newDuration = newMode === 'work' ? defaultWorkTime : defaultBreakTime;

    // Update mode and reset timer
    setMode(newMode);
    setTimeLeft(newDuration);
    pauseTimer();

    console.log(`Mode manually switched to: ${newMode}`);
  };

  const nextMode = mode === 'work' ? 'Break' : 'Work';

  return (
    <button
      onClick={handleToggle}
      disabled={isRunning}
      className={`mode-toggle-btn ${className}`}
      title={isRunning ? 'Pause timer to switch modes' : `Switch to ${nextMode} mode`}
      aria-label={`Switch to ${nextMode} mode`}
    >
      Switch to {nextMode}
    </button>
  );
};
```

**Integration Point:**
- Add to `src/App.tsx` within `.tagselector-card` div
- Place below `<ModeIndicator />` component

**Styling Requirements:**
```css
.mode-toggle-btn {
  width: 100%;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  border-radius: 6px;
  background: transparent;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-toggle-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.mode-toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### User Flow

```
┌─────────────────────┐
│   Work Mode (25m)   │
│  Timer: Paused      │
│ [Switch to Break] ✓ │ ← User clicks
└─────────────────────┘
           ↓
┌─────────────────────┐
│   Break Mode (5m)   │
│  Timer: Paused      │
│  [Switch to Work] ✓ │
└─────────────────────┘
```

**When Timer is Running:**
```
┌─────────────────────┐
│   Work Mode (15m)   │
│  Timer: Running     │
│ [Switch to Break] ⚫ │ ← Disabled
└─────────────────────┘
```

### Alternative Implementation (Future Enhancement)

**Option B:** Show confirmation modal when timer is running
```typescript
if (isRunning) {
  showConfirmModal({
    title: 'Switch Mode?',
    message: 'This will reset your current session. Progress will not be saved.',
    onConfirm: handleToggle
  });
  return;
}
```

### Testing Checklist

**Functional Tests:**
- [ ] Toggle works when timer is paused
- [ ] Toggle disabled when timer is running
- [ ] Timer resets to correct duration after toggle
- [ ] Mode state persists after toggle
- [ ] Tag selection preserved after toggle

**UI/UX Tests:**
- [ ] Button clearly indicates next mode
- [ ] Disabled state is visually obvious
- [ ] Tooltip appears on hover (disabled state)
- [ ] Button is accessible via keyboard (Tab + Enter)
- [ ] Focus state is visible

**Edge Cases:**
- [ ] Rapid clicking doesn't cause issues
- [ ] Toggle during mode auto-switch works correctly
- [ ] Works correctly when session has just completed

### Definition of Done

- [ ] Component created and functional
- [ ] Disabled state when timer running
- [ ] Integrated into Timer UI
- [ ] Keyboard accessible (Tab, Enter, Space)
- [ ] Tooltip implemented for disabled state
- [ ] Manual testing completed on all browsers
- [ ] Code follows TypeScript best practices

### Dependencies

- Depends on: #2 (ModeIndicator shows toggled state)

### Related Issues

- Related to: #1 (works alongside auto-switching)
- Related to: #2 (updates mode indicator)

---

## Issue #4: Add Session Completion Notification System

**Labels:** `feature`, `priority: medium`, `story-points: 2`, `ui/ux`, `user-facing`

### Description

Implement a toast notification system that provides immediate feedback when sessions are completed and saved. This closes the feedback loop and confirms to users that their work has been tracked.

### User Story

```
As a user
I want to receive a notification when my session is saved
So that I have confirmation that my work was tracked successfully
```

### Acceptance Criteria

- [ ] Notification appears automatically when session completes
- [ ] Shows session type (Work/Break) in notification
- [ ] Displays formatted duration (e.g., "5 minutes 30 seconds")
- [ ] Auto-dismisses after 4 seconds
- [ ] Includes manual close button (X)
- [ ] Non-blocking UI (overlay in corner)
- [ ] Smooth entrance and exit animations
- [ ] Multiple notifications stack or replace (don't overlap)
- [ ] Notification state doesn't persist on page refresh

### Technical Implementation

**New File to Create:**
- `src/components/SessionNotification.tsx`
- `src/hooks/useNotification.ts` (optional custom hook)

**Component Structure:**
```typescript
import { useEffect } from 'react';
import { formatTime } from '../utils/formatTime';
import '../styles/SessionNotification.css';

interface SessionNotificationProps {
  isVisible: boolean;
  sessionType: 'work' | 'break';
  duration: number; // seconds
  onClose: () => void;
}

export const SessionNotification = ({
  isVisible,
  sessionType,
  duration,
  onClose
}: SessionNotificationProps) => {

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const message = sessionType === 'work'
    ? '✅ Work session saved!'
    : '✅ Break completed!';

  const formattedDuration = formatDuration(duration);

  return (
    <div
      className="session-notification"
      role="alert"
      aria-live="polite"
    >
      <div className="session-notification__content">
        <span className="session-notification__message">
          {message}
        </span>
        <span className="session-notification__duration">
          Duration: {formattedDuration}
        </span>
      </div>
      <button
        onClick={onClose}
        className="session-notification__close"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

// Helper function
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) return `${secs} seconds`;
  if (secs === 0) return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
  return `${mins}m ${secs}s`;
}
```

**State Management in App.tsx:**
```typescript
const [notification, setNotification] = useState({
  isVisible: false,
  sessionType: 'work' as 'work' | 'break',
  duration: 0
});

const showNotification = (type: 'work' | 'break', duration: number) => {
  setNotification({
    isVisible: true,
    sessionType: type,
    duration
  });
};

const hideNotification = () => {
  setNotification(prev => ({ ...prev, isVisible: false }));
};
```

**Styling Requirements:**
```css
.session-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 400px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  animation: slideInRight 0.3s ease-out;
  z-index: 1000;
}

@keyframes slideInRight {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.session-notification__content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.session-notification__message {
  font-weight: 600;
  font-size: 1rem;
}

.session-notification__duration {
  font-size: 0.875rem;
  opacity: 0.9;
}

.session-notification__close {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.session-notification__close:hover {
  opacity: 1;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .session-notification {
    left: 20px;
    right: 20px;
    min-width: auto;
  }
}
```

**Integration with Timer.tsx:**
```typescript
// In Timer.tsx completion logic
if(timeLeft === 0 && !showConfirmModal) {
  const session: PomodoroSession = {
    tag,
    duration: initialTime,
    timestamp: Date.now(),
    completed: true,
  };

  saveSession(session);

  // Show notification with type and duration
  showNotification(mode, initialTime);

  // ... rest of mode switching logic
}
```

### Notification Behavior Matrix

| Scenario | Notification Text | Duration Display |
|----------|------------------|------------------|
| Work complete (25m) | ✅ Work session saved! | Duration: 25 minutes |
| Work complete (15m partial) | ✅ Work session saved! | Duration: 15 minutes |
| Break complete (5m) | ✅ Break completed! | Duration: 5 minutes |
| Short test (45s) | ✅ Work session saved! | Duration: 45 seconds |

### Accessibility Requirements

- [ ] Uses `role="alert"` for screen reader announcement
- [ ] `aria-live="polite"` for non-disruptive announcements
- [ ] Close button has descriptive `aria-label`
- [ ] Keyboard accessible (Escape key to close - future enhancement)
- [ ] Sufficient color contrast for text (4.5:1 ratio)

### Testing Checklist

**Functional Tests:**
- [ ] Notification appears on work session completion
- [ ] Notification appears on break session completion
- [ ] Shows correct duration in readable format
- [ ] Auto-dismisses after 4 seconds
- [ ] Manual close button works immediately
- [ ] Notification doesn't reappear on page refresh

**UI/UX Tests:**
- [ ] Smooth slide-in animation
- [ ] Positioned correctly (top-right on desktop)
- [ ] Doesn't block important UI elements
- [ ] Readable on all backgrounds
- [ ] Mobile responsive (full width with margins)

**Edge Cases:**
- [ ] Multiple rapid completions handle gracefully
- [ ] Notification shows when on Stats tab
- [ ] Works correctly on very short sessions (< 1 minute)
- [ ] Duration formatting correct for edge cases (0s, 59s, 60s)

**Browser Compatibility:**
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (desktop + iOS)
- [ ] Mobile browsers (responsive design)

### Definition of Done

- [ ] Component created and rendering correctly
- [ ] Auto-dismiss timer working
- [ ] Manual close functionality working
- [ ] Duration formatting utility tested
- [ ] Integrated with timer completion flow
- [ ] Animations smooth (60fps)
- [ ] Accessible via screen readers
- [ ] Mobile responsive
- [ ] No memory leaks (cleanup in useEffect)
- [ ] Code reviewed and approved

### Dependencies

- Depends on: #1 (triggered by auto mode switching)
- Uses: `src/utils/formatTime.ts` (existing utility)

### Related Issues

- Related to: #1 (displays when auto-switch occurs)

---

## Issue #5: Optimize Context Functions with useCallback

**Labels:** `refactor`, `priority: medium`, `story-points: 1`, `performance`

### Description

Wrap timer control functions in `useCallback` to prevent unnecessary re-renders and effect re-executions. Currently, `saveSession`, `pauseTimer`, `resetTimer`, and `startTimer` functions are recreated on every render, causing dependent useEffect hooks to re-run unnecessarily.

### User Story

```
As a developer maintaining the codebase
I want timer control functions to be stable across renders
So that effect dependencies don't cause unnecessary re-executions and potential performance issues
```

### Current Problem

**File:** `src/hooks/PomodoroContext.tsx:139-154`

Functions are defined inline without `useCallback`:
```typescript
const startTimer = () => {
  setIsRunning(true);
};

const pauseTimer = () => {
  setIsRunning(false);
};

const resetTimer = () => {
  setIsRunning(false);
  setTimeLeft(mode === 'work' ? defaultWorkTime : defaultBreakTime);
};

const saveSession = (session: PomodoroSession) => {
  setSessions((prev) => [...prev, session]);
};
```

**Impact:** These functions are included in useEffect dependencies in Timer.tsx:58, causing the timer completion effect to re-run on every render.

### Acceptance Criteria

- [ ] `startTimer` wrapped in `useCallback` with empty dependency array
- [ ] `pauseTimer` wrapped in `useCallback` with empty dependency array
- [ ] `resetTimer` wrapped in `useCallback` with `[mode, defaultWorkTime, defaultBreakTime]` dependencies
- [ ] `saveSession` wrapped in `useCallback` with empty dependency array
- [ ] No behavioral changes to timer functionality
- [ ] ESLint exhaustive-deps warnings resolved
- [ ] Timer effects only re-run when necessary values change

### Technical Implementation

**File to Modify:**
- `src/hooks/PomodoroContext.tsx`

**Expected Implementation:**
```typescript
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ... existing code ...

export function PomodoroProvider({ children }: PomodoroProviderProps) {
  // ... existing state ...

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? defaultWorkTime : defaultBreakTime);
  }, [mode, defaultWorkTime, defaultBreakTime]);

  const saveSession = useCallback((session: PomodoroSession) => {
    setSessions((prev) => [...prev, session]);
  }, []);

  // ... rest of the code ...
}
```

### Why Setters Are Currently Included in Dependencies

**Context:** Timer.tsx includes setters like `setTimeLeft` in useEffect dependencies (line 40):
```typescript
}, [isRunning, timeLeft, setTimeLeft]);
```

**Explanation:**
1. **React's exhaustive-deps rule** enforces including ALL referenced values, including setters
2. **setState setters are stable** - they never change between renders (guaranteed by React)
3. **Including them is optional but recommended** for:
   - Consistency and explicit dependencies
   - Future-proofing if implementation changes
   - Satisfying the linter without disable comments

**However:** Functions like `saveSession`, `pauseTimer`, `resetTimer` are NOT stable and should be wrapped in `useCallback` to prevent unnecessary effect re-runs.

### Testing Checklist

**Functional Tests:**
- [ ] Timer start/pause functionality unchanged
- [ ] Reset timer works correctly for both modes
- [ ] Session saving still works
- [ ] Mode switching works correctly
- [ ] No regressions in existing features

**Performance Tests:**
- [ ] useEffect in Timer.tsx:32-40 only runs when `isRunning` or `timeLeft` change
- [ ] useEffect in Timer.tsx:43-58 only runs when actual dependencies change
- [ ] React DevTools Profiler shows reduced re-renders (optional verification)

**Code Quality:**
- [ ] No ESLint warnings for exhaustive-deps
- [ ] All useCallback dependencies are correct
- [ ] TypeScript types remain correct

### Definition of Done

- [ ] All functions wrapped in useCallback with correct dependencies
- [ ] No behavioral changes verified through manual testing
- [ ] No ESLint warnings
- [ ] Code follows existing patterns
- [ ] Committed with clear explanation

### Dependencies

None - can be implemented independently

### Related Issues

- Related to: #1 (these functions are used in auto-switching logic)
- Related to: #4 (these functions trigger notifications)

### Notes

**Priority Justification:** Medium priority because:
- Current code works correctly (no bugs)
- Performance impact is minimal for this small app
- Good practice for code quality and maintainability
- Prevents future issues as app grows

**Estimated Effort:** 1 story point (30-60 minutes)
- Simple refactor
- Clear implementation pattern
- Easy to test

---

## Sprint Testing Plan

### Integration Testing Sequence

After all issues are completed, test the full user flow:

1. **Complete Work-Break Cycle**
   - Start work session → wait for completion
   - Verify: mode switches to break ✓
   - Verify: notification appears with work duration ✓
   - Verify: mode indicator shows break ✓
   - Verify: timer shows break duration ✓

2. **Manual Toggle Flow**
   - Pause timer → click mode toggle
   - Verify: mode switches ✓
   - Verify: timer resets ✓
   - Verify: mode indicator updates ✓

3. **Persistence Test**
   - Complete session → refresh page
   - Verify: new mode persists ✓
   - Verify: notification doesn't reappear ✓

### Performance Checklist

- [ ] No layout shifts during mode changes
- [ ] Animations run at 60fps
- [ ] No memory leaks from notification timers
- [ ] LocalStorage updates don't block UI

### Regression Testing

- [ ] Existing features still work (pause, reset, early completion)
- [ ] Tag selection still saves with sessions
- [ ] Stats page displays new sessions correctly
- [ ] Confirm modal still works for early completion

---

## Project Board Setup

**Columns:**
1. **Backlog** - All issues start here
2. **Ready** - Issues ready to be picked up
3. **In Progress** - Actively being worked on (limit: 1-2)
4. **Code Review** - Waiting for review
5. **Testing** - QA/Manual testing phase
6. **Done** - Merged and deployed

**Workflow:**
```
Backlog → Ready → In Progress → Code Review → Testing → Done
```

---

## Labels to Create

```
Priority:
- priority: high (red)
- priority: medium (orange)
- priority: low (yellow)

Type:
- feature (green)
- bug (red)
- enhancement (blue)
- refactor (purple)

Effort:
- story-points: 1
- story-points: 2
- story-points: 3
- story-points: 5

Status:
- blocked (red)
- needs-review (yellow)
- ready-to-merge (green)

Category:
- ui/ux (pink)
- user-facing (blue)
- backend (grey)
- testing (orange)
- performance (teal)
```

---

## Git Branch Naming Convention

```
feature/1-auto-mode-switching
feature/2-mode-indicator
feature/3-manual-mode-toggle
feature/4-session-notifications
refactor/5-optimize-context-functions
```

**Commit Message Format:**
```
feat(timer): implement automatic mode switching

- Add mode transition logic to Timer component
- Switch from work to break after session completion
- Reset timer to new mode's default duration
- Trigger notification on successful save

Closes #1
```

---

## Pull Request Template

```markdown
## Description
Brief description of changes

## Related Issue
Closes #[issue number]

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing Done
- [ ] Manual testing completed
- [ ] All acceptance criteria met
- [ ] Tested on multiple browsers
- [ ] Mobile responsive verified

## Screenshots/Videos
[If applicable]

## Checklist
- [ ] Code follows project conventions
- [ ] No console errors
- [ ] TypeScript types are correct
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] Performance impact considered
```

---

## Sprint Retrospective Template

**To be filled after sprint completion:**

### What Went Well
-

### What Could Be Improved
-

### Action Items
-

### Velocity
- Planned: 9 story points
- Completed: ___ story points
- Completion rate: ___%

---

**Ready to create these issues in GitHub?** Copy each issue section into GitHub's "New Issue" form, assign labels, link to milestone, and start the sprint! 🚀
