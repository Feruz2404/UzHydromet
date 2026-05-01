import { motion } from 'framer-motion'
import { Newspaper, ArrowRight } from 'lucide-react'
import { news } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const headerMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const CARD_INITIAL = { opacity: 0, y: 20 }
const CARD_WHILE_IN_VIEW = { opacity: 1, y: 0 }
const CARD_VIEWPORT = { once: true }

const tagAccents: Record<number, string> = {
  0: 'bg-brand-ice text-brand-deep ring-brand-sky/30',
  1: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  2: 'bg-amber-50 text-amber-700 ring-amber-200'
}

export function News() {
  const { t } = useLanguage()
  return (
    <section id="news" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...headerMotion} className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('news.eyebrow')}</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('news.title')}</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {news.map((n, i) => (
            <motion.article
              key={n.titleKey}
              initial={CARD_INITIAL}
              whileInView={CARD_WHILE_IN_VIEW}
              viewport={CARD_VIEWPORT}
              transition= duration: 0.6, delay: i * 0.08 
              className="group relative rounded-3xl bg-gradient-to-b from-white to-brand-mist border border-slate-100 p-7 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-ice/70 blur-2xl pointer-events-none" aria-hidden="true" />
              <div className="relative flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ring-1 ${tagAccents[i] ?? tagAccents[0]}`}>
                  <Newspaper size={11} /> {t(n.tagKey)}
                </span>
                <span className="text-[11px] text-brand-muted font-medium">{t(n.dateKey)}</span>
              </div>
              <h3 className="relative mt-4 font-display text-lg font-bold text-brand-navy leading-snug">{t(n.titleKey)}</h3>
              <p className="relative mt-2 text-sm text-brand-muted leading-relaxed">{t(n.summaryKey)}</p>
              <div className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep group-hover:text-brand-navy">
                <span className="opacity-70 group-hover:opacity-100">{t('news.readMore')}</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
