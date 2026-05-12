import { motion } from 'framer-motion'
import {
  CloudSun,
  Calendar,
  MapPin,
  Activity,
  Wind,
  Droplets,
  Clock,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'
import { useWeather } from '../hooks/useWeather'
import { describeWeather, weatherIconFor } from '../data/weatherCodes'
import { fadeInUp } from '../lib/motion'

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
    ? new Date(data.time).toLocaleTimeString(LOCALE_BY_LANG[lang] ?? 'en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Tashkent'
      })
    : ''
  const dirCardinal = data ? t(`weather.windCardinal.${cardinalOf(data.windDirection)}`) : ''

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24 bg-gradient-to-br from-brand-navy via-brand-deep to-brand-primary text-white"
    >
      {/* === Background-integrated weather visual === */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Atmospheric color blobs */}
        <div className="absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-brand-cyan/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-brand-sky/15 blur-3xl" />

        {/* Radar rings (desktop) */}
        <div className="absolute hidden lg:block right-[-4rem] top-1/2 -translate-y-1/2 w-[44rem] h-[44rem] opacity-[0.15]">
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <div className="absolute inset-[10%] rounded-full border border-white/15" />
          <div className="absolute inset-[22%] rounded-full border border-white/12" />
          <div className="absolute inset-[34%] rounded-full border border-white/10" />
          <div className="absolute inset-[46%] rounded-full border border-white/12" />
        </div>

        {/* SVG wave/cloud line pattern */}
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

        {/* GIANT subtle ghost temperature as background */}
        {data && (
          <>
            {/* desktop variant */}
            <div className="hidden md:flex absolute right-[4%] top-1/2 -translate-y-1/2 items-start font-display font-extrabold leading-none tracking-tighter select-none text-white/[0.07]">
              <span className="text-[18rem] lg:text-[24rem] xl:text-[28rem]">
                {Math.round(data.temperature)}
              </span>
              <span className="mt-6 lg:mt-10 text-[6rem] lg:text-[8rem] xl:text-[10rem]">
                {'\u00B0'}
              </span>
            </div>
            {/* mobile variant */}
            <div className="md:hidden absolute right-2 bottom-2 font-display font-extrabold leading-none tracking-tighter select-none text-white/[0.08]">
              <span className="text-[10rem]">
                {Math.round(data.temperature)}
                {'\u00B0'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* === Foreground content === */}
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

          {/* CTA buttons */}
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

          {/* === Integrated weather chips (no card, no column) === */}
          <div id="weather" className="mt-7 sm:mt-9 scroll-mt-24">
            {loading && !data && (
              <div className="inline-flex items-center gap-2 text-white/80 text-xs sm:text-sm">
                <RefreshCw size={14} className="animate-spin" />
                <span>{t('weather.loading')}</span>
              </div>
            )}

            {error && !loading && (
              <div className="inline-flex items-center gap-2 text-white/85 text-xs sm:text-sm">
                <AlertCircle size={14} />
                <span>{t('weather.errorLoad')}</span>
                <button
                  type="button"
                  onClick={refresh}
                  className="ml-2 underline decoration-white/40 hover:decoration-white"
                >
                  {t('weather.tryAgain')}
                </button>
              </div>
            )}

            {data && info && Icon && (
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 sm:gap-2.5 overflow-x-auto sm:flex-wrap snap-x snap-mandatory sm:snap-none no-scrollbar pb-1 sm:pb-0">
                <Chip>
                  <Icon size={14} className="text-brand-sky" />
                  <span className="font-semibold">
                    {Math.round(data.temperature)}
                    {'\u00B0C'}
                  </span>
                  <span className="text-white/70">{conditionLabel}</span>
                </Chip>
                <Chip>
                  <Wind size={13} className="text-brand-sky" />
                  <span className="font-semibold">
                    {Math.round(data.windSpeed)} km/h
                  </span>
                  <span className="text-white/60">{dirCardinal}</span>
                </Chip>
                <Chip>
                  <Droplets size={13} className="text-brand-sky" />
                  <span className="font-semibold">{data.humidity}%</span>
                  <span className="text-white/60">{t('weather.label.humidity')}</span>
                </Chip>
                <Chip>
                  <MapPin size={13} className="text-brand-sky" />
                  <span className="font-semibold">{cityShort}</span>
                </Chip>
                <Chip>
                  <Clock size={13} className="text-brand-sky" />
                  <span className="text-white/80">{updated}</span>
                  <button
                    type="button"
                    onClick={refresh}
                    disabled={loading}
                    aria-label={t('weather.refreshAria')}
                    className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-white/15 transition disabled:opacity-50"
                  >
                    <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
                  </button>
                </Chip>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="snap-start shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md ring-1 ring-white/15 text-[11px] sm:text-xs text-white whitespace-nowrap">
      {children}
    </span>
  )
}
