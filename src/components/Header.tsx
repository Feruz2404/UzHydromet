import { useEffect, useState } from 'react'
import { Menu, X, CloudSun } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useAdmin } from '../context/AdminContext'

const linkIds = ['home', 'about', 'weather', 'services', 'leadership', 'reception', 'location', 'contact'] as const

// motion variants kept as named constants so JSX never contains a literal
// double-brace expression (which can be mangled at the tooling layer).
const BACKDROP_FROM = { opacity: 0 }
const BACKDROP_TO = { opacity: 1 }
const BACKDROP_TRANSITION = { duration: 0.18 }
const DRAWER_FROM = { y: -8, opacity: 0 }
const DRAWER_TO = { y: 0, opacity: 1 }
const DRAWER_TRANSITION = { type: 'tween' as const, duration: 0.22, ease: 'easeOut' as const }

export function Header() {
  const [open, setOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const { t } = useLanguage()
  const { settings } = useAdmin()

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Body scroll lock + ESC to close while the drawer is open.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = () => setOpen((v) => !v)
  const close = () => setOpen(false)

  const headerClass = scrolled
    ? 'sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80 shadow-[0_1px_0_rgba(15,79,125,0.06)] transition-all'
    : 'sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-transparent transition-all'

  const brandName = settings.agencyName.trim() || t('brand.short')
  const tagline = settings.shortDescription.trim() || t('brand.tagline')
  const hasLogo = Boolean(settings.logoUrl)
  const closeLabel = t('header.closeMenu', 'Yopish')
  const menuLabel = t('header.menuLabel', 'Asosiy menyu')

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        <a href="#home" className="flex items-center gap-2 min-w-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 rounded-md">
          {hasLogo ? (
            <span className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
              <img src={settings.logoUrl} alt={brandName} className="w-full h-full object-contain" />
            </span>
          ) : (
            <span className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl bg-gradient-to-br from-brand-primary via-brand-deep to-brand-navy flex items-center justify-center text-white shadow-card">
              <CloudSun size={18} className="sm:hidden" />
              <CloudSun size={20} className="hidden sm:block" />
              <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-brand-cyan ring-2 ring-white" aria-hidden="true" />
            </span>
          )}
          <span className="flex flex-col leading-tight min-w-0">
            <span className="font-display font-bold text-[13.5px] sm:text-[15px] tracking-tight text-brand-navy truncate whitespace-nowrap">{brandName}</span>
            <span className="hidden sm:block text-[11px] text-brand-muted truncate">{tagline}</span>
          </span>
        </a>
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0">
          {linkIds.map((id) => (
            <a key={id} href={`#${id}`} className="px-2.5 xl:px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-brand-deep hover:bg-brand-mist transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40">
              {t(`nav.${id}`)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={toggle}
            className="lg:hidden p-1.5 sm:p-2 text-slate-700 rounded-md hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
            aria-label={t('header.toggleMenu')}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="backdrop"
              type="button"
              aria-label={closeLabel}
              onClick={close}
              initial={BACKDROP_FROM}
              animate={BACKDROP_TO}
              exit={BACKDROP_FROM}
              transition={BACKDROP_TRANSITION}
              className="lg:hidden fixed inset-0 top-14 sm:top-16 bg-slate-900/40 backdrop-blur-sm z-40 cursor-pointer"
            />
            <motion.div
              key="drawer"
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label={menuLabel}
              initial={DRAWER_FROM}
              animate={DRAWER_TO}
              exit={DRAWER_FROM}
              transition={DRAWER_TRANSITION}
              className="lg:hidden fixed left-0 right-0 top-14 sm:top-16 z-50 max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto bg-white border-t border-slate-200 shadow-[0_12px_40px_-16px_rgba(15,79,125,0.25)]"
            >
              <nav aria-label={menuLabel} className="px-3 py-3 flex flex-col gap-0.5">
                {linkIds.map((id) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={close}
                    className="flex items-center px-3 py-3 rounded-xl text-[15px] font-medium text-slate-800 hover:bg-brand-mist hover:text-brand-deep active:bg-brand-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 transition"
                  >
                    {t(`nav.${id}`)}
                  </a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
