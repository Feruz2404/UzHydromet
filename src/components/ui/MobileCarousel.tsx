import { useEffect, useMemo, useRef, type ReactNode } from 'react'

export type MobileCarouselProps = {
  children: ReactNode
  className?: string
  autoPlay?: boolean
  intervalMs?: number
  ariaLabel?: string
  /**
   * Autoplay only triggers when window.innerWidth is below this value.
   * Defaults to 768 (tailwind md breakpoint).
   */
  desktopBreakpointPx?: number
}

/**
 * Reusable horizontal scroll-snap container with optional mobile autoplay.
 *
 * - Pure scroll-snap on mobile, lets the parent decide grid vs flex via className.
 * - Optional autoplay scrolls one viewport-width step on mobile only.
 * - Pauses for 4s after any user pointer/touch/wheel interaction.
 * - Pauses while document.hidden (tab not visible).
 * - Respects prefers-reduced-motion: reduce.
 * - Cleans up timer and event listeners on unmount.
 */
export function MobileCarousel({
  children,
  className,
  autoPlay = false,
  intervalMs = 5000,
  ariaLabel,
  desktopBreakpointPx = 768
}: MobileCarouselProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const pausedRef = useRef<boolean>(false)
  const lastInteractRef = useRef<number>(0)

  const reduceMotion = useMemo<boolean>(() => {
    if (typeof window === 'undefined') return false
    if (typeof window.matchMedia !== 'function') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (!autoPlay) return
    if (reduceMotion) return
    const el = ref.current
    if (!el) return

    const markInteraction = () => {
      lastInteractRef.current = Date.now()
    }
    const onVisibility = () => {
      pausedRef.current = document.hidden
    }

    el.addEventListener('pointerdown', markInteraction, { passive: true })
    el.addEventListener('touchstart', markInteraction, { passive: true })
    el.addEventListener('wheel', markInteraction, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    const id = window.setInterval(() => {
      if (pausedRef.current) return
      if (Date.now() - lastInteractRef.current < 4000) return
      if (typeof window === 'undefined') return
      if (window.innerWidth >= desktopBreakpointPx) return
      const max = el.scrollWidth - el.clientWidth
      if (max <= 8) return
      const step = Math.max(160, el.clientWidth * 0.86)
      const next = el.scrollLeft + step
      if (next >= max - 8) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollTo({ left: next, behavior: 'smooth' })
      }
    }, intervalMs)

    return () => {
      window.clearInterval(id)
      el.removeEventListener('pointerdown', markInteraction)
      el.removeEventListener('touchstart', markInteraction)
      el.removeEventListener('wheel', markInteraction)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [autoPlay, intervalMs, reduceMotion, desktopBreakpointPx])

  return (
    <div
      ref={ref}
      role="region"
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </div>
  )
}
