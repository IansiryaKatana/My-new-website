import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarDays, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkBar } from "@/components/app/BulkBar";
import { downloadCsv, toCsv } from "@/components/app/BulkImportDialog";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { useAuth } from "@/lib/auth/AuthProvider";

export const Route = createFileRoute("/_app/leave-approvals")({
  head: () => ({ meta: [{ title: "Leave Approvals — Staffing OS" }] }),
  component: LeaveApprovalsPage,
});

function LeaveApprovalsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [decisionOn, setDecisionOn] = useState<{ id: string; status: "approved" | "rejected" } | null>(null);
  const [bulkDecision, setBulkDecision] = useState<"approved" | "rejected" | null>(null);
  const [note, setNote] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["leave-approvals", filter],
    queryFn: async () => {
      let q = supabase.from("leave_requests").select("*, workers:worker_id(full_name, employee_code, designation)").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data as any[];
    },
  });

  const bulk = useBulkSelection(data ?? []);

  const decide = useMutation({
    mutationFn: async () => {
      if (!decisionOn || !user?.id) return;
      const { error } = await supabase.from("leave_requests").update({
        status: decisionOn.status,
        decided_by: user.id,
        decided_at: new Date().toISOString(),
        decision_note: note || null,
      } as never).eq("id", decisionOn.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Decision saved");
      setDecisionOn(null);
      setNote("");
      qc.invalidateQueries({ queryKey: ["leave-approvals"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkDecide = useMutation({
    mutationFn: async () => {
      if (!bulkDecision || !user?.id) return 0;
      const { error } = await supabase.from("leave_requests").update({
        status: bulkDecision,
        decided_by: user.id,
        decided_at: new Date().toISOString(),
        decision_note: note || null,
      } as never).in("id", bulk.selectedIds);
      if (error) throw error;
      return bulk.selectedIds.length;
    },
    onSuccess: (n) => {
      toast.success(`${bulkDecision === "approved" ? "Approved" : "Rejected"} ${n} request${n === 1 ? "" : "s"}`);
      bulk.clear();
      setBulkDecision(null);
      setNote("");
      qc.invalidateQueries({ queryKey: ["leave-approvals"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exportSelected = () => {
    const rows = (data ?? []).filter((r) => bulk.isSelected(r.id)).map((r) => ({
      worker: r.workers?.full_name ?? "",
      employee_code: r.workers?.employee_code ?? "",
      type: r.leave_type,
      start_date: r.start_date,
      end_date: r.end_date,
      days: r.days,
      status: r.status,
      reason: r.reason ?? "",
    }));
    downloadCsv(`leave-requests-${Date.now()}.csv`, toCsv(rows));
  };

  return (
    <div className="page-stack">
      <PageHeader eyebrow="HR" title="Leave Approvals" description="Review and respond to worker leave requests." />
      <Tabs value={filter} onValueChange={(v) => { setFilter(v as typeof filter); bulk.clear(); }}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="table-shell border-border/60">
        {isLoading ? <div className="p-6"><Skeleton className="h-32" /></div> :
         !data?.length ? <div className="p-10"><EmptyState icon={CalendarDays} title="No leave requests" description="When workers submit leave, requests will appear here." /></div> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={bulk.allSelected ? true : bulk.someSelected ? "indeterminate" : false}
                    onCheckedChange={bulk.toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r: any) => {
                const selected = bulk.isSelected(r.id);
                return (
                  <TableRow key={r.id} data-state={selected ? "selected" : undefined}>
                    <TableCell><Checkbox checked={selected} onCheckedChange={() => bulk.toggle(r.id)} aria-label="Select row" /></TableCell>
                    <TableCell>
                      <div className="font-medium">{r.workers?.full_name}</div>
                      <div className="text-xs text-muted-foreground">{r.workers?.employee_code}</div>
                    </TableCell>
                    <TableCell className="capitalize">{r.leave_type}</TableCell>
                    <TableCell className="text-xs">{format(new Date(r.start_date), "MMM d")} – {format(new Date(r.end_date), "MMM d, yy")}</TableCell>
                    <TableCell className="text-right">{r.days}</TableCell>
                    <TableCell className="max-w-xs truncate text-xs text-muted-foreground">{r.reason ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      {r.status === "pending" && (
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline" onClick={() => setDecisionOn({ id: r.id, status: "approved" })}><Check className="h-3.5 w-3.5" /></Button>
                          <Button size="sm" variant="outline" onClick={() => setDecisionOn({ id: r.id, status: "rejected" })}><X className="h-3.5 w-3.5" /></Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <BulkBar
        count={bulk.count}
        onClear={bulk.clear}
        onExport={exportSelected}
        extra={
          <>
            <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-success" onClick={() => setBulkDecision("approved")}>
              <Check className="h-3.5 w-3.5" /> Approve
            </Button>
            <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-destructive" onClick={() => setBulkDecision("rejected")}>
              <X className="h-3.5 w-3.5" /> Reject
            </Button>
          </>
        }
      />

      <Dialog open={!!decisionOn} onOpenChange={(o) => !o && setDecisionOn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{decisionOn?.status === "approved" ? "Approve" : "Reject"} leave request</DialogTitle>
          </DialogHeader>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Decision note (optional)" rows={3} />
          <DialogFooter>
            <Button onClick={() => decide.mutate()} disabled={decide.isPending}>Confirm {decisionOn?.status}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!bulkDecision} onOpenChange={(o) => { if (!o) { setBulkDecision(null); setNote(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{bulkDecision === "approved" ? "Approve" : "Reject"} {bulk.count} request{bulk.count === 1 ? "" : "s"}</DialogTitle>
          </DialogHeader>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Decision note (optional, applied to all)" rows={3} />
          <DialogFooter>
            <Button onClick={() => bulkDecide.mutate()} disabled={bulkDecide.isPending}>
              Confirm {bulkDecision}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
