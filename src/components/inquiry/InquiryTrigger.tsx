import { Link } from '@tanstack/react-router'
import type { ComponentProps, ReactNode } from 'react'

import { useInquiry } from '../../contexts/InquiryContext'
import type { InquiryOpenOptions } from '../../lib/inquiry/types'
import { isInquiryHref } from '../../lib/inquiry/types'
import { Button, buttonVariants } from '../ui/button'
import { cn } from '../../lib/utils'

type InquiryTriggerProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  inquiry?: InquiryOpenOptions
  children: ReactNode
}

export function InquiryTrigger({
  inquiry,
  children,
  className,
  variant,
  size,
  ...props
}: InquiryTriggerProps) {
  const { openInquiry } = useInquiry()

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => openInquiry(inquiry)}
      {...props}
    >
      {children}
    </Button>
  )
}

type InquiryLinkTriggerProps = {
  inquiry?: InquiryOpenOptions
  children: ReactNode
  className?: string
  /** Mobile: icon-only square matching hero menu button; sm+: full underline link */
  compactOnMobile?: boolean
}

/** Text link styled like hero “Start a project” underline CTA. */
export function InquiryLinkTrigger({
  inquiry,
  children,
  className,
  compactOnMobile = false,
}: InquiryLinkTriggerProps) {
  const { openInquiry } = useInquiry()
  const label = typeof children === 'string' ? children : 'Start a project'

  return (
    <button
      type="button"
      className={cn(
        'group inline-flex items-center font-display transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8D7C3]',
        compactOnMobile
          ? 'h-9 w-9 shrink-0 justify-center text-xl leading-none sm:h-auto sm:w-auto sm:justify-start sm:text-sm sm:font-black sm:uppercase sm:underline sm:decoration-[#D8D7C3]/80 sm:underline-offset-4'
          : 'text-sm font-black uppercase underline decoration-[#D8D7C3]/80 underline-offset-4',
        className,
      )}
      onClick={() => openInquiry(inquiry)}
    >
      {compactOnMobile ? (
        <>
          <span className="sr-only sm:hidden">{label}</span>
          <span className="sm:hidden" aria-hidden="true">
            ↗
          </span>
          <span className="hidden sm:inline">{children}</span>
          <span
            aria-hidden="true"
            className="hidden pl-1 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:inline-block"
          >
            ↗
          </span>
        </>
      ) : (
        <>
          {children}
          <span
            aria-hidden="true"
            className="inline-block pl-1 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </>
      )}
    </button>
  )
}

export function InquiryOrLink({
  to,
  inquiry,
  className,
  children,
}: {
  to: string
  inquiry?: InquiryOpenOptions
  className?: string
  children: ReactNode
}) {
  const { openInquiry } = useInquiry()

  if (isInquiryHref(to)) {
    return (
      <button type="button" className={className} onClick={() => openInquiry(inquiry)}>
        {children}
      </button>
    )
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}

export { buttonVariants }
