import { motion } from 'framer-motion'
import { CloudSun, Thermometer, Droplets, Sprout, ShieldCheck } from 'lucide-react'
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

const cardMotion = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
}

const cards = [
  { kind: 'cloudsun', titleKey: 'about.card.weather.title', textKey: 'about.card.weather.text' },
  { kind: 'therm', titleKey: 'about.card.climate.title', textKey: 'about.card.climate.text' },
  { kind: 'drops', titleKey: 'about.card.hydro.title', textKey: 'about.card.hydro.text' },
  { kind: 'sprout', titleKey: 'about.card.agro.title', textKey: 'about.card.agro.text' }
] as const

function CardIcon({ kind }: { kind: string }) {
  if (kind === 'cloudsun') return <CloudSun size={20} />
  if (kind === 'therm') return <Thermometer size={20} />
  if (kind === 'drops') return <Droplets size={20} />
  return <Sprout size={20} />
}

export function About() {
  const { t } = useLanguage()
  return (
    <section
      id="about"
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-white via-brand-mist/40 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="mt-8 md:mt-10 grid lg:grid-cols-2 gap-5 md:gap-6">
          <motion.div
            {...blockMotion}
            className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-7 shadow-card"
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
            className="rounded-3xl bg-gradient-to-br from-brand-mist via-white to-brand-ice border border-slate-100 p-6 sm:p-7 shadow-card"
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

        <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {cards.map((c) => (
            <motion.div
              key={c.titleKey}
              {...cardMotion}
              className="rounded-2xl bg-white p-5 sm:p-6 border border-slate-100 shadow-card hover:shadow-glow hover:-translate-y-0.5 hover:border-brand-sky/40 transition-all"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-ice to-white text-brand-deep flex items-center justify-center ring-1 ring-brand-sky/30">
                <CardIcon kind={c.kind} />
              </div>
              <div className="mt-3 sm:mt-4 font-display text-base sm:text-lg font-bold text-brand-navy">
                {t(c.titleKey)}
              </div>
              <div className="mt-1.5 text-[13px] sm:text-sm text-brand-muted leading-relaxed">
                {t(c.textKey)}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...blockMotion}
          className="mt-6 md:mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-brand-deep to-brand-primary text-white p-6 sm:p-7 lg:p-8 shadow-card"
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
              {hydrometImportance.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-2 rounded-xl bg-white/[0.08] ring-1 ring-white/10 px-3 py-2.5 backdrop-blur-md"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-sky"
                  />
                  <span className="text-[12px] sm:text-sm text-white font-medium leading-snug">
                    {t(item.key)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
