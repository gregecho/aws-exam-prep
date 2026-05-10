# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

No test suite is configured.

## Architecture

Next.js 16 App Router with TypeScript. All routes under `src/app/`. Server components fetch data directly; client components (`'use client'`) handle interactivity.

**Auth — Clerk v7**
- `src/proxy.ts` is the Next.js middleware (renamed from `middleware.ts` in Next 16). It protects all routes except `/`, `/sign-in`, and `/sign-up`.
- `SignedIn`/`SignedOut` components were removed in Clerk v7 — use `useUser()` in client components, `auth()` from `@clerk/nextjs/server` in server components/API routes.

**Database — Supabase (PostgreSQL)**
- All API routes use the service role key (bypasses RLS). Ownership is enforced in route handlers by checking the Clerk `userId`.
- Client is created in `src/lib/supabase/server.ts`.
- Schema and seed SQL are in `supabase/schema.sql` and `supabase/seed.sql` — run in that order in the Supabase SQL editor.

**Question data model**
- `options_json`: JSONB array `[{"key":"A","text":"..."},...]`
- `correct`: comma-separated sorted keys, e.g. `'A'` or `'A,C'`
- `explanations_json`: JSONB map `{"A":"...","B":"..."}` — answer analysis text per option key
- `question_type`: `'single'` or `'multiple'`
- `question_number`: stable integer (1-N by insertion order), used for display (Q1, Q42, etc.)
- Answer comparison always goes through `normalizeAnswer`/`isAnswerCorrect` in `src/lib/answers.ts` (splits, trims, sorts, rejoins).

**Key components**
- `QuestionCard` — central question UI. `layout="fullscreen"` for practice mode (top bar + fixed bottom bar); `layout="card"` for exam mode (plain card, no bars). Optional `note`/`onNoteChange` props enable the notes textarea in fullscreen mode.
- `OptionButton` — stateless, four visual states: default / selected / correct / incorrect. `multiSelect` prop switches indicator from circle to rounded square.
- `ExplanationPanel` — shown after reveal; renders per-option explanation text as labeled prose (A. text, B. text…). Correct/selected keys are color-coded; others are muted.

**Routing**
- `/practice` — async server component; fetches bank counts per domain and displays them alongside domain weight %.
- `/practice/[domain]` — `PracticeClient`, two-phase: (1) question list browser with filter tabs (All / Not tried / Correct / Partial / Wrong / Bookmarked); (2) fullscreen practice loop starting from the clicked row. Clicking the last question's Next returns to the browser.
- `/exam/new` — creates session, stores question IDs in `sessionStorage`, redirects to `/exam/[sessionId]`
- `/exam/[sessionId]` — `ExamClient`, timed exam with sidebar navigator
- `/exam/results/[sessionId]` — server-rendered score + domain breakdown

**Stats**
- Every practice answer is written to `user_progress`.
- `/api/question-stats` aggregates `times_practiced`, `times_correct`, and `accuracy` on demand (no materialized view).
- `DomainStats` type includes `bankCount` (total questions in bank for domain) and `practicedCount` (unique questions attempted). Dashboard and `/api/progress` both compute these.
- Row status in the practice browser: gray = not tried, green = all correct, teal = partial, red = all wrong.

**Notes**
- Users can add per-question notes during practice (auto-saved on blur).
- Stored in `user_notes` table; fetched via `/api/notes` (GET/POST/DELETE).
- Note indicator (✎) shown in the practice browser list for questions with notes.

**Exam**
- `EXAM_QUESTION_COUNT = 65` (defined in `src/constants/domains.ts`).
- `/api/exam/start` fetches all question IDs and shuffles in JS — no limit bias.
- `/api/questions` supports `id=eq.<uuid>` params (sent by ExamClient) via `.in('id', ids)` filter.

**Subscription tiers**
- `src/lib/subscription.ts` — `getSubscriptionStatus(userId, supabase)` returns a `SubscriptionStatus` discriminated union: `{ access: 'trial'; daysLeft }`, `{ access: 'paid'; examsToday }`, or `{ access: 'expired' }`.
- Row is created lazily on first call (no signup webhook needed). Free tier = 3-day trial from `trial_started_at`.
- Enforcement: `/practice` and `/practice/[domain]` show an upgrade prompt if expired. `/exam` shows a locked state if not paid. `/api/exam/start` returns 403 if not paid, 429 if daily limit reached (`MAX_EXAMS_PER_DAY = 3`).
- `/upgrade` — pricing page with mock upgrade buttons that call `/api/admin/subscription`. Remove or protect this route before going to production.
- `/api/admin/subscription` — mock admin API for testing tier states (upgrade/downgrade/expire_trial/reset). Acts on the currently authenticated user.

## Styling

Tailwind CSS v4, forced dark theme. Core CSS variables:

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0f0f1a` | Page background |
| `--bg-card` | `#1a1a2e` | Cards, navbar, bars |
| `--bg-option` | `#16213e` | Option buttons (default) |
| `--accent-teal` | `#0ea5e9` | Primary accent, progress bar |
| `--accent-green` | `#22c55e` | Correct answers, Next button |
| `--accent-red` | `#ef4444` | Incorrect answers |

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
