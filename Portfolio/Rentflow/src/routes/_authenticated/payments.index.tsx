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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { StaffShell } from "@/components/staff-shell";
import { Download } from "lucide-react";
import { listPayments, updatePayment } from "@/lib/payments.functions";
import { downloadPaymentReceiptPdf } from "@/lib/communications.functions";
import { downloadBase64File } from "@/lib/download";
import { formatAed, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/payments/")({
  head: () => ({ meta: [{ title: "Payments — Rental OS" }] }),
  component: PaymentsPage,
});

const statuses = ["scheduled", "pending", "cleared", "paid", "bounced", "refunded", "cancelled"] as const;

function PaymentsPage() {
  const fetch = useServerFn(listPayments);
  const q = useQuery({ queryKey: ["payments"], queryFn: () => fetch({ data: undefined }) });

  return (
    <StaffShell title="Payments">
      <Card>
        <CardContent className="p-0">
          {q.isLoading ? (
            <div className="space-y-2 p-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : q.isError ? (
            <p className="p-6 text-sm text-destructive">{(q.error as Error).message}</p>
          ) : q.data && q.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Due</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {q.data.map((p) => (
                  <PaymentRow key={p.id} row={p} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-12 text-center text-sm text-muted-foreground">
              No payments scheduled yet.
            </p>
          )}
        </CardContent>
      </Card>
    </StaffShell>
  );
}

function PaymentRow({
  row,
}: {
  row: NonNullable<Awaited<ReturnType<typeof listPayments>>>[number];
}) {
  const qc = useQueryClient();
  const update = useServerFn(updatePayment);
  const dlReceipt = useServerFn(downloadPaymentReceiptPdf);
  const receiptMut = useMutation({
    mutationFn: () => dlReceipt({ data: { payment_id: row.id } }),
    onSuccess: (result) => downloadBase64File(result.filename, result.content_base64, result.content_type),
  });
  const mut = useMutation({
    mutationFn: (status: string) =>
      update({
        data: {
          id: row.id,
          status,
          paid_at: status === "cleared" || status === "paid" ? new Date().toISOString() : null,
        },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payments"] }),
  });

  const overdue = new Date(row.due_date) < new Date() && (row.status === "scheduled" || row.status === "pending");
  const tenancies = row.tenancies as { properties?: { title?: string }; profiles?: { full_name?: string } } | null;

  return (
    <TableRow>
      <TableCell className={overdue ? "text-destructive" : ""}>
        <Link to="/payments/$id" params={{ id: row.id }} className="hover:underline">
          {formatDate(row.due_date)}
        </Link>
      </TableCell>
      <TableCell>{tenancies?.properties?.title ?? "—"}</TableCell>
      <TableCell>{tenancies?.profiles?.full_name ?? "—"}</TableCell>
      <TableCell className="capitalize">{row.payment_type}</TableCell>
      <TableCell className="text-right font-medium">{formatAed(Number(row.amount))}</TableCell>
      <TableCell>
        <StatusBadge status={row.status} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            title="Download receipt PDF"
            onClick={() => receiptMut.mutate()}
            disabled={receiptMut.isPending}
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Select value={row.status} onValueChange={(v) => mut.mutate(v)}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TableCell>
    </TableRow>
  );
}

