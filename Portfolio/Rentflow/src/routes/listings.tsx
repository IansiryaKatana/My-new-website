import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Building2, BedDouble, Bath, MapPin, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { listPublicProperties } from "@/lib/properties.functions";
import { formatAed } from "@/lib/format";

export const Route = createFileRoute("/listings")({
  head: () => ({
    meta: [
      { title: "Listings — Rental OS" },
      { name: "description", content: "Browse available rental properties in Dubai." },
    ],
  }),
  component: ListingsPage,
});

function ListingsPage() {
  const fetch = useServerFn(listPublicProperties);
  const q = useQuery({ queryKey: ["public-listings"], queryFn: () => fetch() });

  return (
    <main className="min-h-screen bg-mesh">
      <header className="border-b border-border/70 bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/">
            <BrandLogo size="md" />
          </Link>
          <Link to="/auth"><Button size="sm" variant="cta">Sign in</Button></Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Live listings</p>
        <h1 className="mt-2 text-4xl text-foreground md:text-5xl">Available now</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">Browse current listings and request a viewing in one click.</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {q.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 w-full" />)
          ) : q.data && q.data.length > 0 ? (
            q.data.map((p) => (
              <Link key={p.id} to="/listings/$id" params={{ id: p.id }}>
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-elegant">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                    {p.cover_image ? (
                      <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <Building2 className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-card-foreground">{p.title}</h3>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {p.community}
                          {p.building ? ` · ${p.building}` : ""}
                        </p>
                      </div>
                      <Badge variant="secondary" className="capitalize">{p.property_type}</Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" /> {p.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {p.baths}</span>
                      {p.sqft && <span>{p.sqft} sqft</span>}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-base text-foreground">{formatAed(Number(p.rent_yearly))}/yr</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No listings available yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
