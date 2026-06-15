import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Receipt, Plus, Trash2, FileDown, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { BulkBar } from "@/components/app/BulkBar";
import { BulkEditDialog } from "@/components/app/BulkEditDialog";
import { downloadCsv, toCsv } from "@/components/app/BulkImportDialog";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranding } from "@/lib/branding/BrandingProvider";
import { generateInvoiceFromTimesheets } from "@/lib/workflows";
import { usePdfBranding } from "@/hooks/use-pdf-branding";
import { generateInvoicePdfAction } from "@/lib/pdf-actions";
import { FINANCE_ROLES } from "@/lib/roles";

export const Route = createFileRoute("/_app/invoices")({
  head: () => ({ meta: [{ title: "Invoices — Staffing OS" }] }),
  component: InvoicesPage,
});

type Invoice = {
  id: string; reference: string | null; client_id: string;
  period_start: string | null; period_end: string | null;
  issue_date: string; due_date: string | null;
  status: string;
  subtotal: number; vat_rate: number; vat_amount: number; total: number; amount_paid: number;
  currency: string; notes: string | null; created_at: string;
  clients?: { legal_name: string; trade_name: string | null } | null;
};
type InvoiceLine = { id: string; invoice_id: string; description: string; hours: number; rate: number; amount: number; worker_id: string | null; placement_id: string | null };
type Payment = { id: string; invoice_id: string; amount: number; method: string | null; reference: string | null; paid_on: string };
const STATUSES = ["draft", "sent", "partial", "paid", "overdue", "void"];

const fmt = (n: number, c = "AED") => new Intl.NumberFormat("en-AE", { style: "currency", currency: c, maximumFractionDigits: 2 }).format(n || 0);

