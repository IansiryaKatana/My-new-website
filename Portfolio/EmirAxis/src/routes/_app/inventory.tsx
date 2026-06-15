import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Boxes, Plus, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryTransactionsPanel } from "@/components/app/InventoryTransactionsPanel";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/inventory")({
  head: () => ({ meta: [{ title: "Inventory — EmirAxis" }] }),
  component: InventoryPage,
});

type Row = {
  id: string; name: string; sku: string | null; category: string | null;
  unit: string | null; stock_qty: number; low_stock_threshold: number | null;
  unit_cost: number | null; supplier: string | null; is_active: boolean; notes: string | null;
};

function InventoryPage() {
  const { hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const canManage = hasAnyRole(["admin", "manager"]);

  const { data: rows, isLoading } = useQuery({
    queryKey: ["inventory_items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("inventory_items").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const create = useMutation({
    mutationFn: async (p: Partial<Row>) => { const { error } = await supabase.from("inventory_items").insert(p as never); if (error) throw error; },
    onSuccess: () => { toast.success("Item added"); setOpen(false); qc.invalidateQueries({ queryKey: ["inventory_items"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Stock"
        title="Inventory"
        description="Track uniforms, PPE, SIM cards and other stock items."
        actions={canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> New item</Button></DialogTrigger>
            <CreateDialog onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
          </Dialog>
        )}
      />
      <Tabs defaultValue="items">
        <TabsList><TabsTrigger value="items">Stock items</TabsTrigger><TabsTrigger value="movements">Movements</TabsTrigger></TabsList>
        <TabsContent value="movements" className="mt-4"><InventoryTransactionsPanel items={(rows ?? []).map((r) => ({ id: r.id, name: r.name, stock_qty: r.stock_qty }))} /></TabsContent>
        <TabsContent value="items" className="mt-4">
      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6"><Skeleton className="h-10" /></div>
          : !rows?.length ? <div className="p-10"><EmptyState icon={Boxes} title="No inventory" description="Add stock items." /></div>
          : (
          <Table>
            <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>SKU</TableHead><TableHead>Category</TableHead><TableHead>Stock</TableHead><TableHead>Unit cost</TableHead><TableHead>Supplier</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => {
                const low = r.low_stock_threshold != null && r.stock_qty <= r.low_stock_threshold;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-xs">{r.sku ?? "—"}</TableCell>
                    <TableCell className="capitalize">{r.category ?? "—"}</TableCell>
                    <TableCell>{r.stock_qty} {r.unit ?? "pcs"} {low && <Badge variant="destructive" className="ml-1 gap-1"><AlertTriangle className="h-3 w-3" /> Low</Badge>}</TableCell>
                    <TableCell>{r.unit_cost ? `AED ${r.unit_cost}` : "—"}</TableCell>
                    <TableCell>{r.supplier ?? "—"}</TableCell>
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

function CreateDialog({ onSubmit, pending }: { onSubmit: (p: Partial<Row>) => void; pending: boolean }) {
  const [f, setF] = useState<Partial<Row>>({ stock_qty: 0, unit: "pcs", is_active: true });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New inventory item</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Name</Label><Input value={f.name ?? ""} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="form-grid-2"><div><Label>SKU</Label><Input value={f.sku ?? ""} onChange={(e) => setF({ ...f, sku: e.target.value })} /></div><div><Label>Category</Label><Input value={f.category ?? ""} onChange={(e) => setF({ ...f, category: e.target.value })} /></div></div>
        <div className="form-grid-3"><div><Label>Stock</Label><Input type="number" value={f.stock_qty ?? 0} onChange={(e) => setF({ ...f, stock_qty: Number(e.target.value) })} /></div><div><Label>Unit</Label><Input value={f.unit ?? ""} onChange={(e) => setF({ ...f, unit: e.target.value })} /></div><div><Label>Low threshold</Label><Input type="number" value={f.low_stock_threshold ?? ""} onChange={(e) => setF({ ...f, low_stock_threshold: e.target.value ? Number(e.target.value) : null })} /></div></div>
        <div className="form-grid-2"><div><Label>Unit cost</Label><Input type="number" value={f.unit_cost ?? ""} onChange={(e) => setF({ ...f, unit_cost: e.target.value ? Number(e.target.value) : null })} /></div><div><Label>Supplier</Label><Input value={f.supplier ?? ""} onChange={(e) => setF({ ...f, supplier: e.target.value })} /></div></div>
      </div>
      <DialogFooter><Button disabled={!f.name || pending} onClick={() => onSubmit(f)}>{pending ? "Saving…" : "Create"}</Button></DialogFooter>
    </DialogContent>
  );
}
