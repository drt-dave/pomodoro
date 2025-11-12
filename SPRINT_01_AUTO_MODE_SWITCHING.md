# Sprint 1: Auto Mode Switching & Mode Visibility

## Sprint Goal
Implement automatic mode switching between work and break sessions, add visual mode indicators, and provide user feedback when sessions are saved.

## Sprint Duration
Estimated: 3-5 hours for a junior developer

---

## User Stories

### Story 1: Automatic Mode Switching
**As a** Pomodoro user
**I want** the timer to automatically switch to break mode when a work session ends
**So that** I can take breaks without manually switching modes

**Priority:** High
**Effort:** 3 story points

### Story 2: Mode Visibility
**As a** user
**I want** to see which mode I'm currently in (work or break)
**So that** I know whether I should be working or taking a break

**Priority:** High
**Effort:** 2 story points

### Story 3: Manual Mode Toggle
**As a** user
**I want** to manually switch between work and break modes
**So that** I have flexibility in how I use the timer

**Priority:** Medium
**Effort:** 2 story points

### Story 4: Session Saved Notification
**As a** user
**I want** to receive a notification when my session is saved
**So that** I have confirmation that my work was tracked

**Priority:** Medium
**Effort:** 2 story points

---

## Acceptance Criteria

### Feature 1: Auto Mode Switching

#### Scenario 1: Work session completes naturally
```gherkin
GIVEN I am in work mode with the timer running
WHEN the timer reaches 0:00
THEN the session should be saved
AND the mode should automatically switch to "break"
AND the timer should be set to defaultBreakTime
AND a notification should appear saying "Work session saved!"
```

#### Scenario 2: Break session completes naturally
```gherkin
GIVEN I am in break mode with the timer running
WHEN the timer reaches 0:00
THEN the session should be saved
AND the mode should automatically switch to "work"
AND the timer should be set to defaultWorkTime
AND a notification should appear saying "Break session saved!"
```

### Feature 2: Mode Visibility

#### Scenario 1: Display current mode
```gherkin
GIVEN I am using the timer
WHEN I look at the interface
THEN I should clearly see whether I'm in "work" mode or "break" mode
AND the mode indicator should be visually distinct (different colors/icons)
```

#### Scenario 2: Mode persistence
```gherkin
GIVEN I am in break mode
WHEN I refresh the page
THEN the interface should still show I'm in break mode
```

### Feature 3: Manual Mode Toggle

#### Scenario 1: Switch from work to break
```gherkin
GIVEN I am in work mode
WHEN I click the mode toggle button
THEN the mode should switch to "break"
AND the timer should be reset to defaultBreakTime
AND the timer should be paused
```

#### Scenario 2: Switch from break to work
```gherkin
GIVEN I am in break mode
WHEN I click the mode toggle button
THEN the mode should switch to "work"
AND the timer should be reset to defaultWorkTime
AND the timer should be paused
```

#### Scenario 3: Toggle button availability
```gherkin
GIVEN the timer is running
WHEN I try to switch modes manually
THEN the mode toggle button should either:
  - Be disabled (showing a tooltip: "Pause timer to switch modes")
  - OR show a confirmation dialog: "This will reset your current session. Continue?"
```

### Feature 4: Session Saved Notification

#### Scenario 1: Show notification on save
```gherkin
GIVEN a session has been saved
WHEN the save operation completes
THEN a popup/toast notification should appear
AND it should display: "[Work/Break] session saved! Duration: [X minutes Y seconds]"
AND it should auto-dismiss after 3-5 seconds
AND it should have a close button for manual dismissal
```

---

## Technical Implementation Guide

### Files to Modify

