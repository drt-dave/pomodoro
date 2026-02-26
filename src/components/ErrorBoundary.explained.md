# ErrorBoundary — Explained

## What problem does this solve?

Without error boundaries, if **any** component throws an error during rendering, React unmounts the **entire app**. The user sees a blank white screen with no way to recover except refreshing the page. That's terrible UX.

Error boundaries are React's mechanism for catching render errors and showing a fallback UI instead of crashing everything.

## Why a class component?

This is the **only** place in the app where we use a class component, and it's not by choice — it's a React limitation.

React only exposes error-catching lifecycle methods on class components:
- `static getDerivedStateFromError()` — called when a child throws during render
- `componentDidCatch()` — called after the error, used for logging

**There is no hook equivalent.** You cannot catch render errors with `useEffect` or `useState`. This is a well-known gap in the React hooks API. If React adds a `useErrorBoundary` hook in the future, this could be refactored, but for now, class component is the only option.

## How it works — step by step

### 1. Normal operation (no error)
```
render() → hasError is false → return this.props.children
```
The boundary is invisible. It just renders whatever is inside it.

### 2. A child throws during render
```
Child throws → React calls getDerivedStateFromError()
            → returns { hasError: true }
            → React calls componentDidCatch(error, errorInfo)
            → we log to console
            → render() runs again → hasError is true → show fallback UI
```

### 3. User clicks "Try Again"
```
handleReset() → setState({ hasError: false })
             → render() → hasError is false → try rendering children again
```
This gives the children a fresh chance. If the error was transient (like a race condition), it may work now. If the error is persistent, it'll catch again and show the fallback.

## Two-level architecture

We use the same `ErrorBoundary` component at two different levels:

### Root level (main.tsx)
```tsx
<StrictMode>
  <ErrorBoundary fullPage>        ← catches EVERYTHING
    <SettingsProvider>
      <LanguageProvider>
        <ThemeProvider>
          <PomodoroProvider>
            <App />
          </PomodoroProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SettingsProvider>
  </ErrorBoundary>
</StrictMode>
```
- Wraps **outside** all providers
- Uses `fullPage` prop (takes up the entire screen)
- Uses **hardcoded English strings** (no translation props) because LanguageProvider might be the thing that crashed
- Last line of defense — if this one catches, something very wrong happened

### View level (App.tsx)
```tsx
{activeView === 'timer' && (
  <ErrorBoundary
    fallbackTitle={translations.errorBoundaryTitle}
    fallbackMessage={translations.errorBoundaryMessage}
    fallbackResetLabel={translations.errorBoundaryReset}
  >
    <TagSelector ... />
    <Timer />
    <SessionNote />
  </ErrorBoundary>
)}

{activeView === 'stats' && (
  <ErrorBoundary ...translations>
    <Stats />
  </ErrorBoundary>
)}
```
- Timer and Stats are wrapped **independently**
- If Stats crashes, Timer keeps working (and vice versa)
- Uses **translated strings** via props (LanguageProvider is above this level, so it's safe)
- "Try Again" re-renders just that view, not the whole app

## The props explained

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;           // what to render normally
  fallbackTitle?: string;        // heading in error UI (default: English)
  fallbackMessage?: string;      // description in error UI (default: English)
  fallbackResetLabel?: string;   // button text (default: English)
  fullPage?: boolean;            // true = 100dvh centered, false = inline
}
```

All string props are **optional with English defaults**. This matters because:
- Root level: no translations available → uses defaults
- View level: translations available → passes them as props

## Key patterns to understand

### 1. `static getDerivedStateFromError()`
A **static** method — it doesn't have access to `this`. It receives the error and must return a state update object. React calls this during the "render phase" so it must be pure (no side effects).

### 2. `componentDidCatch(error, errorInfo)`
An **instance** method — called during the "commit phase" (after React has updated the DOM). This is where you do side effects like logging. `errorInfo.componentStack` tells you which component tree path threw.

### 3. Arrow function for `handleReset`
```typescript
handleReset = (): void => {
  this.setState({ hasError: false });
};
```
Arrow function auto-binds `this`. Without it, `this` would be `undefined` when called from the onClick handler. Alternative: `this.handleReset = this.handleReset.bind(this)` in the constructor.

### 4. `role="alert"` on the fallback container
Accessibility: screen readers announce `role="alert"` content immediately when it appears. This ensures users with assistive technology know something went wrong.

## How to test it manually

1. Open any component (e.g., `Stats.tsx`)
2. Add `throw new Error('test crash')` at the top of the render function
3. Navigate to that view — you'll see the fallback UI instead of a white screen
4. Click "Try Again" — it will try to render Stats again (and crash again, since the throw is hardcoded)
5. Remove the throw and save — hot reload will fix it

## What this does NOT catch

Error boundaries only catch errors during **rendering** (the render phase). They do NOT catch:
- Errors in **event handlers** (use try/catch in the handler)
- Errors in **async code** (promises, setTimeout)
- Errors in the **error boundary itself**

For event handler errors, regular try/catch is the right tool. Error boundaries are specifically for "this component tree is broken and can't render."

## Next steps for learning

1. **Try crashing different components** to see which boundary catches it
2. **Look at `componentStack`** in the console — it shows the exact component tree path
3. **Future improvement:** you could add a "Report Bug" button that sends the error to a logging service (like Sentry)
4. **React 19+** may eventually add a hook-based API — keep an eye on the React docs
