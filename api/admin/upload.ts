// POST /api/admin/upload
// Body: { bucket: 'site-assets' | 'leader-photos', filename: string,
//         contentType: string, base64: string }
// Returns: { data: { url, path, bucket } }

import {
  supabaseAdmin,
  checkAdminAuth,
  parseJson,
  errorMessage,
  type ReqLike,
  type ResLike
} from '../_supabaseAdmin'

export const config = {
  api: { bodyParser: { sizeLimit: '6mb' } }
}

const ALLOWED_BUCKETS = new Set(['site-assets', 'leader-photos'])
const MAX_BYTES = 5_000_000

type Body = {
  bucket?: string
  filename?: string
  contentType?: string
  base64?: string
}

export default async function handler(req: ReqLike, res: ResLike): Promise<void> {
  if (req.method === 'OPTIONS') { res.status(204).json({}); return }
  if (!checkAdminAuth(req)) { res.status(401).json({ error: 'unauthorized' }); return }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }
  const sb = supabaseAdmin()
  if (!sb) { res.status(500).json({ error: 'supabase_not_configured' }); return }
  try {
    const body = parseJson<Body>(req.body)
    if (!body) { res.status(400).json({ error: 'invalid_body' }); return }
    const bucket = (body.bucket ?? '').trim()
    if (!ALLOWED_BUCKETS.has(bucket)) {
      res.status(400).json({ error: 'invalid_bucket' })
      return
    }
    const filename = (body.filename ?? '').trim()
    if (!filename) { res.status(400).json({ error: 'missing_filename' }); return }
    const contentType = (body.contentType ?? '').trim() || 'application/octet-stream'
    if (!contentType.startsWith('image/')) {
      res.status(400).json({ error: 'invalid_content_type' })
      return
    }
    const rawB64 = (body.base64 ?? '').replace(/^data:[^;]+;base64,/, '')
    if (!rawB64) { res.status(400).json({ error: 'missing_base64' }); return }
    const buffer = Buffer.from(rawB64, 'base64')
    if (buffer.length === 0) { res.status(400).json({ error: 'empty_payload' }); return }
    if (buffer.length > MAX_BYTES) { res.status(400).json({ error: 'file_too_large' }); return }

    const safeName = filename.replace(/[^\w.\-+]/g, '_').slice(-160)
    const path = `${Date.now()}_${Math.floor(Math.random() * 1_000_000)}_${safeName}`
    const up = await sb.storage.from(bucket).upload(path, buffer, {
      contentType,
      upsert: false,
      cacheControl: '3600'
    })
    if (up.error) { res.status(500).json({ error: up.error.message }); return }
    const pub = sb.storage.from(bucket).getPublicUrl(up.data.path)
    res.status(200).json({
      data: { url: pub.data.publicUrl, path: up.data.path, bucket }
    })
  } catch (e) {
    res.status(500).json({ error: errorMessage(e) })
  }
}
