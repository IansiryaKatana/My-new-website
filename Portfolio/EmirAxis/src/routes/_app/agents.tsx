import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe2, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/agents")({
  head: () => ({ meta: [{ title: "Recruitment Agents — EmirAxis" }] }),
  component: AgentsPage,
});

type Row = {
  id: string; name: string; country: string | null; contact_person: string | null;
  email: string | null; phone: string | null; whatsapp: string | null;
  commission_pct: number | null; is_active: boolean; notes: string | null;
};

function AgentsPage() {
  const { hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const canManage = hasAnyRole(["admin", "manager"]);

  const { data: rows, isLoading } = useQuery({
    queryKey: ["recruitment_agents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("recruitment_agents").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const create = useMutation({
    mutationFn: async (p: Partial<Row>) => { const { error } = await supabase.from("recruitment_agents").insert(p as never); if (error) throw error; },
    onSuccess: () => { toast.success("Agent added"); setOpen(false); qc.invalidateQueries({ queryKey: ["recruitment_agents"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Sourcing"
        title="Recruitment Agents"
        description="Overseas and local recruitment partners with commission terms."
        actions={canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> New agent</Button></DialogTrigger>
            <CreateDialog onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
          </Dialog>
        )}
      />
      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6"><Skeleton className="h-10" /></div>
          : !rows?.length ? <div className="p-10"><EmptyState icon={Globe2} title="No agents" description="Add your first recruitment partner." /></div>
          : (
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Country</TableHead><TableHead>Contact</TableHead><TableHead>Email / Phone</TableHead><TableHead>Commission</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.country ?? "—"}</TableCell>
                  <TableCell>{r.contact_person ?? "—"}</TableCell>
                  <TableCell className="text-xs">{r.email ?? r.phone ?? "—"}</TableCell>
                  <TableCell>{r.commission_pct ? `${r.commission_pct}%` : "—"}</TableCell>
                  <TableCell><Badge variant={r.is_active ? "default" : "secondary"}>{r.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

function CreateDialog({ onSubmit, pending }: { onSubmit: (p: Partial<Row>) => void; pending: boolean }) {
  const [form, setForm] = useState<Partial<Row>>({ is_active: true });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New agent</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Name</Label><Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="form-grid-2">
          <div><Label>Country</Label><Input value={form.country ?? ""} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
          <div><Label>Contact person</Label><Input value={form.contact_person ?? ""} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></div>
        </div>
        <div className="form-grid-2">
          <div><Label>Email</Label><Input value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        </div>
        <div className="form-grid-2">
          <div><Label>WhatsApp</Label><Input value={form.whatsapp ?? ""} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} /></div>
          <div><Label>Commission %</Label><Input type="number" value={form.commission_pct ?? ""} onChange={(e) => setForm({ ...form, commission_pct: e.target.value ? Number(e.target.value) : null })} /></div>
        </div>
        <div><Label>Notes</Label><Textarea rows={2} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
      </div>
      <DialogFooter><Button disabled={!form.name || pending} onClick={() => onSubmit(form)}>{pending ? "Saving…" : "Create"}</Button></DialogFooter>
    </DialogContent>
  );
}
