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
}

/** Text link styled like hero “Start a project” underline CTA. */
export function InquiryLinkTrigger({ inquiry, children, className }: InquiryLinkTriggerProps) {
  const { openInquiry } = useInquiry()

  return (
    <button
      type="button"
      className={cn(
        'group font-display text-sm font-black uppercase underline decoration-[#D8D7C3]/80 underline-offset-4 transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8D7C3]',
        className,
      )}
      onClick={() => openInquiry(inquiry)}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block pl-1 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      >
        ↗
      </span>
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
