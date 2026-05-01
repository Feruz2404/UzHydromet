import { motion } from 'framer-motion'
import { CheckCircle2, MapPin, Phone, Mail, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motionPreset } from '../lib/motion'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../store/contentStore'
import { SectionHeader } from './SectionHeader'

type Highlight = { id: string; labelKey: string; fallback: string }
const highlights: Highlight[] = [
  { id: 'mission', labelKey: 'about.h.mission', fallback: 'National mission' },
  { id: 'science', labelKey: 'about.h.science', fallback: 'Scientific accuracy' },
  { id: 'open', labelKey: 'about.h.open', fallback: 'Open data and transparency' },
  { id: 'modern', labelKey: 'about.h.modern', fallback: 'Modern infrastructure' }
]

type Fact = { id: string; icon: LucideIcon; value: string }

function FactRow(props: { fact: Fact }) {
  const Icon = props.fact.icon
  return (
    <li className="flex items-start gap-3">
      <span aria-hidden="true" className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </span>
      <span className="text-sm text-slate-700 mt-1.5 break-words">{props.fact.value}</span>
    </li>
  )
}

export function About() {
  const { lang, t } = useLanguage()
  const { content } = useContent()
  const facts: Fact[] = [
    { id: 'address', icon: MapPin, value: content.contact.address },
    { id: 'phone', icon: Phone, value: content.contact.phone },
    { id: 'email', icon: Mail, value: content.contact.email },
    { id: 'website', icon: Globe, value: content.contact.website }
  ]
  return (
    <section id="about" className="section bg-bg">
      <div className="container-page grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <SectionHeader
            eyebrow={t('about.eyebrow', 'About the agency')}
            title={t('about.title', 'Hydrometeorological Service Agency')}
            description={content.about.body[lang]}
          />
          <motion.ul {...motionPreset.fadeUp} className="mt-7 grid sm:grid-cols-2 gap-3">
            {highlights.map((h) => (
              <li key={h.id} className="flex items-start gap-3 rounded-xl bg-white border border-slate-100 p-4 shadow-sm">
                <CheckCircle2 size={20} className="text-brand-600 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">{t(h.labelKey, h.fallback)}</span>
              </li>
            ))}
          </motion.ul>
        </div>
        <motion.aside {...motionPreset.slideLeft} className="lg:col-span-5 rounded-2xl bg-white border border-slate-100 shadow-card p-6">
          <h3 className="text-base font-semibold text-ink-900">{t('about.glanceTitle', 'At a glance')}</h3>
          <ul className="mt-4 space-y-3">
            {facts.map((f) => (
              <FactRow key={f.id} fact={f} />
            ))}
          </ul>
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-xs uppercase tracking-wider text-slate-500">{t('about.hoursLabel', 'Working hours')}</div>
            <div className="text-sm font-medium text-ink-900 mt-1">{content.contact.workingHours[lang]}</div>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}
