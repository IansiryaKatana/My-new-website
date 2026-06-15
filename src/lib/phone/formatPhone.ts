import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js/min'

export function isValidPhoneE164(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return true
  return isValidPhoneNumber(trimmed)
}

export function formatPhoneDisplay(value: string | null | undefined) {
  if (!value?.trim()) return ''
  try {
    const parsed = parsePhoneNumber(value)
    return parsed ? parsed.formatInternational() : value
  } catch {
    return value
  }
}

export function toPhoneE164(value: string) {
  const trimmed = value.trim()
  return trimmed || ''
}
