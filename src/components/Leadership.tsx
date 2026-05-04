import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, CalendarClock, ChevronDown, FileText, BookOpen } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useLanguage } from '../i18n/LanguageContext'
import { fadeInUpInView, fadeInUpInViewQuick } from '../lib/motion'
import { MobileCarousel } from './ui/MobileCarousel'

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
  const { activeLeaders, settings } = useAdmin()
  const [expanded, setExpanded] = useState<Record<string, ExpandedKind>>({})

  function toggle(id: string, kind: Exclude<ExpandedKind, null>) {
    setExpanded((prev) => ({
      ...prev,
      [id]: prev[id] === kind ? null : kind
    }))
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
              const telHref = `tel:${leader.phone.replace(/[^0-9+]/g, '')}`
              const position = leader.positionKey ? t(leader.positionKey) : leader.position
              const day = leader.dayKey ? t(leader.dayKey) : leader.receptionDay
              const address = leader.addressKey ? t(leader.addressKey) : settings.address
              const websiteUrl = leader.websiteUrl || settings.officialSiteUrl
              const websiteLabel = websiteUrl.replace(/^https?:\/\//, '')
              const showResponsibilities = Boolean(leader.showResponsibilities && leader.responsibilitiesKey)
              const showBiography = Boolean(leader.showBiography && leader.biographyKey)
              const hasActions = showResponsibilities || showBiography
              return (
                <motion.article
                  key={leader.id}
                  {...fadeInUpInViewQuick}
                  className="snap-start min-w-[86vw] sm:min-w-0 shrink-0 sm:shrink rounded-3xl bg-white border border-slate-100 shadow-card hover:sh