import { motion } from 'framer-motion'
import { CloudSun, Thermometer, Droplets, Sprout } from 'lucide-react'
import { agency } from '../data/defaultContent'

const cards = [
  { icon: 'cloudsun', title: 'Weather Forecasting', text: 'Daily and seasonal forecasts for all regions of Uzbekistan.' },
  { icon: 'therm', title: 'Climate Monitoring', text: 'Long-term observation and analysis of climate trends.' },
  { icon: 'drops', title: 'Hydrological Observations', text: 'Tracking surface water resources and basin conditions.' },
  { icon: 'sprout', title: 'Agrometeorological Analysis', text: 'Insights to support agriculture and food security.' }
]

function CardIcon({ kind }: { kind: string }) {
  if (kind === 'cloudsun') return <CloudSun size={20} />
  if (kind === 'therm') return <Thermometer size={20} />
  if (kind === 'drops') return <Droplets size={20} />
  return <Sprout size={20} />
}

export function About() {
  return (
    <section id="about" className="py-16 lg:py-20 bg-[#F5FAFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial= opacity: 0, y: 20 
          whileInView= opacity: 1, y: 0 
          viewport= once: true 
          transition= duration: 0.5 
        >
          <span className="text-xs font-medium text-[#006BA6] uppercase">About Us</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#003B5C]">
            Hydrometeorological Service Agency
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">{agency.about}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white border border-slate-100">
              <div className="text-xs text-slate-500">Phone</div>
              <div className="text-sm font-medium text-[#003B5C]">{agency.phone}</div>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-100">
              <div className="text-xs text-slate-500">Email</div>
              <div className="text-sm font-medium text-[#003B5C]">{agency.email}</div>
            </div>
          </div>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial= opacity: 0, y: 20 
              whileInView= opacity: 1, y: 0 
              viewport= once: true 
              transition= duration: 0.4, delay: i * 0.05 
              className="rounded-xl bg-white p-5 border border-slate-100 shadow-sm hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-lg bg-[#006BA6]/10 text-[#006BA6] flex items-center justify-center">
                <CardIcon kind={c.icon} />
              </div>
              <div className="mt-3 font-semibold text-[#003B5C]">{c.title}</div>
              <div className="mt-1 text-sm text-slate-600">{c.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
