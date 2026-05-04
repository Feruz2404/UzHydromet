// Server-only Supabase helpers. NEVER import this from src/.
// Used by Vercel serverless functions under /api/admin/*.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

export function supabaseAdmin(): SupabaseClient | null {
  if (cached) return cached
  const url = (process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '').trim()
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()
  if (!url || !key) return null
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

export function checkAdminAuth(req: ReqLike): boolean {
  const expected = (process.env.ADMIN_SECRET ?? '').trim()
  if (!expected) return false
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
