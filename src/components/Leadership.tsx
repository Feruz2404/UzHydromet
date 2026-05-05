import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, CalendarClock, ChevronDown, FileText, BookOpen } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useLanguage } from '../i18n/LanguageContext'
import { fadeInUpInView, fadeInUpInViewQuick } from '../lib/motion'
import { MobileCarousel } from './ui/MobileCarousel'
import { resolveText, resolveDay, stripPhonePrefix, stripEmailPrefix, stripUrlPrefix } from '../i18n/contentResolver'

type ExpandedKind = 'responsibilities' | 'biography' | null

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '\u2014'
  const first = parts[0]?.charAt(0) ?? ''
  const second = parts[1]?.charAt(0) ?? ''
  return (first + second).toUpperCase() || '\u2014'
}

export function Leadership() {
  const { t, lang } = useLanguage()
  const { activeLeaders, settings } = useAdmin()
  const [expanded, setExpanded] = useState<Record<string, ExpandedKind>>({})

  function toggle(id: string, kind: Exclude<ExpandedKind, null>) {
    setExpanded((prev) => ({ ...prev, [id]: prev[id] === kind ? null : kind }))
  }

  return (
    <section id="leadership" className="py-10 md:py-14 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUpInView} className="mb-6 md:mb-10 max-w-2xl">
          <span className="text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('leadership.eyebrow')}</span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('leadership.title')}</h2>
        </motion.div>

        {activeLeaders.length === 0 ? (
          <div className="rounded-2xl bg-brand-mist border border-slate-100 p-10 text-center text-brand-muted">{t('reception.emptyAdmin')}</div>
        ) : (
          <MobileCarousel
            autoPlay
            intervalMs={7000}
            ariaLabel={t('leadership.title')}
            desktopBreakpointPx={640}
            className="-mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0 flex sm:grid sm:grid-cols-1 gap-4 sm:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scroll-smooth no-scrollbar items-start"
          >
            {activeLeaders.map((leader) => {
              const open = expanded[leader.id] ?? null
              const initials = getInitials(leader.fullName)
              const phoneClean = stripPhonePrefix(leader.phone)
              const emailClean = stripEmailPrefix(leader.email)
              const telHref = `tel:${phoneClean.replace(/[^0-9+]/g, '')}`
              const position = resolveText(leader.position, leader.positionTranslations, leader.positionKey, lang, t)
              const day = resolveDay(leader.receptionDay, leader.receptionDayTranslations, leader.dayKey, lang, t)
              const directAddress = leader.address && leader.address.trim() ? leader.address : ''
              const address = directAddress
                ? resolveText(directAddress, leader.addressTranslations, leader.addressKey, lang, t)
                : (leader.addressKey ? t(leader.addressKey) : settings.address)
              const websiteUrl = leader.websiteUrl || settings.officialSiteUrl
              const websiteLabel = stripUrlPrefix(websiteUrl)
              const respText = leader.responsibilities && leader.responsibilities.trim()
                ? resolveText(leader.responsibilities, leader.responsibilitiesTranslations, leader.responsibilitiesKey, lang, t)
                : (leader.responsibilitiesKey && (leader.showResponsibilities ?? false)) ? t(leader.responsibilitiesKey) : ''
              const bioText = leader.biography && leader.biography.trim()
                ? resolveText(leader.biography, leader.biographyTranslations, leader.biographyKey, lang, t)
                : (leader.biographyKey && (leader.showBiography ?? false)) ? t(leader.biographyKey) : ''
              const showResp = Boolean(respText)
              const showBio = Boolean(bioText)
              const hasActions = showResp || showBio
              const respBtn = open === 'responsibilities'
                ? 'bg-gradient-to-br from-brand-primary to-brand-deep text-white shadow-card'
                : 'bg-white border border-slate-200 text-brand-navy hover:border-brand-primary hover:text-brand-deep'
              const bioBtn = open === 'biography'
                ? 'bg-gradient-to-br from-brand-primary to-brand-deep text-white shadow-card'
                : 'bg-white border border-slate-200 text-brand-navy hover:border-brand-primary hover:text-brand-deep'
              return (
                <motion.article
                  key={leader.id}
                  {...fadeInUpInViewQuick}
                  className="snap-start min-w-[86vw] sm:min-w-0 shrink-0 sm:shrink rounded-3xl bg-white border border-slate-100 shadow-card hover:shadow-glow transition-all overflow-hidden flex flex-col"
                >
                  <div className="grid gap-4 md:gap-6 p-4 sm:p-6 lg:p-7 lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-2 flex lg:block items-center gap-3 min-w-0">
                      {leader.photoUrl ? (
                        <img src={leader.photoUrl} alt={leader.fullName} className="h-14 w-14 sm:h-20 sm:w-20 lg:h-28 lg:w-28 rounded-2xl object-cover bg-brand-mist border border-slate-100 shrink-0" />
                      ) : (
                        <div aria-hidden="true" className="h-14 w-14 sm:h-20 sm:w-20 lg:h-28 lg:w-28 shrink-0 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-deep text-white flex items-center justify-center font-display text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight shadow-card">{initials}</div>
                      )}
                      <div className="lg:hidden flex-1 min-w-0">
                        <h3 className="font-display text-[15px] sm:text-lg font-extrabold text-brand-navy leading-tight [overflow-wrap:anywhere] hyphens-auto">{leader.fullName}</h3>
                        <p className="mt-1 text-[12px] sm:text-sm text-brand-muted leading-snug [overflow-wrap:anywhere]">{position}</p>
                      </div>
                    </div>
                    <div className="hidden lg:flex lg:col-span-5 flex-col min-w-0">
                      <h3 className="font-display text-xl font-extrabold text-brand-navy leading-tight [overflow-wrap:anywhere]">{leader.fullName}</h3>
                      <p className="mt-2 text-sm text-brand-muted leading-relaxed [overflow-wrap:anywhere]">{position}</p>
                    </div>
                    <div className="lg:col-span-5 min-w-0">
                      <ul className="space-y-1.5 sm:space-y-2 text-[12.5px] sm:text-sm">
                        <li className="flex items-start gap-2 min-w-0"><Phone size={14} aria-hidden="true" className="mt-0.5 text-brand-deep flex-shrink-0" /><a href={telHref} className="text-brand-navy hover:text-brand-deep [overflow-wrap:anywhere]">{phoneClean || '\u2014'}</a></li>
                        <li className="flex items-start gap-2 min-w-0"><Mail size={14} aria-hidden="true" className="mt-0.5 text-brand-deep flex-shrink-0" />{emailClean ? (<a href={`mailto:${emailClean}`} className="text-brand-navy hover:text-brand-deep [overflow-wrap:anywhere]">{emailClean}</a>) : (<span className="italic text-brand-muted">{t('leadership.infoPending')}</span>)}</li>
                        <li className="flex items-start gap-2 min-w-0"><Globe size={14} aria-hidden="true" className="mt-0.5 text-brand-deep flex-shrink-0" /><a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-brand-navy hover:text-brand-deep [overflow-wrap:anywhere]">{websiteLabel}</a></li>
                        <li className="flex items-start gap-2 min-w-0"><MapPin size={14} aria-hidden="true" className="mt-0.5 text-brand-deep flex-shrink-0" /><span className="text-brand-muted leading-snug [overflow-wrap:anywhere]">{address}</span></li>
                        <li className="flex items-start gap-2 min-w-0"><CalendarClock size={14} aria-hidden="true" className="mt-0.5 text-brand-deep flex-shrink-0" /><span className="text-brand-muted [overflow-wrap:anywhere]">{day}{day && leader.receptionTime ? ', ' : ''}{leader.receptionTime}</span></li>
                      </ul>
                    </div>
                  </div>
                  {hasActions && (
                    <div className="px-4 sm:px-6 lg:px-7 pb-4 sm:pb-6 lg:pb-7 mt-auto">
                      <div className="flex flex-col sm:flex-row gap-2">
                        {showResp && (
                          <button type="button" onClick={() => toggle(leader.id, 'responsibilities')} aria-expanded={open === 'responsibilities'} className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-[12.5px] sm:text-sm font-semibold transition-all w-full sm:w-auto ${respBtn}`}><FileText size={14} aria-hidden="true" />{t('leadership.action.responsibilities')}<ChevronDown size={13} aria-hidden="true" className={open === 'responsibilities' ? 'transition-transform rotate-180' : 'transition-transform'} /></button>
                        )}
                        {showBio && (
                          <button type="button" onClick={() => toggle(leader.id, 'biography')} aria-expanded={open === 'biography'} className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-[12.5px] sm:text-sm font-semibold transition-all w-full sm:w-auto ${bioBtn}`}><BookOpen size={14} aria-hidden="true" />{t('leadership.action.biography')}<ChevronDown size={13} aria-hidden="true" className={open === 'biography' ? 'transition-transform rotate-180' : 'transition-transform'} /></button>
                        )}
                      </div>
                      {open === 'responsibilities' && respText && (
                        <div className="mt-3 rounded-2xl bg-brand-mist/60 border border-slate-100 p-3.5 sm:p-4 text-[12.5px] sm:text-sm text-brand-navy leading-relaxed whitespace-pre-line [overflow-wrap:anywhere]">{respText}</div>
                      )}
                      {open === 'biography' && bioText && (
                        <div className="mt-3 rounded-2xl bg-brand-mist/60 border border-slate-100 p-3.5 sm:p-4 text-[12.5px] sm:text-sm text-brand-navy leading-relaxed whitespace-pre-line [overflow-wrap:anywhere]">{bioText}</div>
                      )}
                    </div>
                  )}
                </motion.article>
              )
            })}
          </MobileCarousel>
        )}
      </div>
    </section>
  )
}
