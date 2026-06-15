import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { publicAsset } from '../../../demo-assets'
import { useCms } from '../contexts/CmsContext'
import { getSupabase } from '../integrations/supabase/client'
import { setting } from '../lib/cms/types'

export const Route = createFileRoute('/')({ component: App })

const leadSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  message: z.string().min(10),
  accepted_terms: z.literal(true),
})

function App() {
  const { snapshot } = useCms()
  const [formState, setFormState] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: '',
    accepted_terms: false,
  })
  const [feedback, setFeedback] = useState<string>('')

  const featuredInvestment = useMemo(
    () => snapshot.investments.find((item) => item.is_featured) ?? snapshot.investments[0],
    [snapshot.investments],
  )

  const submitLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = leadSchema.safeParse(formState)
    if (!parsed.success) {
      setFeedback('Please complete all required fields and accept terms.')
      return
    }

    const sb = getSupabase()
    if (!sb) {
      setFeedback('Lead capture is ready. Add Supabase env keys to enable live saves.')
      return
    }

    const { error } = await sb.from('form_submissions').insert({
      ...parsed.data,
      source_page: 'home',
    })
    if (error) {
      setFeedback(error.message)
      return
    }

    setFormState({
      full_name: '',
      email: '',
      phone: '',
      message: '',
      accepted_terms: false,
    })
    setFeedback('Thanks. Your submission has been received.')
  }

  return (
    <main className="site">
      <section className="hero section">
        <img src={publicAsset('hero-reference.webp')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-multiply" />
        <div className="section-inner relative z-10">
          <header className="header">
            <span>{setting(snapshot.siteSettings, 'brand_name', 'Thale Capital')}</span>
            <nav>
              <a href="#overview">Overview</a>
              <a href="#thesis">Thesis</a>
              <a href="#contact">Contact</a>
              <a href="/admin">Admin</a>
            </nav>
          </header>
          <h1 className="hero-title">{setting(snapshot.siteSettings, 'hero_heading', 'Northbridge Infrastructure Partners')}</h1>
          <div className="hero-bottom">
            <p>{setting(snapshot.siteSettings, 'hero_subtitle', '')}</p>
            <a className="btn btn-light" href="#contact">Contact Us +</a>
          </div>
        </div>
      </section>
      <section id="overview" className="section section-off">
        <div className="section-inner two-col">
          <h2>{setting(snapshot.siteSettings, 'overview_copy', '')}</h2>
          <p>
            We deploy long-duration capital into resilient infrastructure with disciplined underwriting, operational control, and governance-led value creation.
          </p>
        </div>
      </section>
      <section id="thesis" className="section section-off">
        <div className="section-inner">
          <h3 className="kicker">Investment Thesis</h3>
          <p className="thesis">{setting(snapshot.siteSettings, 'thesis_copy', '')}</p>
        </div>
      </section>
      <section className="section section-blue">
        <div className="section-inner">
          <h3 className="kicker">Value Creation</h3>
          <h2>Strategic Pillars of Value Creation</h2>
          <div className="pillars">
            {snapshot.pillars.map((pillar) => (
              <article key={pillar.id} className={`pillar-row ${pillar.is_highlighted ? 'active' : ''}`}>
                <h4>{pillar.title}</h4>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-blue">
        <div className="section-inner">
          {featuredInvestment && (
            <article className="investment-card">
              <img src={featuredInvestment.image_url || publicAsset('hero-reference.webp')} alt={featuredInvestment.title} />
              <div>
                <h3>{featuredInvestment.title}</h3>
                <p>{featuredInvestment.description}</p>
                <small>{featuredInvestment.industry} · {featuredInvestment.year}</small>
              </div>
            </article>
          )}
        </div>
      </section>
      <section id="contact" className="section section-off">
        <div className="section-inner contact">
          <div>
            <h3 className="kicker">Let's Talk</h3>
            <h2>Start A Conversation</h2>
          </div>
          <form onSubmit={submitLead} className="contact-form">
            <input placeholder="Full Name" value={formState.full_name} onChange={(e) => setFormState((s) => ({ ...s, full_name: e.target.value }))} />
            <input placeholder="Email Address" value={formState.email} onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))} />
            <input placeholder="Phone Number" value={formState.phone} onChange={(e) => setFormState((s) => ({ ...s, phone: e.target.value }))} />
            <textarea placeholder="Message" value={formState.message} onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))} />
            <label className="checkbox-row">
              <input type="checkbox" checked={formState.accepted_terms} onChange={(e) => setFormState((s) => ({ ...s, accepted_terms: e.target.checked }))} />
              I agree to the Policies and Terms
            </label>
            <button className="btn" type="submit">Submit</button>
            {feedback && <p className="feedback">{feedback}</p>}
          </form>
        </div>
      </section>
      <footer className="footer section-blue">
        <div className="section-inner">
          <p>{setting(snapshot.siteSettings, 'brand_name', 'Thale Capital')} · Global Private Infrastructure Capital</p>
        </div>
      </footer>
    </main>
  )
}
