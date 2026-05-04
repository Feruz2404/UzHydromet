import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  CloudSun,
  Calendar,
  MapPin,
  Activity,
  Wind,
  Droplets,
  Compass,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'
import { useWeather } from '../hooks/useWeather'
import { describeWeather, weatherIconFor } from '../data/weatherCodes'
import { fadeInUp, fadeInUpDelayed } from '../lib/motion'

const LOCALE_BY_LANG: Record<string, string> = {
  uz: 'en-GB',
  ru: 'ru-RU',
  en: 'en-GB'
}

const CARDINALS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const
type Cardinal = typeof CARDINALS[number]
function cardinalOf(deg: number): Cardinal {
  const idx = Math.round(((deg % 360) / 45)) % 8
  return CARDINALS[((idx % 8) + 8) % 8]
}

export function Hero() {
  const { t, lang } = useLanguage()
  const { data, loading, error, refresh } = useWeather(
    agency.weather.latitude,
    agency.weather.longitude
  )
  const info = data ? describeWeather(data.weatherCode) : null
  const Icon = data ? weatherIconFor(data.weatherCode) : null
  const conditionLabel = info ? t(info.labelKey) : ''
  const cityShort = t('weather.cityShort')
  const updated = data
    ? new Date(data.time).toLocaleString(LOCALE_BY_LANG[lang] ?? 'en-GB', {
        timeZone: 'Asia/Tashkent'
      })
    : '\u2014'
  const dirCardinal = data
    ? t(`weather.windCardinal.${cardinalOf(data.windDirection)}`)
    : ''

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24 bg-gradient-to-br from-brand-navy via-brand-deep to-brand-primary text-white"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-brand-cyan/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-brand-sky/15 blur-3xl" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.06]"
          viewBox="0 0 800 400"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="hero-lines" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0,30 Q15,10 30,30 T60,30" fill="none" stroke="white" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-lines)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <motion.div {...fadeInUp} className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-[10px] sm:text-[11px] font-semibold text-white/90 uppercase tracking-[0.16em]">
            <Activity size={12} />
            {t('hero.eyebrow')}
          </span>
          <h1 className="mt-4 font-display text-[26px] sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
            {t('hero.title')}
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/80 max-w-xl leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="mt-5 sm:mt-7 flex flex-wrap gap-2.5 sm:gap-3">
            <a
              href="#weather"
              className="inline-flex items-center gap-2 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl bg-white text-brand-navy font-semibold text-sm sm:text-base shadow-card hover:shadow-glow transition-all"
            >
              <CloudSun size={18} />
              {t('hero.cta.weather')}
            </a>
            <a
              href="#reception"
              className="inline-flex items-center gap-2 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-white font-semibold text-sm sm:text-base hover:bg-white/15 transition-all"
            >
              <Calendar size={18} />
              {t('hero.cta.reception')}
            </a>
            <a
              href="#location"
              className="inline-flex items-center gap-2 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-white font-semibold text-sm sm:text-base hover:bg-white/15 transition-all"
            >
              <MapPin size={18} />
              {t('hero.cta.map')}
            </a>
          </div>
        </motion.div>

        <motion.div
          {...fadeInUpDelayed}
          id="weather"
          className="lg:col-span-5 scroll-mt-24"
        >
          <div className="relative rounded-3xl bg-white/[0.08] backdrop-blur-xl ring-1 ring-white/15 shadow-glow overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-10 w-56 h-56 rounded-full bg-brand-cyan/30 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-brand-sky/20 blur-3xl"
            />

            <div className="relative p-5 sm:p-6 lg:p-7">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-white/70 font-semibold">
                    <MapPin size={12} />
                    <span className="truncate">{cityShort} {'\u2022'} {t('weather.compactToday')}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] sm:text-xs text-white/65 break-words">
                    {t('weather.lastUpdated')}: <span className="text-white/95">{updated}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={refresh}
                  disabled={loading}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15 transition disabled:opacity-60 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  aria-label={t('weather.refreshAria')}
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>

              {loading && !data && (
                <div className="mt-6 text-center text-white/85 py-8">
                  <RefreshCw className="inline-block animate-spin mr-2 align-middle" size={16} />
                  <span className="align-middle text-sm">{t('weather.loading')}</span>
                </div>
              )}

              {error && !loading && (
                <div className="mt-6 text-center py-6">
                  <AlertCircle className="inline-block mr-2 align-middle" size={16} />
                  <span className="text-white/90 align-middle text-sm">{t('weather.errorLoad')}</span>
                  <button
                    type="button"
                    onClick={refresh}
                    className="mt-3 block mx-auto px-4 py-2 rounded-xl bg-white text-brand-navy text-sm font-semibold hover:bg-brand-ice transition"
                  >
                    {t('weather.tryAgain')}
                  </button>
                </div>
              )}

              {data && info && Icon && (
                <>
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.16em] text-white/60 font-semibold">
                        {t('weather.label.condition')}
                      </div>
                      <div className="mt-1 text-base sm:text-lg font-semibold break-words">
                        {conditionLabel}
                      </div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="font-display text-6xl sm:text-7xl font-extrabold leading-none">
                          {Math.round(data.temperature)}
                        </span>
                        <span className="text-2xl sm:text-3xl font-semibold text-white/75">{'\u00B0C'}</span>
                      </div>
                      <div className="mt-1.5 text-xs sm:text-sm text-white/70">
                        {t('weather.feelsLike')}{' '}
                        <span className="font-semibold text-white/95">
                          {`${Math.round(data.apparentTemperature)}\u00B0C`}
                        </span>
                      </div>
                    </div>
                    <div
                      aria-hidden="true"
                      className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-brand-sky"
                    >
                      <Icon size={36} strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                    <Stat
                      icon={<Wind size={14} />}
                      label={t('weather.label.wind')}
                      value={`${Math.round(data.windSpeed)} km/h`}
                      sub={dirCardinal}
                    />
                    <Stat
                      icon={<Droplets size={14} />}
                      label={t('weather.label.humidity')}
                      value={`${data.humidity}%`}
                    />
                    <Stat
                      icon={<Compass size={14} />}
                      label={t('weather.label.windDir')}
                      value={`${data.windDirection}\u00B0`}
                      sub={dirCardinal}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Stat({
  icon,
  label,
  value,
  sub
}: {
  icon: ReactNode
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-xl bg-white/[0.06] ring-1 ring-white/10 p-2.5 sm:p-3 min-w-0">
      <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] uppercase tracking-wider text-white/65 font-semibold">
        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-brand-sky shrink-0">
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-1.5 text-sm sm:text-base font-bold text-white leading-tight break-words">
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[10.5px] text-white/55 truncate">{sub}</div>}
    </div>
  )
}
