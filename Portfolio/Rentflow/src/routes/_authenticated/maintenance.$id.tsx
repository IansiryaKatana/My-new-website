import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StaffShell } from "@/components/staff-shell";
import { PageBack } from "@/components/page-back";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { addMaintenanceUpdate, getTicket, updateTicket } from "@/lib/maintenance.functions";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/maintenance/$id")({
  head: () => ({ meta: [{ title: "Maintenance — Rentflow" }] }),
  component: MaintenanceDetailPage,
});

const statuses = ["open", "in_progress", "awaiting_tenant", "resolved", "closed"] as const;

function MaintenanceDetailPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const fetch = useServerFn(getTicket);
  const update = useServerFn(updateTicket);
  const q = useQuery({ queryKey: ["ticket", id], queryFn: () => fetch({ data: { id } }) });

  const addUpdate = useServerFn(addMaintenanceUpdate);
  const [note, setNote] = useState("");

  const mut = useMutation({
    mutationFn: (status: string) => update({ data: { id, status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ticket", id] }),
  });

  const noteMut = useMutation({
    mutationFn: () => addUpdate({ data: { ticket_id: id, note } }),
    onSuccess: () => {
      setNote("");
      qc.invalidateQueries({ queryKey: ["ticket", id] });
    },
  });

  const tenancy = q.data?.tenancies as {
    properties?: { title?: string; community?: string };
    profiles?: { full_name?: string; phone?: string };
  } | null;

  return (
    <StaffShell title="Maintenance ticket">
      <PageBack to="/maintenance" label="Back to maintenance" />

      {q.isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : q.isError ? (
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      ) : q.data ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-lg">{q.data.subject}</CardTitle>
                  <StatusBadge status={q.data.priority} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{q.data.description ?? "No description."}</p>
                <p>Category: <span className="text-foreground">{q.data.category}</span></p>
                <p>Created: {formatDate(q.data.created_at)}</p>
                <Select value={q.data.status} onValueChange={(v) => mut.mutate(v)}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Updates</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {(q.data.updates ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No thread updates yet.</p>
                ) : (
                  q.data.updates.map((u) => {
                    const author = u.profiles as { full_name?: string } | null;
                    return (
                      <div key={u.id} className="rounded-lg border border-border p-3 text-sm">
                        <div className="text-xs text-muted-foreground">{author?.full_name ?? "Staff"} · {formatDate(u.created_at)}</div>
                        <p className="mt-1 text-foreground">{u.note}</p>
                      </div>
                    );
                  })
                )}
                <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an update…" />
                <Button size="sm" onClick={() => noteMut.mutate()} disabled={noteMut.isPending || !note.trim()}>Post update</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Tenancy</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium text-foreground">{tenancy?.profiles?.full_name ?? "—"}</p>
              <p className="text-muted-foreground">{tenancy?.profiles?.phone}</p>
              <p className="mt-3 text-foreground">{tenancy?.properties?.title}</p>
              <p className="text-muted-foreground">{tenancy?.properties?.community}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </StaffShell>
  );
}
