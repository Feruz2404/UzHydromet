import { motion } from 'framer-motion'
import { RefreshCw, Wind, Droplets, Gauge, Thermometer, Compass, Cloud } from 'lucide-react'
import { useWeather } from '../hooks/useWeather'
import { describeWeather } from '../data/weatherCodes'
import { agency } from '../data/defaultContent'

export function WeatherSection() {
  const { data, loading, error, refresh } = useWeather(
    agency.weather.latitude,
    agency.weather.longitude
  )
  const info = data ? describeWeather(data.weatherCode) : null
  const updated = data
    ? new Date(data.time).toLocaleString('en-GB', { timeZone: 'Asia/Tashkent' })
    : '-'

  return (
    <section id="weather" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial= opacity: 0, y: 20 
          whileInView= opacity: 1, y: 0 
          viewport= once: true 
          transition= duration: 0.5 
          className="mb-10 text-center"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-[#38BDF8]/10 text-[#006BA6] text-xs font-medium">
            Live Data
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#003B5C]">Live Weather Conditions</h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Current observations for {agency.weather.city} powered by Open-Meteo.
          </p>
        </motion.div>

        <div className="rounded-2xl bg-gradient-to-br from-[#003B5C] to-[#006BA6] text-white p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wide opacity-80">{agency.weather.city}</div>
              <div className="text-sm opacity-80">Last updated: {updated}</div>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm"
              aria-label="Refresh weather"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          {loading && (
            <div className="mt-8 text-center opacity-90">Loading weather data...</div>
          )}
          {error && !loading && (
            <div className="mt-8 text-center">
              <p className="opacity-90">Unable to load weather data.</p>
              <button
                type="button"
                onClick={refresh}
                className="mt-3 px-4 py-2 rounded-lg bg-white text-[#003B5C] text-sm font-medium"
              >
                Try again
              </button>
            </div>
          )}
          {data && info && !loading && (
            <div className="mt-8 grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 rounded-xl bg-white/10 p-6 backdrop-blur flex flex-col items-center justify-center text-center">
                <Cloud size={56} className="opacity-90" />
                <div className="mt-4 text-5xl font-bold">{Math.round(data.temperature)}&deg;C</div>
                <div className="mt-1 text-sm opacity-90">{info.label}</div>
                <div className="mt-3 text-xs opacity-80">
                  Feels like {Math.round(data.apparentTemperature)}&deg;C
                </div>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                <Stat icon={<Thermometer size={18} />} label="Feels Like" value={`${Math.round(data.apparentTemperature)}\u00B0C`} />
                <Stat icon={<Droplets size={18} />} label="Humidity" value={`${data.humidity}%`} />
                <Stat icon={<Wind size={18} />} label="Wind Speed" value={`${data.windSpeed} km/h`} />
                <Stat icon={<Compass size={18} />} label="Wind Direction" value={`${data.windDirection}\u00B0`} />
                <Stat icon={<Gauge size={18} />} label="Pressure" value={`${Math.round(data.pressure)} hPa`} />
                <Stat icon={<Cloud size={18} />} label="Condition" value={info.label} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Stat({ icon, label, value }: { icon: JSX.Element; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-xs opacity-80">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  )
}
