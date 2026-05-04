// PUT, DELETE /api/admin/leaders/:id
// All responses use the standard { ok, data } / { ok, error, details? } envelope.

import {
  supabaseAdmin,
  supabaseLoadError,
  checkAdminAuth,
  parseJson,
  pickFields,
  queryParam,
  dbErrorEnvelope,
  unexpectedErrorEnvelope,
  type ReqLike,
  type ResLike
} from '../../_supabaseAdmin'

const LOG = 'leaders/:id'

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
    const id = queryParam(req, 'id')
    if (!id) { res.status(400).json({ ok: false, error: 'missing_id' }); return }

    if (req.method === 'PUT') {
      const body = parseJson<Record<string, unknown>>(req.body)
      if (!body) { res.status(400).json({ ok: false, error: 'invalid_body' }); return }
      const patch = pickFields(body, FIELDS)
      const upd = await sb.from('leaders').update(patch).eq('id', id).select('*').single()
      if (upd.error) {
        if (upd.error.code === 'PGRST116') {
          res.status(404).json({ ok: false, error: 'not_found' })
          return
        }
        res.status(500).json(dbErrorEnvelope(LOG, upd.error))
        return
      }
      res.status(200).json({ ok: true, data: upd.data })
      return
    }

    if (req.method === 'DELETE') {
      const del = await sb.from('leaders').delete().eq('id', id)
      if (del.error) { res.status(500).json(dbErrorEnvelope(LOG, del.error)); return }
      res.status(200).json({ ok: true, data: { id } })
      return
    }

    res.setHeader('Allow', 'PUT, DELETE')
    res.status(405).json({ ok: false, error: 'method_not_allowed' })
  } catch (e) {
    res.status(500).json(unexpectedErrorEnvelope(LOG, e))
  }
}
