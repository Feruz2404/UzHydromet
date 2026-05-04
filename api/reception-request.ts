// Vercel serverless function: POST /api/reception-request
// Receives a public reception request from the frontend and forwards an email
// to the selected leader (or a fallback recipient) via Resend or SMTP.
//
// All credentials are read from environment variables and are NEVER exposed to
// the client. Validates the request, supports a honeypot, and applies a simple
// in-memory rate limit per IP.

type Method = 'GET' | 'POST' | 'OPTIONS' | string

type ReqLike = {
  method?: Method
  body?: unknown
  headers: Record<string, string | string[] | undefined>
  socket?: { remoteAddress?: string }
}
type ResLike = {
  status: (code: number) => ResLike
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
  end?: () => void
}

type Body = {
  fullName?: string
  phone?: string
  email?: string
  subject?: string
  message?: string
  leaderName?: string
  leaderPosition?: string
  leaderEmail?: string
  attachment?: { filename?: string; content?: string; contentType?: string } | null
  // honeypot: should always be empty
  website?: string
}

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5
const MAX_ATTACHMENT_BYTES = 5_000_000

const hits: Map<string, number[]> = new Map()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const arr = hits.get(ip) ?? []
  const recent = arr.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}

function isEmail(s: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    if (c === '&') return '&amp;'
    if (c === '<') return '&lt;'
    if (c === '>') return '&gt;'
    if (c === '"') return '&quot;'
    return '&#39;'
  })
}

function clientIp(req: ReqLike): string {
  const xff = req.headers['x-forwarded-for']
  const xffStr = Array.isArray(xff) ? xff[0] : xff
  const ip = (xffStr ? xffStr.split(',')[0] : req.socket?.remoteAddress) ?? 'unknown'
  return ip.trim()
}

