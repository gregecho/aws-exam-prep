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

create index on user_progress (user_id);
create index on user_bookmarks (user_id);
create index on exam_sessions (user_id);
