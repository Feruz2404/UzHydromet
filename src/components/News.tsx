import { motion } from 'framer-motion'
import { Newspaper, ArrowRight } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useLanguage } from '../i18n/LanguageContext'
import { fadeInUpInView, fadeInUpInViewSlow } from '../lib/motion'
import { MobileCarousel } from './ui/MobileCarousel'

const tagAccents: Record<number, string> = {
  0: 'bg-brand-ice text-brand-deep ring-brand-sky/30',
  1: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  2: 'bg-amber-50 text-amber-700 ring-amber-200'
}

export function News() {
  const { t } = useLanguage()
  const { news, settings } = useAdmin()
  const fallbackUrl = settings.officialNewsUrl || 'https://gov.uz/oz/hydromet/news'

  return (
    <section id="news" className="py-10 md:py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUpInView} className="mb-6 md:mb-12 text-center max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">{t('news.eyebrow')}</span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink tracking-tight">{t('news.title')}</h2>
        </motion.div>
        <MobileCarousel
          autoPlay
          intervalMs={5500}
          ariaLabel={t('news.title')}
          className="-mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scroll-smooth no-scrollbar"
        >
          {news.map((n, i) => {
            const title = (n.title && n.title.trim()) || (n.titleKey ? t(n.titleKey) : '')
            const date = (n.date && n.date.trim()) || (n.dateKey ? t(n.dateKey) : '')
            const summary = (n.summary && n.summary.trim()) || (n.summaryKey ? t(n.summaryKey) : '')
            const tag = (n.tag && n.tag.trim()) || (n.tagKey ? t(n.tagKey) : '')
            const href = (n.url && n.url.trim()) || fallbackUrl
            return (
              <motion.article
                key={n.id}
                {...fadeInUpInViewSlow}
                className="snap-start min-w-[86vw] md:min-w-0 shrink-0 md:shrink group relative rounded-2xl md:rounded-3xl bg-gradient-to-b from-white to-brand-mist border border-slate-100 p-5 sm:p-6 md:p-7 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-ice/70 blur-2xl pointer-events-none" aria-hidden="true" />
                <div className="relative flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ring-1 ${tagAccents[i] ?? tagAccents[0]}`}>
                    <Newspaper size={11} /> {tag}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-brand-muted font-medium">{date}</span>
                </div>
                <h3 className="relative mt-3 sm:mt-4 font-display text-base sm:text-lg font-bold text-brand-navy leading-snug break-words">{title}</h3>
                <p className="relative mt-2 text-[13px] sm:text-sm text-brand-muted leading-relaxed">{summary}</p>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('news.readMore')}: ${title}`}
                  className="relative mt-4 sm:mt-5 inline-flex items-center gap-1.5 text-[13px] sm:text-sm font-semibold text-brand-deep group-hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 rounded"
                >
                  <span className="opacity-80 group-hover:opacity-100">{t('news.readMore')}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </motion.article>
            )
          })}
        </MobileCarousel>
      </div>
    </section>
  )
}
