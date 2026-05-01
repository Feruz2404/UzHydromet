import { useLanguage } from '../i18n/LanguageContext'
import type { Lang } from '../i18n/types'

type Option = { id: Lang; label: string }

const options: ReadonlyArray<Option> = [
  { id: 'uz', label: 'UZ' },
  { id: 'ru', label: 'RU' },
  { id: 'en', label: 'EN' }
]

const activeClass = 'px-2 py-0.5 rounded-full bg-[#006BA6] text-white'
const inactiveClass = 'px-2 py-0.5 rounded-full hover:bg-slate-100'

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  return (
    <div className="flex items-center gap-1 text-xs text-slate-500 border border-slate-200 rounded-full px-1 py-0.5">
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
