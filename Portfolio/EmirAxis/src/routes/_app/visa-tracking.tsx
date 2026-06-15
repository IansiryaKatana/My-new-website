import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Stamp, Plus, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PRO_ROLES } from "@/lib/roles";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/visa-tracking")({
  head: () => ({ meta: [{ title: "Visa & Immigration — EmirAxis" }] }),
  component: VisaPage,
});

const STAGES = ["offer_accepted","documents_collected","entry_permit","status_change","medical_booked","medical_done","emirates_id","visa_stamping","labour_contract","activated","renewal_pending","cancellation","cancelled"];
const STATUSES = ["pending","in_progress","done","failed","skipped"];

type Row = {
  id: string; worker_id: string; stage: string; status: string;
  visa_type: string | null; sponsor: string | null; entry_permit_no: string | null;
  uid_no: string | null; reference_no: string | null; scheduled_date: string | null;
  completed_date: string | null; cost: number; notes: string | null; created_at: string;
  workers?: { full_name: string; employee_code: string | null } | null;
};

function VisaPage() {
  const { user, hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const canManage = hasAnyRole(PRO_ROLES);

  const { data: workers } = useQuery({
    queryKey: ["workers-lite"],
    queryFn: async () => {
      const { data } = await supabase.from("workers").select("id, full_name, employee_code").order("full_name");
      return data ?? [];
    },
  });

  const workerMap = new Map((workers ?? []).map((w) => [w.id, w]));

  const { data: rowsRaw, isLoading } = useQuery({
    queryKey: ["visa_records"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visa_records")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const rows = rowsRaw?.map((r) => ({ ...r, workers: r.worker_id ? workerMap.get(r.worker_id) ?? null : null }));

  const pending = rows?.filter((r) => r.status === "pending").length ?? 0;
  const inProgress = rows?.filter((r) => r.status === "in_progress").length ?? 0;
  const done = rows?.filter((r) => r.status === "done").length ?? 0;
  const failed = rows?.filter((r) => r.status === "failed").length ?? 0;

  const create = useMutation({
    mutationFn: async (p: Partial<Row>) => {
      const { error } = await supabase.from("visa_records").insert({ ...p, created_by: user?.id } as never);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Visa step created"); setOpen(false); qc.invalidateQueries({ queryKey: ["visa_records"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Row> }) => {
      const { error } = await supabase.from("visa_records").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["visa_records"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Compliance"
        title="Visa & Immigration"
        description="Track every step from entry permit to residency, renewal and cancellation."
        actions={canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> Add visa step</Button></DialogTrigger>
            <CreateDialog workers={workers ?? []} onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
          </Dialog>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Clock} label="Pending" value={pending} tone="warning" />
        <StatCard icon={Stamp} label="In progress" value={inProgress} tone="info" />
        <StatCard icon={CheckCircle2} label="Completed" value={done} tone="success" />
        <StatCard icon={AlertTriangle} label="Failed" value={failed} tone="danger" />
      </div>

      <Card className="table-shell border-border/60">
        {isLoading ? (
          <div className="p-6 space-y-2"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
        ) : !rows?.length ? (
          <div className="p-10"><EmptyState icon={Stamp} title="No visa records" description="Add visa workflow steps for your workforce." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.workers?.full_name ?? "—"}<div className="text-xs text-muted-foreground">{r.workers?.employee_code}</div></TableCell>
                  <TableCell className="capitalize">{r.stage.replace(/_/g, " ")}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.reference_no ?? r.entry_permit_no ?? "—"}</TableCell>
                  <TableCell className="text-xs">{r.scheduled_date ? format(new Date(r.scheduled_date), "PP") : "—"}</TableCell>
                  <TableCell>
                    {canManage ? (
                      <Select value={r.status} onValueChange={(v) => update.mutate({ id: r.id, patch: { status: v, completed_date: v === "done" ? new Date().toISOString().slice(0,10) : r.completed_date } })}>
                        <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                      </Select>
                    ) : <StatusBadge status={r.status} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

function CreateDialog({ workers, onSubmit, pending }: { workers: { id: string; full_name: string; employee_code: string | null }[]; onSubmit: (p: Partial<Row>) => void; pending: boolean }) {
  const [form, setForm] = useState<Partial<Row>>({ stage: "offer_accepted", status: "pending" });
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>New visa step</DialogTitle>
        <DialogDescription>Track a stage in the visa workflow for a worker.</DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>Worker</Label>
          <Select value={form.worker_id ?? ""} onValueChange={(v) => setForm({ ...form, worker_id: v })}>
            <SelectTrigger><SelectValue placeholder="Select worker" /></SelectTrigger>
            <SelectContent>{workers.map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="form-grid-2">
          <div><Label>Stage</Label>
            <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g," ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_"," ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="form-grid-2">
          <div><Label>Visa type</Label><Input value={form.visa_type ?? ""} onChange={(e) => setForm({ ...form, visa_type: e.target.value })} placeholder="Employment" /></div>
          <div><Label>Sponsor</Label><Input value={form.sponsor ?? ""} onChange={(e) => setForm({ ...form, sponsor: e.target.value })} /></div>
        </div>
        <div className="form-grid-2">
          <div><Label>Reference / Permit no.</Label><Input value={form.reference_no ?? ""} onChange={(e) => setForm({ ...form, reference_no: e.target.value })} /></div>
          <div><Label>Scheduled date</Label><DatePicker value={form.scheduled_date} onChange={(v) => setForm({ ...form, scheduled_date: v })} /></div>
        </div>
        <div><Label>Notes</Label><Textarea rows={2} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
      </div>
      <DialogFooter>
        <Button disabled={!form.worker_id || pending} onClick={() => onSubmit(form)}>{pending ? "Saving…" : "Create"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