function InvoicesPage() {
  const { hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const [openCreate, setOpenCreate] = useState(false);
  const [openGen, setOpenGen] = useState(false);
  const [genForm, setGenForm] = useState({ client_id: "", from: "", to: "" });
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);
  const canManage = hasAnyRole(FINANCE_ROLES);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*, clients:client_id(legal_name, trade_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Invoice[];
    },
  });

  const { data: clients } = useQuery({
    queryKey: ["clients-lite"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, legal_name, trade_name, vat_number").order("legal_name");
      return data ?? [];
    },
  });

  const outstanding = invoices?.filter((i) => i.status !== "paid" && i.status !== "void").reduce((s, i) => s + (i.total - i.amount_paid), 0) ?? 0;
  const overdue = invoices?.filter((i) => i.due_date && new Date(i.due_date) < new Date() && i.status !== "paid" && i.status !== "void").length ?? 0;
  const paid30 = invoices?.filter((i) => i.status === "paid" && new Date(i.created_at) > new Date(Date.now() - 30 * 86400000)).reduce((s, i) => s + i.total, 0) ?? 0;
  const draft = invoices?.filter((i) => i.status === "draft").length ?? 0;

  const createInvoice = useMutation({
    mutationFn: async (payload: Partial<Invoice>) => {
      const { data, error } = await supabase.from("invoices").insert(payload as never).select().single();
      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: (inv) => {
      toast.success(`Invoice ${inv.reference} created`);
      setOpenCreate(false);
      qc.invalidateQueries({ queryKey: ["invoices"] });
      setSelected(inv);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sel = useBulkSelection<Invoice>(invoices ?? []);
  const bulkRemove = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("invoices").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`Deleted ${sel.count}`); setBulkDelete(false); sel.clear(); qc.invalidateQueries({ queryKey: ["invoices"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const bulkUpdate = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => {
      const { error } = await supabase.from("invoices").update(patch as never).in("id", sel.selectedIds);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(`Updated ${sel.count}`); sel.clear(); qc.invalidateQueries({ queryKey: ["invoices"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const exportSelected = () => {
    const rows = sel.selectedItems.map((i) => ({
      reference: i.reference, client: i.clients?.legal_name ?? "",
      issue_date: i.issue_date, due_date: i.due_date, status: i.status,
      subtotal: i.subtotal, vat_amount: i.vat_amount, total: i.total, amount_paid: i.amount_paid, currency: i.currency,
    }));
    downloadCsv(`invoices-${Date.now()}.csv`, toCsv(rows as Record<string, unknown>[]));
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Finance"
        title="Invoices"
        description="Client billing with VAT, lines tied to placements, and payment tracking."
        actions={canManage && (
          <div className="flex flex-wrap gap-2">
            <Dialog open={openGen} onOpenChange={setOpenGen}>
              <DialogTrigger asChild><Button variant="outline"><FileDown className="mr-1.5 h-4 w-4" /> From timesheets</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Generate from approved timesheets</DialogTitle><DialogDescription>Creates invoice lines from client timesheets in the date range.</DialogDescription></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Client</Label>
                    <Select value={genForm.client_id} onValueChange={(v) => setGenForm({ ...genForm, client_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                      <SelectContent>{(clients ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.legal_name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="form-grid-2">
                    <div><Label>From</Label><DatePicker value={genForm.from} onChange={(v) => setGenForm({ ...genForm, from: v ?? "" })} clearable={false} /></div>
                    <div><Label>To</Label><DatePicker value={genForm.to} onChange={(v) => setGenForm({ ...genForm, to: v ?? "" })} clearable={false} /></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button disabled={!genForm.client_id || !genForm.from || !genForm.to} onClick={async () => {
                    try {
                      const id = await generateInvoiceFromTimesheets(genForm.client_id, genForm.from, genForm.to);
                      toast.success("Invoice generated");
                      setOpenGen(false);
                      qc.invalidateQueries({ queryKey: ["invoices"] });
                      const { data: inv } = await supabase.from("invoices").select("*, clients:client_id(legal_name, trade_name)").eq("id", id).single();
                      if (inv) setSelected(inv as Invoice);
                    } catch (e) { toast.error((e as Error).message); }
                  }}>Generate</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> New invoice</Button></DialogTrigger>
              <CreateInvoiceDialog clients={clients ?? []} onSubmit={(p) => createInvoice.mutate(p)} pending={createInvoice.isPending} />
            </Dialog>
          </div>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Receipt} label="Outstanding" value={fmt(outstanding)} tone="warning" />
        <StatCard icon={Receipt} label="Overdue" value={overdue} tone="danger" />
        <StatCard icon={CreditCard} label="Paid (30d)" value={fmt(paid30)} tone="success" />
        <StatCard icon={Receipt} label="Drafts" value={draft} tone="info" />
      </div>

      <Card className="table-shell border-border/60">
        {isLoading ? (
          <div className="p-6 space-y-2"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
        ) : !invoices?.length ? (
          <div className="p-10"><EmptyState icon={Receipt} title="No invoices yet" description="Create your first invoice from a client and approved timesheet lines." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={sel.allSelected ? true : sel.someSelected ? "indeterminate" : false} onCheckedChange={() => sel.toggleAll()} aria-label="Select all" /></TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((i) => (
                <TableRow key={i.id} data-state={sel.isSelected(i.id) ? "selected" : undefined} className="cursor-pointer" onClick={() => setSelected(i)}>
                  <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={sel.isSelected(i.id)} onCheckedChange={() => sel.toggle(i.id)} aria-label={`Select ${i.reference}`} /></TableCell>
                  <TableCell className="font-mono text-xs">{i.reference}</TableCell>
                  <TableCell className="font-medium">{i.clients?.legal_name ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{i.period_start && i.period_end ? `${format(new Date(i.period_start), "MMM d")} – ${format(new Date(i.period_end), "MMM d, yy")}` : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{i.due_date ? format(new Date(i.due_date), "PP") : "—"}</TableCell>
                  <TableCell className="text-right font-medium">{fmt(i.total, i.currency)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{fmt(i.amount_paid, i.currency)}</TableCell>
                  <TableCell><StatusBadge status={i.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent form className="w-full sm:max-w-2xl overflow-y-auto">
          {selected && <InvoiceDetail invoice={selected} canManage={canManage} />}
        </SheetContent>
      </Sheet>

      <BulkBar count={sel.count} onClear={sel.clear} onEdit={canManage ? () => setBulkEdit(true) : undefined}
        onDelete={canManage ? () => setBulkDelete(true) : undefined} onExport={exportSelected} />
      <BulkEditDialog open={bulkEdit} onOpenChange={setBulkEdit} count={sel.count}
        fields={[{ key: "status", label: "Status", type: "select", options: STATUSES.map((s) => ({ value: s, label: s })) }]}
        onApply={async (p) => { await bulkUpdate.mutateAsync(p); }} />
      <AlertDialog open={bulkDelete} onOpenChange={setBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {sel.count} invoice{sel.count === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>Lines and payments will be cascade-deleted. This cannot be undone.</AlertDialogDescription>
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

function CreateInvoiceDialog({ clients, onSubmit, pending }: { clients: { id: string; legal_name: string; trade_name: string | null }[]; onSubmit: (p: Partial<Invoice>) => void; pending: boolean }) {
  const today = new Date();
  const due = new Date(today); due.setDate(due.getDate() + 30);
  const [form, setForm] = useState<Partial<Invoice>>({
    issue_date: today.toISOString().slice(0, 10),
    due_date: due.toISOString().slice(0, 10),
    currency: "AED",
    vat_rate: 5,
    status: "draft",
  });
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>New invoice</DialogTitle>
        <DialogDescription>Create a draft invoice; add lines next.</DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>Client</Label>
          <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
            <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
            <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.legal_name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="form-grid-2">
          <div><Label>Period start</Label><DatePicker value={form.period_start} onChange={(v) => setForm({ ...form, period_start: v })} /></div>
          <div><Label>Period end</Label><DatePicker value={form.period_end} onChange={(v) => setForm({ ...form, period_end: v })} /></div>
          <div><Label>Issue date</Label><DatePicker value={form.issue_date} onChange={(v) => setForm({ ...form, issue_date: v ?? "" })} clearable={false} /></div>
          <div><Label>Due date</Label><DatePicker value={form.due_date} onChange={(v) => setForm({ ...form, due_date: v })} /></div>
          <div><Label>VAT %</Label><Input type="number" step="0.01" value={form.vat_rate} onChange={(e) => setForm({ ...form, vat_rate: Number(e.target.value) })} /></div>
          <div><Label>Currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
        </div>
      </div>
      <DialogFooter>
        <Button disabled={!form.client_id || pending} onClick={() => onSubmit(form)}>{pending ? "Creating…" : "Create draft"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function InvoiceDetail({ invoice, canManage }: { invoice: Invoice; canManage: boolean }) {
  const { branding } = useBranding();
  const pdfBranding = usePdfBranding();
  const qc = useQueryClient();
  const [newLine, setNewLine] = useState({ description: "", hours: 0, rate: 0 });
  const [pay, setPay] = useState({ amount: 0, method: "bank_transfer", reference: "" });
  const [pdfBusy, setPdfBusy] = useState(false);

  const { data: lines } = useQuery({
    queryKey: ["invoice-lines", invoice.id],
    queryFn: async () => {
      const { data } = await supabase.from("invoice_lines").select("*").eq("invoice_id", invoice.id).order("created_at");
      return (data ?? []) as InvoiceLine[];
    },
  });

  const { data: payments } = useQuery({
    queryKey: ["invoice-payments", invoice.id],
    queryFn: async () => {
      const { data } = await supabase.from("payments").select("*").eq("invoice_id", invoice.id).order("paid_on", { ascending: false });
      return (data ?? []) as Payment[];
    },
  });

  const addLine = useMutation({
    mutationFn: async () => {
      const amount = (newLine.hours || 1) * newLine.rate;
      const { error } = await supabase.from("invoice_lines").insert({
        invoice_id: invoice.id, description: newLine.description, hours: newLine.hours, rate: newLine.rate, amount,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      setNewLine({ description: "", hours: 0, rate: 0 });
      qc.invalidateQueries({ queryKey: ["invoice-lines", invoice.id] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeLine = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invoice_lines").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoice-lines", invoice.id] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  const setStatus = useMutation({
    mutationFn: async (status: string) => {
      const { error } = await supabase.from("invoices").update({ status } as never).eq("id", invoice.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["invoices"] }); },
  });

  const addPayment = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("payments").insert({
        invoice_id: invoice.id, amount: pay.amount, method: pay.method, reference: pay.reference || null,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      setPay({ amount: 0, method: "bank_transfer", reference: "" });
      qc.invalidateQueries({ queryKey: ["invoice-payments", invoice.id] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Payment recorded");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const downloadCsv = () => {
    const rows = [
      ["Invoice", invoice.reference ?? ""],
      ["Client", invoice.clients?.legal_name ?? ""],
      ["Issue date", invoice.issue_date],
      ["Due date", invoice.due_date ?? ""],
      [],
      ["Description", "Hours", "Rate", "Amount"],
      ...(lines ?? []).map((l) => [l.description, l.hours, l.rate, l.amount]),
      [],
      ["Subtotal", "", "", invoice.subtotal],
      [`VAT ${invoice.vat_rate}%`, "", "", invoice.vat_amount],
      ["Total", "", "", invoice.total],
      ["Paid", "", "", invoice.amount_paid],
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${invoice.reference ?? "invoice"}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle className="font-mono text-base">{invoice.reference}</SheetTitle>
        <SheetDescription className="flex items-center gap-2">
          <StatusBadge status={invoice.status} />
          <span className="text-sm">{invoice.clients?.legal_name}</span>
        </SheetDescription>
      </SheetHeader>

      <div className="page-stack py-5">
        <div className="rounded-lg border border-border/60 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{branding.company_name}</div>
          <div className="form-grid-2 text-sm">
            <div><div className="text-xs text-muted-foreground">Issued</div>{format(new Date(invoice.issue_date), "PPP")}</div>
            <div><div className="text-xs text-muted-foreground">Due</div>{invoice.due_date ? format(new Date(invoice.due_date), "PPP") : "—"}</div>
            <div><div className="text-xs text-muted-foreground">Subtotal</div>{fmt(invoice.subtotal, invoice.currency)}</div>
            <div><div className="text-xs text-muted-foreground">VAT ({invoice.vat_rate}%)</div>{fmt(invoice.vat_amount, invoice.currency)}</div>
            <div className="col-span-2 border-t pt-2"><div className="text-xs text-muted-foreground">Total</div><div className="font-display text-2xl text-primary">{fmt(invoice.total, invoice.currency)}</div></div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Line items</div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" disabled={pdfBusy} onClick={async () => {
                setPdfBusy(true);
                try { await generateInvoicePdfAction(invoice.id, pdfBranding); toast.success("PDF generated"); qc.invalidateQueries({ queryKey: ["invoices"] }); }
                catch (e) { toast.error(e instanceof Error ? e.message : "PDF failed"); }
                finally { setPdfBusy(false); }
              }}><FileDown className="mr-1 h-3.5 w-3.5" /> PDF</Button>
              <Button size="sm" variant="ghost" onClick={downloadCsv}><FileDown className="mr-1 h-3.5 w-3.5" /> CSV</Button>
            </div>
          </div>
          <div className="rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Description</TableHead><TableHead className="text-right">Hrs</TableHead><TableHead className="text-right">Rate</TableHead><TableHead className="text-right">Amount</TableHead><TableHead /></TableRow>
              </TableHeader>
              <TableBody>
                {lines?.length ? lines.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.description}</TableCell>
                    <TableCell className="text-right text-xs">{l.hours}</TableCell>
                    <TableCell className="text-right text-xs">{fmt(l.rate, invoice.currency)}</TableCell>
                    <TableCell className="text-right font-medium">{fmt(l.amount, invoice.currency)}</TableCell>
                    <TableCell className="text-right">
                      {canManage && <Button size="icon" variant="ghost" onClick={() => removeLine.mutate(l.id)}><Trash2 className="h-3.5 w-3.5" /></Button>}
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-4">No lines yet</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
          {canManage && (
            <div className="mt-2 flex flex-col gap-2 md:grid md:grid-cols-12 md:items-end md:gap-2">
              <Input className="md:col-span-6" placeholder="Description" value={newLine.description} onChange={(e) => setNewLine({ ...newLine, description: e.target.value })} />
              <Input className="md:col-span-2" type="number" step="0.01" placeholder="Hrs" value={newLine.hours || ""} onChange={(e) => setNewLine({ ...newLine, hours: Number(e.target.value) })} />
              <Input className="md:col-span-2" type="number" step="0.01" placeholder="Rate" value={newLine.rate || ""} onChange={(e) => setNewLine({ ...newLine, rate: Number(e.target.value) })} />
              <Button className="w-full md:col-span-2" size="sm" disabled={!newLine.description || !newLine.rate} onClick={() => addLine.mutate()}>Add</Button>
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payments</div>
          <div className="space-y-1.5">
            {payments?.length ? payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm">
                <div><div className="font-medium">{fmt(p.amount, invoice.currency)}</div><div className="text-xs text-muted-foreground">{p.method} · {format(new Date(p.paid_on), "PP")} {p.reference ? `· ${p.reference}` : ""}</div></div>
              </div>
            )) : <div className="text-xs text-muted-foreground">None recorded.</div>}
          </div>
          {canManage && (
            <div className="mt-2 flex flex-col gap-2 md:grid md:grid-cols-12 md:items-end md:gap-2">
              <Input className="md:col-span-3" type="number" step="0.01" placeholder="Amount" value={pay.amount || ""} onChange={(e) => setPay({ ...pay, amount: Number(e.target.value) })} />
              <Select value={pay.method} onValueChange={(v) => setPay({ ...pay, method: v })}>
                <SelectTrigger className="w-full md:col-span-4"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
              <Input className="md:col-span-3" placeholder="Ref" value={pay.reference} onChange={(e) => setPay({ ...pay, reference: e.target.value })} />
              <Button className="w-full md:col-span-2" size="sm" disabled={!pay.amount} onClick={() => addPayment.mutate()}>Record</Button>
            </div>
          )}
        </div>

        {canManage && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 p-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</span>
            {STATUSES.map((s) => (
              <Button key={s} size="sm" variant={s === invoice.status ? "default" : "outline"} className="capitalize" onClick={() => setStatus.mutate(s)}>{s}</Button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
