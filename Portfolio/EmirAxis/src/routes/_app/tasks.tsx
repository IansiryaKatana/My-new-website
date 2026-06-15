import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckSquare, Plus } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({ meta: [{ title: "Tasks — EmirAxis" }] }),
  component: TasksPage,
});

const STATUSES = ["todo","in_progress","blocked","done","cancelled"];
const PRIORITIES = ["low","medium","high","urgent"];

type Row = {
  id: string; title: string; description: string | null; status: string;
  priority: string; assigned_to: string | null; due_date: string | null;
  created_by: string | null; completed_at: string | null;
};

function TasksPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: staff } = useQuery({
    queryKey: ["staff-lite"],
    queryFn: async () => (await supabase.from("profiles").select("id, full_name").eq("is_active", true).order("full_name")).data ?? [],
  });
  const staffMap = new Map((staff ?? []).map((s) => [s.id, s]));

  const { data: rows, isLoading } = useQuery({
    queryKey: ["internal_tasks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("internal_tasks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const create = useMutation({
    mutationFn: async (p: Partial<Row>) => {
      const { error } = await supabase.from("internal_tasks").insert({ ...p, created_by: user?.id } as never);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Task created"); setOpen(false); qc.invalidateQueries({ queryKey: ["internal_tasks"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Row> }) => {
      const { error } = await supabase.from("internal_tasks").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["internal_tasks"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Operations"
        title="Internal Tasks"
        description="Assignable to-dos across the team — recruitment, ops, finance and admin."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> New task</Button></DialogTrigger>
            <CreateDialog staff={staff ?? []} onSubmit={(p) => create.mutate(p)} pending={create.isPending} />
          </Dialog>
        }
      />
      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6"><Skeleton className="h-10" /></div>
          : !rows?.length ? <div className="p-10"><EmptyState icon={CheckSquare} title="No tasks" description="Create your first internal task." /></div>
          : (
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Assigned to</TableHead><TableHead>Priority</TableHead><TableHead>Due</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{r.assigned_to ? staffMap.get(r.assigned_to)?.full_name ?? "—" : "—"}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{r.priority}</Badge></TableCell>
                  <TableCell className="text-xs">{r.due_date ? format(new Date(r.due_date), "PP") : "—"}</TableCell>
                  <TableCell>
                    <Select value={r.status} onValueChange={(v) => update.mutate({ id: r.id, patch: { status: v, completed_at: v === "done" ? new Date().toISOString() : null } })}>
                      <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                    </Select>
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

function CreateDialog({ staff, onSubmit, pending }: { staff: { id: string; full_name: string | null }[]; onSubmit: (p: Partial<Row>) => void; pending: boolean }) {
  const [form, setForm] = useState<Partial<Row>>({ status: "todo", priority: "medium" });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New task</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Title</Label><Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>Description</Label><Textarea rows={2} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="form-grid-2">
          <div><Label>Priority</Label>
            <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Due date</Label><DatePicker value={form.due_date} onChange={(v) => setForm({ ...form, due_date: v })} /></div>
        </div>
        <div><Label>Assign to</Label>
          <Select value={form.assigned_to ?? "none"} onValueChange={(v) => setForm({ ...form, assigned_to: v === "none" ? null : v })}>
            <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
            <SelectContent><SelectItem value="none">Unassigned</SelectItem>{staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter><Button disabled={!form.title || pending} onClick={() => onSubmit(form)}>{pending ? "Saving…" : "Create"}</Button></DialogFooter>
    </DialogContent>
  );
}
