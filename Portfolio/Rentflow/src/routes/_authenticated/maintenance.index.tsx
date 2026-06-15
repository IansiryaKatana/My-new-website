import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffShell } from "@/components/staff-shell";
import { listTickets, updateTicket } from "@/lib/maintenance.functions";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/maintenance/")({
  head: () => ({ meta: [{ title: "Maintenance — Rental OS" }] }),
  component: MaintenancePage,
});

const ticketStatuses = ["open", "in_progress", "awaiting_tenant", "resolved", "closed"] as const;

function MaintenancePage() {
  const fetch = useServerFn(listTickets);
  const q = useQuery({ queryKey: ["tickets"], queryFn: () => fetch() });

  return (
    <StaffShell title="Maintenance">
      <Card>
        <CardContent className="p-0">
          {q.isLoading ? (
            <div className="space-y-2 p-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : q.isError ? (
            <p className="p-6 text-sm text-destructive">{(q.error as Error).message}</p>
          ) : q.data && q.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Created</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {q.data.map((t) => (
                  <TicketRow key={t.id} row={t} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-12 text-center text-sm text-muted-foreground">
              No open maintenance tickets.
            </p>
          )}
        </CardContent>
      </Card>
    </StaffShell>
  );
}

function TicketRow({
  row,
}: {
  row: NonNullable<Awaited<ReturnType<typeof listTickets>>>[number];
}) {
  const qc = useQueryClient();
  const update = useServerFn(updateTicket);
  const mut = useMutation({
    mutationFn: (status: string) => update({ data: { id: row.id, status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
  const t = row.tenancies as { properties?: { title?: string; community?: string } } | null;

  return (
    <TableRow>
      <TableCell>{formatDate(row.created_at)}</TableCell>
      <TableCell className="font-medium">
        <Link to="/maintenance/$id" params={{ id: row.id }} className="hover:underline">{row.subject}</Link>
      </TableCell>
      <TableCell>{t?.properties?.title ?? "—"}</TableCell>
      <TableCell>{row.category}</TableCell>
      <TableCell>
        <StatusBadge status={row.priority} />
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
          <StatusBadge status={row.status} className="w-fit" />
          <Select value={row.status} onValueChange={(v) => mut.mutate(v)}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ticketStatuses.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TableCell>
    </TableRow>
  );
}
