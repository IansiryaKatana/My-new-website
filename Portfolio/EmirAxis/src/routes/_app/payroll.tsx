import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Wallet, Download, Play, CheckCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { buildWpsSif, generatePayrollRun, issuePayslipsFromPayroll } from "@/lib/workflows";
import { useAuth } from "@/lib/auth/AuthProvider";

export const Route = createFileRoute("/_app/payroll")({
  head: () => ({ meta: [{ title: "Payroll & WPS — Staffing OS" }] }),
  component: PayrollPage,
});

type PayrollRun = {
  id: string;
  period_year: number;
  period_month: number;
  status: string;
  total_gross: number;
  total_deductions: number;
  total_net: number;
  worker_count: number;
  sif_content: string | null;
  sif_exported_at: string | null;
};

type PayrollItem = {
  id: string;
  worker_id: string;
  gross: number;
  deductions: number;
  net: number;
  hours_worked: number;
  workers?: { full_name: string; employee_code: string | null; wps_personal_id: string | null; iban: string | null; routing_code: string | null };
};

function PayrollPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const today = new Date();
  const [period, setPeriod] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
  const [year, month] = period.split("-").map(Number);

  const { data: run, isLoading: runLoading } = useQuery({
    queryKey: ["payroll-run", year, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payroll_runs")
        .select("*")
        .eq("period_year", year)
        .eq("period_month", month)
        .maybeSingle();
      if (error) throw error;
      return data as PayrollRun | null;
    },
  });

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ["payroll-items", run?.id],
    enabled: !!run?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payroll_items")
        .select("*, workers:worker_id(full_name, employee_code, wps_personal_id, iban, routing_code)")
        .eq("payroll_run_id", run!.id)
        .order("gross", { ascending: false });
      if (error) throw error;
      return data as PayrollItem[];
    },
  });

  const generate = useMutation({
    mutationFn: () => generatePayrollRun(year, month),
    onSuccess: () => {
      toast.success("Payroll calculated from salaries, timesheets & deductions");
      qc.invalidateQueries({ queryKey: ["payroll-run"] });
      qc.invalidateQueries({ queryKey: ["payroll-items"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const approve = useMutation({
    mutationFn: async () => {
      if (!run?.id) throw new Error("Generate payroll first");
      const { error } = await supabase
        .from("payroll_runs")
        .update({ status: "approved", approved_by: user?.id, approved_at: new Date().toISOString() } as never)
        .eq("id", run.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Payroll approved");
      qc.invalidateQueries({ queryKey: ["payroll-run"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exportSif = useMutation({
    mutationFn: async () => {
      if (!run?.id || !items?.length) throw new Error("No payroll items");
      const sifRows = items.map((i) => ({
        wps_personal_id: i.workers?.wps_personal_id ?? null,
        iban: i.workers?.iban ?? null,
        routing_code: i.workers?.routing_code ?? null,
        full_name: i.workers?.full_name ?? "",
        gross: Number(i.gross),
      }));
      const { content, periodCode } = buildWpsSif(period, sifRows);
      const { error } = await supabase
        .from("payroll_runs")
        .update({ sif_content: content, sif_exported_at: new Date().toISOString(), status: "exported" } as never)
        .eq("id", run.id);
      if (error) throw error;
      const blob = new Blob([content], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `WPS-SIF-${periodCode}.sif`;
      a.click();
      URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success("WPS SIF exported and saved to payroll run");
      qc.invalidateQueries({ queryKey: ["payroll-run"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const issuePayslips = useMutation({
    mutationFn: () => issuePayslipsFromPayroll(run!.id),
    onSuccess: (n) => {
      toast.success(`Issued ${n} payslips from payroll run`);
      qc.invalidateQueries({ queryKey: ["payslips"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const missingIban = (items ?? []).filter((i) => !i.workers?.iban).length;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Finance"
        title="Payroll & WPS"
        description="Calculate monthly payroll from approved timesheets, export WPS SIF, and issue payslips."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => generate.mutate()} disabled={generate.isPending}>
              <Play className="mr-1.5 h-4 w-4" /> {generate.isPending ? "Calculating…" : "Calculate payroll"}
            </Button>
            {run && (
              <>
                <Button variant="outline" onClick={() => approve.mutate()} disabled={approve.isPending || run.status === "approved"}>
                  <CheckCircle className="mr-1.5 h-4 w-4" /> Approve
                </Button>
                <Button onClick={() => exportSif.mutate()} disabled={exportSif.isPending} className="bg-gold text-gold-foreground hover:bg-gold/90">
                  <Download className="mr-1.5 h-4 w-4" /> Export SIF
                </Button>
                <Button variant="secondary" onClick={() => issuePayslips.mutate()} disabled={issuePayslips.isPending}>
                  <FileText className="mr-1.5 h-4 w-4" /> Issue payslips
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Workers in run" value={run?.worker_count ?? 0} icon={Wallet} loading={runLoading} />
        <StatCard label="Gross total" value={run ? `AED ${Number(run.total_gross).toLocaleString()}` : "—"} icon={FileText} loading={runLoading} />
        <StatCard label="Net payable" value={run ? `AED ${Number(run.total_net).toLocaleString()}` : "—"} icon={Wallet} tone="gold" loading={runLoading} />
        <StatCard label="Missing IBAN" value={missingIban} icon={Wallet} tone={missingIban > 0 ? "gold" : "default"} loading={itemsLoading} />
      </div>

      <Card className="flex flex-col gap-3 border-border/60 p-4 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Pay period</Label>
          <Input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full bg-background sm:w-auto" />
        </div>
        {run && <StatusBadge status={run.status} className="w-fit" />}
      </Card>

      <Card className="table-shell">
        {runLoading || itemsLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : !run ? (
          <div className="p-6">
            <EmptyState icon={Wallet} title="No payroll run" description="Select a period and click Calculate payroll." />
          </div>
        ) : !items?.length ? (
          <div className="p-6">
            <EmptyState icon={Wallet} title="No items" description="Recalculate payroll for this period." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <div className="font-medium">{i.workers?.full_name}</div>
                    <div className="text-xs text-muted-foreground">{i.workers?.employee_code}</div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{Number(i.hours_worked).toFixed(1)}</TableCell>
                  <TableCell className="text-right tabular-nums">{Number(i.gross).toFixed(2)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{Number(i.deductions).toFixed(2)}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{Number(i.net).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
