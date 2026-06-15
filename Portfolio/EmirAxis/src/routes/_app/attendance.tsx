import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BulkBar } from "@/components/app/BulkBar";
import { BulkEditDialog } from "@/components/app/BulkEditDialog";
import { downloadCsv, toCsv } from "@/components/app/BulkImportDialog";
import { useBulkSelection } from "@/hooks/use-bulk-selection";

export const Route = createFileRoute("/_app/attendance")({
  head: () => ({ meta: [{ title: "Attendance — Staffing OS" }] }),
  component: AttendancePage,
});

type Att = {
  id: string;
  worker_id: string;
  date: string;
  status: string;
  hours: number;
  overtime_hours: number;
  location: string | null;
};

const STATUSES = ["present", "absent", "leave", "sick", "holiday", "off"] as const;
const STATUS_COLOR: Record<string, string> = {
  present: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  absent: "bg-destructive/15 text-destructive",
  leave: "bg-gold/15 text-gold",
  sick: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  holiday: "bg-primary/15 text-primary",
  off: "bg-muted text-muted-foreground",
};

function AttendancePage() {
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = today.slice(0, 8) + "01";
  const [fromDate, setFromDate] = useState(monthStart);
  const [toDate, setToDate] = useState(today);
  const [editing, setEditing] = useState<Partial<Att> | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);

  const { data: workers } = useQuery({
    queryKey: ["workers-lite"],
    queryFn: async () => (await supabase.from("workers").select("id, full_name, employee_code").order("full_name")).data ?? [],
  });
  const wmap = new Map((workers ?? []).map((w) => [w.id, w]));

  const { data: rows, isLoading } = useQuery({
    queryKey: ["attendance", fromDate, toDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("id, worker_id, date, status, hours, overtime_hours, location")
        .gte("date", fromDate).lte("date", toDate)
        .order("date", { ascending: false });
      if (error) throw error;
      return data as Att[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (payload: Partial<Att>) => {
      if (payload.id) {
        const { error } = await supabase.from("attendance").update(payload as never).eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("attendance").insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Attendance saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("attendance").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["attendance"] });
    },
  });

  const sel = useBulkSelection<Att>(rows ?? []);
  const bulkRemove = useMutation({
    mutationFn: async (ids: string[]) => { const { error } = await supabase.from("attendance").delete().in("id", ids); if (error) throw error; },
    onSuccess: () => { toast.success(`Deleted ${sel.count}`); setBulkDelete(false); sel.clear(); qc.invalidateQueries({ queryKey: ["attendance"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const bulkUpdate = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => { const { error } = await supabase.from("attendance").update(patch as never).in("id", sel.selectedIds); if (error) throw error; },
    onSuccess: () => { toast.success(`Updated ${sel.count}`); sel.clear(); qc.invalidateQueries({ queryKey: ["attendance"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const exportSelected = () => {
    const data = sel.selectedItems.map((r) => ({ date: r.date, worker: wmap.get(r.worker_id)?.full_name ?? "", status: r.status, hours: r.hours, overtime: r.overtime_hours, location: r.location ?? "" }));
    downloadCsv(`attendance-${Date.now()}.csv`, toCsv(data as Record<string, unknown>[]));
  };

  const totalHours = (rows ?? []).reduce((s, r) => s + Number(r.hours ?? 0) + Number(r.overtime_hours ?? 0), 0);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Operations"
        title="Attendance"
        description="Daily attendance and overtime tracking for deployed workers."
        actions={
          <Button onClick={() => setEditing({ date: today, status: "present", hours: 9 })} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-1.5 h-4 w-4" /> Log attendance
          </Button>
        }
      />

      <div className="filter-bar sm:items-end">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">From</Label>
          <DatePicker value={fromDate} onChange={(v) => setFromDate(v ?? fromDate)} clearable={false} className="bg-background" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">To</Label>
          <DatePicker value={toDate} onChange={(v) => setToDate(v ?? toDate)} clearable={false} className="bg-background" />
        </div>
        <div className="text-sm text-muted-foreground sm:ml-auto">
          {rows?.length ?? 0} records · <span className="font-medium text-foreground">{totalHours.toFixed(1)}h</span> total
        </div>
      </div>

      <Card className="table-shell">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (rows?.length ?? 0) === 0 ? (
          <div className="p-6">
            <EmptyState icon={Calendar} title="No attendance in this range" description="Log daily attendance to track worker hours and overtime." />
          </div>
        ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"><Checkbox checked={sel.allSelected ? true : sel.someSelected ? "indeterminate" : false} onCheckedChange={() => sel.toggleAll()} /></TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Worker</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right hidden md:table-cell">OT</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows!.map((r) => {
                  const w = wmap.get(r.worker_id);
                  return (
                    <TableRow key={r.id} data-state={sel.isSelected(r.id) ? "selected" : undefined} className="cursor-pointer" onClick={() => setEditing(r)}>
                      <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={sel.isSelected(r.id)} onCheckedChange={() => sel.toggle(r.id)} /></TableCell>
                      <TableCell className="font-medium">{r.date}</TableCell>
                      <TableCell>{w?.full_name ?? "—"} <span className="text-xs text-muted-foreground">{w?.employee_code}</span></TableCell>
                      <TableCell><Badge className={STATUS_COLOR[r.status] ?? ""}>{r.status}</Badge></TableCell>
                      <TableCell className="text-right tabular-nums">{r.hours}</TableCell>
                      <TableCell className="text-right tabular-nums hidden md:table-cell">{r.overtime_hours}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{r.location ?? "—"}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove.mutate(r.id)}><Trash2 className="h-4 w-4" /></Button>
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
          <SheetHeader><SheetTitle>{editing?.id ? "Edit attendance" : "Log attendance"}</SheetTitle></SheetHeader>
          {editing && (
            <form className="mt-6 space-y-4" onSubmit={(e) => {
              e.preventDefault();
              if (!editing.worker_id || !editing.date) { toast.error("Worker and date required"); return; }
              upsert.mutate(editing);
            }}>
              <Field label="Worker *">
                <Select value={editing.worker_id ?? ""} onValueChange={(v) => setEditing({ ...editing, worker_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select worker" /></SelectTrigger>
                  <SelectContent>{(workers ?? []).map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date *"><DatePicker value={editing.date} onChange={(v) => setEditing({ ...editing, date: v })} /></Field>
                <Field label="Status">
                  <Select value={editing.status ?? "present"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Hours"><Input type="number" min={0} step="0.5" value={editing.hours ?? 0} onChange={(e) => setEditing({ ...editing, hours: Number(e.target.value) })} /></Field>
                <Field label="Overtime"><Input type="number" min={0} step="0.5" value={editing.overtime_hours ?? 0} onChange={(e) => setEditing({ ...editing, overtime_hours: Number(e.target.value) })} /></Field>
              </div>
              <Field label="Location"><Input value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} placeholder="Site or project" /></Field>
              <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={upsert.isPending} className="bg-primary">{upsert.isPending ? "Saving…" : "Save"}</Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      <BulkBar count={sel.count} onClear={sel.clear} onEdit={() => setBulkEdit(true)} onDelete={() => setBulkDelete(true)} onExport={exportSelected} />
      <BulkEditDialog open={bulkEdit} onOpenChange={setBulkEdit} count={sel.count}
        fields={[{ key: "status", label: "Status", type: "select", options: STATUSES.map((s) => ({ value: s, label: s })) }]}
        onApply={async (p) => { await bulkUpdate.mutateAsync(p); }} />
      <AlertDialog open={bulkDelete} onOpenChange={setBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {sel.count} record{sel.count === 1 ? "" : "s"}?</AlertDialogTitle>
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
