import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Users, FileSpreadsheet, Receipt, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/client-portal")({
  head: () => ({ meta: [{ title: "Client Portal — Staffing OS" }] }),
  component: ClientPortalPage,
});

function ClientPortalPage() {
  const { hasRole, profile } = useAuth();

  if (!hasRole("client") && !hasRole("admin")) {
    return (
      <Card className="p-10">
        <EmptyState icon={Building2} title="Client access only" description="This portal is for client company users. Contact your agency administrator." />
      </Card>
    );
  }

  const { data: clientId, isLoading } = useQuery({
    queryKey: ["my-client-id", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("client_id").eq("id", profile!.id).maybeSingle();
      return data?.client_id as string | null;
    },
  });

  if (isLoading) return <Skeleton className="h-64" />;
  if (!clientId) {
    return (
      <Card className="p-10">
        <EmptyState icon={Building2} title="No client linked" description="Ask an administrator to link your profile to a client company (profiles.client_id)." />
      </Card>
    );
  }

  return <ClientPortalContent clientId={clientId} />;
}

function ClientPortalContent({ clientId }: { clientId: string }) {
  const qc = useQueryClient();
  const [joOpen, setJoOpen] = useState(false);
  const [joForm, setJoForm] = useState({ title: "", quantity: 1, category: "", description: "" });

  const { data: client } = useQuery({
    queryKey: ["client-portal-client", clientId],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("legal_name, trade_name").eq("id", clientId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: staff } = useQuery({
    queryKey: ["client-staff", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("placements")
        .select("id, status, start_date, workers(full_name, employee_code, designation), job_orders(title)")
        .eq("client_id", clientId)
        .in("status", ["confirmed", "active"]);
      if (error) throw error;
      return data;
    },
  });

  const { data: timesheets } = useQuery({
    queryKey: ["client-timesheets", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timesheets")
        .select("id, period_start, period_end, total_hours, status, workers(full_name)")
        .eq("client_id", clientId)
        .order("period_start", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const { data: invoices } = useQuery({
    queryKey: ["client-invoices", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("id, reference, issue_date, due_date, total, status, amount_paid")
        .eq("client_id", clientId)
        .order("issue_date", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
  });

  const approveTs = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const { error } = await supabase.from("timesheets").update({ status, approved_at: new Date().toISOString() } as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Timesheet updated");
      qc.invalidateQueries({ queryKey: ["client-timesheets"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const createJobOrder = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("job_orders").insert({
        client_id: clientId,
        title: joForm.title,
        quantity: joForm.quantity,
        category: joForm.category || null,
        description: joForm.description || null,
        status: "draft",
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Manpower request submitted");
      setJoOpen(false);
      setJoForm({ title: "", quantity: 1, category: "", description: "" });
      qc.invalidateQueries({ queryKey: ["job_orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Client portal"
        title={client?.legal_name ?? "Your company"}
        description="View deployed staff, approve timesheets, download invoices, and request manpower."
        actions={
          <Dialog open={joOpen} onOpenChange={setJoOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1.5 h-4 w-4" /> Request manpower</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>New manpower request</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Role / title</Label><Input value={joForm.title} onChange={(e) => setJoForm({ ...joForm, title: e.target.value })} /></div>
                <div><Label>Quantity</Label><Input type="number" min={1} value={joForm.quantity} onChange={(e) => setJoForm({ ...joForm, quantity: Number(e.target.value) })} /></div>
                <div><Label>Category</Label><Input value={joForm.category} onChange={(e) => setJoForm({ ...joForm, category: e.target.value })} placeholder="Hospitality, security…" /></div>
                <div><Label>Details</Label><Textarea value={joForm.description} onChange={(e) => setJoForm({ ...joForm, description: e.target.value })} rows={3} /></div>
              </div>
              <DialogFooter>
                <Button disabled={!joForm.title.trim() || createJobOrder.isPending} onClick={() => createJobOrder.mutate()}>Submit request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs defaultValue="staff">
        <TabsList>
          <TabsTrigger value="staff"><Users className="mr-1.5 h-3.5 w-3.5" /> Staff</TabsTrigger>
          <TabsTrigger value="timesheets"><FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Timesheets</TabsTrigger>
          <TabsTrigger value="invoices"><Receipt className="mr-1.5 h-3.5 w-3.5" /> Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="mt-4">
          <Card className="table-shell">
            {!staff?.length ? (
              <div className="p-8"><EmptyState icon={Users} title="No active deployments" description="Deployed workers will appear here." /></div>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>Worker</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {staff.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{(p.workers as { full_name: string })?.full_name}</TableCell>
                      <TableCell className="text-muted-foreground">{(p.job_orders as { title: string })?.title ?? "—"}</TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="timesheets" className="mt-4">
          <Card className="table-shell">
            {!timesheets?.length ? (
              <div className="p-8"><EmptyState icon={FileSpreadsheet} title="No timesheets" /></div>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>Worker</TableHead><TableHead>Period</TableHead><TableHead>Hours</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
                <TableBody>
                  {timesheets.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{(t.workers as { full_name: string })?.full_name}</TableCell>
                      <TableCell className="text-xs">{format(new Date(t.period_start), "dd MMM")} – {format(new Date(t.period_end), "dd MMM yyyy")}</TableCell>
                      <TableCell>{t.total_hours}</TableCell>
                      <TableCell><StatusBadge status={t.status} /></TableCell>
                      <TableCell>
                        {t.status === "submitted" && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => approveTs.mutate({ id: t.id, status: "approved" })}>Approve</Button>
                            <Button size="sm" variant="ghost" onClick={() => approveTs.mutate({ id: t.id, status: "rejected" })}>Reject</Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <Card className="table-shell">
            {!invoices?.length ? (
              <div className="p-8"><EmptyState icon={Receipt} title="No invoices" /></div>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>Reference</TableHead><TableHead>Due</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs">{inv.reference}</TableCell>
                      <TableCell>{inv.due_date ? format(new Date(inv.due_date), "dd MMM yyyy") : "—"}</TableCell>
                      <TableCell>AED {Number(inv.total).toFixed(2)}</TableCell>
                      <TableCell><StatusBadge status={inv.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-center text-xs text-muted-foreground">
        Need help? <Link to="/issues" className="text-primary underline">Raise a welfare ticket</Link> with your agency.
      </p>
    </div>
  );
}
