# Sprint 05: Sessions CRUD - Learning Tracker

**Duration:** 1-2 weeks
**Story Points:** 13 total
**Goal:** Build a full CRUD (Create, Read, Update, Delete) system for Pomodoro sessions, turning PomoDoroto into a real learning tracker where you can review, edit, and manage your focus sessions

**Depends on:** Sprint 04 (Auth + Supabase) must be completed first

---

## Why This Sprint Matters

Right now, sessions are fire-and-forget — the timer completes, a session is saved, and that's it. A **learning tracker** needs:
- **Review** past sessions to see what you studied
- **Add notes** to sessions for context
- **Edit** sessions (fix wrong tags, adjust times)
- **Delete** sessions (remove test/accidental ones)
- **Filter & search** to find specific study topics

This is also the most **portfolio-valuable** sprint — CRUD operations are the #1 thing employers test in interviews. If you can explain how you built a full CRUD with Supabase + React, you demonstrate real full-stack skills.

---

## Sprint Goals

1. **Sessions list view** - See all past sessions with details
2. **Session detail view** - View and edit a single session
3. **Session notes** - Add/edit notes during and after sessions
4. **Delete sessions** - With confirmation dialog
5. **Filter & sort** - By tag, date, duration
6. **Real-time sync** - Changes sync to Supabase immediately

---

## Sprint 05 Issues

### Issue #26: Sessions List View (3 pts)

**Priority:** Critical
**Labels:** `feature`, `ui`, `crud`

#### Description
Create a new view showing all past Pomodoro sessions in a scrollable list, with key info visible at a glance.

#### Files to Create

1. **`src/components/SessionsList.tsx`**
2. **`src/components/SessionsList.module.css`**
3. **`src/components/SessionCard.tsx`** — Individual session card
4. **`src/components/SessionCard.module.css`**

#### Session Card Design:
```
┌──────────────────────────────────────┐
│ 📚 Study          25:00    ✅ Done   │
│ Feb 8, 2026 · 3:45 PM               │
│ "Reviewed React hooks chapter..."    │
│                          [Edit] [🗑] │
└──────────────────────────────────────┘
```

Each card shows:
- Tag name with icon
- Duration (formatted MM:SS)
- Completion status
- Date and time (formatted)
- Note preview (truncated to 1 line)
- Edit and Delete action buttons

#### Data Fetching:
```typescript
// Fetch sessions from Supabase
const { data: sessions } = await supabase
  .from('sessions')
  .select('*')
  .order('timestamp', { ascending: false });
```

#### Acceptance Criteria
- [ ] List shows all sessions from Supabase
- [ ] Sessions sorted by most recent first
- [ ] Each card displays tag, duration, date, note preview
- [ ] Loading skeleton while fetching
- [ ] Empty state when no sessions exist
- [ ] Responsive on mobile (cards stack vertically)
- [ ] Pagination or infinite scroll for large datasets

#### Concepts to Learn
- Fetching data from Supabase
- List rendering with React keys
- Date formatting with `Intl.DateTimeFormat`
- Loading states and skeleton screens
- Empty state UX patterns

---

### Issue #27: Session Notes - During & After (3 pts)

**Priority:** Critical
**Labels:** `feature`, `ui`, `crud`

#### Description
Allow users to write notes during a Pomodoro session (while timer runs) and edit notes after the session is complete.

#### Part A: Notes During Session

1. **`src/components/SessionNote.tsx`** — Textarea below the timer
2. **`src/components/SessionNote.module.css`**

```
┌─────────────────────────┐
│       25:00              │  ← Timer
│    [▶] [↺] [⏹]          │
├─────────────────────────┤
│ 📝 Session Note         │
│ ┌─────────────────────┐ │
│ │ Learning about      │ │
│ │ React Context...    │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

- Textarea appears below timer controls
- Auto-saves to state as user types (debounced)
- Note is saved with the session when timer completes
- Placeholder: "What are you working on?"
- Character limit: 500 chars with counter

#### Part B: Edit Notes After Session

- Click "Edit" on a session card → opens edit modal
- Can modify the note text
- Save updates to Supabase
- Cancel discards changes

#### Files to Modify:
- `src/types/pomodoro.types.ts` — Add `note: string` to PomodoroSession
- `src/hooks/PomodoroContext.tsx` — Manage note state
- `src/components/Timer.tsx` — Include SessionNote component

#### Acceptance Criteria
- [ ] Textarea visible below timer
- [ ] Note saves with session on completion
- [ ] Note editable after session (from sessions list)
- [ ] Character counter (500 max)
- [ ] Auto-save with debounce (no data loss)
- [ ] Note persists in Supabase
- [ ] Placeholder text when empty

#### Concepts to Learn
- Debouncing input (performance optimization)
- Controlled textarea components
- `useCallback` + `setTimeout` for debounce
- Optimistic updates (show change immediately, sync later)
- Character counting UX

---

### Issue #28: Edit Session (2 pts)

**Priority:** High
**Labels:** `feature`, `crud`

#### Description
Allow users to edit existing sessions — change the tag, adjust duration, or modify notes.

#### Files to Create

1. **`src/components/EditSessionModal.tsx`**
2. **`src/components/EditSessionModal.module.css`**

#### Editable Fields:
- **Tag** — Dropdown of user's tags
- **Duration** — Number input (in minutes)
- **Note** — Textarea
- **Completed** — Toggle (mark incomplete sessions as complete)

#### NOT Editable:
- **Timestamp** — When it happened is a fact, not editable
- **User ID** — Security, never exposed

#### Supabase Update:
```typescript
const { error } = await supabase
  .from('sessions')
  .update({ tag, duration, note, completed })
  .eq('id', sessionId);
