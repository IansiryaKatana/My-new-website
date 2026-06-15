import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2 } from "lucide-react";
import { StaffShell } from "@/components/staff-shell";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSheet } from "@/components/ui/form-sheet";
import { BulkActionBar } from "@/components/bulk-action-bar";
import { useBulkSelect } from "@/hooks/use-bulk-select";
import { listViewings, updateViewing } from "@/lib/viewings.functions";
import { listStaffAgents } from "@/lib/team.functions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/viewings")({
  head: () => ({ meta: [{ title: "Viewings — Rentflow" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : undefined }),
  component: ViewingsPage,
});

function ViewingsPage() {
  const { id: openId } = Route.useSearch();
  const fetch = useServerFn(listViewings);
  const q = useQuery({ queryKey: ["viewings"], queryFn: () => fetch() });
  const [filter, setFilter] = useState("");
  const [sheetId, setSheetId] = useState<string | null>(openId ?? null);

  const rows = (q.data ?? []).filter((v) => {
    if (!filter.trim()) return true;
    const hay = `${v.properties?.title ?? ""} ${v.profiles?.full_name ?? ""} ${v.status}`.toLowerCase();
    return hay.includes(filter.toLowerCase());
  });

  const bulk = useBulkSelect(rows);

  return (
    <StaffShell title="Viewings">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input placeholder="Search property or tenant…" value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-sm" />
        <p className="text-sm text-muted-foreground">{rows.length} viewing requests</p>
      </div>

      <BulkActionBar count={bulk.selectedIds.length} onClear={bulk.clear}>
        <Button size="sm" variant="outline" disabled>
          Bulk confirm (coming soon)
        </Button>
      </BulkActionBar>

      {q.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : q.isError ? (
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-sm text-muted-foreground">No viewing requests yet.</CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {rows.map((v) => {
            const prop = v.properties as { title?: string; community?: string } | null;
            const tenant = v.profiles as { full_name?: string; phone?: string } | null;
            return (
              <Card key={v.id} className="overflow-hidden">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3 sm:flex-1">
                    <Checkbox checked={bulk.selected.has(v.id)} onCheckedChange={() => bulk.toggle(v.id)} className="mt-1" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{prop?.title ?? "Property"}</span>
                        <StatusBadge status={v.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tenant?.full_name ?? "Tenant"} · {prop?.community}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested {formatDate(v.requested_at)}
                        {v.scheduled_at ? ` · Scheduled ${formatDate(v.scheduled_at)}` : ""}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setSheetId(v.id)}>
                    Manage
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {sheetId && <ViewingSheet id={sheetId} onClose={() => setSheetId(null)} />}
    </StaffShell>
  );
}

function ViewingSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const qc = useQueryClient();
  const fetch = useServerFn(listViewings);
  const fetchAgents = useServerFn(listStaffAgents);
  const update = useServerFn(updateViewing);
  const q = useQuery({ queryKey: ["viewings"], queryFn: () => fetch() });
  const agentsQ = useQuery({ queryKey: ["staffAgents"], queryFn: () => fetchAgents() });
  const viewing = q.data?.find((v) => v.id === id);

  const [scheduledAt, setScheduledAt] = useState("");
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("");
  const [agentId, setAgentId] = useState<string>("");

  const mut = useMutation({
    mutationFn: (patch: { status?: string; scheduled_at?: string | null; feedback?: string | null }) =>
      update({ data: { id, ...patch } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["viewings"] });
      qc.invalidateQueries({ queryKey: ["action-queue"] });
    },
  });

  if (!viewing) return null;

  const prop = viewing.properties as { title?: string; community?: string } | null;
  const tenant = viewing.profiles as { full_name?: string; phone?: string } | null;

  return (
    <FormSheet
      open
      onOpenChange={(o) => !o && onClose()}
      title="Viewing request"
      description={`${prop?.title ?? ""} · ${tenant?.full_name ?? ""}`}
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
          <p><strong>Status:</strong> {viewing.status}</p>
          <p><strong>Requested:</strong> {formatDate(viewing.requested_at)}</p>
          {viewing.notes && <p className="mt-2 text-muted-foreground">{viewing.notes}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Assigned agent</Label>
          <Select
            value={agentId || viewing.agent_id || ""}
            onValueChange={(v) => {
              setAgentId(v);
              mut.mutate({ agent_id: v || null });
            }}
          >
            <SelectTrigger><SelectValue placeholder="Select agent" /></SelectTrigger>
            <SelectContent>
              {(agentsQ.data ?? []).map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.full_name ?? a.email ?? a.id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Scheduled date & time</Label>
          <Input
            type="datetime-local"
            value={scheduledAt || (viewing.scheduled_at ? viewing.scheduled_at.slice(0, 16) : "")}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Staff notes</Label>
          <Textarea rows={2} value={notes || viewing.notes || ""} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label>Feedback after viewing</Label>
          <Textarea rows={2} value={feedback || viewing.feedback || ""} onChange={(e) => setFeedback(e.target.value)} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() =>
              mut.mutate({
                status: "confirmed",
                scheduled_at: scheduledAt || viewing.scheduled_at,
              })
            }
            disabled={mut.isPending}
          >
            <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Confirm
          </Button>
          <Button size="sm" variant="outline" onClick={() => mut.mutate({ status: "completed", feedback: feedback || null })} disabled={mut.isPending}>
            Mark completed
          </Button>
          <Button size="sm" variant="ghost" onClick={() => mut.mutate({ status: "cancelled" })} disabled={mut.isPending}>
            Cancel
          </Button>
        </div>

        {prop && (
          <Button variant="link" className="h-auto p-0" asChild>
            <Link to={`/properties/${viewing.property_id}`}>View property</Link>
          </Button>
        )}
      </div>
    </FormSheet>
  );
}
