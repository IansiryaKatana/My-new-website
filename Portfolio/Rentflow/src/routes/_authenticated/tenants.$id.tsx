import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Phone, UserCheck, Globe, FileText, ExternalLink } from "lucide-react";
import { StaffShell } from "@/components/staff-shell";
import { PageBack } from "@/components/page-back";
import { UserAvatar } from "@/components/user-avatar";
import { DocumentsList } from "@/components/documents-list";
import { MissingDocsMatrix } from "@/components/missing-docs-matrix";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTenancyJourney, updateTenancy } from "@/lib/tenancies.functions";
import { formatAed, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/tenants/$id")({
  head: () => ({ meta: [{ title: "Tenancy — Rentflow" }] }),
  component: TenantDetailPage,
});

type Journey = NonNullable<Awaited<ReturnType<typeof getTenancyJourney>>>;

function TenantDetailPage() {
  const { id } = Route.useParams();
  const fetch = useServerFn(getTenancyJourney);
  const q = useQuery({ queryKey: ["tenancyJourney", id], queryFn: () => fetch({ data: { id } }) });

  return (
    <StaffShell title="Tenancy 360°">
      <PageBack to="/tenants" label="Back to tenants" />

      {q.isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : q.isError ? (
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      ) : q.data ? (
        <JourneyBody journey={q.data as Journey} tenancyId={id} />
      ) : (
        <p className="text-sm text-muted-foreground">Tenancy not found.</p>
      )}
    </StaffShell>
  );
}

