import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus, BedDouble } from "lucide-react";
import { AccommodationRoomsPanel } from "@/components/app/AccommodationRoomsPanel";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/accommodations")({
  head: () => ({ meta: [{ title: "Accommodations — EmirAxis" }] }),
  component: AccommodationsPage,
});

type Building = { id: string; name: string; address: string | null; emirate: string | null; city: string | null; building_type: string | null; monthly_rent: number | null; is_active: boolean };
type Room = { id: string; accommodation_id: string; room_no: string; floor: string | null; capacity: number; notes: string | null };
type Bed = { id: string; room_id: string; worker_id: string; bed_no: string | null; check_in: string; check_out: string | null; is_active: boolean };

function AccommodationsPage() {
  const { hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const canManage = hasAnyRole(["admin", "manager"]);
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const { data: buildings, isLoading } = useQuery({
    queryKey: ["accommodations"],
    queryFn: async () => (await supabase.from("accommodations").select("*").order("name")).data as Building[] | null ?? [],
  });
  const { data: rooms } = useQuery({
    queryKey: ["accommodation_rooms"],
    queryFn: async () => (await supabase.from("accommodation_rooms").select("*").order("room_no")).data as Room[] | null ?? [],
  });
  const { data: beds } = useQuery({
    queryKey: ["bed_assignments"],
    queryFn: async () => (await supabase.from("bed_assignments").select("*").eq("is_active", true)).data as Bed[] | null ?? [],
  });
  const { data: workers } = useQuery({
    queryKey: ["workers-lite"],
    queryFn: async () => (await supabase.from("workers").select("id, full_name").order("full_name")).data ?? [],
  });
  const workerMap = new Map((workers ?? []).map((w) => [w.id, w]));

  const createBuilding = useMutation({
    mutationFn: async (p: Partial<Building>) => { const { error } = await supabase.from("accommodations").insert(p as never); if (error) throw error; },
    onSuccess: () => { toast.success("Building added"); setOpen(false); qc.invalidateQueries({ queryKey: ["accommodations"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const createAssignment = useMutation({
    mutationFn: async (p: Partial<Bed>) => { const { error } = await supabase.from("bed_assignments").insert(p as never); if (error) throw error; },
    onSuccess: () => { toast.success("Bed assigned"); setAssignOpen(false); qc.invalidateQueries({ queryKey: ["bed_assignments"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Workforce"
        title="Accommodations"
        description="Manage buildings, rooms, beds and worker assignments."
        actions={canManage && (
          <div className="flex gap-2">
            <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
              <DialogTrigger asChild><Button variant="outline"><BedDouble className="mr-1.5 h-4 w-4" /> Assign bed</Button></DialogTrigger>
              <AssignBedDialog rooms={rooms ?? []} buildings={buildings ?? []} workers={workers ?? []} onSubmit={(p) => createAssignment.mutate(p)} pending={createAssignment.isPending} />
            </Dialog>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> New building</Button></DialogTrigger>
              <BuildingDialog onSubmit={(p) => createBuilding.mutate(p)} pending={createBuilding.isPending} />
            </Dialog>
          </div>
        )}
      />
      <Tabs defaultValue="buildings">
        <TabsList><TabsTrigger value="buildings">Buildings</TabsTrigger><TabsTrigger value="rooms">Rooms</TabsTrigger><TabsTrigger value="assignments">Bed Assignments</TabsTrigger></TabsList>
        <TabsContent value="buildings">
          <Card className="border-border/60 mt-4">
            {isLoading ? <div className="p-6"><Skeleton className="h-10" /></div>
              : !buildings?.length ? <div className="p-10"><EmptyState icon={Building2} title="No accommodations" description="Add a building to get started." /></div>
              : (
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Emirate</TableHead><TableHead>Type</TableHead><TableHead>Rooms</TableHead><TableHead>Beds occupied</TableHead><TableHead>Rent (AED)</TableHead></TableRow></TableHeader>
                <TableBody>
                  {buildings.map((b) => {
                    const buildingRooms = (rooms ?? []).filter((r) => r.accommodation_id === b.id);
                    const occupied = (beds ?? []).filter((bd) => buildingRooms.some((r) => r.id === bd.room_id)).length;
                    return (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.name}<div className="text-xs text-muted-foreground">{b.address}</div></TableCell>
                        <TableCell>{b.emirate ?? "—"}</TableCell>
                        <TableCell className="capitalize">{b.building_type ?? "—"}</TableCell>
                        <TableCell>{buildingRooms.length}</TableCell>
                        <TableCell>{occupied}</TableCell>
                        <TableCell>{b.monthly_rent ? Number(b.monthly_rent).toLocaleString() : "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="rooms">
          <AccommodationRoomsPanel buildings={buildings ?? []} />
        </TabsContent>
        <TabsContent value="assignments">
          <Card className="border-border/60 mt-4">
            {!beds?.length ? <div className="p-10"><EmptyState icon={BedDouble} title="No active assignments" description="Assign workers to beds." /></div>
              : (
              <Table>
                <TableHeader><TableRow><TableHead>Worker</TableHead><TableHead>Building</TableHead><TableHead>Room</TableHead><TableHead>Bed</TableHead><TableHead>Check-in</TableHead></TableRow></TableHeader>
                <TableBody>
                  {beds.map((bd) => {
                    const room = (rooms ?? []).find((r) => r.id === bd.room_id);
                    const building = room ? (buildings ?? []).find((b) => b.id === room.accommodation_id) : null;
                    return (
                      <TableRow key={bd.id}>
                        <TableCell className="font-medium">{workerMap.get(bd.worker_id)?.full_name ?? "—"}</TableCell>
                        <TableCell>{building?.name ?? "—"}</TableCell>
                        <TableCell>{room?.room_no ?? "—"}</TableCell>
                        <TableCell>{bd.bed_no ?? "—"}</TableCell>
                        <TableCell className="text-xs">{bd.check_in}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BuildingDialog({ onSubmit, pending }: { onSubmit: (p: Partial<Building>) => void; pending: boolean }) {
  const [form, setForm] = useState<Partial<Building>>({ is_active: true });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New building</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Name</Label><Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><Label>Address</Label><Input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <div className="form-grid-2">
          <div><Label>Emirate</Label><Input value={form.emirate ?? ""} onChange={(e) => setForm({ ...form, emirate: e.target.value })} /></div>
          <div><Label>City</Label><Input value={form.city ?? ""} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
        </div>
        <div className="form-grid-2">
          <div><Label>Type</Label><Input placeholder="villa, flat, camp" value={form.building_type ?? ""} onChange={(e) => setForm({ ...form, building_type: e.target.value })} /></div>
          <div><Label>Monthly rent</Label><Input type="number" value={form.monthly_rent ?? ""} onChange={(e) => setForm({ ...form, monthly_rent: e.target.value ? Number(e.target.value) : null })} /></div>
        </div>
      </div>
      <DialogFooter><Button disabled={!form.name || pending} onClick={() => onSubmit(form)}>{pending ? "Saving…" : "Create"}</Button></DialogFooter>
    </DialogContent>
  );
}

function AssignBedDialog({ rooms, buildings, workers, onSubmit, pending }: { rooms: Room[]; buildings: Building[]; workers: { id: string; full_name: string }[]; onSubmit: (p: Partial<Bed>) => void; pending: boolean }) {
  const [form, setForm] = useState<Partial<Bed>>({ check_in: new Date().toISOString().slice(0, 10), is_active: true });
  const buildingMap = new Map(buildings.map((b) => [b.id, b]));
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Assign bed</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Worker</Label>
          <Select value={form.worker_id ?? ""} onValueChange={(v) => setForm({ ...form, worker_id: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{workers.map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Room</Label>
          <Select value={form.room_id ?? ""} onValueChange={(v) => setForm({ ...form, room_id: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{rooms.map((r) => <SelectItem key={r.id} value={r.id}>{buildingMap.get(r.accommodation_id)?.name ?? "?"} — Room {r.room_no}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="form-grid-2">
          <div><Label>Bed no.</Label><Input value={form.bed_no ?? ""} onChange={(e) => setForm({ ...form, bed_no: e.target.value })} /></div>
          <div><Label>Check-in</Label><DatePicker value={form.check_in} onChange={(v) => setForm({ ...form, check_in: v })} /></div>
        </div>
      </div>
      <DialogFooter><Button disabled={!form.worker_id || !form.room_id || pending} onClick={() => onSubmit(form)}>{pending ? "Assigning…" : "Assign"}</Button></DialogFooter>
    </DialogContent>
  );
}
