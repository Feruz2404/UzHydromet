import { motion } from 'framer-motion'
import { Calendar, Clock, Phone, Mail } from 'lucide-react'
import { motionPreset } from '../lib/motion'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../store/contentStore'
import { SectionHeader } from './SectionHeader'

type Day = { id: string; labelKey: string; fallback: string }
const weekDays: Day[] = [
  { id: 'mon', labelKey: 'day.mon', fallback: 'Mon' },
  { id: 'tue', labelKey: 'day.tue', fallback: 'Tue' },
  { id: 'wed', labelKey: 'day.wed', fallback: 'Wed' },
  { id: 'thu', labelKey: 'day.thu', fallback: 'Thu' },
  { id: 'fri', labelKey: 'day.fri', fallback: 'Fri' }
]

export function ReceptionSchedule() {
  const { lang, t } = useLanguage()
  const { content } = useContent()
  const leader = content.leaders.length > 0 ? content.leaders[0] : null
  const receptionDayLabel = leader ? leader.receptionDay[lang] : ''
  const receptionTime = leader ? leader.receptionTime : '11:00\u201313:00'
  return (
    <section id="reception" className="section bg-white">
      <div className="container-page grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <SectionHeader
            eyebrow={t('reception.eyebrow', 'Reception schedule')}
            title={t('reception.title', 'When you can visit')}
            description={t('reception.subtitle', 'Citizen reception is held weekly by the Agency Director.')}
          />
        </div>
        <motion.div {...motionPreset.fadeUp} className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-6 shadow-card">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/80">
              <Calendar size={14} />
              <span>{t('reception.day', 'Reception day')}</span>
            </div>
            <div className="mt-3 text-2xl font-bold">{receptionDayLabel || t('day.thu', 'Thursday')}</div>
            <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-wider text-white/80">
              <Clock size={14} />
              <span>{t('reception.time', 'Hours')}</span>
            </div>
            <div className="mt-3 text-2xl font-bold">{receptionTime}</div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-semibold text-ink-900">{t('reception.contactsTitle', 'Direct contacts')}</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2"><Phone size={14} className="text-brand-600" /> {content.contact.phone}</li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-brand-600" /> {content.contact.email}</li>
            </ul>
            <div className="mt-5 pt-5 border-t border-slate-100">
              <div className="text-xs uppercase tracking-wider text-slate-500">{t('reception.openDays', 'Open Mon\u2013Fri')}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {weekDays.map((d) => (
                  <span key={d.id} className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-medium">
                    {t(d.labelKey, d.fallback)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
