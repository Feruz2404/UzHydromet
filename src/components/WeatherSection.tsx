import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { RefreshCw, Wind, Droplets, Gauge, Compass, MapPin, Activity, AlertCircle } from 'lucide-react'
import { useWeather } from '../hooks/useWeather'
import { describeWeather, weatherIconFor } from '../data/weatherCodes'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'
import { fadeInUpInView } from '../lib/motion'

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

export function WeatherSection() {
  const { lang, t } = useLanguage()
  const { data, loading, error, refresh } = useWeather(agency.weather.latitude, agency.weather.longitude)
  const info = data ? describeWeather(data.weatherCode) : null
  const Icon = data ? weatherIconFor(data.weatherCode) : null
  const conditionLabel = info ? t(info.labelKey) : ''
  const cityFull = t('weather.cityFull')
  const cityShort = t('weather.cityShort')
  const updated = data
    ? new Date(data.time).toLocaleString(LOCALE_BY_LANG[lang] ?? 'en-GB', { timeZone: 'Asia/Tashkent' })
    : '-'
  const dirCardinal = data ? t(`weather.windCardinal.${cardinalOf(data.windDirection)}`) : ''

  return (
    <section id="weather" className="relative py-8 md:py-12 lg:py-20 bg-gradient-to-b from-white via-brand-mist to-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-sky/30 to-transparent" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUpInView} className="mb-5 md:mb-10 max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-ice text-brand-deep text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase ring-1 ring-brand-sky/30">
            <Activity size={12} />
            {t('weather.eyebrow')}
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-ink tracking-tight text-balance">
            {t('weather.title')}
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-brand-muted leading-relaxed">
            {t('weather.subtitlePrefix')}{cityFull}{t('weather.subtitleSuffix')}
          </p>
        </motion.div>

        <div className="relative rounded-2xl sm:rounded-3xl bg-weather-grad text-white p-4 sm:p-6 md:p-8 lg:p-10 shadow-glow ring-1 ring-white/10 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-brand-cyan/25 blur-3xl" />
            <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-brand-sky/15 blur-3xl" />
            <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 800 400" preserveAspectRatio="none">
              <defs>
                <pattern id="weather-lines" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M0,30 Q15,10 30,30 T60,30" fill="none" stroke="white" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#weather-lines)" />
            </svg>
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-white/70 font-semibold">
                <MapPin size={12} />
                <span>{cityShort} {'\u2022'} {t('weather.compactToday')}</span>
              </div>
              <div className="mt-1 text-[11px] sm:text-xs md:text-sm text-white/80 break-words">{t('weather.lastUpdated')}: <span className="text-white">{updated}</span></div>
            </div>
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs sm:text-sm self-start md:self-auto ring-1 ring-white/15 disabled:opacity-60 shrink-0"
              aria-label={t('weather.refreshAria')}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {t('weather.refresh')}
            </button>
          </div>

          {loading && !data && (
            <div className="relative mt-6 md:mt-12 text-center text-white/85">
              <RefreshCw className="inline-block animate-spin mr-2 align-middle" size={16} />
              <span className="align-middle">{t('weather.loading')}</span>
            </div>
          )}

          {error && !loading && (
            <div className="relative mt-6 md:mt-12 text-center">
              <AlertCircle className="inline-block mr-2 align-middle" size={16} />
              <span className="text-white/90 align-middle">{t('weather.errorLoad')}</span>
              <button
                type="button"
                onClick={refresh}
                className="mt-4 block mx-auto px-4 py-2 rounded-xl bg-white text-brand-navy text-sm font-semibold hover:bg-brand-ice transition"
              >
                {t('weather.tryAgain')}
              </button>
            </div>
          )}

          {data && info && Icon && (
            <div className="relative mt-4 md:mt-8 grid lg:grid-cols-5 gap-3 md:gap-5">
              <div className="lg:col-span-2 rounded-2xl bg-white/[0.07] backdrop-blur-md p-4 sm:p-6 ring-1 ring-white/10 flex flex-col justify-between gap-4 min-h-[140px] sm:min-h-[200px] md:min-h-[260px]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-white/60 font-semibold">{t('weather.label.condition')}</div>
                    <div className="mt-1 text-sm sm:text-lg font-semibold break-words">{conditionLabel}</div>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-brand-sky animate-floatY">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-5xl sm:text-7xl md:text-8xl font-extrabold leading-none">{Math.round(data.temperature)}</span>
                    <span className="text-xl sm:text-3xl font-semibold text-white/80">{'\u00B0C'}</span>
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-white/75">
                    {t('weather.feelsLike')} <span className="font-semibold text-white">{`${Math.round(data.apparentTemperature)}\u00B0C`}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 -mx-4 px-4 md:mx-0 md:px-0 flex md:grid md:grid-cols-2 gap-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-1 md:pb-0 no-scrollbar">
                <Stat icon={<Droplets size={16} />} label={t('weather.label.humidity')} value={`${data.humidity}%`} />
                <Stat icon={<Wind size={16} />} label={t('weather.label.wind')} value={`${Math.round(data.windSpeed)} km/h`} />
                <Stat icon={<Compass size={16} />} label={t('weather.label.windDir')} value={`${data.windDirection}\u00B0 ${dirCardinal}`} />
                <Stat icon={<Gauge size={16} />} label={t('weather.label.pressure')} value={`${Math.round(data.pressure)} hPa`} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="group rounded-2xl bg-white/[0.06] backdrop-blur-md p-3 sm:p-4 ring-1 ring-white/10 hover:ring-white/25 hover:bg-white/[0.1] transition snap-start min-w-[44vw] sm:min-w-[40vw] md:min-w-0 shrink-0 md:shrink">
      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-wider text-white/65 font-semibold">
        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-brand-sky shrink-0">
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-2 text-base sm:text-xl md:text-2xl font-bold leading-tight break-words">{value}</div>
    </div>
  )
}
