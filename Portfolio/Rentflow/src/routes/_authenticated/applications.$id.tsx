import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { UserCheck, Mail, Phone, Send, Download, FileDown } from "lucide-react";
import { PageBack } from "@/components/page-back";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSheet } from "@/components/ui/form-sheet";
import { StaffShell } from "@/components/staff-shell";
import { assignApplicationAgent, getApplication, updateApplicationStatus } from "@/lib/applications.functions";
import {
  downloadApplicationContractPdf,
  downloadApplicationSummaryPdf,
  sendApplicationContract,
  sendTemplatedEmail,
} from "@/lib/communications.functions";
import { createTenancy } from "@/lib/tenancies.functions";
import { downloadBase64File } from "@/lib/download";
import { MissingDocsMatrix } from "@/components/missing-docs-matrix";
import { DocumentsList } from "@/components/documents-list";
import { UserAvatar } from "@/components/user-avatar";
import { listApplicationMessages, sendApplicationMessage } from "@/lib/messages.functions";
import { listStaffAgents } from "@/lib/team.functions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatAed, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/applications/$id")({
  head: () => ({ meta: [{ title: "Application — Rental OS" }] }),
  component: ApplicationDetailPage,
});

function ApplicationDetailPage() {
  const { id } = Route.useParams();
  const fetch = useServerFn(getApplication);
  const q = useQuery({ queryKey: ["application", id], queryFn: () => fetch({ data: { id } }) });

  return (
    <StaffShell title="Application">
      <PageBack to="/applications" label="Back to pipeline" />

      {q.isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : q.isError ? (
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      ) : q.data ? (
        <Body app={q.data} />
      ) : null}
    </StaffShell>
  );
}

type App = Awaited<ReturnType<typeof getApplication>>;

