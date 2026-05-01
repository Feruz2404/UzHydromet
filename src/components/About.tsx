import { motion } from 'framer-motion'
import { CloudSun, Thermometer, Droplets, Sprout } from 'lucide-react'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const cards = [
  { kind: 'cloudsun', titleKey: 'about.card.weather.title', textKey: 'about.card.weather.text' },
  { kind: 'therm', titleKey: 'about.card.climate.title', textKey: 'about.card.climate.text' },
  { kind: 'drops', titleKey: 'about.card.hydro.title', textKey: 'about.card.hydro.text' },
  { kind: 'sprout', titleKey: 'about.card.agro.title', textKey: 'about.card.agro.text' }
] as const

const fadeUpMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

function CardIcon({ kind }: { kind: string }) {
  if (kind === 'cloudsun') return <CloudSun size={20} />
  if (kind === 'therm') return <Thermometer size={20} />
  if (kind === 'drops') return <Droplets size={20} />
  return <Sprout size={20} />
}

export function About() {
  const { t } = useLanguage()
  return (
    <section id="about" className="py-16 lg:py-20 bg-[#F5FAFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUpMotion}>
          <span className="text-xs font-medium text-[#006BA6] uppercase tracking-wider">{t('about.eyebrow')}</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#003B5C]">{t('about.title')}</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">{t('about.body')}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white border border-slate-100">
              <div className="text-xs text-slate-500">{t('about.label.phone')}</div>
              <div className="text-sm font-medium text-[#003B5C]">{agency.phone}</div>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-100">
              <div className="text-xs text-slate-500">{t('about.label.email')}</div>
              <div className="text-sm font-medium text-[#003B5C]">{agency.email}</div>
            </div>
          </div>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((c) => (
            <motion.div key={c.titleKey} {...fadeUpMotion} className="rounded-xl bg-white p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
              <div className="w-10 h-10 rounded-lg bg-[#006BA6]/10 text-[#006BA6] flex items-center justify-center">
                <CardIcon kind={c.kind} />
              </div>
              <div className="mt-3 font-semibold text-[#003B5C]">{t(c.titleKey)}</div>
              <div className="mt-1 text-sm text-slate-600">{t(c.textKey)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
