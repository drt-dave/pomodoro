# ModeIndicator Component — Explained

## Overview
Displays the current mode (Work/Break) as a clickable pill. Clicking toggles between modes, preserving each mode's remaining time. Disabled while the timer is running.

## Learning Concepts
- **Config object pattern** — `modeConfig` maps mode → icon/label/className instead of if/else chains
- **State preservation** — `workTimeLeft`/`breakTimeLeft` remember each mode's timer independently
- **Accessibility** — `role="button"`, `tabIndex`, dynamic `aria-label`
- **Conditional styling** — joining CSS classes based on state

## Component Structure

```
ModeIndicator
├── usePomodoro() → mode, setMode, isRunning, pauseTimer, timeLeft, setTimeLeft, defaults
├── useLanguage() → translations
├── Local state: workTimeLeft, breakTimeLeft
├── Effect: sync timeLeft → appropriate mode's stored time
├── modeConfig object: { work: {icon, label, class}, break: {icon, label, class} }
├── handleToggle: switch mode + restore saved time (blocked while running)
└── JSX: clickable div with icon + label
```

## Key Patterns

### Config object (avoids if/else)
```tsx
const modeConfig = {
  work:  { icon: <Briefcase/>, label: translations.workSession, className: styles.work },
  break: { icon: <Coffee/>,    label: translations.breakTime,   className: styles.break }
};
const config = modeConfig[mode]; // one lookup, no branching
```

### Time preservation across modes
Without `workTimeLeft`/`breakTimeLeft`, switching from Work (18:42 remaining) to Break and back would reset Work to 25:00. The effect syncs `timeLeft` into the current mode's stored variable, and `handleToggle` restores the other mode's saved time.
