import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarDays, FileText, AlertTriangle, Wallet, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/portal")({
  head: () => ({ meta: [{ title: "My Portal — Staffing OS" }] }),
  component: PortalPage,
});

const fmt = (n: number, c = "AED") => new Intl.NumberFormat("en-AE", { style: "currency", currency: c }).format(n || 0);

function PortalPage() {
  const { user } = useAuth();

  const { data: worker, isLoading } = useQuery({
    queryKey: ["my-worker", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase.from("workers").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  if (isLoading) return <Skeleton className="h-64" />;

  if (!worker) {
    return (
      <Card className="p-10 border-border/60">
        <EmptyState
          icon={FileText}
          title="No worker profile linked"
          description="Your account is not yet linked to a worker record. Please ask an HR administrator to associate your profile."
        />
      </Card>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="My Portal"
        title={`Welcome, ${worker.full_name}`}
        description={`Employee ${worker.employee_code ?? "—"} · ${worker.designation ?? "Staff"}`}
      />

      <Tabs defaultValue="overview" className="page-stack">
        <TabsList className="bg-card/60">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="advance">Advance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><OverviewTab worker={worker} /></TabsContent>
        <TabsContent value="leave"><LeaveTab workerId={worker.id} /></TabsContent>
        <TabsContent value="payslips"><PayslipsTab workerId={worker.id} /></TabsContent>
        <TabsContent value="documents"><DocumentsTab workerId={worker.id} /></TabsContent>
        <TabsContent value="tickets"><TicketsTab workerId={worker.id} /></TabsContent>
        <TabsContent value="advance"><AdvanceTab workerId={worker.id} /></TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewTab({ worker }: { worker: any }) {
  const expiries = [
    { label: "Passport", date: worker.passport_expiry },
    { label: "Visa", date: worker.visa_expiry },
    { label: "Emirates ID", date: worker.emirates_id_expiry },
    { label: "Labor Card", date: worker.labor_card_expiry },
    { label: "Medical", date: worker.medical_expiry },
    { label: "Insurance", date: worker.insurance_expiry },
  ].filter((e) => e.date);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-5 border-border/60">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Employment</div>
        <dl className="space-y-2 text-sm">
          <Row label="Designation" value={worker.designation} />
          <Row label="Department" value={worker.department} />
          <Row label="Joining date" value={worker.joining_date && format(new Date(worker.joining_date), "PP")} />
          <Row label="Contract end" value={worker.contract_end && format(new Date(worker.contract_end), "PP")} />
          <Row label="Status"><StatusBadge status={worker.status} /></Row>
        </dl>
      </Card>
      <Card className="p-5 border-border/60">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Compensation</div>
        <dl className="space-y-2 text-sm">
          <Row label="Base salary" value={fmt(worker.base_salary ?? 0, worker.currency ?? "AED")} />
          <Row label="Housing" value={fmt(worker.housing_allowance ?? 0, worker.currency ?? "AED")} />
          <Row label="Transport" value={fmt(worker.transport_allowance ?? 0, worker.currency ?? "AED")} />
          <Row label="Other" value={fmt(worker.other_allowance ?? 0, worker.currency ?? "AED")} />
          <Row label="IBAN" value={worker.iban ? `••• ${worker.iban.slice(-4)}` : "—"} />
        </dl>
      </Card>
      <Card className="p-5 border-border/60 md:col-span-2">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Document expiries</div>
        {expiries.length ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {expiries.map((e) => {
              const days = Math.ceil((new Date(e.date as string).getTime() - Date.now()) / 86400000);
              const tone = days < 0 ? "danger" : days < 30 ? "warning" : days < 90 ? "info" : "success";
              return (
                <div key={e.label} className="flex items-center justify-between rounded-md border border-border/60 bg-card/50 p-3">
                  <div>
                    <div className="text-sm font-medium">{e.label}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(e.date as string), "PP")}</div>
                  </div>
                  <StatusBadge status={days < 0 ? "expired" : `${days}d`} />
                  <span className="sr-only">{tone}</span>
                </div>
              );
            })}
          </div>
        ) : <div className="text-sm text-muted-foreground">No expiries on file.</div>}
      </Card>
    </div>
  );
}

function Row({ label, value, children }: { label: string; value?: any; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-1.5 last:border-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children ?? value ?? "—"}</dd>
    </div>
  );
}

function LeaveTab({ workerId }: { workerId: string }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ leave_type: "annual", start_date: "", end_date: "", days: 1, reason: "" });

  const { data: leaves } = useQuery({
    queryKey: ["my-leaves", workerId],
    queryFn: async () => {
      const { data } = await supabase.from("leave_requests").select("*").eq("worker_id", workerId).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      const days = Math.max(1, Math.ceil((new Date(form.end_date).getTime() - new Date(form.start_date).getTime()) / 86400000) + 1);
      const { error } = await supabase.from("leave_requests").insert({
        worker_id: workerId, ...form, days, status: "pending",
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Leave request submitted");
      setOpen(false);
      setForm({ leave_type: "annual", start_date: "", end_date: "", days: 1, reason: "" });
      qc.invalidateQueries({ queryKey: ["my-leaves", workerId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leave_requests").update({ status: "cancelled" } as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Cancelled"); qc.invalidateQueries({ queryKey: ["my-leaves", workerId] }); },
  });

  return (
    <Card className="p-5 border-border/60">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold">My leave requests</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-3.5 w-3.5" /> Request leave</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New leave request</DialogTitle>
              <DialogDescription>Your manager will review and respond.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Type</Label>
                <Select value={form.leave_type} onValueChange={(v) => setForm({ ...form, leave_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["annual","sick","unpaid","emergency","maternity","paternity","other"].map((t) =>
                      <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="form-grid-2">
                <div><Label>From</Label><DatePicker value={form.start_date} onChange={(v) => setForm({ ...form, start_date: v ?? "" })} clearable={false} /></div>
                <div><Label>To</Label><DatePicker value={form.end_date} onChange={(v) => setForm({ ...form, end_date: v ?? "" })} clearable={false} /></div>
              </div>
              <div><Label>Reason</Label><Textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button disabled={!form.start_date || !form.end_date || submit.isPending} onClick={() => submit.mutate()}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {leaves?.length ? (
        <div className="space-y-2">
          {leaves.map((l: any) => (
            <div key={l.id} className="flex items-center justify-between rounded-md border border-border/60 p-3">
              <div>
                <div className="text-sm font-medium capitalize">{l.leave_type} · {l.days} day{l.days > 1 ? "s" : ""}</div>
                <div className="text-xs text-muted-foreground">{format(new Date(l.start_date), "PP")} → {format(new Date(l.end_date), "PP")}</div>
                {l.decision_note && <div className="mt-1 text-xs italic text-muted-foreground">"{l.decision_note}"</div>}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={l.status} />
                {l.status === "pending" && <Button size="sm" variant="ghost" onClick={() => cancel.mutate(l.id)}>Cancel</Button>}
              </div>
            </div>
          ))}
        </div>
      ) : <EmptyState icon={CalendarDays} title="No leave requests yet" description="Submit your first leave request above." />}
    </Card>
  );
}

function PayslipsTab({ workerId }: { workerId: string }) {
  const { data } = useQuery({
    queryKey: ["my-payslips", workerId],
    queryFn: async () => {
      const { data } = await supabase.from("payslips").select("*").eq("worker_id", workerId).neq("status", "draft").order("period_year", { ascending: false }).order("period_month", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <Card className="p-5 border-border/60">
      <div className="mb-4 text-sm font-semibold">My payslips</div>
      {data?.length ? (
        <div className="space-y-2">
          {data.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between rounded-md border border-border/60 p-3">
              <div>
                <div className="text-sm font-medium">{format(new Date(p.period_year, p.period_month - 1, 1), "MMMM yyyy")}</div>
                <div className="text-xs text-muted-foreground">Gross {fmt(p.gross, p.currency)} · Net {fmt(p.net, p.currency)}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={p.status} />
                {p.pdf_url && (
                  <a href={p.pdf_url} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline"><Download className="mr-1 h-3.5 w-3.5" /> PDF</Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : <EmptyState icon={Wallet} title="No payslips yet" description="Issued payslips will appear here." />}
    </Card>
  );
}

function DocumentsTab({ workerId }: { workerId: string }) {
  const { data } = useQuery({
    queryKey: ["my-documents", workerId],
    queryFn: async () => {
      const { data } = await supabase.from("documents").select("*").eq("worker_id", workerId).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const download = async (path: string) => {
    const { data } = await supabase.storage.from("documents").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <Card className="p-5 border-border/60">
      <div className="mb-4 text-sm font-semibold">My documents</div>
      {data?.length ? (
        <div className="space-y-2">
          {data.map((d: any) => (
            <div key={d.id} className="flex items-center justify-between rounded-md border border-border/60 p-3">
              <div>
                <div className="text-sm font-medium capitalize">{d.category.replace(/_/g, " ")} · {d.title ?? d.file_name}</div>
                <div className="text-xs text-muted-foreground">{d.expiry_date ? `Expires ${format(new Date(d.expiry_date), "PP")}` : "No expiry"}</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => download(d.file_path)}><Download className="mr-1 h-3.5 w-3.5" /> View</Button>
            </div>
          ))}
        </div>
      ) : <EmptyState icon={FileText} title="No documents" description="Documents uploaded by HR will appear here." />}
    </Card>
  );
}

function TicketsTab({ workerId }: { workerId: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "welfare" });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("issues").insert({
        worker_id: workerId,
        reported_by: user?.id,
        title: form.title,
        description: form.description,
        category: form.category,
        severity: "medium",
        status: "open",
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Ticket submitted");
      setOpen(false);
      setForm({ title: "", description: "", category: "welfare" });
      qc.invalidateQueries({ queryKey: ["my-issues", workerId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card className="p-5 border-border/60">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="text-sm font-semibold">My welfare tickets</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-3.5 w-3.5" /> New ticket</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Submit a complaint</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["welfare","accommodation","transport","payroll","safety","hr","other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Details</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            </div>
            <DialogFooter><Button disabled={!form.title.trim() || create.isPending} onClick={() => create.mutate()}>Submit</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <MyIssues workerId={workerId} />
    </Card>
  );
}

function AdvanceTab({ workerId }: { workerId: string }) {
  const qc = useQueryClient();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const { data: advances } = useQuery({
    queryKey: ["my-advances", workerId],
    queryFn: async () => {
      const { data } = await supabase.from("salary_advances").select("*").eq("worker_id", workerId).order("requested_at", { ascending: false });
      return data ?? [];
    },
  });

  const request = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("salary_advances").insert({
        worker_id: workerId,
        amount: Number(amount),
        reason: reason || null,
        status: "pending",
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Advance request submitted");
      setAmount("");
      setReason("");
      qc.invalidateQueries({ queryKey: ["my-advances", workerId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card className="space-y-4 p-5 border-border/60">
      <div className="text-sm font-semibold">Salary advance</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Amount (AED)</Label><Input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        <div><Label>Reason</Label><Input value={reason} onChange={(e) => setReason(e.target.value)} /></div>
      </div>
      <Button disabled={!amount || request.isPending} onClick={() => request.mutate()}>Request advance</Button>
      {advances?.length ? (
        <ul className="space-y-2 text-sm">
          {advances.map((a: { id: string; amount: number; status: string; requested_at: string }) => (
            <li key={a.id} className="flex justify-between rounded-md border border-border/60 px-3 py-2">
              <span>AED {Number(a.amount).toFixed(2)}</span>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}

function MyIssues({ workerId }: { workerId: string }) {
  const { data } = useQuery({
    queryKey: ["my-issues", workerId],
    queryFn: async () => {
      const { data } = await supabase.from("issues").select("*").eq("worker_id", workerId).order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  if (!data?.length) return <EmptyState icon={AlertTriangle} title="No tickets" description="You have no open welfare tickets." />;
  return (
    <div className="space-y-2">
      {data.map((i: any) => (
        <div key={i.id} className="flex items-center justify-between rounded-md border border-border/60 p-3">
          <div>
            <div className="text-sm font-medium">{i.title}</div>
            <div className="text-xs text-muted-foreground capitalize">{i.category} · {format(new Date(i.created_at), "PP")}</div>
          </div>
          <div className="flex items-center gap-2"><StatusBadge status={i.severity} /><StatusBadge status={i.status} /></div>
        </div>
      ))}
    </div>
  );
}
