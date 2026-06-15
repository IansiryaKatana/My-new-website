import { useState, type FormEvent } from 'react'

import { useSiteConfig } from '../../contexts/CmsContext'
import { getSupabase } from '../../integrations/supabase/client'
import type { InquiryOpenOptions } from '../../lib/inquiry/types'
import { isValidPhoneE164, toPhoneE164 } from '../../lib/phone/formatPhone'
import { fontCopy, textCopySm } from '../../lib/typography'
import { Button } from '../ui/button'
import { PhoneInputField } from '../ui/PhoneInputField'

type FormState = {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
}

export const contactFieldClass =
  `w-full border border-[#11140F]/20 bg-transparent px-4 py-3 text-sm text-[#11140F] outline-none transition-colors focus:border-[#11140F] ${fontCopy}`

function buildInitialState(inquiry?: InquiryOpenOptions): FormState {
  return {
    ...initialState,
    message: inquiry?.prefillMessage ?? '',
  }
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {}

  if (!values.name.trim()) errors.name = 'Name is required.'
  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.'

  if (values.phone.trim() && !isValidPhoneE164(values.phone)) {
    errors.phone = 'Enter a valid phone number.'
  }

  if (!values.message.trim()) errors.message = 'Tell me about the project.'
  else if (values.message.trim().length < 20) errors.message = 'Message should be at least 20 characters.'

  return errors
}

export function ContactForm({
  inquiry,
  onSubmitted,
  showFooterNote = true,
}: {
  inquiry?: InquiryOpenOptions
  onSubmitted?: () => void
  showFooterNote?: boolean
}) {
  const siteConfig = useSiteConfig()
  const [values, setValues] = useState<FormState>(() => buildInitialState(inquiry))
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handleChange(field: keyof FormState, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmitError(null)

    if (Object.keys(nextErrors).length > 0) return

    const phone = values.phone.trim() ? toPhoneE164(values.phone) : null
    const source = inquiry?.source?.trim() || null
    const sourceRef = inquiry?.sourceRef?.trim() || null

    const sb = getSupabase()
    if (!sb) {
      const subject = encodeURIComponent(`Project inquiry from ${values.name.trim()}`)
      const body = encodeURIComponent(
        [
          source ? `Source: ${source}` : null,
          sourceRef ? `Reference: ${sourceRef}` : null,
          `Name: ${values.name.trim()}`,
          `Email: ${values.email.trim()}`,
          phone ? `Phone: ${phone}` : null,
          values.company.trim() ? `Company: ${values.company.trim()}` : null,
          '',
          values.message.trim(),
        ]
          .filter(Boolean)
          .join('\n'),
      )
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`
      setSubmitted(true)
      onSubmitted?.()
      return
    }

    setSaving(true)
    const { error } = await sb.from('form_submissions').insert({
      name: values.name.trim(),
      email: values.email.trim(),
      phone,
      company: values.company.trim() || null,
      message: values.message.trim(),
      source,
      source_ref: sourceRef,
      status: 'new',
    })
    setSaving(false)

    if (error) {
      setSubmitError(error.message)
      return
    }

    setSubmitted(true)
    setValues(buildInitialState(inquiry))
    onSubmitted?.()
  }

  return (
    <form className="grid gap-5" onSubmit={(e) => void handleSubmit(e)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="font-display text-xs font-black uppercase tracking-[0.14em] text-[#11140F]/70">Name *</span>
          <input className={contactFieldClass} name="name" value={values.name} onChange={(event) => handleChange('name', event.target.value)} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
          {errors.name ? <span id="name-error" className="text-xs text-[#8B2E2E]">{errors.name}</span> : null}
        </label>

        <label className="grid gap-2">
          <span className="font-display text-xs font-black uppercase tracking-[0.14em] text-[#11140F]/70">Email *</span>
          <input className={contactFieldClass} type="email" name="email" value={values.email} onChange={(event) => handleChange('email', event.target.value)} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
          {errors.email ? <span id="email-error" className="text-xs text-[#8B2E2E]">{errors.email}</span> : null}
        </label>
      </div>

      <label className="grid gap-2">
        <span className="font-display text-xs font-black uppercase tracking-[0.14em] text-[#11140F]/70">Phone</span>
        <PhoneInputField
          variant="public"
          name="phone"
          value={values.phone}
          onChange={(phone) => handleChange('phone', phone ?? '')}
          placeholder="Phone number"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone ? <span id="phone-error" className="text-xs text-[#8B2E2E]">{errors.phone}</span> : null}
      </label>

      <label className="grid gap-2">
        <span className="font-display text-xs font-black uppercase tracking-[0.14em] text-[#11140F]/70">Company</span>
        <input className={contactFieldClass} name="company" value={values.company} onChange={(event) => handleChange('company', event.target.value)} autoComplete="organization" />
      </label>

      <label className="grid gap-2">
        <span className="font-display text-xs font-black uppercase tracking-[0.14em] text-[#11140F]/70">Project details *</span>
        <textarea className={`${contactFieldClass} min-h-36 resize-y`} name="message" value={values.message} onChange={(event) => handleChange('message', event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />
        {errors.message ? <span id="message-error" className="text-xs text-[#8B2E2E]">{errors.message}</span> : null}
      </label>

      {submitError ? <p className={`text-sm text-[#8B2E2E] ${fontCopy}`}>{submitError}</p> : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant="dark" disabled={saving}>
          {saving ? 'Sending…' : 'Send inquiry'}
        </Button>
        {submitted ? (
          <p className={`${textCopySm} text-[#11140F]/75`}>Thanks — your inquiry has been received.</p>
        ) : showFooterNote ? (
          <p className={`${textCopySm} text-[#11140F]/65`}>
            Prefer email directly?{' '}
            <a href={`mailto:${siteConfig.email}`} className="font-display font-black uppercase underline underline-offset-4">{siteConfig.email}</a>
          </p>
        ) : null}
      </div>
    </form>
  )
}
