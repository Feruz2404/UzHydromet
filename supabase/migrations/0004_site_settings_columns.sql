-- 0004: Backfill any missing columns on public.site_settings.
--
-- Why this exists:
--   Production Supabase DB was set up before/without the full 0001 schema,
--   so POST /api/admin/site-settings fails with PGRST204:
--     "Could not find the 'short_description' column of 'site_settings'
--      in the schema cache"
--
-- This migration is fully idempotent: every ADD COLUMN is gated by
-- IF NOT EXISTS. Safe to run on a fresh project, on top of 0001+0002+0003,
-- or repeatedly. It only adds columns; it never drops or alters data.
--
-- The column list mirrors the FIELDS array in api/admin/site-settings.ts.

alter table public.site_settings
  add column if not exists logo_url           text,
  add column if not exists footer_logo_url    text,
  add column if not exists agency_name        text,
  add column if not exists short_description  text,
  add column if not exists address            text,
  add column if not exists phone              text,
  add column if not exists email              text,
  add column if not exists working_hours      text,
  add column if not exists official_site_url  text,
  add column if not exists official_news_url  text,
  add column if not exists updated_at         timestamptz not null default now();

-- Make sure the updated_at trigger is wired up (no-op if it already exists).
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Force PostgREST to reload its schema cache so the new columns are
-- visible immediately without waiting for the periodic refresh.
notify pgrst, 'reload schema';
