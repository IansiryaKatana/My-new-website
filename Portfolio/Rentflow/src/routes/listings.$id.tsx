import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { BedDouble, Bath, MapPin, ArrowLeft, CalendarDays, FileText } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSheet } from "@/components/ui/form-sheet";
import { SteppedForm } from "@/components/stepped-form";
import { supabase } from "@/integrations/supabase/client";
import { getPublicProperty } from "@/lib/properties.functions";
import { requestViewing } from "@/lib/viewings.functions";
import { submitApplication } from "@/lib/applications.functions";
import { formatAed, formatDate } from "@/lib/format";

export const Route = createFileRoute("/listings/$id")({
  head: () => ({ meta: [{ title: "Listing — Rental OS" }] }),
  component: ListingDetail,
});

function ListingDetail() {
  const { id } = Route.useParams();
  const fetch = useServerFn(getPublicProperty);
  const q = useQuery({ queryKey: ["public-property", id], queryFn: () => fetch({ data: { id } }) });

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/listings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All listings
          </Link>
          <Link to="/">
            <BrandLogo size="sm" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-8">
        {q.isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : q.data ? (
          <PropertyView p={q.data} />
        ) : (
          <p className="text-sm text-muted-foreground">Listing not found.</p>
        )}
      </section>
    </main>
  );
}

type Prop = NonNullable<Awaited<ReturnType<ReturnType<typeof useServerFn<typeof getPublicProperty>>>>>;

function PropertyView({ p }: { p: Prop }) {
  const [viewingOpen, setViewingOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="overflow-hidden rounded-lg bg-muted">
          {p.cover_image ? (
            <img src={p.cover_image} alt={p.title} className="aspect-[16/9] w-full object-cover" />
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center"><Building2 className="h-16 w-16 text-muted-foreground" /></div>
          )}
        </div>

        <h1 className="mt-6 text-3xl text-foreground">{p.title}</h1>
        <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> {p.community}
          {p.building ? ` · ${p.building}` : ""}
          {p.unit_no ? ` · Unit ${p.unit_no}` : ""}
        </p>

        <div className="mt-6 flex flex-wrap gap-4 border-y border-border py-4 text-sm">
          <Stat icon={<BedDouble className="h-4 w-4" />} label={`${p.beds} beds`} />
          <Stat icon={<Bath className="h-4 w-4" />} label={`${p.baths} baths`} />
          {p.sqft && <Stat icon={<Building2 className="h-4 w-4" />} label={`${p.sqft} sqft`} />}
          <Badge variant="secondary" className="capitalize">{p.property_type}</Badge>
          {p.furnished && <Badge variant="outline">Furnished</Badge>}
        </div>

        {p.description && (
          <div className="mt-6">
            <h2 className="text-lg text-foreground">About this property</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{p.description}</p>
          </div>
        )}
      </div>

      <aside className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardContent className="p-5">
            <div className="text-3xl text-foreground">{formatAed(Number(p.rent_yearly))}</div>
            <div className="text-xs text-muted-foreground">per year · {p.cheques_accepted} cheque{p.cheques_accepted === 1 ? "" : "s"}</div>
            {p.available_from && (
              <div className="mt-2 text-xs text-muted-foreground">Available from {formatDate(p.available_from)}</div>
            )}
            <div className="mt-5 space-y-2">
              <Button className="w-full" onClick={() => setViewingOpen(true)}>
                <CalendarDays className="mr-2 h-4 w-4" /> Request a viewing
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setApplyOpen(true)}>
                <FileText className="mr-2 h-4 w-4" /> Apply now
              </Button>
            </div>
          </CardContent>
        </Card>
      </aside>

      <ViewingDialog open={viewingOpen} onOpenChange={setViewingOpen} propertyId={p.id} />
      <ApplyDialog open={applyOpen} onOpenChange={setApplyOpen} propertyId={p.id} suggestedAmount={Number(p.rent_yearly)} suggestedCheques={p.cheques_accepted} />
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <span className="flex items-center gap-1.5 text-muted-foreground">{icon}{label}</span>;
}

