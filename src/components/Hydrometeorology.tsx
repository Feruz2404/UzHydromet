import { motion } from 'framer-motion'
import { Cloud, CloudRain, Droplets, ThermometerSun, Sprout, AlertTriangle, Cpu, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { hydrometAreas, hydrometImportance } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const headerMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const importanceMotion = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
}

const cardMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
}

const areaIcon: Record<string, LucideIcon> = {
  meteo: Cloud,
  forecast: CloudRain,
  hydro: Droplets,
  climate: ThermometerSun,
  agro: Sprout,
  warnings: AlertTriangle,
  digital: Cpu
}

export function Hydrometeorology() {
  const { t } = useLanguage()

  return (
    <section id="hydromet" className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...headerMotion} className="max-w-3xl">
          <span className="text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('hydromet.eyebrow')}</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('hydromet.title')}</h2>
          <p className="mt-4 text-brand-muted leading-relaxed">{t('hydromet.body')}</p>
        </motion.div>

        <motion.div {...importanceMotion} className="mt-8 md:mt-10 rounded-3xl bg-gradient-to-br from-brand-mist to-white border border-slate-100 p-5 sm:p-6 lg:p-8 shadow-card">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white shrink-0">
              <ShieldCheck size={16} />
            </span>
            <h3 className="font-display text-lg lg:text-xl font-extrabold text-brand-navy">{t('hydromet.importance.title')}</h3>
          </div>
          <p className="mt-2 text-sm text-brand-muted">{t('hydromet.importance.lead')}</p>
          <ul className="mt-5 grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {hydrometImportance.map((item) => (
              <li key={item.id} className="flex items-start gap-2 rounded-xl bg-white border border-slate-100 px-3.5 py-2.5">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-primary" />
                <span className="text-sm text-brand-navy font-medium leading-snug">{t(item.key)}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="mt-10 md:mt-12">
          <h3 className="font-display text-2xl md:text-3xl font-extrabold text-brand-ink tracking-tight">{t('hydromet.areas.title')}</h3>
          <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none">
            {hydrometAreas.map((area) => {
              const Icon = areaIcon[area.id] ?? Cloud
              return (
                <motion.div key={area.id} {...cardMotion} className="snap-start min-w-[78vw] sm:min-w-0 shrink-0 sm:shrink rounded-2xl bg-white border border-slate-100 p-5 shadow-card hover:shadow-glow hover:border-brand-primary/30 transition-all">
                  <span aria-hidden="true" className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white">
                    <Icon size={20} />
                  </span>
                  <h4 className="mt-4 font-display text-base font-extrabold text-brand-navy leading-snug">{t(area.titleKey)}</h4>
                  <p className="mt-2 text-sm text-brand-muted leading-relaxed">{t(area.textKey)}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
