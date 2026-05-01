import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight } from 'lucide-react'
import { leaders } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const headerMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

export function ReceptionSchedule() {
  const { t } = useLanguage()
  const [query, setQuery] = useState<string>('')
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return leaders
    return leaders.filter((l) => {
      const position = t(l.positionKey).toLowerCase()
      return l.name.toLowerCase().includes(q) || position.includes(q)
    })
  }, [query, t])

  return (
    <section id="reception" className="py-12 md:py-16 lg:py-24 bg-brand-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...headerMotion} className="mb-8 md:mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('reception.eyebrow')}</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('reception.title')}</h2>
        </motion.div>

        <div className="mb-6 flex justify-end">
          <label className="relative w-full md:w-80">
            <span className="sr-only">{t('reception.searchSr')}</span>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('reception.searchPlaceholder')}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-card focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-sky/20 transition"
            />
          </label>
        </div>

        <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-brand-mist to-white text-left text-brand-muted">
              <tr>
                <th className="px-5 py-4 font-semibold">{t('reception.col.leader')}</th>
                <th className="px-5 py-4 font-semibold">{t('reception.col.position')}</th>
                <th className="px-5 py-4 font-semibold">{t('reception.col.day')}</th>
                <th className="px-5 py-4 font-semibold">{t('reception.col.time')}</th>
                <th className="px-5 py-4 font-semibold">{t('reception.col.phone')}</th>
                <th className="px-5 py-4 font-semibold" aria-label={t('reception.col.action')}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-t border-slate-100 hover:bg-brand-mist/40 transition">
                  <td className="px-5 py-4 font-semibold text-brand-navy">{l.name}</td>
                  <td className="px-5 py-4 text-brand-muted">{t(l.positionKey)}</td>
                  <td className="px-5 py-4 text-brand-muted">{t(l.dayKey)}</td>
                  <td className="px-5 py-4 text-brand-muted">{l.receptionTime}</td>
                  <td className="px-5 py-4 text-brand-muted">{l.phone}</td>
                  <td className="px-5 py-4 text-right">
                    <a href="#contact" className="inline-flex items-center gap-1.5 text-brand-deep font-semibold hover:text-brand-navy">
                      {t('reception.book')} <ArrowRight size={14} />
                    </a>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-brand-muted">{t('reception.empty')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden grid gap-3">
          {filtered.map((l) => (
            <div key={l.id} className="rounded-2xl bg-white border border-slate-100 p-5 shadow-card">
              <div className="font-display font-bold text-brand-navy break-words">{l.name}</div>
              <div className="text-sm text-brand-muted">{t(l.positionKey)}</div>
              <div className="mt-3 text-sm text-brand-muted">{t(l.dayKey)} {'•'} {l.receptionTime}</div>
              <div className="text-sm text-brand-muted break-words">{l.phone}</div>
              <a href="#contact" className="mt-4 inline-flex items-center gap-1.5 text-brand-deep font-semibold">
                {t('reception.bookAppointment')} <ArrowRight size={14} />
              </a>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-brand-muted py-8">{t('reception.empty')}</div>
          )}
        </div>
      </div>
    </section>
  )
}
