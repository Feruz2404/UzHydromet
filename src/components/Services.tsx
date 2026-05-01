import { motion } from 'framer-motion'
import { CloudRain, Waves, Sprout, BarChart3, Trees, Plane, Cpu, Siren } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

const headerMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
}

const cardMotion = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
}

const services = [
  { id: 'meteo', titleKey: 'services.meteo.title', textKey: 'services.meteo.text' },
  { id: 'hydro', titleKey: 'services.hydro.title', textKey: 'services.hydro.text' },
  { id: 'agro', titleKey: 'services.agro.title', textKey: 'services.agro.text' },
  { id: 'climate', titleKey: 'services.climate.title', textKey: 'services.climate.text' },
  { id: 'env', titleKey: 'services.env.title', textKey: 'services.env.text' },
  { id: 'aviation', titleKey: 'services.aviation.title', textKey: 'services.aviation.text' },
  { id: 'digital', titleKey: 'services.digital.title', textKey: 'services.digital.text' },
  { id: 'alerts', titleKey: 'services.alerts.title', textKey: 'services.alerts.text' }
] as const

function ServiceIcon({ id }: { id: string }) {
  if (id === 'meteo') return <CloudRain size={20} />
  if (id === 'hydro') return <Waves size={20} />
  if (id === 'agro') return <Sprout size={20} />
  if (id === 'climate') return <BarChart3 size={20} />
  if (id === 'env') return <Trees size={20} />
  if (id === 'aviation') return <Plane size={20} />
  if (id === 'digital') return <Cpu size={20} />
  return <Siren size={20} />
}

export function Services() {
  const { t } = useLanguage()
  return (
    <section id="services" className="py-10 md:py-14 lg:py-20 bg-brand-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...headerMotion} className="mb-6 md:mb-12 text-center max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('services.eyebrow')}</span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight text-balance">{t('services.title')}</h2>
        </motion.div>
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scroll-smooth no-scrollbar">
          {services.map((s) => (
            <motion.div
              key={s.id}
              {...cardMotion}
              className="snap-start min-w-[72vw] sm:min-w-0 shrink-0 sm:shrink group relative rounded-2xl bg-white p-5 sm:p-6 border border-slate-100 shadow-card hover:shadow-glow hover:-translate-y-1 hover:border-brand-sky/50 transition-all overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-ice opacity-0 group-hover:opacity-80 transition-opacity" aria-hidden="true" />
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-deep to-brand-primary text-white flex items-center justify-center shadow-card">
                <ServiceIcon id={s.id} />
              </div>
              <div className="relative mt-3 sm:mt-4 font-display text-base sm:text-lg font-bold text-brand-navy">{t(s.titleKey)}</div>
              <div className="relative mt-1.5 text-[13px] sm:text-sm text-brand-muted leading-relaxed">{t(s.textKey)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
