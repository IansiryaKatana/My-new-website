import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, Plus, Search, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { BulkBar } from "@/components/app/BulkBar";
import { BulkEditDialog } from "@/components/app/BulkEditDialog";
import { BulkImportDialog, downloadCsv, toCsv } from "@/components/app/BulkImportDialog";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_app/job-orders")({
  head: () => ({ meta: [{ title: "Job Orders — Staffing OS" }] }),
  component: JobOrdersPage,
});

type JobOrder = {
  id: string;
  reference: string | null;
  client_id: string;
  title: string;
  category: string | null;
  description: string | null;
  quantity: number;
  filled_count: number;
  location: string | null;
  emirate: string | null;
  contract_type: string | null;
  start_date: string | null;
  end_date: string | null;
  pay_rate: number | null;
  bill_rate: number | null;
  priority: string;
  status: string;
};

const STATUSES = ["draft", "open", "in_progress", "partially_filled", "filled", "on_hold", "cancelled", "closed"];
const PRIORITIES = ["low", "normal", "high", "urgent"];
const CONTRACTS = ["limited", "unlimited", "part_time", "project", "seasonal"];

function JobOrdersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<JobOrder> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);
  const [bulkImport, setBulkImport] = useState(false);

  const { data: clients } = useQuery({
    queryKey: ["clients", "lookup"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, legal_name").order("legal_name");
      if (error) throw error;
      return data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["job_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_orders")
        .select("id, reference, client_id, title, category, description, quantity, filled_count, location, emirate, contract_type, start_date, end_date, pay_rate, bill_rate, priority, status, clients(legal_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as (JobOrder & { clients: { legal_name: string } | null })[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (payload: Partial<JobOrder>) => {
      const clean: Record<string, unknown> = { ...payload };
      if (!clean.start_date) delete clean.start_date;
      if (!clean.end_date) delete clean.end_date;
      if (clean.id) {
        const { error } = await supabase.from("job_orders").update(clean as never).eq("id", clean.id as string);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("job_orders").insert(clean as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing?.id ? "Job order updated" : "Job order created");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["job_orders"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Job order deleted"); setDeleteId(null); qc.invalidateQueries({ queryKey: ["job_orders"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = (data ?? []).filter((j) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return [j.title, j.reference, j.category, j.location, j.clients?.legal_name].some((v) => v?.toLowerCase().includes(q));
  });

  const sel = useBulkSelection<JobOrder>(filtered);
  const bulkRemove = useMutation({
    mutationFn: async (ids: string[]) => { const { error } = await supabase.from("job_orders").delete().in("id", ids); if (error) throw error; },
    onSuccess: () => { toast.success(`Deleted ${sel.count}`); setBulkDelete(false); sel.clear(); qc.invalidateQueries({ queryKey: ["job_orders"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const bulkUpdate = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => { const { error } = await supabase.from("job_orders").update(patch as never).in("id", sel.selectedIds); if (error) throw error; },
    onSuccess: () => { toast.success(`Updated ${sel.count}`); sel.clear(); qc.invalidateQueries({ queryKey: ["job_orders"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const exportSelected = () => {
    const rows = sel.selectedItems.map(({ id: _i, ...rest }) => rest);
    downloadCsv(`job-orders-${Date.now()}.csv`, toCsv(rows as Record<string, unknown>[]));
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Operations"
        title="Job orders"
        description="Live staffing demand from clients — track fulfillment, SLA, and rates."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setBulkImport(true)} disabled={!clients?.length}><Upload className="mr-1.5 h-4 w-4" /> Import CSV</Button>
            <Button
              onClick={() => setEditing({ status: "draft", priority: "normal", quantity: 1, contract_type: "limited" })}
              disabled={!clients?.length}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-1.5 h-4 w-4" /> New job order
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-3">
        <div className="relative filter-grow sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search job orders…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 bg-background" />
        </div>
        <div className="text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? "order" : "orders"}</div>
      </div>

      <Card className="table-shell">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : !clients?.length ? (
          <div className="p-6">
            <EmptyState icon={ClipboardList} title="Add a client first" description="Job orders are placed for a client. Create a client to unlock this module." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={ClipboardList} title={search ? "No matching orders" : "No job orders yet"}
              description={search ? "Try a different term." : "Open your first job order to begin pipelining candidates."}
              action={!search && <Button onClick={() => setEditing({ status: "draft", priority: "normal", quantity: 1, contract_type: "limited" })}><Plus className="mr-1.5 h-4 w-4" /> New job order</Button>} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={sel.allSelected ? true : sel.someSelected ? "indeterminate" : false} onCheckedChange={() => sel.toggleAll()} aria-label="Select all" /></TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Client</TableHead>
                <TableHead className="hidden lg:table-cell">Fill</TableHead>
                <TableHead className="hidden sm:table-cell">Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((j) => (
                <TableRow key={j.id} data-state={sel.isSelected(j.id) ? "selected" : undefined} className="cursor-pointer" onClick={() => setEditing(j)}>
                  <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={sel.isSelected(j.id)} onCheckedChange={() => sel.toggle(j.id)} aria-label={`Select ${j.title}`} /></TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{j.reference ?? "—"}</TableCell>
                  <TableCell>
                    <div className="font-medium">{j.title}</div>
                    {j.category && <div className="text-xs text-muted-foreground">{j.category}</div>}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{j.clients?.legal_name ?? "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{j.filled_count} / {j.quantity}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={j.priority === "urgent" ? "destructive" : j.priority === "high" ? "default" : "secondary"} className="capitalize">{j.priority}</Badge>
                  </TableCell>
                  <TableCell><StatusBadge status={j.status} /></TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(j)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(j.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent form className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{editing?.id ? "Edit job order" : "New job order"}</SheetTitle>
            <SheetDescription>{editing?.reference ? `Reference: ${editing.reference}` : "References auto-generate on save."}</SheetDescription>
          </SheetHeader>
          {editing && (
            <form className="mt-6 space-y-4" onSubmit={(e) => {
              e.preventDefault();
              if (!editing.title?.trim()) { toast.error("Title is required"); return; }
              if (!editing.client_id) { toast.error("Client is required"); return; }
              upsert.mutate(editing);
            }}>
              <Field label="Title *"><Input required value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
              <Field label="Client *">
                <Select value={editing.client_id ?? ""} onValueChange={(v) => setEditing({ ...editing, client_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select client…" /></SelectTrigger>
                  <SelectContent>{(clients ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.legal_name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category"><Input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="e.g. Hospitality" /></Field>
                <Field label="Location"><Input value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Quantity"><Input type="number" min={1} value={editing.quantity ?? 1} onChange={(e) => setEditing({ ...editing, quantity: Number(e.target.value) })} /></Field>
                <Field label="Pay rate"><Input type="number" min={0} step="0.01" value={editing.pay_rate ?? 0} onChange={(e) => setEditing({ ...editing, pay_rate: Number(e.target.value) })} /></Field>
                <Field label="Bill rate"><Input type="number" min={0} step="0.01" value={editing.bill_rate ?? 0} onChange={(e) => setEditing({ ...editing, bill_rate: Number(e.target.value) })} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Start date"><DatePicker value={editing.start_date} onChange={(v) => setEditing({ ...editing, start_date: v })} /></Field>
                <Field label="End date"><DatePicker value={editing.end_date} onChange={(v) => setEditing({ ...editing, end_date: v })} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Contract">
                  <Select value={editing.contract_type ?? "limited"} onValueChange={(v) => setEditing({ ...editing, contract_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CONTRACTS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Priority">
                  <Select value={editing.priority ?? "normal"} onValueChange={(v) => setEditing({ ...editing, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Status">
                  <Select value={editing.status ?? "draft"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Description"><Textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>

              <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={upsert.isPending} className="bg-primary hover:bg-primary/90">{upsert.isPending ? "Saving…" : editing.id ? "Save changes" : "Create job order"}</Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job order?</AlertDialogTitle>
            <AlertDialogDescription>This will cascade-delete linked placements. Candidate records remain.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BulkBar count={sel.count} onClear={sel.clear} onEdit={() => setBulkEdit(true)} onDelete={() => setBulkDelete(true)} onExport={exportSelected} />
      <BulkEditDialog open={bulkEdit} onOpenChange={setBulkEdit} count={sel.count}
        fields={[
          { key: "status", label: "Status", type: "select", options: STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") })) },
          { key: "priority", label: "Priority", type: "select", options: PRIORITIES.map((p) => ({ value: p, label: p })) },
        ]}
        onApply={async (p) => { await bulkUpdate.mutateAsync(p); }} />
      <BulkImportDialog open={bulkImport} onOpenChange={setBulkImport} title="Import job orders"
        columns={["title", "client_id", "category", "location", "quantity", "pay_rate", "bill_rate", "priority", "status"]}
        mapRow={(r) => r.title && r.client_id ? {
          title: r.title, client_id: r.client_id, category: r.category || null, location: r.location || null,
          quantity: r.quantity ? Number(r.quantity) : 1,
          pay_rate: r.pay_rate ? Number(r.pay_rate) : 0,
          bill_rate: r.bill_rate ? Number(r.bill_rate) : 0,
          priority: r.priority || "normal", status: r.status || "draft", contract_type: r.contract_type || "limited",
        } : null}
        onSubmit={async (rows) => { const { error } = await supabase.from("job_orders").insert(rows as never); if (error) throw error; qc.invalidateQueries({ queryKey: ["job_orders"] }); return rows.length; }} />
      <AlertDialog open={bulkDelete} onOpenChange={setBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete {sel.count} job order{sel.count === 1 ? "" : "s"}?</AlertDialogTitle><AlertDialogDescription>This will cascade-delete linked placements.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => bulkRemove.mutate(sel.selectedIds)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete all</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}</div>;
}
