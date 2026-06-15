import { useState } from 'react'
import { useCms } from '@/contexts/CmsContext'
import { getSupabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ContactCTA() {
  const { data } = useCms()
  const { siteSettings } = data
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [goal, setGoal] = useState('Buy a property')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !phone.trim()) {
      setError('Name and phone are required.')
      setStatus('error')
      return
    }
    setStatus('loading')
    const sb = getSupabase()
    if (sb) {
      const { error: dbError } = await sb.from('form_submissions').insert({
        id: crypto.randomUUID(),
        name: name.trim(),
        phone: phone.trim(),
        goal,
        source_page: '/',
        status: 'new',
      })
      if (dbError) {
        setError(dbError.message)
        setStatus('error')
        return
      }
    }
    setStatus('success')
    setName('')
    setPhone('')
  }

  return (
    <section id="contact" className="relative py-16 md:py-24">
      <img
        src={siteSettings.ctaImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative mx-auto grid max-w-[1320px] gap-10 px-5 md:px-10 lg:grid-cols-2 lg:items-center">
        <div className="text-white">
          <h2 className="section-heading text-white">
            Let's talk about
            <span className="font-serif-accent block normal-case">
              your dream home
            </span>
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/85">
            Speak with our concierge team for curated listings and full
            paperwork support.
          </p>
          <a
            href={`tel:${siteSettings.contactPhone.replace(/\D/g, '')}`}
            className="mt-8 block text-3xl tracking-tight md:text-4xl"
          >
            {siteSettings.contactPhone}
          </a>
          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/70">
            {siteSettings.contactAvailability}
          </p>
        </div>

        <form
          onSubmit={submit}
          className="border border-line bg-white p-6 md:p-8"
        >
          <h3 className="font-display text-xl uppercase tracking-[-0.04em]">
            Leave a request
          </h3>
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="phone">Your number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="goal">Choose your goal</Label>
              <select
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="mt-2 flex h-11 w-full border border-line bg-cream/80 px-4 text-sm"
              >
                <option>Buy a property</option>
                <option>Sell a property</option>
                <option>Rent</option>
                <option>Investment advisory</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="mt-6 w-full" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending…' : 'Send request'}
          </Button>
          {status === 'success' && (
            <p className="mt-3 text-sm text-olive">Thank you — we'll be in touch shortly.</p>
          )}
          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
          <p className="mt-4 text-[10px] text-muted">
            By submitting, you agree to our privacy policy.
          </p>
        </form>
      </div>
    </section>
  )
}
