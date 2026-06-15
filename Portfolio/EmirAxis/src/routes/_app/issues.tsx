import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Plus, MessageSquare, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { BulkBar } from "@/components/app/BulkBar";
import { BulkEditDialog } from "@/components/app/BulkEditDialog";
import { downloadCsv, toCsv } from "@/components/app/BulkImportDialog";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/issues")({
  head: () => ({ meta: [{ title: "Welfare & Issues — Staffing OS" }] }),
  component: IssuesPage,
});

type Issue = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  severity: string;
  status: string;
  worker_id: string | null;
  reported_by: string | null;
  assigned_to: string | null;
  resolution: string | null;
  resolved_at: string | null;
  created_at: string;
  workers?: { full_name: string; employee_code: string | null } | null;
};

const CATEGORIES = ["welfare", "accommodation", "transport", "payroll", "safety", "hr", "other"];
const SEVERITIES = ["low", "medium", "high", "critical"];
const STATUSES = ["open", "in_progress", "resolved", "closed"];

function IssuesPage() {
  const { user, hasAnyRole } = useAuth();
  const qc = useQueryClient();
  const [openCreate, setOpenCreate] = useState(false);
  const [selected, setSelected] = useState<Issue | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);
  const canManage = hasAnyRole(["admin", "manager", "recruiter"]);

  const { data: issues, isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("issues")
        .select("*, workers:worker_id(full_name, employee_code)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Issue[];
    },
  });

  const { data: workers } = useQuery({
    queryKey: ["workers-lite"],
    queryFn: async () => {
      const { data } = await supabase.from("workers").select("id, full_name, employee_code").order("full_name");
      return data ?? [];
    },
  });

  const open = issues?.filter((i) => i.status === "open").length ?? 0;
  const inProgress = issues?.filter((i) => i.status === "in_progress").length ?? 0;
  const critical = issues?.filter((i) => i.severity === "critical" && i.status !== "closed" && i.status !== "resolved").length ?? 0;
  const resolved30 = issues?.filter((i) => i.resolved_at && new Date(i.resolved_at) > new Date(Date.now() - 30 * 86400000)).length ?? 0;

  const createIssue = useMutation({
    mutationFn: async (payload: Partial<Issue>) => {
      const { error } = await supabase.from("issues").insert({ ...payload, reported_by: user?.id } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Ticket created");
      setOpenCreate(false);
      qc.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateIssue = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Issue> }) => {
      if (patch.status === "resolved" && !patch.resolved_at) patch.resolved_at = new Date().toISOString();
      const { error } = await supabase.from("issues").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["issues"] });
      qc.invalidateQueries({ queryKey: ["issue", selected?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Welfare"
        title="Welfare & Issues"
        description="Worker grievances, accommodation, transport and HR escalations."
        actions={
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1.5 h-4 w-4" /> New ticket</Button>
            </DialogTrigger>
            <CreateIssueDialog workers={workers ?? []} onSubmit={(p) => createIssue.mutate(p)} pending={createIssue.isPending} />
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={AlertTriangle} label="Open" value={open} tone="warning" />
        <StatCard icon={MessageSquare} label="In progress" value={inProgress} tone="info" />
        <StatCard icon={AlertTriangle} label="Critical" value={critical} tone="danger" />
        <StatCard icon={CheckCircle2} label="Resolved (30d)" value={resolved30} tone="success" />
      </div>

      <Card className="table-shell border-border/60">
        {isLoading ? (
          <div className="p-6 space-y-2"><Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
        ) : !issues?.length ? (
          <div className="p-10"><EmptyState icon={AlertTriangle} title="No tickets yet" description="Capture worker grievances and accommodation issues here." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Reported</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((i) => (
                <TableRow key={i.id} className="cursor-pointer" onClick={() => setSelected(i)}>
                  <TableCell className="font-medium">{i.title}</TableCell>
                  <TableCell className="text-muted-foreground">{i.workers?.full_name ?? "—"}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">{i.category}</TableCell>
                  <TableCell><StatusBadge status={i.severity} /></TableCell>
                  <TableCell><StatusBadge status={i.status} /></TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{formatDistanceToNow(new Date(i.created_at), { addSuffix: true })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent form className="w-full sm:max-w-xl overflow-y-auto">
          {selected && (
            <IssueDetail
              issue={selected}
              canManage={canManage}
              onUpdate={(patch) => updateIssue.mutate({ id: selected.id, patch })}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CreateIssueDialog({ workers, onSubmit, pending }: { workers: { id: string; full_name: string; employee_code: string | null }[]; onSubmit: (p: Partial<Issue>) => void; pending: boolean }) {
  const [form, setForm] = useState<Partial<Issue>>({ category: "welfare", severity: "medium", status: "open" });
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>New welfare ticket</DialogTitle>
        <DialogDescription>Log a grievance, incident, or HR escalation.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div><Label>Title</Label><Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Short summary" /></div>
        <div><Label>Description</Label><Textarea rows={4} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="form-grid-2">
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Severity</Label>
            <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SEVERITIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Worker (optional)</Label>
          <Select value={form.worker_id ?? "none"} onValueChange={(v) => setForm({ ...form, worker_id: v === "none" ? null : v })}>
            <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— None —</SelectItem>
              {workers.map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name} {w.employee_code ? `(${w.employee_code})` : ""}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button disabled={!form.title || pending} onClick={() => onSubmit(form)}>{pending ? "Creating…" : "Create ticket"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function IssueDetail({ issue, canManage, onUpdate }: { issue: Issue; canManage: boolean; onUpdate: (p: Partial<Issue>) => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [comment, setComment] = useState("");
  const [resolution, setResolution] = useState(issue.resolution ?? "");

  const { data: comments } = useQuery({
    queryKey: ["issue-comments", issue.id],
    queryFn: async () => {
      const { data } = await supabase.from("issue_comments").select("*").eq("issue_id", issue.id).order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  const postComment = useMutation({
    mutationFn: async () => {
      if (!comment.trim() || !user?.id) return;
      const { error } = await supabase.from("issue_comments").insert({ issue_id: issue.id, author_id: user.id, body: comment.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      setComment("");
      qc.invalidateQueries({ queryKey: ["issue-comments", issue.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-xl">{issue.title}</SheetTitle>
        <SheetDescription className="flex items-center gap-2">
          <StatusBadge status={issue.severity} />
          <StatusBadge status={issue.status} />
          <span className="capitalize text-xs">{issue.category}</span>
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-5 py-5">
        {issue.description && (
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">{issue.description}</div>
        )}
        {issue.workers && (
          <div className="text-xs text-muted-foreground">Worker: <span className="font-medium text-foreground">{issue.workers.full_name}</span></div>
        )}

        {canManage && (
          <div className="space-y-3 rounded-lg border border-border/60 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Manage</div>
            <div className="form-grid-2 gap-2">
              <Select value={issue.status} onValueChange={(v) => onUpdate({ status: v as Issue["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={issue.severity} onValueChange={(v) => onUpdate({ severity: v as Issue["severity"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SEVERITIES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Textarea placeholder="Resolution notes…" rows={2} value={resolution} onChange={(e) => setResolution(e.target.value)} />
            <Button size="sm" variant="outline" onClick={() => onUpdate({ resolution })}>Save resolution</Button>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Activity</div>
          <div className="space-y-2">
            {comments?.length ? comments.map((c) => (
              <div key={c.id} className="rounded-md border border-border/60 bg-background p-2.5 text-sm">
                <div className="text-xs text-muted-foreground">{format(new Date(c.created_at), "PPp")}</div>
                <div>{c.body}</div>
              </div>
            )) : <div className="text-xs text-muted-foreground">No comments yet.</div>}
          </div>
          <div className="flex gap-2">
            <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment…" />
            <Button size="sm" disabled={!comment.trim() || postComment.isPending} onClick={() => postComment.mutate()}>Post</Button>
          </div>
        </div>
      </div>
    </>
  );
}
