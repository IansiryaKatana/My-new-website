import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Landmark, Plus, Search, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { BulkBar } from "@/components/app/BulkBar";
import { BulkEditDialog } from "@/components/app/BulkEditDialog";
import { BulkImportDialog, downloadCsv, toCsv } from "@/components/app/BulkImportDialog";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Bank = {
  id: string;
  name: string;
  short_name: string | null;
  bank_code: string | null;
  swift_code: string | null;
  routing_code: string | null;
  emirate: string | null;
  website: string | null;
  logo_url: string | null;
  is_active: boolean;
};

const empty: Partial<Bank> = { name: "", short_name: "", bank_code: "", swift_code: "", routing_code: "", emirate: "", website: "", logo_url: "", is_active: true };

export const Route = createFileRoute("/_app/admin/banks")({
  head: () => ({ meta: [{ title: "UAE Banks — Staffing OS" }] }),
  component: BanksPage,
});

function BanksPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<Bank> | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);
  const [bulkImport, setBulkImport] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["uae_banks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("uae_banks").select("*").order("name");
      if (error) throw error;
      return data as Bank[];
    },
  });

  const filtered = (data ?? []).filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      (b.short_name ?? "").toLowerCase().includes(q) ||
      (b.swift_code ?? "").toLowerCase().includes(q) ||
      (b.routing_code ?? "").toLowerCase().includes(q)
    );
  });

  const save = useMutation({
    mutationFn: async (b: Partial<Bank>) => {
      if (!b.name) throw new Error("Name required");
      const payload = {
        name: b.name,
        short_name: b.short_name || null,
        bank_code: b.bank_code || null,
        swift_code: b.swift_code || null,
        routing_code: b.routing_code || null,
        emirate: b.emirate || null,
        website: b.website || null,
        logo_url: b.logo_url || null,
        is_active: b.is_active ?? true,
      };
      if (b.id) {
        const { error } = await supabase.from("uae_banks").update(payload).eq("id", b.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("uae_banks").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Bank saved");
      qc.invalidateQueries({ queryKey: ["uae_banks"] });
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("uae_banks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Bank removed");
      qc.invalidateQueries({ queryKey: ["uae_banks"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sel = useBulkSelection<Bank>(filtered);

  const bulkRemove = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("uae_banks").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`Deleted ${sel.count}`); setBulkDelete(false); sel.clear(); qc.invalidateQueries({ queryKey: ["uae_banks"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const bulkUpdate = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => {
      const { error } = await supabase.from("uae_banks").update(patch as never).in("id", sel.selectedIds);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`Updated ${sel.count}`); sel.clear(); qc.invalidateQueries({ queryKey: ["uae_banks"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const exportSelected = () => {
    const rows = sel.selectedItems.map(({ id: _i, ...rest }) => rest);
    downloadCsv(`uae-banks-${Date.now()}.csv`, toCsv(rows as Record<string, unknown>[]));
  };
  const CSV_COLS = ["name", "short_name", "bank_code", "swift_code", "routing_code", "emirate", "website", "logo_url", "is_active"];

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Administration"
        title="UAE Banks"
        description="Manage the bank directory used across payroll, employee finance and invoicing."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setBulkImport(true)} className="gap-2"><Upload className="h-4 w-4" /> Import CSV</Button>
            <Button onClick={() => setEditing(empty)} className="gap-2">
              <Plus className="h-4 w-4" /> Add bank
            </Button>
          </div>
        }
      />

      <Card className="p-4 border-border/60">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, SWIFT, code…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </Card>

      <Card className="table-shell border-border/60">
        {isLoading ? (
          <div className="p-6 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Landmark} title="No banks" description="Add your first bank to get started." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={sel.allSelected ? true : sel.someSelected ? "indeterminate" : false} onCheckedChange={() => sel.toggleAll()} aria-label="Select all" /></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Short</TableHead>
                <TableHead>SWIFT</TableHead>
                <TableHead>Routing</TableHead>
                <TableHead>Emirate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id} data-state={sel.isSelected(b.id) ? "selected" : undefined}>
                  <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={sel.isSelected(b.id)} onCheckedChange={() => sel.toggle(b.id)} aria-label={`Select ${b.name}`} /></TableCell>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-muted-foreground">{b.short_name ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">{b.swift_code ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">{b.routing_code ?? "—"}</TableCell>
                  <TableCell>{b.emirate ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={b.is_active ? "secondary" : "outline"}>{b.is_active ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(b)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { if (confirm(`Delete ${b.name}?`)) remove.mutate(b.id); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <BulkBar count={sel.count} onClear={sel.clear} onEdit={() => setBulkEdit(true)} onDelete={() => setBulkDelete(true)} onExport={exportSelected} />
      <BulkEditDialog open={bulkEdit} onOpenChange={setBulkEdit} count={sel.count}
        fields={[{ key: "is_active", label: "Status", type: "select", options: [{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }] }]}
        onApply={async (p) => { const patch = { ...p }; if (patch.is_active != null) (patch as Record<string, unknown>).is_active = patch.is_active === "true"; await bulkUpdate.mutateAsync(patch); }} />
      <BulkImportDialog open={bulkImport} onOpenChange={setBulkImport} title="Import banks" columns={CSV_COLS}
        mapRow={(r) => r.name ? {
          name: r.name, short_name: r.short_name || null, bank_code: r.bank_code || null,
          swift_code: r.swift_code || null, routing_code: r.routing_code || null,
          emirate: r.emirate || null, website: r.website || null, logo_url: r.logo_url || null,
          is_active: r.is_active ? r.is_active.toLowerCase() !== "false" : true,
        } : null}
        onSubmit={async (rows) => { const { error } = await supabase.from("uae_banks").insert(rows as never); if (error) throw error; qc.invalidateQueries({ queryKey: ["uae_banks"] }); return rows.length; }} />

      <AlertDialog open={bulkDelete} onOpenChange={setBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {sel.count} bank{sel.count === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => bulkRemove.mutate(sel.selectedIds)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent form className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing?.id ? "Edit bank" : "Add bank"}</SheetTitle>
          </SheetHeader>
          {editing && (
            <div className="mt-6 space-y-4">
              <Field label="Name *"><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <div className="form-grid-2">
                <Field label="Short name"><Input value={editing.short_name ?? ""} onChange={(e) => setEditing({ ...editing, short_name: e.target.value })} /></Field>
                <Field label="Bank code"><Input value={editing.bank_code ?? ""} onChange={(e) => setEditing({ ...editing, bank_code: e.target.value })} /></Field>
                <Field label="SWIFT / BIC"><Input value={editing.swift_code ?? ""} onChange={(e) => setEditing({ ...editing, swift_code: e.target.value })} /></Field>
                <Field label="Routing code"><Input value={editing.routing_code ?? ""} onChange={(e) => setEditing({ ...editing, routing_code: e.target.value })} /></Field>
                <Field label="Emirate"><Input value={editing.emirate ?? ""} onChange={(e) => setEditing({ ...editing, emirate: e.target.value })} /></Field>
                <Field label="Website"><Input value={editing.website ?? ""} onChange={(e) => setEditing({ ...editing, website: e.target.value })} /></Field>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
                <Label htmlFor="bank-active" className="text-sm">Active</Label>
                <Switch id="bank-active" checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
              </div>
            </div>
          )}
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && save.mutate(editing)} disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
