import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { RefreshCw, Wind, Droplets, Gauge, Thermometer, Compass, Cloud } from 'lucide-react'
import { useWeather } from '../hooks/useWeather'
import { describeWeather } from '../data/weatherCodes'
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

export function WeatherSection() {
  const { lang, t } = useLanguage()
  const { data, loading, error, refresh } = useWeather(
    agency.weather.latitude,
    agency.weather.longitude
  )
  const info = data ? describeWeather(data.weatherCode) : null
  const conditionLabel = info ? t(info.labelKey) : ''
  const cityFull = t('weather.cityFull')
  const cityShort = t('weather.cityShort')
  const updated = data
    ? new Date(data.time).toLocaleString(LOCALE_BY_LANG[lang] ?? 'en-GB', { timeZone: 'Asia/Tashkent' })
    : '-'

  return (
    <section id="weather" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpMotion} className="mb-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#38BDF8]/10 text-[#006BA6] text-xs font-medium tracking-wider uppercase">
            {t('weather.eyebrow')}
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#003B5C]">{t('weather.title')}</h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            {t('weather.subtitlePrefix')}{cityFull}{t('weather.subtitleSuffix')}
          </p>
        </motion.div>

        <div className="relative rounded-2xl bg-gradient-to-br from-[#003B5C] via-[#005893] to-[#006BA6] text-white p-6 md:p-8 shadow-2xl ring-1 ring-white/10 overflow-hidden">
          <div className="absolute inset-0 -z-0 opacity-20 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-12 -right-10 w-72 h-72 rounded-full bg-[#38BDF8] blur-3xl" />
            <div className="absolute bottom-0 -left-10 w-72 h-72 rounded-full bg-[#006BA6] blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wide opacity-80">{cityShort}</div>
              <div className="text-sm opacity-80">{t('weather.lastUpdated')}: {updated}</div>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm self-start md:self-auto"
              aria-label={t('weather.refreshAria')}
            >
              <RefreshCw size={16} /> {t('weather.refresh')}
            </button>
          </div>

          {loading && (
            <div className="relative mt-8 text-center opacity-90">{t('weather.loading')}</div>
          )}
          {error && !loading && (
            <div className="relative mt-8 text-center">
              <p className="opacity-90">{t('weather.errorLoad')}</p>
              <button
                type="button"
                onClick={refresh}
                className="mt-3 px-4 py-2 rounded-lg bg-white text-[#003B5C] text-sm font-medium hover:bg-slate-100 transition"
              >
                {t('weather.tryAgain')}
              </button>
            </div>
          )}
          {data && info && !loading && (
            <div className="relative mt-8 grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 rounded-xl bg-white/10 p-6 backdrop-blur flex flex-col items-center justify-center text-center ring-1 ring-white/10">
                <Cloud size={56} className="opacity-90" />
                <div className="mt-4 text-5xl font-bold">{Math.round(data.temperature)}&deg;C</div>
                <div className="mt-1 text-sm opacity-90">{conditionLabel}</div>
                <div className="mt-3 text-xs opacity-80">
                  {t('weather.feelsLike')} {Math.round(data.apparentTemperature)}&deg;C
                </div>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                <Stat icon={<Thermometer size={18} />} label={t('weather.label.feels')} value={`${Math.round(data.apparentTemperature)}\u00B0C`} />
                <Stat icon={<Droplets size={18} />} label={t('weather.label.humidity')} value={`${data.humidity}%`} />
                <Stat icon={<Wind size={18} />} label={t('weather.label.wind')} value={`${data.windSpeed} km/h`} />
                <Stat icon={<Compass size={18} />} label={t('weather.label.windDir')} value={`${data.windDirection}\u00B0`} />
                <Stat icon={<Gauge size={18} />} label={t('weather.label.pressure')} value={`${Math.round(data.pressure)} hPa`} />
                <Stat icon={<Cloud size={18} />} label={t('weather.label.condition')} value={conditionLabel} />
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
    <div className="rounded-xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/10">
      <div className="flex items-center gap-2 text-xs opacity-80">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  )
}