function useRequireAuth(open: boolean) {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => {
    if (!open) return;
    supabase.auth.getSession().then(({ data }) => {
      const ok = !!data.session;
      setAuthed(ok);
      if (!ok) navigate({ to: "/auth" });
    });
  }, [open, navigate]);
  return authed;
}

function ViewingDialog({ open, onOpenChange, propertyId }: { open: boolean; onOpenChange: (v: boolean) => void; propertyId: string }) {
  const authed = useRequireAuth(open);
  const request = useServerFn(requestViewing);
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const mut = useMutation({
    mutationFn: () => request({ data: { property_id: propertyId, scheduled_at: scheduledAt || undefined, notes: notes || undefined } }),
    onSuccess: () => onOpenChange(false),
  });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Request a viewing"
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => mut.mutate()} disabled={mut.isPending || !authed}>{mut.isPending ? "Sending…" : "Send request"}</Button>
        </div>
      }
    >
      {authed === false ? (
        <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="when">Preferred date & time</Label>
            <Input id="when" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} placeholder="Anything we should know?" />
          </div>
          {mut.isError && <p className="text-sm text-destructive">{(mut.error as Error).message}</p>}
          {mut.isSuccess && <p className="text-sm text-primary">Request sent. We'll reach out shortly.</p>}
        </div>
      )}
    </FormSheet>
  );
}

function ApplyDialog({ open, onOpenChange, propertyId, suggestedAmount, suggestedCheques }: { open: boolean; onOpenChange: (v: boolean) => void; propertyId: string; suggestedAmount: number; suggestedCheques: number }) {
  const authed = useRequireAuth(open);
  const submit = useServerFn(submitApplication);
  const [step, setStep] = useState(0);
  const [offer, setOffer] = useState(String(suggestedAmount));
  const [cheques, setCheques] = useState(String(suggestedCheques));
  const [moveIn, setMoveIn] = useState("");
  const [occupants, setOccupants] = useState("1");
  const [employer, setEmployer] = useState("");
  const [income, setIncome] = useState("");
  const [notes, setNotes] = useState("");

  const mut = useMutation({
    mutationFn: () => submit({ data: {
      property_id: propertyId,
      offer_amount: Number(offer),
      cheques_offered: Number(cheques),
      move_in_date: moveIn || null,
      occupants: Number(occupants),
      employer: employer || null,
      monthly_income: income ? Number(income) : null,
      notes: notes || null,
    } }),
    onSuccess: () => onOpenChange(false),
  });

  return (
    <FormSheet open={open} onOpenChange={onOpenChange} title="Apply for this property">
      {authed === false ? (
        <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
      ) : (
        <SteppedForm
          stepIndex={step}
          onStepChange={setStep}
          onSubmit={() => mut.mutate()}
          submitting={mut.isPending}
          submitLabel="Submit application"
          onCancel={() => onOpenChange(false)}
          steps={[
            {
              id: "offer",
              title: "Offer",
              validate: () => Number(offer) > 0 && Number(cheques) >= 1,
              content: (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Offer (AED/yr)</Label><Input type="number" min={0} value={offer} onChange={(e) => setOffer(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Cheques</Label><Input type="number" min={1} max={12} value={cheques} onChange={(e) => setCheques(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Move-in date</Label><Input type="date" value={moveIn} onChange={(e) => setMoveIn(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Occupants</Label><Input type="number" min={1} max={20} value={occupants} onChange={(e) => setOccupants(e.target.value)} /></div>
                </div>
              ),
            },
            {
              id: "profile",
              title: "Profile",
              content: (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Employer</Label><Input value={employer} onChange={(e) => setEmployer(e.target.value)} maxLength={200} /></div>
                  <div className="space-y-1.5"><Label>Monthly income (AED)</Label><Input type="number" min={0} value={income} onChange={(e) => setIncome(e.target.value)} /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Notes</Label><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} /></div>
                  {mut.isError && <p className="text-sm text-destructive sm:col-span-2">{(mut.error as Error).message}</p>}
                  {mut.isSuccess && <p className="text-sm text-primary sm:col-span-2">Application submitted.</p>}
                </div>
              ),
            },
          ]}
        />
      )}
    </FormSheet>
  );
}
