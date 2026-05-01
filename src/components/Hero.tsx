import { motion } from 'framer-motion'
import { Activity, MapPin, Calendar, ShieldAlert, CloudSun } from 'lucide-react'
import { motionPreset } from '../lib/motion'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../store/contentStore'

type StatIconKind = 'activity' | 'map' | 'cal' | 'alert'
type Stat = { id: string; icon: StatIconKind; labelKey: string; fallback: string }

const stats: Stat[] = [
  { id: 'monitoring', icon: 'activity', labelKey: 'hero.stat.monitoring', fallback: '24/7 Monitoring' },
  { id: 'regions', icon: 'map', labelKey: 'hero.stat.regions', fallback: '14 Regions' },
  { id: 'services', icon: 'cal', labelKey: 'hero.stat.services', fallback: '7+ Services' },
  { id: 'alerts', icon: 'alert', labelKey: 'hero.stat.alerts', fallback: 'Rapid Alerts' }
]

type Kpi = { id: string; labelKey: string; fallback: string; value: string }

const kpis: Kpi[] = [
  { id: 'stations', labelKey: 'hero.kpi.stations', fallback: 'Stations', value: '42' },
  { id: 'sensors', labelKey: 'hero.kpi.sensors', fallback: 'Sensors', value: '186' },
  { id: 'reports', labelKey: 'hero.kpi.reports', fallback: 'Daily reports', value: '24' },
  { id: 'regions', labelKey: 'hero.kpi.regions', fallback: 'Regions', value: '14' }
]

function StatIcon(props: { kind: StatIconKind }) {
  if (props.kind === 'activity') return <Activity size={18} />
  if (props.kind === 'map') return <MapPin size={18} />
  if (props.kind === 'cal') return <Calendar size={18} />
  return <ShieldAlert size={18} />
}

export function Hero() {
  const { lang, t } = useLanguage()
  const { content } = useContent()
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#F5FAFD] via-white to-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_85%,rgba(0,107,166,0.15),transparent_55%)]" />
      </div>
      <div className="container-page py-14 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <motion.div {...motionPreset.fadeUpEager}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-[0.2em]">
            <CloudSun size={14} />
            {t('hero.eyebrow', 'Official Government Agency')}
          </span>
          <h1 className="mt-5 text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-ink-900 leading-tight tracking-tight">
            {content.hero.title[lang]}
          </h1>
          <p className="mt-5 text-base md:text-lg text-slate-600 max-w-xl">
            {content.hero.subtitle[lang]}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#weather" className="btn-primary">{t('hero.cta.weather', 'View weather')}</a>
            <a href="#reception" className="btn-secondary">{t('hero.cta.reception', 'Reception hours')}</a>
            <a href="#location" className="btn-secondary">{t('hero.cta.location', 'Open map')}</a>
          </div>
          <div className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.id} className="rounded-xl bg-white/80 backdrop-blur border border-white shadow-sm p-3 flex items-center gap-2">
                <span aria-hidden="true" className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <StatIcon kind={s.icon} />
                </span>
                <span className="text-xs font-medium text-slate-700">{t(s.labelKey, s.fallback)}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div {...motionPreset.slideLeft} className="relative">
          <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('hero.live.label', 'Live monitoring')}</div>
                <div className="text-lg font-semibold text-brand-800">{t('hero.live.city', 'Tashkent')}</div>
              </div>
              <span className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('hero.live.active', 'Active')}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {kpis.map((c) => (
                <div key={c.id} className="rounded-xl bg-gradient-to-br from-[#F5FAFD] to-white border border-slate-100 p-4">
                  <div className="text-xs text-slate-500">{t(c.labelKey, c.fallback)}</div>
                  <div className="text-2xl font-bold text-brand-800 mt-1">{c.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
