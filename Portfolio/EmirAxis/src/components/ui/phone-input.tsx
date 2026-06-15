import * as React from "react";
import PhoneInputWithCountry from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

interface Props {
  value?: string | null;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  defaultCountry?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * International phone input with country flag selector.
 * Stores E.164 formatted numbers (e.g. +971501234567).
 */
export function PhoneInput({
  value,
  onChange,
  placeholder = "Phone number",
  defaultCountry = "AE",
  className,
  disabled,
  id,
}: Props) {
  return (
    <div className={cn("phone-input-wrap", className)}>
      <PhoneInputWithCountry
        id={id}
        international
        countryCallingCodeEditable={false}
        defaultCountry={defaultCountry as never}
        value={value ?? undefined}
        onChange={(v) => onChange?.(v as string | undefined)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
