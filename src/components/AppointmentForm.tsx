import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  type ReactNode
} from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Send,
  AlertCircle,
  Paperclip,
  X as IconX,
  UserCircle,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useLanguage } from '../i18n/LanguageContext'

type FormState = {
  fullName: string
  phone: string
  email: string
  subject: string
  message: string
}

type AttachmentInfo = {
  name: string
  type: string
  size: number
  base64: string
}

type FormErrors = Partial<Record<keyof FormState | 'attachment' | 'leader', string>>

const empty: FormState = { fullName: '', phone: '', email: '', subject: '', message: '' }

const headerMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024 + 512 * 1024

const honeypotStyle: CSSProperties = {
  position: 'absolute',
  left: '-10000px',
  width: '1px',
  height: '1px',
  overflow: 'hidden'
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Invalid file read result'))
        return
      }
      const idx = result.indexOf(',')
      resolve(idx >= 0 ? result.slice(idx + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('File read failed'))
    reader.readAsDataURL(file)
  })
}

function errorMessage(code: string | undefined, t: (k: string) => string): string {
  switch (code) {
    case 'rate_limited':
      return t('contact.error.rateLimit')
    case 'missing_fields':
      return t('contact.error.required')
    case 'invalid_email':
      return t('contact.error.email')
    case 'no_recipient':
      return t('contact.error.recipient')
    case 'send_failed':
      return t('contact.error.send')
    default:
      return t('contact.error.generic')
  }
}

