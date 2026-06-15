import { DEFAULT_PHONE_COUNTRY, findCountryByDialCode, findCountryByIso, type PhoneCountry } from './countries'

export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function buildPhoneE164(country: PhoneCountry, nationalNumber: string) {
  const digits = digitsOnly(nationalNumber)
  if (!digits) return ''
  return `+${country.dialCode}${digits}`
}

export function parsePhoneValue(value: string | null | undefined): {
  country: PhoneCountry
  nationalNumber: string
} {
  if (!value?.trim()) {
    return { country: DEFAULT_PHONE_COUNTRY, nationalNumber: '' }
  }

  const compact = value.trim().replace(/[\s()-]/g, '')
  if (!compact.startsWith('+')) {
    return {
      country: DEFAULT_PHONE_COUNTRY,
      nationalNumber: digitsOnly(compact),
    }
  }

  const digits = digitsOnly(compact)
  const country = findCountryByDialCode(digits)
  const nationalNumber = digits.slice(country.dialCode.length)
  return { country, nationalNumber }
}

export function isValidPhoneE164(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return true
  return /^\+[1-9]\d{7,14}$/.test(trimmed.replace(/[\s()-]/g, ''))
}

export function formatPhoneDisplay(value: string | null | undefined) {
  if (!value?.trim()) return ''
  const { country, nationalNumber } = parsePhoneValue(value)
  if (!nationalNumber) return `+${country.dialCode}`
  return `+${country.dialCode} ${nationalNumber.replace(/(\d{3})(?=\d)/g, '$1 ').trim()}`
}

export function resolveCountryFromValue(value: string | null | undefined) {
  if (!value?.trim()) return DEFAULT_PHONE_COUNTRY
  const { country } = parsePhoneValue(value)
  return findCountryByIso(country.iso2)
}