```

#### Acceptance Criteria
- [ ] Edit modal opens from session card
- [ ] Can change tag, duration, note, completed status
- [ ] Validation (duration > 0, tag not empty)
- [ ] Save updates Supabase
- [ ] Cancel discards changes
- [ ] Loading state on save button
- [ ] Success feedback (toast)
- [ ] Optimistic update (UI updates before server confirms)

#### Concepts to Learn
- Optimistic updates in React
- PATCH/UPDATE operations with Supabase
- Form pre-population (editing existing data)
- Modal state management patterns

---

### Issue #29: Delete Session with Confirmation (1 pt)

**Priority:** High
**Labels:** `feature`, `crud`

#### Description
Allow users to delete sessions with a confirmation dialog. Reuse the existing `ConfirmModal` component.

#### Files to Modify

1. **`src/components/SessionCard.tsx`** — Add delete button + confirmation
2. **`src/utils/translations.ts`** — Add delete session translations

#### Supabase Delete:
```typescript
const { error } = await supabase
  .from('sessions')
  .delete()
  .eq('id', sessionId);
```

#### Acceptance Criteria
- [ ] Delete button on each session card
- [ ] Confirmation dialog before deleting
- [ ] Session removed from UI immediately (optimistic)
- [ ] Session deleted from Supabase
- [ ] Error handling if delete fails (rollback UI)
- [ ] Translations for confirm message in 5 languages

#### Concepts to Learn
- DELETE operations with Supabase
- Optimistic deletes with rollback on error
- Reusing existing components (ConfirmModal)
- Defensive UX (confirmation for destructive actions)

---

### Issue #30: Filter & Sort Sessions (2 pts)

**Priority:** Medium
**Labels:** `feature`, `ui`, `ux`

#### Description
Add filter and sort controls to the sessions list so users can find specific study sessions.

#### Filter Options:
- **By tag** — Dropdown to filter by specific tag (or "All")
- **By date range** — Start/end date pickers
- **By completion** — All / Completed / Incomplete

#### Sort Options:
- Most recent first (default)
- Oldest first
- Longest duration first
- Shortest duration first

#### Files to Create

1. **`src/components/SessionFilters.tsx`**
2. **`src/components/SessionFilters.module.css`**

#### Supabase Query with Filters:
```typescript
let query = supabase
  .from('sessions')
  .select('*')
  .order(sortField, { ascending: sortDirection === 'asc' });

