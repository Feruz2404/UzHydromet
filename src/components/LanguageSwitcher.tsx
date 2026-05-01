import { useLanguage } from '../i18n/LanguageContext'
import type { Lang } from '../i18n/types'

type Option = { id: Lang; label: string }

const options: ReadonlyArray<Option> = [
  { id: 'uz', label: 'UZ' },
  { id: 'ru', label: 'RU' },
  { id: 'en', label: 'EN' }
]

const activeClass = 'px-2.5 py-1 rounded-full bg-gradient-to-br from-brand-primary to-brand-deep text-white shadow-sm'
const inactiveClass = 'px-2.5 py-1 rounded-full text-slate-500 hover:text-brand-deep hover:bg-white'

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  return (
    <div className="flex items-center gap-0.5 text-[11px] font-semibold tracking-wide bg-slate-100/70 border border-slate-200 rounded-full px-1 py-0.5">
      {options.map((o) => {
        const isActive = o.id === lang
        const cls = isActive ? activeClass : inactiveClass
        const handleClick = () => setLang(o.id)
        return (
          <button
            key={o.id}
            type="button"
            onClick={handleClick}
            className={cls}
            aria-pressed={isActive}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
