import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { LanguageSwitcher } from './LanguageSwitcher'
import { cn } from '../lib/cn'

const navIds = ['home', 'weather', 'about', 'services', 'leadership', 'reception', 'location', 'contact', 'news']

type NavItem = { id: string; key: string; fallback: string }
const navItems: NavItem[] = [
  { id: 'home', key: 'nav.home', fallback: 'Home' },
  { id: 'weather', key: 'nav.weather', fallback: 'Weather' },
  { id: 'about', key: 'nav.about', fallback: 'About' },
  { id: 'services', key: 'nav.services', fallback: 'Services' },
  { id: 'leadership', key: 'nav.leadership', fallback: 'Leadership' },
  { id: 'reception', key: 'nav.reception', fallback: 'Reception' },
  { id: 'location', key: 'nav.location', fallback: 'Location' },
  { id: 'contact', key: 'nav.contact', fallback: 'Contact' },
  { id: 'news', key: 'nav.news', fallback: 'News' }
]

const mobileMenuPreset = {
  variants: {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0 }
  },
  initial: 'hidden' as const,
  animate: 'visible' as const,
  exit: 'hidden' as const,
  transition: { duration: 0.2 }
}

export function Header() {
  const { t } = useLanguage()
  const [open, setOpen] = useState<boolean>(false)
  const active = useScrollSpy(navIds, 120)
  function close(): void { setOpen(false) }
  function toggle(): void { setOpen((v) => !v) }
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/85 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2" onClick={close}>
          <span aria-hidden="true" className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">U</span>
          <span className="font-semibold text-ink-900 tracking-tight">{t('app.shortName', 'UzGidromet')}</span>
        </a>
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {navItems.map((it) => {
            const linkClass = cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition',
              active === it.id
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-ink-900'
            )
            return (
              <a key={it.id} href={'#' + it.id} className={linkClass}>
                {t(it.key, it.fallback)}
              </a>
            )
          })}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 hover:border-brand-500"
            onClick={toggle}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div {...mobileMenuPreset} className="lg:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-3 grid gap-1">
              {navItems.map((it) => {
                const linkClass = cn(
                  'px-3 py-2 rounded-lg text-sm font-medium',
                  active === it.id ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                )
                return (
                  <a key={it.id} href={'#' + it.id} onClick={close} className={linkClass}>
                    {t(it.key, it.fallback)}
                  </a>
                )
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
