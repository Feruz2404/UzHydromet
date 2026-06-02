import { useCallback, useId, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import QRCode from 'qrcode'
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

const EXPORT_SIZE = 2000
// keep a healthy quiet zone so the code stays scannable even with a center logo
const EXPORT_MARGIN = 4

function downloadBlob(blob: Blob, fileName: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
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

  const handleDownload = useCallback(async () => {
    // Always generate a fresh export so we can guarantee 2000x2000 and avoid
    // canvas taint issues from the on-screen renderer.
    const canvas = document.createElement('canvas')
    canvas.width = EXPORT_SIZE
    canvas.height = EXPORT_SIZE

    await QRCode.toCanvas(canvas, value, {
      errorCorrectionLevel: 'H',
      margin: EXPORT_MARGIN,
      width: EXPORT_SIZE,
      color: {
        dark: fgColor,
        light: transparent ? '#00000000' : bgColor,
      },
    })

    if (logoSrc) {
      try {
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas context not available')

        const img = await loadImage(logoSrc)

        // Logo sizing: keep it <~20% of QR size so scanners remain reliable.
        const logoSize = Math.round(EXPORT_SIZE * 0.18)
        const cx = EXPORT_SIZE / 2
        const cy = EXPORT_SIZE / 2

        // White circular background for the logo (even when exporting transparent PNG)
        const circleRadius = Math.round(logoSize * 0.62)
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, circleRadius, 0, Math.PI * 2)
        ctx.fillStyle = '#FFFFFF'
        ctx.fill()
        ctx.restore()

        // draw the logo centered
        const x = Math.round(cx - logoSize / 2)
        const y = Math.round(cy - logoSize / 2)
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, x, y, logoSize, logoSize)
      } catch {
        // ignore logo render failures; QR is still downloadable & scannable
      }
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) return
        downloadBlob(blob, downloadFileName)
      },
      'image/png',
      1,
    )
  }, [bgColor, downloadFileName, fgColor, logoSrc, transparent, value])

  return (
    <div className="relative w-full max-w-md mx-auto rounded-3xl bg-white shadow-card ring-1 ring-slate-100 p-5 sm:p-7">
      <div
        className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[360px] rounded-2xl bg-white p-4 ring-1 ring-slate-100 flex items-center justify-center"
        role="img"
        aria-label={ariaLabel ?? value}
        ref={qrRef}
      >
        <QRCodeSVG
          value={value}
          width={320}
          height={320}
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
          onClick={() => {
            void handleDownload()
          }}
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
