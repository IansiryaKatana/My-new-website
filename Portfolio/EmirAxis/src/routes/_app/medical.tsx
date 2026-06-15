import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Stethoscope, Plus, CheckCircle2, XCircle, Clock } from "lucide-react";
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
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/medical")({
  head: () => ({ meta: [{ title: "Medical Fitness — EmirAxis" }] }),
  component: MedicalPage,
});

const STATUSES = ["required","booked","attended","missed","passed","failed","retest","certified"];

type Row = {
  id: string; worker_id: string; medical_center: string | null;
  appointment_at: string | null; status: string; result_date: string | null;
  certificate_url: string | null; transport_pickup: string | null;
  cost: number | null; notes: string | null; created_at: string;
};

function MedicalPage() {
  const { user, hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const canManage = hasAnyRole(PRO_ROLES);

  const { data: workers } = useQuery({
    queryKey: ["workers-lite"],
    queryFn: async () => (await supabase.from("workers").select("id, full_name, employee_code").order("full_name")).data ?? [],
  });
  const workerMap = new Map((workers ?? []).map((w) => [w.id, w]));

  const { data: rows, isLoading } = useQuery({
    queryKey: ["medical_records"],
    queryFn: async () => {
      const { data, error } = await supabase.from("medical_records").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const booked = rows?.filter((r) => r.status === "booked").length ?? 0;
  const passed = rows?.filter((r) => r.status === "passed" || r.status === "certified").length ?? 0;
  const failed = rows?.filter((r) => r.status === "failed").length ?? 0;
  const total = rows?.length ?? 0;

  const create = useMutation({
    mutationFn: async (p: Partial<Row>) => {
      const { error } = await supabase.from("medical_records").insert({ ...p, created_by: user?.id } as never);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Medical record created"); setOpen(false); qc.invalidateQueries({ queryKey: ["medical_records"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Row> }) => {
      const { error } = await supabase.from("medical_records").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["medical_records"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Compliance"
        title="Medical Fitness"
        description="Book medicals, track results, store fitness certificates."
        actions={canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> New medical</Button></DialogTrigger>
            <CreateDialog workers={workers ?? []} onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
          </Dialog>
        )}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Stethoscope} label="Total" value={total} />
        <StatCard icon={Clock} label="Booked" value={booked} tone="info" />
        <StatCard icon={CheckCircle2} label="Passed / certified" value={passed} tone="success" />
        <StatCard icon={XCircle} label="Failed" value={failed} tone="danger" />
      </div>
      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6 space-y-2"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
        : !rows?.length ? <div className="p-10"><EmptyState icon={Stethoscope} title="No medical records" description="Book fitness exams for workers and track results." /></div>
        : <Table>
            <TableHeader><TableRow><TableHead>Worker</TableHead><TableHead>Center</TableHead><TableHead>Appointment</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{rows.map((r) => {
              const w = workerMap.get(r.worker_id);
              return <TableRow key={r.id}>
                <TableCell className="font-medium">{w?.full_name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{r.medical_center ?? "—"}</TableCell>
                <TableCell className="text-xs">{r.appointment_at ? format(new Date(r.appointment_at), "PPp") : "—"}</TableCell>
                <TableCell>{canManage ? (
                  <Select value={r.status} onValueChange={(v) => update.mutate({ id: r.id, patch: { status: v, result_date: ["passed","failed","certified"].includes(v) ? new Date().toISOString().slice(0,10) : r.result_date } })}>
                    <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                ) : <StatusBadge status={r.status} />}</TableCell>
              </TableRow>;
            })}</TableBody>
          </Table>}
      </Card>
    </div>
  );
}

function CreateDialog({ workers, onSubmit, pending }: { workers: { id: string; full_name: string; employee_code: string | null }[]; onSubmit: (p: Partial<Row>) => void; pending: boolean }) {
  const [form, setForm] = useState<Partial<Row>>({ status: "required" });
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader><DialogTitle>Book medical fitness</DialogTitle><DialogDescription>Schedule a medical fitness exam for a worker.</DialogDescription></DialogHeader>
      <div className="space-y-3">
        <div><Label>Worker</Label>
          <Select value={form.worker_id ?? ""} onValueChange={(v) => setForm({ ...form, worker_id: v })}>
            <SelectTrigger><SelectValue placeholder="Select worker" /></SelectTrigger>
            <SelectContent>{workers.map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Medical center</Label><Input value={form.medical_center ?? ""} onChange={(e) => setForm({ ...form, medical_center: e.target.value })} placeholder="e.g. DHA Al Karama" /></div>
        <div className="form-grid-2">
          <div><Label>Appointment date/time</Label><DateTimePicker value={form.appointment_at} onChange={(v) => setForm({ ...form, appointment_at: v })} /></div>
          <div><Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div><Label>Transport pickup</Label><Input value={form.transport_pickup ?? ""} onChange={(e) => setForm({ ...form, transport_pickup: e.target.value })} /></div>
      </div>
      <DialogFooter><Button disabled={!form.worker_id || pending} onClick={() => onSubmit(form)}>{pending ? "Saving…" : "Create"}</Button></DialogFooter>
    </DialogContent>
  );
}
