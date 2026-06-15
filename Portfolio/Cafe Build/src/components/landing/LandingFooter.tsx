import { useState, type FormEvent } from 'react'
import { getSupabase } from '@/integrations/supabase/client'
import type { TablesInsert } from '@/integrations/supabase/database.types'
import { useCms } from '@/contexts/CmsContext'
import type { FooterSectionPayload } from '@/lib/cms/types'

type LandingFooterProps = {
  footer: FooterSectionPayload
}

export function LandingFooter({ footer }: LandingFooterProps) {
  const { navItems } = useCms()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setMessage('')

    const supabase = getSupabase()
    if (!supabase) {
      setStatus('error')
      setMessage('Newsletter signup is unavailable right now.')
      return
    }

    const submission: TablesInsert<'form_submissions'> = {
      form_type: 'newsletter',
      email: trimmed,
      source: 'footer',
      payload: {},
    }

    const { error } = await supabase.from('form_submissions').insert(submission)

    if (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
      return
    }

    setStatus('success')
    setMessage('Thanks for subscribing!')
    setEmail('')
  }

  return (
    <footer className="relative overflow-hidden bg-[var(--deep-green)] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="max-w-md text-lg leading-relaxed text-white/85 sm:text-xl">
              {footer.newsletterTitle}
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
              noValidate
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={footer.newsletterPlaceholder}
                className="min-h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/50 outline-none focus:border-[var(--lime)]"
                aria-label="Email address"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="min-h-12 rounded-full bg-[var(--lime)] px-8 text-sm font-bold uppercase tracking-wide text-[var(--text-dark)] transition active:scale-95 disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending…' : 'Subscribe'}
              </button>
            </form>
            {message && (
              <p
                className={
                  status === 'error'
                    ? 'mt-3 text-sm text-red-300'
                    : 'mt-3 text-sm text-[var(--lime)]'
                }
                role="status"
              >
                {message}
              </p>
            )}
          </div>

          <nav className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={
                  item.isHighlighted
                    ? 'text-sm font-bold uppercase tracking-wide text-[var(--lime)] no-underline'
                    : 'text-sm font-semibold uppercase tracking-wide text-white/75 no-underline transition hover:text-white'
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-14 overflow-hidden border-t border-white/10 pt-10">
          <p
            className="select-none text-center font-extrabold uppercase leading-none tracking-tight text-white/[0.08] sm:text-[clamp(4rem,18vw,12rem)]"
            aria-hidden
          >
            {footer.wordmark}
          </p>
          <p className="mt-6 text-center text-xs text-white/50">
            {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
