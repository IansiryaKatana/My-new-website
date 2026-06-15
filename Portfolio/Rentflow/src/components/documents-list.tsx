import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FileCheck2, FileText, FileX2 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { verifyDocument } from "@/lib/applications.functions";
import { formatDate } from "@/lib/format";

export type DocumentRow = {
  id: string;
  doc_type: string;
  file_path: string;
  file_name: string | null;
  verified: boolean;
  created_at: string;
};

export function DocumentsList({
  documents,
  applicationId,
  allowVerify = false,
  invalidateKey,
}: {
  documents: DocumentRow[];
  applicationId?: string;
  allowVerify?: boolean;
  invalidateKey?: string[];
}) {
  if (documents.length === 0) {
    return <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {documents.map((doc) => (
        <DocumentItem
          key={doc.id}
          doc={doc}
          applicationId={applicationId}
          allowVerify={allowVerify}
          invalidateKey={invalidateKey}
        />
      ))}
    </ul>
  );
}

function DocumentItem({
  doc,
  applicationId,
  allowVerify,
  invalidateKey,
}: {
  doc: DocumentRow;
  applicationId?: string;
  allowVerify: boolean;
  invalidateKey?: string[];
}) {
  const qc = useQueryClient();
  const verify = useServerFn(verifyDocument);
  const mut = useMutation({
    mutationFn: (verified: boolean) => verify({ data: { id: doc.id, verified } }),
    onSuccess: () => {
      if (invalidateKey) qc.invalidateQueries({ queryKey: invalidateKey });
      if (applicationId) qc.invalidateQueries({ queryKey: ["application", applicationId] });
      qc.invalidateQueries({ queryKey: ["person360"] });
      qc.invalidateQueries({ queryKey: ["tenancyJourney"] });
    },
  });

  async function openSigned() {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.storage.from("tenant-docs").createSignedUrl(doc.file_path, 300);
    if (!error && data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  return (
    <li className="flex items-center gap-3 py-3">
      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <button type="button" onClick={openSigned} className="truncate text-sm text-foreground hover:underline">
          {doc.file_name ?? doc.file_path.split("/").pop()}
        </button>
        <div className="text-xs capitalize text-muted-foreground">
          {doc.doc_type.replace(/_/g, " ")} · {formatDate(doc.created_at)}
        </div>
      </div>
      {doc.verified ? (
        <StatusBadge status="verified" className="gap-1 shrink-0">
          <FileCheck2 className="h-3 w-3" /> Verified
        </StatusBadge>
      ) : (
        <StatusBadge status="pending" className="shrink-0" />
      )}
      {allowVerify && (
        <Button size="sm" variant="ghost" onClick={() => mut.mutate(!doc.verified)} disabled={mut.isPending}>
          {doc.verified ? <FileX2 className="h-3.5 w-3.5" /> : <FileCheck2 className="h-3.5 w-3.5" />}
        </Button>
      )}
    </li>
  );
}
