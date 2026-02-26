# translations.ts - i18n Translation Strings - Complete Explanation

## Overview
This file defines all translatable strings for the application in 5 languages: English, Spanish, French, Esperanto, and Russian. It provides type definitions for translations and a function to retrieve them by language code. This is a simple but effective approach to internationalization (i18n).

## Learning Concepts
- **Union Types**: Restricting language codes to valid values
- **Interfaces for Structure**: Defining translation shape
- **Record Type**: Mapping languages to translations
- **Export Patterns**: Named exports for types and functions
- **i18n Organization**: Structuring translations by category
- **Type Safety**: Ensuring all translations exist

## The Complete Code (Abbreviated)

```typescript
export type Language = 'en' | 'es' | 'fr' | 'eo' | 'ru';

export interface Translations {
  // App header
  appName: string;

  // Navigation
  timerTab: string;
  statsTab: string;

  // Timer controls
  start: string;
  pause: string;
  reset: string;
  finish: string;

  // ... 40+ more keys
}

const translations: Record<Language, Translations> = {
  en: { /* English strings */ },
  es: { /* Spanish strings */ },
  fr: { /* French strings */ },
  eo: { /* Esperanto strings */ },
  ru: { /* Russian strings */ },
};

export const LANGUAGES = Object.keys(translations) as Language[];

export function getTranslations(language: Language): Translations {
  return translations[language];
}
```

## Type Definitions

### Language Type

```typescript
export type Language = 'en' | 'es' | 'fr' | 'eo' | 'ru';
```

**Union of string literals:**
```typescript
type Language = 'en' | 'es' | 'fr' | 'eo' | 'ru';
//              ↑↑↑↑   ↑↑↑↑   ↑↑↑↑   ↑↑↑↑   ↑↑↑↑
//              English Spanish French Esperanto Russian
```

**Benefits:**
```typescript
// TypeScript allows:
const lang: Language = 'en';  // ✅
const lang: Language = 'es';  // ✅

// TypeScript prevents:
const lang: Language = 'de';     // ❌ Error: not in union
const lang: Language = 'EN';     // ❌ Error: case sensitive
const lang: Language = 'english'; // ❌ Error: wrong format
```

**Why ISO codes?**
- Standard format (ISO 639-1)
- Short and consistent
- Used by browsers (navigator.language)
- Universal recognition

### Translations Interface

```typescript
export interface Translations {
  // App header
  appName: string;

  // Navigation
  timerTab: string;
  statsTab: string;

  // Timer component - controls
  start: string;
  pause: string;
  reset: string;
  finish: string;

  // Timer component - notifications
  workCompleted: string;
  breakCompleted: string;

  // ... more keys
}
```

**Interface as contract:**
- Every language MUST have all keys
- TypeScript enforces completeness
- Missing translations = compile error

**Organization by category:**
```typescript
interface Translations {
  // App header        ← Category comment
  appName: string;

  // Navigation        ← Another category
  timerTab: string;
  statsTab: string;

  // Timer controls    ← Groups related strings
  start: string;
  pause: string;
  // ...
}
```

**All properties are `string`:**
```typescript
appName: string;   // Not `appName: 'PomoDoroto'`
```

- Interface defines shape, not values
- Values come from translation objects

## The Translations Object

### Record Type

```typescript
const translations: Record<Language, Translations> = { ... };
```

**`Record<K, V>` explained:**
```typescript
Record<Language, Translations>
       ↑↑↑↑↑↑↑↑  ↑↑↑↑↑↑↑↑↑↑↑↑↑
       Key type   Value type
```

**Equivalent to:**
```typescript
{
  en: Translations;
  es: Translations;
  fr: Translations;
  eo: Translations;
  ru: Translations;
}
```

**Benefits of Record:**
- Enforces all languages have translations
- Each translation matches Translations interface
- Can't forget a language

### Translation Object Structure

```typescript
const translations: Record<Language, Translations> = {
  en: {
    appName: '🍅 PomoDoroto',
    timerTab: '⏱️ Timer',
    statsTab: '📊 Stats',
    start: '▶️ Start',
    pause: '⏸ Pause',
    reset: '🔄 Reset',
    // ... all keys
  },
  es: {
    appName: '🍅 PomoDoroto',  // Same brand name
    timerTab: '⏱️ Temporizador',
    statsTab: '📊 Estadísticas',
    start: '▶️ Iniciar',
    pause: '⏸ Pausar',
    reset: '🔄 Reiniciar',
    // ... all keys in Spanish
  },
  // ... fr, eo, ru
};
```

