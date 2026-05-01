import { motion } from 'framer-motion'
import { CloudSun, Calendar, MapPin, Activity, Droplets, Thermometer, AlertTriangle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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

type Bullet = {
  id: string
  Icon: LucideIcon
  titleKey: string
  textKey: string
}

const bullets: Bullet[] = [
  { id: 'forecasting', Icon: CloudSun, titleKey: 'hero.area.forecasting.title', textKey: 'hero.area.forecasting.text' },
  { id: 'hydro', Icon: Droplets, titleKey: 'hero.area.hydro.title', textKey: 'hero.area.hydro.text' },
  { id: 'climate', Icon: Thermometer, titleKey: 'hero.area.climate.title', textKey: 'hero.area.climate.text' },
  { id: 'warnings', Icon: AlertTriangle, titleKey: 'hero.area.warnings.title', textKey: 'hero.area.warnings.text' }
]

export function Hero() {
  const { t } = useLanguage()

  return (
    <section id="home" className="relative overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-brand-mist via-white to-brand-ice">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-sky/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-cyan/15 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center">
        <motion.div {...heroMotion} className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em] shadow-sm">
            <Activity size={12} />
            {t('hero.eyebrow')}
          </span>
          <h1 className="mt-4 font-display text-[26px] sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-brand-ink tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-brand-muted max-w-xl leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="mt-5 sm:mt-7 flex flex-wrap gap-2.5 sm:gap-3">
            <a href="#weather" className="inline-flex items-center gap-2 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white font-semibold text-sm sm:text-base shadow-card hover:shadow-glow transition-all">
              <CloudSun size={18} />
              {t('hero.cta.weather')}
            </a>
            <a href="#reception" className="inline-flex items-center gap-2 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-brand-navy font-semibold text-sm sm:text-base shadow-sm hover:border-brand-primary hover:text-brand-deep transition-all">
              <Calendar size={18} />
              {t('hero.cta.reception')}
            </a>
            <a href="#location" className="inline-flex items-center gap-2 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-brand-navy font-semibold text-sm sm:text-base shadow-sm hover:border-brand-primary hover:text-brand-deep transition-all">
              <MapPin size={18} />
              {t('hero.cta.map')}
            </a>
          </div>
        </motion.div>

        <motion.div {...heroMotionRight} className="lg:col-span-5">
          <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-card p-4 sm:p-5 lg:p-7">
            <span className="text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('hero.institutional.eyebrow')}</span>
            <h2 className="mt-2 font-display text-base sm:text-lg lg:text-2xl font-extrabold text-brand-ink leading-tight">{t('hero.institutional.title')}</h2>
            <p className="mt-2 text-xs sm:text-sm text-brand-muted leading-relaxed">{t('hero.institutional.subtitle')}</p>
            <ul className="mt-4 space-y-2.5 sm:space-y-3">
              {bullets.map((b) => {
                const Icon = b.Icon
                return (
                  <li key={b.id} className="flex items-start gap-3">
                    <span aria-hidden="true" className="inline-flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-brand-mist text-brand-deep ring-1 ring-brand-sky/20">
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0">
                      <div className="font-display text-[13px] sm:text-sm font-bold text-brand-navy leading-tight">{t(b.titleKey)}</div>
                      <p className="mt-0.5 text-[11px] sm:text-xs text-brand-muted leading-snug">{t(b.textKey)}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
