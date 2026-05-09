# Design Document — AWS SAA-C03 Exam Prep

## Overview

A mobile-first, dark-themed web app for AWS Solutions Architect Associate (SAA-C03) exam preparation. Built with Next.js 16 App Router, Clerk auth, and Supabase.

---

## UI Design

### Theme

Forced dark theme across the entire app. No light/dark toggle.

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0f0f1a` | Page background |
| `--bg-card` | `#1a1a2e` | Cards, navbar, top/bottom bars |
| `--bg-option` | `#16213e` | Option buttons (default) |
| `--accent-teal` | `#0ea5e9` | Primary accent, progress bar, badges |
| `--accent-green` | `#22c55e` | Correct answers, Next button |
| `--accent-red` | `#ef4444` | Incorrect answers |

### Practice Mode Layout (fullscreen)

```
┌─────────────────────────────────┐
│ TOP BAR (bg-card)               │
│  Practice Mode   ✓ 3   5 / 20   │
│  ████████████░░░░░░░░░░░░░░░░   │  ← sky-500 progress bar
├─────────────────────────────────┤
│ SCROLLABLE CONTENT (bg-primary) │
│                                 │
│  [Domain badge] [Single/Multi]  │
│  [accuracy badge]          [⋯]  │
│                                 │
│  Question text...               │
│                                 │
│  ┌─────────────────────────┐    │
│  │ ○A  Option text         │    │  ← default: bg-option, border-[#2a2a4a]
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ ✓B  Option text         │    │  ← correct: border-green-500, bg-[#0f2a1a]
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ ✕C  Option text         │    │  ← incorrect: border-red-500, bg-[#2a0f0f]
│  └─────────────────────────┘    │
│                                 │
│  [ExplanationPanel]             │
│                                 │
├─────────────────────────────────┤
│ BOTTOM BAR (bg-card, fixed)     │
│  [+ Ask AI]        [Next →]     │
└─────────────────────────────────┘
```

### Exam Mode Layout (card)

Standard card layout inside the existing ExamClient sidebar layout. `QuestionCard` renders with `layout="card"` — no top/bottom bars, no fullscreen wrapper.

---

## Question Data Model

### `questions` table

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `domain` | exam_domain enum | One of 4 SAA-C03 domains |
| `question` | text | Question stem |
| `question_type` | text | `'single'` or `'multiple'` |
| `options_json` | jsonb | `[{"key":"A","text":"..."},...]` — supports A–F+ |
| `correct` | text | `'A'` or `'A,C'` (comma-separated, sorted) |
| `explanations_json` | jsonb | `{"A":"...","B":"..."}` — per-option |

### Answer normalization

All answers are normalized before comparison: split by comma, trim, sort, rejoin. Implemented in `src/lib/answers.ts`.

```typescript
normalizeAnswer('C,A') === normalizeAnswer('A,C') // true
isAnswerCorrect('A,C', 'C,A')                     // true
```

---

## Component Architecture

### `QuestionCard`

Central component. Accepts `layout` prop:

- `'fullscreen'` — practice mode. Renders full-screen dark layout with top bar (score, progress), scrollable content, and fixed bottom bar (Ask AI, Next).
- `'card'` — exam mode. Renders as a plain dark card, no top/bottom bars.

Multi-answer flow:
1. User clicks options (checkboxes)
2. "Check Answer" button appears after ≥1 selection
3. On check: `setRevealed(true)`, call `onAnswer` with normalized comma-separated selection
4. `ExplanationPanel` renders per-option rows

Single-answer flow:
1. User clicks one option
2. Auto-reveals immediately
3. `onAnswer` called with single key

### `OptionButton`

Stateless. Four visual states:

| State | Border | Background | Indicator |
|---|---|---|---|
| Default | `#2a2a4a` | `#16213e` | Letter circle |
| Selected | `sky-400` | `#1e2d4a` | Letter circle (filled) |
| Correct | `green-500` | `#0f2a1a` | ✓ circle |
| Incorrect | `red-500` | `#2a0f0f` | ✕ circle |

`multiSelect` prop changes the indicator from a circle to a rounded square (checkbox style).

### `ExplanationPanel`

Renders after answer reveal. Shows:
1. Verdict line: "✓ Correct!" or "✗ Incorrect — correct: A, C"
2. Per-option rows for each key in `(selectedKeys ∪ correctKeys)`:
   - Colored letter badge (green = correct key, red = wrong key)
   - "Correct" / "Incorrect" / "Also incorrect" label
   - Explanation text from `explanations_json`

---

## Stats Tracking

Every practice answer is saved to `user_progress`:

```sql
insert into user_progress (user_id, question_id, is_correct, selected) values (...)
```

`/api/question-stats` aggregates on demand:

```
times_practiced = count(rows for question)
times_correct   = count(rows where is_correct = true)
accuracy        = round(times_correct / times_practiced * 100)
```

Stats are displayed on each question card as badges:
- Grey: "Practiced N×"
- Green (≥70%): "N% accuracy"
- Yellow (40–69%): "N% accuracy"
- Red (<40%): "N% accuracy"

---

## Routing

| Path | Type | Notes |
|---|---|---|
| `/` | Client | Landing page |
| `/dashboard` | Server | Aggregated stats |
| `/practice` | Server | Domain picker |
| `/practice/[domain]` | Client | `PracticeClient` — fullscreen question UI |
| `/exam` | Static | Info page |
| `/exam/new` | Client | Creates session, stores IDs in sessionStorage, redirects |
| `/exam/[sessionId]` | Client | `ExamClient` — timed exam with sidebar navigator |
| `/exam/results/[sessionId]` | Server | Score + domain breakdown |
| `/bookmarks` | Server | Bookmarked questions list |

---

## Future Work

- Wire "Ask AI" button to Claude API (question context + user selection)
- Spaced repetition: weight question selection by accuracy and recency
- Question difficulty levels (easy / medium / hard)
- Exam analytics: time per question, domain weak spots
- Deploy to AWS Amplify or ECS/Fargate via SST/OpenNext
- Add 200+ questions covering all domains
