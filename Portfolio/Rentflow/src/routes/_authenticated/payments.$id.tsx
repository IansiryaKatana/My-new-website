import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download } from "lucide-react";
import { StaffShell } from "@/components/staff-shell";
import { PageBack } from "@/components/page-back";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUploadField } from "@/components/file-upload-field";
import { getPayment, updatePayment } from "@/lib/payments.functions";
import { downloadPaymentReceiptPdf } from "@/lib/communications.functions";
import { downloadBase64File } from "@/lib/download";
import { formatAed, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/payments/$id")({
  head: () => ({ meta: [{ title: "Payment — Rentflow" }] }),
  component: PaymentDetailPage,
});

const statuses = ["scheduled", "pending", "cleared", "paid", "bounced", "refunded", "cancelled"] as const;

function PaymentDetailPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const fetch = useServerFn(getPayment);
  const update = useServerFn(updatePayment);
  const dlReceipt = useServerFn(downloadPaymentReceiptPdf);
  const q = useQuery({ queryKey: ["payment", id], queryFn: () => fetch({ data: { id } }) });

  const mut = useMutation({
    mutationFn: (patch: Parameters<typeof update>[0]["data"]) => update({ data: patch }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payment", id] }),
  });

  const receiptMut = useMutation({
    mutationFn: () => dlReceipt({ data: { payment_id: id } }),
    onSuccess: (r) => downloadBase64File(r.filename, r.content_base64, r.content_type),
  });

  const tenancy = q.data?.tenancies as {
    properties?: { title?: string; community?: string };
    profiles?: { full_name?: string; email?: string; phone?: string };
  } | null;

  return (
    <StaffShell title="Payment">
      <PageBack to="/payments" label="Back to payments" />

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
                  <CardTitle className="text-lg">{formatAed(Number(q.data.amount))}</CardTitle>
                  <Badge>{q.data.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
                <Field label="Due date" value={formatDate(q.data.due_date)} />
                <Field label="Type" value={q.data.payment_type} />
                <Field label="Method" value={q.data.method ?? "—"} />
                <Field label="Reference" value={q.data.reference ?? "—"} />
                <Field label="Cheque no." value={q.data.cheque_no ?? "—"} />
                <Field label="Bank" value={q.data.bank_name ?? "—"} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Proof & status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FileUploadField
                  label="Payment proof"
                  bucket="tenant-docs"
                  pathPrefix={`proofs/${id}`}
                  value={q.data.proof_url ?? ""}
                  onChange={(url) => mut.mutate({ id, proof_url: url })}
                  accept="image/*,.pdf"
                  publicBucket={false}
                  hint="Upload cheque photo or bank transfer receipt"
                />
                {q.data.proof_url && (
                  <Button size="sm" variant="outline" onClick={async () => {
                    const { supabase } = await import("@/integrations/supabase/client");
                    const { data } = await supabase.storage.from("tenant-docs").createSignedUrl(q.data.proof_url!, 300);
                    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                  }}>
                    View proof
                  </Button>
                )}
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select
                    value={q.data.status}
                    onValueChange={(v) =>
                      mut.mutate({
                        id,
                        status: v,
                        paid_at: v === "cleared" || v === "paid" ? new Date().toISOString() : null,
                      })
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Cheque number</Label>
                    <Input
                      defaultValue={q.data.cheque_no ?? ""}
                      onBlur={(e) => mut.mutate({ id, cheque_no: e.target.value || null })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Bank name</Label>
                    <Input
                      defaultValue={q.data.bank_name ?? ""}
                      onBlur={(e) => mut.mutate({ id, bank_name: e.target.value || null })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Tenant</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <p className="font-medium">{tenancy?.profiles?.full_name}</p>
                <p className="text-muted-foreground">{tenancy?.profiles?.email}</p>
                <p className="mt-3">{tenancy?.properties?.title}</p>
              </CardContent>
            </Card>
            <Button variant="outline" className="w-full" onClick={() => receiptMut.mutate()} disabled={receiptMut.isPending}>
              <Download className="mr-2 h-4 w-4" /> Download receipt PDF
            </Button>
          </aside>
        </div>
      ) : null}
    </StaffShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="capitalize text-foreground">{value}</div>
    </div>
  );
}
