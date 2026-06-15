import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import type * as React from 'react'

import { cn } from '#/lib/utils'

type SelectOption = {
  label: string
  value: string
}

type StyledSelectProps = {
  className?: string
  icon?: React.ComponentType<{ className?: string }>
  onValueChange: (value: string) => void
  options: Array<SelectOption>
  placeholder?: string
  value: string
}

function StyledSelect({
  className,
  icon: Icon,
  onValueChange,
  options,
  placeholder = 'Select',
  value,
}: StyledSelectProps) {
  return (
    <SelectPrimitive.Root onValueChange={onValueChange} value={value}>
      <SelectPrimitive.Trigger
        className={cn(
          'inline-flex h-10 min-w-[150px] items-center justify-between gap-2 rounded border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-cream/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition hover:border-orange-300/20 hover:bg-white/[0.07] hover:text-cream focus:outline-none focus:ring-2 focus:ring-orange-400/40',
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {Icon ? <Icon className="size-4 shrink-0 text-orange-200" /> : null}
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="size-3 shrink-0 text-cream/55" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded border border-orange-200/10 bg-[linear-gradient(145deg,#211007,#090604)] p-1 text-cream shadow-[0_18px_44px_rgba(0,0,0,0.48)] backdrop-blur-xl"
          position="popper"
          sideOffset={8}
        >
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                className="relative flex cursor-pointer select-none items-center rounded px-8 py-2 text-sm text-cream/75 outline-none transition data-[highlighted]:bg-orange-400/15 data-[highlighted]:text-cream data-[state=checked]:text-orange-100"
                key={option.value}
                value={option.value}
              >
                <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <Check className="size-4 text-orange-200" />
                </SelectPrimitive.ItemIndicator>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

export { StyledSelect }
export type { SelectOption }
