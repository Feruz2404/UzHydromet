import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Cloud } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useAdmin } from '../context/AdminContext'

const headerInitial = { y: -16, opacity: 0 }
const headerAnimate = { y: 0, opacity: 1 }
const headerTransition = { duration: 0.45, ease: 'easeOut' as const }

export function Header() {
  const { t } = useLanguage()
  const { settings } = useAdmin()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Drop redundant 'contact'; reception now points to #contact (appointment form)
  const linkIds = ['home', 'about', 'weather', 'services', 'leadership', 'reception', 'location']
  const hrefFor = (id: string) => (id === 'reception' ? '#contact' : `#${id}`)

  return (
    <motion.header
      initial={headerInitial}
      animate={headerAnimate}
      transition={headerTransition}
      className={`fixed top-0 inset-x-0 z-40 transition-all ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-card'
          : 'bg-white/60 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-2.5 min-w-0">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={t('brand.short')}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-brand-deep/10 shrink-0"
              />
            ) : (
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white flex items-center justify-center shadow-card shrink-0">
                <Cloud size={18} />
              </span>
            )}
            <span className="hidden xs:flex flex-col leading-tight min-w-0">
              <span className="font-display font-extrabold text-brand-navy text-sm truncate">
                {t('brand.short')}
              </span>
              <span className="text-[10px] text-brand-navy/60 font-medium truncate">
                {t('brand.tagline')}
              </span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {linkIds.map((id) => (
              <a
                key={id}
                href={hrefFor(id)}
                className="px-3 py-2 text-sm font-medium text-brand-navy/80 hover:text-brand-primary rounded-lg hover:bg-brand-ice transition"
              >
                {t(`nav.${id}`)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <a
              href="#contact"
              className="hidden md:inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card hover:shadow-glow transition-all"
            >
              {t('header.cta.contact')}
            </a>
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-brand-navy hover:bg-brand-ice transition"
              aria-expanded={isOpen}
              aria-label={t('header.toggleMenu')}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col gap-1">
              {linkIds.map((id) => (
                <a
                  key={id}
                  href={hrefFor(id)}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-lg text-brand-navy/80 hover:bg-brand-ice hover:text-brand-primary transition text-sm font-medium"
                >
                  {t(`nav.${id}`)}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card"
              >
                {t('header.cta.contact')}
              </a>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  )
}
