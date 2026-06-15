import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, Plus, CheckCircle2, XCircle } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BulkBar } from "@/components/app/BulkBar";
import { BulkEditDialog } from "@/components/app/BulkEditDialog";
import { downloadCsv, toCsv } from "@/components/app/BulkImportDialog";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { useAuth } from "@/lib/auth/AuthProvider";

export const Route = createFileRoute("/_app/timesheets")({
  head: () => ({ meta: [{ title: "Timesheets — Staffing OS" }] }),
  component: TimesheetsPage,
});

type TS = {
  id: string;
  worker_id: string;
  placement_id: string | null;
  period_start: string;
  period_end: string;
  total_hours: number;
  overtime_hours: number;
  total_amount: number;
  status: string;
};

function TimesheetsPage() {
  const qc = useQueryClient();
  const { hasAnyRole } = useAuth();
  const canApprove = hasAnyRole(["admin", "manager"]);
  const [editing, setEditing] = useState<Partial<TS> | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);
  const TS_STATUSES = ["draft", "submitted", "approved", "rejected", "invoiced"];

  const { data: rows, isLoading } = useQuery({
    queryKey: ["timesheets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timesheets")
        .select("id, worker_id, placement_id, period_start, period_end, total_hours, overtime_hours, total_amount, status")
        .order("period_start", { ascending: false });
      if (error) throw error;
      return data as TS[];
    },
  });

  const { data: workers } = useQuery({
    queryKey: ["workers-lite"],
    queryFn: async () => (await supabase.from("workers").select("id, full_name, employee_code, base_salary").order("full_name")).data ?? [],
  });
  const wmap = new Map((workers ?? []).map((w) => [w.id, w]));

  const upsert = useMutation({
    mutationFn: async (p: Partial<TS>) => {
      if (p.id) {
        const { error } = await supabase.from("timesheets").update(p as never).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("timesheets").insert(p as never);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["timesheets"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const patch: Record<string, unknown> = { status };
      if (status === "approved") { patch.approved_at = new Date().toISOString(); }
      if (status === "submitted") { patch.submitted_at = new Date().toISOString(); }
      const { error } = await supabase.from("timesheets").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["timesheets"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const sel = useBulkSelection<TS>(rows ?? []);
  const bulkRemove = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("timesheets").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`Deleted ${sel.count}`); setBulkDelete(false); sel.clear(); qc.invalidateQueries({ queryKey: ["timesheets"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const bulkUpdate = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => {
      const { error } = await supabase.from("timesheets").update(patch as never).in("id", sel.selectedIds);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`Updated ${sel.count}`); sel.clear(); qc.invalidateQueries({ queryKey: ["timesheets"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const exportSelected = () => {
    const data = sel.selectedItems.map((r) => ({
      worker: wmap.get(r.worker_id)?.full_name ?? "",
      period: `${r.period_start} → ${r.period_end}`,
      hours: r.total_hours, overtime: r.overtime_hours, amount: r.total_amount, status: r.status,
    }));
    downloadCsv(`timesheets-${Date.now()}.csv`, toCsv(data as Record<string, unknown>[]));
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Operations"
        title="Timesheets"
        description="Weekly / monthly timesheets — submit, approve, then send to payroll."
        actions={
          <Button onClick={() => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
            setEditing({ period_start: start, period_end: end, status: "draft", total_hours: 0, overtime_hours: 0, total_amount: 0 });
          }} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-1.5 h-4 w-4" /> New timesheet
          </Button>
        }
      />

      <Card className="table-shell">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (rows?.length ?? 0) === 0 ? (
          <div className="p-6"><EmptyState icon={ClipboardList} title="No timesheets" description="Create a timesheet to record hours for payroll." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={sel.allSelected ? true : sel.someSelected ? "indeterminate" : false} onCheckedChange={() => sel.toggleAll()} /></TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right hidden md:table-cell">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-40" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows!.map((r) => {
                const w = wmap.get(r.worker_id);
                return (
                  <TableRow key={r.id} data-state={sel.isSelected(r.id) ? "selected" : undefined} className="cursor-pointer" onClick={() => setEditing(r)}>
                    <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={sel.isSelected(r.id)} onCheckedChange={() => sel.toggle(r.id)} /></TableCell>
                    <TableCell>{w?.full_name ?? "—"} <span className="text-xs text-muted-foreground">{w?.employee_code}</span></TableCell>
                    <TableCell className="text-sm">{r.period_start} → {r.period_end}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.total_hours} <span className="text-xs text-muted-foreground">+{r.overtime_hours}</span></TableCell>
                    <TableCell className="text-right tabular-nums hidden md:table-cell">AED {Number(r.total_amount).toFixed(2)}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {r.status === "draft" && (
                          <Button size="sm" variant="outline" onClick={() => setStatus.mutate({ id: r.id, status: "submitted" })}>Submit</Button>
                        )}
                        {r.status === "submitted" && canApprove && (
                          <>
                            <Button size="icon" variant="ghost" className="text-emerald-600" onClick={() => setStatus.mutate({ id: r.id, status: "approved" })}><CheckCircle2 className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setStatus.mutate({ id: r.id, status: "rejected" })}><XCircle className="h-4 w-4" /></Button>
                          </>
                        )}
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
        <SheetContent form className="w-full sm:max-w-md">
          <SheetHeader><SheetTitle>{editing?.id ? "Edit timesheet" : "New timesheet"}</SheetTitle></SheetHeader>
          {editing && (
            <form className="mt-6 space-y-4" onSubmit={(e) => {
              e.preventDefault();
              if (!editing.worker_id || !editing.period_start || !editing.period_end) { toast.error("Worker and period required"); return; }
              upsert.mutate(editing);
            }}>
              <Field label="Worker *">
                <Select value={editing.worker_id ?? ""} onValueChange={(v) => setEditing({ ...editing, worker_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select worker" /></SelectTrigger>
                  <SelectContent>{(workers ?? []).map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Period start *"><DatePicker value={editing.period_start} onChange={(v) => setEditing({ ...editing, period_start: v })} /></Field>
                <Field label="Period end *"><DatePicker value={editing.period_end} onChange={(v) => setEditing({ ...editing, period_end: v })} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Total hours"><Input type="number" min={0} step="0.5" value={editing.total_hours ?? 0} onChange={(e) => setEditing({ ...editing, total_hours: Number(e.target.value) })} /></Field>
                <Field label="Overtime hours"><Input type="number" min={0} step="0.5" value={editing.overtime_hours ?? 0} onChange={(e) => setEditing({ ...editing, overtime_hours: Number(e.target.value) })} /></Field>
              </div>
              <Field label="Total amount (AED)"><Input type="number" min={0} step="0.01" value={editing.total_amount ?? 0} onChange={(e) => setEditing({ ...editing, total_amount: Number(e.target.value) })} /></Field>
              <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={upsert.isPending} className="bg-primary">{upsert.isPending ? "Saving…" : "Save"}</Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      <BulkBar count={sel.count} onClear={sel.clear} onEdit={canApprove ? () => setBulkEdit(true) : undefined} onDelete={canApprove ? () => setBulkDelete(true) : undefined} onExport={exportSelected} />
      <BulkEditDialog open={bulkEdit} onOpenChange={setBulkEdit} count={sel.count}
        fields={[{ key: "status", label: "Status", type: "select", options: TS_STATUSES.map((s) => ({ value: s, label: s })) }]}
        onApply={async (p) => { await bulkUpdate.mutateAsync(p); }} />
      <AlertDialog open={bulkDelete} onOpenChange={setBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {sel.count} timesheet{sel.count === 1 ? "" : "s"}?</AlertDialogTitle>
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
