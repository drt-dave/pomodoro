# notifications.ts - Browser Notifications Utility - Complete Explanation

## Overview
This file provides utility functions for working with the Browser Notifications API. It handles permission requests, capability detection, and sending notifications. This is a clean example of wrapping a browser API in reusable functions with proper error handling.

## Learning Concepts
- **Browser Notifications API**: Native OS-level notifications
- **Permission Model**: Requesting and checking permissions
- **Feature Detection**: Checking if API is available
- **Pure Functions**: Stateless utility functions
- **TypeScript Return Types**: Explicit function signatures
- **Async/Await**: Handling asynchronous permission requests

## The Complete Code

```typescript
// Browser Notification Utility
// Handles permission requests and sending notifications

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  if (Notification.permission === 'denied') {
    return 'denied';
  }

  return await Notification.requestPermission();
}

export function sendNotification(
  title: string,
  body?: string
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  const notification = new Notification(title, {
    body,
    icon: '/tomato-192x192.png',
    tag: 'pomodoro-notification',
  });

  setTimeout(()=> notification.close(), 5000);
  return notification;
}
```

## Browser Notifications API Overview

### What Are Browser Notifications?

```
┌─────────────────────────────────────┐
│ 🍅 PomoDoroto                       │
│ Time for a break!                   │
│                          5 sec ago  │
└─────────────────────────────────────┘
```

**Features:**
- Appear outside browser window
- Show when tab is in background
- Native OS styling
- Click to focus app

### Permission States

```typescript
type NotificationPermission = 'default' | 'granted' | 'denied';
```

| State | Meaning | Can Send? | Can Ask Again? |
|-------|---------|-----------|----------------|
| `'default'` | Never asked | No | Yes |
| `'granted'` | User allowed | Yes | N/A |
| `'denied'` | User blocked | No | No |

## Function: isNotificationSupported

```typescript
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}
```

### Feature Detection Pattern

```typescript
'Notification' in window
```

**Checks if `Notification` exists on `window` object:**
- `true`: Browser supports notifications
- `false`: No support (old browser, Node.js, etc.)

**Why check?**
```typescript
// Without check (crashes in unsupported environments):
Notification.permission  // ReferenceError: Notification is not defined

// With check (safe):
if (isNotificationSupported()) {
  Notification.permission  // Safe to access
}
```

**Browsers that support:**
- Chrome 22+
- Firefox 22+
- Safari 7+
- Edge 14+

**Not supported:**
- Internet Explorer
- Node.js
- Some mobile browsers

## Function: getNotificationPermission

```typescript
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}
```

### Safe Permission Check

```typescript
if (!isNotificationSupported()) {
  return 'denied';
}
```

**Defensive programming:**
- If API not available, act as if denied
- Prevents crashes
- Caller doesn't need to check support

### Accessing Permission

```typescript
return Notification.permission;
```

**`Notification.permission` values:**
```typescript
Notification.permission  // 'default' | 'granted' | 'denied'
```

**Synchronous property:**
- No need to await
- Reflects current state
- Updated after permission request

## Function: requestNotificationPermission

```typescript
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  if (Notification.permission === 'denied') {
    return 'denied';
  }

  return await Notification.requestPermission();
}
```

### Async Function

```typescript
async function requestNotificationPermission(): Promise<NotificationPermission>
                                                ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                                                Returns Promise of permission
```

**Why async?**
- `Notification.requestPermission()` returns Promise
- Browser shows permission dialog
- User interaction required
- Result arrives after user responds

### Early Returns

```typescript
if (!isNotificationSupported()) {
  return 'denied';  // Can't use feature
}

if (Notification.permission === 'granted') {
  return 'granted';  // Already have permission
}

if (Notification.permission === 'denied') {
  return 'denied';  // Can't ask again
}
```

**Why check before requesting?**

1. **No support:** Avoid error
2. **Already granted:** Don't prompt again (annoying)
3. **Already denied:** Browser won't show prompt anyway

### The Permission Request

