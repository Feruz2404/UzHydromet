# Supabase backend setup

UzHydromet admin panel content (site settings, leaders, news) is persisted in
Supabase. Image uploads are stored in Supabase Storage. Public pages read with
the anon key; admin writes go through Vercel serverless functions that use the
service role key (never exposed to the client).

## 1. Create a Supabase project

1. Go to <https://supabase.com> and create a new project.
2. From **Project settings → API**, copy the following values:
   - `Project URL` → `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY` and `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## 2. Apply the schema

From the SQL editor in the Supabase dashboard, run
[`supabase/migrations/0001_initial.sql`](../supabase/migrations/0001_initial.sql)
in its entirety. It is idempotent and safe to re-run.

This creates:
- Tables `site_settings`, `leaders`, `news_items` (matches the agreed schema).
- An `updated_at` trigger on each table.
- Row Level Security with anon read access (writes go through the service role).
- Storage buckets `site-assets` and `leader-photos` (public-read).

### Tables

```
site_settings (singleton row)
  id uuid pk default gen_random_uuid()
  logo_url text
  footer_logo_url text
  agency_name text
  short_description text
  address text
  phone text
  email text
  working_hours text
  official_site_url text
  official_news_url text
  updated_at timestamptz default now()

leaders
  id uuid pk default gen_random_uuid()
  full_name text not null
  position text
  photo_url text
  reception_day text
  reception_time text
  phone text
  email text
  sort_order int default 0
  is_active boolean default true
  created_at timestamptz default now()
  updated_at timestamptz default now()

news_items
  id uuid pk default gen_random_uuid()
  title text not null
  description text
  badge text
  year text
  link_url text
  sort_order int default 0
  is_active boolean default true
  created_at timestamptz default now()
  updated_at timestamptz default now()
```

### Storage buckets

- `site-assets` — header logo, footer logo, hero/site images.
- `leader-photos` — leader portrait photos.

Both buckets are configured public-read in the migration so uploaded files are
directly servable via their public URL.

## 3. Configure environment variables

Copy `.env.example` to `.env.local` for local dev, and set the same values in
Vercel **Project settings → Environment Variables** for Production and Preview.

| Variable | Where | Required | Notes |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | client+server | yes | Project URL |
| `VITE_SUPABASE_ANON_KEY` | client+server | yes | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | yes | service_role key |
| `ADMIN_SECRET` | server only | yes | shared secret protecting `/api/admin/*`. Recommended: same as `VITE_ADMIN_PASSWORD`. |
| `VITE_ADMIN_PASSWORD` | client | yes | password the admin UI prompts for |
| `RESEND_API_KEY` *or* `SMTP_*` | server only | yes (one) | reception email backend |
| `DEFAULT_RECEPTION_EMAIL` | server only | yes | fallback recipient |
| `FROM_EMAIL` | server only | yes | From: address |

> Do **not** commit any of the keys above. Only `.env.example` is in source.

## 4. Admin API endpoints

All admin writes flow through Vercel serverless functions under `/api/admin/*`
and require the `x-admin-secret` header (set automatically by the admin UI):

| Method | Path | Purpose |
| --- | --- | --- |
| GET, POST | `/api/admin/site-settings` | read or upsert the singleton settings row |
| GET, POST | `/api/admin/leaders` | list, create |
| PUT, DELETE | `/api/admin/leaders?id=<uuid>` | update, delete |
| GET, POST | `/api/admin/news` | list, create |
| PUT, DELETE | `/api/admin/news?id=<uuid>` | update, delete |
| POST | `/api/admin/upload` | upload base64 image to a Storage bucket |

Return shape: `{ data?: ..., error?: string }` with `200` on success, `400` on
bad input, `401` on missing/wrong admin secret, `404` for unknown id, `500` for
server errors.

## 5. Public reads

The browser uses the anon key directly via `src/lib/supabaseClient.ts`. If
either `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing, the app
gracefully falls back to the static seeds in `src/data/defaults.ts` so the
landing page never breaks during local dev.

## 6. Production deployment checklist

- [ ] Run `supabase/migrations/0001_initial.sql` against the Supabase project.
- [ ] Set all env vars in Vercel for Production **and** Preview.
- [ ] Redeploy. Verify `/api/admin/site-settings` returns `{ data: ... }` when
      called with `x-admin-secret`.
- [ ] Open `/admin`, log in, save settings, upload a logo.
- [ ] Open the public site in another browser — the change should be visible.
