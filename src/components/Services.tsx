import { motion } from 'framer-motion'
import {
  CloudRain,
  Waves,
  Sprout,
  BarChart3,
  Trees,
  Plane,
  Cpu,
  Siren
} from 'lucide-react'

const services = [
  { id: 'meteo', title: 'Meteorology', text: 'Atmospheric observations, forecasts, and reporting.' },
  { id: 'hydro', title: 'Hydrology', text: 'Water resources, river basins, and flood monitoring.' },
  { id: 'agro', title: 'Agrometeorology', text: 'Climate insights for crops and farming planning.' },
  { id: 'climate', title: 'Climate Monitoring', text: 'Climate trend tracking and historical analysis.' },
  { id: 'env', title: 'Environmental Monitoring', text: 'Air quality and environmental observation.' },
  { id: 'aviation', title: 'Aviation Meteorology', text: 'Specialized forecasts for aviation safety.' },
  { id: 'digital', title: 'Digital Forecasting', text: 'Modern numerical weather prediction systems.' },
  { id: 'alerts', title: 'Severe Weather Alerts', text: 'Early warning of dangerous weather events.' }
]

function ServiceIcon({ id }: { id: string }) {
  if (id === 'meteo') return <CloudRain size={22} />
  if (id === 'hydro') return <Waves size={22} />
  if (id === 'agro') return <Sprout size={22} />
  if (id === 'climate') return <BarChart3 size={22} />
  if (id === 'env') return <Trees size={22} />
  if (id === 'aviation') return <Plane size={22} />
  if (id === 'digital') return <Cpu size={22} />
  return <Siren size={22} />
}

export function Services() {
  return (
    <section id="services" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial= opacity: 0, y: 20 
          whileInView= opacity: 1, y: 0 
          viewport= once: true 
          transition= duration: 0.5 
          className="mb-10 text-center"
        >
          <span className="text-xs font-medium text-[#006BA6] uppercase">Our Services</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#003B5C]">
            Comprehensive Hydrometeorological Services
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial= opacity: 0, y: 20 
              whileInView= opacity: 1, y: 0 
              viewport= once: true 
              transition= duration: 0.4, delay: i * 0.04 
              className="rounded-xl bg-gradient-to-b from-white to-[#F5FAFD] border border-slate-100 p-5 hover:shadow-lg hover:border-[#38BDF8]/30 transition"
            >
              <div className="w-11 h-11 rounded-xl bg-[#006BA6]/10 text-[#006BA6] flex items-center justify-center">
                <ServiceIcon id={s.id} />
              </div>
              <div className="mt-3 font-semibold text-[#003B5C]">{s.title}</div>
              <div className="mt-1 text-sm text-slate-600">{s.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
