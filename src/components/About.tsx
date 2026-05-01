import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CloudSun, Thermometer, Droplets, Sprout, Phone, Mail } from 'lucide-react'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const cards = [
  { kind: 'cloudsun', titleKey: 'about.card.weather.title', textKey: 'about.card.weather.text' },
  { kind: 'therm', titleKey: 'about.card.climate.title', textKey: 'about.card.climate.text' },
  { kind: 'drops', titleKey: 'about.card.hydro.title', textKey: 'about.card.hydro.text' },
  { kind: 'sprout', titleKey: 'about.card.agro.title', textKey: 'about.card.agro.text' }
] as const

const leftMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const CARD_INITIAL = { opacity: 0, y: 20 }
const CARD_WHILE_IN_VIEW = { opacity: 1, y: 0 }
const CARD_VIEWPORT = { once: true }

function CardIcon({ kind }: { kind: string }) {
  if (kind === 'cloudsun') return <CloudSun size={20} />
  if (kind === 'therm') return <Thermometer size={20} />
  if (kind === 'drops') return <Droplets size={20} />
  return <Sprout size={20} />
}

function ContactRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-brand-mist border border-slate-100 flex items-center gap-3">
      <span className="w-10 h-10 rounded-lg bg-white text-brand-deep flex items-center justify-center ring-1 ring-brand-sky/30 flex-shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-brand-muted font-semibold">{label}</div>
        <div className="text-sm font-semibold text-brand-navy break-words">{value}</div>
      </div>
    </div>
  )
}

export function About() {
  const { t } = useLanguage()
  return (
    <section id="about" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <motion.div {...leftMotion} className="lg:col-span-5">
          <span className="text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('about.eyebrow')}</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('about.title')}</h2>
          <p className="mt-5 text-brand-muted leading-relaxed">{t('about.body')}</p>
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ContactRow icon={<Phone size={16} />} label={t('about.label.phone')} value={agency.phone} />
            <ContactRow icon={<Mail size={16} />} label={t('about.label.email')} value={agency.email} />
          </div>
        </motion.div>
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.titleKey}
              initial={CARD_INITIAL}
              whileInView={CARD_WHILE_IN_VIEW}
              viewport={CARD_VIEWPORT}
              transition= duration: 0.6, delay: i * 0.05 
              className="rounded-2xl bg-white p-6 border border-slate-100 shadow-card hover:shadow-glow hover:-translate-y-0.5 hover:border-brand-sky/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-ice to-white text-brand-deep flex items-center justify-center ring-1 ring-brand-sky/30">
                <CardIcon kind={c.kind} />
              </div>
              <div className="mt-4 font-display text-lg font-bold text-brand-navy">{t(c.titleKey)}</div>
              <div className="mt-1.5 text-sm text-brand-muted leading-relaxed">{t(c.textKey)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