**What TypeScript enforces:**
```typescript
// ❌ Error: Missing required property 'statsTab'
const translations = {
  en: {
    appName: '🍅 PomoDoroto',
    timerTab: '⏱️ Timer',
    // statsTab missing!
  }
};

// ❌ Error: Property 'extraKey' does not exist
const translations = {
  en: {
    appName: '🍅 PomoDoroto',
    extraKey: 'Not allowed',  // Not in interface!
  }
};
```

## Exported Utilities

### LANGUAGES Array

```typescript
export const LANGUAGES = Object.keys(translations) as Language[];
```

**Breaking it down:**
```typescript
Object.keys(translations)  // ['en', 'es', 'fr', 'eo', 'ru'] (type: string[])
                    as Language[]  // Cast to Language[]
```

**Why type assertion?**
- `Object.keys()` returns `string[]`
- We know these are valid Language values
- Cast tells TypeScript to trust us

**Usage:**
```typescript
// In language selector
LANGUAGES.map(lang => (
  <option key={lang} value={lang}>
    {lang}
  </option>
));
```

### getTranslations Function

```typescript
export function getTranslations(language: Language): Translations {
  return translations[language];
}
```

**Simple lookup function:**
```typescript
getTranslations('en')  // Returns English translations object
getTranslations('es')  // Returns Spanish translations object
```

**Type safety:**
```typescript
getTranslations('en')  // ✅ OK
getTranslations('de')  // ❌ Error: 'de' not in Language
```

**Why a function instead of direct access?**
```typescript
// Direct access (works but less flexible):
translations[language]

// Function (better):
getTranslations(language)
```

Benefits of function:
- Encapsulation: can add logging, caching
- Abstraction: caller doesn't know structure
- Flexibility: can change implementation later

## Translation Examples

### English

```typescript
en: {
  // Controls
  start: '▶️ Start',
  pause: '⏸ Pause',
  reset: '🔄 Reset',
  finish: 'FINISH',

  // Notifications
  workCompleted: '✅ Work session completed!',
  breakCompleted: '☕ Break completed!',

  // Settings
  settings: 'Settings',
  workDuration: 'Work Duration',
  soundEffects: 'Sound Effects',
}
```

### Spanish

```typescript
es: {
  // Controls - translated
  start: '▶️ Iniciar',
  pause: '⏸ Pausar',
  reset: '🔄 Reiniciar',
  finish: 'FINALIZAR',

  // Notifications
  workCompleted: '✅ ¡Sesión de trabajo completada!',
  breakCompleted: '☕ ¡Descanso completado!',

  // Settings
  settings: 'Ajustes',
  workDuration: 'Duración de Trabajo',
  soundEffects: 'Efectos de Sonido',
}
```

### Esperanto

```typescript
eo: {
  // Controls
  start: '▶️ Komenci',
  pause: '⏸ Paŭzi',
  reset: '🔄 Rekomenci',
  finish: 'FINI',

  // Notifications
  workCompleted: '✅ Laborseanco finita!',
  breakCompleted: '☕ Paŭzo finita!',

  // Settings
  settings: 'Agordoj',
  workDuration: 'Labordaŭro',
  soundEffects: 'Sonefektoj',
}
```

**Note on Esperanto:**
- International auxiliary language
- Regular grammar (no exceptions)
- Fun language to include!

### Russian

```typescript
ru: {
  // Controls - Cyrillic
  start: '▶️ Старт',
  pause: '⏸ Пауза',
  reset: '🔄 Сброс',
  finish: 'ЗАВЕРШИТЬ',

  // Notifications
  workCompleted: '✅ Рабочая сессия завершена!',
  breakCompleted: '☕ Перерыв завершен!',

  // Settings
  settings: 'Настройки',
  workDuration: 'Продолжительность Работы',
  soundEffects: 'Звуковые Эффекты',
}
```

## Usage in Components

### Basic Usage

```typescript
import { useLanguage } from '../contexts/LanguageContext';

function Timer() {
  const { translations } = useLanguage();

  return (
    <>
      <button>{translations.start}</button>
      <button>{translations.pause}</button>
      <button>{translations.reset}</button>
    </>
  );
}
```

### Conditional Text

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

### Dynamic Keys (Advanced)

```typescript
// Type-safe dynamic key access
type TranslationKey = keyof Translations;

function DynamicText({ textKey }: { textKey: TranslationKey }) {
  const { translations } = useLanguage();
  return <span>{translations[textKey]}</span>;
}

// Usage:
<DynamicText textKey="start" />      // ✅ OK
<DynamicText textKey="invalid" />    // ❌ TypeScript error
```

## Pattern: Adding a New Translation Key

### Step 1: Add to Interface

```typescript
export interface Translations {
  // ... existing keys
  newFeature: string;  // Add here first
}
```

### Step 2: TypeScript Shows Errors

