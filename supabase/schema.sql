create extension if not exists "uuid-ossp";

create type exam_domain as enum (
  'Design Secure Architectures',
  'Design Resilient Architectures',
  'Design High-Performing Architectures',
  'Design Cost-Optimized Architectures'
);

create table questions (
  id               uuid primary key default uuid_generate_v4(),
  domain           exam_domain not null,
  question         text not null,
  question_type    text not null default 'single' check (question_type in ('single', 'multiple')),
  -- options_json: [{"key":"A","text":"..."},{"key":"B","text":"..."},...]
  options_json     jsonb not null default '[]'::jsonb,
  correct          text not null check (correct ~ '^[A-Z](,[A-Z])*$'),
  -- explanations_json: {"A":"...","B":"..."}
  explanations_json jsonb not null default '{}'::jsonb,
  question_number  integer unique,
  created_at       timestamptz default now()
);

create table exam_sessions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      text not null,
  started_at   timestamptz default now(),
  completed_at timestamptz,
  score        integer,
  total        integer default 65,
  answers      jsonb default '{}'::jsonb,
  created_at   timestamptz default now()
);

create table user_progress (
  id            uuid primary key default uuid_generate_v4(),
  user_id       text not null,
  question_id   uuid not null references questions(id) on delete cascade,
  is_correct    boolean not null,
  selected      text not null check (selected ~ '^[A-Z](,[A-Z])*$'),
  attempted_at  timestamptz default now()
);

create table user_bookmarks (
  id          uuid primary key default uuid_generate_v4(),
  user_id     text not null,
  question_id uuid not null references questions(id) on delete cascade,
  created_at  timestamptz default now(),
  unique (user_id, question_id)
);

create table user_notes (
  id          uuid primary key default uuid_generate_v4(),
  user_id     text not null,
  question_id uuid not null references questions(id) on delete cascade,
  note        text not null default '',
  updated_at  timestamptz default now(),
  unique (user_id, question_id)
);

create table user_subscriptions (
  id               uuid primary key default uuid_generate_v4(),
  user_id          text not null unique,
  tier             text not null default 'free' check (tier in ('free', 'paid')),
  trial_started_at timestamptz not null default now(),
  paid_until       timestamptz,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index on user_progress (user_id);
create index on user_bookmarks (user_id);
create index on user_notes (user_id);
create index on user_subscriptions (user_id);
create index on exam_sessions (user_id);

-- ================================================================
-- SAA-C03 Question Bank  ·  Supabase Import
-- 1018 questions  (Q477 skipped: image-only options in source PDF)
-- ================================================================

-- 1. Enable uuid extension (safe to run multiple times)
create extension if not exists "uuid-ossp";

-- 2. Enum for exam domains
do $$ begin
  create type exam_domain as enum (
    'Design Resilient Architectures',
    'Design High-Performing Architectures',
    'Design Secure Architectures',
    'Design Cost-Optimized Architectures'
  );
exception when duplicate_object then null; end $$;

-- 3. Questions table
create table if not exists questions (
  id                uuid primary key default uuid_generate_v4(),
  domain            exam_domain not null,
  question          text not null,
  question_type     text not null default 'single'
                      check (question_type in ('single', 'multiple')),
  -- options_json: [{"key":"A","text":"..."},{"key":"B","text":"..."},...]
  options_json      jsonb not null default '[]'::jsonb,
  correct           text not null check (correct ~ '^[A-Z](,[A-Z])*$'),
  -- explanations_json: {"A":"...","B":"..."}
  explanations_json jsonb not null default '{}'::jsonb,
  created_at        timestamptz default now()
);

-- 4. Row Level Security
alter table questions enable row level security;

create policy "Public read access"
  on questions for select using (true);

-- 5. Indexes
create index if not exists idx_questions_domain        on questions (domain);
create index if not exists idx_questions_type          on questions (question_type);
create index if not exists idx_questions_options_gin   on questions using gin (options_json);
