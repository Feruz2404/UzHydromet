import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { leaders } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const fadeUpMotion = {
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
    <section id="reception" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpMotion} className="mb-10 text-center">
          <span className="text-xs font-medium text-[#006BA6] uppercase tracking-wider">{t('reception.eyebrow')}</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#003B5C]">{t('reception.title')}</h2>
        </motion.div>

        <div className="mb-6 flex justify-end">
          <label className="relative w-full md:w-72">
            <span className="sr-only">{t('reception.searchSr')}</span>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('reception.searchPlaceholder')}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#006BA6]"
            />
          </label>
        </div>

        <div className="hidden md:block overflow-hidden rounded-xl border border-slate-100 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#F5FAFD] text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">{t('reception.col.leader')}</th>
                <th className="px-4 py-3">{t('reception.col.position')}</th>
                <th className="px-4 py-3">{t('reception.col.day')}</th>
                <th className="px-4 py-3">{t('reception.col.time')}</th>
                <th className="px-4 py-3">{t('reception.col.phone')}</th>
                <th className="px-4 py-3" aria-label={t('reception.col.action')}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.name} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-[#003B5C]">{l.name}</td>
                  <td className="px-4 py-3 text-slate-600">{t(l.positionKey)}</td>
                  <td className="px-4 py-3 text-slate-600">{t(l.dayKey)}</td>
                  <td className="px-4 py-3 text-slate-600">{l.receptionTime}</td>
                  <td className="px-4 py-3 text-slate-600">{l.phone}</td>
                  <td className="px-4 py-3 text-right">
                    <a href="#contact" className="text-[#006BA6] font-medium hover:underline">
                      {t('reception.book')}
                    </a>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">{t('reception.empty')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden grid gap-3">
          {filtered.map((l) => (
            <div key={l.name} className="rounded-xl bg-white border border-slate-100 p-4 shadow-sm">
              <div className="font-semibold text-[#003B5C]">{l.name}</div>
              <div className="text-sm text-slate-600">{t(l.positionKey)}</div>
              <div className="mt-2 text-sm text-slate-600">{t(l.dayKey)} | {l.receptionTime}</div>
              <div className="text-sm text-slate-600">{l.phone}</div>
              <a href="#contact" className="mt-3 inline-block text-[#006BA6] font-medium">
                {t('reception.bookAppointment')}
              </a>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-slate-500 py-6">{t('reception.empty')}</div>
          )}
        </div>
      </div>
    </section>
  )
}
