import { useEffect, useState } from 'react'
import { Menu, X, CloudSun } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { LanguageSwitcher } from './LanguageSwitcher'

const linkIds = ['home', 'about', 'weather', 'services', 'leadership', 'reception', 'location', 'contact'] as const

export function Header() {
  const [open, setOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const { t } = useLanguage()

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggle = () => setOpen((v) => !v)
  const close = () => setOpen(false)

  const headerClass = scrolled
    ? 'sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80 shadow-[0_1px_0_rgba(15,79,125,0.06)] transition-all'
    : 'sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-transparent transition-all'

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        <a href="#home" className="flex items-center gap-2 min-w-0 group">
          <span className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl bg-gradient-to-br from-brand-primary via-brand-deep to-brand-navy flex items-center justify-center text-white shadow-card">
            <CloudSun size={18} className="sm:hidden" />
            <CloudSun size={20} className="hidden sm:block" />
            <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-brand-cyan ring-2 ring-white" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight min-w-0">
            <span className="font-display font-bold text-[13.5px] sm:text-[15px] tracking-tight text-brand-navy truncate whitespace-nowrap">{t('brand.short')}</span>
            <span className="hidden sm:block text-[11px] text-brand-muted truncate">{t('brand.tagline')}</span>
          </span>
        </a>
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 shrink-0">
          {linkIds.map((id) => (
            <a key={id} href={`#${id}`} className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-brand-deep hover:bg-brand-mist transition">
              {t(`nav.${id}`)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <LanguageSwitcher />
          <a href="#contact" className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card hover:shadow-glow hover:from-brand-deep hover:to-brand-navy transition-all">
            {t('header.cta.contact')}
          </a>
          <button
            type="button"
            onClick={toggle}
            className="lg:hidden p-1.5 sm:p-2 text-slate-700 rounded-md hover:bg-slate-100"
            aria-label={t('header.toggleMenu')}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            {linkIds.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={close}
                className="px-3 py-2 rounded-md text-slate-700 hover:bg-brand-mist hover:text-brand-deep"
              >
                {t(`nav.${id}`)}
              </a>
            ))}
            <a href="#contact" onClick={close} className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-br from-brand-primary to-brand-deep text-white font-semibold">
              {t('header.cta.contact')}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
