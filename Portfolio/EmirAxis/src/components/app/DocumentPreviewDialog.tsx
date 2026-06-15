import { useEffect, useState } from "react";
import { Download, ExternalLink, FileText, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export type DocumentPreviewItem = {
  id: string;
  worker_id?: string;
  category: string;
  title?: string | null;
  file_path: string;
  file_name?: string | null;
  mime_type?: string | null;
  expiry_date?: string | null;
  created_at?: string;
  worker_name?: string | null;
};

type DocumentPreviewDialogProps = {
  doc: DocumentPreviewItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bucket?: string;
};

function isImage(mime?: string | null, name?: string | null) {
  if (mime?.startsWith("image/")) return true;
  return !!name && /\.(png|jpe?g|gif|webp|svg|bmp)(\?|$)/i.test(name);
}

function isPdf(mime?: string | null, name?: string | null) {
  if (mime === "application/pdf") return true;
  return !!name && /\.pdf(\?|$)/i.test(name);
}

export function DocumentPreviewDialog({ doc, open, onOpenChange, bucket = "documents" }: DocumentPreviewDialogProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !doc) {
      setUrl(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void (async () => {
      const { data, error: signErr } = await supabase.storage.from(bucket).createSignedUrl(doc.file_path, 3600);
      if (cancelled) return;
      if (signErr) {
        const msg = signErr.message.toLowerCase().includes("not found") || signErr.message.includes("400")
          ? "This file is not in storage yet. Re-upload the document or run the database seed to attach placeholder files."
          : signErr.message;
        setError(msg);
        setUrl(null);
      } else {
        setUrl(data.signedUrl);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, doc?.id, doc?.file_path, bucket]);

  const image = doc ? isImage(doc.mime_type, doc.file_name) : false;
  const pdf = doc ? isPdf(doc.mime_type, doc.file_name) : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92dvh,900px)] w-[calc(100%-1rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:w-full sm:max-w-4xl">
        <DialogHeader className="space-y-2 border-b px-4 py-4 pr-12 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {doc?.category.replace(/_/g, " ") ?? "Document"}
            </Badge>
            {doc?.expiry_date ? (
              <Badge variant="outline">Expires {format(new Date(doc.expiry_date), "dd MMM yyyy")}</Badge>
            ) : null}
          </div>
          <DialogTitle className="text-left">{doc?.title ?? doc?.file_name ?? "Document preview"}</DialogTitle>
          <DialogDescription className="text-left">
            {doc?.worker_name ? `${doc.worker_name} · ` : ""}
            {doc?.file_name ?? doc?.file_path}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[240px] flex-1 overflow-auto bg-muted/30 p-4 sm:p-6">
          {loading ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-sm">Loading preview…</span>
            </div>
          ) : error ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : url && image ? (
            <div className="flex justify-center">
              <img
                src={url}
                alt={doc?.title ?? "Document"}
                className="max-h-[min(60vh,560px)] w-auto max-w-full rounded-lg border bg-background object-contain shadow-sm"
              />
            </div>
          ) : url && pdf ? (
            <iframe
              title={doc?.file_name ?? "PDF preview"}
              src={url}
              className="h-[min(60vh,560px)] w-full rounded-lg border bg-background shadow-sm"
            />
          ) : url ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Preview not available for this file type.</p>
              <Button variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 h-4 w-4" />
                  Open in new tab
                </a>
              </Button>
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex-row gap-2 border-t px-4 py-3 sm:justify-end sm:px-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-1.5 h-4 w-4" />
            Close
          </Button>
          {url ? (
            <Button type="button" asChild className="bg-primary hover:bg-primary/90">
              <a href={url} download={doc?.file_name ?? undefined} target="_blank" rel="noopener noreferrer">
                <Download className="mr-1.5 h-4 w-4" />
                Download
              </a>
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
