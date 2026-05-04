// GET /api/admin/health
// Unauthenticated diagnostic endpoint. Reports deploy version, presence of
// required env vars (without leaking values), and now also the result of
// actually loading the Supabase admin client via the same code path that
// /api/admin/site-settings, leaders, news, and upload use.
//
// We deliberately import a *value* (supabaseAdmin) here, not just a type,
// so this endpoint exercises the full dynamic-import path. If this endpoint
// itself starts returning FUNCTION_INVOCATION_FAILED we know the crash is
// at module-load when value-importing from _supabaseAdmin.ts. If it returns
// 200 with supabase.loaded:false and a real error message, we know the
// dynamic import fails at runtime and we have the exact reason.

import {
  supabaseAdmin,
  supabaseLoadError,
  type ReqLike,
  type ResLike
} from '../_supabaseAdmin'

const VERSION = '2026-05-04T17:51Z'

export default async function handler(req: ReqLike, res: ResLike): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('[health] handler invoked, method=' + (req.method ?? 'unknown'))
  try {
    const url = (process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '').trim()
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()
    const adminSecret = (process.env.ADMIN_SECRET ?? '').trim()

    let supabaseLoaded = false
    let supabaseError: string | null = null
    try {
      const sb = await supabaseAdmin()
      supabaseLoaded = sb !== null
      if (!supabaseLoaded) {
        supabaseError = supabaseLoadError() ?? 'unknown (returned null with no recorded error)'
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      supabaseError = 'threw: ' + msg.slice(0, 200)
      // eslint-disable-next-line no-console
      console.error('[health] supabaseAdmin() threw:', e)
    }

    res.status(200).json({
      ok: true,
      version: VERSION,
      method: req.method ?? null,
      env: {
        hasUrl: url.length > 0,
        hasServiceKey: key.length > 0,
        hasAdminSecret: adminSecret.length > 0
      },
      supabase: {
        loaded: supabaseLoaded,
        error: supabaseError
      },
      ts: new Date().toISOString()
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    // eslint-disable-next-line no-console
    console.error('[health] handler outer crash:', e)
    res.status(500).json({ ok: false, error: 'server_error', details: msg.slice(0, 240) })
  }
}
