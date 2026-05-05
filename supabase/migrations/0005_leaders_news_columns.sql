-- 0005: Backfill any missing columns on public.leaders and public.news.
--
-- Why this exists:
--   Production Vercel log shows POST /api/admin/leaders failing with:
--     PGRST204 — Could not find the 'photo_url' column of 'leaders'
--                in the schema cache
--   Same root cause as 0004 (site_settings): the live Supabase DB was
--   set up with a partial schema. Columns from migrations 0001 + 0002
--   never made it into production.
--
-- This migration is fully idempotent: every ADD COLUMN is gated by
-- IF NOT EXISTS. Safe on a fresh project, on top of 0001+0002+0003+0004,
-- or repeatedly. It only adds columns; it never drops or alters data.
--
-- The column lists mirror the FIELDS arrays in:
--   api/admin/leaders.ts
--   api/admin/news.ts

-- ===========================================================================
-- public.leaders
-- ===========================================================================

alter table public.leaders
  add column if not exists full_name        text,
  add column if not exists position         text,
  add column if not exists photo_url        text,
  add column if not exists reception_day    text,
  add column if not exists reception_time   text,
  add column if not exists phone            text,
  add column if not exists email            text,
  add column if not exists website_url      text,
  add column if not exists address          text,
  add column if not exists responsibilities text,
  add column if not exists biography        text,
  add column if not exists sort_order       int         not null default 0,
  add column if not exists is_active        boolean     not null default true,
  add column if not exists created_at       timestamptz not null default now(),
  add column if not exists updated_at       timestamptz not null default now();

-- full_name is NOT NULL in 0001; if the column was just added by this
-- migration it will be nullable. Tighten it only if it is currently
-- nullable AND there are no NULL rows that would break the constraint.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'leaders'
      and column_name  = 'full_name'
      and is_nullable  = 'YES'
  ) and not exists (
    select 1 from public.leaders where full_name is null
  ) then
    alter table public.leaders alter column full_name set not null;
  end if;
end
$$;

create index if not exists leaders_active_sort_idx
  on public.leaders (is_active, sort_order);

alter table public.leaders enable row level security;

drop policy if exists leaders_anon_read on public.leaders;
create policy leaders_anon_read on public.leaders for select using (true);

drop trigger if exists leaders_set_updated_at on public.leaders;
create trigger leaders_set_updated_at
  before update on public.leaders
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- public.news
-- ===========================================================================

-- If only the old news_items name exists (rare, but possible), rename it.
do $$
begin
  if exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = 'news_items'
  ) and not exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = 'news'
  ) then
    alter table public.news_items rename to news;
  end if;
end
$$;

create table if not exists public.news (
  id uuid primary key default gen_random_uuid()
);

alter table public.news
  add column if not exists title       text,
  add column if not exists description text,
  add column if not exists badge       text,
  add column if not exists year        text,
  add column if not exists link_url    text,
  add column if not exists sort_order  int         not null default 0,
  add column if not exists is_active   boolean     not null default true,
  add column if not exists created_at  timestamptz not null default now(),
  add column if not exists updated_at  timestamptz not null default now();

-- title is NOT NULL in 0001; tighten only if safe (see note above).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'news'
      and column_name  = 'title'
      and is_nullable  = 'YES'
  ) and not exists (
    select 1 from public.news where title is null
  ) then
    alter table public.news alter column title set not null;
  end if;
end
$$;

create index if not exists news_active_sort_idx
  on public.news (is_active, sort_order);

alter table public.news enable row level security;

drop policy if exists news_anon_read on public.news;
create policy news_anon_read on public.news for select using (true);

drop trigger if exists news_set_updated_at on public.news;
create trigger news_set_updated_at
  before update on public.news
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- Make PostgREST pick up the new columns immediately
-- ===========================================================================

notify pgrst, 'reload schema';
