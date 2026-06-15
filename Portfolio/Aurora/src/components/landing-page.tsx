import { FAQSection, FooterSection } from '@/components/sections/faq-footer-section'
import { FormulaSection } from '@/components/sections/formula-section'
import { HeroSection } from '@/components/sections/hero-section'
import { NutritionSection } from '@/components/sections/nutrition-section'
import { PhilosophySection } from '@/components/sections/philosophy-section'
import { TestimonialSection } from '@/components/sections/testimonial-section'
import { TreatmentSection } from '@/components/sections/treatment-section'

export function LandingPage() {
  return (
    <main id="top" className="overflow-hidden">
      <HeroSection />
      <PhilosophySection />
      <NutritionSection />
      <TreatmentSection />
      <FormulaSection />
      <TestimonialSection />
      <FAQSection />
      <FooterSection />
    </main>
  )
}