export function AppointmentForm() {
  const { t } = useLanguage()
  const { activeLeaders, selectedLeaderId, setSelectedLeaderId } = useAdmin()
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [attachment, setAttachment] = useState<AttachmentInfo | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const honeypotRef = useRef<HTMLInputElement | null>(null)

  const selectedLeader = useMemo(
    () => (selectedLeaderId ? activeLeaders.find((l) => l.id === selectedLeaderId) ?? null : null),
    [selectedLeaderId, activeLeaders]
  )
  const selectedLeaderPosition = selectedLeader
    ? selectedLeader.positionKey
      ? t(selectedLeader.positionKey)
      : selectedLeader.position
    : ''
  const selectedLeaderDay = selectedLeader
    ? selectedLeader.dayKey
      ? t(selectedLeader.dayKey)
      : selectedLeader.receptionDay
    : ''
  const selectedLeaderTime = selectedLeader?.receptionTime ?? ''

  useEffect(() => {
    if (!success) return
    const id = window.setTimeout(() => setSuccess(false), 8000)
    return () => window.clearTimeout(id)
  }, [success])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  function onLeaderChange(value: string) {
    setSelectedLeaderId(value || null)
    setErrors((prev) => (prev.leader ? { ...prev, leader: undefined } : prev))
  }

  function validate(): boolean {
    const next: FormErrors = {}
    if (!selectedLeader) next.leader = t('contact.error.leader')
    if (!form.fullName.trim()) next.fullName = t('contact.error.fullName')
    if (!form.phone.trim()) next.phone = t('contact.error.phone')
    const trimmedEmail = form.email.trim()
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      next.email = t('contact.error.email')
    }
    if (!form.subject.trim()) next.subject = t('contact.error.subject')
    if (!form.message.trim()) next.message = t('contact.error.message')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onAttachmentChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setErrors((prev) => ({ ...prev, attachment: t('contact.error.attachmentSize') }))
      e.target.value = ''
      return
    }
    try {
      const base64 = await readFileAsBase64(file)
      setAttachment({ name: file.name, type: file.type || 'application/octet-stream', size: file.size, base64 })
      setErrors((prev) => ({ ...prev, attachment: undefined }))
    } catch {
      setErrors((prev) => ({ ...prev, attachment: t('contact.error.attachmentRead') }))
    }
    e.target.value = ''
  }

  function clearAttachment() {
    setAttachment(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg('')
    if (!validate()) return
    if (honeypotRef.current && honeypotRef.current.value.trim() !== '') {
      setSuccess(true)
      setForm(empty)
      clearAttachment()
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        leaderName: selectedLeader?.fullName ?? '',
        leaderPosition: selectedLeaderPosition,
        leaderEmail: selectedLeader?.email ?? '',
        sentAt: new Date().toISOString(),
        attachment,
        website: ''
      }
      const res = await fetch('/api/reception-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        let code: string | undefined
        try {
          const data = (await res.json()) as { error?: string }
          code = data.error
        } catch {
          // ignore parse error
        }
        if (res.status === 429) code = 'rate_limited'
        setErrorMsg(errorMessage(code, t))
        setSubmitting(false)
        return
      }
      setSuccess(true)
      setForm(empty)
      clearAttachment()
      setSelectedLeaderId(null)
    } catch {
      setErrorMsg(t('contact.error.generic'))
    } finally {
      setSubmitting(false)
    }
  }

  const hasLeaders = activeLeaders.length > 0

  return (
    <section id="contact" className="py-10 md:py-14 lg:py-20 bg-brand-mist">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...headerMotion} className="mb-6 md:mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">
            {t('contact.eyebrow')}
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">
            {t('contact.title')}
          </h2>
          <p className="mt-3 text-[13px] sm:text-sm text-brand-muted">{t('contact.subtitle')}</p>
        </motion.div>

        {success && (
          <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 flex items-start gap-3" role="status">
            <CheckCircle2 size={22} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <div className="font-display font-bold">{t('contact.success.title')}</div>
              <div className="text-sm mt-0.5">{t('contact.success.text')}</div>
            </div>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 p-5 flex items-start gap-3" role="alert">
            <AlertCircle size={22} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <div className="font-display font-bold">{t('contact.error.title')}</div>
              <div className="text-sm mt-0.5">{errorMsg}</div>
            </div>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          noValidate
          className="grid sm:grid-cols-2 gap-5 rounded-3xl bg-white border border-slate-100 p-5 sm:p-7 lg:p-8 shadow-card"
        >
          <div className="sm:col-span-2">
            <label
              htmlFor="f-leader"
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-muted font-semibold"
            >
              <UserCircle size={13} aria-hidden="true" />
              {t('contact.field.leader')}
              <span className="text-brand-deep" aria-hidden="true">*</span>
            </label>
            <div className="mt-2 relative">
              <select
                id="f-leader"
                value={selectedLeaderId ?? ''}
                onChange={(e) => onLeaderChange(e.target.value)}
                aria-required="true"
                aria-invalid={errors.leader ? true : undefined}
                disabled={!hasLeaders}
                className="form-input appearance-none pr-10 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">{t('contact.selectLeader')}</option>
                {activeLeaders.map((l) => {
                  const position = l.positionKey ? t(l.positionKey) : l.position
                  return (
                    <option key={l.id} value={l.id}>
                      {position ? `${l.fullName} \u2014 ${position}` : l.fullName}
                    </option>
                  )
                })}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted"
              >
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 7.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <p className="mt-1.5 text-xs text-brand-muted">{t('contact.field.leader.help')}</p>
            {errors.leader && <span className="mt-1.5 block text-xs text-red-600">{errors.leader}</span>}
            {!hasLeaders && (
              <span className="mt-1.5 block text-xs text-brand-muted">{t('reception.emptyAdmin')}</span>
            )}

            {selectedLeader && (
              <div className="mt-3 rounded-2xl bg-brand-mist border border-brand-sky/30 p-4 sm:p-5 flex items-start gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-deep ring-1 ring-brand-sky/30 shrink-0">
                  <UserCircle size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-brand-muted font-semibold">
                    {t('contact.selectedLeader')}
                  </div>
                  <div className="mt-0.5 font-display font-extrabold text-brand-navy break-words">
                    {selectedLeader.fullName}
                  </div>
                  {selectedLeaderPosition && (
                    <div className="mt-0.5 text-[12.5px] sm:text-sm text-brand-muted break-words">
                      {selectedLeaderPosition}
                    </div>
                  )}
                  {(selectedLeaderDay || selectedLeaderTime) && (
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] sm:text-sm text-brand-navy">
                      {selectedLeaderDay && (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarIcon size={13} className="text-brand-deep" aria-hidden="true" />
                          <span className="font-medium">{selectedLeaderDay}</span>
                        </span>
                      )}
                      {selectedLeaderTime && (
                        <span className="inline-flex items-center gap-1.5">
                          <ClockIcon size={13} className="text-brand-deep" aria-hidden="true" />
                          <span className="font-medium">{selectedLeaderTime}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onLeaderChange('')}
                  className="text-xs font-semibold text-brand-muted hover:text-brand-deep underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 rounded px-1"
                >
                  {t('contact.clearLeader')}
                </button>
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <Field label={t('contact.field.fullName')} error={errors.fullName} htmlFor="f-fullName">
              <input
                id="f-fullName"
                autoComplete="name"
                className="form-input"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
              />
            </Field>
          </div>
          <Field label={t('contact.field.phone')} error={errors.phone} htmlFor="f-phone">
            <input
              id="f-phone"
              type="tel"
              autoComplete="tel"
              className="form-input"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </Field>
          <Field
            label={`${t('contact.field.email')} (${t('contact.optional')})`}
            error={errors.email}
            htmlFor="f-email"
          >
            <input
              id="f-email"
              type="email"
              autoComplete="email"
              className="form-input"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label={t('contact.field.subject')} error={errors.subject} htmlFor="f-subject">
              <input
                id="f-subject"
                className="form-input"
                value={form.subject}
                onChange={(e) => update('subject', e.target.value)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label={t('contact.field.message')} error={errors.message} htmlFor="f-message">
              <textarea
                id="f-message"
                rows={5}
                className="form-input resize-none"
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="f-attachment"
              className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold"
            >
              {t('contact.field.attachment')} ({t('contact.optional')})
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                id="f-attachment"
                type="file"
                className="hidden"
                onChange={onAttachmentChange}
                aria-label={t('contact.field.attachment')}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-brand-navy hover:border-brand-primary hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 transition"
              >
                <Paperclip size={14} aria-hidden="true" />
                {t('contact.attachmentPick')}
              </button>
              {attachment && (
                <span className="inline-flex items-center gap-2 max-w-full px-3 py-1.5 rounded-xl bg-brand-mist text-sm text-brand-navy">
                  <span className="truncate max-w-[200px]">{attachment.name}</span>
                  <button
                    type="button"
                    onClick={clearAttachment}
                    aria-label={t('contact.attachmentClear')}
                    className="text-brand-muted hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 rounded"
                  >
                    <IconX size={14} />
                  </button>
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs text-brand-muted">{t('contact.attachmentHelp')}</p>
            {errors.attachment && (
              <span className="mt-1.5 block text-xs text-red-600">{errors.attachment}</span>
            )}
          </div>

          <div aria-hidden="true" style={honeypotStyle}>
            <label htmlFor="website-honey">Website</label>
            <input id="website-honey" ref={honeypotRef} tabIndex={-1} autoComplete="off" />
          </div>

          <div className="sm:col-span-2 flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white font-semibold shadow-card hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
            >
              <Send size={16} aria-hidden="true" />
              {submitting ? t('contact.sending') : t('contact.submit')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

function Field({
  label,
  error,
  htmlFor,
  children
}: {
  label: string
  error?: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div className="text-sm">
      <label
        htmlFor={htmlFor}
        className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </div>
  )
}
