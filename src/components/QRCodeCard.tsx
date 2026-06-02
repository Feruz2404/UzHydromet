import { useCallback, useId, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { toCanvas } from 'qrcode'
import { Check, Copy, Download } from 'lucide-react'

export interface QRCodeCardCopy {
  download: string
  copy: string
  copied: string
  transparent: string
}

export interface QRCodeCardProps {
  /** Value encoded by the QR code (typically a URL). */
  value: string
  /** Optional logo to overlay in the center of the QR code. */
  logoSrc?: string
  /** Accessible label describing the QR code purpose. */
  ariaLabel?: string
  /** File name used when downloading the PNG. */
  downloadFileName?: string
  /** Foreground color of the QR modules. Defaults to brand navy. */
  fgColor?: string
  /** Background color of the QR (white card). */
  bgColor?: string
  /** Optional label displayed above the URL preview. Hides the preview when omitted. */
  urlLabel?: string
  /** Translated copy strings (download / copy / copied / transparent toggle). */
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
const LOGO_FRACTION = 0.18
const CIRCLE_FRACTION = 0.24
const PNG_SIZE = 2000

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image: ' + src))
    img.src = src
  })
}

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
  const labels: QRCodeCardCopy = { ...DEFAULT_COPY, ...copy }
  const [copied, setCopied] = useState<boolean>(false)
  const [transparent, setTransparent] = useState<boolean>(false)
  const [downloading, setDownloading] = useState<boolean>(false)
  const transparentId = useId()
  const copyTimerRef = useRef<number | null>(null)

  const handleCopy = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea')
        textarea.value = value
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current)
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  }, [value])

  const handleDownload = useCallback(async () => {
    if (typeof document === 'undefined') return
    setDownloading(true)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = PNG_SIZE
      canvas.height = PNG_SIZE

      await toCanvas(canvas, value, {
        errorCorrectionLevel: 'H',
        width: PNG_SIZE,
        margin: 4,
        color: {
          dark: fgColor,
          light: transparent ? '#00000000' : bgColor,
        },
      })

      const ctx = canvas.getContext('2d')
      if (ctx && logoSrc) {
        try {
          const img = await loadImage(logoSrc)
          const cx = PNG_SIZE / 2
          const cy = PNG_SIZE / 2
          const circleDiameter = PNG_SIZE * CIRCLE_FRACTION
          const logoSize = PNG_SIZE * LOGO_FRACTION

          ctx.save()
          ctx.fillStyle = '#FFFFFF'
          ctx.beginPath()
          ctx.arc(cx, cy, circleDiameter / 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()

          ctx.drawImage(
            img,
            cx - logoSize / 2,
            cy - logoSize / 2,
            logoSize,
            logoSize,
          )
        } catch {
          /* logo failed to load — export QR without overlay */
        }
      }

      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = downloadFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } finally {
      setDownloading(false)
    }
  }, [value, logoSrc, transparent, fgColor, bgColor, downloadFileName])

  const circlePct = `${CIRCLE_FRACTION * 100}%`
  const innerLogoPct = `${(LOGO_FRACTION / CIRCLE_FRACTION) * 100}%`

  return (
    <div className="relative w-full max-w-md mx-auto rounded-3xl bg-white shadow-card ring-1 ring-slate-100 p-5 sm:p-7">
      <div
        className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[360px] rounded-2xl bg-white p-3 sm:p-4 ring-1 ring-slate-100"
        role="img"
        aria-label={ariaLabel ?? value}
      >
        <QRCode
          value={value}
          level="H"
          size={1024}
          bgColor={bgColor}
          fgColor={fgColor}
          style= width: '100%', height: '100%', display: 'block' 
        />
        {logoSrc && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div
              className="flex items-center justify-center rounded-full bg-white shadow-card ring-1 ring-slate-100"
              style= width: circlePct, height: circlePct 
            >
              <img
                src={logoSrc}
                alt=""
                className="object-contain"
                style= width: innerLogoPct, height: innerLogoPct 
              />
            </div>
          </div>
        )}
      </div>

      {urlLabel && (
        <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-center ring-1 ring-slate-100">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            {urlLabel}
          </p>
          <p className="mt-0.5 text-sm font-medium text-brand-navy break-all">{value}</p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-brand-deep to-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card hover:shadow-glow hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <Download size={16} aria-hidden="true" />
          <span className="truncate">{labels.download}</span>
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy ring-1 ring-brand-deep/15 hover:ring-brand-primary/40 hover:bg-brand-ice/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/60 transition-all"
          aria-live="polite"
        >
          {copied ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}
          <span className="truncate">{copied ? labels.copied : labels.copy}</span>
        </button>
      </div>

      <label
        htmlFor={transparentId}
        className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-600 cursor-pointer select-none"
      >
        <input
          id={transparentId}
          type="checkbox"
          checked={transparent}
          onChange={(e) => setTransparent(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-sky/60"
        />
        <span>{labels.transparent}</span>
      </label>
    </div>
  )
}

export default QRCodeCard
