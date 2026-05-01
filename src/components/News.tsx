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

const cardMotion = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 }
}

const tagAccents: Record<number, string> = {
  0: 'bg-brand-ice text-brand-deep ring-brand-sky/30',
  1: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  2: 'bg-amber-50 text-amber-700 ring-amber-200'
}

export function News() {
  const { t } = useLanguage()
  return (
    <section id="news" className="py-10 md:py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...headerMotion} className="mb-6 md:mb-12 text-center max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('news.eyebrow')}</span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('news.title')}</h2>
        </motion.div>
        <div className="-mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scroll-smooth no-scrollbar">
          {news.map((n, i) => (
            <motion.article
              key={n.titleKey}
              {...cardMotion}
              className="snap-start min-w-[86vw] md:min-w-0 shrink-0 md:shrink group relative rounded-2xl md:rounded-3xl bg-gradient-to-b from-white to-brand-mist border border-slate-100 p-5 sm:p-6 md:p-7 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-ice/70 blur-2xl pointer-events-none" aria-hidden="true" />
              <div className="relative flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ring-1 ${tagAccents[i] ?? tagAccents[0]}`}>
                  <Newspaper size={11} /> {t(n.tagKey)}
                </span>
                <span className="text-[10px] sm:text-[11px] text-brand-muted font-medium">{t(n.dateKey)}</span>
              </div>
              <h3 className="relative mt-3 sm:mt-4 font-display text-base sm:text-lg font-bold text-brand-navy leading-snug break-words">{t(n.titleKey)}</h3>
              <p className="relative mt-2 text-[13px] sm:text-sm text-brand-muted leading-relaxed">{t(n.summaryKey)}</p>
              <div className="relative mt-4 sm:mt-5 inline-flex items-center gap-1.5 text-[13px] sm:text-sm font-semibold text-brand-deep group-hover:text-brand-navy">
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
