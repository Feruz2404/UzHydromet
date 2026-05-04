// GET, POST /api/admin/site-settings
// Singleton row. POST upserts: updates the most recent row, or inserts.

import {
  supabaseAdmin,
  checkAdminAuth,
  parseJson,
  errorMessage,
  pickFields,
  type ReqLike,
  type ResLike
} from '../_supabaseAdmin'

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
  if (req.method === 'OPTIONS') { res.status(204).json({}); return }
  if (!checkAdminAuth(req)) { res.status(401).json({ error: 'unauthorized' }); return }
  const sb = supabaseAdmin()
  if (!sb) { res.status(500).json({ error: 'supabase_not_configured' }); return }
  try {
    if (req.method === 'GET') {
      const { data, error } = await sb
        .from('site_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) { res.status(500).json({ error: error.message }); return }
      res.status(200).json({ data: data ?? null })
      return
    }
    if (req.method === 'POST') {
      const body = parseJson<Record<string, unknown>>(req.body)
      if (!body) { res.status(400).json({ error: 'invalid_body' }); return }
      const patch = pickFields(body, FIELDS)
      const existing = await sb
        .from('site_settings')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (existing.error) { res.status(500).json({ error: existing.error.message }); return }
      if (existing.data?.id) {
        const upd = await sb
          .from('site_settings')
          .update(patch)
          .eq('id', existing.data.id)
          .select('*')
          .single()
        if (upd.error) { res.status(500).json({ error: upd.error.message }); return }
        res.status(200).json({ data: upd.data })
        return
      }
      const ins = await sb
        .from('site_settings')
        .insert(patch)
        .select('*')
        .single()
      if (ins.error) { res.status(500).json({ error: ins.error.message }); return }
      res.status(200).json({ data: ins.data })
      return
    }
    res.setHeader('Allow', 'GET, POST')
    res.status(405).json({ error: 'method_not_allowed' })
  } catch (e) {
    res.status(500).json({ error: errorMessage(e) })
  }
}
