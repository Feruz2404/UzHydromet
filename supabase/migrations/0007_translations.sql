-- 0007_translations.sql
-- Multilingual content for leaders + news.
-- Adds JSONB columns that store { uz, ru, en } translations.
-- Base columns (position, reception_day, etc.) remain as the UZ default / fallback value.
--
-- Idempotent: ADD COLUMN IF NOT EXISTS lets this be re-run safely.
-- Run AFTER 0005_leaders_news_columns.sql.

set local search_path = public;

-- Leaders translations
alter table public.leaders
  add column if not exists position_translations         jsonb not null default '{}'::jsonb,
  add column if not exists reception_day_translations    jsonb not null default '{}'::jsonb,
  add column if not exists responsibilities_translations jsonb not null default '{}'::jsonb,
  add column if not exists biography_translations        jsonb not null default '{}'::jsonb,
  add column if not exists address_translations          jsonb not null default '{}'::jsonb;

-- News translations
alter table public.news
  add column if not exists title_translations       jsonb not null default '{}'::jsonb,
  add column if not exists description_translations jsonb not null default '{}'::jsonb,
  add column if not exists badge_translations       jsonb not null default '{}'::jsonb;

-- Reload PostgREST schema cache so the new columns are exposed immediately.
notify pgrst, 'reload schema';
