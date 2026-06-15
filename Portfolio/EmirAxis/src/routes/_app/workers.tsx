import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Plus, Search, Pencil, Trash2, AlertTriangle, Upload } from "lucide-react";
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
import { BankCombobox } from "@/components/app/BankCombobox";
import { NationalityCombobox } from "@/components/app/NationalityCombobox";
import { DepartmentCombobox } from "@/components/app/DepartmentCombobox";
import { PhoneInput } from "@/components/ui/phone-input";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { WorkerAvatarField, WorkerAvatar } from "@/components/app/WorkerAvatarField";
import { WorkerDocumentsPanel } from "@/components/app/WorkerDocumentsPanel";
import { WorkerCompliancePanel } from "@/components/app/WorkerCompliancePanel";

export const Route = createFileRoute("/_app/workers")({
  head: () => ({ meta: [{ title: "Workers — Staffing OS" }] }),
  component: WorkersPage,
});

type Worker = {
  id: string;
  employee_code: string | null;
  avatar_url: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  designation: string | null;
  department: string | null;
  joining_date: string | null;
  contract_start: string | null;
  contract_end: string | null;
  base_salary: number | null;
  housing_allowance: number | null;
  transport_allowance: number | null;
  other_allowance: number | null;
  passport_no: string | null;
  passport_expiry: string | null;
  emirates_id: string | null;
  emirates_id_expiry: string | null;
  visa_number: string | null;
  visa_expiry: string | null;
  labor_card_no: string | null;
  labor_card_expiry: string | null;
  medical_expiry: string | null;
  insurance_expiry: string | null;
  bank_name: string | null;
  iban: string | null;
  wps_personal_id: string | null;
  status: string;
};

const STATUSES = ["onboarding", "active", "on_leave", "suspended", "terminated", "absconded", "exited"];

