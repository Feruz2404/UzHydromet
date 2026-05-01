import { useState } from 'react'
import { Menu, X, CloudSun } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { LanguageSwitcher } from './LanguageSwitcher'

const linkIds = ['home', 'about', 'weather', 'services', 'leadership', 'reception', 'location', 'contact'] as const

export function Header() {
  const [open, setOpen] = useState<boolean>(false)
  const { t } = useLanguage()
  const toggle = () => setOpen((v) => !v)
  const close = () => setOpen(false)
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#006BA6] to-[#003B5C] flex items-center justify-center text-white">
            <CloudSun size={20} />
          </span>
          <span className="leading-tight">
            <span className="block font-semibold text-[#003B5C]">UzGidromet</span>
            <span className="block text-xs text-slate-500">O&apos;zgidromet</span>
          </span>
        </a>
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-6">
          {linkIds.map((id) => (
            <a key={id} href={`#${id}`} className="text-sm text-slate-600 hover:text-[#006BA6] transition">
              {t(`nav.${id}`)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a href="#contact" className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-[#006BA6] text-white text-sm font-medium hover:bg-[#003B5C] transition">
            {t('header.cta.contact')}
          </a>
          <button
            type="button"
            onClick={toggle}
            className="lg:hidden p-2 text-slate-700"
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
                className="px-2 py-2 rounded text-slate-700 hover:bg-slate-50"
              >
                {t(`nav.${id}`)}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
