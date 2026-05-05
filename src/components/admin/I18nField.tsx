import { useState, type ReactNode } from 'react'
import type { Lang } from '../../i18n/types'
import type { TranslationMap } from '../../types/admin'

const TABS: ReadonlyArray<{ key: Lang; label: string }> = [
  { key: 'uz', label: 'UZ' },
  { key: 'ru', label: 'RU' },
  { key: 'en', label: 'EN' }
]

type Props = {
  label: string
  base: string
  translations: TranslationMap | undefined
  onChange: (next: { base: string; translations: TranslationMap }) => void
  multiline?: boolean
  rows?: number
  placeholder?: string
  helperText?: ReactNode
  error?: string
  required?: boolean
}

/**
 * UZ/RU/EN translatable input. UZ writes to the base column; RU/EN write into
 * the JSONB translations map. A small dot indicates which languages are filled.
 */
export function I18nField({
  label,
  base,
  translations,
  onChange,
  multiline = false,
  rows = 4,
  placeholder,
  helperText,
  error,
  required = false
}: Props) {
  const [active, setActive] = useState<Lang>('uz')
  const tx = translations ?? {}

  const value = active === 'uz' ? base : (tx[active] ?? '')
  const filled = (lang: Lang): boolean => {
    if (lang === 'uz') return Boolean(base && base.trim())
    return Boolean(tx[lang] && tx[lang]!.trim())
  }

  function update(next: string) {
    if (active === 'uz') onChange({ base: next, translations: tx })
    else onChange({ base, translations: { ...tx, [active]: next } })
  }

  const inputId = `i18n-${label.replace(/\s+/g, '-').toLowerCase()}-${active}`

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label htmlFor={inputId} className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold">
          {label}
          {required ? <span className="text-brand-deep ml-1" aria-hidden="true">*</span> : null}
        </label>
        <div className="inline-flex rounded-lg bg-brand-mist p-0.5 text-[11px] font-semibold" role="tablist" aria-label={`${label} tili`}>
          {TABS.map((tab) => {
            const isActive = active === tab.key
            const cls = isActive
              ? 'bg-white text-brand-deep shadow-sm'
              : 'text-brand-muted hover:text-brand-navy'
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(tab.key)}
                className={`px-2 py-1 rounded-md transition inline-flex items-center gap-1 ${cls}`}
              >
                {tab.label}
                {filled(tab.key) ? (
                  <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>
      <div className="mt-2">
        {multiline ? (
          <textarea
            id={inputId}
            className="form-input resize-none"
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={(e) => update(e.target.value)}
          />
        ) : (
          <input
            id={inputId}
            className="form-input"
            placeholder={placeholder}
            value={value}
            onChange={(e) => update(e.target.value)}
          />
        )}
      </div>
      {helperText ? <p className="mt-1.5 text-xs text-brand-muted">{helperText}</p> : null}
      {error ? <span className="mt-1.5 block text-xs text-red-600">{error}</span> : null}
    </div>
  )
}
