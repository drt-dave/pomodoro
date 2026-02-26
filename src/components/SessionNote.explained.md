# SessionNote Component — Explained

## Overview
A simple textarea for the user to attach a note to the current pomodoro session. The note is stored in context (`sessionNote`) and saved with the session when the timer completes.

## Learning Concepts
- **Controlled textarea** — `value={sessionNote}` + `onChange` keeps React in control
- **Context consumption** — reads/writes `sessionNote` via `usePomodoro()`
- **Keyboard handling** — Enter blurs the textarea (submits), Shift+Enter allows newlines

## Component Structure

```
SessionNote
├── usePomodoro() → sessionNote, setSessionNote
├── useLanguage() → translations (placeholder text)
└── JSX: div > textarea
```

## Key Pattern: Enter to blur

```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();      // don't insert newline
    e.currentTarget.blur();  // dismiss keyboard on mobile
  }
}}
```
This is a UX pattern for mobile: pressing Enter dismisses the keyboard instead of adding a line break. `Shift+Enter` still works for multiline input.
