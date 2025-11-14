# Sprint 02: Polish, Refactor & Advanced Features

**Duration:** 1-2 weeks
**Story Points:** 13 total
**Goal:** Clean architecture, enhanced UX, and production-ready polish

---

## 🎯 Sprint Goals

1. **Refactor to CSS Modules** - Clean, maintainable component styles
2. **Enhanced Statistics** - Data visualization with charts
3. **Dark Mode** - Modern theming system
4. **Polish Features** - Settings, sounds, notifications

---

## 📋 Sprint 02 Issues

### Issue #6: Refactor to CSS Modules (3 pts) ⭐ PRIORITY

**Priority:** High
**Labels:** `refactor`, `architecture`, `css`

#### Description
Refactor component styles from monolithic App.css to CSS Modules for better maintainability, component isolation, and professional architecture.

#### User Story
```
As a developer
I want component styles organized in CSS Modules
So that styles are scoped, maintainable, and portable
```

#### Acceptance Criteria
- [ ] Extract all component-specific styles from App.css
- [ ] Create `.module.css` file for each component (co-located)
- [ ] Update component imports to use CSS Modules
- [ ] Keep global styles in App.css (reset, CSS variables, body)
- [ ] All components render exactly as before (no visual changes)
- [ ] No style conflicts or broken layouts
- [ ] Delete unused styles from App.css

#### Technical Implementation

**Components to Refactor:**
1. `Timer.tsx` → `Timer.module.css`
2. `ModeIndicator.tsx` → `ModeIndicator.module.css`
3. `Toast.tsx` → `Toast.module.css`
4. `TagSelector.tsx` → `TagSelector.module.css`
5. `TagStats.tsx` → `TagStats.module.css`
6. `ConfirmModal.tsx` → `ConfirmModal.module.css`

**File Structure (Co-located):**
```
src/
├── components/
│   ├── Timer.tsx
│   ├── Timer.module.css          ← NEW
│   ├── ModeIndicator.tsx
│   ├── ModeIndicator.module.css  ← NEW
│   ├── Toast.tsx
│   ├── Toast.module.css          ← NEW
│   └── ...
├── App.tsx
├── App.css                        (only global styles)
└── main.tsx
```

**Example Refactor:**

**Before (App.css):**
```css
.timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
```

**After (Timer.module.css):**
```css
.timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
```

**Component Update:**
```typescript
// Timer.tsx
import styles from './Timer.module.css';

export const Timer = () => {
  return (
    <div className={styles.timer}>
      {/* ... */}
    </div>
  );
};
```

#### Testing Checklist
- [ ] Timer component displays correctly
- [ ] ModeIndicator styles work in both modes
- [ ] Toast animations still work
- [ ] TagSelector dropdown styles intact
- [ ] TagStats cards render properly
- [ ] ConfirmModal appears correctly
- [ ] Responsive styles work on mobile
- [ ] No console errors about missing styles

#### Definition of Done
- [ ] All 6 components use CSS Modules
- [ ] Global styles remain in App.css
- [ ] Visual appearance unchanged
- [ ] No style conflicts
- [ ] Code committed and tested

---

### Issue #7: Enhanced Statistics Dashboard (3 pts)

**Priority:** High
**Labels:** `feature`, `ui/ux`, `data-visualization`

#### Description
Add data visualization with charts and enhanced statistics views to provide meaningful insights into productivity patterns.

#### User Story
```
As a user
I want to see visual charts of my productivity
So that I can understand my work patterns and improve
```

#### Acceptance Criteria
- [ ] Install chart library (Chart.js or Recharts)
- [ ] Add daily/weekly/monthly view toggle
- [ ] Bar chart showing sessions per day
- [ ] Pie chart showing time distribution by tag
- [ ] Display total completion rate percentage
- [ ] Show most productive tags
- [ ] Date range selector
- [ ] Responsive charts on mobile

#### Technical Implementation

**Library Choice:** Chart.js (simpler) or Recharts (React-native)

```bash
npm install chart.js react-chartjs-2
# OR
npm install recharts
```

**Component Structure:**
```typescript
// components/StatsDashboard.tsx
import { Bar, Pie } from 'react-chartjs-2';

export const StatsDashboard = () => {
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Process sessions data for charts
  // Render charts
};
```

#### Definition of Done
- [ ] Charts display correctly
- [ ] Data updates when sessions change
- [ ] View toggle works (daily/weekly/monthly)
- [ ] Charts are responsive
- [ ] Professional styling

---

### Issue #8: Dark Mode Theme System (2 pts)

**Priority:** High
**Labels:** `feature`, `ui/ux`, `theming`

#### Description
Implement dark mode with theme toggle, CSS variables, and persistent preference storage.

#### User Story
```
As a user
I want to switch between light and dark themes
So that I can use the app comfortably in any lighting
```

