import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus, Search, Pencil, Trash2, Upload } from "lucide-react";
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
import { ClientContactsPanel } from "@/components/app/ClientContactsPanel";

export const Route = createFileRoute("/_app/clients")({
  head: () => ({ meta: [{ title: "Clients — Staffing OS" }] }),
  component: ClientsPage,
});

type Client = {
  id: string;
  legal_name: string;
  trade_name: string | null;
  industry: string | null;
  emirate: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  billing_terms_days: number | null;
  credit_limit: number | null;
  trade_license_no: string | null;
  vat_number: string | null;
  notes: string | null;
};

const STATUSES = ["prospect", "active", "on_hold", "inactive", "blacklisted"] as const;
const EMIRATES = ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];
const CSV_COLS = ["legal_name", "trade_name", "industry", "emirate", "email", "phone", "status", "billing_terms_days", "trade_license_no", "vat_number"];

function ClientsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<Client> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);
  const [bulkImport, setBulkImport] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, legal_name, trade_name, industry, emirate, email, phone, status, billing_terms_days, credit_limit, trade_license_no, vat_number, notes")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Client[];
    },
  });

  const filtered = (data ?? []).filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return [c.legal_name, c.trade_name, c.email, c.phone, c.industry].some((v) => v?.toLowerCase().includes(q));
  });

  const sel = useBulkSelection<Client>(filtered);

  const upsert = useMutation({
    mutationFn: async (payload: Partial<Client>) => {
      if (payload.id) {
        const { error } = await supabase.from("clients").update(payload as never).eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("clients").insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing?.id ? "Client updated" : "Client created");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Client deleted");
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkRemove = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("clients").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Deleted ${sel.count} client${sel.count === 1 ? "" : "s"}`);
      setBulkDelete(false);
      sel.clear();
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkUpdate = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => {
      const { error } = await supabase.from("clients").update(patch as never).in("id", sel.selectedIds);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Updated ${sel.count} client${sel.count === 1 ? "" : "s"}`);
      sel.clear();
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exportSelected = () => {
    const rows = sel.selectedItems.map(({ id: _id, ...rest }) => rest);
    downloadCsv(`clients-${Date.now()}.csv`, toCsv(rows as Record<string, unknown>[]));
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Operations"
        title="Clients"
        description="Companies you staff for — contracts, billing terms, and key contacts."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setBulkImport(true)}>
              <Upload className="mr-1.5 h-4 w-4" /> Import CSV
            </Button>
            <Button onClick={() => setEditing({ status: "prospect", billing_terms_days: 30 })} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-1.5 h-4 w-4" /> New client
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-3">
        <div className="relative filter-grow sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search clients…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 bg-background" />
        </div>
        <div className="text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? "client" : "clients"}</div>
      </div>

      <Card className="table-shell">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Building2}
              title={search ? "No matching clients" : "No clients yet"}
              description={search ? "Try a different search term." : "Add your first client to start tracking job orders and placements."}
              action={!search && (
                <Button onClick={() => setEditing({ status: "prospect", billing_terms_days: 30 })}>
                  <Plus className="mr-1.5 h-4 w-4" /> Add client
                </Button>
              )}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={sel.allSelected ? true : sel.someSelected ? "indeterminate" : false}
                    onCheckedChange={() => sel.toggleAll()}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Industry</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden xl:table-cell">Terms</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} data-state={sel.isSelected(c.id) ? "selected" : undefined} className="cursor-pointer" onClick={() => setEditing(c)}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={sel.isSelected(c.id)} onCheckedChange={() => sel.toggle(c.id)} aria-label={`Select ${c.legal_name}`} />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{c.legal_name}</div>
                    {c.trade_name && <div className="text-xs text-muted-foreground">{c.trade_name}</div>}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{c.industry ?? "—"}</TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">{c.emirate ?? "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell"><StatusBadge status={c.status} /></TableCell>
                  <TableCell className="hidden text-muted-foreground xl:table-cell">{c.billing_terms_days ?? 30} days</TableCell>
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

      <BulkBar
        count={sel.count}
        onClear={sel.clear}
        onEdit={() => setBulkEdit(true)}
        onDelete={() => setBulkDelete(true)}
        onExport={exportSelected}
      />

      <BulkEditDialog
        open={bulkEdit}
        onOpenChange={setBulkEdit}
        count={sel.count}
        fields={[
          { key: "status", label: "Status", type: "select", options: STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") })) },
          { key: "emirate", label: "Emirate", type: "select", options: EMIRATES.map((e) => ({ value: e, label: e })) },
        ]}
        onApply={async (patch) => { await bulkUpdate.mutateAsync(patch); }}
      />

      <BulkImportDialog
        open={bulkImport}
        onOpenChange={setBulkImport}
        title="Import clients"
        columns={CSV_COLS}
        mapRow={(r) => {
          if (!r.legal_name) return null;
          return {
            legal_name: r.legal_name,
            trade_name: r.trade_name || null,
            industry: r.industry || null,
            emirate: r.emirate || null,
            email: r.email || null,
            phone: r.phone || null,
            status: r.status || "prospect",
            billing_terms_days: r.billing_terms_days ? Number(r.billing_terms_days) : 30,
            trade_license_no: r.trade_license_no || null,
            vat_number: r.vat_number || null,
          };
        }}
        onSubmit={async (rows) => {
          const { error } = await supabase.from("clients").insert(rows as never);
          if (error) throw error;
          qc.invalidateQueries({ queryKey: ["clients"] });
          return rows.length;
        }}
      />

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent form className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{editing?.id ? "Edit client" : "New client"}</SheetTitle>
            <SheetDescription>{editing?.id ? "Update client details." : "Create a new client record."}</SheetDescription>
          </SheetHeader>
          {editing && (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!editing.legal_name?.trim()) { toast.error("Legal name is required"); return; }
                upsert.mutate(editing);
              }}
            >
              <Field label="Legal name *">
                <Input required value={editing.legal_name ?? ""} onChange={(e) => setEditing({ ...editing, legal_name: e.target.value })} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Trade name"><Input value={editing.trade_name ?? ""} onChange={(e) => setEditing({ ...editing, trade_name: e.target.value })} /></Field>
                <Field label="Industry"><Input value={editing.industry ?? ""} onChange={(e) => setEditing({ ...editing, industry: e.target.value })} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Trade license #"><Input value={editing.trade_license_no ?? ""} onChange={(e) => setEditing({ ...editing, trade_license_no: e.target.value })} /></Field>
                <Field label="VAT number"><Input value={editing.vat_number ?? ""} onChange={(e) => setEditing({ ...editing, vat_number: e.target.value })} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email"><Input type="email" value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></Field>
                <Field label="Phone"><PhoneInput value={editing.phone} onChange={(v) => setEditing({ ...editing, phone: v ?? null })} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Emirate">
                  <Select value={editing.emirate ?? ""} onValueChange={(v) => setEditing({ ...editing, emirate: v })}>
                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>{EMIRATES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Status">
                  <Select value={editing.status ?? "prospect"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Billing terms (days)"><Input type="number" min={0} value={editing.billing_terms_days ?? 30} onChange={(e) => setEditing({ ...editing, billing_terms_days: Number(e.target.value) })} /></Field>
                <Field label="Credit limit (AED)"><Input type="number" min={0} step="0.01" value={editing.credit_limit ?? 0} onChange={(e) => setEditing({ ...editing, credit_limit: Number(e.target.value) })} /></Field>
              </div>
              <Field label="Notes"><Textarea rows={3} value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></Field>

              {editing.id ? <ClientContactsPanel clientId={editing.id} /> : null}

              <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={upsert.isPending} className="bg-primary hover:bg-primary/90">
                  {upsert.isPending ? "Saving…" : editing.id ? "Save changes" : "Create client"}
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this client?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the client and cascade-delete its contacts. Job orders referencing this client must be removed first.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && remove.mutate(deleteId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDelete} onOpenChange={setBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {sel.count} client{sel.count === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the selected clients. Records referencing them must be removed first.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => bulkRemove.mutate(sel.selectedIds)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete all</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
