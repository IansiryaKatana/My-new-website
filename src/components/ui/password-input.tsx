import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  inputClassName?: string
  toggleClassName?: string
}

export function PasswordInput({
  className,
  inputClassName,
  toggleClassName,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <input
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-11', inputClassName)}
      />
      <button
        type="button"
        className={cn(
          'absolute inset-y-0 right-0 z-10 flex w-10 items-center justify-center transition-colors',
          toggleClassName,
        )}
        onClick={() => setShowPassword((visible) => !visible)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        aria-pressed={showPassword}
      >
        {showPassword ? (
          <EyeOff className="size-[1.125rem] shrink-0" strokeWidth={2} aria-hidden="true" />
        ) : (
          <Eye className="size-[1.125rem] shrink-0" strokeWidth={2} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
