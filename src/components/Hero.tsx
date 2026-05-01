import { motion } from 'framer-motion'
import { CloudSun, Calendar, MapPin, Activity, Droplets, Thermometer, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

const heroMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7 }
}

const heroMotionRight = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.15 }
}

type ServiceArea = {
  id: string
  Icon: typeof CloudSun
  titleKey: string
  textKey: string
}

const serviceAreas: ServiceArea[] = [
  { id: 'forecasting', Icon: CloudSun, titleKey: 'hero.area.forecasting.title', textKey: 'hero.area.forecasting.text' },
  { id: 'hydro', Icon: Droplets, titleKey: 'hero.area.hydro.title', textKey: 'hero.area.hydro.text' },
  { id: 'climate', Icon: Thermometer, titleKey: 'hero.area.climate.title', textKey: 'hero.area.climate.text' },
  { id: 'warnings', Icon: AlertTriangle, titleKey: 'hero.area.warnings.title', textKey: 'hero.area.warnings.text' }
]

export function Hero() {
  const { t } = useLanguage()

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-brand-mist via-white to-brand-ice">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-sky/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-cyan/15 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <motion.div {...heroMotion} className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em] shadow-sm">
            <Activity size={12} />
            {t('hero.eyebrow')}
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-brand-ink tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="mt-5 text-lg text-brand-muted max-w-xl leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#weather" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white font-semibold shadow-card hover:shadow-glow transition-all">
              <CloudSun size={18} />
              {t('hero.cta.weather')}
            </a>
            <a href="#reception" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-brand-navy font-semibold shadow-sm hover:border-brand-primary hover:text-brand-deep transition-all">
              <Calendar size={18} />
              {t('hero.cta.reception')}
            </a>
            <a href="#location" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-brand-navy font-semibold shadow-sm hover:border-brand-primary hover:text-brand-deep transition-all">
              <MapPin size={18} />
              {t('hero.cta.map')}
            </a>
          </div>
        </motion.div>

        <motion.div {...heroMotionRight} className="lg:col-span-5">
          <div className="relative rounded-3xl bg-white border border-slate-100 shadow-card p-6 lg:p-7">
            <span className="text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('hero.institutional.eyebrow')}</span>
            <h2 className="mt-2 font-display text-xl lg:text-2xl font-extrabold text-brand-ink leading-tight">{t('hero.institutional.title')}</h2>
            <p className="mt-2 text-sm text-brand-muted leading-relaxed">{t('hero.institutional.subtitle')}</p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceAreas.map((area) => {
                const Icon = area.Icon
                return (
                  <div key={area.id} className="rounded-2xl bg-brand-mist/60 border border-slate-100 p-4 hover:border-brand-primary/40 hover:bg-white transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span aria-hidden="true" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white">
                        <Icon size={16} />
                      </span>
                      <span className="font-display text-sm font-bold text-brand-navy leading-tight">{t(area.titleKey)}</span>
                    </div>
                    <p className="mt-2 text-xs text-brand-muted leading-relaxed">{t(area.textKey)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
