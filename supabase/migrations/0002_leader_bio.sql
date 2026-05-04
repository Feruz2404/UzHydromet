-- Adds website_url, address, responsibilities, biography columns to leaders.
-- Safe to re-run: every column is gated by IF NOT EXISTS.
alter table public.leaders
  add column if not exists website_url text,
  add column if not exists address text,
  add column if not exists responsibilities text,
  add column if not exists biography text;
