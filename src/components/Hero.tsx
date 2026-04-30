import { motion } from 'framer-motion'
import { Activity, MapPin, Calendar, ShieldAlert } from 'lucide-react'

const stats = [
  { icon: 'activity', label: '24/7 Monitoring' },
  { icon: 'map', label: '14 Regions' },
  { icon: 'cal', label: '7+ Service Areas' },
  { icon: 'alert', label: 'Rapid Alerts' }
] as const

function StatIcon({ kind }: { kind: string }) {
  if (kind === 'activity') return <Activity size={18} />
  if (kind === 'map') return <MapPin size={18} />
  if (kind === 'cal') return <Calendar size={18} />
  return <ShieldAlert size={18} />
}

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#F5FAFD] to-white">
      <div className="absolute inset-0 -z-10 opacity-50" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.25),transparent_60%)]" />
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(0,107,166,0.08)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-[#006BA6]/10 text-[#006BA6] text-xs font-medium">
            Official Government Agency
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight">
            Hydrometeorological Service Agency of the Republic of Uzbekistan
          </h1>
          <p className="mt-5 text-base md:text-lg text-slate-600 max-w-xl">
            A reliable information center for weather, climate, hydrology, and agrometeorological observations.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#weather"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#006BA6] text-white font-medium hover:bg-[#003B5C] transition"
            >
              View Weather
            </a>
            <a
              href="#reception"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-200 text-[#003B5C] font-medium hover:border-[#006BA6] transition"
            >
              Reception Hours
            </a>
            <a
              href="#location"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-200 text-[#003B5C] font-medium hover:border-[#006BA6] transition"
            >
              Open Map
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((m) => (
              <div
                key={m.label}
                className="rounded-xl bg-white/70 backdrop-blur border border-white shadow-sm p-3 flex items-center gap-2"
              >
                <span className="w-8 h-8 rounded-lg bg-[#006BA6]/10 text-[#006BA6] flex items-center justify-center">
                  <StatIcon kind={m.icon} />
                </span>
                <span className="text-xs font-medium text-slate-700">{m.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Live Monitoring Dashboard</div>
                <div className="text-lg font-semibold text-[#003B5C]">Tashkent</div>
              </div>
              <span className="flex items-center gap-2 text-xs text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { k: 'Stations', v: '42' },
                { k: 'Sensors', v: '186' },
                { k: 'Daily Reports', v: '24' },
                { k: 'Regions', v: '14' }
              ].map((s) => (
                <div key={s.k} className="rounded-xl bg-gradient-to-br from-[#F5FAFD] to-white border border-slate-100 p-3">
                  <div className="text-xs text-slate-500">{s.k}</div>
                  <div className="text-2xl font-bold text-[#003B5C]">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

