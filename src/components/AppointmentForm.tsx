import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode
} from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Send,
  AlertCircle,
  UserCircle,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Mail,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useLanguage } from '../i18n/LanguageContext'
import { resolveText, resolveDay, stripEmailPrefix } from '../i18n/contentResolver'
import type { Lang } from '../i18n/types'

type FormState = {
  fullName: string
  phone: string
  email: string
  subject: string
  message: string
}

type FormErrors = Partial<Record<keyof FormState | 'leader' | 'recipient', string>>

type CopyTarget = 'email' | 'body' | null

const empty: FormState = { fullName: '', phone: '', email: '', subject: '', message: '' }

// Motion props as named consts to avoid inline JSX object literal mangling.
const HEADER_MOTION = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const honeypotStyle: CSSProperties = {
  position: 'absolute',
  left: '-10000px',
  width: '1px',
  height: '1px',
  overflow: 'hidden'
}

function localeForLang(lang: Lang): string {
  if (lang === 'ru') return 'ru-RU'
  if (lang === 'en') return 'en-US'
  return 'uz-UZ'
}

function formatDate(lang: Lang): string {
  try {
    return new Date().toLocaleString(localeForLang(lang), {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return new Date().toISOString()
  }
}

/** Build a localized plain-text email body from the form state. */
function buildEmailBody(
  form: FormState,
  leaderName: string,
  lang: Lang,
  t: (k: string) => string
): string {
  const greetingTpl = t('contact.bodyTemplate.greeting') // "Hurmatli {name},"
  const greeting = greetingTpl.replace('{name}', leaderName.trim() || '\u2014')
  const intro = t('contact.bodyTemplate.intro')

  const lines: string[] = []
  lines.push(greeting)
  lines.push('')
  lines.push(intro)
  lines.push('')
  lines.push(`${t('contact.bodyTemplate.fullName')}: ${form.fullName.trim()}`)
  lines.push(`${t('contact.bodyTemplate.phone')}: ${form.phone.trim()}`)
  if (form.email.trim()) {
    lines.push(`${t('contact.bodyTemplate.email')}: ${form.email.trim()}`)
  }
  lines.push('')
  lines.push(`${t('contact.bodyTemplate.subject')}: ${form.subject.trim()}`)
  lines.push('')
  lines.push(form.message.trim())
  lines.push('')
  lines.push('\u2014')
  lines.push(t('contact.bodyTemplate.footer'))
  lines.push(`${t('contact.bodyTemplate.date')}: ${formatDate(lang)}`)
  return lines.join('\n')
}

function buildEmailSubject(
  form: FormState,
  t: (k: string) => string
): string {
  const prefix = t('contact.bodyTemplate.subjectPrefix')
  const base = form.subject.trim()
  if (!prefix) return base
  return `${prefix} \u2014 ${base}`
}

function buildMailtoUrl(to: string, subject: string, body: string): string {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function buildGmailUrl(to: string, subject: string, body: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function buildOutlookUrl(to: string, subject: string, body: string): string {
  return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch { /* fall through to legacy */ }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'absolute'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export function AppointmentForm() {
  const { t, lang } = useLanguage()
  const { activeLeaders, selectedLeaderId, setSelectedLeaderId } = useAdmin()
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<FormErrors>({})
  const [opened, setOpened] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [copied, setCopied] = useState<CopyTarget>(null)
  const honeypotRef = useRef<HTMLInputElement | null>(null)
  const fallbackRef = useRef<HTMLDivElement | null>(null)

  const selectedLeader = useMemo(
    () => (selectedLeaderId ? activeLeaders.find((l) => l.id === selectedLeaderId) ?? null : null),
    [selectedLeaderId, activeLeaders]
  )
  const selectedLeaderPosition = selectedLeader
    ? resolveText(selectedLeader.position, selectedLeader.positionTranslations, selectedLeader.positionKey, lang, t)
    : ''
  const selectedLeaderDay = selectedLeader
    ? resolveDay(selectedLeader.receptionDay, selectedLeader.receptionDayTranslations, selectedLeader.dayKey, lang, t)
    : ''
  const selectedLeaderTime = selectedLeader?.receptionTime ?? ''
  const selectedLeaderEmail = stripEmailPrefix(selectedLeader?.email)
  const leaderHasEmail = Boolean(selectedLeaderEmail)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(null), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    if (opened) setOpened(false)
  }

  function onLeaderChange(value: string) {
    setSelectedLeaderId(value || null)
    setErrors((prev) => {
      const next = { ...prev }
      delete next.leader
      delete next.recipient
      return next
    })
    if (opened) setOpened(false)
  }

  function validate(): boolean {
    const next: FormErrors = {}
    if (!selectedLeader) next.leader = t('contact.error.leader')
    else if (!leaderHasEmail) next.recipient = t('contact.error.noLeaderEmail')
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

  // Memoize the email payload so it stays consistent across the submit click
  // and any subsequent fallback button presses without re-reading state.
  const emailPayload = useMemo(() => {
    if (!selectedLeader || !leaderHasEmail) return null
    const subject = buildEmailSubject(form, t)
    const body = buildEmailBody(form, selectedLeader.fullName, lang, t)
    return {
      to: selectedLeaderEmail,
      subject,
      body,
      mailto: buildMailtoUrl(selectedLeaderEmail, subject, body),
      gmail: buildGmailUrl(selectedLeaderEmail, subject, body),
      outlook: buildOutlookUrl(selectedLeaderEmail, subject, body)
    }
  }, [selectedLeader, leaderHasEmail, selectedLeaderEmail, form, lang, t])

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg('')
    if (!validate()) return
    if (honeypotRef.current && honeypotRef.current.value.trim() !== '') {
      setOpened(true)
      return
    }
    if (!emailPayload) {
      setErrorMsg(t('contact.error.recipient'))
      return
    }
    try {
      window.location.href = emailPayload.mailto
    } catch {
      // ignore -- fallback panel is still shown so user can use Gmail/Outlook
    }
    setOpened(true)
    window.setTimeout(() => {
      fallbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
  }

  async function onCopyEmail() {
    if (!emailPayload) return
    const ok = await copyToClipboard(emailPayload.to)
    if (ok) setCopied('email')
  }

  async function onCopyBody() {
    if (!emailPayload) return
    const text = `${t('contact.bodyTemplate.subject')}: ${emailPayload.subject}\n\n${emailPayload.body}`
    const ok = await copyToClipboard(text)
    if (ok) setCopied('body')
  }

  const hasLeaders = activeLeaders.length > 0
  const submitDisabled = !hasLeaders || !leaderHasEmail

  return (
    <section id="contact" className="py-10 md:py-14 lg:py-20 bg-brand-mist">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...HEADER_MOTION} className="mb-6 md:mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('contact.eyebrow')}</span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('contact.title')}</h2>
          <p className="mt-3 text-[13px] sm:text-sm text-brand-muted">{t('contact.subtitle')}</p>
        </motion.div>

        {opened && emailPayload && (
          <div ref={fallbackRef} className="mb-6 rounded-3xl bg-white border border-emerald-200 shadow-card overflow-hidden" role="status" aria-live="polite">
            <div className="bg-emerald-50 px-5 sm:px-6 py-4 border-b border-emerald-100 flex items-start gap-3">
              <CheckCircle2 size={22} className="mt-0.5 flex-shrink-0 text-emerald-600" aria-hidden="true" />
              <div>
                <div className="font-display font-bold text-emerald-900">{t('contact.success.opened.title')}</div>
                <div className="text-sm mt-0.5 text-emerald-800">{t('contact.success.opened.text')}</div>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5 space-y-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-brand-muted font-semibold">
                <Mail size={13} aria-hidden="true" />
                {t('contact.recipient')}
              </div>
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-brand-mist border border-slate-100 px-3 py-2 text-sm text-brand-navy [overflow-wrap:anywhere]">
                <Mail size={14} className="text-brand-deep flex-shrink-0" aria-hidden="true" />
                <span className="font-mono">{emailPayload.to}</span>
              </div>

              <div className="pt-1">
                <div className="text-sm font-semibold text-brand-navy">{t('contact.fallback.title')}</div>
                <div className="text-xs text-brand-muted mt-0.5">{t('contact.fallback.text')}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={emailPayload.gmail}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-brand-navy hover:border-brand-primary hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 transition"
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  {t('contact.fallback.gmail')}
                </a>
                <a
                  href={emailPayload.outlook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-brand-navy hover:border-brand-primary hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 transition"
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  {t('contact.fallback.outlook')}
                </a>
                <button
                  type="button"
                  onClick={onCopyEmail}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-brand-navy hover:border-brand-primary hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 transition"
                >
                  {copied === 'email' ? <Check size={14} className="text-emerald-600" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  {copied === 'email' ? t('contact.fallback.copied') : t('contact.fallback.copyEmail')}
                </button>
                <button
                  type="button"
                  onClick={onCopyBody}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-brand-navy hover:border-brand-primary hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 transition"
                >
                  {copied === 'body' ? <Check size={14} className="text-emerald-600" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  {copied === 'body' ? t('contact.fallback.copied') : t('contact.fallback.copyBody')}
                </button>
              </div>

              <details className="rounded-xl bg-brand-mist border border-slate-100 px-4 py-3 text-sm text-brand-navy">
                <summary className="cursor-pointer font-semibold text-brand-deep">{t('contact.fallback.previewTitle')}</summary>
                <div className="mt-3 space-y-2">
                  <div className="text-[11px] uppercase tracking-wider text-brand-muted font-semibold">{t('contact.bodyTemplate.subject')}</div>
                  <div className="rounded-lg bg-white border border-slate-100 px-3 py-2 [overflow-wrap:anywhere]">{emailPayload.subject}</div>
                  <div className="text-[11px] uppercase tracking-wider text-brand-muted font-semibold mt-3">{t('contact.fallback.bodyLabel')}</div>
                  <pre className="rounded-lg bg-white border border-slate-100 px-3 py-2 whitespace-pre-wrap font-sans text-[13px] leading-relaxed [overflow-wrap:anywhere]">{emailPayload.body}</pre>
                </div>
              </details>
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

        <form onSubmit={onSubmit} noValidate className="grid sm:grid-cols-2 gap-5 rounded-3xl bg-white border border-slate-100 p-5 sm:p-7 lg:p-8 shadow-card">
          <div className="sm:col-span-2">
            <label htmlFor="f-leader" className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-muted font-semibold">
              <UserCircle size={13} aria-hidden="true" />
              {t('contact.field.leader')}
              <span className="text-brand-deep" aria-hidden="true">*</span>
            </label>
            <div className="mt-2 relative">
              <select id="f-leader" value={selectedLeaderId ?? ''} onChange={(e) => onLeaderChange(e.target.value)} aria-required="true" aria-invalid={errors.leader ? true : undefined} disabled={!hasLeaders} className="form-input appearance-none pr-10 disabled:opacity-60 disabled:cursor-not-allowed">
                <option value="">{t('contact.selectLeader')}</option>
                {activeLeaders.map((l) => {
                  const position = resolveText(l.position, l.positionTranslations, l.positionKey, lang, t)
                  return (
                    <option key={l.id} value={l.id}>
                      {position ? `${l.fullName} \u2014 ${position}` : l.fullName}
                    </option>
                  )
                })}
              </select>
              <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 7.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <p className="mt-1.5 text-xs text-brand-muted">{t('contact.field.leader.help')}</p>
            {errors.leader && <span className="mt-1.5 block text-xs text-red-600">{errors.leader}</span>}
            {!hasLeaders && (<span className="mt-1.5 block text-xs text-brand-muted">{t('reception.emptyAdmin')}</span>)}

            {selectedLeader && (
              <div className="mt-3 rounded-2xl bg-brand-mist border border-brand-sky/30 p-4 sm:p-5 flex items-start gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-deep ring-1 ring-brand-sky/30 shrink-0">
                  <UserCircle size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-brand-muted font-semibold">{t('contact.selectedLeader')}</div>
                  <div className="mt-0.5 font-display font-extrabold text-brand-navy [overflow-wrap:anywhere]">{selectedLeader.fullName}</div>
                  {selectedLeaderPosition && (<div className="mt-0.5 text-[12.5px] sm:text-sm text-brand-muted [overflow-wrap:anywhere]">{selectedLeaderPosition}</div>)}
                  {leaderHasEmail && (
                    <div className="mt-1 text-[12.5px] sm:text-sm text-brand-navy inline-flex items-center gap-1.5 [overflow-wrap:anywhere]">
                      <Mail size={13} className="text-brand-deep" aria-hidden="true" />
                      <span className="font-mono">{selectedLeaderEmail}</span>
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
                <button type="button" onClick={() => onLeaderChange('')} className="text-xs font-semibold text-brand-muted hover:text-brand-deep underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 rounded px-1">{t('contact.clearLeader')}</button>
              </div>
            )}
            {selectedLeader && !leaderHasEmail && (
              <div className="mt-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 p-4 flex items-start gap-2.5 text-sm" role="alert">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>{t('contact.error.noLeaderEmail')}</span>
              </div>
            )}
            {errors.recipient && <span className="mt-1.5 block text-xs text-red-600">{errors.recipient}</span>}
          </div>

          <div className="sm:col-span-2">
            <Field label={t('contact.field.fullName')} error={errors.fullName} htmlFor="f-fullName">
              <input id="f-fullName" autoComplete="name" className="form-input" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
            </Field>
          </div>
          <Field label={t('contact.field.phone')} error={errors.phone} htmlFor="f-phone">
            <input id="f-phone" type="tel" autoComplete="tel" className="form-input" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </Field>
          <Field label={`${t('contact.field.email')} (${t('contact.optional')})`} error={errors.email} htmlFor="f-email">
            <input id="f-email" type="email" autoComplete="email" className="form-input" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label={t('contact.field.subject')} error={errors.subject} htmlFor="f-subject">
              <input id="f-subject" className="form-input" value={form.subject} onChange={(e) => update('subject', e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label={t('contact.field.message')} error={errors.message} htmlFor="f-message">
              <textarea id="f-message" rows={5} className="form-input resize-none" value={form.message} onChange={(e) => update('message', e.target.value)} />
            </Field>
          </div>

          <div aria-hidden="true" style={honeypotStyle}>
            <label htmlFor="website-honey">Website</label>
            <input id="website-honey" ref={honeypotRef} tabIndex={-1} autoComplete="off" />
          </div>

          <div className="sm:col-span-2 flex flex-col items-end gap-2 pt-1">
            <p className="text-[11px] text-brand-muted text-right max-w-md">{t('contact.helpline')}</p>
            <button
              type="submit"
              disabled={submitDisabled}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white font-semibold shadow-card hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
            >
              <Send size={16} aria-hidden="true" />
              {t('contact.submit')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

function Field({ label, error, htmlFor, children }: { label: string; error?: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="text-sm">
      <label htmlFor={htmlFor} className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold">{label}</label>
      <div className="mt-2">{children}</div>
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </div>
  )
}
