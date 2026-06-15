import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertOctagon, Plus, FileDown } from "lucide-react";
import { usePdfBranding } from "@/hooks/use-pdf-branding";
import { generateWarningPdfAction } from "@/lib/pdf-actions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/warning-letters")({
  head: () => ({ meta: [{ title: "Warning Letters — EmirAxis" }] }),
  component: WarningPage,
});

const TYPES = ["verbal","first_written","second_written","final","suspension","termination","absconding","performance"];
const STATUSES = ["draft","issued","acknowledged","disputed","closed"];

type Row = {
  id: string; worker_id: string; warning_type: string; status: string;
  incident_date: string; reason: string; description: string | null;
  issued_at: string | null; follow_up_date: string | null; pdf_url: string | null;
};

function WarningPage() {
  const { user, hasAnyRole } = useAuth();
  const pdfBranding = usePdfBranding();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const canManage = hasAnyRole(["admin", "manager"]);

  const { data: workers } = useQuery({
    queryKey: ["workers-lite"],
    queryFn: async () => (await supabase.from("workers").select("id, full_name, employee_code").order("full_name")).data ?? [],
  });
  const workerMap = new Map((workers ?? []).map((w) => [w.id, w]));

  const { data: rows, isLoading } = useQuery({
    queryKey: ["warning_letters"],
    queryFn: async () => {
      const { data, error } = await supabase.from("warning_letters").select("*").order("incident_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const create = useMutation({
    mutationFn: async (p: Partial<Row>) => {
      const { error } = await supabase.from("warning_letters").insert({ ...p, issued_by: user?.id } as never);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Warning letter created"); setOpen(false); qc.invalidateQueries({ queryKey: ["warning_letters"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Row> }) => {
      const { error } = await supabase.from("warning_letters").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["warning_letters"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Discipline"
        title="Warning Letters"
        description="Issue and track disciplinary warnings across the workforce."
        actions={canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> New warning</Button></DialogTrigger>
            <CreateDialog workers={workers ?? []} onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
          </Dialog>
        )}
      />
      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6 space-y-2"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
          : !rows?.length ? <div className="p-10"><EmptyState icon={AlertOctagon} title="No warning letters" description="Issue your first disciplinary warning." /></div>
          : (
          <Table>
            <TableHeader><TableRow><TableHead>Worker</TableHead><TableHead>Type</TableHead><TableHead>Incident</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead className="w-16" /></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => {
                const w = workerMap.get(r.worker_id);
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{w?.full_name ?? "—"}<div className="text-xs text-muted-foreground">{w?.employee_code}</div></TableCell>
                    <TableCell className="capitalize">{r.warning_type.replace(/_/g, " ")}</TableCell>
                    <TableCell className="text-xs">{format(new Date(r.incident_date), "PP")}</TableCell>
                    <TableCell className="max-w-xs truncate">{r.reason}</TableCell>
                    <TableCell>{canManage ? (
                      <Select value={r.status} onValueChange={(v) => update.mutate({ id: r.id, patch: { status: v, issued_at: v === "issued" && !r.issued_at ? new Date().toISOString() : r.issued_at } })}>
                        <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                      </Select>
                    ) : <StatusBadge status={r.status} />}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" title="Generate PDF" onClick={async () => {
                        try {
                          await generateWarningPdfAction(r.id, pdfBranding);
                          toast.success("PDF generated");
                          qc.invalidateQueries({ queryKey: ["warning_letters"] });
                        } catch (e) { toast.error((e as Error).message); }
                      }}><FileDown className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

function CreateDialog({ workers, onSubmit, pending }: { workers: { id: string; full_name: string }[]; onSubmit: (p: Partial<Row>) => void; pending: boolean }) {
  const [form, setForm] = useState<Partial<Row>>({ warning_type: "verbal", status: "draft", incident_date: new Date().toISOString().slice(0, 10) });
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader><DialogTitle>New warning letter</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Worker</Label>
          <Select value={form.worker_id ?? ""} onValueChange={(v) => setForm({ ...form, worker_id: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{workers.map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="form-grid-2">
          <div><Label>Type</Label>
            <Select value={form.warning_type} onValueChange={(v) => setForm({ ...form, warning_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Incident date</Label><DatePicker value={form.incident_date} onChange={(v) => setForm({ ...form, incident_date: v })} /></div>
        </div>
        <div><Label>Reason</Label><Input value={form.reason ?? ""} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
        <div><Label>Description</Label><Textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div><Label>Follow-up date</Label><DatePicker value={form.follow_up_date} onChange={(v) => setForm({ ...form, follow_up_date: v })} /></div>
      </div>
      <DialogFooter><Button disabled={!form.worker_id || !form.reason || pending} onClick={() => onSubmit(form)}>{pending ? "Saving…" : "Create"}</Button></DialogFooter>
    </DialogContent>
  );
}
