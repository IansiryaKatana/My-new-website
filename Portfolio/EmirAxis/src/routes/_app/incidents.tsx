import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/incidents")({
  head: () => ({ meta: [{ title: "Incidents — EmirAxis" }] }),
  component: IncidentsPage,
});

const TYPES = ["injury","accident","damage","theft","fight","misconduct","site_accident","transport_accident"];
const STATUSES = ["open","investigating","resolved","escalated","closed"];

type Row = {
  id: string; incident_type: string; status: string; occurred_at: string;
  worker_id: string | null; client_id: string | null; location: string | null;
  description: string; witnesses: string | null; action_taken: string | null;
  medical_treatment: string | null; police_report: string | null;
};

function IncidentsPage() {
  const { user, hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const canManage = hasAnyRole(["admin", "manager", "recruiter"]);

  const { data: workers } = useQuery({
    queryKey: ["workers-lite"],
    queryFn: async () => (await supabase.from("workers").select("id, full_name").order("full_name")).data ?? [],
  });
  const workerMap = new Map((workers ?? []).map((w) => [w.id, w]));

  const { data: rows, isLoading } = useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("incidents").select("*").order("occurred_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const create = useMutation({
    mutationFn: async (p: Partial<Row>) => {
      const { error } = await supabase.from("incidents").insert({ ...p, reported_by: user?.id } as never);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Incident reported"); setOpen(false); qc.invalidateQueries({ queryKey: ["incidents"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Row> }) => {
      const { error } = await supabase.from("incidents").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["incidents"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="HSE"
        title="Incidents & Accidents"
        description="Log safety incidents, accidents, and follow-up actions."
        actions={canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> Report incident</Button></DialogTrigger>
            <CreateDialog workers={workers ?? []} onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
          </Dialog>
        )}
      />
      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6"><Skeleton className="h-10" /></div>
          : !rows?.length ? <div className="p-10"><EmptyState icon={ShieldAlert} title="No incidents" description="Log an incident to start tracking." /></div>
          : (
          <Table>
            <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Worker</TableHead><TableHead>Location</TableHead><TableHead>Occurred</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="capitalize">{r.incident_type.replace(/_/g, " ")}</TableCell>
                  <TableCell>{r.worker_id ? workerMap.get(r.worker_id)?.full_name : "—"}</TableCell>
                  <TableCell>{r.location ?? "—"}</TableCell>
                  <TableCell className="text-xs">{format(new Date(r.occurred_at), "PP")}</TableCell>
                  <TableCell className="max-w-sm truncate">{r.description}</TableCell>
                  <TableCell>{canManage ? (
                    <Select value={r.status} onValueChange={(v) => update.mutate({ id: r.id, patch: { status: v } })}>
                      <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
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
  const [f, setF] = useState<Partial<Row>>({ incident_type: "injury", status: "open", occurred_at: new Date().toISOString() });
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader><DialogTitle>Report incident</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div className="form-grid-2">
          <div><Label>Type</Label>
            <Select value={f.incident_type} onValueChange={(v) => setF({ ...f, incident_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Worker</Label>
            <Select value={f.worker_id ?? "none"} onValueChange={(v) => setF({ ...f, worker_id: v === "none" ? null : v })}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent><SelectItem value="none">None</SelectItem>{workers.map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="form-grid-2">
          <div><Label>Location</Label><Input value={f.location ?? ""} onChange={(e) => setF({ ...f, location: e.target.value })} /></div>
          <div><Label>Occurred at</Label><DateTimePicker value={f.occurred_at} onChange={(v) => setF({ ...f, occurred_at: v ?? new Date().toISOString() })} clearable={false} /></div>
        </div>
        <div><Label>Description</Label><Textarea rows={3} value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div><Label>Witnesses</Label><Input value={f.witnesses ?? ""} onChange={(e) => setF({ ...f, witnesses: e.target.value })} /></div>
        <div><Label>Action taken</Label><Textarea rows={2} value={f.action_taken ?? ""} onChange={(e) => setF({ ...f, action_taken: e.target.value })} /></div>
      </div>
      <DialogFooter><Button disabled={!f.description || pending} onClick={() => onSubmit(f)}>{pending ? "Saving…" : "Report"}</Button></DialogFooter>
    </DialogContent>
  );
}
