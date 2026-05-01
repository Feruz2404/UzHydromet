import { motion } from 'framer-motion'
import { MapPin, Navigation, Phone, Mail, Clock } from 'lucide-react'
import { motionPreset } from '../lib/motion'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../store/contentStore'
import { SectionHeader } from './SectionHeader'

export function LocationMap() {
  const { lang, t } = useLanguage()
  const { content } = useContent()
  const c = content.contact
  return (
    <section id="location" className="section bg-bg">
      <div className="container-page">
        <SectionHeader
          eyebrow={t('location.eyebrow', 'Location')}
          title={t('location.title', 'How to find us')}
          description={t('location.subtitle', '72A Osiyo Street, Tashkent 100052')}
        />
        <div className="mt-9 grid lg:grid-cols-12 gap-5">
          <motion.div {...motionPreset.fadeUp} className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white">
            <iframe
              title="UzGidromet office location"
              src={c.mapEmbedUrl}
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full h-[420px] border-0"
            />
          </motion.div>
          <motion.div {...motionPreset.slideLeft} className="lg:col-span-5 grid gap-3">
            <article className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
              <h3 className="text-base font-semibold text-ink-900">{t('location.addressTitle', 'Address')}</h3>
              <p className="mt-3 text-sm text-slate-700 flex items-start gap-2">
                <MapPin size={16} className="text-brand-600 mt-0.5" />
                <span>{c.address}</span>
              </p>
              <a href={c.mapOpenUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 btn-primary">
                <Navigation size={16} />
                <span>{t('location.open', 'Open in Maps')}</span>
              </a>
            </article>
            <article className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 grid gap-3">
              <h3 className="text-base font-semibold text-ink-900">{t('location.contactsTitle', 'Contacts')}</h3>
              <ul className="text-sm text-slate-700 space-y-2">
                <li className="flex items-center gap-2"><Phone size={14} className="text-brand-600" /> {c.phone}</li>
                <li className="flex items-center gap-2"><Mail size={14} className="text-brand-600" /> {c.email}</li>
                <li className="flex items-center gap-2"><Clock size={14} className="text-brand-600" /> {c.workingHours[lang]}</li>
              </ul>
            </article>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
