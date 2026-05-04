// Server-only Supabase helpers. NEVER import this from src/.
// Used by Vercel serverless functions under /api/admin/*.
//
// IMPORTANT: We intentionally do NOT statically import @supabase/supabase-js
// at the top level. A static `import { createClient } from '@supabase/supabase-js'`
// caused FUNCTION_INVOCATION_FAILED at module-load time on Vercel under our
// "type": "module" + Vite (non-Next) project shape \u2014 every admin endpoint
// crashed before hitting our try/catch, returning bare HTTP 500 to the UI.
// The fix matches the working pattern in api/reception-request.ts: dynamic
// import inside an async helper, wrapped in try/catch.
//
// The `import type { SupabaseClient }` line below is compile-time only and is
// stripped by tsc/esbuild before bundling, so it carries zero runtime cost
// and cannot cause a load-time crash.
//
// Reads:
//   - VITE_SUPABASE_URL (or SUPABASE_URL fallback) \u2014 Supabase project URL
//   - SUPABASE_SERVICE_ROLE_KEY \u2014 server-only key, NEVER expose to client
//   - ADMIN_SECRET \u2014 shared secret for the x-admin-secret header gate

import type { SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null
let cachedLoadError: string | null = null

/**
 * Returns the last recorded reason `supabaseAdmin()` failed to produce a
 * client, or null if it has not failed. Handlers should include this in
 * their error envelope so the admin UI can surface the real cause (env
 * misconfig vs. runtime import failure) instead of an opaque HTTP 500.
 */
export function supabaseLoadError(): string | null {
  return cachedLoadError
}

export async function supabaseAdmin(): Promise<SupabaseClient | null> {
  if (cached) return cached
  if (cachedLoadError) {
    // eslint-disable-next-line no-console
    console.error('[supabaseAdmin] previously failed to load: ' + cachedLoadError)
    return null
  }
  const url = (process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '').trim()
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()
  if (!url || !key) {
    const missing: string[] = []
    if (!url) missing.push('VITE_SUPABASE_URL (or SUPABASE_URL)')
    if (!key) missing.push('SUPABASE_SERVICE_ROLE_KEY')
    cachedLoadError = 'missing env: ' + missing.join(', ')
    // eslint-disable-next-line no-console
    console.error(
      '[supabaseAdmin] ' + cachedLoadError + '. Set these in Vercel \u2192 Project Settings \u2192 Environment Variables.'
    )
    return null
  }
  try {
    const mod = await import('@supabase/supabase-js')
    // CJS/ESM interop: createClient may live on the namespace or on default.
    const ns = mod as unknown as Record<string, unknown>
    const fromNs = ns.createClient
    const fromDefault =
      typeof ns.default === 'object' && ns.default !== null
        ? (ns.default as Record<string, unknown>).createClient
        : undefined
    const createClient =
      typeof fromNs === 'function'
        ? (fromNs as (u: string, k: string, o?: unknown) => unknown)
        : typeof fromDefault === 'function'
          ? (fromDefault as (u: string, k: string, o?: unknown) => unknown)
          : null
    if (!createClient) {
      cachedLoadError = 'createClient is not exported by @supabase/supabase-js'
      // eslint-disable-next-line no-console
      console.error('[supabaseAdmin] ' + cachedLoadError)
      return null
    }
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    }) as SupabaseClient
    return cached
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    cachedLoadError = 'dynamic import failed: ' + msg.slice(0, 200)
    // eslint-disable-next-line no-console
    console.error('[supabaseAdmin] ' + cachedLoadError, e)
    return null
  }
}

export type ReqLike = {
  method?: string
  body?: unknown
  query?: Record<string, string | string[] | undefined>
  headers: Record<string, string | string[] | undefined>
  socket?: { remoteAddress?: string }
}
export type ResLike = {
  status: (code: number) => ResLike
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
  end?: () => void
}

let warnedMissingAdminSecret = false

export function checkAdminAuth(req: ReqLike): boolean {
  const expected = (process.env.ADMIN_SECRET ?? '').trim()
  if (!expected) {
    if (!warnedMissingAdminSecret) {
      warnedMissingAdminSecret = true
      // eslint-disable-next-line no-console
      console.error(
        '[checkAdminAuth] ADMIN_SECRET is not configured. All admin writes will be rejected. ' +
          'Set ADMIN_SECRET in Vercel \u2192 Project Settings \u2192 Environment Variables.'
      )
    }
    return false
  }
  const got = req.headers['x-admin-secret']
  const value = Array.isArray(got) ? got[0] : got
  return typeof value === 'string' && value.trim() === expected
}

export function parseJson<T = unknown>(raw: unknown): T | null {
  if (raw == null) return null
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as T } catch { return null }
  }
  if (typeof raw === 'object') return raw as T
  return null
}

export function queryParam(req: ReqLike, name: string): string | undefined {
  const q = req.query?.[name]
  if (Array.isArray(q)) return q[0]
  return typeof q === 'string' ? q : undefined
}

export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'server_error'
}

export function pickFields<T extends string>(
  body: Record<string, unknown>,
  fields: ReadonlyArray<T>
): Partial<Record<T, unknown>> {
  const out: Partial<Record<T, unknown>> = {}
  for (const f of fields) {
    if (Object.prototype.hasOwnProperty.call(body, f)) {
      const v = body[f]
      out[f] = v === '' ? null : v
    }
  }
  return out
}

export type DbError = {
  code?: string
  message?: string
  details?: string
  hint?: string
}

function sanitizeMessage(s: unknown): string {
  const raw = typeof s === 'string' ? s : (s instanceof Error ? s.message : String(s ?? ''))
  return raw.replace(/[\r\n]+/g, ' ').slice(0, 240)
}

export function dbErrorEnvelope(
  prefix: string,
  err: DbError | unknown
): { ok: false; error: 'database_error'; details: string } {
  const e = (err && typeof err === 'object' ? (err as DbError) : null)
  const raw = e?.message || e?.details || (typeof err === 'string' ? err : 'unknown_error')
  const safe = sanitizeMessage(raw)
  // eslint-disable-next-line no-console
  console.error('[' + prefix + '] database error: ' + safe, err)
  return { ok: false, error: 'database_error', details: safe }
}

export function unexpectedErrorEnvelope(
  prefix: string,
  err: unknown
): { ok: false; error: 'server_error'; details: string } {
  const safe = sanitizeMessage(err)
  // eslint-disable-next-line no-console
  console.error('[' + prefix + '] handler crashed: ' + safe, err)
  return { ok: false, error: 'server_error', details: safe }
}
