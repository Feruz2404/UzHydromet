import { useState } from 'react'
import { Cloud } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

// The official organization logo, bundled in public/ and copied verbatim into
// the build output, so it resolves identically in dev, production and on Vercel.
// This is the authoritative brand mark shown at the top of the site — it does not
// depend on async DB state, so it is always visible on first paint with no flash.
const LOGO_PATH = '/logo.png'

export interface BrandLogoProps {
  /** Rendered size in px. Used for the width/height attrs to prevent layout shift. */
  size: number
  /** Tailwind classes applied to the <img>. */
  className?: string
  /** Tailwind classes for the last-resort icon fallback container. */
  fallbackClassName?: string
  /** Icon size (px) for the last-resort fallback. */
  fallbackIconSize?: number
}

/**
 * Organization logo. Renders the bundled /logo.png with object-contain so it is
 * never cropped or stretched and always keeps its aspect ratio. width/height are
 * set explicitly to avoid CLS. Falls back to a Cloud icon only if the image
 * itself fails to load.
 */
export function BrandLogo({
  size,
  className = '',
  fallbackClassName,
  fallbackIconSize = 18,
}: BrandLogoProps) {
  const { t } = useLanguage()
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span className={fallbackClassName ?? className}>
        <Cloud size={fallbackIconSize} />
      </span>
    )
  }

  return (
    <img
      src={LOGO_PATH}
      alt={t('brand.short')}
      width={size}
      height={size}
      loading="eager"
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-contain ${className}`}
    />
  )
}

export default BrandLogo
