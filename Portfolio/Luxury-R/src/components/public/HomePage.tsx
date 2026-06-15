import { Header } from './Header'
import { Hero } from './Hero'
import { PropertyListings } from './PropertyListings'
import { QuoteBlock } from './QuoteBlock'
import { TestimonialsCarousel } from './TestimonialsCarousel'
import { ProcessSlider } from './ProcessSlider'
import { TeamSection } from './TeamSection'
import { FAQSection } from './FAQSection'
import { ContactCTA } from './ContactCTA'
import { Footer } from './Footer'

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <PropertyListings />
        <QuoteBlock />
        <TestimonialsCarousel />
        <ProcessSlider />
        <TeamSection />
        <FAQSection />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  )
}
