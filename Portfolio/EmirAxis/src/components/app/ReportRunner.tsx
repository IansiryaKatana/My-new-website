import { useQuery } from "@tanstack/react-query";
import { FileDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { ReportDefinition } from "@/lib/reports-catalog";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3 } from "lucide-react";

export type ReportParams = {
  from: string;
  to: string;
  year: number;
  month: number;
  daysAhead: number;
};

function buildRpcArgs(report: ReportDefinition, params: ReportParams): Record<string, unknown> {
  if (report.id === "margin-trend") return { _months: 12 };
  switch (report.paramType) {
    case "dateRange":
      return { _from: params.from, _to: params.to };
    case "yearMonth":
      return { _year: params.year, _month: params.month };
    case "daysAhead":
      return { _days_ahead: params.daysAhead };
    default:
      return {};
  }
}

function formatCell(key: string, value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "number") {
    if (key.includes("pct") || key.endsWith("_pct") || key === "margin_pct" || key === "fulfilment_pct" || key === "conversion_pct" || key === "commission_pct")
      return `${value}%`;
    if (key.includes("amount") || key.includes("cost") || key.includes("revenue") || key.includes("margin") || key.includes("total") || key.includes("rent") || key.includes("balance") || key === "gross" || key === "net" || key === "deductions" || key === "subtotal")
      return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 2 }).format(value);
    return String(value);
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    try { return new Date(value).toLocaleDateString("en-AE"); } catch { return value; }
  }
  return String(value);
}

function humanizeKey(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function exportReportCsv(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys, ...rows.map((r) => keys.map((k) => r[k]))]
    .map((line) => line.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ReportRunner({ report, params }: { report: ReportDefinition; params: ReportParams }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["report", report.id, report.rpc, params],
    queryFn: async () => {
      const args = buildRpcArgs(report, params);
      const { data: rows, error: err } = await supabase.rpc(report.rpc as never, args as never);
      if (err) throw err;
      return (rows ?? []) as Record<string, unknown>[];
    },
  });

  const columns = data?.length ? Object.keys(data[0]) : [];

  return (
    <Card className="table-shell border-border/60">
      <div className="flex flex-col gap-2 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold">{report.title}</div>
          <div className="text-xs text-muted-foreground">{report.description}</div>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={!data?.length}
          onClick={() => exportReportCsv(data ?? [], report.id)}
        >
          <FileDown className="mr-1.5 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {isLoading ? (
        <div className="p-6"><Skeleton className="h-32 w-full" /></div>
      ) : error ? (
        <div className="p-6 text-sm text-destructive">{(error as Error).message}</div>
      ) : !data?.length ? (
        <div className="p-10">
          <EmptyState icon={BarChart3} title="No data" description="No records match this report for the selected filters." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col} className={isNumericCol(col) ? "text-right" : ""}>{humanizeKey(col)}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col} className={`text-sm ${isNumericCol(col) ? "text-right" : ""}`}>
                      {formatCell(col, row[col])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="border-t border-border/60 px-4 py-2 text-xs text-muted-foreground">
            {data.length} row{data.length === 1 ? "" : "s"}
          </div>
        </div>
      )}
    </Card>
  );
}

function isNumericCol(col: string) {
  if (col === "metric" || col.endsWith("_name") || col === "worker_name" || col === "client_name") return false;
  return /count|amount|cost|revenue|margin|total|hours|pct|rate|balance|rent|deduction|gap|quantity|filled|workers|occupants|capacity|commission|est_|sample|warnings|issues|critical|open_issues|hires|submitted|conversion|fulfilment|absent|days_remaining|avg_days|period_year|period_month/i.test(col);
}
