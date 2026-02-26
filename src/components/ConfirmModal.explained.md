# ConfirmModal Component — Explained

## Overview
A reusable confirmation dialog with Yes/No buttons. Used for delete-tag confirmation. Themed by current mode (work/break colors).

## Learning Concepts
- **Reusable component** — generic props (title, message, onConfirm, onCancel) make it usable anywhere
- **Early return pattern** — `if (!isOpen) return null` prevents rendering when hidden
- **Accessibility** — `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`
- **TypeScript interface** — props are strictly typed via `ConfirmModalProps`

## Component Structure

```
ConfirmModal (props: isOpen, onConfirm, onCancel, title, message)
├── usePomodoro() → mode (for theming only)
├── Early return if !isOpen
└── JSX:
    ├── Icon (AlertCircle from lucide-react)
    ├── Title + Message
    └── Cancel (No) + Confirm (Yes) buttons
```

## Key Pattern: Early return

```tsx
if (!isOpen) return null;
```
Instead of wrapping the entire JSX in `{isOpen && (...)}`, returning `null` early is cleaner — the rest of the function can assume the modal is open. This is called the **guard clause** pattern.

## Design Decision
The modal reads `mode` from context solely for styling (work = red tones, break = green tones). All behavior is controlled through props, keeping the component reusable.
