import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloudSun } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

// motion props as named consts (see Header.tsx). Do NOT inline object
// literals into JSX -- the compression layer mangles double-brace tokens.
const SHELL_FROM = { opacity: 1 }
const SHELL_EXIT = { opacity: 0 }
const SHELL_TRANSITION = { duration: 0.36, ease: 'easeOut' as const }

const LOGO_INITIAL = { opacity: 0, scale: 0.92 }
const LOGO_ANIMATE = { opacity: 1, scale: 1 }
const LOGO_TRANSITION = { duration: 0.45, ease: 'easeOut' as const }

const RING_INITIAL = { scale: 0.85, opacity: 0.55 }
const RING_ANIMATE = { scale: 1.4, opacity: 0 }
const RING_TRANSITION_A = { duration: 1.8, ease: 'easeOut' as const, repeat: Infinity }
const RING_TRANSITION_B = { duration: 1.8, ease: 'easeOut' as const, repeat: Infinity, delay: 0.6 }
const RING_TRANSITION_C = { duration: 1.8, ease: 'easeOut' as const, repeat: Infinity, delay: 1.2 }

const BAR_INITIAL = { x: '-100%' as const }
const BAR_ANIMATE = { x: '120%' as const }
const BAR_TRANSITION = { duration: 1.2, ease: 'easeInOut' as const, repeat: Infinity }

const DOT_TRANSITION_A = { duration: 0.9, ease: 'easeInOut' as const, repeat: Infinity }
const DOT_TRANSITION_B = { duration: 0.9, ease: 'easeInOut' as const, repeat: Infinity, delay: 0.15 }
const DOT_TRANSITION_C = { duration: 0.9, ease: 'easeInOut' as const, repeat: Infinity, delay: 0.3 }
const DOT_ANIMATE = { y: [0, -6, 0], opacity: [0.4, 1, 0.4] }

/**
 * Full-page branded loading screen. Stays for at least minDurationMs to
 * avoid flicker, then fades out once AdminContext.initialized flips true.
 *
 * Uses settings.logoUrl when available (real O'zgidromet emblem), with a
 * gradient + CloudSun fallback for unconfigured environments.
 */
export function LoadingScreen({ minDurationMs = 480 }: { minDurationMs?: number }) {
  const { initialized, configured, settings } = useAdmin()
  const [show, setShow] = useState<boolean>(true)
  const [mountedAt] = useState<number>(() => Date.now())

  useEffect(() => {
    if (!initialized) return
    if (!configured) {
      setShow(false)
      return
    }
    const elapsed = Date.now() - mountedAt
    const remaining = Math.max(0, minDurationMs - elapsed)
    const id = window.setTimeout(() => setShow(false), remaining)
    return () => window.clearTimeout(id)
  }, [initialized, configured, minDurationMs, mountedAt])

  const brandName = (settings.agencyName && settings.agencyName.trim()) || "O'zgidromet"
  const tagline = (settings.shortDescription && settings.shortDescription.trim())
    || 'Gidrometeorologiya xizmati agentligi'
  const hasLogo = Boolean(settings.logoUrl)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-screen"
          initial={SHELL_FROM}
          animate={SHELL_FROM}
          exit={SHELL_EXIT}
          transition={SHELL_TRANSITION}
          className="fixed inset-0 z-[60] overflow-hidden bg-gradient-to-br from-brand-mist via-white to-brand-ice"
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          {/* Subtle decorative blobs */}
          <div aria-hidden="true" className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-brand-sky/20 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-brand-primary/10 blur-3xl" />

          <div className="relative h-full w-full flex flex-col items-center justify-center px-6">
            <motion.div
              initial={LOGO_INITIAL}
              animate={LOGO_ANIMATE}
              transition={LOGO_TRANSITION}
              className="relative"
            >
              {/* Concentric pulse rings */}
              <motion.span aria-hidden="true" initial={RING_INITIAL} animate={RING_ANIMATE} transition={RING_TRANSITION_A} className="absolute inset-0 rounded-3xl ring-2 ring-brand-primary/40" />
              <motion.span aria-hidden="true" initial={RING_INITIAL} animate={RING_ANIMATE} transition={RING_TRANSITION_B} className="absolute inset-0 rounded-3xl ring-2 ring-brand-sky/40" />
              <motion.span aria-hidden="true" initial={RING_INITIAL} animate={RING_ANIMATE} transition={RING_TRANSITION_C} className="absolute inset-0 rounded-3xl ring-2 ring-brand-deep/30" />

              {/* Logo plate */}
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-white border border-slate-200 shadow-glow flex items-center justify-center overflow-hidden">
                {hasLogo ? (
                  <img src={settings.logoUrl} alt={brandName} className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-primary via-brand-deep to-brand-navy flex items-center justify-center text-white">
                    <CloudSun size={42} aria-hidden="true" />
                  </div>
                )}
              </div>
            </motion.div>

            <div className="mt-6 sm:mt-7 flex flex-col items-center gap-1.5 text-center">
              <span className="font-display text-lg sm:text-xl font-extrabold text-brand-navy tracking-tight">{brandName}</span>
              <span className="text-xs sm:text-sm text-brand-muted max-w-xs leading-snug">{tagline}</span>
            </div>

            {/* 3-dot pulse */}
            <div className="mt-5 flex items-center gap-1.5" aria-hidden="true">
              <motion.span animate={DOT_ANIMATE} transition={DOT_TRANSITION_A} className="w-2 h-2 rounded-full bg-brand-primary" />
              <motion.span animate={DOT_ANIMATE} transition={DOT_TRANSITION_B} className="w-2 h-2 rounded-full bg-brand-deep" />
              <motion.span animate={DOT_ANIMATE} transition={DOT_TRANSITION_C} className="w-2 h-2 rounded-full bg-brand-sky" />
            </div>

            {/* Indeterminate progress bar */}
            <div className="mt-5 w-44 sm:w-56 h-1 rounded-full bg-slate-200/80 overflow-hidden" aria-hidden="true">
              <motion.span initial={BAR_INITIAL} animate={BAR_ANIMATE} transition={BAR_TRANSITION} className="block h-full w-1/3 rounded-full bg-gradient-to-r from-brand-primary via-brand-deep to-brand-sky" />
            </div>

            <span className="sr-only">Yuklanmoqda...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