function daysUntil(date: string | null) {
  if (!date) return null;
  const d = new Date(date).getTime();
  const now = Date.now();
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

function ExpiryCell({ date }: { date: string | null }) {
  if (!date) return <span className="text-muted-foreground">—</span>;
  const days = daysUntil(date);
  if (days === null) return <span className="text-muted-foreground">—</span>;
  const expired = days < 0;
  const soon = days >= 0 && days <= 30;
  return (
    <span className={expired ? "text-destructive font-medium" : soon ? "text-warning font-medium" : "text-muted-foreground"}>
      {expired ? `Expired ${-days}d ago` : soon ? `${days}d left` : date}
    </span>
  );
}

function WorkersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<Partial<Worker> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);
  const [bulkImport, setBulkImport] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["workers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Worker[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (payload: Partial<Worker>) => {
      const clean: Record<string, unknown> = { ...payload };
      // Strip empty date strings to nulls
      for (const k of ["joining_date","contract_start","contract_end","passport_expiry","emirates_id_expiry","visa_expiry","labor_card_expiry","medical_expiry","insurance_expiry","avatar_url"]) {
        if (clean[k] === "") clean[k] = null;
      }
      if (clean.id) {
        const { error } = await supabase.from("workers").update(clean as never).eq("id", payload.id!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("workers").insert(clean as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing?.id ? "Worker updated" : "Worker created");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["workers"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("workers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Worker deleted"); setDeleteId(null); qc.invalidateQueries({ queryKey: ["workers"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = (data ?? []).filter((w) => {
    if (statusFilter !== "all" && w.status !== statusFilter) return false;
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return [w.full_name, w.employee_code, w.email, w.phone, w.passport_no, w.emirates_id, w.designation].some((v) => v?.toLowerCase().includes(q));
  });

  const sel = useBulkSelection<Worker>(filtered);
  const bulkRemove = useMutation({
    mutationFn: async (ids: string[]) => { const { error } = await supabase.from("workers").delete().in("id", ids); if (error) throw error; },
    onSuccess: () => { toast.success(`Deleted ${sel.count}`); setBulkDelete(false); sel.clear(); qc.invalidateQueries({ queryKey: ["workers"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const bulkUpdate = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => { const { error } = await supabase.from("workers").update(patch as never).in("id", sel.selectedIds); if (error) throw error; },
    onSuccess: () => { toast.success(`Updated ${sel.count}`); sel.clear(); qc.invalidateQueries({ queryKey: ["workers"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const exportSelected = () => {
    const rows = sel.selectedItems.map(({ id: _i, ...rest }) => rest);
    downloadCsv(`workers-${Date.now()}.csv`, toCsv(rows as Record<string, unknown>[]));
  };

  const expiringSoon = (data ?? []).filter((w) => {
    const dates = [w.passport_expiry, w.visa_expiry, w.labor_card_expiry, w.medical_expiry, w.emirates_id_expiry];
    return dates.some((d) => {
      const days = daysUntil(d);
      return days !== null && days <= 30;
    });
  }).length;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Operations"
        title="Workers"
        description="Active and onboarding workforce — contracts, salary structure, visa & labor compliance."
        actions={<div className="flex gap-2"><Button variant="outline" onClick={() => setBulkImport(true)}><Upload className="mr-1.5 h-4 w-4" /> Import CSV</Button><Button onClick={() => setEditing({ status: "onboarding", base_salary: 0 })} className="bg-primary hover:bg-primary/90"><Plus className="mr-1.5 h-4 w-4" /> New worker</Button></div>}
      />

      {expiringSoon > 0 && (
        <Card className="border-warning/30 bg-warning/10 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-warning/20 text-warning"><AlertTriangle className="h-4 w-4" /></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{expiringSoon} worker{expiringSoon === 1 ? "" : "s"} with expiring documents</div>
              <div className="text-xs text-muted-foreground">Passport, visa, labor card, medical, or Emirates ID expires within 30 days.</div>
            </div>
          </div>
        </Card>
      )}

      <div className="filter-bar">
        <div className="relative filter-grow sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, code, passport…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 bg-background" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full bg-background sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="text-xs text-muted-foreground sm:ml-auto">{filtered.length} {filtered.length === 1 ? "worker" : "workers"}</div>
      </div>

      <Card className="table-shell">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Users} title={search || statusFilter !== "all" ? "No matching workers" : "No workers yet"}
              description={search || statusFilter !== "all" ? "Try adjusting filters." : "Onboard your first worker. Hired candidates can be converted directly."}
              action={!(search || statusFilter !== "all") && <Button onClick={() => setEditing({ status: "onboarding", base_salary: 0 })}><Plus className="mr-1.5 h-4 w-4" /> New worker</Button>} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={sel.allSelected ? true : sel.someSelected ? "indeterminate" : false} onCheckedChange={() => sel.toggleAll()} aria-label="Select all" /></TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead className="hidden md:table-cell">Designation</TableHead>
                <TableHead className="hidden lg:table-cell">Visa expiry</TableHead>
                <TableHead className="hidden xl:table-cell">Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((w) => (
                <TableRow key={w.id} data-state={sel.isSelected(w.id) ? "selected" : undefined} className="cursor-pointer" onClick={() => setEditing(w)}>
                  <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={sel.isSelected(w.id)} onCheckedChange={() => sel.toggle(w.id)} aria-label={`Select ${w.full_name}`} /></TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{w.employee_code ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <WorkerAvatar name={w.full_name} url={w.avatar_url} />
                      <div className="min-w-0">
                        <div className="font-medium">{w.full_name}</div>
                        <div className="text-xs text-muted-foreground">{w.nationality ?? "—"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{w.designation ?? "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm"><ExpiryCell date={w.visa_expiry} /></TableCell>
                  <TableCell className="hidden text-muted-foreground xl:table-cell">AED {((w.base_salary ?? 0) + (w.housing_allowance ?? 0) + (w.transport_allowance ?? 0) + (w.other_allowance ?? 0)).toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={w.status} /></TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(w)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(w.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent form className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{editing?.id ? "Edit worker" : "New worker"}</SheetTitle>
            <SheetDescription>{editing?.employee_code ? `Employee code: ${editing.employee_code}` : "Employee code auto-generates on save."}</SheetDescription>
          </SheetHeader>
          {editing && (
            <form className="mt-6" onSubmit={(e) => {
              e.preventDefault();
              if (!editing.full_name?.trim()) { toast.error("Full name is required"); return; }
              upsert.mutate(editing);
            }}>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-5">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="employment">Employment</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="payroll">Payroll</TabsTrigger>
                  <TabsTrigger value="documents" disabled={!editing.id}>Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 pt-4">
                  <WorkerAvatarField
                    value={editing.avatar_url}
                    fullName={editing.full_name}
                    workerId={editing.id}
                    onChange={(url) => setEditing({ ...editing, avatar_url: url })}
                  />
                  <Field label="Full name *"><Input required value={editing.full_name ?? ""} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} /></Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Email"><Input type="email" value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></Field>
                    <Field label="Phone"><PhoneInput value={editing.phone} onChange={(v) => setEditing({ ...editing, phone: v ?? null })} /></Field>
                  </div>
                  <Field label="Nationality"><NationalityCombobox value={editing.nationality} onChange={(v) => setEditing({ ...editing, nationality: v })} /></Field>
                </TabsContent>

                <TabsContent value="employment" className="space-y-4 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Designation"><Input value={editing.designation ?? ""} onChange={(e) => setEditing({ ...editing, designation: e.target.value })} /></Field>
                    <Field label="Department"><DepartmentCombobox value={editing.department} onChange={(v) => setEditing({ ...editing, department: v })} /></Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Joining date"><DatePicker value={editing.joining_date} onChange={(v) => setEditing({ ...editing, joining_date: v })} /></Field>
                    <Field label="Contract start"><DatePicker value={editing.contract_start} onChange={(v) => setEditing({ ...editing, contract_start: v })} /></Field>
                    <Field label="Contract end"><DatePicker value={editing.contract_end} onChange={(v) => setEditing({ ...editing, contract_end: v })} /></Field>
                  </div>
                  <Field label="Status">
                    <Select value={editing.status ?? "onboarding"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                </TabsContent>

                <TabsContent value="compliance" className="space-y-4 pt-4">
                  {editing.id ? <WorkerCompliancePanel workerId={editing.id} /> : null}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Passport #"><Input value={editing.passport_no ?? ""} onChange={(e) => setEditing({ ...editing, passport_no: e.target.value })} /></Field>
                    <Field label="Passport expiry"><DatePicker value={editing.passport_expiry} onChange={(v) => setEditing({ ...editing, passport_expiry: v })} /></Field>
                    <Field label="Emirates ID"><Input value={editing.emirates_id ?? ""} onChange={(e) => setEditing({ ...editing, emirates_id: e.target.value })} /></Field>
                    <Field label="EID expiry"><DatePicker value={editing.emirates_id_expiry} onChange={(v) => setEditing({ ...editing, emirates_id_expiry: v })} /></Field>
                    <Field label="Visa #"><Input value={editing.visa_number ?? ""} onChange={(e) => setEditing({ ...editing, visa_number: e.target.value })} /></Field>
                    <Field label="Visa expiry"><DatePicker value={editing.visa_expiry} onChange={(v) => setEditing({ ...editing, visa_expiry: v })} /></Field>
                    <Field label="Labor card #"><Input value={editing.labor_card_no ?? ""} onChange={(e) => setEditing({ ...editing, labor_card_no: e.target.value })} /></Field>
                    <Field label="Labor card expiry"><DatePicker value={editing.labor_card_expiry} onChange={(v) => setEditing({ ...editing, labor_card_expiry: v })} /></Field>
                    <Field label="Medical expiry"><DatePicker value={editing.medical_expiry} onChange={(v) => setEditing({ ...editing, medical_expiry: v })} /></Field>
                    <Field label="Insurance expiry"><DatePicker value={editing.insurance_expiry} onChange={(v) => setEditing({ ...editing, insurance_expiry: v })} /></Field>
                  </div>
                </TabsContent>

                {editing.id ? (
                  <TabsContent value="documents">
                    <WorkerDocumentsPanel workerId={editing.id} workerName={editing.full_name ?? "Worker"} />
                  </TabsContent>
                ) : null}

                <TabsContent value="payroll" className="space-y-4 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Base salary (AED)"><Input type="number" min={0} step="0.01" value={editing.base_salary ?? 0} onChange={(e) => setEditing({ ...editing, base_salary: Number(e.target.value) })} /></Field>
                    <Field label="Housing"><Input type="number" min={0} step="0.01" value={editing.housing_allowance ?? 0} onChange={(e) => setEditing({ ...editing, housing_allowance: Number(e.target.value) })} /></Field>
                    <Field label="Transport"><Input type="number" min={0} step="0.01" value={editing.transport_allowance ?? 0} onChange={(e) => setEditing({ ...editing, transport_allowance: Number(e.target.value) })} /></Field>
                    <Field label="Other allowance"><Input type="number" min={0} step="0.01" value={editing.other_allowance ?? 0} onChange={(e) => setEditing({ ...editing, other_allowance: Number(e.target.value) })} /></Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Bank name"><BankCombobox value={editing.bank_name} onChange={(v) => setEditing({ ...editing, bank_name: v })} /></Field>
                    <Field label="IBAN"><Input value={editing.iban ?? ""} onChange={(e) => setEditing({ ...editing, iban: e.target.value })} /></Field>
                  </div>
                  <Field label="WPS personal ID"><Input value={editing.wps_personal_id ?? ""} onChange={(e) => setEditing({ ...editing, wps_personal_id: e.target.value })} /></Field>
                </TabsContent>
              </Tabs>

              <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={upsert.isPending} className="bg-primary hover:bg-primary/90">{upsert.isPending ? "Saving…" : editing.id ? "Save changes" : "Create worker"}</Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this worker?</AlertDialogTitle>
            <AlertDialogDescription>All placements for this worker will be cascade-deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BulkBar count={sel.count} onClear={sel.clear} onEdit={() => setBulkEdit(true)} onDelete={() => setBulkDelete(true)} onExport={exportSelected} />
      <BulkEditDialog open={bulkEdit} onOpenChange={setBulkEdit} count={sel.count}
        fields={[{ key: "status", label: "Status", type: "select", options: STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") })) }]}
        onApply={async (p) => { await bulkUpdate.mutateAsync(p); }} />
      <BulkImportDialog open={bulkImport} onOpenChange={setBulkImport} title="Import workers"
        columns={["full_name", "email", "phone", "nationality", "designation", "department", "joining_date", "base_salary", "housing_allowance", "transport_allowance", "status"]}
        mapRow={(r) => r.full_name ? {
          full_name: r.full_name, email: r.email || null, phone: r.phone || null, nationality: r.nationality || null,
          designation: r.designation || null, department: r.department || null,
          joining_date: r.joining_date || null,
          base_salary: r.base_salary ? Number(r.base_salary) : 0,
          housing_allowance: r.housing_allowance ? Number(r.housing_allowance) : 0,
          transport_allowance: r.transport_allowance ? Number(r.transport_allowance) : 0,
          status: r.status || "onboarding",
        } : null}
        onSubmit={async (rows) => { const { error } = await supabase.from("workers").insert(rows as never); if (error) throw error; qc.invalidateQueries({ queryKey: ["workers"] }); return rows.length; }} />
      <AlertDialog open={bulkDelete} onOpenChange={setBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete {sel.count} worker{sel.count === 1 ? "" : "s"}?</AlertDialogTitle><AlertDialogDescription>All placements for these workers will be cascade-deleted.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => bulkRemove.mutate(sel.selectedIds)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete all</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}</div>;
}