function Body({ app }: { app: App }) {
  const qc = useQueryClient();
  const updateStatus = useServerFn(updateApplicationStatus);
  const statusMut = useMutation({
    mutationFn: (status: string) => updateStatus({ data: { id: app.id, status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["application", app.id] }),
  });

  const property = (app as unknown as { properties: { id: string; title: string; community: string; building?: string | null; unit_no?: string | null; rent_yearly: number } | null }).properties;
  const tenant = (app as unknown as { profiles: { id?: string; full_name: string | null; email: string | null; phone: string | null; emirates_id: string | null; avatar_url?: string | null; nationality?: string | null } | null }).profiles;
  const docs = (app as unknown as { documents: Array<{ id: string; doc_type: string; file_path: string; file_name: string | null; verified: boolean; created_at: string }> }).documents;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tenant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <UserAvatar name={tenant?.full_name} email={tenant?.email} src={tenant?.avatar_url} className="h-12 w-12" />
              <div>
                {tenant?.id ? (
                  <Link to="/people/$id" params={{ id: tenant.id }} className="text-lg text-foreground hover:underline">
                    {tenant.full_name ?? "—"}
                  </Link>
                ) : (
                  <div className="text-lg text-foreground">{tenant?.full_name ?? "—"}</div>
                )}
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {tenant?.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{tenant.email}</span>}
                  {tenant?.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{tenant.phone}</span>}
                  {tenant?.emirates_id && <span className="flex items-center gap-1"><UserCheck className="h-3.5 w-3.5" />{tenant.emirates_id}</span>}
                  {tenant?.nationality && <span>{tenant.nationality}</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <Field label="Offer amount" value={formatAed(Number(app.offer_amount))} />
              <Field label="Cheques" value={String(app.cheques_offered)} />
              <Field label="Occupants" value={String(app.occupants)} />
              <Field label="Move-in" value={app.move_in_date ? formatDate(app.move_in_date) : "—"} />
              <Field label="Employer" value={app.employer ?? "—"} />
              <Field label="Monthly income" value={app.monthly_income ? formatAed(Number(app.monthly_income)) : "—"} />
              <Field label="Submitted" value={formatDate(app.created_at)} />
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <StatusBadge status={app.status} className="mt-1" />
              </div>
            </div>
            {app.notes && (
              <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                {app.notes}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Documents checklist</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <MissingDocsMatrix
              documents={docs}
              applicationId={app.id}
              tenantUserId={app.tenant_id as string}
              allowUpload
              invalidateKeys={[["application", app.id]]}
            />
            <DocumentsList documents={docs} applicationId={app.id} allowVerify invalidateKey={["application", app.id]} />
          </CardContent>
        </Card>

        <ApplicationMessages applicationId={app.id} />
      </div>

      <aside className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Property</CardTitle></CardHeader>
          <CardContent>
            <div className="text-foreground">{property?.title}</div>
            <div className="text-xs text-muted-foreground">
              {property?.community}
              {property?.building ? ` · ${property.building}` : ""}
              {property?.unit_no ? ` · Unit ${property.unit_no}` : ""}
            </div>
            <div className="mt-2 text-sm">List price: {formatAed(Number(property?.rent_yearly ?? 0))}/yr</div>
          </CardContent>
        </Card>

        <AgentCard applicationId={app.id} agentId={(app as { agent_id?: string | null }).agent_id} />
        <CommunicationsCard appId={app.id} tenantEmail={tenant?.email} />

        <Card>
          <CardHeader><CardTitle className="text-base">Decision</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(["docs_review", "contract_sent", "approved"] as const).map((s) => (
              <Button key={s} variant="outline" size="sm" className="w-full justify-start" onClick={() => statusMut.mutate(s)} disabled={statusMut.isPending}>
                Move to {s.replace("_", " ")}
              </Button>
            ))}
            <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={() => statusMut.mutate("rejected")} disabled={statusMut.isPending}>
              Reject
            </Button>
          </CardContent>
        </Card>

        {app.status === "approved" && property && tenant && (
          <CreateTenancyCard
            propertyId={property.id}
            tenantId={app.tenant_id as string}
            applicationId={app.id}
            offerAmount={Number(app.offer_amount)}
            chequesOffered={app.cheques_offered}
            moveInDate={app.move_in_date}
          />
        )}
      </aside>
    </div>
  );
}

function AgentCard({ applicationId, agentId }: { applicationId: string; agentId?: string | null }) {
  const qc = useQueryClient();
  const fetchAgents = useServerFn(listStaffAgents);
  const assign = useServerFn(assignApplicationAgent);
  const agentsQ = useQuery({ queryKey: ["staffAgents"], queryFn: () => fetchAgents() });
  const mut = useMutation({
    mutationFn: (id: string | null) => assign({ data: { id: applicationId, agent_id: id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["application", applicationId] }),
  });

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Assigned agent</CardTitle></CardHeader>
      <CardContent>
        <Select value={agentId ?? "none"} onValueChange={(v) => mut.mutate(v === "none" ? null : v)}>
          <SelectTrigger><SelectValue placeholder="Select agent" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Unassigned</SelectItem>
            {(agentsQ.data ?? []).map((a) => (
              <SelectItem key={a.id} value={a.id}>{a.full_name ?? a.email ?? a.id}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

function ApplicationMessages({ applicationId }: { applicationId: string }) {
  const qc = useQueryClient();
  const fetch = useServerFn(listApplicationMessages);
  const send = useServerFn(sendApplicationMessage);
  const q = useQuery({ queryKey: ["app-messages", applicationId], queryFn: () => fetch({ data: { application_id: applicationId } }) });
  const [body, setBody] = useState("");

  const mut = useMutation({
    mutationFn: () => send({ data: { application_id: applicationId, body } }),
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["app-messages", applicationId] });
    },
  });

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Messages</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {(q.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          q.data!.map((m) => {
            const author = m.profiles as { full_name?: string } | null;
            return (
              <div key={m.id} className="rounded-lg border border-border p-3 text-sm">
                <div className="text-xs text-muted-foreground">{author?.full_name ?? "User"} · {formatDate(m.created_at)}</div>
                <p className="mt-1">{m.body}</p>
              </div>
            );
          })
        )}
        <Textarea rows={2} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write to tenant…" />
        <Button size="sm" onClick={() => mut.mutate()} disabled={mut.isPending || !body.trim()}>Send message</Button>
      </CardContent>
    </Card>
  );
}

function CommunicationsCard({ appId, tenantEmail }: { appId: string; tenantEmail?: string | null }) {
  const qc = useQueryClient();
  const sendContract = useServerFn(sendApplicationContract);
  const sendEmail = useServerFn(sendTemplatedEmail);
  const dlContract = useServerFn(downloadApplicationContractPdf);
  const dlSummary = useServerFn(downloadApplicationSummaryPdf);
  const [message, setMessage] = useState<string | null>(null);

  const contractMut = useMutation({
    mutationFn: () => sendContract({ data: { application_id: appId } }),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ["application", appId] });
      setMessage(result.emailed ? "Contract emailed to tenant." : (result.message ?? "Contract PDF generated."));
    },
    onError: (e) => setMessage((e as Error).message),
  });

  const docsMut = useMutation({
    mutationFn: () => sendEmail({ data: { template_key: "documents_requested", application_id: appId } }),
    onSuccess: (result) => setMessage(result.sent ? "Documents request sent." : (result.message ?? "Could not send email.")),
    onError: (e) => setMessage((e as Error).message),
  });

  const dlContractMut = useMutation({
    mutationFn: () => dlContract({ data: { application_id: appId } }),
    onSuccess: (result) => downloadBase64File(result.filename, result.content_base64, result.content_type),
    onError: (e) => setMessage((e as Error).message),
  });

  const dlSummaryMut = useMutation({
    mutationFn: () => dlSummary({ data: { application_id: appId } }),
    onSuccess: (result) => downloadBase64File(result.filename, result.content_base64, result.content_type),
    onError: (e) => setMessage((e as Error).message),
  });

  const busy = contractMut.isPending || docsMut.isPending || dlContractMut.isPending || dlSummaryMut.isPending;

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Documents & email</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Configure Resend in Settings → Communications. Templates control email copy and contract PDF layout.
        </p>
        {tenantEmail && <p className="text-xs text-muted-foreground">Tenant: {tenantEmail}</p>}
        <Button variant="default" size="sm" className="w-full justify-start" onClick={() => contractMut.mutate()} disabled={busy}>
          <Send className="mr-2 h-3.5 w-3.5" />
          {contractMut.isPending ? "Sending…" : "Generate & email contract"}
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => dlContractMut.mutate()} disabled={busy}>
          <Download className="mr-2 h-3.5 w-3.5" />
          {dlContractMut.isPending ? "Preparing…" : "Download contract PDF"}
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => dlSummaryMut.mutate()} disabled={busy}>
          <FileDown className="mr-2 h-3.5 w-3.5" />
          {dlSummaryMut.isPending ? "Preparing…" : "Download application summary"}
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => docsMut.mutate()} disabled={busy}>
          <Mail className="mr-2 h-3.5 w-3.5" />
          {docsMut.isPending ? "Sending…" : "Request more documents"}
        </Button>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-foreground">{value}</div>
    </div>
  );
}

