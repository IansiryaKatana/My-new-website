import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Workflow, Users, FileCheck, BarChart3, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBranding } from "@/lib/branding/BrandingProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EmirAxis — The command center for UAE workforce operations" },
      { name: "description", content: "Manage clients, job orders, candidates, visas, deployment, attendance, payroll and WPS compliance from one premium platform." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Users, title: "Worker lifecycle", body: "Source, document, visa, medical, deploy, renew, offboard — one timeline per worker." },
  { icon: Workflow, title: "Job orders", body: "Capture client manpower requests and track fulfilment from sourcing to deployment." },
  { icon: FileCheck, title: "Compliance-first", body: "MoHRE permits, contracts, accommodation and WPS wage processing as core modules." },
  { icon: BarChart3, title: "Operational visibility", body: "Live dashboards for deployment, billing, renewals and worker welfare." },
  { icon: ShieldCheck, title: "Enterprise security", body: "Row-level security, audit logs, role-based access — admin, manager, recruiter, accountant." },
  { icon: Smartphone, title: "Mobile & PWA", body: "Install on any device. Field-ready interfaces for recruiters and site supervisors." },
];

function Landing() {
  const { branding } = useBranding();
  return (
    <div className="min-h-screen bg-gradient-sand">
      <header className="sticky top-0 z-40 glass border-b border-border/40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-soft">
              <span className="font-display text-lg">{branding.short_name.charAt(0)}</span>
            </div>
            <span className="font-semibold tracking-tight">{branding.company_name}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90"><Link to="/login">Get started</Link></Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Built for UAE staffing agencies
              </span>
              <h1 className="mt-6 text-balance font-display text-5xl leading-[1.05] text-primary sm:text-6xl lg:text-7xl">
                The operations platform for modern staffing agencies.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
                {branding.tagline}. From client job orders to WPS payroll — every worker, every document, every deployment in one place.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-elegant">
                  <Link to="/login">Start free trial <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-72 max-w-4xl rounded-full bg-gradient-gold opacity-20 blur-3xl" />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="group rounded-2xl border bg-card p-6 shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-elegant">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/8 text-primary transition-smooth group-hover:bg-gold group-hover:text-gold-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
          <div className="rounded-3xl bg-gradient-primary p-10 text-center shadow-elegant sm:p-16">
            <h2 className="font-display text-3xl text-primary-foreground sm:text-4xl">Ready to run your agency like a SaaS company?</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">Get the founder set up as admin in under a minute.</p>
            <Button asChild size="lg" className="mt-8 bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">
              <Link to="/login">Create your workspace <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} {branding.company_name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
