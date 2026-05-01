import { motion } from 'framer-motion'
import { Cloud, Waves, Sprout, BarChart3, Trees, Plane, Cpu, Siren } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motionPreset } from '../lib/motion'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../store/contentStore'
import { SectionHeader } from './SectionHeader'

const iconMap: Record<string, LucideIcon> = {
  Cloud,
  Waves,
  Sprout,
  BarChart3,
  Trees,
  Plane,
  Cpu,
  Siren
}

function resolveIcon(key: string): LucideIcon {
  const found = iconMap[key]
  return found ? found : Cloud
}

export function Services() {
  const { lang, t } = useLanguage()
  const { content } = useContent()
  return (
    <section id="services" className="section bg-white">
      <div className="container-page">
        <SectionHeader
          eyebrow={t('services.eyebrow', 'Services')}
          title={t('services.title', 'Operational areas')}
          description={t('services.subtitle', 'Eight focus domains across forecasting, monitoring and emergency response.')}
          align="center"
        />
        <motion.div {...motionPreset.stagger} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.services.map((s) => {
            const Icon = resolveIcon(s.icon)
            return (
              <motion.article
                key={s.id}
                {...motionPreset.staggerItem}
                className="rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-card hover:-translate-y-0.5 transition p-5"
              >
                <span aria-hidden="true" className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink-900">{s.title[lang]}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.text[lang]}</p>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
