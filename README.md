# AWS SAA-C03 Exam Prep

A web app for practicing AWS Solutions Architect Associate (SAA-C03) exam questions. Supports practice mode with immediate feedback, timed exam simulation, progress tracking by domain, and bookmarks.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16.2.6 (App Router) | TypeScript, server components + client components |
| Styling | Tailwind CSS v4 | Utility-first, dark mode support |
| Auth | Clerk v7 | Sign up / sign in, route protection via `proxy.ts` |
| Database | Supabase (PostgreSQL) | Service role key used in all API routes |
| Deployment target | AWS | Amplify recommended; ECS/Fargate and SST/OpenNext are alternatives |

### Key architectural decisions

- **Clerk v7** — `SignedIn`/`SignedOut` components were removed; use the `useUser()` hook for conditional rendering in client components. Server-side auth uses `auth()` from `@clerk/nextjs/server`.
- **Supabase service role** — all API routes use the service role key (bypasses RLS). Ownership is enforced in route handlers by checking the Clerk `userId`.
- **Route protection** — `src/proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts`) protects all routes except `/`, `/sign-in`, and `/sign-up`.
- **Build flag** — on darwin/arm64, the native SWC binary may be corrupted. Build with `next build --webpack` or fix with `npm install @next/swc-darwin-arm64 --force`.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                      # ClerkProvider wrapper
│   ├── page.tsx                        # Landing page
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   ├── dashboard/page.tsx              # Stats overview
│   ├── practice/
│   │   ├── page.tsx                    # Domain selector
│   │   └── [domain]/page.tsx           # Practice session
│   ├── exam/
│   │   ├── page.tsx                    # Exam start screen
│   │   ├── new/page.tsx                # Creates session, redirects
│   │   ├── [sessionId]/page.tsx        # Active timed exam
│   │   └── results/[sessionId]/page.tsx
│   ├── bookmarks/page.tsx
│   └── api/
│       ├── questions/route.ts
│       ├── exam/start/route.ts
│       ├── exam/submit/route.ts
│       ├── progress/route.ts
│       └── bookmarks/route.ts
├── components/
│   ├── layout/Navbar.tsx
│   ├── questions/
│   │   ├── QuestionCard.tsx            # Handles practice + exam modes
│   │   ├── OptionButton.tsx
│   │   ├── ExplanationPanel.tsx
│   │   └── BookmarkButton.tsx
│   ├── exam/
│   │   ├── ExamTimer.tsx               # Countdown, turns red at 10 min
│   │   ├── QuestionNavigator.tsx       # Grid of question numbers
│   │   └── ExamResultsChart.tsx        # Domain breakdown
│   └── dashboard/
│       ├── StatsCard.tsx
│       └── DomainProgressBar.tsx
├── lib/supabase/server.ts              # Service role Supabase client
├── types/index.ts
├── constants/domains.ts                # Domain names, weights, exam config
└── proxy.ts                            # Clerk route protection
supabase/
├── schema.sql                          # Run first in Supabase SQL editor
└── seed.sql                            # 10 seed questions across all 4 domains
```

---

## Database Schema

Four tables: `questions`, `exam_sessions`, `user_progress`, `user_bookmarks`.

Run in order in the Supabase SQL editor:
1. `supabase/schema.sql`
2. `supabase/seed.sql`

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
npm run build -- --webpack
```

---

## Exam Details

| | |
|---|---|
| Questions | 65 |
| Time limit | 130 minutes |
| Passing score | 72% |
| Domains | Design Secure Architectures (30%), Design Resilient Architectures (26%), Design High-Performing Architectures (24%), Design Cost-Optimized Architectures (20%) |