function CreateTenancyCard({ propertyId, tenantId, applicationId, offerAmount, chequesOffered, moveInDate }: {
  propertyId: string; tenantId: string; applicationId: string; offerAmount: number; chequesOffered: number; moveInDate: string | null;
}) {
  const qc = useQueryClient();
  const create = useServerFn(createTenancy);
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(moveInDate ?? today);
  const [end, setEnd] = useState(() => {
    const d = new Date(moveInDate ?? today);
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [rent, setRent] = useState(String(offerAmount));
  const [cheques, setCheques] = useState(String(chequesOffered));
  const [deposit, setDeposit] = useState(String(Math.round(offerAmount * 0.05)));
  const [ejari, setEjari] = useState("");

  const mut = useMutation({
    mutationFn: () => create({ data: {
      property_id: propertyId,
      tenant_id: tenantId,
      application_id: applicationId,
      start_date: start,
      end_date: end,
      annual_rent: Number(rent),
      cheques: Number(cheques),
      security_deposit: Number(deposit),
      ejari_number: ejari || null,
    } }),
    onSuccess: () => {
      qc.invalidateQueries();
      setOpen(false);
    },
  });

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Create tenancy</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Generate the contract, payment schedule and Ejari record.</p>
        <Button className="mt-3 w-full" onClick={() => setOpen(true)}>Create tenancy</Button>
      </CardContent>
      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="Create tenancy"
        description="Generate contract, payment schedule and Ejari record."
        footer={
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => mut.mutate()} disabled={mut.isPending}>
              {mut.isPending ? "Creating…" : "Create & generate schedule"}
            </Button>
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Start date</Label><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>End date</Label><Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Annual rent</Label><Input type="number" min={0} value={rent} onChange={(e) => setRent(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Cheques</Label><Input type="number" min={1} max={12} value={cheques} onChange={(e) => setCheques(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Security deposit</Label><Input type="number" min={0} value={deposit} onChange={(e) => setDeposit(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Ejari number</Label><Input value={ejari} onChange={(e) => setEjari(e.target.value)} maxLength={80} /></div>
          {mut.isError && <p className="text-sm text-destructive sm:col-span-2">{(mut.error as Error).message}</p>}
        </div>
      </FormSheet>
    </Card>
  );
}
