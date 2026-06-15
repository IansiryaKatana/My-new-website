import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageTemplatesPanel } from "@/components/app/MessageTemplatesPanel";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/communications")({
  head: () => ({ meta: [{ title: "Communications — EmirAxis" }] }),
  component: CommsPage,
});

const CHANNELS = ["whatsapp","sms","email","phone","in_person","other"];
const DIRS = ["outbound","inbound"];

type Row = {
  id: string; channel: string; direction: string; subject: string | null;
  body: string | null; contacted_at: string; worker_id: string | null;
  candidate_id: string | null; client_id: string | null;
};

function CommsPage() {
  const { user, hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const canWrite = hasAnyRole(["admin", "manager", "recruiter"]);

  const { data: workers } = useQuery({ queryKey: ["workers-lite"], queryFn: async () => (await supabase.from("workers").select("id, full_name").order("full_name")).data ?? [] });
  const { data: clients } = useQuery({ queryKey: ["clients-lite"], queryFn: async () => (await supabase.from("clients").select("id, legal_name").order("legal_name")).data ?? [] });
  const workerMap = new Map((workers ?? []).map((w) => [w.id, w]));
  const clientMap = new Map((clients ?? []).map((c) => [c.id, c]));

  const { data: rows, isLoading } = useQuery({
    queryKey: ["communication_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("communication_logs").select("*").order("contacted_at", { ascending: false }).limit(200);
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const create = useMutation({
    mutationFn: async (p: Partial<Row>) => {
      const { error } = await supabase.from("communication_logs").insert({ ...p, created_by: user?.id } as never);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Logged"); setOpen(false); qc.invalidateQueries({ queryKey: ["communication_logs"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="CRM"
        title="Communications Log"
        description="Track WhatsApp, SMS, calls, and emails with candidates, workers, and clients."
        actions={canWrite && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> Log message</Button></DialogTrigger>
            <CreateDialog workers={workers ?? []} clients={clients ?? []} onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
          </Dialog>
        )}
      />
      <Tabs defaultValue="log">
        <TabsList><TabsTrigger value="log">Communication log</TabsTrigger><TabsTrigger value="templates">Message templates</TabsTrigger></TabsList>
        <TabsContent value="templates" className="mt-4"><MessageTemplatesPanel /></TabsContent>
        <TabsContent value="log" className="mt-4">
      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6"><Skeleton className="h-10" /></div>
          : !rows?.length ? <div className="p-10"><EmptyState icon={MessageSquare} title="No communications logged" description="Start logging outreach to track interactions." /></div>
          : (
          <Table>
            <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Channel</TableHead><TableHead>Direction</TableHead><TableHead>With</TableHead><TableHead>Subject</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs">{format(new Date(r.contacted_at), "PP p")}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{r.channel}</Badge></TableCell>
                  <TableCell className="capitalize text-xs">{r.direction}</TableCell>
                  <TableCell>{r.worker_id ? workerMap.get(r.worker_id)?.full_name : r.client_id ? clientMap.get(r.client_id)?.legal_name : "—"}</TableCell>
                  <TableCell className="max-w-sm truncate">{r.subject ?? r.body ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateDialog({ workers, clients, onSubmit, pending }: { workers: { id: string; full_name: string }[]; clients: { id: string; legal_name: string }[]; onSubmit: (p: Partial<Row>) => void; pending: boolean }) {
  const [f, setF] = useState<Partial<Row>>({ channel: "whatsapp", direction: "outbound", contacted_at: new Date().toISOString() });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Log communication</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div className="form-grid-2">
          <div><Label>Channel</Label>
            <Select value={f.channel} onValueChange={(v) => setF({ ...f, channel: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CHANNELS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Direction</Label>
            <Select value={f.direction} onValueChange={(v) => setF({ ...f, direction: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DIRS.map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="form-grid-2">
          <div><Label>Worker</Label>
            <Select value={f.worker_id ?? "none"} onValueChange={(v) => setF({ ...f, worker_id: v === "none" ? null : v })}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent><SelectItem value="none">None</SelectItem>{workers.map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Client</Label>
            <Select value={f.client_id ?? "none"} onValueChange={(v) => setF({ ...f, client_id: v === "none" ? null : v })}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent><SelectItem value="none">None</SelectItem>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.legal_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div><Label>Subject</Label><Input value={f.subject ?? ""} onChange={(e) => setF({ ...f, subject: e.target.value })} /></div>
        <div><Label>Message</Label><Textarea rows={3} value={f.body ?? ""} onChange={(e) => setF({ ...f, body: e.target.value })} /></div>
      </div>
      <DialogFooter><Button disabled={pending} onClick={() => onSubmit(f)}>{pending ? "Saving…" : "Log"}</Button></DialogFooter>
    </DialogContent>
  );
}
