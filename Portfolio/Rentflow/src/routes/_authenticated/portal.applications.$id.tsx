import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, Upload } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageBack } from "@/components/page-back";
import { MissingDocsMatrix } from "@/components/missing-docs-matrix";
import { NotificationBell } from "@/components/notification-bell";
import { getTenantApplication, withdrawApplication } from "@/lib/applications.functions";
import { getTenantApplicationContractUrl, uploadTenantSignedContract } from "@/lib/communications.functions";
import { formatAed, formatDate } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/portal/applications/$id")({
  head: () => ({ meta: [{ title: "Application — Rentflow" }] }),
  component: PortalApplicationPage,
});

function PortalApplicationPage() {
  const { id } = Route.useParams();
  const fetch = useServerFn(getTenantApplication);
  const q = useQuery({ queryKey: ["tenant-application", id], queryFn: () => fetch({ data: { id } }) });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/portal"><BrandLogo size="md" /></Link>
          <NotificationBell />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-8">
        <PageBack to="/portal" label="Back to portal" />
        {q.isLoading ? <Skeleton className="h-64 w-full" /> : q.isError ? (
          <p className="text-sm text-destructive">{(q.error as Error).message}</p>
        ) : q.data ? <Body app={q.data} /> : null}
      </main>
    </div>
  );
}

function Body({ app }: { app: Awaited<ReturnType<typeof getTenantApplication>> }) {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const withdraw = useServerFn(withdrawApplication);
  const getContract = useServerFn(getTenantApplicationContractUrl);
  const recordSigned = useServerFn(uploadTenantSignedContract);
  const [uploading, setUploading] = useState(false);

  const property = app.properties as { title: string; community: string; rent_yearly: number } | null;
  const docs = (app as { documents: Array<{ doc_type: string; verified: boolean; file_name: string | null; file_path: string }> }).documents ?? [];

  const withdrawMut = useMutation({
    mutationFn: () => withdraw({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant-home"] }),
  });

  const contractMut = useMutation({
    mutationFn: () => getContract({ data: { application_id: id } }),
    onSuccess: (r) => { if (r.url) window.open(r.url, "_blank"); },
  });

  async function uploadSigned(file: File) {
    setUploading(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id;
      if (!uid) throw new Error("Not signed in");
      const path = `${uid}/contracts/${id}/${Date.now()}_signed.pdf`;
      const { error } = await supabase.storage.from("tenant-docs").upload(path, file, { contentType: file.type });
      if (error) throw error;
      await recordSigned({ data: { application_id: id, storage_path: path } });
      qc.invalidateQueries({ queryKey: ["tenant-application", id] });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="text-lg">{property?.title}</CardTitle>
            <Badge>{app.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">{property?.community}</p>
          <p>Offer: {formatAed(Number(app.offer_amount))} · {app.cheques_offered} cheques</p>
          <p>Submitted {formatDate(app.created_at)}</p>
          {app.rejection_reason && <p className="text-destructive">Reason: {app.rejection_reason}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Required documents</CardTitle></CardHeader>
        <CardContent><MissingDocsMatrix documents={docs} /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Contract</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => contractMut.mutate()} disabled={contractMut.isPending}>
            <Download className="mr-2 h-3.5 w-3.5" /> Download contract
          </Button>
          <label className="inline-flex">
            <Button size="sm" variant="outline" asChild disabled={uploading}>
              <span><Upload className="mr-2 h-3.5 w-3.5" /> Upload signed copy</span>
            </Button>
            <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadSigned(f); }} />
          </label>
        </CardContent>
      </Card>

      {["submitted", "docs_review"].includes(app.status) && (
        <Button variant="destructive" onClick={() => withdrawMut.mutate()} disabled={withdrawMut.isPending}>
          Withdraw application
        </Button>
      )}
    </div>
  );
}
