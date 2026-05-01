import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, CalendarClock, ChevronDown, FileText, BookOpen } from 'lucide-react'
import { leaders } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const headerMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const cardMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
}

type ExpandedKind = 'responsibilities' | 'biography' | null

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '\u2014'
  const first = parts[0]?.charAt(0) ?? ''
  const second = parts[1]?.charAt(0) ?? ''
  const result = (first + second).toUpperCase()
  return result || '\u2014'
}

export function Leadership() {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState<Record<string, ExpandedKind>>({})

  function toggle(id: string, kind: Exclude<ExpandedKind, null>) {
    setExpanded((prev) => ({
      ...prev,
      [id]: prev[id] === kind ? null : kind
    }))
  }

  return (
    <section id="leadership" className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...headerMotion} className="mb-8 md:mb-10 max-w-2xl">
          <span className="text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('leadership.eyebrow')}</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('leadership.title')}</h2>
        </motion.div>

        <div className="grid gap-5">
          {leaders.map((leader) => {
            const open = expanded[leader.id] ?? null
            const initials = getInitials(leader.name)
            const telHref = `tel:${leader.phone.replace(/[^0-9+]/g, '')}`
            return (
              <motion.article key={leader.id} {...cardMotion} className="rounded-3xl bg-white border border-slate-100 shadow-card hover:shadow-glow transition-all overflow-hidden">
                <div className="grid gap-5 md:gap-6 p-5 sm:p-6 lg:p-7 lg:grid-cols-12 lg:items-start">
                  <div className="lg:col-span-2 flex lg:block items-center gap-4">
                    {leader.image ? (
                      <img src={leader.image} alt={leader.name} className="h-16 w-16 sm:h-20 sm:w-20 lg:h-28 lg:w-28 rounded-2xl object-cover bg-brand-mist border border-slate-100 shrink-0" />
                    ) : (
                      <div aria-hidden="true" className="h-16 w-16 sm:h-20 sm:w-20 lg:h-28 lg:w-28 shrink-0 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-deep text-white flex items-center justify-center font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight shadow-card">
                        {initials}
                      </div>
                    )}
                    <div className="lg:hidden flex-1 min-w-0">
                      <h3 className="font-display text-base sm:text-lg font-extrabold text-brand-navy leading-tight break-words">{leader.name}</h3>
                      <p className="mt-1 text-sm text-brand-muted leading-snug">{t(leader.positionKey)}</p>
                    </div>
                  </div>

                  <div className="hidden lg:flex lg:col-span-5 flex-col justify-start">
                    <h3 className="font-display text-xl font-extrabold text-brand-navy leading-tight break-words">{leader.name}</h3>
                    <p className="mt-2 text-sm text-brand-muted leading-relaxed">{t(leader.positionKey)}</p>
                  </div>

                  <div className="lg:col-span-5">
                    <ul className="space-y-2.5 text-sm">
                      <li className="flex items-start gap-2.5">
                        <Phone size={15} aria-hidden="true" className="mt-0.5 text-brand-deep flex-shrink-0" />
                        <span className="sr-only">{t('leadership.label.phone')}: </span>
                        <a href={telHref} className="text-brand-navy hover:text-brand-deep break-words">{leader.phone}</a>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Mail size={15} aria-hidden="true" className="mt-0.5 text-brand-deep flex-shrink-0" />
                        <span className="sr-only">{t('leadership.label.email')}: </span>
                        {leader.emailPending || !leader.email ? (
                          <span className="italic text-brand-muted">{t('leadership.infoPending')}</span>
                        ) : (
                          <a href={`mailto:${leader.email}`} className="text-brand-navy hover:text-brand-deep break-all">{leader.email}</a>
                        )}
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Globe size={15} aria-hidden="true" className="mt-0.5 text-brand-deep flex-shrink-0" />
                        <span className="sr-only">{t('leadership.label.website')}: </span>
                        <a href={leader.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-brand-navy hover:text-brand-deep break-all">{leader.website}</a>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <MapPin size={15} aria-hidden="true" className="mt-0.5 text-brand-deep flex-shrink-0" />
                        <span className="sr-only">{t('leadership.label.address')}: </span>
                        <span className="text-brand-muted leading-snug break-words">{t(leader.addressKey)}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CalendarClock size={15} aria-hidden="true" className="mt-0.5 text-brand-deep flex-shrink-0" />
                        <span className="sr-only">{t('leadership.label.reception')}: </span>
                        <span className="text-brand-muted">{t(leader.dayKey)}, {leader.receptionTime}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {(leader.showResponsibilities || leader.showBiography) && (
                  <div className="px-5 sm:px-6 lg:px-7 pb-5 sm:pb-6 lg:pb-7">
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      {leader.showResponsibilities && (
                        <button
                          type="button"
                          onClick={() => toggle(leader.id, 'responsibilities')}
                          aria-expanded={open === 'responsibilities'}
                          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto ${open === 'responsibilities' ? 'bg-gradient-to-br from-brand-primary to-brand-deep text-white shadow-card' : 'bg-white border border-slate-200 text-brand-navy hover:border-brand-primary hover:text-brand-deep'}`}
                        >
                          <FileText size={15} aria-hidden="true" />
                          {t('leadership.action.responsibilities')}
                          <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${open === 'responsibilities' ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                      {leader.showBiography && (
                        <button
                          type="button"
                          onClick={() => toggle(leader.id, 'biography')}
                          aria-expanded={open === 'biography'}
                          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto ${open === 'biography' ? 'bg-gradient-to-br from-brand-primary to-brand-deep text-white shadow-card' : 'bg-white border border-slate-200 text-brand-navy hover:border-brand-primary hover:text-brand-deep'}`}
                        >
                          <BookOpen size={15} aria-hidden="true" />
                          {t('leadership.action.biography')}
                          <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${open === 'biography' ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>

                    {open === 'responsibilities' && (
                      <div className="mt-4 rounded-2xl bg-brand-mist/60 border border-slate-100 p-5 text-sm text-brand-navy leading-relaxed">
                        {t(leader.responsibilitiesKey)}
                      </div>
                    )}
                    {open === 'biography' && (
                      <div className="mt-4 rounded-2xl bg-brand-mist/60 border border-slate-100 p-5 text-sm text-brand-navy leading-relaxed">
                        {t(leader.biographyKey)}
                      </div>
                    )}
                  </div>
                )}
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
