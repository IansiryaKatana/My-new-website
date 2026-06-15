import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { DEFAULT_PHONE_COUNTRY, PHONE_COUNTRIES, type PhoneCountry } from '../../lib/phone/countries'
import { buildPhoneE164, digitsOnly, parsePhoneValue } from '../../lib/phone/formatPhone'
import { cn } from '../../lib/utils'

type PhoneInputVariant = 'light' | 'dark' | 'admin'

const variantStyles: Record<
  PhoneInputVariant,
  {
    shell: string
    prefix: string
    divider: string
    input: string
    menu: string
    option: string
    optionActive: string
  }
> = {
  light: {
    shell: 'border-[#11140F]/15 bg-[#F3F2ED] focus-within:border-[#11140F]',
    prefix: 'text-[#11140F] hover:bg-[#11140F]/5',
    divider: 'bg-[#11140F]/10',
    input: 'text-[#11140F] placeholder:text-[#11140F]/40',
    menu: 'border-[#11140F]/15 bg-[#F8F7F2] shadow-lg',
    option: 'text-[#11140F] hover:bg-[#11140F]/6',
    optionActive: 'bg-[#11140F]/8',
  },
  dark: {
    shell: 'border-[#D8D7C3]/25 bg-[#1A1F16] focus-within:border-[#D8D7C3]',
    prefix: 'text-[#D8D7C3] hover:bg-[#D8D7C3]/8',
    divider: 'bg-[#D8D7C3]/15',
    input: 'text-[#D8D7C3] placeholder:text-[#D8D7C3]/40',
    menu: 'border-[#D8D7C3]/20 bg-[#1A1F16] shadow-lg',
    option: 'text-[#D8D7C3] hover:bg-[#D8D7C3]/8',
    optionActive: 'bg-[#D8D7C3]/12',
  },
  admin: {
    shell: 'border-[var(--admin-border)] bg-[var(--admin-input-bg)] focus-within:border-[var(--admin-primary)]',
    prefix: 'text-[var(--admin-fg)] hover:bg-[var(--admin-border-subtle)]',
    divider: 'bg-[var(--admin-border-subtle)]',
    input: 'text-[var(--admin-fg)] placeholder:text-[var(--admin-fg-subtle)]',
    menu: 'border-[var(--admin-border)] bg-[var(--admin-input-bg)] shadow-lg',
    option: 'text-[var(--admin-fg)] hover:bg-[var(--admin-border-subtle)]',
    optionActive: 'bg-[var(--admin-border-subtle)]',
  },
}

export function PhoneInput({
  value,
  onChange,
  id,
  name,
  placeholder = 'Phone number',
  variant = 'light',
  className,
  disabled,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  defaultCountry = DEFAULT_PHONE_COUNTRY.iso2,
}: {
  value: string
  onChange: (value: string) => void
  id?: string
  name?: string
  placeholder?: string
  variant?: PhoneInputVariant
  className?: string
  disabled?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  defaultCountry?: string
}) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const parsed = parsePhoneValue(value)
  const [country, setCountry] = useState<PhoneCountry>(() => {
    if (value) return parsed.country
    return PHONE_COUNTRIES.find((c) => c.iso2 === defaultCountry) ?? DEFAULT_PHONE_COUNTRY
  })
  const [nationalNumber, setNationalNumber] = useState(parsed.nationalNumber)
  const styles = variantStyles[variant]

  useEffect(() => {
    const next = parsePhoneValue(value)
    setCountry(next.country)
    setNationalNumber(next.nationalNumber)
  }, [value])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  function emit(nextCountry: PhoneCountry, nextNational: string) {
    onChange(buildPhoneE164(nextCountry, nextNational))
  }

  function selectCountry(nextCountry: PhoneCountry) {
    setCountry(nextCountry)
    setOpen(false)
    emit(nextCountry, nationalNumber)
    inputRef.current?.focus()
  }

  function handleNationalChange(raw: string) {
    const nextNational = digitsOnly(raw)
    setNationalNumber(nextNational)
    emit(country, nextNational)
  }

  function focusNumberInput() {
    inputRef.current?.focus()
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <div
        className={cn(
          'flex h-12 items-stretch overflow-hidden rounded-2xl border transition-colors',
          styles.shell,
          disabled && 'pointer-events-none opacity-60',
          ariaInvalid && 'border-[#8B2E2E]',
        )}
        onClick={focusNumberInput}
      >
        <button
          type="button"
          className={cn(
            'flex shrink-0 items-center gap-2 px-3 font-copy text-sm transition-colors',
            styles.prefix,
          )}
          onClick={(event) => {
            event.stopPropagation()
            setOpen((v) => !v)
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`Country code +${country.dialCode}`}
          disabled={disabled}
        >
          <span className="text-lg leading-none" aria-hidden>
            {country.flag}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-55" aria-hidden />
          <span className="font-medium">+{country.dialCode}</span>
        </button>

        <span className={cn('my-3 w-px shrink-0', styles.divider)} aria-hidden />

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          className={cn(
            'min-w-0 flex-1 bg-transparent px-3 font-copy text-sm outline-none',
            styles.input,
          )}
          value={nationalNumber}
          onChange={(e) => handleNationalChange(e.target.value)}
          onClick={(event) => event.stopPropagation()}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
        />
      </div>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Country code"
          className={cn(
            'absolute left-0 top-[calc(100%+0.35rem)] z-50 max-h-56 w-full min-w-[16rem] overflow-y-auto rounded-xl border p-1',
            styles.menu,
          )}
        >
          {PHONE_COUNTRIES.map((item) => {
            const selected = item.iso2 === country.iso2
            return (
              <li key={item.iso2} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left font-copy text-sm transition-colors',
                    styles.option,
                    selected && styles.optionActive,
                  )}
                  onClick={() => selectCountry(item)}
                >
                  <span className="text-lg leading-none">{item.flag}</span>
                  <span className="flex-1">{item.name}</span>
                  <span className="opacity-70">+{item.dialCode}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
