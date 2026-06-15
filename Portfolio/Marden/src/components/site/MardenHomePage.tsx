import { Header } from './Header'
import { HeroSection } from './HeroSection'
import { ProjectsSection } from './ProjectsSection'
import { CapabilitiesSection } from './CapabilitiesSection'
import { ProcessSection } from './ProcessSection'
import { GlobalMapSection } from './GlobalMapSection'
import { Footer } from './Footer'
import { useCms } from '#/contexts/CmsContext'

export function MardenHomePage() {
  const { loading } = useCms()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-verden-off text-sm text-verden-muted">
        Loading...
      </div>
    )
  }

  return (
    <main className="overflow-x-hidden">
      <div className="relative">
        <Header />
        <HeroSection />
      </div>
      <ProjectsSection />
      <CapabilitiesSection />
      <ProcessSection />
      <GlobalMapSection />
      <Footer />
    </main>
  )
}
