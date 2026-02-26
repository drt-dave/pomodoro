# TypeScript Type Definitions - Complete Explanation

## Overview
This file defines all TypeScript types and interfaces for the Pomodoro application. It serves as a "contract" ensuring type safety across the entire codebase.

## Learning Concepts
- **Type vs Interface**: When to use each
- **Union Types**: Restricting to specific values
- **Interface Properties**: Defining object shapes
- **Type Export**: Making types reusable
- **Type Safety**: Catching errors at compile-time

## The Complete Code

```typescript
export type PomodoroMode = 'work' | 'break';

export interface PomodoroState {
  tag: string;
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  defaultWorkTime: number;
  defaultBreakTime: number;
}

export interface PomodoroSession {
  tag: string;
  duration: number;
  timestamp: number;
  completed: boolean;
}
```

## Type Definitions

### PomodoroMode Type

```typescript
export type PomodoroMode = 'work' | 'break';
```

#### Type vs Interface

**Why `type` instead of `interface`?**

```typescript
// ✅ Type - For union types
type PomodoroMode = 'work' | 'break';

// ❌ Interface - Can't do union types
interface PomodoroMode = 'work' | 'break';  // Syntax error!
```

**General rule:**
- `type` - For primitives, unions, intersections
- `interface` - For object shapes

#### Union Type

```typescript
'work' | 'break'
   ↑       ↑
   |       └─ Or this value
   └───────── This value
```

**String literal union:**
- Only these exact strings are valid
- Not any random string

**Example usage:**
```typescript
const mode: PomodoroMode = 'work';    // ✅ OK
const mode: PomodoroMode = 'break';   // ✅ OK
const mode: PomodoroMode = 'pause';   // ❌ TypeScript error!
const mode: PomodoroMode = 'WORK';    // ❌ TypeScript error! (case-sensitive)
```

**Benefits:**
- Autocomplete shows valid options
- Catches typos at compile-time
- Self-documenting (only two modes possible)

**Could be extended:**
```typescript
export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';
```

#### Export Keyword

```typescript
export type PomodoroMode = ...
↑↑↑↑↑↑
Makes this available to other files
```

**Allows:**
```typescript
// In another file
import type { PomodoroMode } from './types/pomodoro.types';

const currentMode: PomodoroMode = 'work';
```

**`import type` vs regular `import`:**
```typescript
// Type-only import (removed at runtime)
import type { PomodoroMode } from './types';

// Regular import (exists at runtime)
import { PomodoroMode } from './types';  // Would fail - types don't exist at runtime
```

### PomodoroState Interface

```typescript
export interface PomodoroState {
  tag: string;
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  defaultWorkTime: number;
  defaultBreakTime: number;
}
```

#### Why Interface Here?

**Defining object shape:**
```typescript
interface PomodoroState {  // ✅ Good for objects
  tag: string;
  mode: PomodoroMode;
  // ...
}
```

**Interfaces are:**
- Clear for object structures
- Extendable
- Can be implemented by classes

#### Property Types

**1. Basic types (string, number, boolean):**
```typescript
tag: string;              // Any string
timeLeft: number;         // Any number
isRunning: boolean;       // true or false
```

**2. Custom type:**
```typescript
mode: PomodoroMode;       // Only 'work' or 'break'
```

Notice: Uses our previously defined type!

#### Complete Type Example

```typescript
const state: PomodoroState = {
  tag: 'Study Math',
  mode: 'work',
  timeLeft: 1500,
  isRunning: true,
  defaultWorkTime: 1500,
  defaultBreakTime: 300
};
```

**Type checking in action:**
```typescript
// ❌ All of these would cause TypeScript errors:

const state: PomodoroState = {
  tag: 123,  // ❌ Error: Type 'number' is not assignable to type 'string'
  mode: 'pause',  // ❌ Error: Type '"pause"' is not assignable to type 'PomodoroMode'
  timeLeft: '1500',  // ❌ Error: Type 'string' is not assignable to type 'number'
  isRunning: 'yes',  // ❌ Error: Type 'string' is not assignable to type 'boolean'
  // ❌ Error: Property 'defaultWorkTime' is missing
  // ❌ Error: Property 'defaultBreakTime' is missing
};
```

#### When PomodoroState is Used

**In Context:**
```typescript
// PomodoroContext extends this interface
interface PomodoroContextType extends PomodoroState {
  setTag: (tag: string) => void;
  setMode: (mode: PomodoroMode) => void;
  // ... other methods
}
```

**Benefits of extension:**
- Inherit all PomodoroState properties
- Add additional methods
- Don't repeat property definitions

### PomodoroSession Interface

```typescript
export interface PomodoroSession {
  tag: string;
  duration: number;
  timestamp: number;
  completed: boolean;
}
```

#### Purpose

Represents a single completed/saved pomodoro session.

#### Property Details

**tag (string):**
- What task was worked on
- Examples: "Study", "Code Review", "Writing"

**duration (number):**
- How long the session lasted (in seconds)
- Examples: `1500` (25 minutes), `600` (10 minutes for partial)

**timestamp (number):**
- When the session occurred (Unix timestamp)
- From `Date.now()` (milliseconds since Jan 1, 1970)
- Example: `1703427600000`

**completed (boolean):**
- `true`: Session finished (naturally or manually)
- `false`: Session abandoned/cancelled

#### Example Session Objects

**Full work session:**
```typescript
{
  tag: "Deep Work",
  duration: 1500,           // 25 minutes
  timestamp: 1703427600000, // Dec 24, 2024
  completed: true
}
```

