// GET, POST /api/admin/leaders
// GET   -> list all rows ordered by sort_order
// POST  -> insert one row. body matches the leaders table column names.

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
  if (req.method === 'OPTIONS') { res.status(204).json({}); return }
  if (!checkAdminAuth(req)) { res.status(401).json({ error: 'unauthorized' }); return }
  const sb = supabaseAdmin()
  if (!sb) { res.status(500).json({ error: 'supabase_not_configured' }); return }
  try {
    if (req.method === 'GET') {
      const { data, error } = await sb
        .from('leaders')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
      if (error) { res.status(500).json({ error: error.message }); return }
      res.status(200).json({ data: data ?? [] })
      return
    }
    if (req.method === 'POST') {
      const body = parseJson<Record<string, unknown>>(req.body)
      if (!body) { res.status(400).json({ error: 'invalid_body' }); return }
      const patch = pickFields(body, FIELDS) as Record<string, unknown>
      if (typeof patch.full_name !== 'string' || !patch.full_name.trim()) {
        res.status(400).json({ error: 'full_name_required' })
        return
      }
      const ins = await sb.from('leaders').insert(patch).select('*').single()
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