```
Error: Property 'newFeature' is missing in type 'en'
Error: Property 'newFeature' is missing in type 'es'
Error: Property 'newFeature' is missing in type 'fr'
Error: Property 'newFeature' is missing in type 'eo'
Error: Property 'newFeature' is missing in type 'ru'
```

### Step 3: Add to All Languages

```typescript
const translations = {
  en: {
    // ... existing
    newFeature: 'New Feature',
  },
  es: {
    // ... existing
    newFeature: 'Nueva Función',
  },
  // ... add to all languages
};
```

**TypeScript ensures nothing is forgotten!**

## Pattern: Adding a New Language

### Step 1: Add to Language Type

```typescript
export type Language = 'en' | 'es' | 'fr' | 'eo' | 'ru' | 'de';  // Add 'de'
```

### Step 2: TypeScript Shows Error

```
Error: Property 'de' is missing in type 'Record<Language, Translations>'
```

### Step 3: Add Translation Object

```typescript
const translations: Record<Language, Translations> = {
  // ... existing languages
  de: {
    appName: '🍅 PomoDoroto',
    timerTab: '⏱️ Timer',  // German uses "Timer"
    statsTab: '📊 Statistiken',
    start: '▶️ Start',  // German uses "Start"
    // ... all keys
  },
};
```

## Best Practices Demonstrated

### 1. Type Safety

```typescript
type Language = 'en' | 'es' | ...;  // Can't use invalid codes
interface Translations { ... }       // Can't miss keys
Record<Language, Translations>       // Can't miss languages
```

### 2. Single Source of Truth

```typescript
// All translations in one file
// Easy to find and update
// No scattered strings
```

### 3. Organized Structure

```typescript
interface Translations {
  // App header
  appName: string;

  // Navigation
  timerTab: string;
  // ...
}
// Comments group related translations
```

### 4. Consistent Patterns

```typescript
// All languages follow same structure
// All keys have same names
// All values are strings
```

## Comparison: i18n Approaches

### This Approach (Static Object)

```typescript
const translations = {
  en: { key: 'value' },
  es: { key: 'valor' }
};
```

**Pros:**
- Simple to understand
- Type-safe
- No dependencies
- Fast lookup

**Cons:**
- All languages loaded at once
- No interpolation (dynamic values)
- No pluralization rules

### Library Approach (react-i18next)

```typescript
i18next.init({
  resources: { en: { translation: { key: 'value' } } }
});

// Usage
const { t } = useTranslation();
t('key');
t('hello', { name: 'World' });  // Interpolation
t('items', { count: 5 });       // Pluralization
```

**Pros:**
- Interpolation
- Pluralization
- Lazy loading
- Industry standard

**Cons:**
- Learning curve
- Bundle size
- Configuration complexity

### When to Use Which

| Feature | Static Object | Library |
|---------|---------------|---------|
| Small app (< 50 keys) | ✅ Best | Overkill |
| Many languages (10+) | Possible | ✅ Better |
| Dynamic text | Manual | ✅ Built-in |
| Pluralization | Manual | ✅ Built-in |
| Team of translators | Works | ✅ Better tools |

## Potential Improvements

### 1. Interpolation Helper

```typescript
function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    String(values[key] ?? `{${key}}`)
  );
}

// Usage:
// template: 'Hello, {name}!'
// interpolate(template, { name: 'World' }) → 'Hello, World!'
```

### 2. Lazy Loading

```typescript
const loadTranslations = async (lang: Language): Promise<Translations> => {
  const module = await import(`./translations/${lang}.json`);
  return module.default;
};
```

### 3. Fallback Chain

```typescript
function getTranslation(key: keyof Translations, lang: Language): string {
  return translations[lang][key]
    ?? translations.en[key]  // Fallback to English
    ?? key;                   // Fallback to key name
}
```

### 4. Missing Translation Warning

```typescript
const handler = {
  get(target: Translations, prop: string) {
    if (!(prop in target)) {
      console.warn(`Missing translation: ${prop}`);
      return prop;
    }
    return target[prop];
  }
};

const safeTranslations = new Proxy(translations.en, handler);
```

## Summary

translations.ts demonstrates:
- Union types for valid language codes
- Interface for translation structure
- Record type for mapping
- Type-safe translation lookup
- Organized translation strings
- Simple but effective i18n approach

Key insights:
- TypeScript catches missing translations
- Comments organize translations by feature
- Simple lookup function provides abstraction
- No external dependencies needed for basic i18n
- 5 languages supported: EN, ES, FR, EO, RU

---

*Location: `/src/utils/translations.ts`*
*Related files: `/src/contexts/LanguageContext.tsx`*
*Related concepts: i18n, TypeScript Types, Record, Interface*
