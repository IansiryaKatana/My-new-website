import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/AboutSection";
import { ActivitySection } from "@/components/ActivitySection";
import { FooterCTA } from "@/components/FooterCTA";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { IntroSection } from "@/components/IntroSection";
import { ProgramShowcase } from "@/components/ProgramShowcase";
import { ServiceSessionSection } from "@/components/ServiceSessionSection";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="page-shell">
      <Header />
      <HeroSection />
      <IntroSection />
      <AboutSection />
      <ServiceSessionSection />
      <ProgramShowcase />
      <ActivitySection />
      <FooterCTA />
    </main>
  );
}
