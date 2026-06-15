import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { LogOut, Home, FileText, Wrench, CalendarDays, Plus, Search, CreditCard, User, Upload, Repeat, MessageSquareWarning } from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";
import { Link } from "@tanstack/react-router";
import { respondRenewal } from "@/lib/renewals.functions";
import { cancelViewingAsTenant } from "@/lib/viewings.functions";
import { uploadTenantPaymentProof } from "@/lib/payments.functions";
import { createComplaint } from "@/lib/complaints.functions";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSheet } from "@/components/ui/form-sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { getTenantHome } from "@/lib/tenant.functions";
import { createTicket } from "@/lib/maintenance.functions";
import { addApplicationDocument } from "@/lib/applications.functions";
import { formatAed, formatDate } from "@/lib/format";
import { createTenantCheckoutSession } from "@/lib/payments.functions";
import { getPublicPaymentsConfig } from "@/lib/stripe.functions";

export const Route = createFileRoute("/_authenticated/portal/")({
  head: () => ({ meta: [{ title: "My Portal — Rental OS" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    payment: typeof search.payment === "string" ? search.payment : undefined,
  }),
  component: PortalPage,
});

function PortalPage() {
  const navigate = useNavigate();
  const { payment: paymentNotice } = Route.useSearch();
  const fetch = useServerFn(getTenantHome);
  const fetchPaymentsConfig = useServerFn(getPublicPaymentsConfig);
  const q = useQuery({ queryKey: ["tenant-home"], queryFn: () => fetch() });
  const paymentsConfigQ = useQuery({
    queryKey: ["publicPaymentsConfig"],
    queryFn: () => fetchPaymentsConfig(),
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/">
            <BrandLogo size="md" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/listings">
              <Button variant="ghost" size="sm">
                <Search className="mr-2 h-4 w-4" /> Browse listings
              </Button>
            </Link>
            <Link to="/portal/profile">
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Profile">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            <NotificationBell />
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        {paymentNotice === "success" && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground">
            Payment submitted successfully. It may take a moment to appear as paid.
          </div>
        )}
        {paymentNotice === "cancelled" && (
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Payment was cancelled. You can try again when ready.
          </div>
        )}
        {q.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : q.isError ? (
          <p className="text-sm text-destructive">{(q.error as Error).message}</p>
        ) : q.data ? (
          <>
            <Section title="My tenancies" icon={<Home className="h-4 w-4" />}>
              {q.data.tenancies.length === 0 ? (
                <Empty text="No tenancies yet." />
              ) : (
                q.data.tenancies.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-md border border-border p-4">
                    <div>
                      <div className="font-medium text-foreground">{t.property.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.property.community}
                        {t.property.unit_no ? ` · Unit ${t.property.unit_no}` : ""}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {formatDate(t.start_date)} → {formatDate(t.end_date)} · {t.cheques} cheques
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={t.status} />
                      <div className="mt-1 text-sm font-semibold text-foreground">
                        {formatAed(t.annual_rent)} / yr
                      </div>
                    </div>
                  </div>
                ))
              )}
            </Section>

            <Section title="My applications" icon={<FileText className="h-4 w-4" />}>
              {q.data.applications.length === 0 ? (
                <Empty text="No applications submitted." />
              ) : (
                q.data.applications.map((a) => (
                  <div key={a.id} className="rounded-md border border-border p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link to="/portal/applications/$id" params={{ id: a.id }} className="text-sm font-medium text-foreground hover:underline">
                          {a.property.title}
                        </Link>
                        <div className="text-xs text-muted-foreground">{a.property.community} · {formatAed(a.offer_amount)}</div>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <UploadDocButton applicationId={a.id} />
                      <Button size="sm" variant="ghost" asChild>
                        <Link to="/portal/applications/$id" params={{ id: a.id }}>View details</Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Section>

            <Section title="Upcoming viewings" icon={<CalendarDays className="h-4 w-4" />}>
              {q.data.viewings.length === 0 ? (
                <Empty text="No viewings scheduled." />
              ) : (
                q.data.viewings.map((v) => (
                  <ViewingRow key={v.id} id={v.id} title={v.property.title} scheduledAt={v.scheduled_at} status={v.status} />
                ))
              )}
            </Section>

            <Section title="Upcoming payments" icon={<CreditCard className="h-4 w-4" />}>
              {q.data.upcoming_payments.length === 0 ? (
                <Empty text="No upcoming payments." />
              ) : (
                q.data.upcoming_payments.map((p) => (
                  <PaymentRow
                    key={p.id}
                    payment={p}
                    onlineEnabled={paymentsConfigQ.data?.online_payments_enabled ?? false}
                  />
                ))
              )}
            </Section>

            {q.data.payment_history.length > 0 && (
              <Section title="Payment history" icon={<FileText className="h-4 w-4" />}>
                {q.data.payment_history.map((p) => (
                  <div key={p.id} className="flex flex-col gap-1 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm text-foreground">{p.property_title}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(p.due_date)} · {p.payment_type}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{formatAed(p.amount)}</span>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </Section>
            )}

            {q.data.renewals.length > 0 && (
              <Section title="Renewal offers" icon={<Repeat className="h-4 w-4" />}>
                {q.data.renewals.map((r) => (
                  <RenewalRow key={r.id} renewal={r} />
                ))}
              </Section>
            )}

            <Section
              title="Maintenance"
              icon={<Wrench className="h-4 w-4" />}
              action={q.data.tenancies.length > 0 ? <NewTicketButton tenancies={q.data.tenancies.map((t) => ({ id: t.id, label: t.property.title }))} /> : null}
            >
              {q.data.open_tickets.length === 0 ? (
                <Empty text="No open tickets." />
              ) : (
                q.data.open_tickets.map((t) => (
                  <Row key={t.id} title={t.subject} subtitle={formatDate(t.created_at)} badge={t.status} />
                ))
              )}
            </Section>

            <Section
              title="Complaints"
              icon={<MessageSquareWarning className="h-4 w-4" />}
              action={q.data.tenancies.length > 0 ? <NewComplaintButton tenancies={q.data.tenancies.map((t) => ({ id: t.id, label: t.property.title }))} /> : null}
            >
              {q.data.complaints.length === 0 ? (
                <Empty text="No complaints filed." />
              ) : (
                q.data.complaints.map((c) => (
                  <Row key={c.id} title={c.subject} subtitle={formatDate(c.created_at)} badge={c.status} />
                ))
              )}
            </Section>
          </>
        ) : null}
      </main>
    </div>
  );
}

function Section({ title, icon, children, action }: { title: string; icon: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}

function PaymentRow({
  payment,
  onlineEnabled,
}: {
  payment: { id: string; due_date: string; amount: number; status: string; payment_type: string; property_title: string; proof_url?: string | null };
  onlineEnabled: boolean;
}) {
  const qc = useQueryClient();
  const checkout = useServerFn(createTenantCheckoutSession);
  const uploadProof = useServerFn(uploadTenantPaymentProof);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const canPayOnline = onlineEnabled && ["scheduled", "pending"].includes(payment.status);

  const payMut = useMutation({
    mutationFn: async () => {
      setError(null);
      const result = await checkout({ data: { payment_id: payment.id } });
      if (!result.ready) {
        throw new Error(result.message);
      }
      window.location.href = result.checkout_url;
    },
    onError: (err) => setError((err as Error).message),
  });

  return (
    <div className="rounded-md border border-border p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-foreground">
            {payment.payment_type} — {payment.property_title}
          </div>
          <div className="text-xs text-muted-foreground">Due {formatDate(payment.due_date)}</div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-foreground">{formatAed(payment.amount)}</span>
          <StatusBadge status={payment.status} />
          {canPayOnline && (
            <Button size="sm" onClick={() => payMut.mutate()} disabled={payMut.isPending}>
              <CreditCard className="mr-2 h-3.5 w-3.5" />
              {payMut.isPending ? "Redirecting…" : "Pay online"}
            </Button>
          )}
          {["scheduled", "pending"].includes(payment.status) && (
            <label>
              <Button size="sm" variant="outline" asChild disabled={uploading}>
                <span><Upload className="mr-2 h-3.5 w-3.5" /> Upload proof</span>
              </Button>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  setError(null);
                  try {
                    const { data: sess } = await supabase.auth.getSession();
                    const uid = sess.session?.user.id;
                    if (!uid) throw new Error("Not signed in");
                    const path = `${uid}/proofs/${payment.id}/${Date.now()}_${file.name}`;
                    const { error: upErr } = await supabase.storage.from("tenant-docs").upload(path, file);
                    if (upErr) throw upErr;
                    await uploadProof({ data: { payment_id: payment.id, proof_path: path } });
                    qc.invalidateQueries({ queryKey: ["tenant-home"] });
                  } catch (err) {
                    setError((err as Error).message);
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            </label>
          )}
        </div>
      </div>
      {payment.proof_url && <p className="mt-2 text-xs text-muted-foreground">Proof uploaded — awaiting review</p>}
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ViewingRow({ id, title, scheduledAt, status }: { id: string; title: string; scheduledAt: string | null; status: string }) {
  const qc = useQueryClient();
  const cancel = useServerFn(cancelViewingAsTenant);
  const mut = useMutation({
    mutationFn: () => cancel({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant-home"] }),
  });
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{scheduledAt ? formatDate(scheduledAt) : "Awaiting confirmation"}</div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        {["requested", "confirmed"].includes(status) && (
          <Button size="sm" variant="ghost" onClick={() => mut.mutate()} disabled={mut.isPending}>Cancel</Button>
        )}
      </div>
    </div>
  );
}

function RenewalRow({ renewal }: { renewal: { id: string; proposed_rent: number; proposed_cheques: number; notes: string | null; property_title: string } }) {
  const qc = useQueryClient();
  const respond = useServerFn(respondRenewal);
  const mut = useMutation({
    mutationFn: (status: "accepted" | "declined") => respond({ data: { id: renewal.id, status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant-home"] }),
  });
  return (
    <div className="rounded-md border border-border p-3">
      <div className="text-sm font-medium">{renewal.property_title}</div>
      <div className="text-xs text-muted-foreground">{formatAed(renewal.proposed_rent)}/yr · {renewal.proposed_cheques} cheques</div>
      {renewal.notes && <p className="mt-1 text-xs text-muted-foreground">{renewal.notes}</p>}
      <div className="mt-2 flex gap-2">
        <Button size="sm" onClick={() => mut.mutate("accepted")} disabled={mut.isPending}>Accept</Button>
        <Button size="sm" variant="outline" onClick={() => mut.mutate("declined")} disabled={mut.isPending}>Decline</Button>
      </div>
    </div>
  );
}

function NewComplaintButton({ tenancies }: { tenancies: Array<{ id: string; label: string }> }) {
  const qc = useQueryClient();
  const create = useServerFn(createComplaint);
  const [open, setOpen] = useState(false);
  const [tenancyId, setTenancyId] = useState(tenancies[0]?.id ?? "");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const mut = useMutation({
    mutationFn: () => create({ data: { tenancy_id: tenancyId, subject, description: description || null, severity: "medium" } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tenant-home"] });
      setOpen(false);
      setSubject("");
      setDescription("");
    },
  });

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> File complaint</Button>
      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="File a complaint"
        footer={
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => mut.mutate()} disabled={mut.isPending || !subject}>Submit</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Tenancy</Label>
            <Select value={tenancyId} onValueChange={setTenancyId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{tenancies.map((t) => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} /></div>
          <div className="space-y-1.5"><Label>Description</Label><Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        </div>
      </FormSheet>
    </>
  );
}

function Row({ title, subtitle, badge, right }: { title: string; subtitle?: string; badge?: string; right?: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border p-3">
      <div>
        <div className="text-sm text-foreground">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-3">
        {right && <span className="text-sm text-foreground">{right}</span>}
        {badge && <StatusBadge status={badge} />}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground">{text}</p>;
}

function NewTicketButton({ tenancies }: { tenancies: Array<{ id: string; label: string }> }) {
  const qc = useQueryClient();
  const create = useServerFn(createTicket);
  const [open, setOpen] = useState(false);
  const [tenancyId, setTenancyId] = useState(tenancies[0]?.id ?? "");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("plumbing");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [description, setDescription] = useState("");

  const mut = useMutation({
    mutationFn: () => create({ data: { tenancy_id: tenancyId, subject, category, priority, description: description || null } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tenant-home"] });
      setOpen(false);
      setSubject("");
      setDescription("");
    },
  });

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> New ticket
      </Button>
      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="Report a maintenance issue"
        footer={
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => mut.mutate()} disabled={mut.isPending || !subject || !tenancyId}>
              {mut.isPending ? "Submitting…" : "Submit"}
            </Button>
          </div>
        }
      >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Property</Label>
              <Select value={tenancyId} onValueChange={setTenancyId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tenancies.map((t) => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["plumbing", "electrical", "ac", "appliance", "pest", "general"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["low", "medium", "high", "urgent"] as const).map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} />
            </div>
            {mut.isError && <p className="text-sm text-destructive">{(mut.error as Error).message}</p>}
          </div>
      </FormSheet>
    </>
  );
}

function UploadDocButton({ applicationId }: { applicationId: string }) {
  const qc = useQueryClient();
  const recordDoc = useServerFn(addApplicationDocument);
  const [open, setOpen] = useState(false);
  const [docType, setDocType] = useState<"emirates_id" | "passport" | "visa" | "salary_certificate" | "bank_statement" | "trade_license" | "other">("emirates_id");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload() {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id;
      if (!uid) throw new Error("Not signed in");
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${uid}/${applicationId}/${Date.now()}_${safeName}`;
      const { error: upErr } = await supabase.storage.from("tenant-docs").upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      await recordDoc({ data: { application_id: applicationId, doc_type: docType, file_path: path, file_name: file.name } });
      qc.invalidateQueries({ queryKey: ["tenant-home"] });
      setOpen(false);
      setFile(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Upload className="mr-2 h-3.5 w-3.5" /> Upload document
      </Button>
      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="Upload application document"
        footer={
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={upload} disabled={busy || !file}>{busy ? "Uploading…" : "Upload"}</Button>
          </div>
        }
      >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Document type</Label>
              <Select value={docType} onValueChange={(v) => setDocType(v as typeof docType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["emirates_id", "passport", "visa", "salary_certificate", "bank_statement", "trade_license", "other"] as const).map((t) => (
                    <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>File</Label>
              <Input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
          </div>
      </FormSheet>
    </>
  );
}
