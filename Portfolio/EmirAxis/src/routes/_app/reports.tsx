import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { ReportRunner } from "@/components/app/ReportRunner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  REPORT_CATALOG,
  REPORT_GROUPS,
  getReportById,
  type ReportGroup,
} from "@/lib/reports-catalog";
import type { ReportParams } from "@/components/app/ReportRunner";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — Staffing OS" }] }),
  component: ReportsPage,
});

function defaultRange() {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const last = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);
  return { from: first, to: last };
}

function ReportsPage() {
  const today = new Date();
  const [activeGroup, setActiveGroup] = useState<ReportGroup>("operational");
  const [selectedId, setSelectedId] = useState(REPORT_CATALOG[0].id);
  const [search, setSearch] = useState("");
  const [range, setRange] = useState(defaultRange);
  const [period, setPeriod] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });
  const [daysAhead, setDaysAhead] = useState(90);

  const reportParams: ReportParams = useMemo(
    () => ({ from: range.from, to: range.to, year: period.year, month: period.month, daysAhead }),
    [range, period, daysAhead],
  );

  const selected = getReportById(selectedId) ?? REPORT_CATALOG[0];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return REPORT_CATALOG.filter((r) => {
      if (r.group !== activeGroup) return false;
      if (!q) return true;
      return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    });
  }, [activeGroup, search]);

  const groupCounts = useMemo(() => {
    const m = {} as Record<ReportGroup, number>;
    for (const g of REPORT_GROUPS) m[g.id] = REPORT_CATALOG.filter((r) => r.group === g.id).length;
    return m;
  }, []);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Insights"
        title="Reports"
        description={`PRD report catalog — ${REPORT_CATALOG.length} reports across operational, recruitment, payroll, finance, and HR.`}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:w-72 lg:sticky lg:top-4">
          <div className="rounded-lg border border-border/60 bg-card p-3 space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 h-9"
                placeholder="Search reports…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {REPORT_GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setActiveGroup(g.id);
                    const first = REPORT_CATALOG.find((r) => r.group === g.id);
                    if (first) setSelectedId(first.id);
                  }}
                  className={cn(
                    "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                    activeGroup === g.id ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {g.label}
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">{groupCounts[g.id]}</Badge>
                </button>
              ))}
            </div>
            <nav className="max-h-[min(60vh,520px)] overflow-y-auto space-y-0.5 pr-1">
              {filtered.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedId(r.id)}
                  className={cn(
                    "w-full rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                    selectedId === r.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/60",
                  )}
                >
                  <div className="flex items-start gap-2">
                    <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0 opacity-60" />
                    <span className="leading-snug">{r.title}</span>
                  </div>
                </button>
              ))}
              {!filtered.length && (
                <p className="px-2 py-4 text-xs text-muted-foreground">No reports match your search.</p>
              )}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          {(selected.paramType === "dateRange" || selected.paramType === "yearMonth" || selected.paramType === "daysAhead") && (
            <div className="filter-bar flex-wrap sm:items-end rounded-lg border border-border/60 bg-card p-4">
              {selected.paramType === "dateRange" && (
                <>
                  <div className="min-w-[10rem]">
                    <Label className="text-xs">From</Label>
                    <DatePicker value={range.from} onChange={(v) => setRange({ ...range, from: v ?? range.from })} clearable={false} />
                  </div>
                  <div className="min-w-[10rem]">
                    <Label className="text-xs">To</Label>
                    <DatePicker value={range.to} onChange={(v) => setRange({ ...range, to: v ?? range.to })} clearable={false} />
                  </div>
                </>
              )}
              {selected.paramType === "yearMonth" && (
                <>
                  <div>
                    <Label className="text-xs">Year</Label>
                    <Input type="number" className="w-24 h-9" value={period.year} onChange={(e) => setPeriod({ ...period, year: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label className="text-xs">Month</Label>
                    <Input type="number" className="w-20 h-9" min={1} max={12} value={period.month} onChange={(e) => setPeriod({ ...period, month: Number(e.target.value) })} />
                  </div>
                </>
              )}
              {selected.paramType === "daysAhead" && (
                <div>
                  <Label className="text-xs">Days ahead</Label>
                  <Input type="number" className="w-24 h-9" min={7} max={365} value={daysAhead} onChange={(e) => setDaysAhead(Number(e.target.value))} />
                </div>
              )}
            </div>
          )}

          <ReportRunner key={selected.id} report={selected} params={reportParams} />
        </div>
      </div>
    </div>
  );
}
