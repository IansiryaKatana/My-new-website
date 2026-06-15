import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Settings, Bell, FileText } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { runComplianceAlerts } from "@/lib/workflows";

export const Route = createFileRoute("/_app/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Staffing OS" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const runAlerts = useMutation({
    mutationFn: runComplianceAlerts,
    onSuccess: (n) => toast.success(`Queued ${n} compliance notifications for admins`),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Administration" title="Settings" description="Platform configuration, alerts, and integrations." />
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/admin/branding"><Card className="border-border/60 p-6 transition-smooth hover:shadow-elegant">
          <div className="text-sm font-medium">Branding & White-label</div>
          <div className="mt-1 text-xs text-muted-foreground">Logos, colors, company identity.</div>
        </Card></Link>
        <Link to="/admin/users"><Card className="border-border/60 p-6 transition-smooth hover:shadow-elegant">
          <div className="text-sm font-medium">Users & Roles</div>
          <div className="mt-1 text-xs text-muted-foreground">Link client users via profile client_id; worker portal via worker user_id.</div>
        </Card></Link>
      </div>
      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center gap-2 text-sm font-medium"><Bell className="h-4 w-4" /> Compliance automation</div>
        <p className="text-xs text-muted-foreground">Scan workers for visa, passport, and medical expiries and notify all admins/managers. Schedule via Supabase cron calling <code className="text-foreground">run_compliance_alerts()</code>.</p>
        <Button variant="outline" disabled={runAlerts.isPending} onClick={() => runAlerts.mutate()}>Run alerts now</Button>
      </Card>
      <Card className="space-y-2 border-border/60 p-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-medium text-foreground"><FileText className="h-4 w-4" /> Lifecycle features enabled</div>
        <ul className="list-inside list-disc space-y-1 text-xs">
          <li>Candidate → worker conversion</li>
          <li>Placement syncs job order fill counts</li>
          <li>Payroll runs, WPS SIF export, payslip issuance</li>
          <li>Invoice generation from approved timesheets</li>
          <li>Client portal & employee self-service</li>
        </ul>
      </Card>
    </div>
  );
}
