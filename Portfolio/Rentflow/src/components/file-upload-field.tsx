import { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type FileUploadFieldProps = {
  label: string;
  bucket: string;
  pathPrefix: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  hint?: string;
  publicBucket?: boolean;
};

export function FileUploadField({
  label,
  bucket,
  pathPrefix,
  value,
  onChange,
  accept = "image/*,.pdf",
  hint,
  publicBucket = true,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
      const path = `${pathPrefix}/${Date.now()}_${safeName || `file.${ext}`}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true,
        contentType: file.type || undefined,
      });
      if (uploadError) throw uploadError;

      if (publicBucket) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        onChange(data.publicUrl);
      } else {
        onChange(path);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Upload a file or paste URL"
          className="min-w-0 flex-1"
        />
        <div className="flex shrink-0 gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Upload className="mr-2 h-3.5 w-3.5" />}
            Upload
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onChange("")}>
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
