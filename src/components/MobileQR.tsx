import { motion } from 'framer-motion'
import { ScanLine, Share2, ShieldCheck, Smartphone } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { QRCodeCard, type QRCodeCardCopy } from './QRCodeCard'

const TARGET_URL = 'https://hydromet.vrcloud.uz/'
const LOGO_SRC = '/logo.png'

const FADE_INITIAL = { opacity: 0, y: 16 }
const FADE_ANIMATE = { opacity: 1, y: 0 }
const FADE_VIEWPORT = { once: true, margin: '-80px' }
const FADE_TRANSITION = { duration: 0.5, ease: 'easeOut' as const }
const FADE_TRANSITION_DELAYED = {
  duration: 0.5,
  ease: 'easeOut' as const,
  delay: 0.08,
}

export function MobileQR() {
  const { t } = useLanguage()

  const steps = [
    { Icon: Smartphone, text: t('mobileQR.steps.scan') },
    { Icon: ScanLine, text: t('mobileQR.steps.tap') },
    { Icon: Share2, text: t('mobileQR.steps.share') },
  ]

  const qrCopy: QRCodeCardCopy = {
    download: t('mobileQR.download'),
    copy: t('mobileQR.copy'),
    copied: t('mobileQR.copied'),
    transparent: t('mobileQR.transparent'),
  }

  return (
    <section
      id="mobile-access"
      className="relative py-14 md:py-20 lg:py-24 bg-gradient-to-b from-white via-brand-ice/40 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={FADE_INITIAL}
            whileInView={FADE_ANIMATE}
            viewport={FADE_VIEWPORT}
            transition={FADE_TRANSITION}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-ice px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-primary ring-1 ring-brand-primary/15">
              <Smartphone size={12} aria-hidden="true" />
              {t('mobileQR.eyebrow')}
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-tight">
              {t('mobileQR.title')}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-brand-navy/70 leading-7 max-w-prose">
              {t('mobileQR.description')}
            </p>

            <ul className="mt-6 space-y-3">
              {steps.map((step, idx) => {
                const Icon = step.Icon
                return (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-deep/10 text-brand-primary ring-1 ring-brand-primary/15">
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <span className="text-sm sm:text-[15px] text-brand-navy/85 leading-6">
                      {step.text}
                    </span>
                  </li>
                )
              })}
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-[12px] text-brand-navy/70 ring-1 ring-brand-deep/10">
              <ShieldCheck size={14} className="text-brand-primary" aria-hidden="true" />
              <span>{t('mobileQR.trust')}</span>
            </div>
          </motion.div>

          <motion.div
            initial={FADE_INITIAL}
            whileInView={FADE_ANIMATE}
            viewport={FADE_VIEWPORT}
            transition={FADE_TRANSITION_DELAYED}
            className="relative"
          >
            <div
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-sky/15 via-brand-primary/10 to-transparent blur-2xl"
              aria-hidden="true"
            />
            <QRCodeCard
              value={TARGET_URL}
              logoSrc={LOGO_SRC}
              ariaLabel={t('mobileQR.qrAria')}
              downloadFileName="uzhydromet-qr.png"
              urlLabel={t('mobileQR.urlLabel')}
              copy={qrCopy}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default MobileQR
