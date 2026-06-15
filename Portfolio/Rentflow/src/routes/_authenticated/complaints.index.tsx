import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StaffShell } from "@/components/staff-shell";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { listComplaints } from "@/lib/complaints.functions";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/complaints/")({
  head: () => ({ meta: [{ title: "Complaints — Rentflow" }] }),
  component: ComplaintsPage,
});

function ComplaintsPage() {
  const fetch = useServerFn(listComplaints);
  const q = useQuery({ queryKey: ["complaints"], queryFn: () => fetch() });

  return (
    <StaffShell title="Complaints">
      {q.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : q.isError ? (
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      ) : q.data && q.data.length > 0 ? (
        <div className="space-y-2">
          {q.data.map((c) => {
            const tenancy = c.tenancies as { properties?: { title?: string }; profiles?: { full_name?: string } } | null;
            return (
              <Card key={c.id}>
                <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link to="/complaints/$id" params={{ id: c.id }} className="font-medium hover:underline">
                      {c.subject}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {tenancy?.profiles?.full_name} · {tenancy?.properties?.title} · {formatDate(c.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={c.severity} />
                    <StatusBadge status={c.status} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No complaints filed.</p>
      )}
    </StaffShell>
  );
}
