import { useRef, useState } from "react";
import { Link2, Upload, X, ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface MediaInputProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  bucket?: string;
  pathPrefix?: string;
  accept?: string;
  maxSizeMB?: number;
  placeholder?: string;
  className?: string;
}

export function MediaInput({
  value,
  onChange,
  bucket = "branding",
  pathPrefix = "",
  accept = "image/*",
  maxSizeMB = 5,
  placeholder = "https://… or upload",
  className,
}: MediaInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File exceeds ${maxSizeMB}MB`);
      return;
    }
    setUploading(true);
    setProgress(8);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${pathPrefix}${pathPrefix ? "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      // simulate progress while supabase-js doesn't expose progress in v2
      const t = setInterval(() => setProgress((p) => Math.min(p + 12, 88)), 200);
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      clearInterval(t);
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setProgress(100);
      onChange(data.publicUrl);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setTimeout(() => { setUploading(false); setProgress(0); }, 600);
    }
  };

  const isImage = value && /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(value);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder={placeholder}
            className="pl-9 pr-8"
          />
          {value ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          <span className="ml-1.5 hidden sm:inline">{uploading ? "Uploading…" : "Upload"}</span>
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {uploading && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-primary to-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {value && !uploading && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-2.5">
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md border bg-background">
            {isImage ? (
              <img src={value} alt="Preview" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs text-success">
              <CheckCircle2 className="h-3 w-3" /> Attached
            </div>
            <p className="truncate text-xs text-muted-foreground" title={value}>{value}</p>
          </div>
        </div>
      )}
    </div>
  );
}