#### 1. `src/hooks/PomodoroContext.tsx`
**What to add:**
- No major changes needed, but ensure `setMode` is properly exposed
- ⚠️ **Performance Note:** Functions like `saveSession`, `pauseTimer`, `resetTimer`, and `startTimer` should be wrapped in `useCallback` to prevent unnecessary re-renders (see Issue #5)

**Current state:**
- ✅ Already has mode state management
- ✅ Already has defaultWorkTime and defaultBreakTime constants
- ⚠️ Functions are not memoized (performance optimization recommended)

#### 2. `src/components/Timer.tsx`
**What to add:**
- Modify the timer completion logic (currently at line 43-58)
- Add auto mode switching after session completion
- Add notification trigger when session is saved

**Current implementation to change:**
```typescript
// Line 43-58: Current timer completion logic
useEffect(() => {
  if( timeLeft === 0 && !showConfirmModal){
    //Timer naturally completed
    const initialTime = mode === 'work' ? defaultWorkTime : defaultBreakTime;
    const session: PomodoroSession = {
      tag:tag,
      duration: initialTime,
      timestamp: Date.now(),
      completed: true,
    };
    saveSession(session);
    pauseTimer();
    resetTimer(); // This needs to change
    //TODO: Play sound, show notification,etc.
  }
}, [ timeLeft, showConfirmModal, mode, tag, defaultWorkTime, defaultBreakTime, saveSession, pauseTimer, resetTimer ]);
```

**New implementation should:**
```typescript
// Pseudo-code for auto mode switching
if (timeLeft === 0 && !showConfirmModal) {
  // 1. Save the session (already done)
  saveSession(session);

  // 2. Show notification with duration
  showNotification(`${mode === 'work' ? 'Work' : 'Break'} session saved!`);

  // 3. Switch mode
  const newMode = mode === 'work' ? 'break' : 'work';
  setMode(newMode);

  // 4. Set timer to new mode's default time
  const newTime = newMode === 'work' ? defaultWorkTime : defaultBreakTime;
  setTimeLeft(newTime);

  // 5. Pause timer (don't auto-start next session)
  pauseTimer();
}
```

#### 3. Create `src/components/ModeToggle.tsx` (NEW FILE)
**Purpose:** Button component to manually switch between work/break modes

**Requirements:**
- Display current mode with icon/color
- Show "Work Mode" or "Break Mode" text
- Button to toggle between modes
- Handle mode switching logic
- Disable when timer is running (optional: show confirmation instead)

**Suggested structure:**
```typescript
export const ModeToggle = () => {
  const { mode, setMode, isRunning, resetTimer, pauseTimer,
          defaultWorkTime, defaultBreakTime, setTimeLeft } = usePomodoro();

  const handleModeToggle = () => {
    // If running, either disable or show confirmation
    if (isRunning) {
      // Option 1: Do nothing (button is disabled)
      // Option 2: Show confirmation modal
      return;
    }

    // Switch mode
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);

    // Reset timer to new mode's time
    const newTime = newMode === 'work' ? defaultWorkTime : defaultBreakTime;
    setTimeLeft(newTime);
    pauseTimer();
  };

  return (
    <div className="mode-toggle">
      <div className={`mode-indicator ${mode}`}>
        {mode === 'work' ? '💼 Work Mode' : '☕ Break Mode'}
      </div>
      <button
        onClick={handleModeToggle}
        disabled={isRunning}
      >
        Switch to {mode === 'work' ? 'Break' : 'Work'}
      </button>
    </div>
  );
};
```

#### 4. Create `src/components/SessionNotification.tsx` (NEW FILE)
**Purpose:** Toast/popup notification when session is saved

**Requirements:**
- Auto-appear when session saved
- Show session type (work/break) and duration
- Auto-dismiss after 3-5 seconds
- Manual close button
- Non-blocking (overlay or corner notification)

**Suggested structure:**
```typescript
interface NotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: string; // Optional: formatted duration
}

export const SessionNotification = ({
  message,
  isVisible,
  onClose,
  duration
}: NotificationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000); // Auto-dismiss after 4s
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="notification-toast">
      <div className="notification-content">
        <span>✅ {message}</span>
        {duration && <span className="duration">{duration}</span>}
      </div>
      <button onClick={onClose} className="close-btn">✕</button>
    </div>
  );
};
```

#### 5. `src/App.tsx`
**What to add:**
- Import and render `ModeToggle` component
- Import and render `SessionNotification` component
- Add notification state management (if not in context)

**Suggested placement:**
```typescript
// Add ModeToggle above or below TagSelector
<div className="card tagselector-card">
  <TagSelector tag={tag} setTag={setTag} mode={mode} />
  <ModeToggle /> {/* Add here */}
</div>
```

#### 6. `src/App.css` (styling)
**What to add:**
- `.mode-toggle` styles
- `.mode-indicator` styles with different colors for work/break
- `.notification-toast` styles (fixed position, animation)

**Suggested styles:**
```css
/* Mode Toggle Styles */
.mode-toggle {
  margin-top: 1rem;
  text-align: center;
}

.mode-indicator {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.mode-indicator.work {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.mode-indicator.break {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10b981;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slideIn 0.3s ease-out;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-toast .close-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
}
```

---

## Testing Checklist

### Manual Testing

- [ ] **Auto Switch - Work to Break**
  1. Start a work session
  2. Wait for timer to reach 0:00 (or set to 3 seconds for testing)
  3. Verify mode changes to "Break"
  4. Verify timer shows defaultBreakTime
  5. Verify notification appears
  6. Verify session saved in stats

- [ ] **Auto Switch - Break to Work**
  1. Switch to break mode
  2. Start break session
  3. Wait for timer to reach 0:00
  4. Verify mode changes to "Work"
  5. Verify timer shows defaultWorkTime
  6. Verify notification appears

- [ ] **Mode Visibility**
  1. Check that current mode is clearly displayed
  2. Verify different visual styling for work vs break
  3. Refresh page - verify mode persists

- [ ] **Manual Mode Toggle**
  1. Click mode toggle button while timer is paused
  2. Verify mode switches
  3. Verify timer resets to new mode's time
  4. Try clicking while timer is running (should be disabled or show confirmation)

- [ ] **Notification**
  1. Complete a session
  2. Verify notification appears in corner/top of screen
  3. Verify it shows correct message and duration
  4. Wait 4-5 seconds - verify auto-dismiss
  5. Manually click close button - verify immediate dismiss

- [ ] **Edge Cases**
  1. Complete session when on Stats view - notification should still appear
  2. Refresh page during notification - should not reappear
  3. Complete multiple sessions quickly - notifications should stack or replace

### Browser Compatibility
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Code follows existing project patterns
- [ ] All manual tests passed
- [ ] No console errors
- [ ] State persists across page reloads
- [ ] UI is responsive and visually consistent
- [ ] Code is committed with clear commit messages

---

## Development Tips

### 1. Start with Mode Visibility
Begin by creating the `ModeToggle` component - this gives you immediate visual feedback and is the simplest feature.

### 2. Use Shorter Times for Testing
The code already has short times (25 seconds work, 5 seconds break). You might want to make them even shorter during development:
```typescript
const defaultWorkTime = 5; // 5 seconds for testing
const defaultBreakTime = 3; // 3 seconds for testing
```

### 3. Console Logging
Add console logs to track mode changes:
```typescript
console.log('Mode changed to:', newMode);
console.log('Timer set to:', newTime);
```

### 4. Notification State Management
You have two options:
- **Option A:** Add notification state to PomodoroContext (more global)
- **Option B:** Use local state in App.tsx and pass to Timer via props (simpler)

I recommend Option B for simplicity:
```typescript
// In App.tsx
const [notification, setNotification] = useState({
  show: false,
  message: ''
});
```

### 5. Reuse ConfirmModal Pattern
Look at how `ConfirmModal` is implemented - you can follow the same pattern for `SessionNotification`.

### 6. Performance Optimization (Optional but Recommended)
After implementing the features, consider optimizing the PomodoroContext functions with `useCallback` (Issue #5). This prevents unnecessary re-renders but is not critical for functionality.

---

## Common Pitfalls to Avoid

❌ **Don't auto-start the next session** - Always pause after mode switch so user can choose when to start

❌ **Don't forget to save the session** - Mode switching should happen AFTER session is saved

❌ **Don't allow mode switching while timer running** - This creates confusion about whether current session should be saved

❌ **Don't lose the current tag** - When switching modes, preserve the selected tag

❌ **Don't forget mobile view** - Make sure mode indicator and notifications work on small screens

---

## Bonus Features (Optional)

If you finish early and want extra practice:

1. **Sound Effect** - Play a sound when session completes
2. **Browser Notification** - Use browser's native notification API
3. **Mode History** - Track how many work/break sessions completed today
4. **Keyboard Shortcuts** - Press 'M' to toggle mode, 'Space' to start/pause
5. **Visual Progress Ring** - Circular progress indicator around mode icon

---

## Resources

- Current timer logic: `src/components/Timer.tsx:43-58`
- Mode state management: `src/hooks/PomodoroContext.tsx`
- Existing modal example: `src/components/ConfirmModal.tsx`
- Time formatting utility: `src/utils/formatTime.ts`

---

## Git Workflow

Suggested commit strategy:
1. `feat: add mode toggle component and visual mode indicator`
2. `feat: implement automatic mode switching after session completion`
3. `feat: add session saved notification popup`
4. `style: add mode indicator and notification styling`
5. `test: manual testing and bug fixes`

Good luck with your sprint! 🚀
