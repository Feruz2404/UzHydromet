import { motion } from 'framer-motion'
import { CloudSun, Wind, Droplets, Gauge, Thermometer, Compass, RefreshCw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motionPreset } from '../lib/motion'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../store/contentStore'
import { useWeather } from '../hooks/useWeather'
import { SectionHeader } from './SectionHeader'

function formatTemperature(value: number): string {
  return Math.round(value).toString() + '\u00B0C'
}
function formatNumber(value: number): string {
  return Math.round(value).toString()
}

const localeMap: Record<string, string> = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' }
const timeFormatOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }

function formatTime(date: Date | null, locale: string): string {
  if (!date) return ''
  try {
    return date.toLocaleTimeString(locale, timeFormatOptions)
  } catch (e) {
    return ''
  }
}

function describeWeather(code: number): string {
  if (code === 0) return 'wcode.clear'
  if (code <= 3) return 'wcode.partly'
  if (code <= 48) return 'wcode.fog'
  if (code <= 67) return 'wcode.rain'
  if (code <= 77) return 'wcode.snow'
  if (code <= 82) return 'wcode.shower'
  if (code <= 86) return 'wcode.snowShower'
  return 'wcode.thunder'
}

type MetricProps = { icon: LucideIcon; label: string; value: string }

function Metric(props: MetricProps) {
  const Icon = props.icon
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <span aria-hidden="true" className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-slate-500">{props.label}</div>
        <div className="text-lg font-semibold text-ink-900 mt-1 truncate">{props.value}</div>
      </div>
    </div>
  )
}

export function WeatherSection() {
  const { t, lang } = useLanguage()
  const { content } = useContent()
  const lat = content.contact.weather.latitude
  const lon = content.contact.weather.longitude
  const { data, loading, error, refresh, lastFetched } = useWeather(lat, lon)
  const weatherDescKey = data ? describeWeather(data.weatherCode) : 'wcode.unknown'
  const localeTag = localeMap[lang] || 'en-GB'
  const updatedTime = formatTime(lastFetched, localeTag)
  const refreshIconClass = loading ? 'animate-spin' : ''
  return (
    <section id="weather" className="section bg-white">
      <div className="container-page">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionHeader
            eyebrow={t('weather.eyebrow', 'Live weather')}
            title={t('weather.title', 'Current conditions in Tashkent')}
            description={t('weather.subtitle', 'Real-time data from Open-Meteo, refreshed on demand.')}
          />
          <button type="button" onClick={refresh} disabled={loading} className="btn-secondary">
            <RefreshCw size={16} className={refreshIconClass} />
            <span>{t('weather.refresh', 'Refresh')}</span>
          </button>
        </div>
        <div className="mt-8 grid lg:grid-cols-3 gap-5">
          <motion.div {...motionPreset.fadeUp} className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-wider text-white/80">{t('weather.now', 'Now')}</span>
              <CloudSun size={28} className="text-white/90" />
            </div>
            <div className="mt-6 text-6xl font-bold leading-none">
              {data ? formatTemperature(data.temperature) : '\u2014'}
            </div>
            <div className="mt-2 text-sm text-white/85">
              {t(weatherDescKey, 'Variable')}
            </div>
            <div className="mt-6 text-xs text-white/70">
              {t('weather.feels', 'Feels like')} {data ? formatTemperature(data.apparent) : '\u2014'}
            </div>
            {error ? (
              <div className="mt-4 text-xs bg-white/10 rounded-lg px-3 py-2 text-white/90">{t('weather.error', 'Could not fetch weather')}</div>
            ) : null}
          </motion.div>
          <motion.div {...motionPreset.fadeUp} className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            <Metric icon={Wind} label={t('weather.wind', 'Wind')} value={data ? formatNumber(data.windSpeed) + ' km/h' : '\u2014'} />
            <Metric icon={Droplets} label={t('weather.humidity', 'Humidity')} value={data ? formatNumber(data.humidity) + '%' : '\u2014'} />
            <Metric icon={Gauge} label={t('weather.pressure', 'Pressure')} value={data ? formatNumber(data.pressure) + ' hPa' : '\u2014'} />
            <Metric icon={Thermometer} label={t('weather.feels', 'Feels like')} value={data ? formatTemperature(data.apparent) : '\u2014'} />
            <Metric icon={Compass} label={t('weather.direction', 'Wind direction')} value={data ? formatNumber(data.windDirection) + '\u00B0' : '\u2014'} />
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-500">{t('weather.updated', 'Last updated')}</span>
              <span className="text-lg font-semibold text-ink-900 mt-2">{updatedTime || '\u2014'}</span>
              <span className="text-xs text-slate-500 mt-1">{t('weather.source', 'Source: Open-Meteo')}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
