import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, LayoutDashboard, Users, ArrowRight, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rentflow — Operating System for Dubai Rental Agencies" },
      {
        name: "description",
        content:
          "Manage the full rental journey — listings, viewings, applications, contracts, payments and tenants — in one platform built for Dubai agencies.",
      },
      { property: "og:title", content: "Rentflow" },
      {
        property: "og:description",
        content: "From listing to renewal — a single operating system for your rental agency.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="min-h-screen bg-mesh">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/">
            <BrandLogo size="md" />
          </Link>
          <nav className="flex items-center gap-3">
            <Link to="/listings">
              <Button variant="ghost" size="sm">
                Listings
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="cta" size="sm">
                Get started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.97]" />
        <div className="absolute inset-0 bg-radial-gold" />
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-watermelon/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-6 py-28 text-center md:py-36">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-gold" />
            Built for Dubai&apos;s rental market
          </div>
          <h1 className="text-balance text-5xl tracking-tight text-white md:text-7xl">
            Run your agency on{" "}
            <span className="text-gradient-gold">one brilliant</span> platform
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/75">
            Replace the WhatsApp chaos. Track every viewing, application, contract,
            Ejari, cheque and tenant in one place — designed for how Dubai rentals
            actually work.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/listings">
              <Button size="lg" variant="gold">
                Browse listings
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="cta">
                Open the platform <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Why Rentflow</p>
          <h2 className="mt-2 text-3xl text-foreground md:text-4xl">Everything your team touches, connected</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<LayoutDashboard className="h-5 w-5" />}
            accent="gold"
            title="Agency dashboard"
            body="Pipeline, payments and action queue for owners, agents and accountants."
          />
          <FeatureCard
            icon={<Users className="h-5 w-5" />}
            accent="watermelon"
            title="Tenant portal"
            body="Tenants apply, upload documents, sign and pay — without a single phone call."
          />
          <FeatureCard
            icon={<Building2 className="h-5 w-5" />}
            accent="charcoal"
            title="Stripe-ready payments"
            body="Connect your Stripe account and collect rent, deposits and renewals online."
          />
        </div>
      </section>

      <section className="border-t border-border bg-card/50 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          <h2 className="text-3xl text-foreground">Ready to modernise your agency?</h2>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Join agencies using Rentflow to move faster from lead to lease.
          </p>
          <Link to="/auth" className="mt-8">
            <Button size="lg" variant="cta">
              Start free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  body,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  accent: "gold" | "watermelon" | "charcoal";
}) {
  const accentClass =
    accent === "gold"
      ? "bg-gold-gradient text-ink"
      : accent === "watermelon"
        ? "bg-watermelon-gradient text-white"
        : "bg-primary text-primary-foreground";

  return (
    <div className="group rounded-2xl border border-border bg-card p-6 shadow-elegant transition-transform hover:-translate-y-1">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentClass} shadow-sm`}>
        {icon}
      </div>
      <h3 className="mt-5 text-lg text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
