export type PhoneCountry = {
  iso2: string
  name: string
  dialCode: string
  flag: string
}

/** Common countries — UAE first for default market. */
export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso2: 'AE', name: 'United Arab Emirates', dialCode: '971', flag: '🇦🇪' },
  { iso2: 'SA', name: 'Saudi Arabia', dialCode: '966', flag: '🇸🇦' },
  { iso2: 'QA', name: 'Qatar', dialCode: '974', flag: '🇶🇦' },
  { iso2: 'KW', name: 'Kuwait', dialCode: '965', flag: '🇰🇼' },
  { iso2: 'BH', name: 'Bahrain', dialCode: '973', flag: '🇧🇭' },
  { iso2: 'OM', name: 'Oman', dialCode: '968', flag: '🇴🇲' },
  { iso2: 'GB', name: 'United Kingdom', dialCode: '44', flag: '🇬🇧' },
  { iso2: 'US', name: 'United States', dialCode: '1', flag: '🇺🇸' },
  { iso2: 'CA', name: 'Canada', dialCode: '1', flag: '🇨🇦' },
  { iso2: 'IN', name: 'India', dialCode: '91', flag: '🇮🇳' },
  { iso2: 'PK', name: 'Pakistan', dialCode: '92', flag: '🇵🇰' },
  { iso2: 'PH', name: 'Philippines', dialCode: '63', flag: '🇵🇭' },
  { iso2: 'EG', name: 'Egypt', dialCode: '20', flag: '🇪🇬' },
  { iso2: 'JO', name: 'Jordan', dialCode: '962', flag: '🇯🇴' },
  { iso2: 'LB', name: 'Lebanon', dialCode: '961', flag: '🇱🇧' },
  { iso2: 'DE', name: 'Germany', dialCode: '49', flag: '🇩🇪' },
  { iso2: 'FR', name: 'France', dialCode: '33', flag: '🇫🇷' },
  { iso2: 'IT', name: 'Italy', dialCode: '39', flag: '🇮🇹' },
  { iso2: 'ES', name: 'Spain', dialCode: '34', flag: '🇪🇸' },
  { iso2: 'NL', name: 'Netherlands', dialCode: '31', flag: '🇳🇱' },
  { iso2: 'AU', name: 'Australia', dialCode: '61', flag: '🇦🇺' },
  { iso2: 'SG', name: 'Singapore', dialCode: '65', flag: '🇸🇬' },
  { iso2: 'MY', name: 'Malaysia', dialCode: '60', flag: '🇲🇾' },
  { iso2: 'ZA', name: 'South Africa', dialCode: '27', flag: '🇿🇦' },
  { iso2: 'NG', name: 'Nigeria', dialCode: '234', flag: '🇳🇬' },
  { iso2: 'KE', name: 'Kenya', dialCode: '254', flag: '🇰🇪' },
]

export const DEFAULT_PHONE_COUNTRY = PHONE_COUNTRIES[0]

export function findCountryByIso(iso2: string) {
  return PHONE_COUNTRIES.find((c) => c.iso2 === iso2) ?? DEFAULT_PHONE_COUNTRY
}

export function findCountryByDialCode(dialCode: string) {
  return (
    [...PHONE_COUNTRIES]
      .sort((a, b) => b.dialCode.length - a.dialCode.length)
      .find((c) => dialCode.startsWith(c.dialCode)) ?? DEFAULT_PHONE_COUNTRY
  )
}
