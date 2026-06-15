import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import { StaffShell } from "@/components/staff-shell";
import { PageBack } from "@/components/page-back";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { addPropertyImage, deletePropertyImage, getStaffProperty } from "@/lib/properties.functions";
import { FileUploadField } from "@/components/file-upload-field";
import { Button } from "@/components/ui/button";
import { formatAed, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/properties/$id")({
  head: () => ({ meta: [{ title: "Property — Rentflow" }] }),
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { id } = Route.useParams();
  const fetch = useServerFn(getStaffProperty);
  const q = useQuery({ queryKey: ["property", id], queryFn: () => fetch({ data: { id } }) });

  return (
    <StaffShell title="Property">
      <PageBack to="/properties" label="Back to properties" />

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
                  <CardTitle className="text-lg">{q.data.title}</CardTitle>
                  <Badge>{q.data.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {q.data.cover_image && (
                  <img src={q.data.cover_image} alt="" className="max-h-64 w-full rounded-lg object-cover" />
                )}
                <p className="text-sm text-muted-foreground">
                  {q.data.community}
                  {q.data.building ? ` · ${q.data.building}` : ""}
                  {q.data.unit_no ? ` · Unit ${q.data.unit_no}` : ""}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <Stat label="Rent" value={`${formatAed(Number(q.data.rent_yearly))}/yr`} />
                  <Stat label="Beds" value={String(q.data.beds)} />
                  <Stat label="Type" value={q.data.property_type} />
                  <Stat label="Views" value={String(q.data.view_count ?? 0)} />
                </div>
                {q.data.description && <p className="text-sm text-foreground">{q.data.description}</p>}
              </CardContent>
            </Card>

            <GalleryCard propertyId={id} images={q.data.images} />
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Applications</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {q.data.applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No applications.</p>
                ) : (
                  q.data.applications.map((a) => {
                    const tenant = a.profiles as { full_name?: string } | null;
                    return (
                      <Link key={a.id} to="/applications/$id" params={{ id: a.id }} className="block rounded-lg border border-border p-3 text-sm hover:bg-muted/40">
                        <div className="font-medium">{tenant?.full_name ?? "Tenant"}</div>
                        <div className="text-xs text-muted-foreground">{a.status} · {formatDate(a.created_at)}</div>
                      </Link>
                    );
                  })
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Viewings</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {q.data.viewings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No viewings.</p>
                ) : (
                  q.data.viewings.map((v) => {
                    const tenant = v.profiles as { full_name?: string } | null;
                    return (
                      <Link key={v.id} to="/viewings" search={{ id: v.id }} className="block rounded-lg border border-border p-3 text-sm hover:bg-muted/40">
                        <div className="font-medium">{tenant?.full_name ?? "Tenant"}</div>
                        <div className="text-xs text-muted-foreground">{v.status}</div>
                      </Link>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      ) : null}
    </StaffShell>
  );
}

function GalleryCard({ propertyId, images }: { propertyId: string; images: Array<{ id: string; url: string }> }) {
  const qc = useQueryClient();
  const addImg = useServerFn(addPropertyImage);
  const delImg = useServerFn(deletePropertyImage);
  const [url, setUrl] = useState("");

  const addMut = useMutation({
    mutationFn: (imageUrl: string) => addImg({ data: { property_id: propertyId, url: imageUrl, sort_order: images.length } }),
    onSuccess: () => {
      setUrl("");
      qc.invalidateQueries({ queryKey: ["property", propertyId] });
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => delImg({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["property", propertyId] }),
  });

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Gallery</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <FileUploadField
          label="Add image"
          bucket="property-images"
          pathPrefix={`gallery/${propertyId}`}
          value={url}
          onChange={(nextUrl) => {
            setUrl(nextUrl);
            if (nextUrl) addMut.mutate(nextUrl);
          }}
          accept="image/*"
        />
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {images.map((img) => (
              <div key={img.id} className="group relative">
                <img src={img.url} alt="" className="aspect-video rounded-lg object-cover" />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute right-1 top-1 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => delMut.mutate(img.id)}
                  disabled={delMut.isPending}
                  aria-label="Delete image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No gallery images yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium capitalize text-foreground">{value}</div>
    </div>
  );
}
