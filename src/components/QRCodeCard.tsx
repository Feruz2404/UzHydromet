import { useCallback, useEffect, useId, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Check, Copy, Download } from 'lucide-react'

// ─── Public API ──────────────────────────────────────────────────────────────

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

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_COPY: QRCodeCardCopy = {
  download: 'Download QR',
  copy: 'Copy link',
  copied: 'Copied',
  transparent: 'Transparent background (PNG)',
}

const DEFAULT_FG = '#0B1E3F'
const DEFAULT_BG = '#FFFFFF'

/** Export canvas resolution — 2048×2048 for high-DPI print quality. */
const EXPORT_SIZE = 2048

/**
 * Logo width as a fraction of the total QR canvas width.
 * Previous effective logo size was ≈ 20.7 % (badge 23 % × fill 90 %).
 * Setting to 30 % gives the visual "2× bigger" impression while staying
 * well within QR error-correction level H's 30 % damage tolerance (the logo
 * covers ≈ 9 % of the *area*, not 30 %).
 */
const LOGO_RATIO = 0.3

/**
 * Rounded-corner radius for each data module, expressed as a fraction of the
 * cell size. 0.45 produces smooth pill-like dots without touching neighbours.
 */
const MODULE_RADIUS_RATIO = 0.45

// ─── Utilities ───────────────────────────────────────────────────────────────

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
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image: ' + src))
    img.src = src
  })
}

/**
 * Returns true when (row, col) belongs to one of the three 7×7 finder-pattern
 * regions **plus** their 1-cell-wide separators (the always-light border).
 * These cells are drawn separately with a custom rounded-square style.
 */
function isFinderZone(row: number, col: number, size: number): boolean {
  if (row <= 7 && col <= 7) return true           // top-left
  if (row <= 7 && col >= size - 8) return true    // top-right
  if (row >= size - 8 && col <= 7) return true    // bottom-left
  return false
}

// ─── Core draw function ───────────────────────────────────────────────────────

interface DrawRoundedQROptions {
  fgColor: string
  bgColor: string
  transparent: boolean
  logoSrc?: string
}

/**
 * Renders a fully rounded-dot QR code onto `canvas`.
 *
 * - Data modules → rounded rectangles (MODULE_RADIUS_RATIO).
 * - Finder patterns → custom rounded outer-square / inner-dot style.
 * - Center logo → drawn directly, no badge or ring.
 *
 * Reused by both the live preview and the PNG download path.
 */
