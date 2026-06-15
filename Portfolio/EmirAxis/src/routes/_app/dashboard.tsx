import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, ClipboardList, UserSearch, Users, ArrowRight, AlertTriangle, Bell, Receipt } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { runComplianceAlerts } from "@/lib/workflows";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { useAuth } from "@/lib/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Staffing OS" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { profile, user, roles } = useAuth();
  const name = (profile?.full_name ?? user?.email ?? "there").split(" ")[0];

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [clientsRes, jobOrdersRes, candidatesRes, workersRes, recentJOs, expiringWorkers, openIssues, pendingLeave, overdueInv] = await Promise.all([
        supabase.from("clients").select("id, status", { count: "exact", head: false }),
        supabase.from("job_orders").select("id, status, quantity, filled_count"),
        supabase.from("candidates").select("id, status"),
        supabase.from("workers").select("id, status, visa_expiry, passport_expiry, labor_card_expiry, medical_expiry, emirates_id_expiry"),
        supabase.from("job_orders").select("id, reference, title, status, quantity, filled_count, priority, clients(legal_name)").order("created_at", { ascending: false }).limit(5),
        supabase.from("workers").select("id, full_name, employee_code, visa_expiry, labor_card_expiry, medical_expiry").or("visa_expiry.lte." + thirtyDaysOut() + ",labor_card_expiry.lte." + thirtyDaysOut() + ",medical_expiry.lte." + thirtyDaysOut()).limit(5),
        supabase.from("issues").select("id", { count: "exact", head: true }).in("status", ["open", "in_progress"]),
        supabase.from("leave_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("invoices").select("id", { count: "exact", head: true }).lt("due_date", today).in("status", ["sent", "partial", "overdue"]),
      ]);
      return {
        clients: clientsRes.data ?? [],
        jobOrders: jobOrdersRes.data ?? [],
        candidates: candidatesRes.data ?? [],
        workers: workersRes.data ?? [],
        recentJOs: recentJOs.data ?? [],
        expiringWorkers: expiringWorkers.data ?? [],
        openIssues: openIssues.count ?? 0,
        pendingLeave: pendingLeave.count ?? 0,
        overdueInvoices: overdueInv.count ?? 0,
      };
    },
  });

  const activeClients = data?.clients.filter((c) => c.status === "active").length ?? 0;
  const openJobOrders = data?.jobOrders.filter((j) => ["open", "in_progress", "partially_filled"].includes(j.status)).length ?? 0;
  const pipelineCandidates = data?.candidates.filter((c) => !["hired", "rejected", "withdrawn", "blacklisted"].includes(c.status)).length ?? 0;
  const activeWorkers = data?.workers.filter((w) => w.status === "active").length ?? 0;

  const runAlerts = useMutation({
    mutationFn: runComplianceAlerts,
    onSuccess: (n) => toast.success(`Created ${n} compliance notifications`),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <header className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          {roles[0] ? `Signed in as ${roles[0]}` : "Welcome"}
        </div>
        <h1 className="mt-2 break-words font-display text-2xl text-primary sm:text-3xl lg:text-4xl">Welcome back, {name}.</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-base">Here's what's happening across your workspace today.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active clients" value={activeClients} icon={Building2} loading={isLoading} hint={`${data?.clients.length ?? 0} total`} />
        <StatCard label="Open job orders" value={openJobOrders} icon={ClipboardList} loading={isLoading} hint={`${data?.jobOrders.length ?? 0} total`} />
        <StatCard label="Pipeline candidates" value={pipelineCandidates} icon={UserSearch} loading={isLoading} hint={`${data?.candidates.length ?? 0} total`} />
        <StatCard label="Active workers" value={activeWorkers} icon={Users} loading={isLoading} hint={`${data?.workers.length ?? 0} total`} tone="gold" />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open issues" value={data?.openIssues ?? 0} icon={AlertTriangle} loading={isLoading} tone="warning" />
        <StatCard label="Leave pending" value={data?.pendingLeave ?? 0} icon={Bell} loading={isLoading} />
        <StatCard label="Overdue invoices" value={data?.overdueInvoices ?? 0} icon={Receipt} loading={isLoading} tone="danger" />
      </section>

      {roles.includes("admin") && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" disabled={runAlerts.isPending} onClick={() => runAlerts.mutate()}>
            <Bell className="mr-1.5 h-3.5 w-3.5" /> Run compliance alerts
          </Button>
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 p-4 shadow-soft sm:p-5 lg:col-span-2">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="section-heading">Recent job orders</h2>
            <Button asChild variant="ghost" size="sm" className="w-fit shrink-0"><Link to="/job-orders">View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
          </div>
          <div className="mt-4 divide-y divide-border/60">
            {(data?.recentJOs ?? []).length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No job orders yet.</div>
            ) : (
              (data?.recentJOs ?? []).map((j) => (
                <div key={j.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{j.reference}</span>
                      <span className="min-w-0 break-words font-medium">{j.title}</span>
                      {j.priority === "urgent" && <Badge variant="destructive" className="h-5 shrink-0 text-[10px]">Urgent</Badge>}
                    </div>
                    <div className="break-anywhere text-xs text-muted-foreground">{(j.clients as { legal_name: string } | null)?.legal_name ?? "—"} · {j.filled_count}/{j.quantity} filled</div>
                  </div>
                  <StatusBadge status={j.status} className="w-fit shrink-0 self-start sm:self-center" />
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="border-border/60 p-4 shadow-soft sm:p-5">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <h2 className="section-heading">Expiring soon</h2>
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
          </div>
          <div className="mt-4 divide-y divide-border/60">
            {(data?.expiringWorkers ?? []).length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No upcoming expiries.</div>
            ) : (
              (data?.expiringWorkers ?? []).map((w) => {
                const dates: [string, string | null][] = [["Visa", w.visa_expiry], ["Labor card", w.labor_card_expiry], ["Medical", w.medical_expiry]];
                const next = dates.filter(([, d]) => d).sort(([, a], [, b]) => (a! < b! ? -1 : 1))[0];
                return (
                  <Link key={w.id} to="/workers" className="block py-3 transition-smooth hover:bg-accent/40 -mx-2 px-2 rounded">
                    <div className="font-medium text-sm">{w.full_name}</div>
                    <div className="text-xs text-muted-foreground">{w.employee_code} · {next?.[0]}: {next?.[1]}</div>
                  </Link>
                );
              })
            )}
          </div>
        </Card>
      </section>

      {roles.includes("admin") && (
        <Card className="overflow-hidden border-border/60 shadow-elegant">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Admin tools
              </span>
              <h2 className="mt-4 break-words font-display text-2xl text-primary sm:text-3xl">Make it yours.</h2>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                Customize branding, invite your team, and assign roles. The platform is white-label and ready to resell.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild className="bg-primary hover:bg-primary/90"><Link to="/admin/branding">Branding</Link></Button>
                <Button asChild variant="outline"><Link to="/admin/users">Users & roles</Link></Button>
              </div>
            </div>
            <div className="hidden bg-gradient-primary p-10 lg:block">
              <div className="space-y-3">
                {["Authentication & RLS", "Six roles built-in", "White-label branding", "Mobile-first + PWA", "Clients + Job Orders + Candidates + Workers", "Audit log everywhere"].map((line) => (
                  <div key={line} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-gold-foreground text-[10px]">✓</span>{line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function thirtyDaysOut() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}
