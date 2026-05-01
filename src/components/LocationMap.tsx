import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { MapPin, Phone, Mail, Globe, Clock, Navigation } from 'lucide-react'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const fadeUpMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

type Row = { icon: ReactNode; label: string; value: string }

export function LocationMap() {
  const { t } = useLanguage()
  const rows: Row[] = [
    { icon: <MapPin className="text-[#006BA6]" size={18} />, label: t('location.label.address'), value: agency.address },
    { icon: <Phone className="text-[#006BA6]" size={18} />, label: t('location.label.phone'), value: agency.phone },
    { icon: <Mail className="text-[#006BA6]" size={18} />, label: t('location.label.email'), value: agency.email },
    { icon: <Globe className="text-[#006BA6]" size={18} />, label: t('location.label.website'), value: agency.website },
    { icon: <Clock className="text-[#006BA6]" size={18} />, label: t('location.label.workingHours'), value: t('agency.workingHours') }
  ]
  return (
    <section id="location" className="py-16 lg:py-20 bg-[#F5FAFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpMotion} className="mb-10 text-center">
          <span className="text-xs font-medium text-[#006BA6] uppercase tracking-wider">{t('location.eyebrow')}</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#003B5C]">{t('location.title')}</h2>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
            <ul className="space-y-4 text-sm">
              {rows.map((r, idx) => (
                <li key={idx} className="flex gap-3">
                  {r.icon}
                  <span>
                    <span className="block text-slate-500">{r.label}</span>
                    <span className="block font-medium text-[#003B5C] break-words">{r.value}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={agency.mapOpenUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#006BA6] text-white text-sm font-medium hover:bg-[#003B5C] transition">
                <MapPin size={14} /> {t('location.openMap')}
              </a>
              <a href={agency.mapOpenUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-[#003B5C] text-sm font-medium hover:border-[#006BA6] transition">
                <Navigation size={14} /> {t('location.directions')}
              </a>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-100 min-h-[320px] bg-white shadow-sm">
            <iframe
              title={t('location.iframeTitle')}
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
