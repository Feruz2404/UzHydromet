import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloudSun } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

/**
 * Full-page loading screen shown until the AdminContext finishes its initial fetch.
 * Stays for at least `minDurationMs` to avoid flicker on fast loads, then fades out.
 */
export function LoadingScreen({ minDurationMs = 320 }: { minDurationMs?: number }) {
  const { initialized, configured } = useAdmin()
  const [show, setShow] = useState<boolean>(true)
  const [mountedAt] = useState<number>(() => Date.now())

  useEffect(() => {
    if (!initialized) return
    if (!configured) {
      // Skip loader entirely when Supabase isn't configured.
      setShow(false)
      return
    }
    const elapsed = Date.now() - mountedAt
    const remaining = Math.max(0, minDurationMs - elapsed)
    const id = window.setTimeout(() => setShow(false), remaining)
    return () => window.clearTimeout(id)
  }, [initialized, configured, minDurationMs, mountedAt])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-screen"
          initial= opacity: 1 
          animate= opacity: 1 
          exit= opacity: 0 
          transition= duration: 0.32, ease: 'easeOut' 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-brand-mist via-white to-brand-ice"
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-primary via-brand-deep to-brand-navy text-white flex items-center justify-center shadow-glow">
              <CloudSun size={28} aria-hidden="true" />
              <span className="absolute inset-0 rounded-2xl ring-2 ring-brand-sky/40 animate-ping" aria-hidden="true" />
            </div>
            <span className="font-display text-sm font-semibold text-brand-navy tracking-wide">O\u2018zgidromet</span>
            <span className="sr-only">Yuklanmoqda...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
