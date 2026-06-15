import { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { personInitials } from "@/lib/person";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type WorkerAvatarFieldProps = {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  fullName?: string | null;
  workerId?: string | null;
  disabled?: boolean;
};

export function WorkerAvatarField({ value, onChange, fullName, workerId, disabled }: WorkerAvatarFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be under 3MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const prefix = workerId ? `worker-avatars/${workerId}` : "worker-avatars/pending";
      const path = `${prefix}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("branding").upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("branding").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Photo updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const initials = personInitials(fullName);

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-border shadow-sm">
          {value ? <AvatarImage src={value} alt={fullName ?? "Worker"} className="object-cover" /> : null}
          <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">{initials}</AvatarFallback>
        </Avatar>
        {!disabled ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={cn(
              "absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90",
              uploading && "opacity-70",
            )}
            aria-label="Upload photo"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          </button>
        ) : null}
      </div>
      <div className="flex-1 space-y-2 text-center sm:text-left">
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Profile photo</Label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Helps your team recognise workers in lists, placements, and documents.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          {!disabled ? (
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? "Uploading…" : value ? "Change photo" : "Upload photo"}
            </Button>
          ) : null}
          {value && !disabled ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
              <X className="mr-1 h-3.5 w-3.5" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function WorkerAvatar({ name, url, className }: { name: string; url?: string | null; className?: string }) {
  return (
    <Avatar className={cn("h-9 w-9 border border-border/60", className)}>
      {url ? <AvatarImage src={url} alt={name} className="object-cover" /> : null}
      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{personInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
