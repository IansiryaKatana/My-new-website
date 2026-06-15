import { useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, FileCheck2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DocumentPreviewDialog, type DocumentPreviewItem } from "@/components/app/DocumentPreviewDialog";
import { DatePicker } from "@/components/ui/date-picker";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["passport", "visa", "emirates_id", "labor_card", "medical", "insurance", "contract", "certificate", "other"] as const;

type DocRow = DocumentPreviewItem & { created_at: string };

type WorkerDocumentsPanelProps = {
  workerId: string;
  workerName: string;
};

export function WorkerDocumentsPanel({ workerId, workerName }: WorkerDocumentsPanelProps) {
  const qc = useQueryClient();
  const [preview, setPreview] = useState<DocRow | null>(null);
  const [form, setForm] = useState<{ category?: string; title?: string; expiry_date?: string; file?: File }>({});

  const { data: docs, isLoading } = useQuery({
    queryKey: ["worker-documents", workerId],
    enabled: !!workerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("id, worker_id, category, title, file_path, file_name, mime_type, expiry_date, created_at")
        .eq("worker_id", workerId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DocRow[];
    },
  });

  const upload = useMutation({
    mutationFn: async () => {
      if (!form.file || !form.category) throw new Error("Category and file are required");
      const ext = form.file.name.split(".").pop();
      const path = `${workerId}/${form.category}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("documents").upload(path, form.file, { upsert: false });
      if (upErr) throw upErr;
      const { error } = await supabase.from("documents").insert({
        worker_id: workerId,
        category: form.category as never,
        title: form.title ?? null,
        expiry_date: form.expiry_date || null,
        file_path: path,
        file_name: form.file.name,
        mime_type: form.file.type,
        size_bytes: form.file.size,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Document uploaded");
      setForm({});
      qc.invalidateQueries({ queryKey: ["worker-documents", workerId] });
      qc.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (d: DocRow) => {
      await supabase.storage.from("documents").remove([d.file_path]);
      const { error } = await supabase.from("documents").delete().eq("id", d.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Document removed");
      qc.invalidateQueries({ queryKey: ["worker-documents", workerId] });
      qc.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack pt-2">
      <Card className="border-border/60 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium">
          <Upload className="h-4 w-4 text-primary" />
          Upload document
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            upload.mutate();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category *">
              <Select value={form.category ?? ""} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Title">
              <Input
                value={form.title ?? ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Passport copy 2026"
              />
            </Field>
            <Field label="Expiry date">
              <DatePicker value={form.expiry_date} onChange={(v) => setForm({ ...form, expiry_date: v ?? "" })} />
            </Field>
            <Field label="File *">
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                onChange={(e) => setForm({ ...form, file: e.target.files?.[0] })}
              />
            </Field>
          </div>
          <Button type="submit" disabled={upload.isPending} className="bg-primary hover:bg-primary/90">
            {upload.isPending ? "Uploading…" : "Upload to worker file"}
          </Button>
        </form>
      </Card>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !docs?.length ? (
        <EmptyState
          icon={FileCheck2}
          title="No documents yet"
          description="Upload passport, visa, Emirates ID, labor card, medical, and other compliance files for this worker."
        />
      ) : (
        <ul className="space-y-2">
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card p-3 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => setPreview({ ...d, worker_name: workerName })}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium capitalize">{d.category.replace(/_/g, " ")}</span>
                  {d.expiry_date ? <Badge variant="outline">Exp. {d.expiry_date}</Badge> : null}
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{d.title ?? d.file_name}</p>
              </button>
              <div className="flex shrink-0 gap-1">
                <Button type="button" size="sm" variant="outline" onClick={() => setPreview({ ...d, worker_name: workerName })}>
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  Preview
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => remove.mutate(d)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <DocumentPreviewDialog doc={preview} open={!!preview} onOpenChange={(o) => !o && setPreview(null)} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
