// GET /api/admin/health
// Unauthenticated diagnostic endpoint. Returns enough information to confirm
// that the latest /api/admin/* deploy is live and that the required
// environment variables are present, WITHOUT leaking their values.
//
// Does NOT touch Supabase (so it cannot be brought down by a database or
// network issue) and has no external imports beyond the shared types, so
// any FUNCTION_INVOCATION_FAILED on this path means the deploy itself is
// broken at the platform level.
//
// NOTE: Vercel's @vercel/node builder excludes files prefixed with `_` from
// the HTTP route table (treats them as private modules). The earlier file
// api/admin/_health.ts therefore returned 404 from Vercel's edge router.
// This file uses a public name so it is actually reachable.

import type { ReqLike, ResLike } from '../_supabaseAdmin'

export default function handler(req: ReqLike, res: ResLike): void {
  try {
    const url = (process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '').trim()
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()
    const adminSecret = (process.env.ADMIN_SECRET ?? '').trim()
    res.status(200).json({
      ok: true,
      version: '2026-05-04T17:34Z',
      method: req.method ?? null,
      env: {
        hasUrl: url.length > 0,
        hasServiceKey: key.length > 0,
        hasAdminSecret: adminSecret.length > 0
      },
      ts: new Date().toISOString()
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    res.status(500).json({ ok: false, error: 'server_error', details: msg.slice(0, 240) })
  }
}
