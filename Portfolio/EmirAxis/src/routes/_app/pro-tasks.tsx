import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Landmark, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PRO_ROLES } from "@/lib/roles";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/pro-tasks")({
  head: () => ({ meta: [{ title: "PRO Tasks — EmirAxis" }] }),
  component: ProTasksPage,
});

const TYPES = ["quota_request","work_permit","offer_letter","entry_permit","status_change","medical_booking","emirates_id","visa_stamping","labour_card","insurance","visa_renewal","visa_cancellation","absconding","fine_check","document_collection","other"];
const STATUSES = ["open","in_progress","submitted","on_hold","done","cancelled"];

type Row = {
  id: string; title: string; task_type: string; status: string;
  worker_id: string | null; candidate_id: string | null; client_id: string | null;
  reference_no: string | null; due_date: string | null; completed_at: string | null;
  cost: number | null; description: string | null; assigned_to: string | null;
};

function ProTasksPage() {
  const { user, hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const canManage = hasAnyRole(PRO_ROLES);

  const { data: workers } = useQuery({
    queryKey: ["workers-lite"],
    queryFn: async () => (await supabase.from("workers").select("id, full_name").order("full_name")).data ?? [],
  });
  const workerMap = new Map((workers ?? []).map((w) => [w.id, w]));

  const { data: rows, isLoading } = useQuery({
    queryKey: ["pro_tasks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pro_tasks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const create = useMutation({
    mutationFn: async (p: Partial<Row>) => {
      const { error } = await supabase.from("pro_tasks").insert({ ...p, created_by: user?.id } as never);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Task created"); setOpen(false); qc.invalidateQueries({ queryKey: ["pro_tasks"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Row> }) => {
      const { error } = await supabase.from("pro_tasks").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["pro_tasks"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Government & PRO"
        title="PRO Tasks"
        description="Track quotas, permits, EIDs, stamping, fines, and government workflows."
        actions={canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> New PRO task</Button></DialogTrigger>
            <CreateDialog workers={workers ?? []} onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
          </Dialog>
        )}
      />
      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6 space-y-2"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
          : !rows?.length ? <div className="p-10"><EmptyState icon={Landmark} title="No PRO tasks" description="Add government / PRO workflow tasks." /></div>
          : (
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Worker</TableHead><TableHead>Due</TableHead><TableHead>Reference</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell className="capitalize text-xs">{r.task_type.replace(/_/g, " ")}</TableCell>
                  <TableCell>{r.worker_id ? workerMap.get(r.worker_id)?.full_name : "—"}</TableCell>
                  <TableCell className="text-xs">{r.due_date ? format(new Date(r.due_date), "PP") : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.reference_no ?? "—"}</TableCell>
                  <TableCell>{canManage ? (
                    <Select value={r.status} onValueChange={(v) => update.mutate({ id: r.id, patch: { status: v, completed_at: v === "done" ? new Date().toISOString() : r.completed_at } })}>
                      <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : <StatusBadge status={r.status} />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

function CreateDialog({ workers, onSubmit, pending }: { workers: { id: string; full_name: string }[]; onSubmit: (p: Partial<Row>) => void; pending: boolean }) {
  const [form, setForm] = useState<Partial<Row>>({ task_type: "other", status: "open" });
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader><DialogTitle>New PRO task</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Title</Label><Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="form-grid-2">
          <div><Label>Type</Label>
            <Select value={form.task_type} onValueChange={(v) => setForm({ ...form, task_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Worker (optional)</Label>
            <Select value={form.worker_id ?? "none"} onValueChange={(v) => setForm({ ...form, worker_id: v === "none" ? null : v })}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent><SelectItem value="none">None</SelectItem>{workers.map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="form-grid-2">
          <div><Label>Due date</Label><DatePicker value={form.due_date} onChange={(v) => setForm({ ...form, due_date: v })} /></div>
          <div><Label>Reference no.</Label><Input value={form.reference_no ?? ""} onChange={(e) => setForm({ ...form, reference_no: e.target.value })} /></div>
        </div>
        <div><Label>Cost (AED)</Label><Input type="number" value={form.cost ?? ""} onChange={(e) => setForm({ ...form, cost: e.target.value ? Number(e.target.value) : null })} /></div>
        <div><Label>Description</Label><Textarea rows={2} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      </div>
      <DialogFooter><Button disabled={!form.title || pending} onClick={() => onSubmit(form)}>{pending ? "Saving…" : "Create"}</Button></DialogFooter>
    </DialogContent>
  );
}
