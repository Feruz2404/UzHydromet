-- 0003: Rename news_items -> news, add submissions table, add hydromet-assets bucket.
-- Idempotent. Safe to re-run on a fresh project or on top of 0001 + 0002.

-- ===========================================================================
-- public.news  (renamed from public.news_items if present, otherwise created)
-- ===========================================================================

do $$
begin
  if exists (
    select 1 from pg_tables
    where schemaname = 'public' and tablename = 'news_items'
  ) and not exists (
    select 1 from pg_tables
    where schemaname = 'public' and tablename = 'news'
  ) then
    alter table public.news_items rename to news;
  end if;
end
$$;

create table if not exists public.news (
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

create index if not exists news_active_sort_idx on public.news (is_active, sort_order);

alter table public.news enable row level security;

drop policy if exists news_anon_read on public.news;
create policy news_anon_read on public.news for select using (true);

drop trigger if exists news_set_updated_at on public.news;
create trigger news_set_updated_at
  before update on public.news
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- public.submissions  (reception-form submissions, written by service role)
-- ===========================================================================

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  subject text not null,
  message text not null,
  leader_id uuid references public.leaders(id) on delete set null,
  leader_name text,
  leader_position text,
  leader_email text,
  ip_address text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists submissions_created_at_idx on public.submissions (created_at desc);
create index if not exists submissions_leader_id_idx on public.submissions (leader_id);

alter table public.submissions enable row level security;
-- No anon policies on submissions: only the service-role API may read/write
-- this table. RLS naturally denies the anon role.

-- ===========================================================================
-- storage bucket: hydromet-assets  (single bucket for all admin uploads)
-- ===========================================================================

insert into storage.buckets (id, name, public)
values ('hydromet-assets', 'hydromet-assets', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists hydromet_assets_public_read on storage.objects;
create policy hydromet_assets_public_read
  on storage.objects for select
  using (bucket_id = 'hydromet-assets');
