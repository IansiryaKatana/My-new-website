import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkBar } from "@/components/app/BulkBar";
import { BulkEditDialog } from "@/components/app/BulkEditDialog";
import { downloadCsv, toCsv } from "@/components/app/BulkImportDialog";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { getWorkerCompliance } from "@/lib/workflows";

export const Route = createFileRoute("/_app/placements")({
  head: () => ({ meta: [{ title: "Placements — Staffing OS" }] }),
  component: PlacementsPage,
});

type Placement = {
  id: string;
  worker_id: string;
  job_order_id: string;
  client_id: string;
  start_date: string;
  end_date: string | null;
  bill_rate: number | null;
  pay_rate: number | null;
  status: string;
  notes: string | null;
};

const STATUSES = ["proposed", "confirmed", "active", "completed", "terminated", "cancelled"] as const;

function PlacementsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<Placement> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);

  const { data: placements, isLoading } = useQuery({
    queryKey: ["placements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("placements")
        .select("id, worker_id, job_order_id, client_id, start_date, end_date, bill_rate, pay_rate, status, notes")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Placement[];
    },
  });

  const { data: workers } = useQuery({
    queryKey: ["workers-lite"],
    queryFn: async () => {
      const { data } = await supabase.from("workers").select("id, full_name, employee_code").order("full_name");
      return data ?? [];
    },
  });
  const { data: jobOrders } = useQuery({
    queryKey: ["jo-lite"],
    queryFn: async () => {
      const { data } = await supabase.from("job_orders").select("id, reference, title, client_id");
      return data ?? [];
    },
  });
  const { data: clients } = useQuery({
    queryKey: ["clients-lite"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, legal_name").order("legal_name");
      return data ?? [];
    },
  });

  const workerMap = new Map((workers ?? []).map((w) => [w.id, w]));
  const jobMap = new Map((jobOrders ?? []).map((j) => [j.id, j]));
  const clientMap = new Map((clients ?? []).map((c) => [c.id, c]));

  const upsert = useMutation({
    mutationFn: async (payload: Partial<Placement>) => {
      if (payload.worker_id && ["confirmed", "active"].includes(payload.status ?? "")) {
        const c = await getWorkerCompliance(payload.worker_id);
        if (c.ok && !c.complete) {
          const proceed = window.confirm(
            `Worker compliance is incomplete (score ${c.score}/100). Deploy anyway?`,
          );
          if (!proceed) throw new Error("Placement cancelled — complete compliance first");
        }
      }
      if (payload.id) {
        const { error } = await supabase.from("placements").update(payload as never).eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("placements").insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing?.id ? "Placement updated" : "Placement created");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["placements"] });
      qc.invalidateQueries({ queryKey: ["job_orders"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sel = useBulkSelection<Placement>(placements ?? []);
  const bulkRemove = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("placements").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`Deleted ${sel.count}`); setBulkDelete(false); sel.clear(); qc.invalidateQueries({ queryKey: ["placements"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const bulkUpdate = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => {
      const { error } = await supabase.from("placements").update(patch as never).in("id", sel.selectedIds);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`Updated ${sel.count}`); sel.clear(); qc.invalidateQueries({ queryKey: ["placements"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const exportSelected = () => {
    const rows = sel.selectedItems.map((p) => ({
      worker: workerMap.get(p.worker_id)?.full_name ?? "",
      client: clientMap.get(p.client_id)?.legal_name ?? "",
      job: jobMap.get(p.job_order_id)?.reference ?? "",
      start_date: p.start_date, end_date: p.end_date ?? "",
      bill_rate: p.bill_rate, pay_rate: p.pay_rate, status: p.status,
    }));
    downloadCsv(`placements-${Date.now()}.csv`, toCsv(rows as Record<string, unknown>[]));
  };

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("placements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Placement deleted");
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ["placements"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = (placements ?? []).filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const w = workerMap.get(p.worker_id);
    const j = jobMap.get(p.job_order_id);
    const c = clientMap.get(p.client_id);
    return [w?.full_name, w?.employee_code, j?.reference, j?.title, c?.legal_name].some((v) => v?.toLowerCase().includes(q));
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Operations"
        title="Placements"
        description="Active deployments of workers to client job orders."
        actions={
          <Button onClick={() => setEditing({ status: "proposed", start_date: new Date().toISOString().slice(0, 10) })} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-1.5 h-4 w-4" /> New placement
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <div className="relative filter-grow sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search placements…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 bg-background" />
        </div>
        <div className="text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? "placement" : "placements"}</div>
      </div>

      <Card className="table-shell">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Briefcase} title={search ? "No matches" : "No placements yet"} description="Create your first placement to start tracking deployments." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={sel.allSelected ? true : sel.someSelected ? "indeterminate" : false} onCheckedChange={() => sel.toggleAll()} aria-label="Select all" /></TableHead>
                <TableHead>Worker</TableHead>
                <TableHead className="hidden md:table-cell">Client / Job</TableHead>
                <TableHead className="hidden lg:table-cell">Period</TableHead>
                <TableHead className="hidden xl:table-cell">Bill / Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const w = workerMap.get(p.worker_id);
                const j = jobMap.get(p.job_order_id);
                const c = clientMap.get(p.client_id);
                return (
                  <TableRow key={p.id} data-state={sel.isSelected(p.id) ? "selected" : undefined} className="cursor-pointer" onClick={() => setEditing(p)}>
                    <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={sel.isSelected(p.id)} onCheckedChange={() => sel.toggle(p.id)} /></TableCell>
                    <TableCell>
                      <div className="font-medium">{w?.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{w?.employee_code ?? ""}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">{c?.legal_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{j?.reference} · {j?.title}</div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell text-xs">{p.start_date} → {p.end_date ?? "—"}</TableCell>
                    <TableCell className="hidden xl:table-cell text-xs">{p.bill_rate ?? 0} / {p.pay_rate ?? 0}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent form className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{editing?.id ? "Edit placement" : "New placement"}</SheetTitle>
          </SheetHeader>
          {editing && (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!editing.worker_id || !editing.job_order_id || !editing.client_id || !editing.start_date) {
                  toast.error("Worker, job order, client and start date are required");
                  return;
                }
                upsert.mutate(editing);
              }}
            >
              <Field label="Worker *">
                <Select value={editing.worker_id ?? ""} onValueChange={(v) => setEditing({ ...editing, worker_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select worker" /></SelectTrigger>
                  <SelectContent>{(workers ?? []).map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name} ({w.employee_code})</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Job order *">
                <Select value={editing.job_order_id ?? ""} onValueChange={(v) => {
                  const jo = jobMap.get(v);
                  setEditing({ ...editing, job_order_id: v, client_id: jo?.client_id ?? editing.client_id });
                }}>
                  <SelectTrigger><SelectValue placeholder="Select job order" /></SelectTrigger>
                  <SelectContent>{(jobOrders ?? []).map((j) => <SelectItem key={j.id} value={j.id}>{j.reference} · {j.title}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Client *">
                <Select value={editing.client_id ?? ""} onValueChange={(v) => setEditing({ ...editing, client_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>{(clients ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.legal_name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Start date *"><DatePicker value={editing.start_date} onChange={(v) => setEditing({ ...editing, start_date: v })} /></Field>
                <Field label="End date"><DatePicker value={editing.end_date} onChange={(v) => setEditing({ ...editing, end_date: v })} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Bill rate (AED)"><Input type="number" min={0} step="0.01" value={editing.bill_rate ?? 0} onChange={(e) => setEditing({ ...editing, bill_rate: Number(e.target.value) })} /></Field>
                <Field label="Pay rate (AED)"><Input type="number" min={0} step="0.01" value={editing.pay_rate ?? 0} onChange={(e) => setEditing({ ...editing, pay_rate: Number(e.target.value) })} /></Field>
              </div>
              <Field label="Status">
                <Select value={editing.status ?? "proposed"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Notes"><Textarea rows={3} value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></Field>
              <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={upsert.isPending} className="bg-primary hover:bg-primary/90">
                  {upsert.isPending ? "Saving…" : editing.id ? "Save" : "Create"}
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this placement?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BulkBar count={sel.count} onClear={sel.clear} onEdit={() => setBulkEdit(true)} onDelete={() => setBulkDelete(true)} onExport={exportSelected} />
      <BulkEditDialog open={bulkEdit} onOpenChange={setBulkEdit} count={sel.count}
        fields={[{ key: "status", label: "Status", type: "select", options: STATUSES.map((s) => ({ value: s, label: s })) }]}
        onApply={async (p) => { await bulkUpdate.mutateAsync(p); }} />
      <AlertDialog open={bulkDelete} onOpenChange={setBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {sel.count} placement{sel.count === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => bulkRemove.mutate(sel.selectedIds)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}</div>;
}
