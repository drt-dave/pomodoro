# LanguageContext - Internationalization (i18n) - Complete Explanation

## Overview
This file implements a complete internationalization system that allows the app to display text in multiple languages. It manages language selection, persists user preference, and provides translated strings to all components. This is a clean example of how to add multi-language support to a React app.

## Learning Concepts
- **Internationalization (i18n)**: Supporting multiple languages
- **Type Imports**: Using `import type` for TypeScript types
- **Derived State**: Computing translations from language
- **Lazy Initialization with Callbacks**: Arrow function in useState
- **Type Safety**: Language union types prevent invalid values

## The Complete Code

```typescript
import { createContext, useContext, useState, useEffect  } from 'react';
import type { ReactNode } from 'react';
import type { Language, Translations  } from '../utils/translations';
import {getTranslations } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({children}: LanguageProviderProps) {
  const [language, setLanguageState] =  useState<Language>(() => {
    const saved = localStorage.getItem('pomodoro-language') as Language;
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('pomodoro-language', language);
  }, [language]);

  const translations = getTranslations(language);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
```

## Import Statements

```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language, Translations } from '../utils/translations';
import { getTranslations } from '../utils/translations';
```

### Type Imports vs Regular Imports

```typescript
import type { Language, Translations } from '../utils/translations';
import { getTranslations } from '../utils/translations';
```

**Why separate?**
```typescript
import type { ... }  // Only imports TypeScript types
import { ... }       // Imports runtime values
```

**Benefits:**
- Types are erased at compile time
- Bundler knows what to include
- Smaller bundle size
- Clearer code intent

**Equivalent (but less clear):**
```typescript
import { Language, Translations, getTranslations } from '../utils/translations';
```

## Type Definitions

### LanguageContextType Interface

```typescript
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
}
```

**Three-part interface:**

1. **`language: Language`**
   - Current selected language code
   - `Language` type from translations.ts

2. **`setLanguage: (lang: Language) => void`**
   - Function to change language
   - Type-safe: only valid languages accepted

3. **`translations: Translations`**
   - All translated strings for current language
   - Components use this to display text

### Language Type (from translations.ts)

```typescript
type Language = 'en' | 'es' | 'fr' | 'eo' | 'ru';
```

**Union type ensures:**
```typescript
setLanguage('en');    // ✅ OK
setLanguage('es');    // ✅ OK
setLanguage('de');    // ❌ TypeScript error: not in union
setLanguage('EN');    // ❌ TypeScript error: case sensitive
```

## Provider Implementation

### Language State

```typescript
const [language, setLanguageState] = useState<Language>(() => {
  const saved = localStorage.getItem('pomodoro-language') as Language;
  return saved || 'en';
});
```

**Lazy initialization with arrow function:**
```typescript
useState<Language>(() => {
  // This code runs ONCE on mount
  const saved = localStorage.getItem('pomodoro-language');
  return saved || 'en';
});
```

**Why arrow function here?**
```typescript
// With arrow function: runs once
useState(() => localStorage.getItem(...))

// Without: would also work, but convention varies
useState(localStorage.getItem(...) || 'en')
```

**Type assertion:**
```typescript
localStorage.getItem('pomodoro-language') as Language
```

- localStorage returns `string | null`
- We know it's either a valid Language or null
- `as Language` tells TypeScript to trust us

**Default to English:**
```typescript
return saved || 'en';
       ↑↑↑↑↑    ↑↑↑↑
       |        Fallback if saved is null/falsy
       Saved language if exists
```

### Persistence Effect

```typescript
useEffect(() => {
  localStorage.setItem('pomodoro-language', language);
}, [language]);
```

**Same pattern as other contexts:**
- Runs when `language` changes
- Saves to localStorage
- Persists user preference

### Derived State: Translations

```typescript
const translations = getTranslations(language);
```

**Key insight: Not using useState!**

```typescript
// ❌ Unnecessary state
const [translations, setTranslations] = useState(getTranslations(language));
useEffect(() => {
  setTranslations(getTranslations(language));
}, [language]);

// ✅ Computed on each render (simpler, same result)
const translations = getTranslations(language);
```

**Why this works:**
- `getTranslations` is a pure function
- Same language always returns same translations
- React re-renders when language changes
- Translations recalculate automatically

**Derived state pattern:**
```
language state changes
        ↓
Component re-renders
        ↓
getTranslations(language) runs
        ↓
New translations computed
        ↓
Children receive new translations
```

### setLanguage Wrapper

```typescript
const setLanguage = (lang: Language) => {
  setLanguageState(lang);
};
```

**Why wrap the setter?**

1. **Cleaner API:** `setLanguage` vs `setLanguageState`
2. **Future flexibility:** Could add validation or logging
3. **Consistent naming:** Matches interface

**Could be enhanced:**
```typescript
const setLanguage = (lang: Language) => {
  console.log(`Language changed: ${language} → ${lang}`);
  setLanguageState(lang);
  // Could also update document.lang attribute
  document.documentElement.lang = lang;
};
```

### Provider Value

