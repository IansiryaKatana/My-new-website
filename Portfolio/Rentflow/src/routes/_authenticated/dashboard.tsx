import { createFileRoute, Link } from "@tanstack/react-router";
import { actionQueueHref } from "@/lib/auth-routing";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Home,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffShell } from "@/components/staff-shell";
import { bootstrapFirstOwner, getCurrentUser } from "@/lib/auth.functions";
import {
  getDashboardOverview,
  getRentalFunnel,
  getActionQueue,
  getPaymentSummary,
} from "@/lib/dashboard.functions";
import { formatAed } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Rental OS" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const fetchUser = useServerFn(getCurrentUser);
  const bootstrap = useServerFn(bootstrapFirstOwner);
  const userQ = useQuery({ queryKey: ["currentUser"], queryFn: () => fetchUser() });

  useEffect(() => {
    if (userQ.data && userQ.data.roles.length === 0) {
      bootstrap().then(() => userQ.refetch());
    }
  }, [userQ.data, bootstrap, userQ]);

  return (
    <StaffShell title="Overview">
      <div className="space-y-6">
        <KpiRow />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FunnelCard />
          </div>
          <PaymentsCard />
        </div>
        <ActionQueueCard />
      </div>
    </StaffShell>
  );
}

function KpiRow() {
  const fetch = useServerFn(getDashboardOverview);
  const q = useQuery({ queryKey: ["overview"], queryFn: () => fetch() });
  if (q.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }
  if (q.isError) {
    return <p className="text-sm text-destructive">{(q.error as Error).message}</p>;
  }
  if (!q.data) return null;
  const d = q.data;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi
        icon={<Home className="h-4 w-4" />}
        label="Active tenancies"
        value={d.active_tenancies.toString()}
        sub={`${d.upcoming_tenancies} upcoming`}
      />
      <Kpi
        icon={<TrendingUp className="h-4 w-4" />}
        label="Occupancy"
        value={`${Math.round(d.occupancy_pct)}%`}
        sub={`${d.available_listings} available · ${d.total_listings} total`}
      />
      <Kpi
        icon={<CheckCircle2 className="h-4 w-4" />}
        label="Collected MTD"
        value={formatAed(d.mtd_collected)}
        sub={`${formatAed(d.mtd_due)} due`}
      />
      <Kpi
        icon={<AlertTriangle className="h-4 w-4" />}
        label="Overdue"
        value={formatAed(d.overdue_amount)}
        sub={`${d.overdue_count} payment${d.overdue_count === 1 ? "" : "s"}`}
        tone={d.overdue_count > 0 ? "warning" : undefined}
      />
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  tone?: "warning";
}) {
  const accent =
    tone === "warning"
      ? "from-watermelon to-watermelon/60"
      : "from-gold to-gold/60";

  return (
    <Card className="overflow-hidden border-border/80 shadow-elegant">
      <div className={`h-1 bg-gradient-to-r ${accent}`} />
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          <span className="text-gold">{icon}</span>
          {label}
        </div>
        <div
          className={`mt-2 text-2xl ${
            tone === "warning" ? "text-destructive" : "text-card-foreground"
          }`}
        >
          {value}
        </div>
        {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function FunnelCard() {
  const fetch = useServerFn(getRentalFunnel);
  const q = useQuery({ queryKey: ["funnel"], queryFn: () => fetch() });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pipeline — last 30 days</CardTitle>
      </CardHeader>
      <CardContent>
        {q.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : q.data ? (
          <div className="space-y-3">
            <FunnelRow label="Viewings" value={q.data.viewings_30d} max={q.data.viewings_30d || 1} />
            <FunnelRow
              label="Applications"
              value={q.data.applications_30d}
              max={q.data.viewings_30d || 1}
            />
            <FunnelRow label="Approved" value={q.data.approved_30d} max={q.data.viewings_30d || 1} />
            <FunnelRow
              label="Signed tenancies"
              value={q.data.tenancies_30d}
              max={q.data.viewings_30d || 1}
            />

            <div className="mt-6 grid grid-cols-4 gap-3 border-t border-border pt-4">
              <PipelineStage label="Submitted" value={q.data.pipeline.submitted} />
              <PipelineStage label="Docs review" value={q.data.pipeline.docs_review} />
              <PipelineStage label="Contract sent" value={q.data.pipeline.contract_sent} />
              <PipelineStage label="Approved" value={q.data.pipeline.approved} />
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function FunnelRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, (value / Math.max(max, 1)) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
      <Progress value={pct} className="mt-1.5 h-2" />
    </div>
  );
}

function PipelineStage({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 p-3 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg text-foreground">{value}</div>
    </div>
  );
}

function PaymentsCard() {
  const fetch = useServerFn(getPaymentSummary);
  const q = useQuery({ queryKey: ["payments-summary"], queryFn: () => fetch() });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {q.isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : q.data ? (
          Object.entries(q.data).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between text-sm">
              <span className="capitalize text-muted-foreground">{k.replace(/_/g, " ")}</span>
              <span className="font-medium text-foreground">
                {typeof v === "number" && (k.includes("amount") || k.includes("collected") || k.includes("next"))
                  ? formatAed(v)
                  : v}
              </span>
            </div>
          ))
        ) : null}
      </CardContent>
    </Card>
  );
}

function ActionQueueCard() {
  const fetch = useServerFn(getActionQueue);
  const q = useQuery({ queryKey: ["action-queue"], queryFn: () => fetch() });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Action queue</CardTitle>
      </CardHeader>
      <CardContent>
        {q.isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : q.data && q.data.length > 0 ? (
          <ul className="divide-y divide-border">
            {q.data.map((item) => (
              <li key={`${item.kind}-${item.entity_id}`}>
                <Link
                  to={actionQueueHref(item.kind, item.entity_id)}
                  className="flex items-start gap-3 py-3 transition-colors hover:bg-muted/40"
                >
                  <CalendarClock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{item.label}</div>
                    {item.sublabel && (
                      <div className="text-xs text-muted-foreground">{item.sublabel}</div>
                    )}
                  </div>
                  <StatusBadge status={item.urgency} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nothing needs your attention. Nice.</p>
        )}
      </CardContent>
    </Card>
  );
}
