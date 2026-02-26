# Stats.tsx — Line by Line Explanation

## What this component does

Stats is the **statistics view** of the app. It takes ALL saved pomodoro sessions
and displays two things:
1. **Overall summary** — total session count + total time
2. **Per-tag breakdown** — how many sessions per tag, with progress bars

---

## Imports (lines 1-4)

```tsx
import { usePomodoro } from '../hooks/pomodoro/PomodoroContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatTimeDuration } from '../utils/formatTime';
import styles from './Stats.module.css';
```

- `usePomodoro` — custom hook to access global state. We only need `sessions` from it.
- `useLanguage` — custom hook for i18n (internationalization). Gives us translated strings.
- `formatTimeDuration` — utility that converts seconds → "5m 30s" format.
- `styles` — CSS Modules import. Each class becomes `styles.className` to avoid global CSS conflicts.

---

## Data Processing (lines 7-32)

This is where raw session data gets transformed into displayable statistics.
No JSX here — just pure data manipulation.

### Step 1: Get data from context (lines 7-8)

```tsx
const { sessions } = usePomodoro();
const { translations } = useLanguage();
```

`sessions` is an array of `PomodoroSession` objects, each one looks like:
```ts
{
  tag: "Study",
  duration: 1500,      // seconds
  timestamp: 170912..., // Date.now() when saved
  completed: true,
  note?: "Practiced React hooks"
}
```

### Step 2: Aggregate by tag with `.reduce()` (lines 11-23)

```tsx
const tagStats = sessions.reduce((acc, session) => {
  if (!acc[session.tag]) {
    acc[session.tag] = { count: 0, totalSeconds: 0 };
  }
  acc[session.tag].count += 1;
  acc[session.tag].totalSeconds += session.duration;
  return acc;
}, {} as Record<string, { count: number; totalSeconds: number }>);
```

**What `.reduce()` does here:**
- Starts with an empty object `{}`
- Loops through every session
- Groups them by `tag` name, counting sessions and summing duration

**Example:** If you have 3 sessions:
```
[{tag: "Study", duration: 1500}, {tag: "Work", duration: 1500}, {tag: "Study", duration: 900}]
```
After `.reduce()`, `tagStats` becomes:
```
{ "Study": {count: 2, totalSeconds: 2400}, "Work": {count: 1, totalSeconds: 1500} }
```

**The type `Record<string, { count: number; totalSeconds: number }>`** means:
- An object where keys are strings (tag names)
- And values have `count` and `totalSeconds`

### Step 3: Convert to sorted array (lines 26-28)

```tsx
const sortedStats = Object.entries(tagStats)
  .map(([tag, stats]) => ({ tag, ...stats }))
  .sort((a, b) => b.count - a.count);
```

Why? Because you can't `.map()` over an object in JSX. You need an array.

- `Object.entries()` turns `{Study: {count:2,...}}` into `[["Study", {count:2,...}]]`
- `.map()` restructures each entry into `{tag: "Study", count: 2, totalSeconds: 2400}`
- `.sort()` orders by session count, highest first (descending)

`b.count - a.count` = **descending**. If it were `a.count - b.count` = ascending.

### Step 4: Overall totals (lines 31-32)

```tsx
const totalSessions = sessions.length;
const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);
```

Simple `.reduce()` — starts at 0, adds each session's duration. Used for the summary card
AND for calculating percentages per tag.

---

## JSX / Render (lines 34-84)

### Structure overview:

```
statsContainer          ← outer wrapper (max-width, background)
├── h2                  ← "Your Pomodoro Stats" title
└── statsContent        ← scrollable inner area
    ├── overallStats    ← summary card (total sessions + time)
    ├── h3              ← "By Label" subtitle
    └── tagStatsList    ← list of tag cards (or empty state)
        └── tagStatCard ← one per tag
            ├── tagStatHeader (tag name + session count badge)
            ├── tagStatTime (total time for this tag)
            ├── progressBar + progressFill (visual bar)
            └── percentageText ("45.2% of total sessions")
```

### Conditional rendering (line 51)

```tsx
{sortedStats.length === 0 ? (
  <p>{translations.noSessionsYet}</p>
) : (
  <div className={styles.tagStatsList}>...</div>
)}
```

This is a **ternary operator** used for conditional rendering:
- If no sessions exist → show "No completed sessions yet" message
- If sessions exist → show the tag cards list

### The `.map()` for rendering cards (lines 57-79)

```tsx
{sortedStats.map(({ tag, count, totalSeconds }) => (
  <div key={tag} className={styles.tagStatCard}>
    ...
  </div>
))}
```

- **Destructuring** `({ tag, count, totalSeconds })` — pulls values directly from each object
- **`key={tag}`** — React requires a unique `key` for each item in a list. Tag names are unique.

### Dynamic inline style for progress bar (lines 69-72)

```tsx
<div
  className={styles.progressFill}
  style={{ width: `${(count / totalSessions) * 100}%` }}
/>
```

This calculates the width **dynamically** based on the percentage.
If "Study" has 3 out of 5 total sessions → width = `60%`.

This is an **inline style** because the value changes per card. CSS classes can't
handle dynamic values like this — you'd need CSS custom properties or inline styles.

### Percentage calculation (line 76)

```tsx
{((count / totalSessions) * 100).toFixed(1)}%
```

- `count / totalSessions` → 0.6 (decimal)
- `* 100` → 60 (percentage)
- `.toFixed(1)` → "60.0" (always 1 decimal place, returns a string)

---

## Interview questions you should be able to answer:

1. **Why use `.reduce()` instead of a `for` loop?**
   → Functional programming style. `.reduce()` is declarative (says WHAT, not HOW),
   immutable (creates new object), and chainable. Industry standard in React.

2. **Why convert the object to an array before rendering?**
   → JSX `.map()` works on arrays, not objects. `Object.entries()` is the bridge.

3. **What happens if two sessions have the same timestamp as `key`?**
   → React will warn about duplicate keys. In practice, timestamps from `Date.now()`
   are millisecond-precise, so duplicates are extremely unlikely. But for production,
   a UUID would be safer.

4. **How would this scale to 10,000 sessions?**
   → The `.reduce()` runs on every render. With 10,000 sessions, you'd want to
   memoize it with `useMemo()` so it only recalculates when `sessions` changes.
   The current code is fine for hundreds of sessions.
