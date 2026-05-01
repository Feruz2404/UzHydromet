import { useState, type FormEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
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

const fadeUpMotion = {
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
    <section id="contact" className="py-16 lg:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpMotion} className="mb-10 text-center">
          <span className="text-xs font-medium text-[#006BA6] uppercase tracking-wider">{t('contact.eyebrow')}</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#003B5C]">{t('contact.title')}</h2>
          <p className="mt-3 text-slate-600">{t('contact.subtitle')}</p>
        </motion.div>

        {success && (
          <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 flex items-center gap-3">
            <CheckCircle2 size={20} />
            <div>
              <div className="font-medium">{t('contact.success.title')}</div>
              <div className="text-sm">{t('contact.success.text')}</div>
            </div>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          noValidate
          className="grid sm:grid-cols-2 gap-4 rounded-2xl bg-[#F5FAFD] border border-slate-100 p-6 shadow-sm"
        >
          <Field label={t('contact.field.firstName')} error={errors.firstName} htmlFor="f-firstName">
            <input id="f-firstName" autoComplete="given-name" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#006BA6]" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
          </Field>
          <Field label={t('contact.field.lastName')} error={errors.lastName} htmlFor="f-lastName">
            <input id="f-lastName" autoComplete="family-name" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#006BA6]" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
          </Field>
          <Field label={t('contact.field.phone')} error={errors.phone} htmlFor="f-phone">
            <input id="f-phone" type="tel" autoComplete="tel" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#006BA6]" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </Field>
          <Field label={t('contact.field.email')} htmlFor="f-email">
            <input id="f-email" type="email" autoComplete="email" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#006BA6]" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </Field>
          <Field label={t('contact.field.leader')} error={errors.leader} htmlFor="f-leader">
            <select id="f-leader" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#006BA6]" value={form.leader} onChange={(e) => update('leader', e.target.value)}>
              <option value="">{t('contact.selectLeader')}</option>
              {leaders.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name} - {t(l.positionKey)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('contact.field.preferredDate')} htmlFor="f-date">
            <input id="f-date" type="date" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#006BA6]" value={form.date} onChange={(e) => update('date', e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label={t('contact.field.subject')} error={errors.subject} htmlFor="f-subject">
              <input id="f-subject" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#006BA6]" value={form.subject} onChange={(e) => update('subject', e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label={t('contact.field.message')} htmlFor="f-message">
              <textarea id="f-message" rows={4} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#006BA6]" value={form.message} onChange={(e) => update('message', e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" className="px-6 py-3 rounded-lg bg-[#006BA6] text-white font-medium hover:bg-[#003B5C] transition shadow-sm shadow-[#006BA6]/20">
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
      <label htmlFor={htmlFor} className="text-slate-700 font-medium">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </div>
  )
}
