// GET, POST /api/admin/leaders
// GET   -> list all rows ordered by sort_order
// POST  -> insert one row. body matches the leaders table column names.
// All responses use the standard { ok, data } / { ok, error, details? } envelope.

import {
  supabaseAdmin,
  supabaseLoadError,
  checkAdminAuth,
  parseJson,
  pickFields,
  dbErrorEnvelope,
  unexpectedErrorEnvelope,
  type ReqLike,
  type ResLike
} from '../_supabaseAdmin.js'

const LOG = 'leaders'

const FIELDS = [
  'full_name',
  'position',
  'photo_url',
  'reception_day',
  'reception_time',
  'phone',
  'email',
  'website_url',
  'address',
  'responsibilities',
  'biography',
  'sort_order',
  'is_active'
] as const

export default async function handler(req: ReqLike, res: ResLike): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('[' + LOG + '] handler invoked, method=' + (req.method ?? 'unknown'))
  try {
    if (req.method === 'OPTIONS') { res.status(204).json({ ok: true }); return }
    if (!checkAdminAuth(req)) { res.status(401).json({ ok: false, error: 'unauthorized' }); return }
    const sb = await supabaseAdmin()
    if (!sb) {
      res.status(500).json({
        ok: false,
        error: 'server_not_configured',
        details: supabaseLoadError() ?? 'env or runtime issue'
      })
      return
    }

    if (req.method === 'GET') {
      const { data, error } = await sb
        .from('leaders')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
      if (error) { res.status(500).json(dbErrorEnvelope(LOG, error)); return }
      res.status(200).json({ ok: true, data: data ?? [] })
      return
    }

    if (req.method === 'POST') {
      const body = parseJson<Record<string, unknown>>(req.body)
      if (!body) { res.status(400).json({ ok: false, error: 'invalid_body' }); return }
      const patch = pickFields(body, FIELDS) as Record<string, unknown>
      if (typeof patch.full_name !== 'string' || !patch.full_name.trim()) {
        res.status(400).json({ ok: false, error: 'full_name_required' })
        return
      }
      const ins = await sb.from('leaders').insert(patch).select('*').single()
      if (ins.error) { res.status(500).json(dbErrorEnvelope(LOG, ins.error)); return }
      res.status(200).json({ ok: true, data: ins.data })
      return
    }

    res.setHeader('Allow', 'GET, POST')
    res.status(405).json({ ok: false, error: 'method_not_allowed' })
  } catch (e) {
    res.status(500).json(unexpectedErrorEnvelope(LOG, e))
  }
}
