import { createFileRoute } from "@tanstack/react-router";

import { ArticlesSection } from "../sections/articles-section";
import { FAQSection } from "../sections/faq-section";
import { FeaturedProjectsSection } from "../sections/featured-projects-section";
import { Footer } from "../sections/footer";
import { Header } from "../sections/header";
import { HeroSection } from "../sections/hero-section";
import { ProcessSection } from "../sections/process-section";
import { SelectedWorksSection } from "../sections/selected-works-section";
import { ServicesSection } from "../sections/services-section";
import { StatsSection } from "../sections/stats-section";
import { TestimonialsSection } from "../sections/testimonials-section";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedProjectsSection />
        <SelectedWorksSection />
        <ServicesSection />
        <ProcessSection />
        <TestimonialsSection />
        <ArticlesSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
