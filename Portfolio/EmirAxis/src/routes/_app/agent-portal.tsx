import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe2, Plus, UserSearch } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { CandidateDocumentsPanel } from "@/components/app/CandidateDocumentsPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { NationalityCombobox } from "@/components/app/NationalityCombobox";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/_app/agent-portal")({
  head: () => ({ meta: [{ title: "Agent Portal — Staffing OS" }] }),
  component: AgentPortalPage,
});

function AgentPortalPage() {
  const { hasRole, profile } = useAuth();

  const { data: agentId, isLoading } = useQuery({
    queryKey: ["my-agent-id", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("agent_id").eq("id", profile!.id).maybeSingle();
      return data?.agent_id as string | null;
    },
  });

  if (!hasRole("admin") && !hasRole("manager") && !hasRole("agent") && !agentId && !isLoading) {
    return (
      <Card className="p-10">
        <EmptyState icon={Globe2} title="Agent access only" description="Link your profile to a recruitment agent in Admin → Users (agent_id on profile)." />
      </Card>
    );
  }

  if (isLoading) return <Skeleton className="h-64" />;
  if (!agentId && !hasRole("admin") && !hasRole("manager")) return null;

  return <AgentPortalContent agentId={agentId!} isAdminView={hasRole("admin") && !agentId} />;
}

function AgentPortalContent({ agentId, isAdminView }: { agentId: string; isAdminView?: boolean }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<{ id: string; full_name: string } | null>(null);

  const { data: agent } = useQuery({
    queryKey: ["agent", agentId],
    enabled: !!agentId,
    queryFn: async () => {
      const { data, error } = await supabase.from("recruitment_agents").select("*").eq("id", agentId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: candidates, isLoading } = useQuery({
    queryKey: ["agent-candidates", agentId],
    enabled: !!agentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("id, reference, full_name, phone, nationality, status, source, created_at")
        .eq("agent_id", agentId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const submit = useMutation({
    mutationFn: async (p: { full_name: string; phone?: string; nationality?: string; source?: string; notes?: string }) => {
      const { error } = await supabase.from("candidates").insert({
        ...p,
        agent_id: agentId,
        status: "new",
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Candidate submitted");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["agent-candidates"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const stats = {
    total: candidates?.length ?? 0,
    hired: candidates?.filter((c) => c.status === "hired").length ?? 0,
    pipeline: candidates?.filter((c) => !["hired", "rejected", "blacklisted"].includes(c.status)).length ?? 0,
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Agent portal"
        title={agent?.name ?? "Recruitment partner"}
        description={isAdminView ? "Select an agent on your profile to use this portal." : `Submit candidates · ${stats.total} total · ${stats.hired} hired`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> Submit candidate</Button></DialogTrigger>
            <SubmitCandidateDialog onSubmit={(p) => submit.mutate(p)} pending={submit.isPending} />
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Submitted</div><div className="text-2xl font-semibold">{stats.total}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">In pipeline</div><div className="text-2xl font-semibold">{stats.pipeline}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Hired</div><div className="text-2xl font-semibold text-gold">{stats.hired}</div></Card>
      </div>

      <Card className="table-shell">
        {isLoading ? <Skeleton className="m-6 h-10" /> : !candidates?.length ? (
          <div className="p-10"><EmptyState icon={UserSearch} title="No candidates yet" description="Submit your first candidate for the agency to review." /></div>
        ) : (
          <Table>
            <TableHeader><TableRow><TableHead>Ref</TableHead><TableHead>Name</TableHead><TableHead>Nationality</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {candidates.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setDetail({ id: c.id, full_name: c.full_name })}>
                  <TableCell className="font-mono text-xs">{c.reference}</TableCell>
                  <TableCell className="font-medium">{c.full_name}</TableCell>
                  <TableCell>{c.nationality ?? "—"}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader><SheetTitle>{detail?.full_name}</SheetTitle></SheetHeader>
          {detail && <div className="mt-6"><CandidateDocumentsPanel candidateId={detail.id} candidateName={detail.full_name} /></div>}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SubmitCandidateDialog({ onSubmit, pending }: { onSubmit: (p: Record<string, string>) => void; pending: boolean }) {
  const [f, setF] = useState({ full_name: "", phone: "", nationality: "", source: "", notes: "" });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Submit candidate</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Full name *</Label><Input value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></div>
        <div><Label>Phone</Label><PhoneInput value={f.phone} onChange={(v) => setF({ ...f, phone: v ?? "" })} /></div>
        <div><Label>Nationality</Label><NationalityCombobox value={f.nationality} onChange={(v) => setF({ ...f, nationality: v ?? "" })} /></div>
        <div><Label>Source</Label><Input placeholder="Agent referral" value={f.source} onChange={(e) => setF({ ...f, source: e.target.value })} /></div>
        <div><Label>Notes</Label><Textarea rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      </div>
      <DialogFooter><Button disabled={!f.full_name.trim() || pending} onClick={() => onSubmit(f)}>{pending ? "Submitting…" : "Submit"}</Button></DialogFooter>
    </DialogContent>
  );
}
