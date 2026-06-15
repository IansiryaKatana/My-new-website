import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserSearch, Plus, Search, Pencil, Trash2, Star, Upload, UserPlus } from "lucide-react";
import { CandidateDocumentsPanel } from "@/components/app/CandidateDocumentsPanel";
import { convertCandidateToWorker } from "@/lib/workflows";
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
import { PhoneInput } from "@/components/ui/phone-input";
import { NationalityCombobox } from "@/components/app/NationalityCombobox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_app/candidates")({
  head: () => ({ meta: [{ title: "Candidates — Staffing OS" }] }),
  component: CandidatesPage,
});

type Candidate = {
  id: string;
  reference: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  current_city: string | null;
  passport_no: string | null;
  years_experience: number | null;
  expected_salary: number | null;
  source: string | null;
  status: string;
  job_order_id: string | null;
  notes: string | null;
  rating: number | null;
};

const STATUSES = ["new", "screening", "shortlisted", "interviewing", "offered", "hired", "rejected", "withdrawn", "blacklisted"];
const CSV_COLS = ["full_name", "email", "phone", "nationality", "current_city", "passport_no", "years_experience", "expected_salary", "source", "status"];

function CandidatesPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Partial<Candidate> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);
  const [bulkImport, setBulkImport] = useState(false);

  const { data: jobOrders } = useQuery({
    queryKey: ["job_orders", "lookup"],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_orders").select("id, reference, title").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("id, reference, full_name, email, phone, nationality, current_city, passport_no, years_experience, expected_salary, source, status, job_order_id, notes, rating")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Candidate[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (payload: Partial<Candidate>) => {
      const clean: Record<string, unknown> = { ...payload };
      if (clean.job_order_id === "") clean.job_order_id = null;
      if (clean.id) {
        const { error } = await supabase.from("candidates").update(clean as never).eq("id", payload.id!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("candidates").insert(clean as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing?.id ? "Candidate updated" : "Candidate added");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["candidates"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("candidates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Candidate deleted"); setDeleteId(null); qc.invalidateQueries({ queryKey: ["candidates"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = (data ?? []).filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return [c.full_name, c.reference, c.email, c.phone, c.nationality, c.passport_no].some((v) => v?.toLowerCase().includes(q));
  });

  const sel = useBulkSelection<Candidate>(filtered);

  const bulkRemove = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("candidates").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`Deleted ${sel.count}`); setBulkDelete(false); sel.clear(); qc.invalidateQueries({ queryKey: ["candidates"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const bulkUpdate = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => {
      const { error } = await supabase.from("candidates").update(patch as never).in("id", sel.selectedIds);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`Updated ${sel.count}`); sel.clear(); qc.invalidateQueries({ queryKey: ["candidates"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const exportSelected = () => {
    const rows = sel.selectedItems.map(({ id: _i, ...rest }) => rest);
    downloadCsv(`candidates-${Date.now()}.csv`, toCsv(rows as Record<string, unknown>[]));
  };

  const convertToWorker = useMutation({
    mutationFn: (candidateId: string) => convertCandidateToWorker(candidateId),
    onSuccess: (workerId) => {
      toast.success("Worker created from candidate");
      qc.invalidateQueries({ queryKey: ["candidates"] });
      qc.invalidateQueries({ queryKey: ["workers"] });
      setEditing(null);
      void navigate({ to: "/workers", search: { highlight: workerId } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Operations"
        title="Candidates"
        description="Pipeline of talent — screen, shortlist, and convert candidates into deployed workers."
        actions={<div className="flex gap-2"><Button variant="outline" onClick={() => setBulkImport(true)}><Upload className="mr-1.5 h-4 w-4" /> Import CSV</Button><Button onClick={() => setEditing({ status: "new" })} className="bg-primary hover:bg-primary/90"><Plus className="mr-1.5 h-4 w-4" /> Add candidate</Button></div>}
      />

      <div className="filter-bar">
        <div className="relative filter-grow sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, passport, ref…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 bg-background" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full bg-background sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="text-xs text-muted-foreground sm:ml-auto">{filtered.length} {filtered.length === 1 ? "candidate" : "candidates"}</div>
      </div>

      <Card className="table-shell">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={UserSearch} title={search || statusFilter !== "all" ? "No matching candidates" : "No candidates yet"}
              description={search || statusFilter !== "all" ? "Try adjusting filters." : "Add candidates manually or import them in bulk to start screening."}
              action={!(search || statusFilter !== "all") && <Button onClick={() => setEditing({ status: "new" })}><Plus className="mr-1.5 h-4 w-4" /> Add candidate</Button>} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={sel.allSelected ? true : sel.someSelected ? "indeterminate" : false} onCheckedChange={() => sel.toggleAll()} aria-label="Select all" /></TableHead>
                <TableHead>Ref</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead className="hidden md:table-cell">Nationality</TableHead>
                <TableHead className="hidden lg:table-cell">Experience</TableHead>
                <TableHead className="hidden xl:table-cell">Expected</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} data-state={sel.isSelected(c.id) ? "selected" : undefined} className="cursor-pointer" onClick={() => setEditing(c)}>
                  <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={sel.isSelected(c.id)} onCheckedChange={() => sel.toggle(c.id)} aria-label={`Select ${c.full_name}`} /></TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.reference ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.full_name}</span>
                      {c.rating ? <span className="flex items-center gap-0.5 text-[11px] text-gold-foreground"><Star className="h-3 w-3 fill-current text-gold" /> {c.rating}</span> : null}
                    </div>
                    <div className="text-xs text-muted-foreground">{c.email ?? c.phone ?? "—"}</div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{c.nationality ?? "—"}</TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">{c.years_experience != null ? `${c.years_experience} yrs` : "—"}</TableCell>
                  <TableCell className="hidden text-muted-foreground xl:table-cell">{c.expected_salary ? `AED ${c.expected_salary}` : "—"}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(c.id)}><Trash2 className="h-4 w-4" /></Button>
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
            <SheetTitle>{editing?.id ? "Edit candidate" : "Add candidate"}</SheetTitle>
            <SheetDescription>{editing?.reference ? `Reference: ${editing.reference}` : "Reference auto-generates on save."}</SheetDescription>
          </SheetHeader>
          {editing && (
            <form className="mt-6 space-y-4" onSubmit={(e) => {
              e.preventDefault();
              if (!editing.full_name?.trim()) { toast.error("Full name is required"); return; }
              upsert.mutate(editing);
            }}>
              <Field label="Full name *"><Input required value={editing.full_name ?? ""} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email"><Input type="email" value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></Field>
                <Field label="Phone"><PhoneInput value={editing.phone} onChange={(v) => setEditing({ ...editing, phone: v ?? null })} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nationality"><NationalityCombobox value={editing.nationality} onChange={(v) => setEditing({ ...editing, nationality: v })} /></Field>
                <Field label="Current city"><Input value={editing.current_city ?? ""} onChange={(e) => setEditing({ ...editing, current_city: e.target.value })} /></Field>
              </div>
              <Field label="Passport number"><Input value={editing.passport_no ?? ""} onChange={(e) => setEditing({ ...editing, passport_no: e.target.value })} /></Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Experience (yrs)"><Input type="number" min={0} step="0.5" value={editing.years_experience ?? 0} onChange={(e) => setEditing({ ...editing, years_experience: Number(e.target.value) })} /></Field>
                <Field label="Expected salary"><Input type="number" min={0} value={editing.expected_salary ?? ""} onChange={(e) => setEditing({ ...editing, expected_salary: e.target.value ? Number(e.target.value) : null })} /></Field>
                <Field label="Rating (0–5)"><Input type="number" min={0} max={5} value={editing.rating ?? ""} onChange={(e) => setEditing({ ...editing, rating: e.target.value ? Number(e.target.value) : null })} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Source"><Input value={editing.source ?? ""} onChange={(e) => setEditing({ ...editing, source: e.target.value })} placeholder="e.g. Referral, LinkedIn" /></Field>
                <Field label="Status">
                  <Select value={editing.status ?? "new"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Linked job order">
                <Select value={editing.job_order_id ?? "none"} onValueChange={(v) => setEditing({ ...editing, job_order_id: v === "none" ? null : v })}>
                  <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— None —</SelectItem>
                    {(jobOrders ?? []).map((j) => <SelectItem key={j.id} value={j.id}>{j.reference} · {j.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Notes"><Textarea rows={3} value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></Field>

              {editing.id && (
                <>
                  <CandidateDocumentsPanel candidateId={editing.id} candidateName={editing.full_name ?? "Candidate"} />
                  {["offered", "hired", "shortlisted"].includes(editing.status ?? "") && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={convertToWorker.isPending}
                      onClick={() => convertToWorker.mutate(editing.id!)}
                    >
                      <UserPlus className="mr-1.5 h-4 w-4" />
                      {convertToWorker.isPending ? "Converting…" : "Convert to worker"}
                    </Button>
                  )}
                </>
              )}

              <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={upsert.isPending} className="bg-primary hover:bg-primary/90">{upsert.isPending ? "Saving…" : editing.id ? "Save changes" : "Add candidate"}</Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this candidate?</AlertDialogTitle>
            <AlertDialogDescription>Uploaded documents will be cascade-deleted. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BulkBar count={sel.count} onClear={sel.clear} onEdit={() => setBulkEdit(true)} onDelete={() => setBulkDelete(true)} onExport={exportSelected} />
      <BulkEditDialog open={bulkEdit} onOpenChange={setBulkEdit} count={sel.count} fields={[{ key: "status", label: "Status", type: "select", options: STATUSES.map((s) => ({ value: s, label: s })) }]} onApply={async (p) => { await bulkUpdate.mutateAsync(p); }} />
      <BulkImportDialog open={bulkImport} onOpenChange={setBulkImport} title="Import candidates" columns={CSV_COLS}
        mapRow={(r) => r.full_name ? {
          full_name: r.full_name, email: r.email || null, phone: r.phone || null, nationality: r.nationality || null,
          current_city: r.current_city || null, passport_no: r.passport_no || null,
          years_experience: r.years_experience ? Number(r.years_experience) : 0,
          expected_salary: r.expected_salary ? Number(r.expected_salary) : null,
          source: r.source || null, status: r.status || "new",
        } : null}
        onSubmit={async (rows) => { const { error } = await supabase.from("candidates").insert(rows as never); if (error) throw error; qc.invalidateQueries({ queryKey: ["candidates"] }); return rows.length; }} />
      <AlertDialog open={bulkDelete} onOpenChange={setBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete {sel.count} candidate{sel.count === 1 ? "" : "s"}?</AlertDialogTitle><AlertDialogDescription>Permanently remove the selected candidates and their documents.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => bulkRemove.mutate(sel.selectedIds)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete all</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}</div>;
}
