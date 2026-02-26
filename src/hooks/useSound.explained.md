# useSound - Audio Playback Custom Hook - Complete Explanation

## Overview
This file implements a custom React hook for playing sound effects when timer sessions complete. It demonstrates how to create a reusable hook that integrates with Context, handles browser audio, and uses memoization for performance. This is a concise example of a focused, single-purpose custom hook.

## Learning Concepts
- **Custom Hooks**: Creating reusable stateful logic
- **Browser Audio API**: Playing sounds with `new Audio()`
- **Vite Asset Imports**: Importing MP3 files as URLs
- **useCallback Memoization**: Preventing unnecessary re-renders
- **Error Handling**: Graceful handling of autoplay restrictions
- **Context Composition**: Using one context inside a hook

## The Complete Code

```typescript
import { useCallback } from 'react';
import {useSettings} from '../contexts/SettingsContext';

import workCompleteSound from '../assets/sounds/work-complete.mp3';
import breakCompleteSound from '../assets/sounds/break-complete.mp3';

export function useSound() {
  const { soundEnabled } = useSettings();

  const playWorkComplete = useCallback(() => {
    if (soundEnabled) {
      new Audio(workCompleteSound).play().catch(() => {});
    }
  },[soundEnabled]);

  const playBreakComplete = useCallback(() => {
    if (soundEnabled) {
      new Audio(breakCompleteSound).play().catch(() => {});
    }
  },[soundEnabled]);

  return { playWorkComplete, playBreakComplete };
}
```

## Import Statements

### React Hook Import

```typescript
import { useCallback } from 'react';
```

**useCallback:**
- Memoizes functions
- Returns same function reference between renders
- Prevents unnecessary child re-renders
- Updates only when dependencies change

### Context Import

```typescript
import {useSettings} from '../contexts/SettingsContext';
```

**Hook composition:**
- Custom hooks can use other hooks
- useSound uses useSettings
- Gets `soundEnabled` value

### Asset Imports (Vite)

```typescript
import workCompleteSound from '../assets/sounds/work-complete.mp3';
import breakCompleteSound from '../assets/sounds/break-complete.mp3';
```

**How Vite handles this:**
```typescript
// What you write:
import workCompleteSound from '../assets/sounds/work-complete.mp3';

// What workCompleteSound becomes at runtime:
'/assets/work-complete-abc123.mp3'  // Hashed URL
```

**Vite's asset handling:**
1. Copies MP3 to `dist/assets/`
2. Adds content hash to filename
3. Returns public URL as string
4. Enables cache busting

**Alternative (without import):**
```typescript
// ❌ Doesn't work reliably with bundlers
new Audio('/sounds/work-complete.mp3')

// ✅ Vite handles path resolution
new Audio(workCompleteSound)
```

## Hook Implementation

### Getting Settings

```typescript
const { soundEnabled } = useSettings();
```

**Destructuring:**
```typescript
const { soundEnabled } = useSettings();
//      ↑↑↑↑↑↑↑↑↑↑↑↑
//      Only extract what we need
```

**soundEnabled is:**
- `true`: User wants sounds
- `false`: User disabled sounds

### Play Functions with useCallback

```typescript
const playWorkComplete = useCallback(() => {
  if (soundEnabled) {
    new Audio(workCompleteSound).play().catch(() => {});
  }
},[soundEnabled]);
```

**Breaking it down:**

#### 1. useCallback Wrapper

```typescript
useCallback(() => {
  // function body
}, [soundEnabled]);
```

**Why useCallback?**
```typescript
// Without useCallback:
const playWorkComplete = () => { ... };
// New function created EVERY render!
// Components using this re-render unnecessarily

// With useCallback:
const playWorkComplete = useCallback(() => { ... }, [soundEnabled]);
// Same function reference unless soundEnabled changes
// Optimizes components that receive this function
```

#### 2. Guard Check

```typescript
if (soundEnabled) {
  // Only play if sounds are enabled
}
```

**Why check inside function?**
- Setting can change while app runs
- User toggles sound on/off
- Function respects current setting

#### 3. Audio Creation and Playback

```typescript
new Audio(workCompleteSound).play()
```