if (filterTag !== 'all') {
  query = query.eq('tag', filterTag);
}
if (startDate) {
  query = query.gte('timestamp', startDate);
}
if (endDate) {
  query = query.lte('timestamp', endDate);
}
```

#### Acceptance Criteria
- [ ] Filter by tag works
- [ ] Filter by date range works
- [ ] Sort by date/duration works
- [ ] Filters combine correctly (tag + date)
- [ ] "Clear filters" resets to default
- [ ] Filter state persists during session (not on reload)
- [ ] Shows result count ("12 sessions found")

#### Concepts to Learn
- Query builders (Supabase chainable API)
- Composable filters pattern
- URL search params for filter state (advanced)
- UX: showing active filters and result count

---

### Issue #31: Sessions View Navigation (1 pt)

**Priority:** Medium
**Labels:** `feature`, `navigation`

#### Description
Add a third tab to the bottom navigation for the Sessions list, or replace the current Stats tab with a combined Sessions + Stats view.

#### Options:
- **Option A:** Add third "Sessions" tab → Timer | Sessions | Stats
- **Option B:** Replace Stats with Sessions (move stats into Sessions view as summary)
- **Option C:** Sessions as a sub-view within Stats tab

#### Files to Modify
- `src/App.tsx` — Add new view/tab
- `src/App.css` — Adjust nav for 3 items (if Option A)
- `src/utils/translations.ts` — Add "Sessions" tab translations

#### Acceptance Criteria
- [ ] Sessions list accessible from navigation
- [ ] Smooth transition between views
- [ ] Active tab state correct
- [ ] Responsive on mobile

---

### Issue #32: Real-time Session Sync (1 pt)

**Priority:** Low (stretch goal)
**Labels:** `feature`, `real-time`, `supabase`

#### Description
Use Supabase real-time subscriptions so sessions update automatically if changed from another device/tab.

#### Implementation:
```typescript
// Subscribe to changes
const subscription = supabase
  .channel('sessions')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'sessions' },
    (payload) => {
      // Update local state based on change type
      if (payload.eventType === 'INSERT') { /* add to list */ }
      if (payload.eventType === 'UPDATE') { /* update in list */ }
      if (payload.eventType === 'DELETE') { /* remove from list */ }
    }
  )
  .subscribe();
```

#### Acceptance Criteria
- [ ] New sessions appear in list without refresh
- [ ] Edited sessions update in real-time
- [ ] Deleted sessions disappear in real-time
- [ ] Subscription cleaned up on unmount

#### Concepts to Learn
- WebSocket connections
- Supabase Realtime (built on Phoenix channels)
- Subscription cleanup (`useEffect` return function)
- Real-time data synchronization patterns

---

## Sprint 05 Metrics

**Total Story Points:** 13
**Estimated Completion:** 1-2 weeks (~20-28 hours)

| Priority | Issues | Points |
|----------|--------|--------|
| Critical | #26, #27 | 6 pts |
| High | #28, #29 | 3 pts |
| Medium | #30, #31 | 3 pts |
| Low | #32 | 1 pt |

---

## Implementation Order

### Week 1: Core CRUD
- **Day 1-2:** Issue #27 Part A — Session notes during timer (~3 hours)
- **Day 3-4:** Issue #26 — Sessions list view (~4 hours)
- **Day 5:** Issue #29 — Delete sessions (~1.5 hours)
- **Day 6:** Issue #28 — Edit sessions (~3 hours)

### Week 2: Polish & Features
- **Day 7:** Issue #27 Part B — Edit notes after session (~2 hours)
- **Day 8-9:** Issue #30 — Filters & sort (~3 hours)
- **Day 10:** Issue #31 — Navigation update (~1 hour)
- **Day 11:** Issue #32 — Real-time sync (stretch goal, ~2 hours)
- **Day 12:** Testing + bug fixes

---

## Success Criteria

Sprint 05 is complete when:
- [ ] Users can view all past sessions in a list
- [ ] Users can write notes during Pomodoro sessions
- [ ] Users can edit session details (tag, duration, note)
- [ ] Users can delete sessions with confirmation
- [ ] Sessions can be filtered by tag and date
- [ ] Sessions can be sorted by date or duration
- [ ] All data syncs with Supabase
- [ ] CRUD operations handle errors gracefully
- [ ] UI provides feedback for all actions (loading, success, error)

---

## Learning Outcomes

By completing Sprint 05, you'll gain experience with:

- **CRUD Operations:** The foundation of every web application
- **Supabase Queries:** Select, insert, update, delete with filters
- **Optimistic Updates:** Updating UI before server confirms
- **Debouncing:** Performance optimization for frequent inputs
- **List Management:** Rendering, filtering, sorting large datasets
- **Real-time Data:** WebSocket subscriptions (stretch goal)
- **Complex State:** Managing list + filters + modals together

---

## Interview Talking Points

After this sprint, you can confidently discuss:
- "I built a full CRUD system with Supabase, including optimistic updates for better UX"
- "Sessions support notes with debounced auto-save to prevent data loss"
- "I implemented composable filters — users can combine tag, date, and completion filters"
- "Delete operations use optimistic UI with rollback on error"
- "The app uses Supabase real-time subscriptions for cross-device sync"

---

## How This Serves Your Learning Goal

Once Sprint 05 is complete, PomoDoroto becomes a **real productivity tool**:

1. **Start a Pomodoro** → Write what you're studying in the note
2. **Complete the session** → Note is saved with duration and tag
3. **Review later** → Filter by "Study" tag, see total hours invested
4. **Track progress** → "This week I did 15 Pomodoro sessions on React, totaling 6.25 hours"
5. **Portfolio proof** → Show employers your consistent study habits with real data