function JourneyBody({ journey, tenancyId }: { journey: Journey; tenancyId: string }) {
  const qc = useQueryClient();
  const update = useServerFn(updateTenancy);
  const moveInMut = useMutation({
    mutationFn: () => update({ data: { id: tenancyId, status: "active" } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tenancyJourney", tenancyId] }),
  });

  const tenancy = journey.tenancy as Record<string, unknown> | undefined;
  const tenant = journey.tenant as {
    id?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    avatar_url?: string | null;
    emirates_id?: string | null;
    nationality?: string | null;
  } | undefined;
  const property = journey.property as { id?: string; title?: string; community?: string; building?: string | null; unit_no?: string | null } | undefined;
  const payments = (journey.payments ?? []) as Array<{ id: string; due_date: string; amount: number; status: string }>;
  const tickets = (journey.tickets ?? []) as Array<{ id: string; subject: string; status: string }>;
  const renewals = (journey.renewals ?? []) as Array<{ id: string; status: string; proposed_rent: number; proposed_cheques: number; offered_at: string | null }>;
  const complaints = (journey.complaints ?? []) as Array<{ id: string; subject: string; status: string; severity: string; created_at: string }>;
  const documents = (journey.documents ?? []) as Array<{ id: string; doc_type: string; file_path: string; file_name: string | null; verified: boolean; created_at: string }>;
  const applications = (journey.applications ?? []) as Array<{ id: string; status: string; offer_amount: number; created_at: string; properties?: { title?: string; community?: string } | null }>;
  const applicationId = tenancy?.application_id as string | undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
            <UserAvatar
              name={tenant?.full_name}
              email={tenant?.email}
              src={tenant?.avatar_url}
              className="h-16 w-16"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {tenant?.id ? (
                  <Link to="/people/$id" params={{ id: tenant.id }} className="text-lg font-semibold text-foreground hover:underline">
                    {tenant.full_name ?? "Tenant"}
                  </Link>
                ) : (
                  <h2 className="text-lg font-semibold">{tenant?.full_name ?? "Tenant"}</h2>
                )}
                {tenancy?.status ? <StatusBadge status={tenancy.status} /> : <span>—</span>}
              </div>
              <div className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
                {tenant?.email && <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{tenant.email}</span>}
                {tenant?.phone && <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{tenant.phone}</span>}
                {tenant?.emirates_id && <span className="flex items-center gap-2"><UserCheck className="h-3.5 w-3.5" />{tenant.emirates_id}</span>}
                {tenant?.nationality && <span className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" />{tenant.nationality}</span>}
              </div>
              {tenant?.id && (
                <Button variant="link" className="mt-2 h-auto p-0" asChild>
                  <Link to="/people/$id" params={{ id: tenant.id }}>
                    <ExternalLink className="mr-1 h-3.5 w-3.5" /> View full profile
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current lease</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {property?.id ? (
              <Link to="/properties/$id" params={{ id: property.id }} className="font-medium text-foreground hover:underline">
                {property.title}
              </Link>
            ) : (
              <div className="font-medium">{property?.title}</div>
            )}
            <p className="text-muted-foreground">
              {property?.community}
              {property?.building ? ` · ${property.building}` : ""}
              {property?.unit_no ? ` · Unit ${property.unit_no}` : ""}
            </p>
            <p className="mt-2">
              {tenancy?.start_date ? formatDate(String(tenancy.start_date)) : "—"} →{" "}
              {tenancy?.end_date ? formatDate(String(tenancy.end_date)) : "—"}
            </p>
            <p className="mt-1 font-medium text-foreground">{formatAed(Number(tenancy?.annual_rent ?? 0))}/yr · {String(tenancy?.cheques ?? "—")} cheques</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div><span className="text-muted-foreground">Ejari:</span> {String(tenancy?.ejari_number ?? "—")}</div>
              <div><span className="text-muted-foreground">Ejari status:</span> {String(tenancy?.ejari_status ?? "—")}</div>
            </div>
            {tenancy?.contract_url && (
              <a href={String(tenancy.contract_url)} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                <FileText className="h-3.5 w-3.5" /> View contract
              </a>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Submitted documents</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <MissingDocsMatrix documents={documents} />
            <DocumentsList
              documents={documents}
              applicationId={applicationId}
              allowVerify
              invalidateKey={["tenancyJourney", tenancyId]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Payments</CardTitle></CardHeader>
          <CardContent className="divide-y divide-border">
            {payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments.</p>
            ) : (
              payments.map((p) => (
                <Link key={p.id} to="/payments/$id" params={{ id: p.id }} className="flex justify-between py-2 text-sm hover:bg-muted/30">
                  <span>{formatDate(p.due_date)}</span>
                  <span>{formatAed(p.amount)}</span>
                  <StatusBadge status={p.status} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4">
        {tenancy?.status === "upcoming" && (
          <Card>
            <CardHeader><CardTitle className="text-base">Move-in</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">Approve move-in to activate the tenancy.</p>
              <Button className="w-full" onClick={() => moveInMut.mutate()} disabled={moveInMut.isPending}>
                {moveInMut.isPending ? "Approving…" : "Approve move-in"}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">Applications</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications.</p>
            ) : (
              applications.map((a) => (
                <Link key={a.id} to="/applications/$id" params={{ id: a.id }} className="block rounded-lg border border-border p-2 text-sm hover:bg-muted/40">
                  <div className="font-medium">{a.properties?.title ?? "Application"}</div>
                  <div className="text-xs text-muted-foreground">{a.status} · {formatAed(a.offer_amount)}</div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Renewals</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {renewals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No renewal offers.</p>
            ) : (
              renewals.map((r) => (
                <div key={r.id} className="rounded-lg border border-border p-2 text-sm">
                  <div className="font-medium">{formatAed(r.proposed_rent)}/yr · {r.proposed_cheques} cheques</div>
                  <div className="text-xs text-muted-foreground">{r.status}{r.offered_at ? ` · ${formatDate(r.offered_at)}` : ""}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Complaints</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {complaints.length === 0 ? (
              <p className="text-sm text-muted-foreground">No complaints.</p>
            ) : (
              complaints.map((c) => (
                <Link key={c.id} to="/complaints/$id" params={{ id: c.id }} className="block rounded-lg border border-border p-2 text-sm hover:bg-muted/40">
                  <div className="font-medium">{c.subject}</div>
                  <div className="text-xs text-muted-foreground">{c.status} · {c.severity}</div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Maintenance</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {tickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tickets.</p>
            ) : (
              tickets.map((t) => (
                <Link key={t.id} to="/maintenance/$id" params={{ id: t.id }} className="block rounded-lg border border-border p-2 text-sm hover:bg-muted/40">
                  <div className="font-medium">{t.subject}</div>
                  <div className="text-xs text-muted-foreground">{t.status}</div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
