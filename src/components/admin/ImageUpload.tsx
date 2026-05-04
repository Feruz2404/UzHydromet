import { useRef, useState, type ChangeEvent } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

export type ImageUploadProps = {
  label: string
  value?: string
  bucket: 'site-assets' | 'leader-photos'
  onChange: (url: string) => void
  onClear?: () => void
  helperText?: string
  rounded?: 'full' | '2xl'
  aspect?: 'square' | 'wide'
  maxBytes?: number
}

export function ImageUpload({
  label,
  value,
  bucket,
  onChange,
  onClear,
  helperText,
  rounded = '2xl',
  aspect = 'square',
  maxBytes = 2_000_000
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const { uploadImage } = useAdmin()

  const handlePick = () => {
    if (uploading) return
    setError(null)
    inputRef.current?.click()
  }

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
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
    setUploading(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
        reader.onerror = () => reject(new Error("faylni o'qib bo'lmadi"))
        reader.readAsDataURL(file)
      })
      const result = await uploadImage({
        bucket,
        filename: file.name,
        contentType: file.type,
        base64
      })
      onChange(result.url)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'upload_failed'
      setError(`Yuklab bo'lmadi: ${msg}`)
    } finally {
      setUploading(false)
    }
  }

  const radiusClass = rounded === 'full' ? 'rounded-full' : 'rounded-2xl'
  const previewBox = aspect === 'wide' ? 'h-20 w-40' : 'h-20 w-20'

  return (
    <div className="text-sm">
      <label className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <div className={`${previewBox} ${radiusClass} bg-brand-mist border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative`}>
          {value ? (
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={20} className="text-brand-muted" aria-hidden="true" />
          )}
          {uploading && (
            <span className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 size={18} className="animate-spin text-brand-deep" aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePick}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-brand-navy text-xs font-semibold hover:border-brand-primary hover:text-brand-deep transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Yuklanmoqda...' : value ? 'Almashtirish' : 'Yuklash'}
            </button>
            {value && onClear && !uploading && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-red-600 text-xs font-semibold hover:border-red-300 transition"
              >
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
