import { motion } from 'framer-motion'
import { motionPreset } from '../lib/motion'
import { cn } from '../lib/cn'

type Props = {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeader(props: Props) {
  const align = props.align ? props.align : 'left'
  const containerClass = cn(
    'max-w-3xl',
    align === 'center' ? 'text-center mx-auto' : 'text-left'
  )
  return (
    <motion.div {...motionPreset.fadeUp} className={containerClass}>
      <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{props.eyebrow}</span>
      <h2 className="mt-3 text-2xl md:text-3xl lg:text-[2.25rem] font-bold text-ink-900 leading-tight tracking-tight">{props.title}</h2>
      {props.description ? (
        <p className="mt-3 text-slate-600 text-base md:text-lg">{props.description}</p>
      ) : null}
    </motion.div>
  )
}
