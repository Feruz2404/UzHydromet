// POST /api/admin/upload
// Accepts: multipart/form-data
//   - file:  the uploaded image (required)
//   - kind:  'site-logo' | 'footer-logo' | 'leader-photo' | 'asset' (optional)
//
// Required env (server-only):
//   - VITE_SUPABASE_URL or SUPABASE_URL
//   - SUPABASE_SERVICE_ROLE_KEY  (NEVER exposed to the client)
//   - ADMIN_SECRET               (header gate: x-admin-secret)
//
// Storage bucket: hydromet-assets (Public).
//
// IMPORTANT: keep the `.js` extension on the relative import below.
// package.json has "type": "module" so Vercel runs the compiled
// api/*.js files in Node.js ESM mode, where ESM Node requires explicit
// file extensions on relative imports. Without `.js` the runtime fails
// with ERR_MODULE_NOT_FOUND at module-load.

import {
  supabaseAdmin,
  supabaseLoadError,
  type ReqLike,
  type ResLike
} from '../_supabaseAdmin.js'

const BUCKET = 'hydromet-assets'
const MAX_BYTES = 2 * 1024 * 1024 // 2MB
const READ_TIMEOUT_MS = 25_000

const ALLOWED_TYPES: ReadonlySet<string> = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml'
])

const EXT_BY_TYPE: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/svg+xml': 'svg'
}

const FOLDER_BY_KIND: Record<string, string> = {
  'site-logo': 'logos',
  'footer-logo': 'logos',
  'leader-photo': 'leaders'
}

type StreamLike = {
  readableEnded?: boolean
  on: (event: 'data' | 'end' | 'error', listener: (arg?: unknown) => void) => StreamLike
}

function safeText(s: unknown): string {
  const raw = typeof s === 'string' ? s : (s instanceof Error ? s.message : String(s ?? ''))
  return raw.replace(/[\r\n]+/g, ' ').slice(0, 240)
}

function readBody(req: ReqLike): Promise<Buffer> {
  const pre = (req as { body?: unknown }).body
  if (pre) {
    if (Buffer.isBuffer(pre)) return Promise.resolve(pre)
    if (typeof pre === 'string') return Promise.resolve(Buffer.from(pre, 'utf8'))
    return Promise.reject(new Error('body_already_parsed'))
  }
  const stream = req as unknown as StreamLike
  if (stream.readableEnded === true) {
    return Promise.reject(new Error('stream_already_ended'))
  }
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []
    let settled = false
    const settleResolve = (buf: Buffer) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve(buf)
    }
    const settleReject = (err: Error) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      reject(err)
    }
    const timer = setTimeout(
      () => settleReject(new Error('read_timeout')),
      READ_TIMEOUT_MS
    )
    stream.on('data', (chunk) => {
      if (Buffer.isBuffer(chunk)) chunks.push(chunk)
      else if (typeof chunk === 'string') chunks.push(Buffer.from(chunk, 'utf8'))
    })
    stream.on('end', () => settleResolve(Buffer.concat(chunks)))
    stream.on('error', (err) => {
      settleReject(err instanceof Error ? err : new Error(String(err)))
    })
  })
}

type ParsedFile = {
  fieldName: string
  filename: string
  contentType: string
  data: Buffer
}
type ParsedMultipart = {
  fields: Record<string, string>
  files: ParsedFile[]
}

function parseMultipart(buf: Buffer, boundary: string): ParsedMultipart {
  const fields: Record<string, string> = {}
  const files: ParsedFile[] = []
  const delimiter = Buffer.from('--' + boundary)
  const headerSep = Buffer.from('\r\n\r\n')

  let pos = buf.indexOf(delimiter)
  if (pos < 0) return { fields, files }
  pos += delimiter.length

  while (pos < buf.length) {
    if (buf[pos] === 0x2d && buf[pos + 1] === 0x2d) break
    if (buf[pos] === 0x0d && buf[pos + 1] === 0x0a) pos += 2
    if (pos >= buf.length) break

    const headerEnd = buf.indexOf(headerSep, pos)
    if (headerEnd < 0) break
    const headers = buf.slice(pos, headerEnd).toString('utf8')
    const dataStart = headerEnd + headerSep.length
    const nextDelim = buf.indexOf(delimiter, dataStart)
    if (nextDelim < 0) break
    const dataEnd = nextDelim - 2
    if (dataEnd < dataStart) break
    const data = buf.slice(dataStart, dataEnd)

    const dispMatch = /content-disposition:\s*form-data;([^\r\n]+)/i.exec(headers)
    if (dispMatch) {
      const disp = dispMatch[1]
      const nameMatch = /name="([^"]*)"/i.exec(disp)
      const filenameMatch = /filename="([^"]*)"/i.exec(disp)
      const ctMatch = /content-type:\s*([^\r\n;]+)/i.exec(headers)
      const fieldName = nameMatch ? nameMatch[1] : ''
      if (filenameMatch && fieldName) {
        files.push({
          fieldName,
          filename: filenameMatch[1],
          contentType: ctMatch ? ctMatch[1].trim().toLowerCase() : 'application/octet-stream',
          data
        })
      } else if (fieldName) {
        fields[fieldName] = data.toString('utf8')
      }
    }
    pos = nextDelim + delimiter.length
  }

  return { fields, files }
}

