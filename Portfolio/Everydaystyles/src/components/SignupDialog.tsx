import { ArrowRight } from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import { z } from 'zod'
import { hubSignupSchema, type HubSignupInput } from '@/lib/hub-signup-schema'
import { createHubSignup } from '@/server/hub-signup'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type SignupDialogProps = {
  children: ReactNode
}

type FieldErrors = Partial<Record<keyof HubSignupInput, string>>

const defaultForm: HubSignupInput = {
  name: '',
  email: '',
  interest: 'consent-guide',
  consent: false,
}

export function SignupDialog({ children }: SignupDialogProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<HubSignupInput>(defaultForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [message, setMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setIsSuccess(false)

    const parsed = hubSignupSchema.safeParse(form)

    if (!parsed.success) {
      setErrors(mapErrors(parsed.error))
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const result = await createHubSignup({ data: parsed.data })
      setMessage(result.message)
      setIsSuccess(result.ok)

      if (result.ok) {
        setForm(defaultForm)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to join right now.')
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-4xl font-black uppercase leading-none tracking-[-0.05em]">
            Join The Hub
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-neutral-600">
            Start with a calm lesson path for consent, communication, confidence,
            and healthier intimacy. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              placeholder="Maya Johnson"
            />
            {errors.name ? (
              <p id="name-error" className="text-xs font-medium text-red-600">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder="you@example.com"
            />
            {errors.email ? (
              <p id="email-error" className="text-xs font-medium text-red-600">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="interest">First learning path</Label>
            <select
              id="interest"
              name="interest"
              value={form.interest}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  interest: event.target.value as HubSignupInput['interest'],
                }))
              }
              className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-950 shadow-sm focus:border-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950/10"
            >
              <option value="consent-guide">Consent Guide</option>
              <option value="communication">Communication</option>
              <option value="confidence">Confidence</option>
              <option value="weekly-lessons">Weekly Lessons</option>
            </select>
            {errors.interest ? (
              <p className="text-xs font-medium text-red-600">{errors.interest}</p>
            ) : null}
          </div>

          <label className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-6 text-neutral-700 shadow-sm">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  consent: event.target.checked,
                }))
              }
              className="mt-1 size-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950"
            />
            <span>
              I want to receive educational updates from Everydaystyles and can
              unsubscribe anytime.
              {errors.consent ? (
                <span className="block text-xs font-medium text-red-600">
                  {errors.consent}
                </span>
              ) : null}
            </span>
          </label>

          {message ? (
            <p
              className={`rounded-2xl p-4 text-sm font-medium ${
                isSuccess
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-red-50 text-red-700'
              }`}
              role="status"
            >
              {message}
            </p>
          ) : null}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="light" className="w-full sm:w-auto">
                Maybe later
              </Button>
            </DialogClose>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? 'Joining...' : 'Start Your Learning'}
              <ArrowRight className="size-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function mapErrors(error: z.ZodError<HubSignupInput>): FieldErrors {
  const flattened = error.flatten().fieldErrors

  return {
    name: flattened.name?.[0],
    email: flattened.email?.[0],
    interest: flattened.interest?.[0],
    consent: flattened.consent?.[0],
  }
}
