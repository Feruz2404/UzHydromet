import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ShieldCheck,
  Shield,
  Sprout,
  Droplet,
  Plane,
  AlertTriangle,
  Thermometer,
  BarChart3,
  Globe2
} from 'lucide-react'
import { hydrometImportance } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

const introMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const blockMotion = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 }
}

const chipMotion = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45 }
}

// Importance icons mapped by item id (from hydrometImportance in defaultContent)
const importanceIcons: Record<string, LucideIcon> = {
  publicSafety: Shield,
  agriculture: Sprout,
  water: Droplet,
  transport: Plane,
  warnings: AlertTriangle,
  climate: Thermometer,
  economic: BarChart3,
  environment: Globe2
}

export function About() {
  const { t } = useLanguage()
  return (
    <section
      id="about"
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-white via-brand-mist/40 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <motion.div {...introMotion} className="max-w-3xl">
          <span className="text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">
            {t('about.eyebrow')}
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-ink tracking-tight">
            {t('about.title')}
          </h2>
          <p className="mt-4 text-sm sm:text-base lg:text-[17px] text-brand-muted leading-relaxed">
            {t('about.body')}
          </p>
        </motion.div>

        {/* === Two big cards: mobile horizontal swipe / desktop 2-col grid === */}
        <div className="mt-8 md:mt-10 -mx-4 px-4 lg:mx-0 lg:px-0 flex lg:grid lg:grid-cols-2 gap-5 md:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none scroll-smooth no-scrollbar pb-2 lg:pb-0">
          <motion.div
            {...blockMotion}
            className="snap-start shrink-0 lg:shrink min-w-[86vw] sm:min-w-[70vw] lg:min-w-0 rounded-3xl bg-white border border-slate-100 p-6 sm:p-7 shadow-card"
          >
            <span className="text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">
              {t('about.role.eyebrow')}
            </span>
            <h3 className="mt-2 font-display text-lg sm:text-xl font-extrabold text-brand-navy">
              {t('about.role.title')}
            </h3>
            <p className="mt-2 text-sm sm:text-[15px] text-brand-muted leading-relaxed">
              {t('about.role.text')}
            </p>
          </motion.div>
          <motion.div
            {...blockMotion}
            className="snap-start shrink-0 lg:shrink min-w-[86vw] sm:min-w-[70vw] lg:min-w-0 rounded-3xl bg-gradient-to-br from-brand-mist via-white to-brand-ice border border-slate-100 p-6 sm:p-7 shadow-card"
          >
            <span className="text-[10px] sm:text-[11px] font-semibold text-brand-deep uppercase tracking-[0.16em]">
              {t('hydromet.eyebrow')}
            </span>
            <h3 className="mt-2 font-display text-lg sm:text-xl font-extrabold text-brand-navy">
              {t('hydromet.title')}
            </h3>
            <p className="mt-2 text-sm sm:text-[15px] text-brand-muted leading-relaxed">
              {t('hydromet.body')}
            </p>
          </motion.div>
        </div>

        {/* === "Nima uchun muhim" with premium icon chips === */}
        <motion.div
          {...blockMotion}
          className="mt-8 md:mt-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-brand-deep to-brand-primary text-white p-6 sm:p-7 lg:p-8 shadow-card"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-brand-cyan/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-brand-sky/15 blur-3xl" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 text-white shrink-0"
              >
                <ShieldCheck size={16} />
              </span>
              <h3 className="font-display text-base sm:text-lg lg:text-xl font-extrabold text-white">
                {t('hydromet.importance.title')}
              </h3>
            </div>
            <p className="mt-2 text-[13px] sm:text-sm text-white/80">
              {t('hydromet.importance.lead')}
            </p>
            <ul className="mt-4 sm:mt-5 grid gap-2 sm:gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {hydrometImportance.map((item) => {
                const Icon = importanceIcons[item.id] ?? Shield
                return (
                  <motion.li
                    key={item.id}
                    {...chipMotion}
                    className="group flex items-center gap-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.13] ring-1 ring-white/10 hover:ring-white/25 px-3 py-2.5 backdrop-blur-md transition-all hover:-translate-y-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-sky/25 to-brand-cyan/15 ring-1 ring-brand-sky/30 text-brand-sky group-hover:text-white group-hover:from-brand-sky/40 transition-colors"
                    >
                      <Icon size={16} />
                    </span>
                    <span className="text-[12px] sm:text-[13px] text-white font-semibold leading-snug">
                      {t(item.key)}
                    </span>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
