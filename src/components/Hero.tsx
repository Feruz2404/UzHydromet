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
  AlertCircle,
  Thermometer
} from 'lucide-react'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'
import { useWeather } from '../hooks/useWeather'
import { describeWeather, weatherIconFor } from '../data/weatherCodes'
import { fadeInUp, fadeInUpDelayed } from '../lib/motion'

const LOCALE_BY_LANG: Record<string, string> = { uz: 'en-GB', ru: 'ru-RU', en: 'en-GB' }
const CARDINALS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const
type Cardinal = (typeof CARDINALS)[number]
function cardinalOf(deg: number): Cardinal {
  const idx = Math.round((deg % 360) / 45) % 8
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
  const dirCardinal = data ? t(`weather.windCardinal.${cardinalOf(data.windDirection)}`) : ''

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-brand-navy via-brand-deep to-brand-primary text-white"
    >
      {/* Atmospheric weather-integrated background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-brand-cyan/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-brand-sky/15 blur-3xl" />
        {/* Radar rings (desktop only) */}
        <div className="absolute hidden lg:block right-[-6rem] top-1/2 -translate-y-1/2 w-[40rem] h-[40rem] opacity-[0.18]">
          <div className="absolute inset-0 rounded-full border border-white/15" />
          <div className="absolute inset-[8%] rounded-full border border-white/10" />
          <div className="absolute inset-[18%] rounded-full border border-white/10" />
          <div className="absolute inset-[28%] rounded-full border border-white/10" />
          <div className="absolute inset-[38%] rounded-full border border-white/15" />
        </div>
        {/* Giant ghost temperature (desktop only) */}
        {data && (
          <div className="hidden lg:block absolute right-[6%] top-1/2 -translate-y-1/2 font-display font-extrabold text-[22rem] xl:text-[26rem] leading-none text-white/[0.05] tracking-tighter select-none pointer-events-none">
            {Math.round(data.temperature)}
            {'\u00B0'}
          </div>
        )}
        {/* SVG wave/cloud pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07]"
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="max-w-3xl">
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
              href="#contact"
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

        {/* Integrated live weather glass strip */}
        <motion.div
          {...fadeInUpDelayed}
          id="weather"
          className="relative mt-6 sm:mt-8 md:mt-10 lg:mt-12 scroll-mt-24"
        >
          <div className="relative rounded-3xl bg-white/[0.07] backdrop-blur-xl ring-1 ring-white/15 shadow-glow overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-10 w-56 h-56 rounded-full bg-brand-cyan/30 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-brand-sky/20 blur-3xl"
            />

            <div className="relative p-4 sm:p-5 md:p-6">
              {loading && !data && (
                <div className="text-center text-white/85 py-4">
                  <RefreshCw
                    className="inline-block animate-spin mr-2 align-middle"
                    size={16}
                  />
                  <span className="align-middle text-sm">{t('weather.loading')}</span>
                </div>
              )}

              {error && !loading && (
                <div className="text-center py-4">
                  <AlertCircle className="inline-block mr-2 align-middle" size={16} />
                  <span className="text-white/90 align-middle text-sm">
                    {t('weather.errorLoad')}
                  </span>
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
                  {/* Primary row */}
                  <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                    <div
                      aria-hidden="true"
                      className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 rounded-2xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-brand-sky animate-floatY"
                    >
                      <Icon size={32} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-none">
                          {Math.round(data.temperature)}
                        </span>
                        <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/75">
                          {'\u00B0C'}
                        </span>
                        <span className="ml-1 text-sm sm:text-base font-semibold text-white/90 [overflow-wrap:anywhere]">
                          {conditionLabel}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-white/65 font-semibold">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={11} /> {cityShort}
                        </span>
                        <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-white/75 font-medium [overflow-wrap:anywhere]">
                          <span className="opacity-70">{t('weather.lastUpdated')}:</span>
                          <span className="text-white/95">{updated}</span>
                        </span>
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

                  {/* Secondary metrics: mobile horizontal swipe chips / desktop grid */}
                  <div className="mt-4 sm:mt-5 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-4 gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scroll-smooth no-scrollbar pb-1 sm:pb-0">
                    <Chip
                      icon={<Thermometer size={14} />}
                      label={t('weather.label.feels')}
                      value={`${Math.round(data.apparentTemperature)}\u00B0C`}
                    />
                    <Chip
                      icon={<Wind size={14} />}
                      label={t('weather.label.wind')}
                      value={`${Math.round(data.windSpeed)} km/h`}
                      sub={dirCardinal}
                    />
                    <Chip
                      icon={<Droplets size={14} />}
                      label={t('weather.label.humidity')}
                      value={`${data.humidity}%`}
                    />
                    <Chip
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

function Chip({
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
    <div className="snap-start shrink-0 min-w-[44vw] sm:min-w-0 rounded-xl bg-white/[0.07] ring-1 ring-white/10 px-3 py-2.5 sm:p-3">
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