#### Acceptance Criteria
- [ ] Create ThemeContext and ThemeProvider
- [ ] Add theme toggle button (sun/moon icon)
- [ ] Define CSS variables for colors
- [ ] Update all components to use theme variables
- [ ] Persist theme preference in localStorage
- [ ] Smooth transitions between themes
- [ ] Good contrast in both modes (WCAG compliant)

#### Technical Implementation

**Theme Context:**
```typescript
// contexts/ThemeContext.tsx
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load from localStorage
  // Toggle function
  // Save to localStorage
};
```

**CSS Variables (App.css):**
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --card-bg: #f9f9f9;
}

[data-theme='dark'] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --card-bg: #2a2a2a;
}
```

#### Definition of Done
- [ ] Theme toggle works
- [ ] All components support both themes
- [ ] Preference persists
- [ ] Smooth transitions
- [ ] Accessible contrast

---

### Issue #9: Settings Panel (2 pts)

**Priority:** Medium
**Labels:** `feature`, `ui/ux`

#### Description
Create settings panel for customizing timer durations, audio preferences, and app behavior.

#### Acceptance Criteria
- [ ] Settings modal/panel accessible from navigation
- [ ] Customize work duration (5-60 minutes)
- [ ] Customize break duration (1-30 minutes)
- [ ] Toggle sound effects on/off
- [ ] Clear all data option (with confirmation)
- [ ] Reset to defaults button
- [ ] Settings persist in localStorage

#### Definition of Done
- [ ] Settings panel accessible
- [ ] All settings work correctly
- [ ] Settings persist across sessions
- [ ] Clear data confirmation works

---

### Issue #10: Sound Effects & Audio (2 pts)

**Priority:** Medium
**Labels:** `feature`, `audio`

#### Description
Add audio feedback for session completions and optional tick sounds.

#### Acceptance Criteria
- [ ] Completion sound when work session ends
- [ ] Different sound for break completion
- [ ] Optional tick sound (enable/disable in settings)
- [ ] Volume control
- [ ] Audio files included or use Web Audio API

#### Definition of Done
- [ ] Sounds play on completion
- [ ] Volume control works
- [ ] Can disable in settings
- [ ] No audio errors

---

### Issue #11: Browser Notifications (1 pt)

**Priority:** Low
**Labels:** `feature`, `notifications`

#### Description
Add browser notification support for session completions when tab is not active.

#### Acceptance Criteria
- [ ] Request notification permission on first use
- [ ] Send notification when session completes
- [ ] Custom notification title and message
- [ ] Works when tab not focused
- [ ] Graceful fallback if permission denied

#### Definition of Done
- [ ] Notifications work
- [ ] Permission handled correctly
- [ ] Fallback to toast only if denied

---

## 📊 Sprint 02 Metrics

**Total Story Points:** 13
**Estimated Completion:** 1-2 weeks

**Breakdown:**
- Refactoring: 3 pts (23%)
- Features: 10 pts (77%)

**Priority:**
- High: 8 pts (62%)
- Medium: 4 pts (31%)
- Low: 1 pt (7%)

---

## 🎯 Success Criteria

Sprint 02 is complete when:
- [ ] All 6 issues implemented and tested
- [ ] Clean CSS Modules architecture
- [ ] Dark mode fully functional
- [ ] Charts displaying correctly
- [ ] All features working together
- [ ] No regressions from Sprint 01
- [ ] Code committed with professional messages

---

## 📚 Learning Outcomes

By completing Sprint 02, you'll gain experience with:

✅ **Architecture & Refactoring**
- CSS Modules organization
- Large-scale code refactoring
- Maintaining backward compatibility

✅ **Data Visualization**
- Chart.js or Recharts library
- Processing data for visualization
- Responsive chart design

✅ **Theming Systems**
- CSS variables
- Context API for theme state
- System preference detection

✅ **Web APIs**
- Web Audio API
- Notifications API
- LocalStorage for settings

✅ **Advanced React Patterns**
- Multiple contexts
- Custom hooks for features
- Component composition

---

## 🚀 Implementation Strategy

### Week 1: Foundation
**Days 1-3:** Issue #6 (CSS Modules)
- Refactor one component at a time
- Test after each component
- Keep working

**Days 4-5:** Issue #8 (Dark Mode)
- Works well with CSS Modules done
- High visual impact

### Week 2: Features
**Days 6-8:** Issue #7 (Statistics)
- Most complex feature
- High portfolio value

**Days 9-10:** Issue #9 (Settings)
- Ties everything together

**Days 11-12:** Issue #10 & #11
- Polish features
- Quick wins

---

## 💡 Pro Tips

1. **Test after each refactor** - Don't wait until all components are done
2. **Commit often** - Each component refactor = one commit
3. **Take screenshots** - Before/after for portfolio
4. **Ask for help** - CSS Modules can be tricky at first
5. **Enjoy the process** - You're building something impressive!

---

**Ready to start Issue #6?** Let's refactor to CSS Modules! 🎨
