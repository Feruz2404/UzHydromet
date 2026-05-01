import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CloudSun, Thermometer, Droplets, Sprout, Phone, Mail } from 'lucide-react'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const introMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const cardMotion = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
}

const cards = [
  { kind: 'cloudsun', titleKey: 'about.card.weather.title', textKey: 'about.card.weather.text' },
  { kind: 'therm', titleKey: 'about.card.climate.title', textKey: 'about.card.climate.text' },
  { kind: 'drops', titleKey: 'about.card.hydro.title', textKey: 'about.card.hydro.text' },
  { kind: 'sprout', titleKey: 'about.card.agro.title', textKey: 'about.card.agro.text' }
] as const

function CardIcon({ kind }: { kind: string }) {
  if (kind === 'cloudsun') return <CloudSun size={20} />
  if (kind === 'therm') return <Thermometer size={20} />
  if (kind === 'drops') return <Droplets size={20} />
  return <Sprout size={20} />
}

function ContactRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 sm:p-4 rounded-xl bg-brand-mist border border-slate-100 flex items-center gap-3">
      <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white text-brand-deep flex items-center justify-center ring-1 ring-brand-sky/30 flex-shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-brand-muted font-semibold">{label}</div>
        <div className="text-[13px] sm:text-sm font-semibold text-brand-navy break-words">{value}</div>
      </div>
    </div>
  )
}

export function About() {
  const { t } = useLanguage()
  return (
    <section id="about" className="py-10 md:py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-6 md:gap-10 lg:gap-12 items-start">
        <motion.div {...introMotion} className="lg:col-span-5">
          <span className="text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('about.eyebrow')}</span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('about.title')}</h2>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base text-brand-muted leading-relaxed">{t('about.body')}</p>
          <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ContactRow icon={<Phone size={16} />} label={t('about.label.phone')} value={agency.phone} />
            <ContactRow icon={<Mail size={16} />} label={t('about.label.email')} value={agency.email} />
          </div>
        </motion.div>
        <div className="lg:col-span-7 -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0 flex sm:grid sm:grid-cols-2 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scroll-smooth no-scrollbar">
          {cards.map((c) => (
            <motion.div
              key={c.titleKey}
              {...cardMotion}
              className="snap-start min-w-[78vw] sm:min-w-0 shrink-0 sm:shrink rounded-2xl bg-white p-5 sm:p-6 border border-slate-100 shadow-card hover:shadow-glow hover:-translate-y-0.5 hover:border-brand-sky/40 transition-all"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-ice to-white text-brand-deep flex items-center justify-center ring-1 ring-brand-sky/30">
                <CardIcon kind={c.kind} />
              </div>
              <div className="mt-3 sm:mt-4 font-display text-base sm:text-lg font-bold text-brand-navy">{t(c.titleKey)}</div>
              <div className="mt-1.5 text-[13px] sm:text-sm text-brand-muted leading-relaxed">{t(c.textKey)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
