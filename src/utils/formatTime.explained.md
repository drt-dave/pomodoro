# formatTime Utility Functions - Complete Explanation

## Overview
This file provides utility functions to format time values (in seconds) into human-readable strings for display. It contains two functions: one for countdown display (MM:SS) and one for statistics display (5m 30s).

## Learning Concepts
- **Pure Functions**: No side effects, same input → same output
- **Math Operations**: floor, modulo for time calculations
- **String Methods**: padStart for zero-padding
- **Template Literals**: String interpolation
- **JSDoc Comments**: Function documentation
- **Utility Pattern**: Reusable helper functions

## The Complete Code

```typescript
/**
 * Converts seconds to MM:SS format for countdown display.
 * @param seconds - The number of seconds to format
 * @returns Formatted string in MM:SS format (e.g., "02:05")
 */
export const formatTimeMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Converts seconds to human-readable duration for statistics display.
 * @param seconds - The number of seconds to format
 * @returns Formatted string like "5m 30s" or "2m" or "45 seconds"
 */
export const formatTimeDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
};
```

## Function 1: formatTimeMMSS

### Purpose
Formats seconds into MM:SS format for timer countdown display.

### JSDoc Comment

```typescript
/**
 * Converts seconds to MM:SS format for countdown display.
 * @param seconds - The number of seconds to format
 * @returns Formatted string in MM:SS format (e.g., "02:05")
 */
```

**What is JSDoc?**
- Standard for documenting JavaScript/TypeScript
- Shows in IDE tooltips when hovering
- Helps other developers understand usage
- Can generate documentation websites

**Parts of JSDoc:**
- `@param` - Describes parameters
- `@returns` - Describes return value
- Examples in description help clarify usage

### Function Signature

```typescript
export const formatTimeMMSS = (seconds: number): string => {
```

**Breaking down the signature:**
```typescript
export                  // Make available to other files
const                   // Constant (won't be reassigned)
formatTimeMMSS          // Function name (descriptive)
= (seconds: number)     // Parameter: number of seconds
: string                // Return type: string
=> { ... }              // Arrow function body
```

**Why arrow function?**
```typescript
// Arrow function (what we use)
const formatTimeMMSS = (seconds: number): string => { ... };

// Regular function (alternative)
function formatTimeMMSS(seconds: number): string { ... }
```

Both work, but arrow functions are:
- More concise
- Common in modern JavaScript
- Lexically bind `this` (not relevant here)

### Calculate Minutes

```typescript
const mins = Math.floor(seconds / 60);
```

**Math.floor explained:**
```javascript
Math.floor(125 / 60)  // 125 ÷ 60 = 2.0833...
                      // floor = 2 (rounds down)

Math.floor(59 / 60)   // 59 ÷ 60 = 0.9833...
                      // floor = 0

Math.floor(1500 / 60) // 1500 ÷ 60 = 25
                      // floor = 25
```

**Why floor instead of round?**
- `floor`: Always rounds down
- `round`: Rounds to nearest (would show wrong minute)
- `ceil`: Rounds up (would show minute not reached yet)

**Example why floor matters:**
```javascript
// 125 seconds = 2 minutes and 5 seconds
Math.floor(125 / 60)  // 2 ✓ (correct)
Math.round(125 / 60)  // 2 ✓ (happens to be correct)
Math.ceil(125 / 60)   // 3 ✗ (wrong - shows 3 minutes)

// 119 seconds = 1 minute and 59 seconds
Math.floor(119 / 60)  // 1 ✓ (correct)
Math.round(119 / 60)  // 2 ✗ (wrong - shows 2 minutes)
Math.ceil(119 / 60)   // 2 ✗ (wrong)
```

### Calculate Remaining Seconds

```typescript
const secs = seconds % 60;
```

**Modulo operator (%):**
- Returns remainder after division
- Key for extracting "leftover" seconds

**How modulo works:**
```javascript
125 % 60  // 125 ÷ 60 = 2 remainder 5 → Result: 5
59 % 60   // 59 ÷ 60 = 0 remainder 59 → Result: 59
60 % 60   // 60 ÷ 60 = 1 remainder 0 → Result: 0
1500 % 60 // 1500 ÷ 60 = 25 remainder 0 → Result: 0
```

