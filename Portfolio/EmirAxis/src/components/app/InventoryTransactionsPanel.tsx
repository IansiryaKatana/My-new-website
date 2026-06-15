import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const TXN_TYPES = ["in", "out", "adjust", "return", "damage"] as const;

export function InventoryTransactionsPanel({ items }: { items: { id: string; name: string; stock_qty: number }[] }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: txns } = useQuery({
    queryKey: ["inventory_transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_transactions")
        .select("*, inventory_items(name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async (p: { item_id: string; txn_type: string; quantity: number; reference?: string; notes?: string }) => {
      const { error } = await supabase.from("inventory_transactions").insert({
        ...p,
        recorded_by: user?.id,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Transaction recorded — stock updated");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["inventory_transactions"] });
      qc.invalidateQueries({ queryKey: ["inventory_items"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Stock movement</Button></DialogTrigger>
          <TxnDialog items={items} onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
        </Dialog>
      </div>
      <Card className="table-shell border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Ref</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(txns ?? []).map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-xs">{format(new Date(t.created_at), "PP p")}</TableCell>
                <TableCell>{(t.inventory_items as { name: string } | null)?.name ?? "—"}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{t.txn_type}</Badge></TableCell>
                <TableCell>{t.quantity}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{t.reference ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function TxnDialog({ items, onSubmit, pending }: { items: { id: string; name: string }[]; onSubmit: (p: { item_id: string; txn_type: string; quantity: number; reference?: string; notes?: string }) => void; pending: boolean }) {
  const [f, setF] = useState({ item_id: "", txn_type: "in", quantity: 1, reference: "", notes: "" });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Record stock movement</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Item</Label>
          <Select value={f.item_id} onValueChange={(v) => setF({ ...f, item_id: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{items.map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="form-grid-2">
          <div><Label>Type</Label>
            <Select value={f.txn_type} onValueChange={(v) => setF({ ...f, txn_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TXN_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Quantity</Label><Input type="number" min={1} value={f.quantity} onChange={(e) => setF({ ...f, quantity: Number(e.target.value) })} /></div>
        </div>
        <div><Label>Reference</Label><Input value={f.reference} onChange={(e) => setF({ ...f, reference: e.target.value })} /></div>
      </div>
      <DialogFooter><Button disabled={!f.item_id || pending} onClick={() => onSubmit(f)}>{pending ? "Saving…" : "Record"}</Button></DialogFooter>
    </DialogContent>
  );
}
