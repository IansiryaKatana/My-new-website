import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Users, Briefcase, Building2, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Staffing OS" }] }),
  component: AnalyticsPage,
});

const CHART_COLORS = ["hsl(var(--primary))", "hsl(var(--gold))", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0"];

function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics-full"],
    queryFn: async () => {
      const [clients, jobs, workers, placements, candidates, funnel, sources, issues, margins] = await Promise.all([
        supabase.from("clients").select("id, status"),
        supabase.from("job_orders").select("id, status, quantity, filled_count"),
        supabase.from("workers").select("id, status, base_salary"),
        supabase.from("placements").select("id, status, bill_rate, pay_rate, client_id, clients(legal_name)"),
        supabase.from("candidates").select("id, status"),
        supabase.rpc("get_recruitment_funnel"),
        supabase.rpc("get_candidates_by_source"),
        supabase.rpc("get_issues_by_category"),
        supabase.rpc("get_client_margin", {
          _from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
          _to: new Date().toISOString().slice(0, 10),
        }),
      ]);
      const byClient = new Map<string, { name: string; count: number }>();
      for (const p of placements.data ?? []) {
        const c = p.clients as { legal_name: string } | null;
        const name = c?.legal_name ?? "Unknown";
        const cur = byClient.get(name) ?? { name, count: 0 };
        if (p.status === "active") cur.count += 1;
        byClient.set(name, cur);
      }
      return {
        clients: clients.data ?? [],
        jobs: jobs.data ?? [],
        workers: workers.data ?? [],
        placements: placements.data ?? [],
        candidates: candidates.data ?? [],
        funnel: (funnel.data ?? []) as { stage: string; count: number }[],
        sources: (sources.data ?? []) as { source: string; count: number }[],
        issues: (issues.data ?? []) as { category: string; count: number }[],
        margins: (margins.data ?? []) as { client_name: string; margin: number; revenue: number }[],
        staffByClient: [...byClient.values()].sort((a, b) => b.count - a.count).slice(0, 8),
      };
    },
  });

  const activeClients = (data?.clients ?? []).filter((c) => c.status === "active").length;
  const openJobs = (data?.jobs ?? []).filter((j) => ["draft", "open", "in_progress", "partially_filled"].includes(String(j.status))).length;
  const activeWorkers = (data?.workers ?? []).filter((w) => w.status === "active").length;
  const totalDemand = (data?.jobs ?? []).reduce((s, j) => s + Number(j.quantity ?? 0), 0);
  const totalFilled = (data?.jobs ?? []).reduce((s, j) => s + Number(j.filled_count ?? 0), 0);
  const fillRate = totalDemand > 0 ? Math.round((totalFilled / totalDemand) * 100) : 0;
  const grossMonthly = (data?.workers ?? []).filter((w) => w.status === "active").reduce((s, w) => s + Number(w.base_salary ?? 0), 0);

  const marginChart = (data?.margins ?? []).slice(0, 6).map((m) => ({
    name: m.client_name?.slice(0, 12) ?? "—",
    margin: Number(m.margin ?? 0),
    revenue: Number(m.revenue ?? 0),
  }));

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Insights" title="Analytics" description="Operational KPIs, recruitment funnel, and client profitability." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active clients" value={activeClients} icon={Building2} loading={isLoading} />
        <StatCard label="Open job orders" value={openJobs} icon={Briefcase} loading={isLoading} />
        <StatCard label="Fill rate" value={`${fillRate}%`} icon={Briefcase} loading={isLoading} hint={`${totalFilled}/${totalDemand}`} />
        <StatCard label="Active workers" value={activeWorkers} icon={Users} loading={isLoading} tone="gold" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 p-4 sm:p-5">
          <h3 className="section-heading mb-4">Recruitment funnel</h3>
          {isLoading ? <Skeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data?.funnel ?? []} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="stage" width={90} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="border-border/60 p-4 sm:p-5">
          <h3 className="section-heading mb-4">Candidates by source</h3>
          {isLoading ? <Skeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data?.sources ?? []} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={90} label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}>
                  {(data?.sources ?? []).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="border-border/60 p-4 sm:p-5">
          <h3 className="section-heading mb-4">Staff by client (active)</h3>
          {isLoading ? <Skeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data?.staffByClient ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--gold))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="border-border/60 p-4 sm:p-5">
          <h3 className="section-heading mb-4">Client margin (MTD)</h3>
          {isLoading ? <Skeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={marginChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip formatter={(v: number) => `AED ${v.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="margin" stroke="hsl(var(--gold))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card className="border-border/60 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-sm font-medium"><Wallet className="h-4 w-4 text-gold" /> Payroll commitment</div>
        <div className="mt-2 text-2xl font-display font-semibold">AED {grossMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm font-normal text-muted-foreground">/ month base</span></div>
      </Card>

      {(data?.issues?.length ?? 0) > 0 && (
        <Card className="border-border/60 p-4 sm:p-5">
          <h3 className="section-heading mb-4">Open issues by category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.issues ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {!isLoading && !(data?.funnel?.length) && (
        <Card className="p-8 text-center text-sm text-muted-foreground border-border/60">
          <BarChart3 className="mx-auto mb-2 h-8 w-8 opacity-50" />
          Add candidates and placements to populate charts.
        </Card>
      )}
    </div>
  );
}