```typescript
return await Notification.requestPermission();
```

**What happens:**
```
1. Function called
   ↓
2. requestPermission() executes
   ↓
3. Browser shows permission dialog:
   ┌──────────────────────────────────────┐
   │ localhost wants to                    │
   │ Show notifications                    │
   │                                       │
   │        [Block]  [Allow]              │
   └──────────────────────────────────────┘
   ↓
4. User clicks Allow or Block
   ↓
5. Promise resolves with 'granted' or 'denied'
   ↓
6. Function returns the result
```

### Usage Example

```typescript
const startTimer = async () => {
  // Request permission when user starts timer
  await requestNotificationPermission();
  // If granted, notifications will work when timer ends
  // If denied, nothing happens (graceful degradation)
};
```

## Function: sendNotification

```typescript
export function sendNotification(
  title: string,
  body?: string
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  const notification = new Notification(title, {
    body,
    icon: '/tomato-192x192.png',
    tag: 'pomodoro-notification',
  });

  setTimeout(()=> notification.close(), 5000);
  return notification;
}
```

### Function Signature

```typescript
sendNotification(
  title: string,        // Required: main text
  body?: string         // Optional: secondary text
): Notification | null  // Returns Notification or null if can't send
```

**Return type `Notification | null`:**
- Returns `Notification` object if sent
- Returns `null` if not sent (no permission, not supported)

### Guard Clause

```typescript
if (!isNotificationSupported() || Notification.permission !== 'granted') {
  return null;
}
```

**Two conditions to fail:**
1. API not supported
2. Permission not granted

**Short-circuit evaluation:**
```typescript
!isNotificationSupported() || Notification.permission !== 'granted'
↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑    ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
Checked first                  Only checked if first is false
```

### Creating Notification

```typescript
const notification = new Notification(title, {
  body,
  icon: '/tomato-192x192.png',
  tag: 'pomodoro-notification',
});
```

**Notification constructor:**
```typescript
new Notification(title, options?)
```

**Options object:**

| Property | Type | Description |
|----------|------|-------------|
| `body` | string | Secondary text line |
| `icon` | string | Image URL (shows in notification) |
| `tag` | string | Identifier for grouping/replacing |
| `silent` | boolean | Suppress sound |
| `data` | any | Custom data attached |
| `requireInteraction` | boolean | Stay until user acts |

### The `tag` Property

```typescript
tag: 'pomodoro-notification'
```

**What tag does:**
- Identifies notification type
- Replaces existing notification with same tag
- Prevents notification spam

**Without tag:**
```
[Notification 1]
[Notification 2]  // Stacks
[Notification 3]  // More stacking
```

**With tag:**
```
[pomodoro-notification]  // Only one at a time, gets replaced
```

### Auto-Close Timer

```typescript
setTimeout(()=> notification.close(), 5000);
```

**Why auto-close?**
- Clean up notification after 5 seconds
- Some OS keep notifications indefinitely
- Good UX - not cluttering notification center

**`notification.close()`:**
- Removes notification from screen
- Can be called anytime
- No error if already closed

### Return Value

```typescript
return notification;
```

**Returns the Notification object:**
- Allows caller to close early
- Access notification properties
- Add event listeners

**Usage:**
```typescript
const notif = sendNotification('Done!', 'Session complete');
if (notif) {
  notif.onclick = () => window.focus();  // Focus app on click
}
```

## Complete Usage Example

```typescript
// In Timer component

import {
  requestNotificationPermission,
  sendNotification
} from '../utils/notifications';

function Timer() {
  const { translations } = useLanguage();

  // Request permission when starting timer
  const handleStart = async () => {
    await requestNotificationPermission();
    startTimer();
  };

  // Send notification when timer ends
  useEffect(() => {
    if (timeLeft === 0) {
      if (mode === 'work') {
        sendNotification(
          translations.workCompleted,
          translations.notificationWorkBody
        );
      } else {
        sendNotification(
          translations.breakCompleted,
          translations.notificationBreakBody
        );
      }
    }
  }, [timeLeft, mode, translations]);
}
```