**Visual example:**
```
125 seconds = how many 60s fit + remainder?
125 = (60 × 2) + 5
      ↑↑↑↑↑↑   ↑
      2 mins   5 secs (remainder)
```

### Format with Zero-Padding

```typescript
return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
```

**Breaking down the template literal:**
```typescript
`${value1}:${value2}`
  ↑↑↑↑↑↑↑   ↑↑↑↑↑↑↑
  Part 1    Part 2
```

**Part 1 - Format minutes:**
```typescript
mins.toString().padStart(2, '0')
↓           ↓           ↓
|           |           └─ Pad to length 2 with '0'
|           └───────────── Convert number to string
└───────────────────────── Minutes value
```

**padStart explained:**
```javascript
'5'.padStart(2, '0')   → '05'
'15'.padStart(2, '0')  → '15' (already 2 chars, no padding)
'2'.padStart(2, '0')   → '02'
'0'.padStart(2, '0')   → '00'

// padStart(targetLength, padString)
//           ↓            ↓
//           2 chars      use '0' to pad
```

**Why zero-padding?**
```javascript
// Without padding:
`2:5`   // ❌ Looks inconsistent

// With padding:
`02:05` // ✅ Standard timer format
```

### Complete Examples

**Example 1: 125 seconds**
```javascript
seconds = 125

mins = Math.floor(125 / 60) = 2
secs = 125 % 60 = 5

mins.toString() = '2'
'2'.padStart(2, '0') = '02'

secs.toString() = '5'
'5'.padStart(2, '0') = '05'

Result: '02:05'
```

**Example 2: 1500 seconds (25 minutes)**
```javascript
seconds = 1500

mins = Math.floor(1500 / 60) = 25
secs = 1500 % 60 = 0

Result: '25:00'
```

**Example 3: 59 seconds**
```javascript
seconds = 59

mins = Math.floor(59 / 60) = 0
secs = 59 % 60 = 59

Result: '00:59'
```

### Usage in Components

```typescript
import { formatTimeMMSS } from '../utils/formatTime';

// In Timer component:
<div className={styles.timeDisplay}>
  {formatTimeMMSS(timeLeft)}
</div>

// If timeLeft = 125, displays: "02:05"
// If timeLeft = 1500, displays: "25:00"
```

## Function 2: formatTimeDuration

### Purpose
Formats seconds into human-readable duration for statistics (e.g., "5m 30s", "2m", "45 seconds").

### Function Flow

```typescript
export const formatTimeDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
};
```

### Case 1: Less Than 1 Minute

```typescript
if (seconds < 60) {
  return `${Math.round(seconds)} seconds`;
}
```

**Example:**
```javascript
formatTimeDuration(45)   → "45 seconds"
formatTimeDuration(30)   → "30 seconds"
formatTimeDuration(5.7)  → "6 seconds" (rounded)
```

**Why Math.round here?**
- In statistics, might have fractional seconds
- Round to nearest whole number for display
- More readable than "5.7 seconds"

### Case 2: Exact Minutes (No Seconds)

```typescript
const minutes = Math.floor(seconds / 60);
const remainingSeconds = Math.round(seconds % 60);

if (remainingSeconds === 0) {
  return `${minutes}m`;
}
```

**Example:**
```javascript
formatTimeDuration(120)  → "2m"  (not "2m 0s")
formatTimeDuration(300)  → "5m"
formatTimeDuration(1500) → "25m"
```

**Why hide "0s"?**
- Cleaner display
- "2m" is more concise than "2m 0s"
- Standard convention

### Case 3: Minutes and Seconds

```typescript
return `${minutes}m ${remainingSeconds}s`;
```

**Example:**
```javascript
formatTimeDuration(125)  → "2m 5s"
formatTimeDuration(90)   → "1m 30s"
formatTimeDuration(1530) → "25m 30s"
```

### Complete Examples

**Example 1: 45 seconds**
```javascript
seconds = 45
45 < 60 → true

Result: "45 seconds"
```

**Example 2: 120 seconds**
```javascript
seconds = 120
120 < 60 → false

minutes = Math.floor(120 / 60) = 2
remainingSeconds = Math.round(120 % 60) = 0

0 === 0 → true

Result: "2m"
```

