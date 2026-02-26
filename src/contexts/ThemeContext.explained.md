# ThemeContext - Dark/Light Mode Management - Complete Explanation

## Overview
This file implements a complete dark/light theme system with automatic system preference detection and user preference persistence. It demonstrates a simpler Context pattern than PomodoroContext but includes advanced features like media query detection.

## Learning Concepts
- **Theme Switching**: Implementing dark/light mode
- **System Preferences**: Detecting OS theme settings
- **localStorage Persistence**: Remembering user choice
- **CSS Custom Properties**: Using data attributes for theming
- **Media Queries in JS**: Using matchMedia API
- **Type Literals**: TypeScript union types for theme values

## The Complete Code

```typescript
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('pomodoro-theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pomodoro-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
```

## Type Definitions

### Theme Type

```typescript
type Theme = 'light' | 'dark';
```

**Type Literal (Union Type):**
- Only two possible values: `'light'` or `'dark'`
- TypeScript prevents invalid values
- Better than `string` type

**Example:**
```typescript
const theme: Theme = 'light';    // ✅ OK
const theme: Theme = 'dark';     // ✅ OK
const theme: Theme = 'blue';     // ❌ TypeScript error!
const theme: Theme = 'darkk';    // ❌ TypeScript error! (typo caught)
```

**Benefits:**
- Autocomplete shows only valid options
- Catches typos at compile-time
- Self-documenting code

### ThemeContextType Interface

```typescript
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
```

**Simple interface:**
- `theme`: Current theme ('light' or 'dark')
- `toggleTheme`: Function to switch between themes

**Much simpler than PomodoroContext because:**
- Only one piece of state (theme)
- Only one action (toggle)
- No complex timer logic

## Theme Initialization

```typescript
const [theme, setTheme] = useState<Theme>(() => {
  const savedTheme = localStorage.getItem('pomodoro-theme') as Theme;
  if (savedTheme) {
    return savedTheme;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
});
```

### Lazy Initialization

```typescript
useState<Theme>(() => { ... })
             ↑↑↑↑↑↑↑↑↑
             Function runs once on mount
```

**Why lazy initialization here?**
- Reading from localStorage (I/O operation)
- Checking media queries (browser API call)
- Only need to do this once, not every render

### Priority Order

The initialization follows a priority order:

**1. User's saved preference** (highest priority)
```typescript
const savedTheme = localStorage.getItem('pomodoro-theme') as Theme;
if (savedTheme) {
  return savedTheme;
}
```

**Why first?**
- User explicitly chose this theme
- Most important preference
- Direct user action

**Type assertion `as Theme`:**
```typescript
localStorage.getItem('pomodoro-theme') as Theme
                                       ↑↑↑↑↑↑↑↑
                                       Type assertion
```

- `getItem` returns `string | null`
- We know it's either 'light' or 'dark'
- Tell TypeScript to trust us

**Potential issue:**
```javascript
// User manually edits localStorage
localStorage.setItem('pomodoro-theme', 'invalid-value')

// Our code treats it as valid Theme
const savedTheme = localStorage.getItem('pomodoro-theme') as Theme
// savedTheme = 'invalid-value' but TypeScript thinks it's 'light' | 'dark'
```

**Better approach (validation):**
```typescript
const savedTheme = localStorage.getItem('pomodoro-theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  return savedTheme;
}
```

**2. System preference** (medium priority)
```typescript
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  return 'dark';
}
```

**Breaking down the media query check:**

```typescript
window.matchMedia
       ↓
   Check if browser supports this API
       ↓
window.matchMedia('(prefers-color-scheme: dark)')
                   ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                   CSS media query as string
       ↓
.matches
   ↓
Returns true/false
```

**What is prefers-color-scheme?**
- CSS media query that detects OS theme
- Set in OS settings (e.g., macOS Dark Mode, Windows Dark Theme)
- Same as in CSS:
  ```css
  @media (prefers-color-scheme: dark) {
    /* Dark mode styles */
  }
  ```

**Example in different OS:**
```
macOS:
  System Preferences → General → Appearance → Dark
  → prefers-color-scheme: dark

Windows:
  Settings → Personalization → Colors → Choose your mode → Dark
  → prefers-color-scheme: dark

Linux (GNOME):
  Settings → Appearance → Dark
  → prefers-color-scheme: dark
```

**Why check `window.matchMedia` exists?**
```typescript
if (window.matchMedia && window.matchMedia(...).matches)
    ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    Check browser support first
```

