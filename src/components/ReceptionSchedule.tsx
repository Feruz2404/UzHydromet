import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, Clock, Phone, Mail, ArrowRight } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useLanguage } from '../i18n/LanguageContext'
import { resolveText, resolveDay, stripPhonePrefix, stripEmailPrefix } from '../i18n/contentResolver'

const headerMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '\u2014'
  const first = parts[0]?.charAt(0) ?? ''
  const second = parts[1]?.charAt(0) ?? ''
  return (first + second).toUpperCase() || '\u2014'
}

export function ReceptionSchedule() {
  const { t, lang } = useLanguage()
  const { activeLeaders, setSelectedLeaderId } = useAdmin()
  const [query, setQuery] = useState<string>('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return activeLeaders
    return activeLeaders.filter((l) => {
      const position = resolveText(l.position, l.positionTranslations, l.positionKey, lang, t).toLowerCase()
      return l.fullName.toLowerCase().includes(q) || position.includes(q)
    })
  }, [query, t, lang, activeLeaders])

  function pickLeader(id: string) {
    setSelectedLeaderId(id)
    if (typeof window !== 'undefined') {
      const el = document.getElementById('contact')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.location.hash = '#contact'
    }
  }

  return (
    <section id="reception" className="py-10 md:py-14 lg:py-20 bg-brand-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...headerMotion} className="mb-6 md:mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('reception.eyebrow')}</span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('reception.title')}</h2>
        </motion.div>

        {activeLeaders.length > 0 && (
          <div className="mb-5 md:mb-6 flex justify-end">
            <label className="relative w-full md:w-80">
              <span className="sr-only">{t('reception.searchSr')}</span>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('reception.searchPlaceholder')} aria-label={t('reception.searchSr')} className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-card focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-sky/20 transition" />
            </label>
          </div>
        )}

        {/* Desktop table at lg+ \u2014 redistributed widths so phone fits and the
            "Yozilish" button stays on a single line beside the phone column. */}
        <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[22%]" />
              <col className="w-[12%]" />
              <col className="w-[9%]" />
              <col className="w-[17%]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead className="bg-gradient-to-r from-brand-mist to-white text-left text-brand-muted">
              <tr>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider">{t('reception.col.leader')}</th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider">{t('reception.col.position')}</th>
                <th className="px-3 py-4 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">{t('reception.col.day')}</th>
                <th className="px-3 py-4 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">{t('reception.col.time')}</th>
                <th className="px-3 py-4 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">{t('reception.col.phone')}</th>
                <th className="px-3 py-4 text-[11px] font-semibold uppercase tracking-wider text-right" aria-label={t('reception.col.action')} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const position = resolveText(l.position, l.positionTranslations, l.positionKey, lang, t)
                const day = resolveDay(l.receptionDay, l.receptionDayTranslations, l.dayKey, lang, t)
                const phoneClean = stripPhonePrefix(l.phone)
                const initials = getInitials(l.fullName)
                const telHref = `tel:${phoneClean.replace(/[^0-9+]/g, '')}`
                return (
                  <tr key={l.id} className="border-t border-slate-100 hover:bg-brand-mist/40 transition align-top">
                    <td className="px-4 py-4 min-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-brand-mist border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {l.photoUrl ? <img src={l.photoUrl} alt="" className="w-full h-full object-cover" /> : <span aria-hidden="true" className="font-display text-xs font-extrabold text-white bg-gradient-to-br from-brand-primary to-brand-deep w-full h-full flex items-center justify-center">{initials}</span>}
                        </div>
                        <span className="font-semibold text-brand-navy [overflow-wrap:anywhere] leading-snug min-w-0">{l.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-brand-muted leading-snug min-w-0">
                      <span className="line-clamp-2 [overflow-wrap:anywhere]">{position}</span>
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-ice text-brand-deep text-[11.5px] font-semibold whitespace-nowrap">
                        <Calendar size={11} aria-hidden="true" />
                        {day || '\u2014'}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-brand-navy whitespace-nowrap font-medium tabular-nums">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={12} className="text-brand-deep" aria-hidden="true" />
                        {l.receptionTime || '\u2014'}
                      </span>
                    </td>
                    <td className="px-3 py-4 min-w-0">
                      <a href={telHref} className="inline-flex items-center gap-1.5 text-brand-navy hover:text-brand-deep tabular-nums [overflow-wrap:anywhere] leading-snug">
                        <Phone size={12} className="text-brand-deep shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="min-w-0">{phoneClean || '\u2014'}</span>
                      </a>
                    </td>
                    <td className="px-3 py-4 text-right">
                      <button type="button" onClick={() => pickLeader(l.id)} aria-label={`${t('reception.bookAppointment')}: ${l.fullName}`} className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white font-semibold text-[13px] shadow-card hover:shadow-glow whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 transition">
                        <span>{t('reception.book')}</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-brand-muted">{activeLeaders.length === 0 ? t('reception.emptyAdmin') : t('reception.empty')}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tablet + mobile (<1024px): premium card grid */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((l) => {
            const position = resolveText(l.position, l.positionTranslations, l.positionKey, lang, t)
            const day = resolveDay(l.receptionDay, l.receptionDayTranslations, l.dayKey, lang, t)
            const phoneClean = stripPhonePrefix(l.phone)
            const emailClean = stripEmailPrefix(l.email)
            const initials = getInitials(l.fullName)
            const telHref = `tel:${phoneClean.replace(/[^0-9+]/g, '')}`
            return (
              <article key={l.id} className="rounded-2xl bg-white border border-slate-100 p-4 sm:p-5 shadow-card hover:shadow-glow transition-all flex flex-col">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-brand-mist border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {l.photoUrl ? <img src={l.photoUrl} alt={l.fullName} className="w-full h-full object-cover" /> : <span aria-hidden="true" className="font-display text-base sm:text-lg font-extrabold text-white bg-gradient-to-br from-brand-primary to-brand-deep w-full h-full flex items-center justify-center">{initials}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[15px] sm:text-base font-extrabold text-brand-navy leading-tight [overflow-wrap:anywhere] hyphens-auto">{l.fullName}</div>
                    <div className="mt-1 text-[12.5px] sm:text-sm text-brand-muted leading-snug [overflow-wrap:anywhere]">{position}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-brand-mist/60 border border-slate-100 p-2.5 min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-brand-muted font-semibold">{t('reception.col.day')}</div>
                    <div className="mt-0.5 inline-flex items-center gap-1.5 text-[12.5px] sm:text-sm font-semibold text-brand-navy [overflow-wrap:anywhere]">
                      <Calendar size={12} className="text-brand-deep shrink-0" aria-hidden="true" />
                      <span className="min-w-0">{day || '\u2014'}</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-brand-mist/60 border border-slate-100 p-2.5 min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-brand-muted font-semibold">{t('reception.col.time')}</div>
                    <div className="mt-0.5 inline-flex items-center gap-1.5 text-[12.5px] sm:text-sm font-semibold text-brand-navy tabular-nums">
                      <Clock size={12} className="text-brand-deep shrink-0" aria-hidden="true" />
                      {l.receptionTime || '\u2014'}
                    </div>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5 text-[13px] sm:text-sm">
                  <li className="flex items-start gap-2 text-brand-navy min-w-0"><Phone size={14} className="mt-0.5 text-brand-deep shrink-0" aria-hidden="true" /><a href={telHref} className="font-medium hover:text-brand-deep [overflow-wrap:anywhere] min-w-0">{phoneClean || '\u2014'}</a></li>
                  {emailClean && (<li className="flex items-start gap-2 text-brand-navy min-w-0"><Mail size={14} className="mt-0.5 text-brand-deep shrink-0" aria-hidden="true" /><a href={`mailto:${emailClean}`} className="font-medium hover:text-brand-deep [overflow-wrap:anywhere] min-w-0">{emailClean}</a></li>)}
                </ul>
                <button type="button" onClick={() => pickLeader(l.id)} aria-label={`${t('reception.bookAppointment')}: ${l.fullName}`} className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card hover:shadow-glow whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 transition">
                  <span>{t('reception.bookAppointment')}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </article>
            )
          })}
          {filtered.length === 0 && (<div className="col-span-full rounded-2xl bg-white border border-slate-100 p-8 text-center text-brand-muted shadow-card">{activeLeaders.length === 0 ? t('reception.emptyAdmin') : t('reception.empty')}</div>)}
        </div>
      </div>
    </section>
  )
}
