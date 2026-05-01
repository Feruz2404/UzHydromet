import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { CheckCircle2, Send } from 'lucide-react'
import { motionPreset } from '../lib/motion'
import { useLanguage } from '../i18n/LanguageContext'
import { SectionHeader } from './SectionHeader'

const schema = z.object({
  name: z.string().min(2, 'name'),
  email: z.string().email('email'),
  phone: z.string().min(6, 'phone'),
  topic: z.string().min(1, 'topic'),
  message: z.string().min(10, 'message')
})

type FormValues = z.infer<typeof schema>

const STORAGE_KEY = 'appointments'
const resolverConfig = { resolver: zodResolver(schema) }

function appendStored(record: Record<string, unknown>): void {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const arr = raw ? (JSON.parse(raw) as Array<unknown>) : []
    arr.push(record)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
  } catch (e) { /* ignore */ }
}

function inputClass(invalid: boolean): string {
  const base = 'w-full rounded-lg border bg-white text-sm text-ink-900 px-3 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30'
  const border = invalid ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-brand-500'
  return base + ' ' + border
}

function defaultErrorMessage(k: string): string {
  if (k === 'name') return 'Please enter your full name'
  if (k === 'email') return 'Please enter a valid email address'
  if (k === 'phone') return 'Please enter a valid phone number'
  if (k === 'topic') return 'Please enter a topic'
  if (k === 'message') return 'Please enter a longer message'
  return 'Invalid value'
}

type FieldProps = { label: string; error: string; children: ReactNode }
function FormField(props: FieldProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{props.label}</span>
      {props.children}
      {props.error ? <span className="text-xs text-red-600">{props.error}</span> : null}
    </label>
  )
}

export function AppointmentForm() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState<boolean>(false)
  const methods = useForm<FormValues>(resolverConfig)
  const register = methods.register
  const handleSubmit = methods.handleSubmit
  const formState = methods.formState
  const errors = formState.errors
  const isSubmitting = formState.isSubmitting
  const reset = methods.reset

  function onSubmit(data: FormValues): void {
    const submittedAt = new Date().toISOString()
    const record: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      topic: data.topic,
      message: data.message,
      submittedAt
    }
    appendStored(record)
    setSubmitted(true)
    reset()
  }

  function errKey(name: keyof FormValues): string {
    const e = errors[name]
    if (!e) return ''
    const m = e.message
    return typeof m === 'string' ? m : ''
  }
  function fieldError(name: keyof FormValues): string {
    const k = errKey(name)
    if (!k) return ''
    return t('contact.error.' + k, defaultErrorMessage(k))
  }

  return (
    <section id="contact" className="section bg-white">
      <div className="container-page grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <SectionHeader
            eyebrow={t('contact.eyebrow', 'Contact')}
            title={t('contact.title', 'Request an appointment')}
            description={t('contact.subtitle', 'Send your question or request a meeting and we will respond shortly.')}
          />
        </div>
        <motion.form
          {...motionPreset.fadeUp}
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-7 grid gap-4 rounded-2xl bg-white border border-slate-100 shadow-card p-6"
          noValidate
        >
          <FormField label={t('contact.name', 'Full name')} error={fieldError('name')}>
            <input type="text" autoComplete="name" className={inputClass(!!errKey('name'))} {...register('name')} />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label={t('contact.email', 'Email')} error={fieldError('email')}>
              <input type="email" autoComplete="email" className={inputClass(!!errKey('email'))} {...register('email')} />
            </FormField>
            <FormField label={t('contact.phone', 'Phone')} error={fieldError('phone')}>
              <input type="tel" autoComplete="tel" className={inputClass(!!errKey('phone'))} {...register('phone')} />
            </FormField>
          </div>
          <FormField label={t('contact.topic', 'Topic')} error={fieldError('topic')}>
            <input type="text" className={inputClass(!!errKey('topic'))} {...register('topic')} />
          </FormField>
          <FormField label={t('contact.message', 'Message')} error={fieldError('message')}>
            <textarea rows={5} className={inputClass(!!errKey('message'))} {...register('message')} />
          </FormField>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {submitted ? (
              <span className="inline-flex items-center gap-2 text-emerald-600 text-sm">
                <CheckCircle2 size={16} />
                {t('contact.success', 'Thank you. We will be in touch shortly.')}
              </span>
            ) : <span />}
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              <Send size={16} />
              <span>{t('contact.submit', 'Send request')}</span>
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