- Older browsers don't support matchMedia
- Prevents errors in legacy environments
- Graceful degradation

**3. Default to light** (lowest priority)
```typescript
return 'light';
```

**Fallback if:**
- No saved preference
- Browser doesn't support matchMedia
- OS doesn't have dark mode enabled

## Theme Persistence Effect

```typescript
useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('pomodoro-theme', theme);
}, [theme]);
```

### Two Responsibilities

#### 1. Update HTML Attribute

```typescript
document.documentElement.setAttribute('data-theme', theme);
```

**What this does:**
```html
<!-- Before -->
<html>

<!-- After (light mode) -->
<html data-theme="light">

<!-- After (dark mode) -->
<html data-theme="dark">
```

**Why on document.documentElement?**
- `document.documentElement` = `<html>` element
- Highest level of DOM tree
- CSS can target it globally

**How CSS uses this:**
```css
[data-theme="light"] {
  --bg-color: white;
  --text-color: black;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: white;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

**Flow:**
```
1. User clicks theme toggle
2. theme state updates ('light' → 'dark')
3. useEffect runs
4. HTML attribute changes (data-theme="dark")
5. CSS variables update
6. Entire UI re-styles instantly
```

#### 2. Save Preference

```typescript
localStorage.setItem('pomodoro-theme', theme);
```

**Runs on every theme change:**
- User toggles theme
- State updates
- Effect saves to localStorage
- Next visit loads saved preference

### Effect Dependency

```typescript
}, [theme]);
   ↑↑↑↑↑↑↑
   Re-run when theme changes
```

**When effect runs:**
- On mount (initial render)
- Whenever `theme` state changes

**First render example:**
```
1. Component mounts
2. theme initializes (e.g., 'light' from localStorage)
3. useEffect runs
4. Sets data-theme="light" on HTML
5. Saves 'light' to localStorage (redundant but harmless)
```

**Toggle example:**
```
1. User clicks toggle button
2. toggleTheme() called
3. theme updates ('light' → 'dark')
4. Component re-renders
5. useEffect sees theme dependency changed
6. Sets data-theme="dark" on HTML
7. Saves 'dark' to localStorage
```

## Toggle Function

```typescript
const toggleTheme = () => {
  setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
};
```

### Functional State Update

```typescript
setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
         ↑↑↑↑↑↑↑↑↑   ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
         |           Ternary operator
         Previous theme value
```

**Ternary operator breakdown:**
```typescript
condition        ? valueIfTrue : valueIfFalse
↓                  ↓             ↓
prevTheme === 'light' ? 'dark' : 'light'
```

**Logic table:**
```
prevTheme  →  condition        →  result
'light'    →  'light' === 'light'  →  'dark'
'dark'     →  'dark' === 'light'   →  'light'
```

**Why functional update?**

❌ **Direct access (could have issues):**
```typescript
const toggleTheme = () => {
  setTheme(theme === 'light' ? 'dark' : 'light');
  //       ↑↑↑↑↑
  //       Reading from closure (could be stale)
};
```

✅ **Functional update (always correct):**
```typescript
const toggleTheme = () => {
  setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  //       ↑↑↑↑↑↑↑↑↑
  //       React guarantees latest value
};
```

**In this case:**
- Probably fine either way (simple toggle)
- Functional update is safer pattern
- Good practice for consistency

### Alternative Implementations

**Using if-else:**
```typescript
const toggleTheme = () => {
  setTheme(prevTheme => {
    if (prevTheme === 'light') {
      return 'dark';
    } else {
      return 'light';
    }
  });
};
```

**Using a map:**
```typescript
const oppositeTheme: Record<Theme, Theme> = {
  light: 'dark',
  dark: 'light'
};

const toggleTheme = () => {
  setTheme(prevTheme => oppositeTheme[prevTheme]);
};
```

**Current approach is clearest** ✅

## Provider Component

```typescript
return (
  <ThemeContext.Provider value={{ theme, toggleTheme }}>
    {children}
  </ThemeContext.Provider>
);
```

**Value object:**
```typescript
{
  theme: 'light',        // Current theme state
  toggleTheme: [Function] // Function to toggle
}
```

**Available to all children:**
```typescript
function AnyChildComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

## Custom Hook

```typescript
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
```

Same pattern as usePomodoro - prevents usage outside provider.

**Error example:**
```typescript
// ❌ Component NOT wrapped in ThemeProvider
function BadComponent() {
  const { theme } = useTheme();
  // Error: "useTheme must be used within a ThemeProvider"
}

// ✅ Component wrapped in ThemeProvider
<ThemeProvider>
  <GoodComponent />  {/* Can use useTheme() */}
</ThemeProvider>
```

