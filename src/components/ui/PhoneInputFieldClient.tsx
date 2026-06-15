import clsx from 'clsx'
import PhoneInput, { type Country } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import '../../styles/phone-input-overrides.css'

export type PhoneInputFieldProps = {
  id?: string
  name?: string
  value?: string | null
  onChange?: (value: string | undefined) => void
  placeholder?: string
  defaultCountry?: Country
  disabled?: boolean
  className?: string
  variant?: 'public' | 'admin'
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

export function PhoneInputFieldClient({
  id,
  name,
  value,
  onChange,
  placeholder = 'Phone number',
  defaultCountry = 'AE',
  disabled,
  className,
  variant = 'public',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: PhoneInputFieldProps) {
  return (
    <PhoneInput
      id={id}
      name={name}
      international
      defaultCountry={defaultCountry}
      value={value?.trim() ? value : undefined}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      className={clsx(
        variant === 'public' ? 'phone-input--public' : 'phone-input--admin',
        ariaInvalid && 'phone-input--invalid',
        className,
      )}
    />
  )
}
