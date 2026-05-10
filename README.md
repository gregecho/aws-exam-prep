# AWS SAA-C03 Exam Prep

A web app for practicing AWS Solutions Architect Associate (SAA-C03) exam questions. Supports practice mode with immediate feedback, timed exam simulation, progress tracking by domain, bookmarks, per-question accuracy stats, multiple-answer questions, and per-option explanations.

---

## Tech Stack

| Layer             | Technology                  | Notes                                                              |
| ----------------- | --------------------------- | ------------------------------------------------------------------ |
| Framework         | Next.js 16.2.6 (App Router) | TypeScript, server components + client components                  |
| Styling           | Tailwind CSS v4             | Dark theme (forced), mobile-first                                  |
| Auth              | Clerk v7                    | Sign up / sign in, route protection via `proxy.ts`                 |
| Database          | Supabase (PostgreSQL)       | Service role key used in all API routes                            |
| Deployment target | AWS                         | Amplify recommended; ECS/Fargate and SST/OpenNext are alternatives |

### Key architectural decisions

- **Clerk v7** — `SignedIn`/`SignedOut` components were removed; use the `useUser()` hook for conditional rendering in client components. Server-side auth uses `auth()` from `@clerk/nextjs/server`.
- **Supabase service role** — all API routes use the service role key (bypasses RLS). Ownership is enforced in route handlers by checking the Clerk `userId`.
- **Route protection** — `src/proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts`) protects all routes except `/`, `/sign-in`, and `/sign-up`.
- **JSONB options** — questions store options and per-option explanations as JSONB columns (`options_json`, `explanations_json`), supporting any number of options (A–F+).
- **Multi-answer questions** — `question_type` is `'single'` or `'multiple'`. Correct answers are comma-separated strings (e.g. `'A,C'`). The `isAnswerCorrect` helper in `src/lib/answers.ts` normalizes and compares answers.
- **Per-question stats** — every practice answer is saved to `user_progress`. The `/api/question-stats` route aggregates `times_practiced`, `times_correct`, and `accuracy` on demand.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                      # ClerkProvider wrapper, dark body
│   ├── page.tsx                        # Landing page
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   ├── dashboard/page.tsx              # Stats overview
│   ├── practice/
│   │   ├── page.tsx                    # Domain selector
│   │   └── [domain]/page.tsx           # Practice session (fullscreen dark UI)
│   ├── exam/
│   │   ├── page.tsx                    # Exam start screen
│   │   ├── new/page.tsx                # Creates session, redirects
│   │   ├── [sessionId]/page.tsx        # Active timed exam
│   │   └── results/[sessionId]/page.tsx
│   ├── bookmarks/page.tsx
│   └── api/
│       ├── questions/route.ts          # Maps options_json/explanations_json to typed fields
│       ├── practice/answer/route.ts    # Saves answer, returns is_correct
│       ├── question-stats/route.ts     # Aggregates per-question stats
│       ├── exam/start/route.ts
│       ├── exam/submit/route.ts
│       ├── progress/route.ts
│       └── bookmarks/route.ts
├── components/
│   ├── layout/Navbar.tsx               # Dark nav with Clerk UserButton
│   ├── questions/
│   │   ├── QuestionCard.tsx            # Fullscreen (practice) + card (exam) layouts
│   │   ├── OptionButton.tsx            # Dark style, multiSelect support
│   │   ├── ExplanationPanel.tsx        # Per-option explanations
│   │   └── BookmarkButton.tsx
│   ├── exam/
│   │   ├── ExamTimer.tsx
│   │   ├── QuestionNavigator.tsx
│   │   └── ExamResultsChart.tsx
│   └── dashboard/
│       ├── StatsCard.tsx
│       └── DomainProgressBar.tsx
├── lib/
│   ├── supabase/server.ts              # Service role Supabase client
│   └── answers.ts                      # normalizeAnswer, isAnswerCorrect, getCorrectKeys
├── types/index.ts
├── constants/domains.ts
└── proxy.ts                            # Clerk route protection
supabase/
├── schema.sql                          # Run first in Supabase SQL editor
└── seed.sql                            # 20 questions across all 4 domains (single + multi-answer)
```

---

## Database Schema

Five tables: `questions`, `exam_sessions`, `user_progress`, `user_bookmarks`, `user_notes`, `user_subscriptions`.

Key columns on `questions`:

- `question_type` — `'single'` or `'multiple'`
- `options_json` — JSONB array: `[{"key":"A","text":"..."},...]`
- `correct` — comma-separated keys: `'A'` or `'A,C'`
- `explanations_json` — JSONB map: `{"A":"...","B":"..."}`
- `question_number` — stable integer (1-N by insertion order), used for display

Run in order in the Supabase SQL editor:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

### Migration (existing DB)

If upgrading an existing database, run these statements:

```sql
ALTER TABLE questions DROP CONSTRAINT questions_correct_check;
ALTER TABLE questions ALTER COLUMN correct TYPE text;
ALTER TABLE questions ADD CONSTRAINT questions_correct_check CHECK (correct ~ '^[A-Z](,[A-Z])*$');
ALTER TABLE questions ADD COLUMN question_type text NOT NULL DEFAULT 'single' CHECK (question_type IN ('single', 'multiple'));
ALTER TABLE questions ADD COLUMN options_json jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE questions ADD COLUMN explanations_json jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE user_progress DROP CONSTRAINT user_progress_selected_check;
ALTER TABLE user_progress ALTER COLUMN selected TYPE text;
ALTER TABLE user_progress ADD CONSTRAINT user_progress_selected_check CHECK (selected ~ '^[A-Z](,[A-Z])*$');
```

---

## Environment Variables

Create `.env.local` in the project root:

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

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
npm run build
```

---

## Exam Details

|               |                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Questions     | 65                                                                                                                                                             |
| Time limit    | 130 minutes                                                                                                                                                    |
| Passing score | 72%                                                                                                                                                            |
| Domains       | Design Secure Architectures (30%), Design Resilient Architectures (26%), Design High-Performing Architectures (24%), Design Cost-Optimized Architectures (20%) |

---

## Subscription Tiers

| Feature | Free (3-day trial) | Paid |
|---|---|---|
| Practice mode | ✓ | ✓ |
| Progress tracking | ✓ | ✓ |
| Bookmarks & notes | ✓ | ✓ |
| Exam simulation | ✗ | ✓ (max 3/day) |

Subscription state is stored in the `user_subscriptions` table. A row is created lazily on first access — no signup webhook needed.

**Testing tiers** — visit `/upgrade` to toggle tier states without a real payment provider:
- Upgrade (1 month / 3 months / 1 year)
- Expire trial (simulates 3-day trial elapsed)
- Downgrade to free
- Reset (fresh trial)

When wiring up a real payment provider, update `user_subscriptions.tier` and `paid_until` from the webhook, then remove or protect `/api/admin/subscription` and the mock buttons on `/upgrade`.

---

## TODO

- [ ] Add authentication improvements (social login, email verification)
- [ ] Deploy to AWS (Amplify or ECS/Fargate via SST/OpenNext)
- [x] Add more questions (target: 200+ across all domains)
- [ ] Add question difficulty levels (easy / medium / hard)
- [ ] Add spaced repetition algorithm (prioritize weak questions)
- [ ] Wire up AI assistant button to Claude API
- [ ] Add exam analytics (time per question, domain weak spots)
- [ ] Add question search and filtering
- [x] Implement subscription tiers (free trial + paid)
- [ ] Wire up real payment provider (Stripe recommended)
