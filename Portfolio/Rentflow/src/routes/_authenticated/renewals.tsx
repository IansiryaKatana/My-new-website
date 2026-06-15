import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Repeat, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSheet } from "@/components/ui/form-sheet";
import { StaffShell } from "@/components/staff-shell";
import { confirmRenewal, listRenewals, listExpiringTenancies, offerRenewal } from "@/lib/renewals.functions";
import { formatAed, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/renewals")({
  head: () => ({ meta: [{ title: "Renewals — Rental OS" }] }),
  component: RenewalsPage,
});

function RenewalsPage() {
  const fetchExpiring = useServerFn(listExpiringTenancies);
  const fetchRenewals = useServerFn(listRenewals);
  const expiringQ = useQuery({ queryKey: ["expiring"], queryFn: () => fetchExpiring() });
  const renewalsQ = useQuery({ queryKey: ["renewals"], queryFn: () => fetchRenewals() });

  return (
    <StaffShell title="Renewals">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Repeat className="h-4 w-4" /> Expiring tenancies
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {expiringQ.isLoading ? (
              <div className="p-6"><Skeleton className="h-24 w-full" /></div>
            ) : expiringQ.data && expiringQ.data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>End date</TableHead>
                    <TableHead className="text-right">Current rent</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringQ.data.map((t) => {
                    const tenant = t.profiles as { full_name?: string | null } | null;
                    const prop = t.properties as { title?: string | null; community?: string | null } | null;
                    return (
                      <TableRow key={t.id}>
                        <TableCell>{tenant?.full_name ?? "—"}</TableCell>
                        <TableCell>
                          <div className="text-foreground">{prop?.title ?? "—"}</div>
                          <div className="text-xs text-muted-foreground">{prop?.community}</div>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(t.end_date)}</TableCell>
                        <TableCell className="text-right">{formatAed(Number(t.annual_rent))}</TableCell>
                        <TableCell className="text-right">
                          <OfferRenewalButton tenancyId={t.id} currentRent={Number(t.annual_rent)} cheques={t.cheques} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="p-6 text-sm text-muted-foreground">No active tenancies.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Renewal offers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {renewalsQ.isLoading ? (
              <div className="p-6"><Skeleton className="h-24 w-full" /></div>
            ) : renewalsQ.data && renewalsQ.data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Proposed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Offered</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renewalsQ.data.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.tenancies?.profiles?.full_name ?? "—"}</TableCell>
                      <TableCell>{r.tenancies?.properties?.title ?? "—"}</TableCell>
                      <TableCell className="text-right">{formatAed(Number(r.current_rent))}</TableCell>
                      <TableCell className="text-right">{formatAed(Number(r.proposed_rent))}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-xs">{r.offered_at ? formatDate(r.offered_at) : "—"}</TableCell>
                      <TableCell className="text-right">
                        {r.status === "accepted" && <ConfirmRenewalButton renewalId={r.id} />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="p-6 text-sm text-muted-foreground">No renewal offers yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </StaffShell>
  );
}

function ConfirmRenewalButton({ renewalId }: { renewalId: string }) {
  const qc = useQueryClient();
  const confirm = useServerFn(confirmRenewal);
  const mut = useMutation({
    mutationFn: () => confirm({ data: { id: renewalId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["renewals"] }),
  });
  return (
    <Button size="sm" onClick={() => mut.mutate()} disabled={mut.isPending}>
      {mut.isPending ? "Confirming…" : "Confirm renewal"}
    </Button>
  );
}

function OfferRenewalButton({ tenancyId, currentRent, cheques }: { tenancyId: string; currentRent: number; cheques: number }) {
  const qc = useQueryClient();
  const offer = useServerFn(offerRenewal);
  const [open, setOpen] = useState(false);
  const [proposed, setProposed] = useState(String(currentRent));
  const [proposedCheques, setProposedCheques] = useState(String(cheques));
  const [notes, setNotes] = useState("");

  const mut = useMutation({
    mutationFn: () => offer({ data: {
      tenancy_id: tenancyId,
      current_rent: currentRent,
      proposed_rent: Number(proposed),
      proposed_cheques: Number(proposedCheques),
      notes: notes || null,
    } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["renewals"] });
      setOpen(false);
    },
  });

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus className="mr-1 h-3.5 w-3.5" /> Offer renewal
      </Button>
      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="Offer renewal"
        footer={
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => mut.mutate()} disabled={mut.isPending || !proposed}>
              {mut.isPending ? "Sending…" : "Send offer"}
            </Button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Proposed rent (AED)</Label>
            <Input type="number" min={0} value={proposed} onChange={(e) => setProposed(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Cheques</Label>
            <Input type="number" min={1} max={12} value={proposedCheques} onChange={(e) => setProposedCheques(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes for tenant</Label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} />
          </div>
          {mut.isError && <p className="text-sm text-destructive sm:col-span-2">{(mut.error as Error).message}</p>}
        </div>
      </FormSheet>
    </>
  );
}
