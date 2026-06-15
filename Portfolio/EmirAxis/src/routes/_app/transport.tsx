import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Truck, Plus, Car, Route as RouteIcon, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/transport")({
  head: () => ({ meta: [{ title: "Transport — EmirAxis" }] }),
  component: TransportPage,
});

type Vehicle = { id: string; plate_no: string; make: string | null; model: string | null; capacity: number | null; registration_expiry: string | null; insurance_expiry: string | null; is_active: boolean };
type Driver = { id: string; full_name: string; phone: string | null; license_no: string | null; license_expiry: string | null; vehicle_id: string | null; is_active: boolean };
type RouteRow = { id: string; name: string; pickup_point: string | null; dropoff_point: string | null; shift: string | null; vehicle_id: string | null; driver_id: string | null; client_id: string | null; is_active: boolean };

function TransportPage() {
  const { hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const canManage = hasAnyRole(["admin", "manager"]);
  const [vehOpen, setVehOpen] = useState(false);
  const [drvOpen, setDrvOpen] = useState(false);
  const [rtOpen, setRtOpen] = useState(false);
  const [editVeh, setEditVeh] = useState<Partial<Vehicle> | null>(null);
  const [editDrv, setEditDrv] = useState<Partial<Driver> | null>(null);
  const [editRt, setEditRt] = useState<Partial<RouteRow> | null>(null);

  const { data: vehicles, isLoading: lv } = useQuery({ queryKey: ["vehicles"], queryFn: async () => (await supabase.from("vehicles").select("*").order("plate_no")).data as Vehicle[] ?? [] });
  const { data: drivers, isLoading: ld } = useQuery({ queryKey: ["drivers"], queryFn: async () => (await supabase.from("drivers").select("*").order("full_name")).data as Driver[] ?? [] });
  const { data: routes, isLoading: lr } = useQuery({ queryKey: ["transport_routes"], queryFn: async () => (await supabase.from("transport_routes").select("*").order("name")).data as RouteRow[] ?? [] });

  const vehicleMap = new Map((vehicles ?? []).map((v) => [v.id, v]));
  const driverMap = new Map((drivers ?? []).map((d) => [d.id, d]));

  const createVeh = useMutation({
    mutationFn: async (p: Partial<Vehicle>) => { const { error } = await supabase.from("vehicles").insert(p as never); if (error) throw error; },
    onSuccess: () => { toast.success("Vehicle added"); setVehOpen(false); qc.invalidateQueries({ queryKey: ["vehicles"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const createDrv = useMutation({
    mutationFn: async (p: Partial<Driver>) => { const { error } = await supabase.from("drivers").insert(p as never); if (error) throw error; },
    onSuccess: () => { toast.success("Driver added"); setDrvOpen(false); qc.invalidateQueries({ queryKey: ["drivers"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const createRt = useMutation({
    mutationFn: async (p: Partial<RouteRow>) => { const { error } = await supabase.from("transport_routes").insert(p as never); if (error) throw error; },
    onSuccess: () => { toast.success("Route added"); setRtOpen(false); qc.invalidateQueries({ queryKey: ["transport_routes"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const upsertVeh = useMutation({
    mutationFn: async (p: Partial<Vehicle>) => {
      if (p.id) { const { error } = await supabase.from("vehicles").update(p as never).eq("id", p.id); if (error) throw error; }
      else { const { error } = await supabase.from("vehicles").insert(p as never); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Vehicle saved"); setVehOpen(false); setEditVeh(null); qc.invalidateQueries({ queryKey: ["vehicles"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const delVeh = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("vehicles").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
  });
  const upsertDrv = useMutation({
    mutationFn: async (p: Partial<Driver>) => {
      if (p.id) { const { error } = await supabase.from("drivers").update(p as never).eq("id", p.id); if (error) throw error; }
      else { const { error } = await supabase.from("drivers").insert(p as never); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Driver saved"); setDrvOpen(false); setEditDrv(null); qc.invalidateQueries({ queryKey: ["drivers"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const delDrv = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("drivers").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
  });
  const upsertRt = useMutation({
    mutationFn: async (p: Partial<RouteRow>) => {
      if (p.id) { const { error } = await supabase.from("transport_routes").update(p as never).eq("id", p.id); if (error) throw error; }
      else { const { error } = await supabase.from("transport_routes").insert(p as never); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Route saved"); setRtOpen(false); setEditRt(null); qc.invalidateQueries({ queryKey: ["transport_routes"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const delRt = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("transport_routes").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transport_routes"] }),
  });

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Logistics" title="Transport" description="Manage vehicles, drivers, and worker transport routes." />
      <Tabs defaultValue="vehicles">
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles">
          <div className="flex justify-end mb-3">{canManage && <Dialog open={vehOpen || !!editVeh} onOpenChange={(o) => { if (!o) { setVehOpen(false); setEditVeh(null); } }}><DialogTrigger asChild><Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add vehicle</Button></DialogTrigger><VehicleDialog initial={editVeh} onSubmit={(p) => upsertVeh.mutate(p)} pending={upsertVeh.isPending} /></Dialog>}</div>
          <Card className="table-shell">{lv ? <Skeleton className="h-10 m-6" /> : !vehicles?.length ? <div className="p-10"><EmptyState icon={Car} title="No vehicles" description="Add company vehicles." /></div> : (
            <Table><TableHeader><TableRow><TableHead>Plate</TableHead><TableHead>Make/Model</TableHead><TableHead>Capacity</TableHead><TableHead>Reg expiry</TableHead><TableHead>Insurance</TableHead>{canManage && <TableHead className="w-20" />}</TableRow></TableHeader>
              <TableBody>{vehicles.map((v) => <TableRow key={v.id}><TableCell className="font-medium">{v.plate_no}</TableCell><TableCell>{v.make} {v.model}</TableCell><TableCell>{v.capacity ?? "—"}</TableCell><TableCell className="text-xs">{v.registration_expiry ?? "—"}</TableCell><TableCell className="text-xs">{v.insurance_expiry ?? "—"}</TableCell>{canManage && <TableCell><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => setEditVeh(v)}><Pencil className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="text-destructive" onClick={() => delVeh.mutate(v.id)}><Trash2 className="h-3.5 w-3.5" /></Button></div></TableCell>}</TableRow>)}</TableBody>
            </Table>
          )}</Card>
        </TabsContent>

        <TabsContent value="drivers">
          <div className="flex justify-end mb-3">{canManage && <Dialog open={drvOpen || !!editDrv} onOpenChange={(o) => { if (!o) { setDrvOpen(false); setEditDrv(null); } }}><DialogTrigger asChild><Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add driver</Button></DialogTrigger><DriverDialog initial={editDrv} vehicles={vehicles ?? []} onSubmit={(p) => upsertDrv.mutate(p)} pending={upsertDrv.isPending} /></Dialog>}</div>
          <Card>{ld ? <Skeleton className="h-10 m-6" /> : !drivers?.length ? <div className="p-10"><EmptyState icon={Truck} title="No drivers" description="Add drivers." /></div> : (
            <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>License</TableHead><TableHead>Vehicle</TableHead>{canManage && <TableHead className="w-20" />}</TableRow></TableHeader>
              <TableBody>{drivers.map((d) => <TableRow key={d.id}><TableCell className="font-medium">{d.full_name}</TableCell><TableCell>{d.phone ?? "—"}</TableCell><TableCell className="text-xs">{d.license_no ?? "—"}</TableCell><TableCell>{d.vehicle_id ? vehicleMap.get(d.vehicle_id)?.plate_no : "—"}</TableCell>{canManage && <TableCell><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => setEditDrv(d)}><Pencil className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="text-destructive" onClick={() => delDrv.mutate(d.id)}><Trash2 className="h-3.5 w-3.5" /></Button></div></TableCell>}</TableRow>)}</TableBody>
            </Table>
          )}</Card>
        </TabsContent>

        <TabsContent value="routes">
          <div className="flex justify-end mb-3">{canManage && <Dialog open={rtOpen || !!editRt} onOpenChange={(o) => { if (!o) { setRtOpen(false); setEditRt(null); } }}><DialogTrigger asChild><Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add route</Button></DialogTrigger><RouteDialog initial={editRt} vehicles={vehicles ?? []} drivers={drivers ?? []} onSubmit={(p) => upsertRt.mutate(p)} pending={upsertRt.isPending} /></Dialog>}</div>
          <Card className="table-shell">{lr ? <Skeleton className="h-10 m-6" /> : !routes?.length ? <div className="p-10"><EmptyState icon={RouteIcon} title="No routes" description="Add transport routes." /></div> : (
            <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Pickup → Dropoff</TableHead><TableHead>Shift</TableHead><TableHead>Vehicle</TableHead><TableHead>Driver</TableHead>{canManage && <TableHead className="w-20" />}</TableRow></TableHeader>
              <TableBody>{routes.map((r) => <TableRow key={r.id}><TableCell className="font-medium">{r.name}</TableCell><TableCell className="text-xs">{r.pickup_point} → {r.dropoff_point}</TableCell><TableCell>{r.shift ?? "—"}</TableCell><TableCell>{r.vehicle_id ? vehicleMap.get(r.vehicle_id)?.plate_no : "—"}</TableCell><TableCell>{r.driver_id ? driverMap.get(r.driver_id)?.full_name : "—"}</TableCell>{canManage && <TableCell><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => setEditRt(r)}><Pencil className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="text-destructive" onClick={() => delRt.mutate(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button></div></TableCell>}</TableRow>)}</TableBody>
            </Table>
          )}</Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VehicleDialog({ initial, onSubmit, pending }: { initial?: Partial<Vehicle> | null; onSubmit: (p: Partial<Vehicle>) => void; pending: boolean }) {
  const [f, setF] = useState<Partial<Vehicle>>(initial ?? { is_active: true });
  useEffect(() => { setF(initial ?? { is_active: true }); }, [initial]);
  return <DialogContent><DialogHeader><DialogTitle>{f.id ? "Edit vehicle" : "Add vehicle"}</DialogTitle></DialogHeader><div className="space-y-3">
    <div><Label>Plate no.</Label><Input value={f.plate_no ?? ""} onChange={(e) => setF({ ...f, plate_no: e.target.value })} /></div>
    <div className="form-grid-2"><div><Label>Make</Label><Input value={f.make ?? ""} onChange={(e) => setF({ ...f, make: e.target.value })} /></div><div><Label>Model</Label><Input value={f.model ?? ""} onChange={(e) => setF({ ...f, model: e.target.value })} /></div></div>
    <div className="form-grid-3"><div><Label>Capacity</Label><Input type="number" value={f.capacity ?? ""} onChange={(e) => setF({ ...f, capacity: e.target.value ? Number(e.target.value) : null })} /></div><div><Label>Reg expiry</Label><DatePicker value={f.registration_expiry} onChange={(v) => setF({ ...f, registration_expiry: v })} /></div><div><Label>Insurance</Label><DatePicker value={f.insurance_expiry} onChange={(v) => setF({ ...f, insurance_expiry: v })} /></div></div>
  </div><DialogFooter><Button disabled={!f.plate_no || pending} onClick={() => onSubmit(f)}>{pending ? "Saving…" : f.id ? "Save" : "Create"}</Button></DialogFooter></DialogContent>;
}

function DriverDialog({ initial, vehicles, onSubmit, pending }: { initial?: Partial<Driver> | null; vehicles: Vehicle[]; onSubmit: (p: Partial<Driver>) => void; pending: boolean }) {
  const [f, setF] = useState<Partial<Driver>>(initial ?? { is_active: true });
  useEffect(() => { setF(initial ?? { is_active: true }); }, [initial]);
  return <DialogContent><DialogHeader><DialogTitle>{f.id ? "Edit driver" : "Add driver"}</DialogTitle></DialogHeader><div className="space-y-3">
    <div><Label>Full name</Label><Input value={f.full_name ?? ""} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></div>
    <div className="form-grid-2"><div><Label>Phone</Label><Input value={f.phone ?? ""} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div><div><Label>License no.</Label><Input value={f.license_no ?? ""} onChange={(e) => setF({ ...f, license_no: e.target.value })} /></div></div>
    <div className="form-grid-2"><div><Label>License expiry</Label><DatePicker value={f.license_expiry} onChange={(v) => setF({ ...f, license_expiry: v })} /></div><div><Label>Assigned vehicle</Label><Select value={f.vehicle_id ?? "none"} onValueChange={(v) => setF({ ...f, vehicle_id: v === "none" ? null : v })}><SelectTrigger><SelectValue placeholder="None" /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.plate_no}</SelectItem>)}</SelectContent></Select></div></div>
  </div><DialogFooter><Button disabled={!f.full_name || pending} onClick={() => onSubmit(f)}>{pending ? "Saving…" : f.id ? "Save" : "Create"}</Button></DialogFooter></DialogContent>;
}

function RouteDialog({ initial, vehicles, drivers, onSubmit, pending }: { initial?: Partial<RouteRow> | null; vehicles: Vehicle[]; drivers: Driver[]; onSubmit: (p: Partial<RouteRow>) => void; pending: boolean }) {
  const [f, setF] = useState<Partial<RouteRow>>(initial ?? { is_active: true });
  useEffect(() => { setF(initial ?? { is_active: true }); }, [initial]);
  return <DialogContent><DialogHeader><DialogTitle>{f.id ? "Edit route" : "Add route"}</DialogTitle></DialogHeader><div className="space-y-3">
    <div><Label>Name</Label><Input value={f.name ?? ""} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
    <div className="form-grid-2"><div><Label>Pickup</Label><Input value={f.pickup_point ?? ""} onChange={(e) => setF({ ...f, pickup_point: e.target.value })} /></div><div><Label>Dropoff</Label><Input value={f.dropoff_point ?? ""} onChange={(e) => setF({ ...f, dropoff_point: e.target.value })} /></div></div>
    <div><Label>Shift</Label><Input placeholder="morning, night" value={f.shift ?? ""} onChange={(e) => setF({ ...f, shift: e.target.value })} /></div>
    <div className="form-grid-2"><div><Label>Vehicle</Label><Select value={f.vehicle_id ?? "none"} onValueChange={(v) => setF({ ...f, vehicle_id: v === "none" ? null : v })}><SelectTrigger><SelectValue placeholder="None" /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.plate_no}</SelectItem>)}</SelectContent></Select></div><div><Label>Driver</Label><Select value={f.driver_id ?? "none"} onValueChange={(v) => setF({ ...f, driver_id: v === "none" ? null : v })}><SelectTrigger><SelectValue placeholder="None" /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem>{drivers.map((d) => <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>)}</SelectContent></Select></div></div>
  </div><DialogFooter><Button disabled={!f.name || pending} onClick={() => onSubmit(f)}>{pending ? "Saving…" : f.id ? "Save" : "Create"}</Button></DialogFooter></DialogContent>;
}
