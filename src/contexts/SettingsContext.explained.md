# SettingsContext - Application Settings Management - Complete Explanation

## Overview
This file implements a complete settings management system with localStorage persistence. It provides configurable work/break durations, sound effect toggles, and a "clear all data" feature. It demonstrates a clean Context pattern with multiple setter functions and data clearing functionality.

## Learning Concepts
- **Settings Management**: Centralizing application configuration
- **Multiple Setters**: Providing individual update functions
- **Spread Operator**: Merging objects for partial updates
- **Data Clearing**: Resetting application state completely
- **Type Extension**: Using `extends` for interface composition
- **Lazy Initialization**: Loading from storage on mount

## The Complete Code

```typescript
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface Settings {
  workDuration: number; // in seconds
  breakDuration: number; // in seconds
  soundEnabled: boolean;
}

interface SettingsContextType extends Settings {
  setWorkDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  clearAllData: ()=> void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'pomodoro_settings';

const defaultSettings: Settings = {
  workDuration: 25 * 60, // 25 minutes
  breakDuration: 5 * 60, // 5 minutes
  soundEnabled: true,
};

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if ( stored ) {
      return {...defaultSettings, ...JSON.parse(stored)};
    }
  } catch (error) {
    console.error('Failed to load settings',error);
  }
  return defaultSettings;
}

function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({children}: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const setWorkDuration = (duration: number) => {
    setSettings(prev => ({...prev, workDuration: duration}));
  };

  const setBreakDuration = (duration: number) => {
    setSettings(prev => ({...prev, breakDuration: duration}));
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, soundEnabled: enabled }));
  };

  const clearAllData = () => {
    localStorage.removeItem('pomodoro_sessions');
    localStorage.removeItem('pomodoro_state');
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    setSettings(defaultSettings);
    window.location.reload();
  };

  return (
    <SettingsContext.Provider value={{
      ...settings,
      setWorkDuration,
      setBreakDuration,
      setSoundEnabled,
      clearAllData,
      }}>
      {children}
      </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
```

## Type Definitions

### Settings Interface

```typescript
interface Settings {
  workDuration: number; // in seconds
  breakDuration: number; // in seconds
  soundEnabled: boolean;
}
```

**Data-only interface:**
- Only contains state values
- No functions or methods
- Used for storage and internal state

**Why seconds for durations?**
- Consistent with timer logic
- Avoids conversion errors
- Standard for time calculations
- Comments clarify units

### SettingsContextType Interface

```typescript
interface SettingsContextType extends Settings {
  setWorkDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  clearAllData: ()=> void;
}
```

**Using `extends`:**
```typescript
interface SettingsContextType extends Settings
                              ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                              Inherits all Settings properties
```

**Equivalent to:**
```typescript
interface SettingsContextType {
  // From Settings
  workDuration: number;
  breakDuration: number;
  soundEnabled: boolean;
  // Additional
  setWorkDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  clearAllData: () => void;
}
```

