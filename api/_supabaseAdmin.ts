// Server-only Supabase helpers. NEVER import this from src/.
// Used by Vercel serverless functions under /api/admin/*.
//
// Reads:
//   - VITE_SUPABASE_URL (or SUPABASE_URL fallback) \u2014 Supabase project URL
//   - SUPABASE_SERVICE_ROLE_KEY \u2014 server-only key, NEVER expose to client
//   - ADMIN_SECRET \u2014 shared secret for the x-admin-secret header gate
//
// All three are configured in Vercel \u2192 Project Settings \u2192 Environment
// Variables. Missing vars are logged to server logs (visible in Vercel
// Functions logs) so deployment misconfiguration is easy to diagnose,
// while public responses stay generic to avoid leaking which secret is
// missing.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

export function supabaseAdmin(): SupabaseClient | null {
  if (cached) return cached
  const url = (process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '').trim()
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()
  if (!url || !key) {
    const missing: string[] = []
    if (!url) missing.push('VITE_SUPABASE_URL (or SUPABASE_URL)')
    if (!key) missing.push('SUPABASE_SERVICE_ROLE_KEY')
    // eslint-disable-next-line no-console
    console.error(
      '[supabaseAdmin] Server Supabase client is not configured. Missing env: ' +
        missing.join(', ') +
        '. Set these in Vercel \u2192 Project Settings \u2192 Environment Variables.'
    )
    return null
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  return cached
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

// --------------------------------------------------------------------------
// Standardized response envelope helpers.
// All /api/admin/* endpoints respond with { ok: true, data } on success or
// { ok: false, error: <code>, details?: <safe text> } on failure.
// --------------------------------------------------------------------------

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

/**
 * Format a Postgres / Supabase REST error into the public envelope shape.
 * Logs the full error to Vercel logs prefixed by `prefix`, then returns a
 * sanitized payload safe to send to the browser.
 */
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

/**
 * Format any caught exception into the public envelope shape.
 */
export function unexpectedErrorEnvelope(
  prefix: string,
  err: unknown
): { ok: false; error: 'server_error'; details: string } {
  const safe = sanitizeMessage(err)
  // eslint-disable-next-line no-console
  console.error('[' + prefix + '] handler crashed: ' + safe, err)
  return { ok: false, error: 'server_error', details: safe }
}