async function sendViaResend(args: {
  apiKey: string
  from: string
  to: string
  replyTo?: string
  subject: string
  text: string
  html: string
  attachments: Array<{ filename: string; content: string }>
}): Promise<{ ok: boolean; status: number; detail?: string }> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${args.apiKey}`
    },
    body: JSON.stringify({
      from: args.from,
      to: [args.to],
      reply_to: args.replyTo,
      subject: args.subject,
      text: args.text,
      html: args.html,
      attachments: args.attachments.length > 0 ? args.attachments : undefined
    })
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return { ok: false, status: res.status, detail }
  }
  return { ok: true, status: res.status }
}

export default async function handler(req: ReqLike, res: ResLike): Promise<void> {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      res.status(405).json({ error: 'method_not_allowed' })
      return
    }

    const ip = clientIp(req)
    if (rateLimited(ip)) {
      res.status(429).json({ error: 'rate_limited' })
      return
    }

    const raw = req.body
    let body: Body
    if (typeof raw === 'string') {
      try { body = JSON.parse(raw) as Body } catch { res.status(400).json({ error: 'invalid_json' }); return }
    } else if (raw && typeof raw === 'object') {
      body = raw as Body
    } else {
      body = {}
    }

    // Honeypot: if 'website' has any value, silently accept and drop.
    if (body.website && body.website.trim().length > 0) {
      res.status(200).json({ ok: true })
      return
    }

    const fullName = (body.fullName ?? '').toString().trim()
    const phone = (body.phone ?? '').toString().trim()
    const subject = (body.subject ?? '').toString().trim()
    const message = (body.message ?? '').toString().trim()
    const userEmail = (body.email ?? '').toString().trim()
    const leaderName = (body.leaderName ?? '').toString().trim()
    const leaderPosition = (body.leaderPosition ?? '').toString().trim()
    const leaderEmail = (body.leaderEmail ?? '').toString().trim()

    if (!fullName || !phone || !subject || !message) {
      res.status(400).json({ error: 'missing_required_fields' })
      return
    }
    if (fullName.length > 200 || phone.length > 60 || subject.length > 200 || message.length > 5000) {
      res.status(400).json({ error: 'field_too_long' })
      return
    }
    if (userEmail && !isEmail(userEmail)) {
      res.status(400).json({ error: 'invalid_email' })
      return
    }

    const fallback = (process.env.DEFAULT_RECEPTION_EMAIL ?? '').trim()
    const target = leaderEmail && isEmail(leaderEmail) ? leaderEmail : fallback
    if (!target || !isEmail(target)) {
      res.status(500).json({ error: 'no_recipient_configured' })
      return
    }

    const fromEmail = (process.env.FROM_EMAIL ?? '').trim() || 'no-reply@meteo.uz'
    const sentAt = new Date().toISOString()
    const subjectFinal = `Qabulga yozilish so'rovi \u2014 ${leaderName || 'O\'zgidromet'}`

    const textLines = [
      `Tanlangan rahbar: ${leaderName || '-'}`,
      `Lavozimi: ${leaderPosition || '-'}`,
      `Foydalanuvchi F.I.Sh: ${fullName}`,
      `Telefon: ${phone}`,
      `Email: ${userEmail || '-'}`,
      `Mavzu: ${subject}`,
      '',
      'Xabar matni:',
      message,
      '',
      `Yuborilgan: ${sentAt}`
    ]
    const text = textLines.join('\n')
    const html = `<div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0F172A;font-size:14px;line-height:1.6">
      <h2 style="font-family:'Plus Jakarta Sans',Inter,sans-serif;color:#0A2740;margin:0 0 12px">Qabulga yozilish so'rovi</h2>
      <table cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-size:14px">
        <tr><td style="color:#5B6B7A">Tanlangan rahbar</td><td style="font-weight:600">${escapeHtml(leaderName || '-')}</td></tr>
        <tr><td style="color:#5B6B7A">Lavozimi</td><td>${escapeHtml(leaderPosition || '-')}</td></tr>
        <tr><td style="color:#5B6B7A">Foydalanuvchi</td><td style="font-weight:600">${escapeHtml(fullName)}</td></tr>
        <tr><td style="color:#5B6B7A">Telefon</td><td>${escapeHtml(phone)}</td></tr>
        <tr><td style="color:#5B6B7A">Email</td><td>${escapeHtml(userEmail || '-')}</td></tr>
        <tr><td style="color:#5B6B7A">Mavzu</td><td>${escapeHtml(subject)}</td></tr>
        <tr><td style="color:#5B6B7A;vertical-align:top">Xabar</td><td><div style="white-space:pre-wrap">${escapeHtml(message)}</div></td></tr>
        <tr><td style="color:#5B6B7A">Yuborilgan</td><td>${escapeHtml(sentAt)}</td></tr>
      </table>
    </div>`

    const attachments: Array<{ filename: string; content: string }> = []
    if (body.attachment && typeof body.attachment.content === 'string' && typeof body.attachment.filename === 'string') {
      const fname = body.attachment.filename.replace(/[^\w.\-+ ]/g, '_').slice(0, 200)
      const b64 = body.attachment.content.replace(/^data:.*;base64,/, '')
      // Approximate byte size of base64 string
      const approxBytes = Math.floor(b64.length * 0.75)
      if (approxBytes > 0 && approxBytes <= MAX_ATTACHMENT_BYTES) {
        attachments.push({ filename: fname, content: b64 })
      }
    }

    const replyTo = userEmail && isEmail(userEmail) ? userEmail : undefined

    const resendKey = (process.env.RESEND_API_KEY ?? '').trim()
    if (resendKey) {
      const result = await sendViaResend({
        apiKey: resendKey,
        from: fromEmail,
        to: target,
        replyTo,
        subject: subjectFinal,
        text,
        html,
        attachments
      })
      if (!result.ok) {
        // eslint-disable-next-line no-console
        console.error('Resend error', result.status, result.detail)
        res.status(500).json({ error: 'email_send_failed' })
        return
      }
      res.status(200).json({ ok: true })
      return
    }

    // SMTP path: requires nodemailer to be installed at runtime.
    const smtpHost = (process.env.SMTP_HOST ?? '').trim()
    if (smtpHost) {
      try {
        // nodemailer is an OPTIONAL runtime dependency — only used when SMTP_HOST
        // is set. We don't ship it in package.json so Resend-only deployments
        // stay lean; the .catch(() => null) below handles a missing module.
        // @ts-expect-error optional runtime dependency, may not be installed
        const nm: any = await import('nodemailer').then((m) => m.default ?? m).catch(() => null)
        if (!nm) {
          // eslint-disable-next-line no-console
          console.error('nodemailer not installed; cannot send via SMTP. Install nodemailer or use RESEND_API_KEY instead.')
          res.status(500).json({ error: 'smtp_unavailable' })
          return
        }
        const port = Number(process.env.SMTP_PORT ?? '587') || 587
        const transporter = nm.createTransport({
          host: smtpHost,
          port,
          secure: port === 465,
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
        })
        await transporter.sendMail({
          from: fromEmail,
          to: target,
          replyTo,
          subject: subjectFinal,
          text,
          html,
          attachments: attachments.length > 0
            ? attachments.map((a) => ({ filename: a.filename, content: a.content, encoding: 'base64' }))
            : undefined
        })
        res.status(200).json({ ok: true })
        return
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('SMTP send error', e)
        res.status(500).json({ error: 'email_send_failed' })
        return
      }
    }

    // No provider configured. Log and return ok=true with a dev flag so local
    // testing isn't blocked when env is incomplete.
    // eslint-disable-next-line no-console
    console.warn('reception-request: no email provider configured. Payload:', { target, subjectFinal, fullName, phone })
    res.status(200).json({ ok: true, dev: true })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('reception-request handler error', e)
    res.status(500).json({ error: 'server_error' })
  }
}
