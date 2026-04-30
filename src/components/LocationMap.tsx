import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Globe, Clock, Navigation } from 'lucide-react'
import { agency } from '../data/defaultContent'

type Row = { icon: JSX.Element; label: string; value: string }

export function LocationMap() {
  const rows: Row[] = [
    { icon: <MapPin className="text-[#006BA6]" size={18} />, label: 'Address', value: agency.address },
    { icon: <Phone className="text-[#006BA6]" size={18} />, label: 'Phone', value: agency.phone },
    { icon: <Mail className="text-[#006BA6]" size={18} />, label: 'Email', value: agency.email },
    { icon: <Globe className="text-[#006BA6]" size={18} />, label: 'Website', value: agency.website },
    { icon: <Clock className="text-[#006BA6]" size={18} />, label: 'Working Hours', value: agency.workingHours }
  ]
  return (
    <section id="location" className="py-16 lg:py-20 bg-[#F5FAFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial= opacity: 0, y: 20 
          whileInView= opacity: 1, y: 0 
          viewport= once: true 
          transition= duration: 0.5 
          className="mb-10 text-center"
        >
          <span className="text-xs font-medium text-[#006BA6] uppercase">Location</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#003B5C]">Visit Our Office</h2>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white border border-slate-100 p-6">
            <ul className="space-y-4 text-sm">
              {rows.map((r) => (
                <li key={r.label} className="flex gap-3">
                  {r.icon}
                  <span>
                    <span className="block text-slate-500">{r.label}</span>
                    <span className="block font-medium text-[#003B5C]">{r.value}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={agency.mapOpenUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#006BA6] text-white text-sm font-medium hover:bg-[#003B5C] transition"
              >
                <MapPin size={14} /> Open in Map
              </a>
              <a
                href={agency.mapOpenUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-[#003B5C] text-sm font-medium hover:border-[#006BA6] transition"
              >
                <Navigation size={14} /> Get Directions
              </a>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-100 min-h-[320px] bg-white">
            <iframe
              title="Office location"
              src={agency.mapEmbedUrl}
              className="w-full h-full min-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