```typescript
<LanguageContext.Provider value={{ language, setLanguage, translations }}>
```

**Three values provided:**
```typescript
{
  language: 'en',           // Current language code
  setLanguage: [Function],  // Change language
  translations: {           // All strings
    appName: 'PomoDoroto',
    start: 'Start',
    // ... 40+ more keys
  }
}
```

## Usage Examples

### Basic Usage

```typescript
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { translations } = useLanguage();

  return (
    <button>{translations.start}</button>  // "Start" or "Iniciar" etc.
  );
}
```

### Language Selector

```typescript
function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', flag: 'US', name: 'English' },
    { code: 'es', flag: 'ES', name: 'Spanish' },
    { code: 'fr', flag: 'FR', name: 'French' },
    { code: 'eo', flag: 'EO', name: 'Esperanto' },
    { code: 'ru', flag: 'RU', name: 'Russian' },
  ];

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
```

### Conditional Rendering

```typescript
function ModeIndicator({ mode }: { mode: 'work' | 'break' }) {
  const { translations } = useLanguage();

  return (
    <div>
      {mode === 'work'
        ? translations.workSession
        : translations.breakTime}
    </div>
  );
}
```

## Flow Diagram

### Language Change Flow

```
1. User selects Spanish from dropdown
   ↓
2. onChange calls setLanguage('es')
   ↓
3. setLanguageState('es')
   ↓
4. language state: 'en' → 'es'
   ↓
5. Component re-renders
   ↓
6. const translations = getTranslations('es')
   ↓
7. translations now contains Spanish strings
   ↓
8. useEffect runs: localStorage.setItem('es')
   ↓
9. All child components re-render
   ↓
10. UI displays Spanish text
```

### Page Refresh Flow

```
1. User refreshes page
   ↓
2. LanguageProvider mounts
   ↓
3. useState lazy init runs
   ↓
4. localStorage.getItem('pomodoro-language') → 'es'
   ↓
5. language initialized to 'es'
   ↓
6. translations computed for Spanish
   ↓
7. App renders in Spanish immediately
   ↓
(No flash of wrong language!)
```

## Comparison: i18n Approaches

### 1. Context (This Approach)

```typescript
// Simple, good for small apps
const { translations } = useLanguage();
return <span>{translations.hello}</span>;
```

**Pros:** Simple, no dependencies, type-safe
**Cons:** Re-renders all on language change

### 2. i18n Libraries (react-i18next)

```typescript
// More features, larger apps
const { t } = useTranslation();
return <span>{t('hello')}</span>;
```

**Pros:** Lazy loading, plurals, interpolation
**Cons:** Learning curve, bundle size

### 3. Inline Objects

```typescript
// Simplest but limited
const labels = { en: 'Hello', es: 'Hola' };
return <span>{labels[language]}</span>;
```

**Pros:** No setup
**Cons:** Doesn't scale, repetitive

## Why This Approach Works

**For this app:**
- Small translation file (~300 lines)
- 5 languages
- ~40 translation keys
- No dynamic content

**Would need library for:**
- 20+ languages
- Dynamic text (interpolation)
- Pluralization rules
- Lazy loading translations
- Date/number formatting

## Best Practices Demonstrated

**Type-safe language codes**
```typescript
type Language = 'en' | 'es' | 'fr' | 'eo' | 'ru';
// Can't accidentally use invalid code
```

**Derived state instead of synchronized state**
```typescript
const translations = getTranslations(language);
// Simpler than useState + useEffect combo
```

**Separation of concerns**
```typescript
// LanguageContext: manages selection
// translations.ts: defines strings
// Components: just use translations
```

**localStorage persistence**
```typescript
// User preference survives refresh
// Good UX
```

## Potential Improvements

### 1. Browser Language Detection

```typescript
useState<Language>(() => {
  const saved = localStorage.getItem('pomodoro-language');
  if (saved) return saved as Language;

  // Detect browser language
  const browserLang = navigator.language.split('-')[0];
  if (['en', 'es', 'fr', 'eo', 'ru'].includes(browserLang)) {
    return browserLang as Language;
  }

  return 'en';
});
```

### 2. Document Language Attribute

```typescript
useEffect(() => {
  document.documentElement.lang = language;
  localStorage.setItem('pomodoro-language', language);
}, [language]);
```

### 3. Right-to-Left (RTL) Support

```typescript
// If adding Arabic, Hebrew, etc.
const rtlLanguages = ['ar', 'he'];
const isRTL = rtlLanguages.includes(language);

useEffect(() => {
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
}, [isRTL]);
```

## Summary

LanguageContext demonstrates:
- Simple i18n without external libraries
- Type-safe language selection
- Derived state pattern (translations)
- localStorage persistence
- Clean separation of concerns

Key insights:
- Use `import type` for TypeScript-only imports
- Derived state avoids unnecessary synchronization
- Union types prevent invalid language codes
- Context provides translations app-wide

---

*Location: `/src/contexts/LanguageContext.tsx`*
*Related files: `/src/utils/translations.ts`*
*Related concepts: i18n, Context API, Derived State, TypeScript Union Types*
