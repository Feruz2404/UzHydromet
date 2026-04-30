import type { Variants, Transition } from 'framer-motion'

const easeOut: Transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
const easeOutSlow: Transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] }

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}
const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}
const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
}
const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } }
}

const viewportConfig = { once: true, amount: 0.2 }

export const motionPreset = {
  fadeUp: {
    variants: fadeUpVariants,
    initial: 'hidden' as const,
    whileInView: 'visible' as const,
    viewport: viewportConfig,
    transition: easeOut
  },
  fadeUpEager: {
    variants: fadeUpVariants,
    initial: 'hidden' as const,
    animate: 'visible' as const,
    transition: easeOut
  },
  fadeIn: {
    variants: fadeInVariants,
    initial: 'hidden' as const,
    whileInView: 'visible' as const,
    viewport: viewportConfig,
    transition: easeOut
  },
  fadeInEager: {
    variants: fadeInVariants,
    initial: 'hidden' as const,
    animate: 'visible' as const,
    transition: easeOutSlow
  },
  slideRight: {
    variants: slideRightVariants,
    initial: 'hidden' as const,
    whileInView: 'visible' as const,
    viewport: viewportConfig,
    transition: easeOut
  },
  slideLeft: {
    variants: slideLeftVariants,
    initial: 'hidden' as const,
    whileInView: 'visible' as const,
    viewport: viewportConfig,
    transition: easeOut
  },
  stagger: {
    variants: staggerVariants,
    initial: 'hidden' as const,
    whileInView: 'visible' as const,
    viewport: viewportConfig
  },
  staggerItem: {
    variants: fadeUpVariants,
    transition: easeOut
  }
}