**Benefits of `extends`:**
- DRY (Don't Repeat Yourself)
- Changes to Settings propagate automatically
- Clear separation: data vs. actions

## Default Settings

```typescript
const defaultSettings: Settings = {
  workDuration: 25 * 60, // 25 minutes
  breakDuration: 5 * 60, // 5 minutes
  soundEnabled: true,
};
```

**Why calculate with multiplication?**
```typescript
// More readable than:
workDuration: 1500,  // ??? seconds

// Clear intention:
workDuration: 25 * 60,  // 25 minutes in seconds
```

**Standard Pomodoro values:**
- 25 minutes work (Francesco Cirillo's original)
- 5 minutes short break
- Sound enabled by default

## Loading and Saving Functions

### loadSettings Function

```typescript
function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if ( stored ) {
      return {...defaultSettings, ...JSON.parse(stored)};
    }
  } catch (error) {
    console.error('Failed to load settings',error);
  }
  return defaultSettings;
}
```

**Spread operator merging:**
```typescript
{...defaultSettings, ...JSON.parse(stored)}
 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
 Base values          Override with stored
```

**Why merge with defaults?**
```javascript
// Stored (old version, missing soundEnabled):
{ workDuration: 1800, breakDuration: 600 }

// Default:
{ workDuration: 1500, breakDuration: 300, soundEnabled: true }

// Merged result:
{ workDuration: 1800, breakDuration: 600, soundEnabled: true }
//              ↑ from stored              ↑ from defaults
```

**Forward compatibility:**
- New settings get default values
- Old stored data still works
- No migration code needed

### saveSettings Function

```typescript
function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}
```

**Error handling:**
- localStorage can fail (quota exceeded, privacy mode)
- Graceful degradation: log error, continue working
- App still functions, just doesn't persist

## Provider Component

### State Initialization

```typescript
const [settings, setSettings] = useState<Settings>(loadSettings);
```

**Lazy initialization (passing function):**
```typescript
useState<Settings>(loadSettings)
                   ↑↑↑↑↑↑↑↑↑↑↑↑
                   Function reference, not call!
```

**Difference:**
```typescript
// ✅ Lazy: loadSettings runs once on mount
useState(loadSettings)

// ❌ Eager: loadSettings runs every render
useState(loadSettings())
```

### Persistence Effect

```typescript
useEffect(() => {
  saveSettings(settings);
}, [settings]);
```

**Auto-save pattern:**
- Every settings change triggers save
- No manual "save" button needed
- Always in sync with localStorage

### Individual Setter Functions

```typescript
const setWorkDuration = (duration: number) => {
  setSettings(prev => ({...prev, workDuration: duration}));
};
```

**Functional update pattern:**
```typescript
setSettings(prev => ({...prev, workDuration: duration}))
            ↑↑↑↑     ↑↑↑↑↑↑↑↑↑↑  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
            |        |           New value for one property
            |        Copy all existing values
            Previous state
```

**Why not direct assignment?**

```typescript
// ❌ This overwrites everything
setSettings({ workDuration: duration });
// Result: { workDuration: 1800 }  <- Missing other properties!

// ✅ This preserves other properties
setSettings(prev => ({...prev, workDuration: duration}));
// Result: { workDuration: 1800, breakDuration: 300, soundEnabled: true }
```

### Clear All Data Function

```typescript
const clearAllData = () => {
  localStorage.removeItem('pomodoro_sessions');
  localStorage.removeItem('pomodoro_state');
  localStorage.removeItem(SETTINGS_STORAGE_KEY);
  setSettings(defaultSettings);
  window.location.reload();
};
```

**Multiple localStorage keys cleared:**
```typescript
localStorage.removeItem('pomodoro_sessions');  // Session history
localStorage.removeItem('pomodoro_state');      // Timer state
localStorage.removeItem(SETTINGS_STORAGE_KEY);  // Settings
```

**Why page reload?**
```typescript
window.location.reload();
```

- Ensures all components reset to initial state
- Clears any in-memory caches
- Clean slate for user
- Simpler than manually resetting all contexts

**Alternative without reload:**
```typescript
// Would need to reset ALL contexts manually
setSettings(defaultSettings);
resetPomodoro();  // From PomodoroContext
resetLanguage();  // From LanguageContext
resetTheme();     // From ThemeContext
// etc.
```

## Provider Value

```typescript
<SettingsContext.Provider value={{
  ...settings,
  setWorkDuration,
  setBreakDuration,
  setSoundEnabled,
  clearAllData,
}}>
```

**Spreading settings:**
```typescript
{
  ...settings,
  // Becomes:
  // workDuration: 1500,
  // breakDuration: 300,
  // soundEnabled: true,
  setWorkDuration,
  setBreakDuration,
  setSoundEnabled,
  clearAllData,
}
```

**Result: flat object with all properties and functions**

## Custom Hook

```typescript
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
```

Same pattern as other contexts - ensures proper usage within provider.

## Usage Examples

### Reading Settings

```typescript
import { useSettings } from '../contexts/SettingsContext';

function SomeComponent() {
  const { workDuration, soundEnabled } = useSettings();

  return (
    <div>
      Work duration: {workDuration / 60} minutes
      Sound: {soundEnabled ? 'On' : 'Off'}
    </div>
  );
}
```

### Updating Settings

```typescript
function SettingsForm() {
  const { workDuration, setWorkDuration } = useSettings();

  const handleChange = (minutes: number) => {
    setWorkDuration(minutes * 60);  // Convert to seconds
  };

  return (
    <input
      type="number"
      value={workDuration / 60}
      onChange={(e) => handleChange(Number(e.target.value))}
    />
  );
}
```

### Clearing Data

```typescript
function DangerZone() {
  const { clearAllData } = useSettings();

  const handleClear = () => {
    if (confirm('Delete all data?')) {
      clearAllData();
    }
  };

  return <button onClick={handleClear}>Clear All Data</button>;
}
```

## Flow Diagram

### Settings Update Flow

```
1. User changes work duration input
   ↓
2. Component calls setWorkDuration(1800)
   ↓
3. setSettings(prev => ({...prev, workDuration: 1800}))
   ↓
4. State updates: { workDuration: 1800, ... }
   ↓
5. useEffect detects change
   ↓
6. saveSettings() writes to localStorage
   ↓
7. All consuming components re-render
   ↓
8. Timer displays new duration
```

### Clear All Data Flow

```
1. User clicks "Clear All Data"
   ↓
2. Confirmation shown
   ↓
3. clearAllData() called
   ↓
4. localStorage.removeItem() x3
   ↓
5. setSettings(defaultSettings)
   ↓
6. window.location.reload()
   ↓
7. App reloads fresh
   ↓
8. All contexts load defaults
```

## Best Practices Demonstrated

**Separation of concerns**
- Settings interface: what data
- Context type: data + actions
- Functions: how to load/save

**Defensive loading**
- Try/catch for localStorage
- Merge with defaults
- Graceful error handling

**Individual setters**
- Fine-grained control
- Type-safe parameters
- Clear API

**Centralized data clearing**
- Single function to reset app
- Knows all storage keys
- Atomic operation

## Comparison with Other Contexts

| Feature | SettingsContext | ThemeContext | PomodoroContext |
|---------|-----------------|--------------|-----------------|
| State complexity | Medium | Simple | Complex |
| Persistence | Yes | Yes | Yes |
| Multiple values | Yes | No | Yes |
| Setters | Individual | Toggle | Individual |
| Clear data | Yes | No | No |

## Potential Improvements

### 1. Validation

```typescript
const setWorkDuration = (duration: number) => {
  const validated = Math.max(60, Math.min(duration, 7200)); // 1-120 min
  setSettings(prev => ({...prev, workDuration: validated}));
};
```

### 2. Export/Import Settings

```typescript
const exportSettings = () => JSON.stringify(settings);
const importSettings = (json: string) => {
  const imported = JSON.parse(json) as Settings;
  setSettings({...defaultSettings, ...imported});
};
```

### 3. Reset Without Reload

```typescript
// Would require coordination with other contexts
const resetToDefaults = () => {
  localStorage.clear();
  setSettings(defaultSettings);
  // Dispatch custom event for other contexts
  window.dispatchEvent(new CustomEvent('app-reset'));
};
```

## Summary

SettingsContext demonstrates:
- Clean settings management pattern
- Interface extension with `extends`
- Spread operator for partial updates
- Forward-compatible storage loading
- Centralized data clearing
- Individual setter functions

This pattern is useful for any app configuration that needs:
- User customization
- Persistence across sessions
- Easy reset capability
- Type-safe updates

---

*Location: `/src/contexts/SettingsContext.tsx`*
*Related concepts: Context API, localStorage, Spread Operator, TypeScript Interfaces*
