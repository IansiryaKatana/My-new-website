import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Room = { id: string; accommodation_id: string; room_no: string; floor: string | null; capacity: number; notes: string | null };
type Building = { id: string; name: string };

export function AccommodationRoomsPanel({ buildings }: { buildings: Building[] }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Room> | null>(null);

  const { data: rooms } = useQuery({
    queryKey: ["accommodation_rooms"],
    queryFn: async () => (await supabase.from("accommodation_rooms").select("*").order("room_no")).data as Room[] ?? [],
  });

  const buildingMap = new Map(buildings.map((b) => [b.id, b]));

  const save = useMutation({
    mutationFn: async (p: Partial<Room>) => {
      if (p.id) {
        const { error } = await supabase.from("accommodation_rooms").update(p as never).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("accommodation_rooms").insert(p as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Room saved");
      setOpen(false);
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["accommodation_rooms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("accommodation_rooms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accommodation_rooms"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Dialog open={open || !!editing} onOpenChange={(o) => { if (!o) { setOpen(false); setEditing(null); } }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditing({ capacity: 4 }); setOpen(true); }}><Plus className="mr-1.5 h-4 w-4" /> Add room</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing?.id ? "Edit room" : "New room"}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-3">
                <div><Label>Building</Label>
                  <Select value={editing.accommodation_id ?? ""} onValueChange={(v) => setEditing({ ...editing, accommodation_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{buildings.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="form-grid-3">
                  <div><Label>Room no.</Label><Input value={editing.room_no ?? ""} onChange={(e) => setEditing({ ...editing, room_no: e.target.value })} /></div>
                  <div><Label>Floor</Label><Input value={editing.floor ?? ""} onChange={(e) => setEditing({ ...editing, floor: e.target.value })} /></div>
                  <div><Label>Capacity</Label><Input type="number" min={1} value={editing.capacity ?? 1} onChange={(e) => setEditing({ ...editing, capacity: Number(e.target.value) })} /></div>
                </div>
              </div>
            )}
            <DialogFooter><Button disabled={!editing?.accommodation_id || !editing?.room_no || save.isPending} onClick={() => save.mutate(editing!)}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="table-shell border-border/60 mt-4">
        <Table>
          <TableHeader><TableRow><TableHead>Building</TableHead><TableHead>Room</TableHead><TableHead>Floor</TableHead><TableHead>Capacity</TableHead><TableHead className="w-20" /></TableRow></TableHeader>
          <TableBody>
            {(rooms ?? []).map((r) => (
              <TableRow key={r.id}>
                <TableCell>{buildingMap.get(r.accommodation_id)?.name ?? "—"}</TableCell>
                <TableCell className="font-medium">{r.room_no}</TableCell>
                <TableCell>{r.floor ?? "—"}</TableCell>
                <TableCell>{r.capacity}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove.mutate(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
