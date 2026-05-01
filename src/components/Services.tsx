import { motion } from 'framer-motion'
import { CloudRain, Waves, Sprout, BarChart3, Trees, Plane, Cpu, Siren } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

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

const fadeUpMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

function ServiceIcon({ id }: { id: string }) {
  if (id === 'meteo') return <CloudRain size={22} />
  if (id === 'hydro') return <Waves size={22} />
  if (id === 'agro') return <Sprout size={22} />
  if (id === 'climate') return <BarChart3 size={22} />
  if (id === 'env') return <Trees size={22} />
  if (id === 'aviation') return <Plane size={22} />
  if (id === 'digital') return <Cpu size={22} />
  return <Siren size={22} />
}

export function Services() {
  const { t } = useLanguage()
  return (
    <section id="services" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpMotion} className="mb-10 text-center">
          <span className="text-xs font-medium text-[#006BA6] uppercase tracking-wider">{t('services.eyebrow')}</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#003B5C]">{t('services.title')}</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => (
            <motion.div
              key={s.id}
              {...fadeUpMotion}
              className="rounded-xl bg-gradient-to-b from-white to-[#F5FAFD] border border-slate-100 p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-[#38BDF8]/40 transition"
            >
              <div className="w-11 h-11 rounded-xl bg-[#006BA6]/10 text-[#006BA6] flex items-center justify-center">
                <ServiceIcon id={s.id} />
              </div>
              <div className="mt-3 font-semibold text-[#003B5C]">{t(s.titleKey)}</div>
              <div className="mt-1 text-sm text-slate-600">{t(s.textKey)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
