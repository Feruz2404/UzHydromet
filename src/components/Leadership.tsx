import { motion } from 'framer-motion'
import { Phone, Mail, Calendar, Clock, MapPin } from 'lucide-react'
import { leaders } from '../data/defaultContent'

function initialsOf(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  const a = parts[0]?.charAt(0) ?? ''
  const b = parts[1]?.charAt(0) ?? ''
  return (a + b).toUpperCase()
}

export function Leadership() {
  return (
    <section id="leadership" className="py-16 lg:py-20 bg-[#F5FAFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial= opacity: 0, y: 20 
          whileInView= opacity: 1, y: 0 
          viewport= once: true 
          transition= duration: 0.5 
          className="mb-10 text-center"
        >
          <span className="text-xs font-medium text-[#006BA6] uppercase">Leadership</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#003B5C]">Agency Leadership</h2>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-6">
          {leaders.map((l, i) => (
            <motion.div
              key={l.name}
              initial= opacity: 0, y: 20 
              whileInView= opacity: 1, y: 0 
              viewport= once: true 
              transition= duration: 0.4, delay: i * 0.05 
              className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006BA6] to-[#003B5C] text-white flex items-center justify-center text-xl font-bold">
                  {initialsOf(l.name)}
                </div>
                <div>
                  <div className="font-semibold text-[#003B5C]">{l.name}</div>
                  <div className="text-sm text-slate-500">{l.position}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">{l.description}</p>
              <div className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={14} /> Reception: {l.receptionDay}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={14} /> {l.receptionTime}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={14} /> {l.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} /> {l.email}
                </div>
                <div className="flex items-center gap-2 text-slate-600 sm:col-span-2">
                  <MapPin size={14} /> {l.office}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
