import { motion } from 'framer-motion'
import { Activity, MapPin, Calendar, ShieldAlert } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

const heroMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const heroMotionRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, delay: 0.2 }
}

const stats = [
  { kind: 'activity', labelKey: 'hero.stat.monitoring' },
  { kind: 'map', labelKey: 'hero.stat.regions' },
  { kind: 'cal', labelKey: 'hero.stat.services' },
  { kind: 'alert', labelKey: 'hero.stat.alerts' }
] as const

const kpis = [
  { labelKey: 'hero.kpi.stations', value: '42' },
  { labelKey: 'hero.kpi.sensors', value: '186' },
  { labelKey: 'hero.kpi.reports', value: '24' },
  { labelKey: 'hero.kpi.regions', value: '14' }
] as const

function StatIcon({ kind }: { kind: string }) {
  if (kind === 'activity') return <Activity size={18} />
  if (kind === 'map') return <MapPin size={18} />
  if (kind === 'cal') return <Calendar size={18} />
  return <ShieldAlert size={18} />
}

export function Hero() {
  const { t } = useLanguage()
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#F5FAFD] to-white">
      <div className="absolute inset-0 -z-10 opacity-60" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.25),transparent_60%)]" />
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(0,107,166,0.08)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div {...heroMotion}>
          <span className="inline-block px-3 py-1 rounded-full bg-[#006BA6]/10 text-[#006BA6] text-xs font-medium tracking-wider uppercase">
            {t('hero.eyebrow')}
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight">
            {t('hero.title')}
          </h1>
          <p className="mt-5 text-base md:text-lg text-slate-600 max-w-xl">
            {t('hero.subtitle')}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#weather" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#006BA6] text-white font-medium hover:bg-[#003B5C] transition shadow-sm shadow-[#006BA6]/20">
              {t('hero.cta.weather')}
            </a>
            <a href="#reception" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-200 text-[#003B5C] font-medium hover:border-[#006BA6] transition">
              {t('hero.cta.reception')}
            </a>
            <a href="#location" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-200 text-[#003B5C] font-medium hover:border-[#006BA6] transition">
              {t('hero.cta.map')}
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((m) => (
              <div key={m.labelKey} className="rounded-xl bg-white/70 backdrop-blur border border-white shadow-sm p-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#006BA6]/10 text-[#006BA6] flex items-center justify-center">
                  <StatIcon kind={m.kind} />
                </span>
                <span className="text-xs font-medium text-slate-700">{t(m.labelKey)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...heroMotionRight} className="relative">
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">{t('hero.live.title')}</div>
                <div className="text-lg font-semibold text-[#003B5C]">{t('hero.live.city')}</div>
              </div>
              <span className="flex items-center gap-2 text-xs text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('hero.live.active')}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {kpis.map((s) => (
                <div key={s.labelKey} className="rounded-xl bg-gradient-to-br from-[#F5FAFD] to-white border border-slate-100 p-3">
                  <div className="text-xs text-slate-500">{t(s.labelKey)}</div>
                  <div className="text-2xl font-bold text-[#003B5C]">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
