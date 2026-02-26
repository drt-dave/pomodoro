# TagSelector Component — Explained

## Overview
Renders the tag/category picker: a list of tag pills, add/delete buttons, and inline rename on double-click. Tags are persisted to localStorage independently from the context.

## Learning Concepts
- **Conditional rendering** — ternary to swap button/input in `.map()`
- **useRef** — imperative DOM access for auto-focusing the edit input
- **Controlled inputs** — `value` + `onChange` pattern
- **Event handlers** — onClick, onDoubleClick, onBlur, onKeyDown
- **localStorage persistence** — load on mount, save on change via useEffect

## Component Structure

```
TagSelector (props: tag, setTag, mode)
├── useLanguage() → translations
├── usePomodoro() → renameTag
├── Local state: tags[], showAddTag, newTagName, showDeleteConfirm, editingTag, editValue
├── editInputRef (useRef)
├── Effects:
│   ├── Load tags from localStorage (mount only)
│   ├── Save tags to localStorage (on tags change)
│   ├── Auto-focus edit input (on editingTag change)
│   └── Ensure active tag exists in tags list
├── Handlers:
│   ├── handleAddTag — trim, deduplicate, add to list, select it
│   ├── handleSelectTag — set active tag
│   ├── handleDeleteTag — remove tag, select first remaining
│   ├── handleDoubleClick — enter edit mode (blocked during break)
│   └── handleRenameConfirm — validate, update local tags + context sessions
└── JSX:
    ├── Add/Delete buttons (or Add form when showAddTag=true)
    ├── Tags list: editingTag===t ? <input/> : <button/>
    └── ConfirmModal for delete confirmation
```

## Key Patterns

### Inline rename (double-click)
The tag list uses conditional rendering inside `.map()`:
- Normal state: `<button>` with `onDoubleClick`
- Editing state: `<input>` with `onBlur` (confirm), `onKeyDown` (Enter/Escape)
- Both branches need a `key` prop since they're inside `.map()`

### Auto-focus with useRef + useEffect
Can't focus the input in `handleDoubleClick` because the input doesn't exist yet (React hasn't re-rendered). The `useEffect` runs after render when the input is in the DOM.

### Rename propagation
`handleRenameConfirm` updates two things:
1. Local `tags` array (via `setTags`) — for the UI list
2. Context sessions (via `renameTag`) — for stats/history consistency

### Props vs Context
`tag`, `setTag`, `mode` come as **props** (passed from Timer). `renameTag` comes from **context** (usePomodoro). This is because TagSelector is rendered by Timer, which already has tag/mode — no need to read context twice.
