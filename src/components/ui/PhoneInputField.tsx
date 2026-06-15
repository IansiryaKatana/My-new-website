import { lazy, Suspense, useEffect, useState } from 'react'

import type { PhoneInputFieldProps } from './PhoneInputFieldClient'

const PhoneInputFieldClient = lazy(() =>
  import('./PhoneInputFieldClient').then((mod) => ({ default: mod.PhoneInputFieldClient })),
)

function PhoneInputFallback({
  placeholder,
  variant = 'public',
  'aria-invalid': ariaInvalid,
}: Pick<PhoneInputFieldProps, 'placeholder' | 'variant' | 'aria-invalid'>) {
  return (
    <div
      className={
        variant === 'public'
          ? `phone-input--public PhoneInput${ariaInvalid ? ' phone-input--invalid' : ''}`
          : `phone-input--admin PhoneInput`
      }
      aria-hidden
    >
      <input
        type="tel"
        readOnly
        tabIndex={-1}
        placeholder={placeholder}
        className="PhoneInputInput"
      />
    </div>
  )
}

/**
 * Client-only wrapper — react-phone-number-input pulls browser/CDN flag assets
 * and breaks Node SSR module resolution without a full client bundle.
 */
export function PhoneInputField(props: PhoneInputFieldProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <PhoneInputFallback
        placeholder={props.placeholder}
        variant={props.variant}
        aria-invalid={props['aria-invalid']}
      />
    )
  }

  return (
    <Suspense
      fallback={
        <PhoneInputFallback
          placeholder={props.placeholder}
          variant={props.variant}
          aria-invalid={props['aria-invalid']}
        />
      }
    >
      <PhoneInputFieldClient {...props} />
    </Suspense>
  )
}
