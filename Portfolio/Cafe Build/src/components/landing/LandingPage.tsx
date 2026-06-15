import { useCms } from '@/contexts/CmsContext'
import { CurvedMarquee } from '@/components/landing/CurvedMarquee'
import { FlavorShowcaseSection } from '@/components/landing/FlavorShowcaseSection'
import { HeroSection } from '@/components/landing/HeroSection'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { MatchaEssenceSection } from '@/components/landing/MatchaEssenceSection'
import { SplitPromoSection } from '@/components/landing/SplitPromoSection'

function LandingSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--deep-green)]">
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-10 w-24 rounded bg-white/10" />
        <div className="mt-24 h-32 max-w-lg rounded bg-white/10" />
        <div className="mt-8 h-12 w-40 rounded-full bg-white/10" />
      </div>
    </div>
  )
}

export function LandingPage() {
  const { loading, sections, featuredProducts, benefits } = useCms()

  if (loading) {
    return <LandingSkeleton />
  }

  const benefitLabels = benefits.map((b) => b.label)

  return (
    <div className="landing-page bg-[var(--cream)] text-[var(--text-dark)] [--cream:#f7f0da] [--deep-green:#103b27] [--lime:#e8f33f] [--matcha:#89aa45] [--text-dark:#102318]">
      <HeroSection hero={sections.hero} featuredProducts={featuredProducts} />

      <div className="relative z-10 -mt-6 sm:-mt-8">
        <CurvedMarquee labels={benefitLabels} />
      </div>

      <MatchaEssenceSection essence={sections.essence} />
      <SplitPromoSection promo={sections.promo} />
      <FlavorShowcaseSection flavor={sections.flavor} />
      <LandingFooter footer={sections.footer} />
    </div>
  )
}
