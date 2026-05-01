import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Calendar, Clock, MapPin, Award } from 'lucide-react'
import { leaders } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const headerMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const CARD_INITIAL = { opacity: 0, y: 20 }
const CARD_WHILE_IN_VIEW = { opacity: 1, y: 0 }
const CARD_VIEWPORT = { once: true }
const CARD_TRANSITION = { duration: 0.6 }

function initialsOf(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  const a = parts[0]?.charAt(0) ?? ''
  const b = parts[1]?.charAt(0) ?? ''
  return (a + b).toUpperCase()
}

function Meta({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-brand-muted">
      <span className="w-7 h-7 rounded-lg bg-white text-brand-deep ring-1 ring-slate-200 flex items-center justify-center flex-shrink-0">
        {icon}
      </span>
      <span className="text-sm break-words min-w-0">{label}</span>
    </div>
  )
}

export function Leadership() {
  const { t } = useLanguage()
  return (
    <section id="leadership" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...headerMotion} className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('leadership.eyebrow')}</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('leadership.title')}</h2>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {leaders.map((l) => (
            <motion.div
              key={l.name}
              initial={CARD_INITIAL}
              whileInView={CARD_WHILE_IN_VIEW}
              viewport={CARD_VIEWPORT}
              transition={CARD_TRANSITION}
              className="relative rounded-3xl bg-gradient-to-br from-white via-white to-brand-mist border border-slate-100 p-7 shadow-card hover:shadow-glow transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 -translate-y-12 translate-x-12 rounded-full bg-brand-ice/60 blur-2xl pointer-events-none" aria-hidden="true" />
              <div className="relative flex items-start gap-5">
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary via-brand-deep to-brand-navy text-white flex items-center justify-center text-xl font-display font-bold shadow-card flex-shrink-0">
                  {initialsOf(l.name)}
                  <span className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white text-brand-deep flex items-center justify-center ring-2 ring-white shadow">
                    <Award size={14} />
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-brand-deep uppercase tracking-wider">{t(l.positionKey)}</div>
                  <div className="mt-1 font-display text-lg font-bold text-brand-navy leading-snug break-words">{l.name}</div>
                </div>
              </div>
              <p className="relative mt-5 text-sm text-brand-muted leading-relaxed">{t(l.descriptionKey)}</p>
              <div className="relative mt-5 grid sm:grid-cols-2 gap-2.5">
                <Meta icon={<Calendar size={14} />} label={`${t('leadership.reception')}: ${t(l.dayKey)}`} />
                <Meta icon={<Clock size={14} />} label={l.receptionTime} />
                <Meta icon={<Phone size={14} />} label={l.phone} />
                <Meta icon={<Mail size={14} />} label={l.email} />
                <div className="sm:col-span-2">
                  <Meta icon={<MapPin size={14} />} label={t(l.officeKey)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