async function drawRoundedQR(
  canvas: HTMLCanvasElement,
  value: string,
  { fgColor, bgColor, transparent, logoSrc }: DrawRoundedQROptions,
): Promise<void> {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const canvasSize = canvas.width // square canvas

  // ── Generate QR matrix ──────────────────────────────────────────────────
  const qr = QRCode.create(value, { errorCorrectionLevel: 'H' })
  const matrixSize = qr.modules.size
  const data = qr.modules.data

  // Leave a quiet-zone margin of ~4 % on each side.
  const margin = canvasSize * 0.04
  const cellSize = (canvasSize - margin * 2) / matrixSize
  const moduleRadius = cellSize * MODULE_RADIUS_RATIO
  // Small gap between neighbouring modules so rounded corners have contrast.
  const gap = Math.max(1, cellSize * 0.06)

  // ── Background ──────────────────────────────────────────────────────────
  ctx.clearRect(0, 0, canvasSize, canvasSize)
  if (!transparent) {
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvasSize, canvasSize)
  }

  // ── Data modules (skip finder zones) ────────────────────────────────────
  ctx.fillStyle = fgColor
  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixSize; col++) {
      if (isFinderZone(row, col, matrixSize)) continue
      const isDark = data[row * matrixSize + col] !== 0
      if (!isDark) continue

      const x = margin + col * cellSize + gap / 2
      const y = margin + row * cellSize + gap / 2
      const w = cellSize - gap
      const h = cellSize - gap

      ctx.beginPath()
      ctx.roundRect(x, y, w, h, moduleRadius)
      ctx.fill()
    }
  }

  // ── Finder patterns ─────────────────────────────────────────────────────
  // Positions of the top-left cell of each 7×7 finder pattern.
  const finderOrigins = [
    { row: 0, col: 0 },                         // top-left
    { row: 0, col: matrixSize - 7 },             // top-right
    { row: matrixSize - 7, col: 0 },             // bottom-left
  ]

  for (const origin of finderOrigins) {
    const fx = margin + origin.col * cellSize
    const fy = margin + origin.row * cellSize
    const outerSize = cellSize * 7
    const rOuter = cellSize * 1.5  // generous rounding for the outer square

    // 1) Filled outer square (7×7)
    ctx.fillStyle = fgColor
    ctx.beginPath()
    ctx.roundRect(fx, fy, outerSize, outerSize, rOuter)
    ctx.fill()

    // 2) Inner white/clear area (5×5, inset by 1 cell)
    const innerInset = cellSize
    const innerSize = cellSize * 5
    ctx.fillStyle = transparent ? 'rgba(0,0,0,0)' : bgColor
    if (transparent) {
      // Cut out the inner area using destination-out so it becomes transparent.
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.roundRect(fx + innerInset, fy + innerInset, innerSize, innerSize, rOuter * 0.6)
      ctx.fill()
      ctx.restore()
    } else {
      ctx.beginPath()
      ctx.roundRect(fx + innerInset, fy + innerInset, innerSize, innerSize, rOuter * 0.6)
      ctx.fill()
    }

    // 3) Inner dark dot (3×3, inset by 2 cells)
    const dotInset = cellSize * 2
    const dotSize = cellSize * 3
    ctx.fillStyle = fgColor
    ctx.beginPath()
    ctx.roundRect(fx + dotInset, fy + dotInset, dotSize, dotSize, rOuter * 0.4)
    ctx.fill()
  }

  // ── Center logo (no badge, no ring) ─────────────────────────────────────
  if (logoSrc) {
    try {
      const img = await loadImage(logoSrc)
      const logoSize = Math.round(canvasSize * LOGO_RATIO)
      const cx = Math.round(canvasSize / 2)
      const cy = Math.round(canvasSize / 2)

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(
        img,
        cx - Math.round(logoSize / 2),
        cy - Math.round(logoSize / 2),
        logoSize,
        logoSize,
      )
    } catch {
      // Logo load failure — QR code remains fully scannable.
    }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  const [copied, setCopied] = useState(false)
  const [transparent, setTransparent] = useState(false)

  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const copyTimerRef = useRef<number | null>(null)
  const transparentId = useId()

  // ── Live preview ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = previewCanvasRef.current
    if (!canvas) return

    // Render at 2× the CSS size for crisp display on retina screens.
    const cssSize = canvas.clientWidth || 320
    const deviceRatio = window.devicePixelRatio ?? 1
    const physicalSize = Math.round(cssSize * deviceRatio)

    if (canvas.width !== physicalSize || canvas.height !== physicalSize) {
      canvas.width = physicalSize
      canvas.height = physicalSize
    }

    drawRoundedQR(canvas, value, {
      fgColor,
      bgColor,
      transparent,
      logoSrc,
    }).catch(() => {
      // Swallow render errors — the UI stays intact.
    })
  }, [value, fgColor, bgColor, transparent, logoSrc])

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access denied — fail silently.
    }
  }, [value])

  const handleDownload = useCallback(async () => {
    const canvas = document.createElement('canvas')
    canvas.width = EXPORT_SIZE
    canvas.height = EXPORT_SIZE

    await drawRoundedQR(canvas, value, {
      fgColor,
      bgColor,
      transparent,
      logoSrc,
    })

    canvas.toBlob(
      (blob) => {
        if (!blob) return
        downloadBlob(blob, downloadFileName)
      },
      'image/png',
      1,
    )
  }, [bgColor, downloadFileName, fgColor, logoSrc, transparent, value])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full max-w-md mx-auto rounded-3xl bg-white shadow-card ring-1 ring-slate-100 p-5 sm:p-7">
      {/* QR preview */}
      <div
        className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[360px] overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-slate-100"
        role="img"
        aria-label={ariaLabel ?? value}
      >
        <canvas
          ref={previewCanvasRef}
          className="h-full w-full"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* URL label */}
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

      {/* Action buttons */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => { void handleDownload() }}
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

      {/* Transparent toggle */}
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
