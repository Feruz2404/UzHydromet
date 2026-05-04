import { useRef, useState, type ChangeEvent } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'

export type ImageUploadProps = {
  label: string
  value?: string
  onChange: (dataUrl: string) => void
  onClear?: () => void
  helperText?: string
  rounded?: 'full' | '2xl'
  aspect?: 'square' | 'wide'
  maxBytes?: number
}

export function ImageUpload({ label, value, onChange, onClear, helperText, rounded = '2xl', aspect = 'square', maxBytes = 2_000_000 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePick = () => {
    setError(null)
    inputRef.current?.click()
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Faqat rasm fayllarini yuklash mumkin')
      return
    }
    if (file.size > maxBytes) {
      setError(`Fayl hajmi ${Math.round(maxBytes / 1_000_000)}MB dan kichik bo'lsin`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      if (result) onChange(result)
    }
    reader.onerror = () => setError("Faylni o'qib bo'lmadi")
    reader.readAsDataURL(file)
  }

  const radiusClass = rounded === 'full' ? 'rounded-full' : 'rounded-2xl'
  const previewBox = aspect === 'wide' ? 'h-20 w-40' : 'h-20 w-20'

  return (
    <div className="text-sm">
      <label className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <div className={`${previewBox} ${radiusClass} bg-brand-mist border border-slate-200 flex items-center justify-center overflow-hidden shrink-0`}>
          {value ? (
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={20} className="text-brand-muted" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handlePick} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-brand-navy text-xs font-semibold hover:border-brand-primary hover:text-brand-deep transition">
              <Upload size={14} /> {value ? 'Almashtirish' : 'Yuklash'}
            </button>
            {value && onClear && (
              <button type="button" onClick={onClear} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-red-600 text-xs font-semibold hover:border-red-300 transition">
                <X size={14} /> O'chirish
              </button>
            )}
          </div>
          {helperText && <span className="text-[11px] text-brand-muted">{helperText}</span>}
          {error && <span className="text-[11px] text-red-600">{error}</span>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
