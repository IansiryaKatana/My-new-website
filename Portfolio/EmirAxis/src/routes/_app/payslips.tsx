import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Wallet, Plus, Send, FileDown, ExternalLink } from "lucide-react";
import { usePdfBranding } from "@/hooks/use-pdf-branding";
import { generatePayslipPdfAction } from "@/lib/pdf-actions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BulkBar } from "@/components/app/BulkBar";
import { downloadCsv, toCsv } from "@/components/app/BulkImportDialog";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { useAuth } from "@/lib/auth/AuthProvider";

export const Route = createFileRoute("/_app/payslips")({
  head: () => ({ meta: [{ title: "Payslips — Staffing OS" }] }),
  component: PayslipsAdminPage,
});

const fmt = (n: number, c = "AED") => new Intl.NumberFormat("en-AE", { style: "currency", currency: c }).format(n || 0);

function PayslipsAdminPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const pdfBranding = usePdfBranding();
  const today = new Date();
  const [period, setPeriod] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });
  const [open, setOpen] = useState(false);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [pdfBusy, setPdfBusy] = useState<string | null>(null);

  const { data: payslips, isLoading } = useQuery({
    queryKey: ["payslips", period.year, period.month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payslips")
        .select("*, workers:worker_id(full_name, employee_code)")
        .eq("period_year", period.year)
        .eq("period_month", period.month)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const bulk = useBulkSelection(payslips ?? []);

  const generate = useMutation({
    mutationFn: async () => {
      const { data: workers, error: werr } = await supabase
        .from("workers")
        .select("id, base_salary, housing_allowance, transport_allowance, other_allowance, currency")
        .eq("status", "active");
      if (werr) throw werr;
      const rows = (workers ?? []).map((w) => {
        const base = Number(w.base_salary ?? 0);
        const house = Number(w.housing_allowance ?? 0);
        const trans = Number(w.transport_allowance ?? 0);
        const other = Number(w.other_allowance ?? 0);
        const gross = base + house + trans + other;
        return {
          worker_id: w.id,
          period_year: period.year,
          period_month: period.month,
          gross,
          deductions: 0,
          net: gross,
          currency: w.currency ?? "AED",
          status: "draft",
          created_by: user?.id,
          line_items: [
            { label: "Base salary", amount: base },
            { label: "Housing", amount: house },
            { label: "Transport", amount: trans },
            { label: "Other", amount: other },
          ],
        };
      });
      if (!rows.length) throw new Error("No active workers");
      const { error } = await supabase.from("payslips").upsert(rows as never, { onConflict: "worker_id,period_year,period_month" });
      if (error) throw error;
      return rows.length;
    },
    onSuccess: (n) => {
      toast.success(`Generated ${n} payslips`);
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["payslips"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const issue = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("payslips").update({ status: "issued", issued_at: new Date().toISOString() } as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Issued"); qc.invalidateQueries({ queryKey: ["payslips"] }); },
  });

  const issueAll = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("payslips").update({ status: "issued", issued_at: new Date().toISOString() } as never)
        .eq("period_year", period.year).eq("period_month", period.month).eq("status", "draft");
      if (error) throw error;
    },
    onSuccess: () => { toast.success("All drafts issued"); qc.invalidateQueries({ queryKey: ["payslips"] }); },
  });

  const bulkIssue = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("payslips")
        .update({ status: "issued", issued_at: new Date().toISOString() } as never)
        .in("id", bulk.selectedIds);
      if (error) throw error;
      return bulk.selectedIds.length;
    },
    onSuccess: (n) => {
      toast.success(`Issued ${n} payslip${n === 1 ? "" : "s"}`);
      bulk.clear();
      qc.invalidateQueries({ queryKey: ["payslips"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkDelete = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("payslips").delete().in("id", bulk.selectedIds);
      if (error) throw error;
      return bulk.selectedIds.length;
    },
    onSuccess: (n) => {
      toast.success(`Deleted ${n} payslip${n === 1 ? "" : "s"}`);
      bulk.clear();
      setConfirmBulkDelete(false);
      qc.invalidateQueries({ queryKey: ["payslips"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exportSelected = () => {
    const rows = (payslips ?? []).filter((p) => bulk.isSelected(p.id)).map((p) => ({
      worker: p.workers?.full_name ?? "",
      employee_code: p.workers?.employee_code ?? "",
      period: `${p.period_year}-${String(p.period_month).padStart(2, "0")}`,
      gross: p.gross,
      deductions: p.deductions,
      net: p.net,
      currency: p.currency,
      status: p.status,
    }));
    downloadCsv(`payslips-${period.year}-${period.month}.csv`, toCsv(rows));
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Finance"
        title="Payslips"
        description="Generate, review and issue monthly payslips. Workers see issued payslips in their portal."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => issueAll.mutate()} disabled={issueAll.isPending}><Send className="mr-1.5 h-4 w-4" /> Issue all drafts</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> Generate run</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate payslip run</DialogTitle>
                  <DialogDescription>Creates draft payslips for every active worker using their salary structure.</DialogDescription>
                </DialogHeader>
                <div className="form-grid-2">
                  <div><Label>Year</Label><Input type="number" value={period.year} onChange={(e) => setPeriod({ ...period, year: Number(e.target.value) })} /></div>
                  <div><Label>Month</Label><Input type="number" min={1} max={12} value={period.month} onChange={(e) => setPeriod({ ...period, month: Number(e.target.value) })} /></div>
                </div>
                <DialogFooter>
                  <Button onClick={() => generate.mutate()} disabled={generate.isPending}>{generate.isPending ? "Generating…" : "Generate"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="flex items-center gap-3">
        <Label className="text-xs">Period</Label>
        <Input type="number" className="w-24" value={period.year} onChange={(e) => setPeriod({ ...period, year: Number(e.target.value) })} />
        <Input type="number" className="w-20" min={1} max={12} value={period.month} onChange={(e) => setPeriod({ ...period, month: Number(e.target.value) })} />
      </div>

      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6"><Skeleton className="h-32" /></div> :
         !payslips?.length ? <div className="p-10"><EmptyState icon={Wallet} title="No payslips for this period" description="Generate a run for the selected month." /></div> : (
          <Table>
            <TableHeader><TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={bulk.allSelected ? true : bulk.someSelected ? "indeterminate" : false}
                  onCheckedChange={bulk.toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Worker</TableHead><TableHead className="text-right">Gross</TableHead>
              <TableHead className="text-right">Deductions</TableHead><TableHead className="text-right">Net</TableHead>
              <TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {payslips.map((p: any) => {
                const selected = bulk.isSelected(p.id);
                return (
                  <TableRow key={p.id} data-state={selected ? "selected" : undefined}>
                    <TableCell><Checkbox checked={selected} onCheckedChange={() => bulk.toggle(p.id)} aria-label="Select row" /></TableCell>
                    <TableCell><div className="font-medium">{p.workers?.full_name}</div><div className="text-xs text-muted-foreground">{p.workers?.employee_code}</div></TableCell>
                    <TableCell className="text-right">{fmt(p.gross, p.currency)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{fmt(p.deductions, p.currency)}</TableCell>
                    <TableCell className="text-right font-semibold">{fmt(p.net, p.currency)}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" disabled={pdfBusy === p.id} title="Generate PDF" onClick={async () => {
                          setPdfBusy(p.id);
                          try { await generatePayslipPdfAction(p.id, pdfBranding); toast.success("PDF generated"); qc.invalidateQueries({ queryKey: ["payslips"] }); }
                          catch (e) { toast.error(e instanceof Error ? e.message : "PDF failed"); }
                          finally { setPdfBusy(null); }
                        }}><FileDown className="h-3.5 w-3.5" /></Button>
                        {p.pdf_url && <a href={p.pdf_url} target="_blank" rel="noreferrer"><Button size="icon" variant="ghost"><ExternalLink className="h-3.5 w-3.5" /></Button></a>}
                        {p.status === "draft" && <Button size="sm" variant="outline" onClick={() => issue.mutate(p.id)}>Issue</Button>}
                        {p.issued_at && <span className="text-xs text-muted-foreground">{format(new Date(p.issued_at), "PP")}</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <BulkBar
        count={bulk.count}
        onClear={bulk.clear}
        onExport={exportSelected}
        onDelete={() => setConfirmBulkDelete(true)}
        extra={
          <Button size="sm" variant="ghost" className="h-8 gap-1.5" onClick={() => bulkIssue.mutate()} disabled={bulkIssue.isPending}>
            <Send className="h-3.5 w-3.5" /> Issue
          </Button>
        }
      />

      <AlertDialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {bulk.count} payslip{bulk.count === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>Issued payslips will be permanently removed. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => bulkDelete.mutate()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {bulkDelete.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
