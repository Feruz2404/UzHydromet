import { useState, type FormEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { leaders } from '../data/defaultContent'

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
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState<boolean>(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: FormErrors = {}
    if (!form.firstName.trim()) next.firstName = 'First name is required'
    if (!form.lastName.trim()) next.lastName = 'Last name is required'
    if (!form.phone.trim()) next.phone = 'Phone number is required'
    if (!form.leader) next.leader = 'Please select a leader'
    if (!form.subject.trim()) next.subject = 'Subject is required'
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
          <span className="text-xs font-medium text-[#006BA6] uppercase">Contact</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#003B5C]">Request an Appointment</h2>
          <p className="mt-3 text-slate-600">Fill out the form to request a reception appointment.</p>
        </motion.div>

        {success && (
          <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 flex items-center gap-3">
            <CheckCircle2 size={20} />
            <div>
              <div className="font-medium">Request submitted</div>
              <div className="text-sm">We have received your request and will get back to you shortly.</div>
            </div>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          noValidate
          className="grid sm:grid-cols-2 gap-4 rounded-2xl bg-[#F5FAFD] border border-slate-100 p-6"
        >
          <Field label="First Name" error={errors.firstName} htmlFor="f-firstName">
            <input
              id="f-firstName"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
            />
          </Field>
          <Field label="Last Name" error={errors.lastName} htmlFor="f-lastName">
            <input
              id="f-lastName"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
            />
          </Field>
          <Field label="Phone Number" error={errors.phone} htmlFor="f-phone">
            <input
              id="f-phone"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </Field>
          <Field label="Email" htmlFor="f-email">
            <input
              id="f-email"
              type="email"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </Field>
          <Field label="Leader" error={errors.leader} htmlFor="f-leader">
            <select
              id="f-leader"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              value={form.leader}
              onChange={(e) => update('leader', e.target.value)}
            >
              <option value="">Select a leader</option>
              {leaders.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name} - {l.position}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Preferred Date" htmlFor="f-date">
            <input
              id="f-date"
              type="date"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Subject" error={errors.subject} htmlFor="f-subject">
              <input
                id="f-subject"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                value={form.subject}
                onChange={(e) => update('subject', e.target.value)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Message" htmlFor="f-message">
              <textarea
                id="f-message"
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#006BA6] text-white font-medium hover:bg-[#003B5C] transition"
            >
              Submit Request
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
      <label htmlFor={htmlFor} className="text-slate-700 font-medium">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </div>
  )
}
