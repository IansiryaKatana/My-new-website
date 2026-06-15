import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Mail, Phone } from "lucide-react";
import { FormSheet } from "@/components/ui/form-sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAvatar } from "@/components/user-avatar";
import { MissingDocsMatrix } from "@/components/missing-docs-matrix";
import { DocumentsList } from "@/components/documents-list";
import { ApplicationDocUploadButton } from "@/components/application-doc-upload-button";
import { getApplication } from "@/lib/applications.functions";
import { APPLICATION_DOC_TYPES, type ApplicationDocType } from "@/lib/application-docs";
import { formatAed, formatDate } from "@/lib/format";

export function ApplicationPreviewSheet({
  applicationId,
  onClose,
}: {
  applicationId: string;
  onClose: () => void;
}) {
  const fetch = useServerFn(getApplication);
  const q = useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => fetch({ data: { id: applicationId } }),
  });
  const [extraDocType, setExtraDocType] = useState<ApplicationDocType>("visa");

  const app = q.data;
  const tenant = app
    ? (app as { profiles: { id?: string; full_name: string | null; email: string | null; phone: string | null; emirates_id: string | null; avatar_url?: string | null } | null }).profiles
    : null;
  const property = app
    ? (app as { properties: { title: string; community: string } | null }).properties
    : null;
  const tenantUserId = (app as { tenant_id?: string } | undefined)?.tenant_id ?? tenant?.id;
  const docs = app
    ? (app as { documents: Array<{ id: string; doc_type: string; file_path: string; file_name: string | null; verified: boolean; created_at: string }> }).documents
    : [];
  const invalidateKeys = [["application", applicationId]];

  return (
    <FormSheet
      open
      onOpenChange={(open) => !open && onClose()}
      title="Application preview"
      description={property ? `${property.title} · ${property.community}` : undefined}
      footer={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button asChild>
            <Link to="/applications/$id" params={{ id: applicationId }}>
              <ExternalLink className="mr-2 h-4 w-4" /> Open full review
            </Link>
          </Button>
        </div>
      }
    >
      {q.isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : q.isError ? (
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      ) : app ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <UserAvatar
              name={tenant?.full_name}
              email={tenant?.email}
              src={tenant?.avatar_url}
              className="h-12 w-12"
            />
            <div className="min-w-0 flex-1">
              {tenant?.id ? (
                <Link to="/people/$id" params={{ id: tenant.id }} className="font-medium text-foreground hover:underline">
                  {tenant.full_name ?? "Tenant"}
                </Link>
              ) : (
                <div className="font-medium text-foreground">{tenant?.full_name ?? "Tenant"}</div>
              )}
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                {tenant?.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{tenant.email}</span>}
                {tenant?.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{tenant.phone}</span>}
              </div>
              <StatusBadge status={app.status} className="mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><div className="text-xs text-muted-foreground">Offer</div><div>{formatAed(Number(app.offer_amount))}</div></div>
            <div><div className="text-xs text-muted-foreground">Cheques</div><div>{app.cheques_offered}</div></div>
            <div><div className="text-xs text-muted-foreground">Submitted</div><div>{formatDate(app.created_at)}</div></div>
            <div><div className="text-xs text-muted-foreground">Move-in</div><div>{app.move_in_date ? formatDate(app.move_in_date) : "—"}</div></div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Required documents</p>
            <MissingDocsMatrix
              documents={docs}
              applicationId={applicationId}
              tenantUserId={tenantUserId}
              allowUpload
              invalidateKeys={invalidateKeys}
            />
            <DocumentsList documents={docs} applicationId={applicationId} allowVerify invalidateKey={["application", applicationId]} />

            {tenantUserId && (
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
                <p className="mb-2 text-sm font-medium">Attach another document</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <div className="flex-1 space-y-1.5">
                    <Label>Document type</Label>
                    <Select value={extraDocType} onValueChange={(v) => setExtraDocType(v as ApplicationDocType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {APPLICATION_DOC_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <ApplicationDocUploadButton
                    applicationId={applicationId}
                    tenantUserId={tenantUserId}
                    docType={extraDocType}
                    label="Upload file"
                    className="w-full sm:w-auto"
                    invalidateKeys={invalidateKeys}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </FormSheet>
  );
}
