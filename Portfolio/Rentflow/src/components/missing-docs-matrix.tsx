import { ApplicationDocUploadButton } from "@/components/application-doc-upload-button";
import { REQUIRED_APPLICATION_DOCS } from "@/lib/application-docs";

type Doc = { doc_type: string; verified: boolean; file_name: string | null };

export function MissingDocsMatrix({
  documents,
  applicationId,
  tenantUserId,
  allowUpload = false,
  invalidateKeys,
}: {
  documents: Doc[];
  applicationId?: string;
  tenantUserId?: string;
  allowUpload?: boolean;
  invalidateKeys?: string[][];
}) {
  const byType = new Map(documents.map((d) => [d.doc_type, d]));
  const canUpload = allowUpload && applicationId && tenantUserId;

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {REQUIRED_APPLICATION_DOCS.map((type) => {
        const doc = byType.get(type);
        const status = doc ? (doc.verified ? "verified" : "uploaded") : "missing";
        return (
          <div
            key={type}
            className={`rounded-lg border px-3 py-2 text-sm ${
              status === "missing" ? "border-destructive/40 bg-destructive/5" : "border-border"
            }`}
          >
            <div className="capitalize text-foreground">{type.replace(/_/g, " ")}</div>
            <div className="text-xs text-muted-foreground">
              {status === "missing" ? "Required — not uploaded" : status === "verified" ? "Verified" : "Pending review"}
            </div>
            {doc?.file_name && <div className="mt-1 truncate text-xs">{doc.file_name}</div>}
            {status === "missing" && canUpload && (
              <ApplicationDocUploadButton
                applicationId={applicationId}
                tenantUserId={tenantUserId}
                docType={type}
                label="Attach document"
                invalidateKeys={invalidateKeys}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
