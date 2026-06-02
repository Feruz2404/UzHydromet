import { useCallback, useId, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Check, Copy, Download } from 'lucide-react'

export interface QRCodeCardCopy {
  download: string
  copy: string
  copied: string
  transparent: string
}

export interface QRCodeCardProps {
  value: string
  logoSrc?: string
  ariaLabel?: string
  downloadFileName?: string
  fgColor?: string
  bgColor?: string
  urlLabel?: string
  copy?: Partial<QRCodeCardCopy>
}

const DEFAULT_COPY: QRCodeCardCopy = {
  download: 'Download QR',
  copy: 'Copy link',
  copied: 'Copied',
  transparent: 'Transparent background (PNG)',
}

const DEFAULT_FG = '#0B1E3F'
const DEFAULT_BG = '#FFFFFF'

export function QRCodeCard({
  value,
  logoSrc,
  ariaLabel,
  downloadFileName = 'qr.png',
  fgColor = DEFAULT_FG,
  bgColor = DEFAULT_BG,
  urlLabel,
  copy,
}: QRCodeCardProps) {
  const labels: QRCodeCardCopy = Object.assign({}, DEFAULT_COPY, copy)

  const [copied, setCopied] = useState(false)
  const [transparent, setTransparent] = useState(false)

  const qrRef = useRef<HTMLDivElement>(null)
  const copyTimerRef = useRef<number | null>(null)
  const transparentId = useId()

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)

      setCopied(true)

      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current)
      }

      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {}
  }, [value])

  const handleDownload = useCallback(() => {
    if (!qrRef.current) return

    const canvas = qrRef.current.querySelector('canvas')
    if (!canvas) return

    const url = canvas.toDataURL('image/png')

    const link = document.createElement('a')
    link.href = url
    link.download = downloadFileName
    link.click()
  }, [downloadFileName])

  return (
    <div className="relative w-full max-w-md mx-auto rounded-3xl bg-white shadow-card ring-1 ring-slate-100 p-5 sm:p-7">
      <div
        className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[360px] rounded-2xl bg-white p-4 ring-1 ring-slate-100 flex items-center justify-center"
        role="img"
        aria-label={ariaLabel ?? value}
        ref={qrRef}
      >
        <QRCodeCanvas
          value={value}
          size={320}
          level="H"
          includeMargin={true}
          fgColor={fgColor}
          bgColor={transparent ? 'transparent' : bgColor}
          imageSettings={
            logoSrc
              ? {
                  src: logoSrc,
                  width: 40,
                  height: 40,
                  excavate: true,
                }
              : undefined
          }
        />
      </div>

      {urlLabel && (
        <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-center ring-1 ring-slate-100">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            {urlLabel}
          </p>

          <p className="mt-0.5 text-sm font-medium text-brand-navy break-all">
            {value}
          </p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-brand-deep to-brand-primary px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Download size={16} />
          {labels.download}
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy ring-1 ring-brand-deep/15"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? labels.copied : labels.copy}
        </button>
      </div>

      <label
        htmlFor={transparentId}
        className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-600 cursor-pointer"
      >
        <input
          id={transparentId}
          type="checkbox"
          checked={transparent}
          onChange={(e) => setTransparent(e.target.checked)}
        />

        <span>{labels.transparent}</span>
      </label>
    </div>
  )
}

export default QRCodeCard