**Partial session (finished early):**
```typescript
{
  tag: "Quick Task",
  duration: 600,            // 10 minutes
  timestamp: 1703429400000, // 30 min later
  completed: true
}
```

**Array of sessions:**
```typescript
const sessions: PomodoroSession[] = [
  { tag: "Study", duration: 1500, timestamp: 1703427600000, completed: true },
  { tag: "Code", duration: 1500, timestamp: 1703429400000, completed: true },
  { tag: "Review", duration: 900, timestamp: 1703431200000, completed: true }
];
```

## Benefits of Type Definitions

### 1. Autocomplete

**IDE knows all properties:**
```typescript
const session: PomodoroSession = {
  ta|  // IDE suggests: tag
  // After typing 't' + 'a', autocomplete shows all properties starting with 'ta'
}
```

### 2. Catch Errors Early

**Compile-time errors:**
```typescript
const session: PomodoroSession = {
  tag: "Study",
  duration: "25 minutes",  // ❌ TypeScript error immediately
  // Caught before running code!
};
```

**Runtime errors (without TypeScript):**
```javascript
const session = {
  tag: "Study",
  duration: "25 minutes"  // ✓ No error
};

// Later in code:
const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
// ❌ Runtime error: can't add string to number
// Bug only discovered when code runs
```

### 3. Self-Documenting Code

**Type tells you what data looks like:**
```typescript
// Without types:
function saveSession(data) { ... }
// What is 'data'? What properties does it have?

// With types:
function saveSession(session: PomodoroSession) { ... }
// Clear: Must be PomodoroSession with tag, duration, timestamp, completed
```

### 4. Refactoring Safety

**Change propagation:**
```typescript
// Add new property:
export interface PomodoroSession {
  tag: string;
  duration: number;
  timestamp: number;
  completed: boolean;
  userId: string;  // ← New property
}

// TypeScript shows errors everywhere sessions are created without userId
// Easy to find all places that need updating
```

## Type vs Interface Comparison

### When to Use `type`

```typescript
// ✅ Union types
type Status = 'idle' | 'loading' | 'success' | 'error';

// ✅ Intersection types
type NamedPoint = Point & { name: string };

// ✅ Primitive aliases
type ID = string | number;

// ✅ Tuple types
type Coordinate = [number, number];

// ✅ Function types
type Callback = (value: string) => void;
```

### When to Use `interface`

```typescript
// ✅ Object shapes
interface User {
  id: string;
  name: string;
}

// ✅ Can be extended
interface Admin extends User {
  permissions: string[];
}

// ✅ Can be implemented
class UserImpl implements User {
  id: string;
  name: string;
}

// ✅ Declaration merging (advanced)
interface Window {
  myCustomProperty: string;
}
```

### In This File

```typescript
// Type for union
type PomodoroMode = 'work' | 'break';  // ✅

// Interface for objects
interface PomodoroState { ... }  // ✅
interface PomodoroSession { ... }  // ✅
```

## Common Patterns

### Optional Properties

```typescript
interface PomodoroSession {
  tag: string;
  duration: number;
  timestamp: number;
  completed: boolean;
  notes?: string;  // ← Optional (might not exist)
}

// Both valid:
const session1: PomodoroSession = {
  tag: "Study",
  duration: 1500,
  timestamp: Date.now(),
  completed: true
  // notes omitted
};

const session2: PomodoroSession = {
  tag: "Study",
  duration: 1500,
  timestamp: Date.now(),
  completed: true,
  notes: "Very productive!"  // included
};
```

### Readonly Properties

```typescript
interface PomodoroSession {
  readonly tag: string;  // Can't be changed after creation
  duration: number;
}

const session: PomodoroSession = { tag: "Study", duration: 1500 };
session.duration = 1200;  // ✅ OK
session.tag = "Code";     // ❌ Error: Cannot assign to 'tag' because it is a read-only property
```

### Extending Interfaces

```typescript
interface TimedActivity {
  duration: number;
  timestamp: number;
}

interface PomodoroSession extends TimedActivity {
  tag: string;
  completed: boolean;
}

// PomodoroSession now has: tag, completed, duration, timestamp
```

## How Types Flow Through the App

```
pomodoro.types.ts
    ↓
PomodoroContext uses PomodoroState, PomodoroSession
    ↓
Components import and use these types
    ↓
TypeScript checks all usage
    ↓
Compile errors if types don't match
```

**Example flow:**
```typescript
// 1. Type defined
export interface PomodoroSession { ... }

// 2. Used in Context
const [sessions, setSessions] = useState<PomodoroSession[]>([]);

// 3. Used in component
const Timer = () => {
  const { sessions } = usePomodoro();
  // sessions has type PomodoroSession[]
  // TypeScript knows all methods/properties available
};
```

## Best Practices

### ✅ Do's

1. **Export types** - Make them reusable
2. **Use descriptive names** - `PomodoroSession` not `Session`
3. **Group related types** - All pomodoro types in one file
4. **Use strict types** - `'work' | 'break'` not `string`

### ❌ Don'ts

1. **Don't use `any`** - Defeats purpose of TypeScript
2. **Don't repeat types** - Define once, import everywhere
3. **Don't make everything optional** - Be specific

## Summary

This small file provides:
- Type safety for the entire app
- Autocomplete in IDE
- Compile-time error catching
- Self-documenting code
- Refactoring confidence

Understanding types is essential because:
- They prevent bugs before runtime
- They make code easier to maintain
- They serve as documentation
- They enable better tooling

---

*Location: `/src/types/pomodoro.types.ts`*
*Related: PomodoroContext, Timer component, all components using these types*
