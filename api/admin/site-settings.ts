// GET, POST /api/admin/site-settings
// Singleton row. POST upserts: updates the most recent row, or inserts.
// All responses use the standard { ok, data } / { ok, error, details? } envelope.

import {
  supabaseAdmin,
  checkAdminAuth,
  parseJson,
  pickFields,
  dbErrorEnvelope,
  unexpectedErrorEnvelope,
  type ReqLike,
  type ResLike
} from '../_supabaseAdmin'

const LOG = 'site-settings'

const FIELDS = [
  'logo_url',
  'footer_logo_url',
  'agency_name',
  'short_description',
  'address',
  'phone',
  'email',
  'working_hours',
  'official_site_url',
  'official_news_url'
] as const

export default async function handler(req: ReqLike, res: ResLike): Promise<void> {
  try {
    if (req.method === 'OPTIONS') { res.status(204).json({ ok: true }); return }
    if (!checkAdminAuth(req)) { res.status(401).json({ ok: false, error: 'unauthorized' }); return }
    const sb = supabaseAdmin()
    if (!sb) { res.status(500).json({ ok: false, error: 'server_not_configured' }); return }

    if (req.method === 'GET') {
      const { data, error } = await sb
        .from('site_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) { res.status(500).json(dbErrorEnvelope(LOG, error)); return }
      res.status(200).json({ ok: true, data: data ?? null })
      return
    }

    if (req.method === 'POST') {
      const body = parseJson<Record<string, unknown>>(req.body)
      if (!body) { res.status(400).json({ ok: false, error: 'invalid_body' }); return }
      const patch = pickFields(body, FIELDS)
      const existing = await sb
        .from('site_settings')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (existing.error) { res.status(500).json(dbErrorEnvelope(LOG, existing.error)); return }
      if (existing.data?.id) {
        const upd = await sb
          .from('site_settings')
          .update(patch)
          .eq('id', existing.data.id)
          .select('*')
          .single()
        if (upd.error) { res.status(500).json(dbErrorEnvelope(LOG, upd.error)); return }
        res.status(200).json({ ok: true, data: upd.data })
        return
      }
      const ins = await sb
        .from('site_settings')
        .insert(patch)
        .select('*')
        .single()
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