## Complete Flow Diagram

### Initial Load

```
1. Browser loads app
   ↓
2. ThemeProvider mounts
   ↓
3. useState lazy initializer runs
   ↓
4. Check localStorage → Found 'dark'
   ↓
5. Set initial state: theme = 'dark'
   ↓
6. First useEffect runs
   ↓
7. Set <html data-theme="dark">
   ↓
8. Save to localStorage (redundant but harmless)
   ↓
9. App renders with dark theme
```

### User Toggles Theme

```
1. User clicks theme toggle button
   ↓
2. onClick calls toggleTheme()
   ↓
3. setTheme(prevTheme => ...)
   ↓
4. React updates state: 'dark' → 'light'
   ↓
5. Component re-renders
   ↓
6. useEffect detects theme dependency changed
   ↓
7. Set <html data-theme="light">
   ↓
8. Save 'light' to localStorage
   ↓
9. CSS variables update (via [data-theme="light"])
   ↓
10. UI re-styles to light theme
```

## Key Concepts

### 1. Data Attribute Theming

**Pattern:**
```
JavaScript → data-theme attribute → CSS variables → UI styles
```

**Benefits:**
- Single source of truth (data-theme)
- Instant theme switching (no page reload)
- CSS-driven styling (performant)
- Works with all components automatically

### 2. Progressive Enhancement

**Fallback chain:**
```
1. Try user preference (localStorage)
   ↓ Not found
2. Try system preference (matchMedia)
   ↓ Not supported or not set
3. Default to light theme
```

**Always works:**
- Even without localStorage (privacy mode)
- Even without matchMedia (old browsers)
- Even with JavaScript disabled (server-side rendering could detect)

### 3. Separation of Concerns

**ThemeContext:**
- Manages theme state
- Provides toggle function
- Handles persistence

**CSS:**
- Defines theme colors
- Applies styles
- Handles transitions

**Components:**
- Just consume theme
- Don't worry about implementation

## Usage Example

### In Components

```typescript
import { useTheme } from './contexts/ThemeContext';

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}
```

### In CSS (index.css)

```css
/* Theme variables */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  --accent: #FF6B6B;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --accent: #FF8E8E;
}

/* Using variables */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.button {
  background-color: var(--accent);
}
```

## Best Practices Demonstrated

✅ **Lazy initialization**
- Only runs expensive operations once

✅ **Functional state updates**
- Guarantees using latest state value

✅ **Type safety**
- Theme can only be 'light' or 'dark'

✅ **Graceful degradation**
- Checks for browser API support

✅ **User preference priority**
- Respects explicit user choice over system preference

✅ **Automatic persistence**
- useEffect handles saving transparently

## Common Mistakes to Avoid

❌ **Direct DOM manipulation outside React**
```typescript
// ❌ Don't do this
document.body.className = 'dark-theme';
```

❌ **Not checking browser support**
```typescript
// ❌ Might crash in old browsers
window.matchMedia('(prefers-color-scheme: dark)').matches
```

❌ **Hardcoding theme in components**
```typescript
// ❌ Don't hardcode
<div style={{ background: '#1a1a1a' }}>
```

## Potential Improvements

### 1. Sync Across Tabs

```typescript
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'pomodoro-theme' && e.newValue) {
      setTheme(e.newValue as Theme);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

### 2. Respect System Preference Changes

```typescript
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem('pomodoro-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  };

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

### 3. Add More Themes

```typescript
type Theme = 'light' | 'dark' | 'auto' | 'high-contrast';
```

### 4. Smooth Transition

```typescript
// Add class before changing theme
document.documentElement.classList.add('theme-transitioning');
document.documentElement.setAttribute('data-theme', theme);

setTimeout(() => {
  document.documentElement.classList.remove('theme-transitioning');
}, 300);
```

## Summary

ThemeContext demonstrates:
- Simple but complete theme system
- Progressive enhancement (user → system → default)
- Automatic persistence
- Browser API integration (matchMedia)
- Type-safe theme values
- Clean React patterns

This file is simpler than PomodoroContext but shows important concepts:
- Media query detection
- Data attribute theming
- Preference priorities
- Graceful fallbacks

---

*Location: `/src/contexts/ThemeContext.tsx`*
*Related concepts: Dark Mode, CSS Custom Properties, Media Queries, Context API*
