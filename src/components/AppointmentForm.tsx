import { useState, type FormEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Send } from 'lucide-react'
import { leaders } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

type FormState = {
  firstName: string
  lastName: string
  phone: string
  email: string
  leader: string
  subject: string
  message: string
  date: string
}

const empty: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  leader: '',
  subject: '',
  message: '',
  date: ''
}

const headerMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

type FormErrors = Partial<Record<keyof FormState, string>>

export function AppointmentForm() {
  const { t } = useLanguage()
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState<boolean>(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: FormErrors = {}
    if (!form.firstName.trim()) next.firstName = t('contact.error.firstName')
    if (!form.lastName.trim()) next.lastName = t('contact.error.lastName')
    if (!form.phone.trim()) next.phone = t('contact.error.phone')
    if (!form.leader) next.leader = t('contact.error.leader')
    if (!form.subject.trim()) next.subject = t('contact.error.subject')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return
    try {
      const raw = window.localStorage.getItem('appointments')
      const queue = raw ? (JSON.parse(raw) as unknown[]) : []
      queue.push({ ...form, createdAt: new Date().toISOString() })
      window.localStorage.setItem('appointments', JSON.stringify(queue))
    } catch {
      // ignore storage errors
    }
    setSuccess(true)
    setForm(empty)
  }

  return (
    <section id="contact" className="py-16 lg:py-24 bg-brand-mist">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...headerMotion} className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('contact.eyebrow')}</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('contact.title')}</h2>
          <p className="mt-3 text-brand-muted">{t('contact.subtitle')}</p>
        </motion.div>

        {success && (
          <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 flex items-start gap-3">
            <CheckCircle2 size={22} className="mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-display font-bold">{t('contact.success.title')}</div>
              <div className="text-sm mt-0.5">{t('contact.success.text')}</div>
            </div>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          noValidate
          className="grid sm:grid-cols-2 gap-5 rounded-3xl bg-white border border-slate-100 p-7 lg:p-8 shadow-card"
        >
          <Field label={t('contact.field.firstName')} error={errors.firstName} htmlFor="f-firstName">
            <input id="f-firstName" autoComplete="given-name" className="form-input" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
          </Field>
          <Field label={t('contact.field.lastName')} error={errors.lastName} htmlFor="f-lastName">
            <input id="f-lastName" autoComplete="family-name" className="form-input" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
          </Field>
          <Field label={t('contact.field.phone')} error={errors.phone} htmlFor="f-phone">
            <input id="f-phone" type="tel" autoComplete="tel" className="form-input" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </Field>
          <Field label={t('contact.field.email')} htmlFor="f-email">
            <input id="f-email" type="email" autoComplete="email" className="form-input" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </Field>
          <Field label={t('contact.field.leader')} error={errors.leader} htmlFor="f-leader">
            <select id="f-leader" className="form-input" value={form.leader} onChange={(e) => update('leader', e.target.value)}>
              <option value="">{t('contact.selectLeader')}</option>
              {leaders.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name} - {t(l.positionKey)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('contact.field.preferredDate')} htmlFor="f-date">
            <input id="f-date" type="date" className="form-input" value={form.date} onChange={(e) => update('date', e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label={t('contact.field.subject')} error={errors.subject} htmlFor="f-subject">
              <input id="f-subject" className="form-input" value={form.subject} onChange={(e) => update('subject', e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label={t('contact.field.message')} htmlFor="f-message">
              <textarea id="f-message" rows={4} className="form-input resize-none" value={form.message} onChange={(e) => update('message', e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2 flex justify-end pt-1">
            <button type="submit" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white font-semibold shadow-card hover:shadow-glow transition-all">
              <Send size={16} />
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
      <label htmlFor={htmlFor} className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </div>
  )
}
