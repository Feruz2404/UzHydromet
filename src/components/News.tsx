import { motion } from 'framer-motion'
import { Newspaper } from 'lucide-react'
import { motionPreset } from '../lib/motion'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../store/contentStore'
import { SectionHeader } from './SectionHeader'

const localeMap: Record<string, string> = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' }
const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' }

function formatDate(iso: string, lang: string): string {
  try {
    const tag = localeMap[lang] || 'en-GB'
    return new Date(iso).toLocaleDateString(tag, dateOptions)
  } catch (e) {
    return iso
  }
}

export function News() {
  const { lang, t } = useLanguage()
  const { content } = useContent()
  return (
    <section id="news" className="section bg-bg">
      <div className="container-page">
        <SectionHeader
          eyebrow={t('news.eyebrow', 'News')}
          title={t('news.title', 'Latest updates')}
          description={t('news.subtitle', 'Press releases, climate reports and infrastructure news.')}
        />
        <motion.div {...motionPreset.stagger} className="mt-9 grid md:grid-cols-3 gap-5">
          {content.news.map((n) => (
            <motion.article
              key={n.id}
              {...motionPreset.staggerItem}
              className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 grid gap-3 hover:shadow-card transition"
            >
              <span aria-hidden="true" className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                <Newspaper size={18} />
              </span>
              <span className="inline-flex w-fit text-xs uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 font-semibold">{n.tag[lang]}</span>
              <h3 className="text-base font-semibold text-ink-900 leading-snug">{n.title[lang]}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{n.summary[lang]}</p>
              <span className="text-xs text-slate-500 mt-1">{formatDate(n.date, lang)}</span>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
