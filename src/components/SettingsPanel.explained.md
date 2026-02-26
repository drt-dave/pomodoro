# SettingsPanel Component — Explained

## Overview
A modal overlay with form controls for work/break duration, sound toggle, and a danger-zone "Clear All Data" button. Uses local state for the form, only committing to context on Save.

## Learning Concepts
- **Local vs global state** — form edits stay local until Save; cancel discards them
- **Unit conversion** — context stores seconds, UI displays minutes (localMinutes * 60)
- **Two-step confirmation** — Clear Data button asks "are you sure?" on second click
- **Event propagation** — `e.stopPropagation()` on panel prevents overlay click from closing

## Component Structure

```
SettingsPanel (props: isOpen, onClose)
├── useLanguage() → translations
├── useSettings() → workDuration, breakDuration, soundEnabled, setters, clearAllData
├── Local state: localWorkMinutes, localBreakMinutes, localSoundEnabled, showClearConfirm
├── Early return if !isOpen
├── handleSave — convert minutes→seconds, update context, close
├── handleClearData — two-step: first click shows confirm text, second click clears
└── JSX:
    ├── Overlay (click = close)
    ├── Panel (stopPropagation)
    │   ├── Work duration input (number, 1-60)
    │   ├── Break duration input (number, 1-30)
    │   ├── Sound toggle (checkbox styled as switch)
    │   ├── Clear Data button (danger zone)
    │   └── Cancel / Save buttons
```

## Key Pattern: Local form state

```tsx
const [localWorkMinutes, setLocalWorkMinutes] = useState(workDuration / 60);

const handleSave = () => {
  setWorkDuration(localWorkMinutes * 60);  // commit to context
  onClose();
};
```
This lets the user change values, see the preview, and cancel without affecting the app. Only `handleSave` pushes changes to the global context. This is the **optimistic editing** pattern — edits are local until explicitly confirmed.
