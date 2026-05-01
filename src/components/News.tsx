import { motion } from 'framer-motion'
import { Newspaper } from 'lucide-react'
import { news } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const fadeUpMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

export function News() {
  const { t } = useLanguage()
  return (
    <section id="news" className="py-16 lg:py-20 bg-[#F5FAFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpMotion} className="mb-10 text-center">
          <span className="text-xs font-medium text-[#006BA6] uppercase tracking-wider">{t('news.eyebrow')}</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[#003B5C]">{t('news.title')}</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {news.map((n) => (
            <motion.article
              key={n.titleKey}
              {...fadeUpMotion}
              className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="flex items-center gap-2 text-xs text-[#006BA6]">
                <Newspaper size={14} /> {t(n.tagKey)}
              </div>
              <h3 className="mt-3 font-semibold text-[#003B5C]">{t(n.titleKey)}</h3>
              <div className="mt-1 text-xs text-slate-500">{t(n.dateKey)}</div>
              <p className="mt-3 text-sm text-slate-600">{t(n.summaryKey)}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
