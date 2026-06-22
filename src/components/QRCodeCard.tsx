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
// soften the four outer corners of the exported PNG (fraction of the export size).
// kept small enough to stay inside the quiet zone so no data modules are clipped.
const CORNER_RADIUS_RATIO = 0.07
// diameter of the white logo badge as a fraction of the QR; the logo fills most of it
const LOGO_BADGE_RATIO = 0.23
// how much of the badge the logo occupies, leaving only a thin white quiet ring
const LOGO_FILL_RATIO = 0.9

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

    const ctx = canvas.getContext('2d')

    if (ctx && logoSrc) {
      try {
        const img = await loadImage(logoSrc)

        const cx = EXPORT_SIZE / 2
        const cy = EXPORT_SIZE / 2

        // White circular badge sized snugly around the (circular) logo, so only a
        // thin quiet ring remains instead of a large empty area. Drawn even for a
        // transparent export so the logo always sits on a clean background.
        const circleRadius = Math.round((EXPORT_SIZE * LOGO_BADGE_RATIO) / 2)
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, circleRadius, 0, Math.PI * 2)
        ctx.fillStyle = '#FFFFFF'
        ctx.fill()
        ctx.restore()

        // Draw the logo centered, filling most of the badge.
        const logoSize = Math.round(circleRadius * 2 * LOGO_FILL_RATIO)
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(
          img,
          Math.round(cx - logoSize / 2),
          Math.round(cy - logoSize / 2),
          logoSize,
          logoSize,
        )
      } catch {
        // ignore logo render failures; QR is still downloadable & scannable
      }
    }

    // Round the four outer corners of the exported PNG. destination-in keeps only
    // the pixels inside the rounded rectangle, so the corners become transparent.
    if (ctx) {
      const radius = Math.round(EXPORT_SIZE * CORNER_RADIUS_RATIO)
      ctx.save()
      ctx.globalCompositeOperation = 'destination-in'
      ctx.beginPath()
      ctx.roundRect(0, 0, EXPORT_SIZE, EXPORT_SIZE, radius)
      ctx.fillStyle = '#000000'
      ctx.fill()
      ctx.restore()
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
        className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[360px] overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-slate-100"
        role="img"
        aria-label={ariaLabel ?? value}
        ref={qrRef}
      >
        <div className="relative h-full w-full">
          <QRCodeSVG
            value={value}
            level="H"
            marginSize={4}
            fgColor={fgColor}
            bgColor={transparent ? 'transparent' : bgColor}
            className="h-full w-full"
          />

          {logoSrc && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span
                className="flex items-center justify-center rounded-full bg-white"
                style={{
                  width: `${LOGO_BADGE_RATIO * 100}%`,
                  height: `${LOGO_BADGE_RATIO * 100}%`,
                }}
              >
                <img
                  src={logoSrc}
                  alt=""
                  className="rounded-full object-contain"
                  style={{
                    width: `${LOGO_FILL_RATIO * 100}%`,
                    height: `${LOGO_FILL_RATIO * 100}%`,
                  }}
                />
              </span>
            </div>
          )}
        </div>
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
