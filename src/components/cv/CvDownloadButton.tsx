import { useSiteConfig } from '../../contexts/CmsContext'
import { buttonVariants } from '../ui/button'

type CvDownloadButtonProps = {
  variant?: 'accent' | 'forest' | 'light' | 'lightMuted'
  className?: string
}

export function CvDownloadButton({ variant = 'lightMuted', className }: CvDownloadButtonProps) {
  const siteConfig = useSiteConfig()
  const cvUrl = siteConfig.cvUrl?.trim()
  if (!cvUrl) return null

  const label = "Download Ian's CV"

  return (
    <a
      href={cvUrl}
      download
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({ variant, className })}
    >
      {label}
      <span aria-hidden="true" className="ml-2">
        ↓
      </span>
    </a>
  )
}
