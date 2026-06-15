import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StaffShell } from "@/components/staff-shell";
import { PageBack } from "@/components/page-back";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getComplaint, updateComplaint } from "@/lib/complaints.functions";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/complaints/$id")({
  head: () => ({ meta: [{ title: "Complaint — Rentflow" }] }),
  component: ComplaintDetailPage,
});

const statuses = ["open", "in_progress", "awaiting_tenant", "resolved", "closed"] as const;

function ComplaintDetailPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const fetch = useServerFn(getComplaint);
  const update = useServerFn(updateComplaint);
  const q = useQuery({ queryKey: ["complaint", id], queryFn: () => fetch({ data: { id } }) });

  const mut = useMutation({
    mutationFn: (status: string) => update({ data: { id, status: status as (typeof statuses)[number] } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["complaint", id] }),
  });

  const tenancy = q.data?.tenancies as { properties?: { title?: string }; profiles?: { full_name?: string; email?: string } } | null;

  return (
    <StaffShell title="Complaint">
      <PageBack to="/complaints" label="Back to complaints" />
      {q.isLoading ? <Skeleton className="h-64 w-full" /> : q.isError ? (
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      ) : q.data ? (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <CardTitle className="text-lg">{q.data.subject}</CardTitle>
              <StatusBadge status={q.data.severity} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>{q.data.description ?? "No description."}</p>
            <p className="text-muted-foreground">
              {tenancy?.profiles?.full_name} · {tenancy?.properties?.title} · {formatDate(q.data.created_at)}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <StatusBadge status={q.data.status} />
              <Select value={q.data.status} onValueChange={(v) => mut.mutate(v)}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </StaffShell>
  );
}
