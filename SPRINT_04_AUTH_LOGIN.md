# Sprint 04: Authentication with Supabase

**Duration:** 1-2 weeks
**Story Points:** 13 total
**Goal:** Add user authentication so sessions persist in the cloud, enabling cross-device access and setting the foundation for Sprint 05 (Sessions CRUD)

---

## Why Supabase?

| Criteria | Supabase | Firebase | Clerk + DB |
|----------|----------|----------|------------|
| Database | PostgreSQL (industry standard) | Firestore (NoSQL) | Separate service needed |
| Auth | Built-in (email, OAuth) | Built-in | Beautiful UI, extra cost |
| Pricing | Free tier (50K MAU) | Free tier (limited) | Free up to 10K MAU |
| Next.js | First-class support | Good | Good |
| Career Value | High (SQL skills) | Medium | Medium |
| Open Source | Yes | No | No |
| Learning ROI | PostgreSQL + SQL + RLS | NoSQL patterns | Just auth |

**Decision:** Supabase gives you the most career value per hour invested. You learn PostgreSQL (used by 70%+ of companies), Row Level Security (advanced topic for interviews), and a modern BaaS workflow.

---

## Sprint Goals

1. **Set up Supabase project** - Create project, configure auth
2. **Implement auth flow** - Login, signup, logout, password reset
3. **Create auth UI** - Login/signup pages with form validation
4. **Protect routes** - Only authenticated users access the app
5. **Migrate local data** - Move localStorage sessions to Supabase on first login

---

## Sprint 04 Issues

### Issue #19: Supabase Project Setup (1 pt)

**Priority:** Critical (blocks everything)
**Labels:** `setup`, `database`, `infrastructure`

#### Description
Create Supabase project, install client library, and configure environment variables.

#### Steps

