import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Activity, MapPin, Calendar, ShieldAlert, RefreshCw, Wind, Droplets, Gauge, Thermometer } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useWeather } from '../hooks/useWeather'
import { agency } from '../data/defaultContent'
import { describeWeather, weatherIconFor } from '../data/weatherCodes'

const heroMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const heroMotionRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, delay: 0.15 }
}

const stats = [
  { kind: 'activity', labelKey: 'hero.stat.monitoring' },
  { kind: 'map', labelKey: 'hero.stat.regions' },
  { kind: 'cal', labelKey: 'hero.stat.services' },
  { kind: 'alert', labelKey: 'hero.stat.alerts' }
] as const

function StatIcon({ kind }: { kind: string }) {
  if (kind === 'activity') return <Activity size={18} />
  if (kind === 'map') return <MapPin size={18} />
  if (kind === 'cal') return <Calendar size={18} />
  return <ShieldAlert size={18} />
}

export function Hero() {
  const { t } = useLanguage()
  const { data, loading, refresh } = useWeather(agency.weather.latitude, agency.weather.longitude)
  const condition = data ? describeWeather(data.weatherCode) : null
  const WeatherIcon = data ? weatherIconFor(data.weatherCode) : null

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-brand-mist via-white to-white">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-hero-radial opacity-90" />
        <div className="absolute inset-0 bg-grid-soft opacity-60" />
        <svg className="absolute -bottom-20 left-0 right-0 w-full opacity-[0.18]" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="#0F6FA6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <motion.div {...heroMotion} className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur border border-brand-sky/30 text-brand-deep text-[11px] font-semibold tracking-[0.14em] uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
            {t('hero.eyebrow')}
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold text-brand-ink leading-[1.05] tracking-tight text-balance">
            {t('hero.title')}
          </h1>
          <p className="mt-5 text-base md:text-lg text-brand-muted max-w-xl leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#weather" className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white font-semibold shadow-card hover:shadow-glow transition-all">
              {t('hero.cta.weather')}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a href="#reception" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-brand-deep font-semibold hover:border-brand-primary hover:text-brand-navy transition">
              {t('hero.cta.reception')}
            </a>
            <a href="#location" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/60 backdrop-blur border border-slate-200 text-brand-deep font-semibold hover:border-brand-primary transition">
              {t('hero.cta.map')}
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((m) => (
              <div key={m.labelKey} className="rounded-xl bg-white/70 backdrop-blur border border-white shadow-card p-3 flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-ice to-white text-brand-primary flex items-center justify-center ring-1 ring-brand-sky/30">
                  <StatIcon kind={m.kind} />
                </span>
                <span className="text-xs font-semibold text-slate-700 leading-tight">{t(m.labelKey)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...heroMotionRight} className="lg:col-span-5 relative">
          <div className="relative rounded-3xl bg-gradient-to-br from-brand-navy via-brand-deep to-brand-primary text-white p-6 md:p-7 shadow-glow ring-1 ring-white/15 overflow-hidden">
            <div className="absolute -top-16 -right-12 w-56 h-56 rounded-full bg-brand-cyan/30 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full bg-brand-sky/20 blur-3xl pointer-events-none" aria-hidden="true" />

            <div className="relative flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/70 font-semibold">{t('hero.live.title')}</div>
                <div className="mt-1 text-lg font-display font-bold">{t('hero.live.city')}</div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t('hero.live.active')}
              </span>
            </div>

            <div className="relative mt-6 flex items-end gap-5">
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-wide text-white/60">
                  {condition ? t(condition.labelKey) : t('weather.loading')}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-display text-6xl md:text-7xl font-extrabold leading-none">
                    {data ? Math.round(data.temperature) : '--'}
                  </span>
                  <span className="text-2xl font-semibold text-white/80">{'°C'}</span>
                </div>
                <div className="mt-1 text-xs text-white/70">
                  {t('weather.feelsLike')} {data ? `${Math.round(data.apparentTemperature)}°C` : '--'}
                </div>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/15 flex items-center justify-center text-brand-sky">
                {WeatherIcon ? <WeatherIcon size={48} strokeWidth={1.5} /> : null}
              </div>
            </div>

            <div className="relative mt-6 grid grid-cols-4 gap-2">
              <MiniStat icon={<Wind size={14} />} value={data ? `${Math.round(data.windSpeed)}` : '--'} unit="km/h" />
              <MiniStat icon={<Droplets size={14} />} value={data ? `${data.humidity}` : '--'} unit="%" />
              <MiniStat icon={<Gauge size={14} />} value={data ? `${Math.round(data.pressure)}` : '--'} unit="hPa" />
              <MiniStat icon={<Thermometer size={14} />} value={data ? `${Math.round(data.apparentTemperature)}` : '--'} unit={'°'} />
            </div>

            <div className="relative mt-5 flex items-center justify-between text-[11px] text-white/70">
              <a href="#weather" className="inline-flex items-center gap-1.5 font-semibold text-white/90 hover:text-white">
                {t('weather.fullDashboard')}
                <ArrowRight size={12} />
              </a>
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition disabled:opacity-50"
                aria-label={t('weather.refreshAria')}
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                {t('weather.refresh')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function MiniStat({ icon, value, unit }: { icon: ReactNode; value: string; unit: string }) {
  return (
    <div className="rounded-lg bg-white/10 backdrop-blur ring-1 ring-white/10 px-2.5 py-2 text-center">
      <div className="flex items-center justify-center text-white/70">{icon}</div>
      <div className="mt-1 text-sm font-semibold leading-none">{value}<span className="ml-0.5 text-[10px] text-white/60 font-normal">{unit}</span></div>
    </div>
  )
}
