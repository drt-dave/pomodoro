# Sprint 03: UI Polish & Professional Cleanup

**Duration:** 1 week
**Story Points:** 10 total
**Goal:** Fix critical UI issues, clean dead code, and elevate PomoDoroto to portfolio-ready quality

---

## Sprint Goals

1. **Clean dead code** - Remove Vite boilerplate and console.logs
2. **Fix accessibility** - Semantic HTML in navigation
3. **Fix layout** - Flexbox header instead of absolute positioning
4. **Standardize CSS** - Consistent spacing, type scale
5. **Upgrade icons** - Replace emoji with SVG icons (lucide-react)
6. **Visual polish** - Breathing room, theme transitions

---

## Sprint 03 Issues

### Issue #12: Remove Dead Code & Console.logs (1 pt)

**Priority:** Critical
**Labels:** `cleanup`, `code-quality`

#### Description
Remove leftover Vite boilerplate CSS and debug console.logs. This is the #1 thing an interviewer will notice in DevTools.

#### Files to Modify

1. **`src/App.css`** - Delete lines 65-93:
   - `.logo`, `.logo:hover`, `.logo.react:hover`
   - `@keyframes logo-spin`
   - `@media (prefers-reduced-motion)` block
   - `.read-the-docs`
   - `.card` class (only has `padding: 2em`, unused as a proper card)

2. **`src/App.tsx`** - Remove all `console.log()` calls:
   - Line 25: `console.log('Vi alklakis butonon! (Toggle Theme)');`
   - Line 72: `console.log('Vi alklakis butonon! (Timer View)');`
   - Line 82: `console.log('Vi alklakis butonon! (Stats View)');`

#### Acceptance Criteria
- [ ] No dead CSS classes in App.css
- [ ] Zero console.log calls in production code
- [ ] App renders exactly as before
- [ ] Build passes with no errors

#### Concepts to Learn
- Code hygiene and professional standards
- Why dead code is a red flag in code reviews
- DevTools as an interviewer's first stop

---

### Issue #13: Fix Navigation Accessibility (1 pt)

**Priority:** Critical
**Labels:** `accessibility`, `a11y`, `html`

#### Description
Replace `<div>` elements with `<button>` elements in the bottom navigation. Clickable elements MUST be interactive HTML elements for screen readers and keyboard users.

#### Files to Modify

1. **`src/App.tsx`**
   - Change `<div className="nav-item">` to `<button className="nav-item">`
   - Add `aria-label` attributes
   - Add `type="button"` attribute

#### Before:
```tsx
<div className={`nav-item ${activeView === 'timer' ? 'active' : ''}`}
     onClick={() => setActiveView('timer')}>
```

#### After:
```tsx
<button type="button"
        className={`nav-item ${activeView === 'timer' ? 'active' : ''}`}
        onClick={() => setActiveView('timer')}
        aria-label="Timer view">
```

#### Acceptance Criteria
- [ ] Navigation uses `<button>` elements
- [ ] Keyboard Tab navigation works
- [ ] Screen readers announce buttons correctly
- [ ] Visual appearance unchanged

#### Concepts to Learn
- Semantic HTML and why it matters
- `<div>` vs `<button>` for interactive elements
- WCAG 2.1 accessibility guidelines
- How screen readers navigate a page

---

### Issue #14: Fix Header Layout with Flexbox (2 pts)

**Priority:** High
**Labels:** `css`, `layout`, `responsive`

#### Description
Replace `position: absolute` on theme toggle and language selector with proper Flexbox layout. Current layout breaks when elements overlap on medium screens.

#### Files to Modify

1. **`src/App.css`** - Refactor `.app-header`:
   - Use `display: flex; justify-content: space-between; align-items: center;`
   - Remove `position: absolute` from `.theme-toggle` and `.language-select`
   - Group right-side controls in markup or use `gap`

2. **`src/App.tsx`** - Wrap right-side controls:
   - Group language selector + theme toggle in a `<div className="header-controls">`

#### Target Layout:
```
[  🍅 PomoDoroto  ] [🇬🇧 ▼] [🌙]
   (flex: 1)         (controls group)
```

#### Acceptance Criteria
- [ ] No `position: absolute` in header
- [ ] Controls never overlap with title
- [ ] Responsive on all screen sizes
- [ ] Visual appearance maintained or improved

#### Concepts to Learn
- Flexbox for real-world layouts
- Why `position: absolute` is fragile for responsive design
- `gap` property for spacing flex children
- Mobile-first responsive patterns

---

### Issue #15: Standardize Spacing & Type Scale (2 pts)

**Priority:** High
**Labels:** `css`, `design-system`

#### Description
Define a consistent spacing scale and type scale using CSS custom properties. Currently the app mixes `em`, `rem`, and `px` arbitrarily.

#### Files to Modify

1. **`src/App.css`** - Add design tokens to `:root`:

```css
/* Type Scale */
--font-xs: 0.75rem;    /* 12px */
--font-sm: 0.875rem;   /* 14px */
--font-base: 1rem;     /* 16px */
--font-md: 1.125rem;   /* 18px */
--font-lg: 1.25rem;    /* 20px */
--font-xl: 1.5rem;     /* 24px */
--font-2xl: 2rem;      /* 32px */
--font-3xl: 3rem;      /* 48px */

/* Spacing Scale */
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
```

2. **All `.module.css` files** - Replace arbitrary values with tokens

