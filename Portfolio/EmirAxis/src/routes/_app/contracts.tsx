import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, FileDown, ExternalLink } from "lucide-react";
import { usePdfBranding } from "@/hooks/use-pdf-branding";
import { generateContractPdfAction } from "@/lib/pdf-actions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/contracts")({
  head: () => ({ meta: [{ title: "Contracts & Letters — EmirAxis" }] }),
  component: ContractsPage,
});

const TYPES = ["offer_letter","employment_contract","noc","salary_certificate","experience_certificate","termination_letter","visa_cancellation","deployment_letter","warning_letter"];

type Row = {
  id: string; doc_type: string; title: string; body: string | null;
  worker_id: string | null; client_id: string | null;
  pdf_url: string | null; signed_url: string | null; signed: boolean;
  issued_date: string | null; created_at: string;
};

function ContractsPage() {
  const { user, hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [pdfBusy, setPdfBusy] = useState<string | null>(null);
  const pdfBranding = usePdfBranding();
  const canManage = hasAnyRole(["admin", "manager"]);

  const { data: workers } = useQuery({ queryKey: ["workers-lite"], queryFn: async () => (await supabase.from("workers").select("id, full_name").order("full_name")).data ?? [] });
  const workerMap = new Map((workers ?? []).map((w) => [w.id, w]));

  const { data: rows, isLoading } = useQuery({
    queryKey: ["contract_documents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contract_documents").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const create = useMutation({
    mutationFn: async (p: Partial<Row>) => {
      const { error } = await supabase.from("contract_documents").insert({ ...p, created_by: user?.id } as never);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Document created"); setOpen(false); qc.invalidateQueries({ queryKey: ["contract_documents"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Row> }) => {
      const { error } = await supabase.from("contract_documents").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["contract_documents"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="HR"
        title="Contracts & Letters"
        description="Offer letters, contracts, NOCs, salary certificates, termination letters."
        actions={canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> New document</Button></DialogTrigger>
            <CreateDialog workers={workers ?? []} onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
          </Dialog>
        )}
      />
      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6"><Skeleton className="h-10" /></div>
          : !rows?.length ? <div className="p-10"><EmptyState icon={FileText} title="No documents" description="Generate offer letters and other workforce documents." /></div>
          : (
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Worker</TableHead><TableHead>Issued</TableHead><TableHead>Signed</TableHead><TableHead className="w-24">PDF</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell className="capitalize text-xs">{r.doc_type.replace(/_/g, " ")}</TableCell>
                  <TableCell>{r.worker_id ? workerMap.get(r.worker_id)?.full_name : "—"}</TableCell>
                  <TableCell className="text-xs">{r.issued_date ? format(new Date(r.issued_date), "PP") : "—"}</TableCell>
                  <TableCell>
                    {canManage ? (
                      <Button size="sm" variant={r.signed ? "default" : "outline"} onClick={() => update.mutate({ id: r.id, patch: { signed: !r.signed } })}>{r.signed ? "Signed" : "Mark signed"}</Button>
                    ) : <Badge variant={r.signed ? "default" : "secondary"}>{r.signed ? "Signed" : "Pending"}</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" disabled={pdfBusy === r.id} onClick={async () => {
                        setPdfBusy(r.id);
                        try { await generateContractPdfAction(r.id, pdfBranding); toast.success("PDF generated"); qc.invalidateQueries({ queryKey: ["contract_documents"] }); }
                        catch (e) { toast.error(e instanceof Error ? e.message : "PDF failed"); }
                        finally { setPdfBusy(null); }
                      }}><FileDown className="h-4 w-4" /></Button>
                      {r.pdf_url && <a href={r.pdf_url} target="_blank" rel="noreferrer"><Button size="icon" variant="ghost"><ExternalLink className="h-4 w-4" /></Button></a>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

function CreateDialog({ workers, onSubmit, pending }: { workers: { id: string; full_name: string }[]; onSubmit: (p: Partial<Row>) => void; pending: boolean }) {
  const [f, setF] = useState<Partial<Row>>({ doc_type: "offer_letter", issued_date: new Date().toISOString().slice(0, 10), signed: false });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New document</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div className="form-grid-2">
          <div><Label>Type</Label>
            <Select value={f.doc_type} onValueChange={(v) => setF({ ...f, doc_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Issued date</Label><DatePicker value={f.issued_date} onChange={(v) => setF({ ...f, issued_date: v })} /></div>
        </div>
        <div><Label>Worker</Label>
          <Select value={f.worker_id ?? "none"} onValueChange={(v) => setF({ ...f, worker_id: v === "none" ? null : v })}>
            <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent><SelectItem value="none">None</SelectItem>{workers.map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Title</Label><Input value={f.title ?? ""} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
        <div><Label>Body</Label><Textarea rows={5} value={f.body ?? ""} onChange={(e) => setF({ ...f, body: e.target.value })} /></div>
      </div>
      <DialogFooter><Button disabled={!f.title || pending} onClick={() => onSubmit(f)}>{pending ? "Saving…" : "Create"}</Button></DialogFooter>
    </DialogContent>
  );
}
