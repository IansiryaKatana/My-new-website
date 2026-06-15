import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/assets")({
  head: () => ({ meta: [{ title: "Uniforms & Assets — EmirAxis" }] }),
  component: AssetsPage,
});

const STATUSES = ["issued","returned","lost","damaged"];

type Row = {
  id: string; worker_id: string; item_name: string; category: string | null;
  size: string | null; quantity: number; status: string; issue_date: string;
  return_date: string | null; deduction_amount: number | null; acknowledged: boolean;
};

function AssetsPage() {
  const { user, hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const canManage = hasAnyRole(["admin", "manager"]);

  const { data: workers } = useQuery({
    queryKey: ["workers-lite"],
    queryFn: async () => (await supabase.from("workers").select("id, full_name, employee_code").order("full_name")).data ?? [],
  });
  const workerMap = new Map((workers ?? []).map((w) => [w.id, w]));

  const { data: rows, isLoading } = useQuery({
    queryKey: ["asset_issuances"],
    queryFn: async () => {
      const { data, error } = await supabase.from("asset_issuances").select("*").order("issue_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const create = useMutation({
    mutationFn: async (p: Partial<Row>) => {
      const { error } = await supabase.from("asset_issuances").insert({ ...p, issued_by: user?.id } as never);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Asset issued"); setOpen(false); qc.invalidateQueries({ queryKey: ["asset_issuances"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Row> }) => {
      const { error } = await supabase.from("asset_issuances").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["asset_issuances"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Workforce"
        title="Uniforms & Assets"
        description="Track uniforms, PPE, SIM cards, and other items issued to workers."
        actions={canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> Issue asset</Button></DialogTrigger>
            <CreateDialog workers={workers ?? []} onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
          </Dialog>
        )}
      />
      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6"><Skeleton className="h-10" /></div>
          : !rows?.length ? <div className="p-10"><EmptyState icon={Package} title="No assets issued" description="Issue uniforms or equipment to workers." /></div>
          : (
          <Table>
            <TableHeader><TableRow><TableHead>Worker</TableHead><TableHead>Item</TableHead><TableHead>Size</TableHead><TableHead>Qty</TableHead><TableHead>Issued</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{workerMap.get(r.worker_id)?.full_name ?? "—"}</TableCell>
                  <TableCell>{r.item_name}<div className="text-xs text-muted-foreground capitalize">{r.category}</div></TableCell>
                  <TableCell>{r.size ?? "—"}</TableCell>
                  <TableCell>{r.quantity}</TableCell>
                  <TableCell className="text-xs">{r.issue_date}</TableCell>
                  <TableCell>{canManage ? (
                    <Select value={r.status} onValueChange={(v) => update.mutate({ id: r.id, patch: { status: v, return_date: v === "returned" ? new Date().toISOString().slice(0, 10) : r.return_date } })}>
                      <SelectTrigger className="h-7 w-28 text-xs"><SelectValue /></SelectTrigger>
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
  const [form, setForm] = useState<Partial<Row>>({ status: "issued", quantity: 1, issue_date: new Date().toISOString().slice(0, 10) });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Issue asset</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Worker</Label>
          <Select value={form.worker_id ?? ""} onValueChange={(v) => setForm({ ...form, worker_id: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{workers.map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="form-grid-2">
          <div><Label>Item</Label><Input value={form.item_name ?? ""} onChange={(e) => setForm({ ...form, item_name: e.target.value })} /></div>
          <div><Label>Category</Label><Input placeholder="uniform, ppe, sim" value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
        </div>
        <div className="form-grid-3">
          <div><Label>Size</Label><Input value={form.size ?? ""} onChange={(e) => setForm({ ...form, size: e.target.value })} /></div>
          <div><Label>Qty</Label><Input type="number" value={form.quantity ?? 1} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} /></div>
          <div><Label>Deduction</Label><Input type="number" value={form.deduction_amount ?? ""} onChange={(e) => setForm({ ...form, deduction_amount: e.target.value ? Number(e.target.value) : null })} /></div>
        </div>
      </div>
      <DialogFooter><Button disabled={!form.worker_id || !form.item_name || pending} onClick={() => onSubmit(form)}>{pending ? "Saving…" : "Issue"}</Button></DialogFooter>
    </DialogContent>
  );
}
