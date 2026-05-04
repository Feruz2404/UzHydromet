// GET, POST /api/admin/news
// Backed by the public.news table (renamed from news_items in 0003 migration).
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
} from '../_supabaseAdmin'

const LOG = 'news'

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
        .from('news')
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
      if (typeof patch.title !== 'string' || !patch.title.trim()) {
        res.status(400).json({ ok: false, error: 'title_required' })
        return
      }
      const ins = await sb.from('news').insert(patch).select('*').single()
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
