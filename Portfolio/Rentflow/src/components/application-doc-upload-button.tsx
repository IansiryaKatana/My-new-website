import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addApplicationDocument } from "@/lib/applications.functions";
import { supabase } from "@/integrations/supabase/client";
import { type ApplicationDocType, formatDocType } from "@/lib/application-docs";

export function ApplicationDocUploadButton({
  applicationId,
  tenantUserId,
  docType,
  variant = "outline",
  size = "sm",
  label,
  className,
  onSuccess,
  invalidateKeys = [],
}: {
  applicationId: string;
  tenantUserId: string;
  docType: ApplicationDocType;
  variant?: "outline" | "default" | "ghost";
  size?: "sm" | "default";
  label?: string;
  className?: string;
  onSuccess?: () => void;
  invalidateKeys?: string[][];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();
  const recordDoc = useServerFn(addApplicationDocument);
  const [error, setError] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: async (file: File) => {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${tenantUserId}/${applicationId}/${Date.now()}_${safeName}`;
      const { error: upErr } = await supabase.storage.from("tenant-docs").upload(path, file, {
        upsert: false,
        contentType: file.type || undefined,
      });
      if (upErr) throw upErr;
      await recordDoc({
        data: {
          application_id: applicationId,
          doc_type: docType,
          file_path: path,
          file_name: file.name,
        },
      });
    },
    onSuccess: () => {
      setError(null);
      invalidateKeys.forEach((key) => qc.invalidateQueries({ queryKey: key }));
      qc.invalidateQueries({ queryKey: ["applications"] });
      onSuccess?.();
      if (inputRef.current) inputRef.current.value = "";
    },
    onError: (e) => setError(e instanceof Error ? e.message : "Upload failed"),
  });

  return (
    <div className="mt-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) mut.mutate(file);
        }}
      />
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className ?? "w-full"}
        disabled={mut.isPending}
        onClick={() => inputRef.current?.click()}
      >
        {mut.isPending ? (
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        ) : (
          <Upload className="mr-2 h-3.5 w-3.5" />
        )}
        {mut.isPending ? "Uploading…" : (label ?? `Upload ${formatDocType(docType)}`)}
      </Button>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
