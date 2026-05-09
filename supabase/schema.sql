create extension if not exists "uuid-ossp";

create type exam_domain as enum (
  'Design Secure Architectures',
  'Design Resilient Architectures',
  'Design High-Performing Architectures',
  'Design Cost-Optimized Architectures'
);

create table questions (
  id          uuid primary key default uuid_generate_v4(),
  domain      exam_domain not null,
  question    text not null,
  option_a    text not null,
  option_b    text not null,
  option_c    text not null,
  option_d    text not null,
  correct     char(1) not null check (correct in ('A','B','C','D')),
  explanation text not null,
  created_at  timestamptz default now()
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
  selected      char(1) not null check (selected in ('A','B','C','D')),
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