**Audio API:**
```typescript
new Audio(url)      // Create Audio element
  .play()           // Start playback, returns Promise
```

**Why create new Audio each time?**
```typescript
// ✅ Create new (simple, works)
new Audio(url).play();

// Alternative: reuse Audio object
const audio = new Audio(url);
audio.currentTime = 0;  // Reset to start
audio.play();
```

Creating new Audio is simpler and works well for short sound effects.

#### 4. Error Handling

```typescript
.play().catch(() => {});
```

**Why catch errors?**

Browser autoplay policies can block audio:
```
- User hasn't interacted with page yet
- Browser settings block autoplay
- Mobile browsers are restrictive
```

**Without catch:**
```javascript
new Audio(url).play();
// Uncaught (in promise) DOMException:
// play() failed because the user didn't interact with the document first.
```

**With catch:**
```javascript
new Audio(url).play().catch(() => {});
// Error silently ignored
// No console error
// App continues working
```

**Empty catch `() => {}`:**
- Acknowledges error might occur
- Intentionally does nothing
- Sound not playing isn't critical

### Return Value

```typescript
return { playWorkComplete, playBreakComplete };
```

**Object return pattern:**
```typescript
// Return object for named access:
return { playWorkComplete, playBreakComplete };

// Usage:
const { playWorkComplete } = useSound();

// Alternative: array return (less clear):
return [playWorkComplete, playBreakComplete];

// Usage (position matters):
const [play1, play2] = useSound();
```

## Usage Example

```typescript
import { useSound } from '../hooks/useSound';

function Timer() {
  const { playWorkComplete, playBreakComplete } = useSound();

  useEffect(() => {
    if (timeLeft === 0) {
      if (mode === 'work') {
        playWorkComplete();
      } else {
        playBreakComplete();
      }
    }
  }, [timeLeft, mode, playWorkComplete, playBreakComplete]);
}
```

## Flow Diagram

### Sound Playback Flow

```
1. Timer reaches 0
   ↓
2. useEffect triggers
   ↓
3. playWorkComplete() called
   ↓
4. Check: soundEnabled?
   ↓
   YES → Create new Audio(url)
         ↓
         audio.play()
         ↓
         Promise resolves → Sound plays!
         OR
         Promise rejects → .catch(() => {}) handles silently

   NO → Function returns immediately (no sound)
```

### Hook Initialization Flow

```
1. Component using useSound renders
   ↓
2. useSound() hook called
   ↓
3. useSettings() called inside
   ↓
4. { soundEnabled: true } extracted
   ↓
5. useCallback creates memoized functions
   ↓
6. { playWorkComplete, playBreakComplete } returned
```

## Why useCallback Matters

### Without useCallback

```typescript
function useSound() {
  const { soundEnabled } = useSettings();

  // New function every render!
  const playWorkComplete = () => {
    if (soundEnabled) {
      new Audio(workCompleteSound).play().catch(() => {});
    }
  };

  return { playWorkComplete };
}

// In Timer component:
useEffect(() => {
  // ...
}, [playWorkComplete]);
// Effect runs EVERY render because playWorkComplete changes!
```

### With useCallback

```typescript
const playWorkComplete = useCallback(() => {
  if (soundEnabled) {
    new Audio(workCompleteSound).play().catch(() => {});
  }
}, [soundEnabled]);

// In Timer component:
useEffect(() => {
  // ...
}, [playWorkComplete]);
// Effect only runs when soundEnabled changes!
```

### Dependency Array

```typescript
useCallback(() => { ... }, [soundEnabled]);
                           ↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                           Dependencies
```

**soundEnabled in dependencies because:**
- Function uses `soundEnabled` value
- If value changes, function needs to update
- Stale closure prevention

## Browser Audio API Deep Dive

### Creating Audio

```typescript
const audio = new Audio(url);
```

**Audio properties:**
```typescript
audio.src           // URL of audio file
audio.currentTime   // Current position (seconds)
audio.duration      // Total length (seconds)
audio.volume        // 0.0 to 1.0
audio.muted         // boolean
audio.paused        // boolean
audio.ended         // boolean
```

### Playing Audio

```typescript
audio.play();  // Returns Promise
```

**Promise-based API:**
```typescript
audio.play()
  .then(() => console.log('Playing'))
  .catch(err => console.log('Failed:', err));
```

