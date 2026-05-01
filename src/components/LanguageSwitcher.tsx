import { useState } from 'react'
import { ChevronDown, Languages } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import type { Locale } from '../locales/types'
import { cn } from '../lib/cn'

type Option = { code: Locale; label: string }

const languages: Option[] = [
  { code: 'uz', label: 'O‘zbekcha' },
  { code: 'ru', label: 'Russian' },
  { code: 'en', label: 'English' }
]

export function LanguageSwitcher(props: { compact?: boolean }) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState<boolean>(false)
  const fallback: Option = languages[0]
  const found = languages.find((l) => l.code === lang)
  const current: Option = found ? found : fallback
  function toggle(): void { setOpen((v) => !v) }
  function pick(code: Locale): void {
    setLang(code)
    setOpen(false)
  }
  const buttonClass = cn(
    'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-700 transition px-3 text-sm font-medium',
    props.compact ? 'h-9' : 'h-10'
  )
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={toggle}
        className={buttonClass}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Languages size={16} />
        <span className="uppercase">{current.code}</span>
        <ChevronDown size={14} />
      </button>
      {open ? (
        <ul role="listbox" className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden z-50">
          {languages.map((l) => {
            const itemClass = cn(
              'w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2',
              l.code === lang ? 'text-brand-700 font-semibold bg-brand-50' : 'text-slate-700'
            )
            return (
              <li key={l.code}>
                <button type="button" onClick={() => pick(l.code)} className={itemClass}>
                  <span className="uppercase text-xs w-6">{l.code}</span>
                  <span>{l.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