1. **Create Supabase account** at [supabase.com](https://supabase.com)
2. **Create new project** (name: `pomodoroto`)
3. **Install Supabase client:**
   ```bash
   npm install @supabase/supabase-js
   ```
4. **Create Supabase client file:**
   ```typescript
   // src/lib/supabase.ts
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```
5. **Create `.env.local`:**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
6. **Add `.env.local` to `.gitignore`** (NEVER commit secrets)

#### Database Schema (SQL):
```sql
-- Users table is handled by Supabase Auth automatically

-- Sessions table
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL DEFAULT 'General',
  duration INTEGER NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT true,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own sessions
CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own sessions
CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own sessions
CREATE POLICY "Users can delete own sessions"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Tags table
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, name)
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tags"
  ON tags FOR ALL
  USING (auth.uid() = user_id);

-- User settings table
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  work_duration INTEGER NOT NULL DEFAULT 1500,
  break_duration INTEGER NOT NULL DEFAULT 300,
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  theme TEXT NOT NULL DEFAULT 'light',
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id);
```

#### Acceptance Criteria
- [ ] Supabase project created
- [ ] Client library installed and configured
- [ ] Environment variables set up (NOT committed to git)
- [ ] Database tables created with RLS policies
- [ ] `.env.local` in `.gitignore`
- [ ] Connection test passes

#### Concepts to Learn
- Environment variables in Vite (`VITE_` prefix requirement)
- PostgreSQL basics (tables, foreign keys, UUIDs)
- Row Level Security (RLS) — security at the database level
- Why you NEVER commit API keys to git

---

### Issue #20: Auth Context & Supabase Auth (3 pts)

**Priority:** Critical
**Labels:** `feature`, `auth`, `context`

#### Description
Create an AuthContext that wraps the app and manages authentication state using Supabase Auth.

#### Files to Create

1. **`src/contexts/AuthContext.tsx`**
   ```typescript
   interface AuthContextType {
     user: User | null;
     loading: boolean;
     signUp: (email: string, password: string) => Promise<void>;
     signIn: (email: string, password: string) => Promise<void>;
     signOut: () => Promise<void>;
     resetPassword: (email: string) => Promise<void>;
   }
   ```

2. **`src/types/auth.types.ts`**
   ```typescript
   interface AuthError {
     message: string;
     status?: number;
   }
   ```

#### Key Implementation Details
- Listen to `onAuthStateChange` for session changes
- Handle loading state while checking initial session
- Store session in memory (Supabase handles persistence)
- Error handling with user-friendly messages

#### Acceptance Criteria
- [ ] AuthContext provides user state to entire app
- [ ] `signUp` creates account with email/password
- [ ] `signIn` authenticates existing user
- [ ] `signOut` clears session
- [ ] `resetPassword` sends reset email
- [ ] Loading state while checking auth
- [ ] Error messages are user-friendly

#### Concepts to Learn
- Auth state management with Context API
- Supabase `onAuthStateChange` listener
- JWT tokens and sessions (how they work under the hood)
- Async operations in React Context

---

### Issue #21: Login & Signup Pages (3 pts)

**Priority:** High
**Labels:** `feature`, `ui`, `auth`

#### Description
Create login and signup pages with form validation, error handling, and professional styling.

#### Files to Create

1. **`src/components/LoginPage.tsx`**
   - Email input with validation
   - Password input with show/hide toggle
   - "Sign In" button with loading state
   - "Forgot password?" link
   - "Don't have an account? Sign up" link
   - Error message display

2. **`src/components/SignupPage.tsx`**
   - Email input with validation
   - Password input with strength indicator
   - Confirm password input
   - "Create Account" button with loading state
   - "Already have an account? Sign in" link
   - Error message display

3. **`src/components/LoginPage.module.css`**
4. **`src/components/SignupPage.module.css`**

#### Form Validation Rules
- Email: Valid format (regex)
- Password: Minimum 6 characters
- Confirm Password: Must match password
- All fields required
- Show inline errors (not just alerts)

#### Acceptance Criteria
- [ ] Login form works with email/password
- [ ] Signup form creates new account
- [ ] Form validation with inline error messages
- [ ] Loading state on submit button
- [ ] "Forgot password" sends reset email
- [ ] Toggle between login/signup
- [ ] Responsive on mobile
- [ ] Matches app's existing design language

#### Concepts to Learn
- Controlled forms in React
- Form validation patterns
- Loading states and UX feedback
- Password security best practices
- Error handling in forms

---

### Issue #22: Route Protection & Auth Flow (2 pts)

**Priority:** High
**Labels:** `feature`, `auth`, `routing`

#### Description
Protect the app so only authenticated users can access the timer and stats. Unauthenticated users see the login page.

#### Files to Modify

1. **`src/App.tsx`**
   - Check auth state from AuthContext
   - If not logged in → show LoginPage
   - If logged in → show normal app
   - Add logout button to header

2. **`src/main.tsx`**
   - Wrap app with AuthProvider

#### Flow:
```
User opens app
  → AuthContext checks session (loading spinner)
  → No session? → Show LoginPage
  → Has session? → Show App (timer, tags, stats)
  → User clicks logout → Back to LoginPage
```

#### Acceptance Criteria
- [ ] Unauthenticated users see login page only
- [ ] Authenticated users see the full app
- [ ] Loading spinner while checking auth state
- [ ] Logout button in header
- [ ] Session persists on page refresh
- [ ] Clean transition between auth states

#### Concepts to Learn
- Conditional rendering based on auth state
- Protected routes pattern (even without a router)
- Auth flow UX best practices
- Session persistence with Supabase

---

### Issue #23: Migrate localStorage Data to Supabase (2 pts)

**Priority:** Medium
**Labels:** `feature`, `migration`, `data`

#### Description
When a user logs in for the first time, migrate their existing localStorage data (sessions, tags, settings) to Supabase. This ensures no data loss for existing users.

#### Migration Logic:
```
User logs in
  → Check if user has data in Supabase
  → If no data in Supabase AND data in localStorage:
      → Upload localStorage sessions to Supabase
      → Upload localStorage tags to Supabase
      → Upload localStorage settings to Supabase
      → Clear localStorage (or mark as migrated)
  → If data exists in Supabase:
      → Use Supabase data (ignore localStorage)
```

#### Files to Create/Modify

1. **`src/utils/migration.ts`** — Migration logic
2. **`src/hooks/PomodoroContext.tsx`** — Read/write to Supabase instead of localStorage

#### Acceptance Criteria
- [ ] Existing localStorage data migrates on first login
- [ ] No duplicate data after migration
- [ ] Migration only runs once per user
- [ ] Handles empty localStorage gracefully
- [ ] Error handling if migration fails

#### Concepts to Learn
- Data migration strategies
- Idempotent operations (safe to run multiple times)
- Batch inserts in Supabase
- Progressive enhancement (app works offline too)

---

### Issue #24: Auth Translations (1 pt)

**Priority:** Medium
**Labels:** `i18n`, `translations`

#### Description
Add authentication-related translations for all 5 supported languages.

#### Keys to Add:
```typescript
// New translation keys
signIn, signUp, email, password, confirmPassword,
forgotPassword, resetPassword, noAccount, hasAccount,
loginError, signupError, passwordMismatch, passwordTooShort,
emailInvalid, logout, resetEmailSent
```

#### Acceptance Criteria
- [ ] All auth strings translated in 5 languages (EN, ES, FR, EO, RU)
- [ ] Login/signup pages use translations
- [ ] Error messages are translated

---

### Issue #25: OAuth - Google Sign In (1 pt)

**Priority:** Low (stretch goal)
**Labels:** `feature`, `auth`, `oauth`

#### Description
Add "Sign in with Google" button as an alternative to email/password. This is a professional touch that users expect.

#### Setup Required:
1. Enable Google provider in Supabase dashboard
2. Configure OAuth credentials in Google Cloud Console
3. Set redirect URL in Supabase

#### Acceptance Criteria
- [ ] Google sign-in button on login page
- [ ] OAuth flow completes successfully
- [ ] User data syncs after Google login
- [ ] Works on mobile browsers

#### Concepts to Learn
- OAuth 2.0 flow (how it works)
- Third-party authentication
- Social login UX patterns

---

## Sprint 04 Metrics

**Total Story Points:** 13
**Estimated Completion:** 1-2 weeks (~20-28 hours)

| Priority | Issues | Points |
|----------|--------|--------|
| Critical | #19, #20 | 4 pts |
| High | #21, #22 | 5 pts |
| Medium | #23, #24 | 3 pts |
| Low | #25 | 1 pt |

---

## Implementation Order

### Week 1: Foundation
- **Day 1:** Issue #19 — Supabase setup + schema (~2 hours)
- **Day 2-3:** Issue #20 — AuthContext (~4 hours)
- **Day 4-5:** Issue #21 — Login/Signup pages (~4 hours)
- **Day 6:** Issue #22 — Route protection (~2 hours)

### Week 2: Integration
- **Day 7-8:** Issue #23 — Data migration (~3 hours)
- **Day 9:** Issue #24 — Translations (~1 hour)
- **Day 10:** Issue #25 — Google OAuth (stretch goal, ~2 hours)
- **Day 11-12:** Testing + bug fixes

---

## Success Criteria

Sprint 04 is complete when:
- [ ] Users can create accounts and log in
- [ ] App is protected — only authenticated users access it
- [ ] Existing localStorage data migrates to Supabase
- [ ] Auth state persists across page refreshes
- [ ] Auth flow is smooth and professional
- [ ] All auth strings translated in 5 languages
- [ ] No security vulnerabilities (keys not in git, RLS enabled)

---

## Learning Outcomes

By completing Sprint 04, you'll gain experience with:

- **Authentication:** Email/password auth, OAuth, session management
- **PostgreSQL:** Schema design, foreign keys, constraints
- **Row Level Security:** Database-level access control
- **Environment Variables:** Secrets management in Vite
- **Data Migration:** Moving from localStorage to cloud database
- **Professional Auth UX:** Loading states, error handling, form validation

---

## Interview Talking Points

After this sprint, you can confidently discuss:
- "I implemented authentication with Supabase, using Row Level Security so each user can only access their own data"
- "I designed the PostgreSQL schema with proper foreign keys and constraints"
- "I built a migration system that moves existing local data to the cloud on first login"
- "The auth flow includes email validation, password strength checks, and proper error handling"