### Common Audio Issues

**1. Autoplay blocked:**
```
Most browsers require user interaction before audio
Solution: Sound plays after user clicks button (Timer start)
```

**2. File not found:**
```
Using Vite import solves this
URL is guaranteed correct at build time
```

**3. Memory leaks:**
```
Creating new Audio() each time is fine for short sounds
For longer audio, you'd reuse the Audio object
```

## Custom Hook Best Practices

### 1. Single Responsibility

```typescript
// ✅ Good: One purpose
function useSound() { /* sound logic only */ }

// ❌ Bad: Too many responsibilities
function useTimerSoundAndNotifications() { /* mixed concerns */ }
```

### 2. Clear Return Type

```typescript
// ✅ Clear what you get back
return { playWorkComplete, playBreakComplete };

// The return type is inferred:
// { playWorkComplete: () => void, playBreakComplete: () => void }
```

### 3. Compose with Other Hooks

```typescript
// useSound uses useSettings
// useSettings uses useContext
// Chain of hooks!
```

### 4. Memoize Functions

```typescript
// Functions returned from hooks should be stable
// Use useCallback for functions
// Use useMemo for computed values
```

## Comparison: Hook vs Component

### Hook Approach (Current)

```typescript
// Logic in hook
function useSound() {
  const { soundEnabled } = useSettings();
  const play = useCallback(() => {
    if (soundEnabled) new Audio(url).play().catch(() => {});
  }, [soundEnabled]);
  return { play };
}

// Component just uses it
function Timer() {
  const { play } = useSound();
  // ...
}
```

### Component Approach (Alternative)

```typescript
// Sound component handles everything
function SoundPlayer({ trigger, soundType }) {
  const { soundEnabled } = useSettings();
  useEffect(() => {
    if (trigger && soundEnabled) {
      new Audio(sounds[soundType]).play().catch(() => {});
    }
  }, [trigger]);
  return null;  // Renders nothing
}

// Timer uses it
function Timer() {
  return (
    <>
      <SoundPlayer trigger={timeLeft === 0} soundType={mode} />
      {/* rest of timer */}
    </>
  );
}
```

**Hook is better here because:**
- No extra component in tree
- More flexible (call anytime)
- Clearer dependency flow

## Potential Improvements

### 1. Volume Control

```typescript
export function useSound() {
  const { soundEnabled, volume } = useSettings();

  const playWorkComplete = useCallback(() => {
    if (soundEnabled) {
      const audio = new Audio(workCompleteSound);
      audio.volume = volume;  // 0.0 to 1.0
      audio.play().catch(() => {});
    }
  }, [soundEnabled, volume]);

  return { playWorkComplete };
}
```

### 2. Preloading

```typescript
// Preload audio for instant playback
const workAudio = new Audio(workCompleteSound);
const breakAudio = new Audio(breakCompleteSound);

export function useSound() {
  const { soundEnabled } = useSettings();

  const playWorkComplete = useCallback(() => {
    if (soundEnabled) {
      workAudio.currentTime = 0;
      workAudio.play().catch(() => {});
    }
  }, [soundEnabled]);

  return { playWorkComplete };
}
```

### 3. Multiple Sound Options

```typescript
interface SoundOptions {
  work: string;
  break: string;
}

const soundPacks: Record<string, SoundOptions> = {
  default: { work: defaultWork, break: defaultBreak },
  gentle: { work: gentleWork, break: gentleBreak },
  loud: { work: loudWork, break: loudBreak },
};
```

## Summary

useSound demonstrates:
- Focused custom hook pattern
- Browser Audio API usage
- Vite asset imports
- useCallback for memoization
- Graceful error handling
- Context composition (uses useSettings)

Key insights:
- Custom hooks can use other hooks
- Vite handles asset imports automatically
- `.catch(() => {})` is valid for non-critical errors
- useCallback prevents unnecessary effect runs
- Object return allows named destructuring

---

*Location: `/src/hooks/useSound.ts`*
*Related files: `src/contexts/SettingsContext.tsx`, `src/assets/sounds/`*
*Related concepts: Custom Hooks, Audio API, useCallback, Asset Imports*
