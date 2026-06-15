import { useState } from 'react'
import { Header } from './Header'
import { Hero } from './Hero'
import { LogoStrip } from './LogoStrip'
import { PerspectiveSection } from './PerspectiveSection'
import { PrinciplesGrid } from './PrinciplesGrid'
import { PortfolioSection } from './PortfolioSection'
import { ImageBreak } from './ImageBreak'
import { InvestmentApproach } from './InvestmentApproach'
import { FinalCTA } from './FinalCTA'
import { Footer } from './Footer'
import { SubmitDialog } from './SubmitDialog'

export function HomePage() {
  const [submitOpen, setSubmitOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <Header onSubmit={() => setSubmitOpen(true)} />
      <Hero onTalk={() => setContactOpen(true)} />
      <LogoStrip />
      <PerspectiveSection />
      <PrinciplesGrid />
      <PortfolioSection />
      <ImageBreak />
      <InvestmentApproach />
      <FinalCTA onSubmit={() => setSubmitOpen(true)} />
      <Footer />

      <SubmitDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        formType="opportunity"
      />
      <SubmitDialog
        open={contactOpen}
        onOpenChange={setContactOpen}
        formType="contact"
      />
    </div>
  )
}
