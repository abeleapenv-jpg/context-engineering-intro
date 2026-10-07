-- QUIETFIELD SCHEMA (master plan section 5)
--
-- Two tables, both owned by the walker, both locked down with Row Level
-- Security. Run this in the Supabase SQL editor, then VERIFY the policies in
-- the dashboard (Authentication > Policies) - master plan section 8, risk 5:
-- policies must be verified after running, never assumed correct.
--
-- auth.users is managed by Supabase Auth; there is no custom users table.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- progress --
-- One row per (user, scenario). The unique constraint is the upsert target:
-- progress rows UPDATE on replay instead of silently inserting duplicates
-- (the onConflict bug fixed in master plan section 7, task 7).
create table if not exists public.progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  scenario_id  text not null,
  completed_at timestamptz not null default now(),
  unique (user_id, scenario_id)
);

-- ------------------------------------------------------------ choices_made --
-- Latest confirmed choice per (user, scenario); powers resume hydration and
-- the Field Notes pattern summary.
create table if not exists public.choices_made (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  scenario_id text not null,
  choice_key  text not null check (choice_key in ('A', 'B', 'C', 'D')),
  chosen_at   timestamptz not null default now(),
  unique (user_id, scenario_id)
);

-- --------------------------------------------------------------------- RLS --
alter table public.progress     enable row level security;
alter table public.choices_made enable row level security;

-- Every policy checks auth.uid() = user_id: a walker sees and writes only
-- their own field. No anon/public access on either table.
drop policy if exists "walkers read own progress"     on public.progress;
drop policy if exists "walkers write own progress"    on public.progress;
drop policy if exists "walkers read own choices"      on public.choices_made;
drop policy if exists "walkers write own choices"     on public.choices_made;

create policy "walkers read own progress"
  on public.progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "walkers write own progress"
  on public.progress for insert
  to authenticated
  with check (auth.uid() = user_id);

-- upsert needs update too (same constraint target on conflict)
create policy "walkers update own progress"
  on public.progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "walkers read own choices"
  on public.choices_made for select
  to authenticated
  using (auth.uid() = user_id);

create policy "walkers insert own choices"
  on public.choices_made for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "walkers update own choices"
  on public.choices_made for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Optional reflection field (master plan section 10): nullable, same RLS.
-- Skipped by default; add when the reflection prompt ships.
-- alter table public.choices_made
--   add column if not exists reflection text;
