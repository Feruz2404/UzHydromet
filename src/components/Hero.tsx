import { motion } from 'framer-motion'
import {
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

const chipsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } }
}
const chipItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } }
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
      className="relative overflow-hidden pt-20 pb-14 sm:pt-24 sm:pb-18 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28 bg-gradient-to-br from-brand-navy via-brand-deep to-brand-primary text-white"
    >
      {/* === Premium atmospheric weather background === */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Color blobs */}
        <div className="absolute -top-40 -right-20 h-[34rem] w-[34rem] rounded-full bg-brand-cyan/30 blur-3xl animate-glowPulse" />
        <div className="absolute -bottom-40 -left-32 h-[30rem] w-[30rem] rounded-full bg-brand-sky/20 blur-3xl animate-glowPulse" />
        <div className="absolute top-1/3 right-1/4 h-[18rem] w-[18rem] rounded-full bg-sky-400/15 blur-3xl animate-glowPulseStrong" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style=
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          
        />

        {/* Slow drifting wave/cloud pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.10] animate-slowDrift"
          viewBox="0 0 800 400"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="hero-waves" width="80" height="60" patternUnits="userSpaceOnUse">
              <path d="M0,30 Q20,8 40,30 T80,30" fill="none" stroke="white" strokeWidth="0.7" />
              <path d="M0,48 Q20,30 40,48 T80,48" fill="none" stroke="white" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-waves)" />
        </svg>

        {/* === Radar visualization (desktop only) === */}
        <div className="absolute hidden lg:block right-[-6rem] top-1/2 -translate-y-1/2 w-[50rem] h-[50rem]">
          {/* Soft radial glow halo behind temperature */}
          <div
            className="absolute inset-[18%] rounded-full animate-glowPulseStrong"
            style=
              background:
                'radial-gradient(circle at center, rgba(56,189,248,0.32) 0%, rgba(34,199,240,0.15) 40%, transparent 70%)'
            
          />
          {/* Concentric radar rings */}
          <div className="absolute inset-0 opacity-[0.22] animate-radarSpin">
            <div className="absolute inset-0 rounded-full border border-white/30 animate-radarPing" />
            <div className="absolute inset-[8%] rounded-full border border-white/25 animate-radarPingDelayed" />
            <div className="absolute inset-[18%] rounded-full border border-white/22 animate-radarPing" />
            <div className="absolute inset-[30%] rounded-full border border-white/20 animate-radarPingDelayed" />
            <div className="absolute inset-[42%] rounded-full border border-white/18" />
            <div className="absolute inset-[54%] rounded-full border border-white/16" />
          </div>
          {/* Slow radar sweep */}
          <div className="absolute inset-0 opacity-[0.18] animate-radarSweep origin-center">
            <div
              className="absolute left-1/2 top-1/2 -translate-y-1/2 w-1/2 h-1 origin-left"
              style=
                background:
                  'linear-gradient(90deg, rgba(56,189,248,0.7) 0%, rgba(56,189,248,0) 100%)'
              
            />
          </div>
          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-sky/60" />
        </div>

        {/* GIANT ghost temperature with pulsing glow */}
        {data && (
          <>
            <div className="hidden md:flex absolute right-[5%] top-1/2 -translate-y-1/2 items-start font-display font-extrabold leading-none tracking-tighter select-none">
              <span
                className="text-[16rem] lg:text-[22rem] xl:text-[26rem] animate-glowPulse"
                style=
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(255,255,255,0.10)',
                  textShadow:
                    '0 0 80px rgba(56,189,248,0.18), 0 0 160px rgba(34,199,240,0.10)'
                
              >
                {Math.round(data.temperature)}
              </span>
              <span
                className="mt-6 lg:mt-10 text-[5rem] lg:text-[7rem] xl:text-[8rem]"
                style= color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.10)' 
              >
                {'\u00B0'}
              </span>
            </div>
            {/* Mobile ghost temp */}
            <div className="md:hidden absolute right-1 -bottom-2 font-display font-extrabold leading-none tracking-tighter select-none text-white/[0.08]">
              <span className="text-[11rem]">
                {Math.round(data.temperature)}
                {'\u00B0'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* === Foreground content === */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="max-w-4xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-[10px] sm:text-[11px] font-semibold text-white/90 uppercase tracking-[0.16em]">
            <Activity size={12} />
            {t('hero.eyebrow')}
          </span>
          <h1 className="mt-4 font-display text-[22px] sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.18] tracking-tight text-white [text-wrap:balance] [overflow-wrap:anywhere] hyphens-auto">
            {t('hero.title')}
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* === CTAs (only 2, balanced & polished) === */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 lg:px-7 py-3 sm:py-3.5 rounded-xl bg-white text-brand-navy font-semibold text-sm sm:text-base shadow-card hover:shadow-glow hover:-translate-y-0.5 transition-all"
            >
              <Calendar size={18} className="transition-transform group-hover:scale-110" />
              {t('hero.cta.reception')}
            </a>
            <a
              href="#location"
              className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 lg:px-7 py-3 sm:py-3.5 rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/25 text-white font-semibold text-sm sm:text-base hover:bg-white/15 hover:ring-white/40 hover:-translate-y-0.5 transition-all"
            >
              <MapPin size={18} className="transition-transform group-hover:scale-110" />
              {t('hero.cta.map')}
            </a>
          </div>

          {/* === Integrated weather chips strip === */}
          <div id="weather" className="mt-8 sm:mt-10 scroll-mt-24">
            {/* Inline current-weather label */}
            {data && info && Icon && (
              <div className="mb-3 inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.18em] font-semibold text-white/75">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-livePulse" />
                  <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>{t('weather.title')}</span>
                <span className="text-white/40">{'\u2022'}</span>
                <span className="text-white/65 normal-case tracking-normal">{conditionLabel}</span>
              </div>
            )}

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
              <motion.div
                variants={chipsContainer}
                initial="hidden"
                animate="show"
                className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 sm:gap-2.5 overflow-x-auto sm:flex-wrap snap-x snap-mandatory sm:snap-none no-scrollbar pb-1 sm:pb-0"
              >
                <Chip>
                  <Icon size={15} className="text-brand-sky shrink-0" />
                  <span className="font-bold tabular-nums text-white">
                    {Math.round(data.temperature)}
                    {'\u00B0C'}
                  </span>
                  <span className="text-white/55 text-[10px] sm:text-[11px] hidden sm:inline">
                    {t('weather.label.feels')} {Math.round(data.feelsLike)}
                    {'\u00B0'}
                  </span>
                </Chip>
                <Chip>
                  <Wind size={14} className="text-brand-sky shrink-0" />
                  <span className="font-bold tabular-nums text-white">
                    {Math.round(data.windSpeed)}
                  </span>
                  <span className="text-white/55 text-[10px] sm:text-[11px]">km/h</span>
                  <span className="text-white/70 text-[10px] sm:text-[11px] font-semibold">
                    {dirCardinal}
                  </span>
                </Chip>
                <Chip>
                  <Droplets size={14} className="text-brand-sky shrink-0" />
                  <span className="font-bold tabular-nums text-white">{data.humidity}%</span>
                  <span className="text-white/55 text-[10px] sm:text-[11px]">
                    {t('weather.label.humidity')}
                  </span>
                </Chip>
                <Chip>
                  <MapPin size={14} className="text-brand-sky shrink-0" />
                  <span className="font-semibold text-white">{cityShort}</span>
                </Chip>
                <Chip>
                  <Clock size={14} className="text-brand-sky shrink-0" />
                  <span className="text-white/85 tabular-nums">{updated}</span>
                  <button
                    type="button"
                    onClick={refresh}
                    disabled={loading}
                    aria-label={t('weather.refreshAria')}
                    className="group/r ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-white/15 transition disabled:opacity-50"
                  >
                    <RefreshCw
                      size={12}
                      className={`transition-transform duration-700 group-hover/r:rotate-[360deg] ${loading ? 'animate-spin' : ''}`}
                    />
                  </button>
                </Chip>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      variants={chipItem}
      whileHover= y: -2 
      className="snap-start shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full bg-white/[0.09] hover:bg-white/[0.14] backdrop-blur-md ring-1 ring-white/15 hover:ring-white/30 text-[12px] sm:text-[13px] text-white whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_-4px_rgba(0,0,0,0.25)] transition-colors"
    >
      {children}
    </motion.span>
  )
}
