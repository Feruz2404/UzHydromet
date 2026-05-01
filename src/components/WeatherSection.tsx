import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { RefreshCw, Wind, Droplets, Gauge, Thermometer, Compass, Cloud, MapPin, Activity, AlertCircle } from 'lucide-react'
import { useWeather } from '../hooks/useWeather'
import { describeWeather, weatherIconFor } from '../data/weatherCodes'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const fadeUpMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

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
    <section id="weather" className="relative py-12 md:py-16 lg:py-24 bg-gradient-to-b from-white via-brand-mist to-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-sky/30 to-transparent" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpMotion} className="mb-8 md:mb-10 max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-ice text-brand-deep text-[11px] font-semibold tracking-[0.14em] uppercase ring-1 ring-brand-sky/30">
            <Activity size={12} />
            {t('weather.eyebrow')}
          </span>
          <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-ink tracking-tight text-balance">
            {t('weather.title')}
          </h2>
          <p className="mt-3 text-brand-muted leading-relaxed">
            {t('weather.subtitlePrefix')}{cityFull}{t('weather.subtitleSuffix')}
          </p>
        </motion.div>

        <div className="relative rounded-[28px] bg-weather-grad text-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-glow ring-1 ring-white/10 overflow-hidden">
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
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/70 font-semibold">
                <MapPin size={12} />
                <span>{cityShort} {'•'} {t('weather.compactToday')}</span>
              </div>
              <div className="mt-1 text-xs sm:text-sm text-white/80 break-words">{t('weather.lastUpdated')}: <span className="text-white">{updated}</span></div>
            </div>
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm self-start md:self-auto ring-1 ring-white/15 disabled:opacity-60 shrink-0"
              aria-label={t('weather.refreshAria')}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {t('weather.refresh')}
            </button>
          </div>

          {loading && !data && (
            <div className="relative mt-10 md:mt-12 text-center text-white/85">
              <RefreshCw className="inline-block animate-spin mr-2 align-middle" size={16} />
              <span className="align-middle">{t('weather.loading')}</span>
            </div>
          )}

          {error && !loading && (
            <div className="relative mt-10 md:mt-12 text-center">
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
            <div className="relative mt-6 md:mt-8 grid lg:grid-cols-5 gap-4 md:gap-5">
              <div className="lg:col-span-2 rounded-2xl bg-white/[0.07] backdrop-blur-md p-5 sm:p-6 ring-1 ring-white/10 flex flex-col justify-between min-h-[220px] md:min-h-[260px]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-white/60 font-semibold">{t('weather.label.condition')}</div>
                    <div className="mt-1 text-base sm:text-lg font-semibold break-words">{conditionLabel}</div>
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-brand-sky animate-floatY">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-6xl sm:text-7xl md:text-8xl font-extrabold leading-none">{Math.round(data.temperature)}</span>
                    <span className="text-2xl sm:text-3xl font-semibold text-white/80">{'°C'}</span>
                  </div>
                  <div className="mt-2 text-sm text-white/75">
                    {t('weather.feelsLike')} <span className="font-semibold text-white">{`${Math.round(data.apparentTemperature)}°C`}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 flex md:grid md:grid-cols-3 gap-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-1 md:pb-0">
                <Stat icon={<Thermometer size={16} />} label={t('weather.label.feels')} value={`${Math.round(data.apparentTemperature)}°C`} />
                <Stat icon={<Droplets size={16} />} label={t('weather.label.humidity')} value={`${data.humidity}%`} />
                <Stat icon={<Wind size={16} />} label={t('weather.label.wind')} value={`${Math.round(data.windSpeed)} km/h`} />
                <Stat icon={<Compass size={16} />} label={t('weather.label.windDir')} value={`${data.windDirection}° ${dirCardinal}`} />
                <Stat icon={<Gauge size={16} />} label={t('weather.label.pressure')} value={`${Math.round(data.pressure)} hPa`} />
                <Stat icon={<Cloud size={16} />} label={t('weather.label.condition')} value={conditionLabel} />
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
    <div className="group rounded-2xl bg-white/[0.06] backdrop-blur-md p-4 ring-1 ring-white/10 hover:ring-white/25 hover:bg-white/[0.1] transition snap-start min-w-[58vw] sm:min-w-[42vw] md:min-w-0 shrink-0 md:shrink">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/65 font-semibold">
        <span className="w-7 h-7 rounded-lg bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-brand-sky shrink-0">
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-3 text-xl sm:text-2xl font-bold leading-tight break-words">{value}</div>
    </div>
  )
}