function getHeader(req: ReqLike, name: string): string {
  const v = req.headers[name.toLowerCase()]
  if (Array.isArray(v)) return v[0] ?? ''
  return typeof v === 'string' ? v : ''
}

function looksLikeBucketMissing(message: string): boolean {
  const m = message.toLowerCase()
  if (m.includes('bucket not found')) return true
  if (m.includes('the resource was not found')) return true
  if (m.includes('not found') && m.includes('bucket')) return true
  return false
}

export default async function handler(req: ReqLike, res: ResLike): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('[upload] handler invoked, method=' + (req.method ?? 'unknown'))
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      res.status(405).json({ ok: false, error: 'method_not_allowed' })
      return
    }

    const adminSecret = (process.env.ADMIN_SECRET ?? '').trim()
    if (!adminSecret) {
      // eslint-disable-next-line no-console
      console.error('[upload] ADMIN_SECRET is not configured')
      res.status(500).json({ ok: false, error: 'server_not_configured', details: 'ADMIN_SECRET missing' })
      return
    }

    const provided = getHeader(req, 'x-admin-secret').trim()
    if (!provided || provided !== adminSecret) {
      res.status(401).json({ ok: false, error: 'unauthorized' })
      return
    }

    const sb = await supabaseAdmin()
    if (!sb) {
      res.status(500).json({
        ok: false,
        error: 'server_not_configured',
        details: supabaseLoadError() ?? 'env or runtime issue'
      })
      return
    }

    const ctHeader = getHeader(req, 'content-type')
    if (!/multipart\/form-data/i.test(ctHeader)) {
      res.status(400).json({ ok: false, error: 'invalid_content_type' })
      return
    }
    const boundaryMatch = /boundary=(?:"([^"]+)"|([^;\s]+))/i.exec(ctHeader)
    const boundary = boundaryMatch ? (boundaryMatch[1] ?? boundaryMatch[2] ?? '').trim() : ''
    if (!boundary) {
      res.status(400).json({ ok: false, error: 'invalid_content_type' })
      return
    }

    let raw: Buffer
    try {
      raw = await readBody(req)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[upload] failed to read request body:', e)
      res.status(400).json({ ok: false, error: 'invalid_body', details: safeText(e) })
      return
    }

    let parsed: ParsedMultipart
    try {
      parsed = parseMultipart(raw, boundary)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[upload] multipart parse failed:', e)
      res.status(400).json({ ok: false, error: 'invalid_body', details: safeText(e) })
      return
    }

    const file = parsed.files.find((f) => f.fieldName === 'file') ?? parsed.files[0]
    if (!file || file.data.length === 0) {
      res.status(400).json({ ok: false, error: 'missing_file' })
      return
    }

    const fileType = (file.contentType || '').toLowerCase()
    if (!ALLOWED_TYPES.has(fileType)) {
      res.status(400).json({ ok: false, error: 'invalid_file_type', details: fileType })
      return
    }

    if (file.data.length > MAX_BYTES) {
      res.status(400).json({ ok: false, error: 'file_too_large' })
      return
    }

    const kindRaw = (parsed.fields.kind ?? '').trim()
    const kind = kindRaw || 'asset'
    const ext = EXT_BY_TYPE[fileType] ?? 'bin'
    const folder = FOLDER_BY_KIND[kind] ?? 'misc'
    const ts = Date.now()
    const rand = Math.floor(Math.random() * 1000000).toString(36)
    const path = folder + '/' + kind + '-' + ts + '-' + rand + '.' + ext

    const up = await sb.storage.from(BUCKET).upload(path, file.data, {
      contentType: fileType,
      upsert: true,
      cacheControl: '3600'
    })

    if (up.error) {
      const message = up.error.message ?? ''
      if (looksLikeBucketMissing(message)) {
        // eslint-disable-next-line no-console
        console.error('[upload] storage_bucket_missing: ' + BUCKET + ' (' + message + ')')
        res.status(500).json({ ok: false, error: 'storage_bucket_missing', bucket: BUCKET })
        return
      }
      // eslint-disable-next-line no-console
      console.error('[upload] supabase upload error:', message, up.error)
      res.status(500).json({ ok: false, error: 'upload_failed', details: safeText(message) })
      return
    }

    const pub = sb.storage.from(BUCKET).getPublicUrl(up.data.path)
    res.status(200).json({ ok: true, url: pub.data.publicUrl, path: up.data.path })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[upload] handler crashed:', e)
    try {
      res.status(500).json({ ok: false, error: 'upload_failed', details: safeText(e) })
    } catch {
      // last-resort: nothing more we can do
    }
  }
}
