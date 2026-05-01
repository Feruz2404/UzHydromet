import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Globe, Clock, Navigation, ExternalLink } from 'lucide-react'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const headerMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

type Row = { icon: ReactNode; label: string; value: string }

export function LocationMap() {
  const { t } = useLanguage()
  const rows: Row[] = [
    { icon: <MapPin size={16} />, label: t('location.label.address'), value: agency.address },
    { icon: <Phone size={16} />, label: t('location.label.phone'), value: agency.phone },
    { icon: <Mail size={16} />, label: t('location.label.email'), value: agency.email },
    { icon: <Globe size={16} />, label: t('location.label.website'), value: agency.website },
    { icon: <Clock size={16} />, label: t('location.label.workingHours'), value: t('agency.workingHours') }
  ]
  return (
    <section id="location" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...headerMotion} className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('location.eyebrow')}</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('location.title')}</h2>
        </motion.div>
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-white via-white to-brand-mist border border-slate-100 p-7 shadow-card">
            <ul className="space-y-2">
              {rows.map((r, idx) => (
                <li key={idx} className="flex gap-3 items-start p-3 rounded-xl hover:bg-brand-mist/60 transition">
                  <span className="w-9 h-9 rounded-lg bg-white text-brand-deep ring-1 ring-brand-sky/30 flex items-center justify-center flex-shrink-0">
                    {r.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold">{r.label}</span>
                    <span className="block text-sm font-semibold text-brand-navy break-words">{r.value}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={agency.mapOpenUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card hover:shadow-glow transition-all">
                <ExternalLink size={14} /> {t('location.openMap')}
              </a>
              <a href={agency.mapOpenUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-brand-deep text-sm font-semibold hover:border-brand-primary transition">
                <Navigation size={14} /> {t('location.directions')}
              </a>
            </div>
          </div>
          <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-slate-100 min-h-[360px] bg-white shadow-card">
            <iframe
              title={t('location.iframeTitle')}
              src={agency.mapEmbedUrl}
              className="w-full h-full min-h-[360px] grayscale-[15%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