## Flow Diagrams

### Permission Request Flow

```
User clicks "Start Timer"
        ↓
requestNotificationPermission() called
        ↓
isNotificationSupported()? ──NO──→ return 'denied'
        ↓ YES
permission === 'granted'? ──YES──→ return 'granted'
        ↓ NO
permission === 'denied'? ──YES──→ return 'denied'
        ↓ NO (is 'default')
Notification.requestPermission()
        ↓
Browser shows permission dialog
        ↓
User clicks [Allow] ──→ return 'granted'
User clicks [Block] ──→ return 'denied'
```

### Send Notification Flow

```
Timer reaches 0
      ↓
sendNotification(title, body) called
      ↓
isNotificationSupported()? ──NO──→ return null
      ↓ YES
permission === 'granted'? ──NO──→ return null
      ↓ YES
new Notification(title, options)
      ↓
Notification appears on screen
      ↓
setTimeout starts (5 seconds)
      ↓
return notification object
      ↓
(5 seconds later)
      ↓
notification.close()
```

## Best Practices Demonstrated

### 1. Feature Detection

```typescript
// Always check before using browser APIs
if ('Notification' in window) { ... }
```

### 2. Graceful Degradation

```typescript
// Return sensible defaults when feature unavailable
return 'denied';  // Act as if permission denied
return null;      // Act as if notification not sent
```

### 3. Pure Functions

```typescript
// No side effects beyond their purpose
// No global state
// Same input → same output (mostly)
```

### 4. Early Returns

```typescript
// Guard clauses at top
if (!isNotificationSupported()) return null;
// Main logic follows
```

### 5. TypeScript Return Types

```typescript
function isNotificationSupported(): boolean
function getNotificationPermission(): NotificationPermission
function sendNotification(...): Notification | null
```

## Comparison: Notification Types

### Browser Notifications (This File)

```typescript
new Notification(title, options);
```
- **Shows:** In OS notification area
- **When visible:** Even when tab in background
- **Requires:** User permission
- **Styling:** OS native

### Toast Notifications (In-App)

```typescript
<Toast message={message} />
```
- **Shows:** Inside app UI
- **When visible:** Only when app visible
- **Requires:** No permission
- **Styling:** Custom CSS

### When to Use Which

| Scenario | Use |
|----------|-----|
| Timer ends, tab in background | Browser Notification |
| Quick feedback in app | Toast |
| Critical alerts | Both |
| Marketing/updates | Neither (annoying) |

## Potential Improvements

### 1. Click Handler

```typescript
export function sendNotification(
  title: string,
  body?: string,
  onClick?: () => void
): Notification | null {
  // ...
  const notification = new Notification(title, options);

  if (onClick) {
    notification.onclick = () => {
      onClick();
      window.focus();
    };
  }

  return notification;
}
```

### 2. Error Handling

```typescript
export function sendNotification(...): Notification | null {
  try {
    // ... notification code
  } catch (error) {
    console.warn('Failed to send notification:', error);
    return null;
  }
}
```

### 3. Action Buttons (Chrome)

```typescript
// Note: Limited browser support
const notification = new Notification(title, {
  body,
  actions: [
    { action: 'start', title: 'Start Break' },
    { action: 'skip', title: 'Skip' }
  ]
});
```

### 4. Service Worker Notifications

```typescript
// For more features and background support
navigator.serviceWorker.ready.then(registration => {
  registration.showNotification(title, options);
});
```

## Summary

notifications.ts demonstrates:
- Browser Notifications API wrapper
- Feature detection pattern
- Permission request handling
- Graceful degradation
- Pure utility functions
- TypeScript return types

Key insights:
- Always check for API support first
- Handle all permission states
- Return null/defaults when feature unavailable
- Use `tag` to prevent notification spam
- Auto-close for better UX

---

*Location: `/src/utils/notifications.ts`*
*Related concepts: Browser APIs, Permissions, Async/Await, Feature Detection*
