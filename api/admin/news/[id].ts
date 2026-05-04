// PUT, DELETE /api/admin/news/:id

import {
  supabaseAdmin,
  checkAdminAuth,
  parseJson,
  errorMessage,
  pickFields,
  queryParam,
  type ReqLike,
  type ResLike
} from '../../_supabaseAdmin'

const FIELDS = [
  'title',
  'description',
  'badge',
  'year',
  'link_url',
  'sort_order',
  'is_active'
] as const

export default async function handler(req: ReqLike, res: ResLike): Promise<void> {
  if (req.method === 'OPTIONS') { res.status(204).json({}); return }
  if (!checkAdminAuth(req)) { res.status(401).json({ error: 'unauthorized' }); return }
  const sb = supabaseAdmin()
  if (!sb) { res.status(500).json({ error: 'supabase_not_configured' }); return }
  const id = queryParam(req, 'id')
  if (!id) { res.status(400).json({ error: 'missing_id' }); return }
  try {
    if (req.method === 'PUT') {
      const body = parseJson<Record<string, unknown>>(req.body)
      if (!body) { res.status(400).json({ error: 'invalid_body' }); return }
      const patch = pickFields(body, FIELDS)
      const upd = await sb.from('news_items').update(patch).eq('id', id).select('*').single()
      if (upd.error) {
        const code = upd.error.code === 'PGRST116' ? 404 : 500
        res.status(code).json({ error: upd.error.message })
        return
      }
      res.status(200).json({ data: upd.data })
      return
    }
    if (req.method === 'DELETE') {
      const del = await sb.from('news_items').delete().eq('id', id)
      if (del.error) { res.status(500).json({ error: del.error.message }); return }
      res.status(200).json({ data: { id } })
      return
    }
    res.setHeader('Allow', 'PUT, DELETE')
    res.status(405).json({ error: 'method_not_allowed' })
  } catch (e) {
    res.status(500).json({ error: errorMessage(e) })
  }
}