**Example 3: 125 seconds**
```javascript
seconds = 125
125 < 60 → false

minutes = Math.floor(125 / 60) = 2
remainingSeconds = Math.round(125 % 60) = 5

5 === 0 → false

Result: "2m 5s"
```

### Usage in Components

```typescript
import { formatTimeDuration } from '../utils/formatTime';

// In TagStats component:
<p>Total time: {formatTimeDuration(totalSeconds)}</p>

// If totalSeconds = 1530, displays: "Total time: 25m 30s"
```

## Key Concepts

### 1. Pure Functions

Both functions are **pure**:
```typescript
// Same input → Same output (always)
formatTimeMMSS(125)  // Always returns "02:05"
formatTimeMMSS(125)  // Still "02:05"
formatTimeMMSS(125)  // Still "02:05"

// No side effects:
// - Doesn't modify arguments
// - Doesn't change external state
// - Doesn't make API calls
// - Just transforms input to output
```

**Benefits:**
- Easy to test
- Easy to reason about
- Can be cached/memoized
- No unexpected behavior

### 2. String Manipulation

**Three methods used:**

1. **toString()** - Convert number to string
   ```javascript
   5.toString()  → '5'
   ```

2. **padStart()** - Add padding to start
   ```javascript
   '5'.padStart(2, '0')  → '05'
   ```

3. **Template literals** - String interpolation
   ```javascript
   `${mins}:${secs}`  → '02:05'
   ```

### 3. Math Operations

**Two methods used:**

1. **Math.floor()** - Round down
   ```javascript
   Math.floor(2.9)  → 2
   ```

2. **Math.round()** - Round to nearest
   ```javascript
   Math.round(2.4)  → 2
   Math.round(2.5)  → 3
   ```

**Modulo operator (%):**
```javascript
125 % 60  → 5
```

## Common Mistakes to Avoid

❌ **Using Math.round for minutes:**
```javascript
Math.round(119 / 60)  // 2 (wrong - shows minute not reached)
```

❌ **Forgetting zero-padding:**
```javascript
`${mins}:${secs}`  // "2:5" (inconsistent)
```

❌ **Not handling edge cases:**
```javascript
// What if seconds is negative?
// What if seconds is 0?
// What if seconds is fractional?
```

## Potential Improvements

### 1. Handle Edge Cases

```typescript
export const formatTimeMMSS = (seconds: number): string => {
  // Handle negative or invalid input
  if (seconds < 0 || !Number.isFinite(seconds)) {
    return '00:00';
  }

  // Round to handle fractional seconds
  seconds = Math.floor(seconds);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
```

### 2. Support Hours

```typescript
export const formatTimeHHMMSS = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
```

### 3. Internationalization

```typescript
export const formatTimeDuration = (seconds: number, locale: string = 'en'): string => {
  const translations = {
    en: { seconds: 'seconds', m: 'm', s: 's' },
    es: { seconds: 'segundos', m: 'm', s: 's' },
    // ... more languages
  };

  // Use translations[locale]
};
```

## Testing Examples

```typescript
// Test formatTimeMMSS
console.assert(formatTimeMMSS(0) === '00:00');
console.assert(formatTimeMMSS(59) === '00:59');
console.assert(formatTimeMMSS(60) === '01:00');
console.assert(formatTimeMMSS(125) === '02:05');
console.assert(formatTimeMMSS(1500) === '25:00');

// Test formatTimeDuration
console.assert(formatTimeDuration(45) === '45 seconds');
console.assert(formatTimeDuration(60) === '1m');
console.assert(formatTimeDuration(120) === '2m');
console.assert(formatTimeDuration(125) === '2m 5s');
console.assert(formatTimeDuration(1530) === '25m 30s');
```

## Summary

These utility functions demonstrate:
- Pure function pattern
- Math operations for time conversion
- String manipulation techniques
- JSDoc documentation
- Type safety with TypeScript

They are essential because:
- Used throughout the application
- Provide consistent time formatting
- Make code DRY (Don't Repeat Yourself)
- Easy to test and maintain

---

*Location: `/src/utils/formatTime.ts`*
*Used by: Timer component, TagStats component*
