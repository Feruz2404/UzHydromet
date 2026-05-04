-- Initial schema for UzHydromet admin-managed content.
-- Apply via Supabase Dashboard → SQL Editor, or `supabase db push`.

-- Required for gen_random_uuid() in Supabase (already enabled in most projects).
create extension if not exists "pgcrypto";

-- =========================
-- site_settings (singleton)
-- =========================
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  logo_url text,
  footer_logo_url text,
  agency_name text,
  short_description text,
  address text,
  phone text,
  email text,
  working_hours text,
  official_site_url text,
  official_news_url text,
  updated_at timestamptz not null default now()
);

-- =========================
-- leaders
-- =========================
create table if not exists public.leaders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  position text,
  photo_url text,
  reception_day text,
  reception_time text,
  phone text,
  email text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leaders_active_sort_idx
  on public.leaders (is_active, sort_order);

-- =========================
-- news_items
-- =========================
create table if not exists public.news_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  badge text,
  year text,
  link_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_items_active_sort_idx
  on public.news_items (is_active, sort_order);

-- =========================
-- updated_at trigger
-- =========================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

drop trigger if exists leaders_set_updated_at on public.leaders;
create trigger leaders_set_updated_at
  before update on public.leaders
  for each row execute function public.set_updated_at();

drop trigger if exists news_items_set_updated_at on public.news_items;
create trigger news_items_set_updated_at
  before update on public.news_items
  for each row execute function public.set_updated_at();

-- =========================
-- Row Level Security
-- =========================
-- Public site reads with the anon key. Writes are performed by the server-side
-- API using the service role key, which bypasses RLS.
alter table public.site_settings enable row level security;
alter table public.leaders        enable row level security;
alter table public.news_items     enable row level security;

drop policy if exists site_settings_anon_read on public.site_settings;
create policy site_settings_anon_read
  on public.site_settings for select
  using (true);

drop policy if exists leaders_anon_read on public.leaders;
create policy leaders_anon_read
  on public.leaders for select
  using (true);

drop policy if exists news_items_anon_read on public.news_items;
create policy news_items_anon_read
  on public.news_items for select
  using (true);

-- =========================
-- Storage buckets
-- =========================
-- Buckets must exist for image uploads. Both are public-read.
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = excluded.public;

insert into storage.buckets (id, name, public)
values ('leader-photos', 'leader-photos', true)
on conflict (id) do update set public = excluded.public;

-- Public read on storage.objects in those buckets.
drop policy if exists site_assets_public_read on storage.objects;
create policy site_assets_public_read
  on storage.objects for select
  using (bucket_id in ('site-assets', 'leader-photos'));