#### Acceptance Criteria
- [ ] Type scale defined as CSS custom properties
- [ ] Spacing scale defined as CSS custom properties
- [ ] At least 80% of hardcoded values replaced with tokens
- [ ] Consistent `rem` usage (no `em` or `px` for spacing)

#### Concepts to Learn
- Design tokens and design systems
- `rem` vs `em` vs `px` — when to use each
- Why consistency matters in professional apps
- How companies like Stripe/Vercel structure their CSS

---

### Issue #16: Replace Emoji Icons with SVG (lucide-react) (2 pts)

**Priority:** Medium
**Labels:** `ui`, `icons`, `dependencies`

#### Description
Replace emoji icons (▶, ⏸, ↺, ⏹, 🗑) with SVG icons from `lucide-react`. Emojis render differently across OS/browsers. SVG icons are consistent, scalable, and professional.

#### Dependencies to Install
```bash
npm install lucide-react
```

#### Files to Modify

1. **`src/components/Timer.tsx`**
   - `▶` → `<Play />` from lucide-react
   - `⏸` → `<Pause />`
   - `↺` → `<RotateCcw />`
   - `⏹` → `<Square />`

2. **`src/components/TagSelector.tsx`**
   - `🗑` → `<Trash2 />`
   - `+` → `<Plus />`

3. **`src/App.tsx`**
   - `🌙` / `☀️` → `<Moon />` / `<Sun />`

4. **CSS files** - Adjust icon sizing (lucide uses `size` prop instead of font-size)

#### Acceptance Criteria
- [ ] All interactive emoji icons replaced with lucide-react SVGs
- [ ] Icons scale properly on desktop and mobile
- [ ] Decorative emojis (🍅 in logo, 💼/☕ in mode) can stay as-is
- [ ] `aria-hidden="true"` on icon SVGs (labels on buttons)
- [ ] Build passes, no visual regression

#### Concepts to Learn
- Why SVG icons > emoji for production apps
- `lucide-react` library (lightweight, tree-shakeable)
- Icon accessibility patterns
- Tree-shaking — only imports the icons you use

---

### Issue #17: Add Visual Breathing Room & Theme Transition (1 pt)

**Priority:** Medium
**Labels:** `ui`, `polish`

#### Description
Add more whitespace between sections and a smooth transition when switching themes.

#### Files to Modify

1. **`src/App.css`** or component CSS files:
   - Add `gap` between TagSelector, Timer, and controls
   - Add `margin-bottom` between major sections
   - Add to body/root: `transition: background-color 0.3s ease, color 0.3s ease;`

2. **`src/index.css`**:
   - Add transition for theme switching on `body` or `:root`

#### Acceptance Criteria
- [ ] Clear visual separation between tag selector, timer, and stats
- [ ] Theme switch animates smoothly (not instant)
- [ ] App doesn't feel cramped on any screen size

#### Concepts to Learn
- Whitespace as a design tool
- CSS transitions on color properties
- Visual hierarchy through spacing

---

### Issue #18: Improve Bottom Navigation Style (1 pt)

**Priority:** Low
**Labels:** `ui`, `navigation`

#### Description
The floating button style feels disconnected from the app. Consider a tab-bar style that feels more integrated.

#### Options (choose during implementation):
- **Option A:** Full-width tab bar (like iOS tab bar)
- **Option B:** Keep buttons but remove gap/shadow for a connected feel
- **Option C:** Segmented control style (single rounded container with two segments)

#### Files to Modify

1. **`src/App.css`** - Restyle `.bottom-nav` and `.nav-item`

#### Acceptance Criteria
- [ ] Navigation feels integrated with the app
- [ ] Active state is clear and obvious
- [ ] Responsive on mobile
- [ ] Accessible with keyboard

---

## Sprint 03 Metrics

**Total Story Points:** 10
**Estimated Completion:** 1 week (~14 hours)

| Priority | Issues | Points |
|----------|--------|--------|
| Critical | #12, #13 | 2 pts |
| High | #14, #15 | 4 pts |
| Medium | #16, #17 | 3 pts |
| Low | #18 | 1 pt |

---

## Implementation Order

### Day 1-2: Critical Fixes (Quick Wins)
- **Issue #12** — Remove dead code & console.logs (~30 min)
- **Issue #13** — Fix nav accessibility (~30 min)
- **Issue #17** — Breathing room & theme transition (~1 hour)

### Day 3-4: Layout & Design System
- **Issue #14** — Flexbox header (~2 hours)
- **Issue #15** — Type scale & spacing tokens (~3 hours)

### Day 5-6: Icons & Navigation
- **Issue #16** — lucide-react icons (~2 hours)
- **Issue #18** — Bottom nav restyle (~1 hour)

### Day 7: Review & Polish
- Test all changes on mobile + desktop
- Verify light/dark themes
- Take before/after screenshots for portfolio

---

## Success Criteria

Sprint 03 is complete when:
- [ ] Zero dead code or console.logs
- [ ] All interactive elements are semantic HTML
- [ ] Header never breaks on any screen width
- [ ] Consistent design tokens used throughout
- [ ] SVG icons render consistently across devices
- [ ] Theme switch is smooth
- [ ] App feels spacious and professional

---

## Learning Outcomes

By completing Sprint 03, you'll gain experience with:

- **Code Quality:** Dead code removal, professional standards
- **Accessibility:** Semantic HTML, WCAG compliance
- **CSS Architecture:** Design tokens, type scales, spacing systems
- **Icon Systems:** SVG vs emoji, lucide-react, tree-shaking
- **Layout:** Flexbox patterns for real navigation bars
- **Portfolio:** Before/after comparison for README
