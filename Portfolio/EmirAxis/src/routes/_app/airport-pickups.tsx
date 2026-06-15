import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plane, Plus } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/airport-pickups")({
  head: () => ({ meta: [{ title: "Airport Pickups — EmirAxis" }] }),
  component: PickupsPage,
});

const STATUSES = ["pending","arranged","completed","missed","cancelled"];

type Row = {
  id: string; candidate_id: string | null; worker_id: string | null;
  airline: string | null; flight_no: string | null; terminal: string | null;
  arrival_at: string; driver_id: string | null; vehicle_id: string | null;
  accommodation_id: string | null; status: string; notes: string | null;
};

function PickupsPage() {
  const { user, hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const canManage = hasAnyRole(["admin", "manager", "recruiter"]);

  const { data: candidates } = useQuery({ queryKey: ["candidates-lite"], queryFn: async () => (await supabase.from("candidates").select("id, full_name").order("full_name")).data ?? [] });
  const { data: drivers } = useQuery({ queryKey: ["drivers"], queryFn: async () => (await supabase.from("drivers").select("id, full_name")).data ?? [] });
  const { data: vehicles } = useQuery({ queryKey: ["vehicles"], queryFn: async () => (await supabase.from("vehicles").select("id, plate_no")).data ?? [] });
  const candMap = new Map((candidates ?? []).map((c) => [c.id, c]));
  const drvMap = new Map((drivers ?? []).map((d) => [d.id, d]));

  const { data: rows, isLoading } = useQuery({
    queryKey: ["airport_pickups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("airport_pickups").select("*").order("arrival_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const create = useMutation({
    mutationFn: async (p: Partial<Row>) => {
      const { error } = await supabase.from("airport_pickups").insert({ ...p, created_by: user?.id } as never);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Pickup scheduled"); setOpen(false); qc.invalidateQueries({ queryKey: ["airport_pickups"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Row> }) => {
      const { error } = await supabase.from("airport_pickups").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["airport_pickups"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Mobilisation"
        title="Airport Pickups"
        description="Schedule and track candidate / worker arrivals."
        actions={canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> Schedule pickup</Button></DialogTrigger>
            <CreateDialog candidates={candidates ?? []} drivers={drivers ?? []} vehicles={vehicles ?? []} onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
          </Dialog>
        )}
      />
      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6"><Skeleton className="h-10" /></div>
          : !rows?.length ? <div className="p-10"><EmptyState icon={Plane} title="No pickups scheduled" description="Add an arrival to schedule a pickup." /></div>
          : (
          <Table>
            <TableHeader><TableRow><TableHead>Passenger</TableHead><TableHead>Flight</TableHead><TableHead>Arrival</TableHead><TableHead>Driver</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.candidate_id ? candMap.get(r.candidate_id)?.full_name : "—"}</TableCell>
                  <TableCell className="text-xs">{r.airline} {r.flight_no} {r.terminal ? `· T${r.terminal}` : ""}</TableCell>
                  <TableCell className="text-xs">{format(new Date(r.arrival_at), "PP p")}</TableCell>
                  <TableCell>{r.driver_id ? drvMap.get(r.driver_id)?.full_name : "—"}</TableCell>
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

function CreateDialog({ candidates, drivers, vehicles, onSubmit, pending }: { candidates: { id: string; full_name: string }[]; drivers: { id: string; full_name: string }[]; vehicles: { id: string; plate_no: string }[]; onSubmit: (p: Partial<Row>) => void; pending: boolean }) {
  const [f, setF] = useState<Partial<Row>>({ status: "pending", arrival_at: new Date().toISOString() });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Schedule pickup</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Candidate</Label>
          <Select value={f.candidate_id ?? ""} onValueChange={(v) => setF({ ...f, candidate_id: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{candidates.map((c) => <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="form-grid-3">
          <div><Label>Airline</Label><Input value={f.airline ?? ""} onChange={(e) => setF({ ...f, airline: e.target.value })} /></div>
          <div><Label>Flight no.</Label><Input value={f.flight_no ?? ""} onChange={(e) => setF({ ...f, flight_no: e.target.value })} /></div>
          <div><Label>Terminal</Label><Input value={f.terminal ?? ""} onChange={(e) => setF({ ...f, terminal: e.target.value })} /></div>
        </div>
        <div><Label>Arrival</Label><DateTimePicker value={f.arrival_at} onChange={(v) => setF({ ...f, arrival_at: v ?? new Date().toISOString() })} clearable={false} /></div>
        <div className="form-grid-2">
          <div><Label>Driver</Label>
            <Select value={f.driver_id ?? "none"} onValueChange={(v) => setF({ ...f, driver_id: v === "none" ? null : v })}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent><SelectItem value="none">None</SelectItem>{drivers.map((d) => <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Vehicle</Label>
            <Select value={f.vehicle_id ?? "none"} onValueChange={(v) => setF({ ...f, vehicle_id: v === "none" ? null : v })}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent><SelectItem value="none">None</SelectItem>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.plate_no}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter><Button disabled={!f.candidate_id || pending} onClick={() => onSubmit(f)}>{pending ? "Saving…" : "Schedule"}</Button></DialogFooter>
    </DialogContent>
  );
}
