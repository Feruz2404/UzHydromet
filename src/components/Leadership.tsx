import { motion } from 'framer-motion'
import { Phone, Mail, Clock, MapPin } from 'lucide-react'
import { motionPreset } from '../lib/motion'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../store/contentStore'
import { SectionHeader } from './SectionHeader'

function initials(name: string): string {
  const parts = name.split(' ')
  if (parts.length === 0) return ''
  const first = parts[0].charAt(0)
  if (parts.length === 1) return first
  const second = parts[1].charAt(0)
  return first + second
}

export function Leadership() {
  const { lang, t } = useLanguage()
  const { content } = useContent()
  return (
    <section id="leadership" className="section bg-bg">
      <div className="container-page">
        <SectionHeader
          eyebrow={t('leaders.eyebrow', 'Leadership')}
          title={t('leaders.title', 'Agency leadership')}
          description={t('leaders.subtitle', 'Direct contacts and reception details for the senior leadership team.')}
        />
        <motion.div {...motionPreset.stagger} className="mt-9 grid md:grid-cols-2 gap-5">
          {content.leaders.map((p) => (
            <motion.article
              key={p.id}
              {...motionPreset.staggerItem}
              className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 grid gap-4"
            >
              <div className="flex items-center gap-4">
                <div aria-hidden="true" className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center text-xl font-bold">
                  {initials(p.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-base font-semibold text-ink-900 truncate">{p.name}</div>
                  <div className="text-sm text-brand-700 font-medium">{p.position[lang]}</div>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{p.description[lang]}</p>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm">
                <li className="flex items-center gap-2 text-slate-700"><Phone size={14} className="text-brand-600" /> {p.phone}</li>
                <li className="flex items-center gap-2 text-slate-700"><Mail size={14} className="text-brand-600" /> {p.email}</li>
                <li className="flex items-center gap-2 text-slate-700"><Clock size={14} className="text-brand-600" /> {p.receptionDay[lang]} {p.receptionTime}</li>
                <li className="flex items-center gap-2 text-slate-700"><MapPin size={14} className="text-brand-600" /> {p.office[lang]}</li>
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
