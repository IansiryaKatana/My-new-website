import { useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

const DOC_TYPES = ["passport", "cv", "photo", "certificate", "visa", "other"] as const;

type DocRow = DocumentPreviewItem & { created_at: string; doc_type: string };

export function CandidateDocumentsPanel({ candidateId, candidateName }: { candidateId: string; candidateName: string }) {
  const qc = useQueryClient();
  const [preview, setPreview] = useState<DocRow | null>(null);
  const [form, setForm] = useState<{ doc_type?: string; file?: File; expiry_date?: string }>({});

  const { data: docs, isLoading } = useQuery({
    queryKey: ["candidate-documents", candidateId],
    enabled: !!candidateId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_documents")
        .select("id, candidate_id, doc_type, file_path, file_name, mime_type, expiry_date, created_at")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((d) => ({
        ...d,
        category: d.doc_type,
        title: d.file_name,
        worker_id: candidateId,
      })) as DocRow[];
    },
  });

  const upload = useMutation({
    mutationFn: async () => {
      if (!form.file || !form.doc_type) throw new Error("Type and file required");
      const ext = form.file.name.split(".").pop();
      const path = `${candidateId}/${form.doc_type}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("candidate-documents").upload(path, form.file);
      if (upErr) throw upErr;
      const { error } = await supabase.from("candidate_documents").insert({
        candidate_id: candidateId,
        doc_type: form.doc_type,
        file_path: path,
        file_name: form.file.name,
        mime_type: form.file.type,
        size_bytes: form.file.size,
        expiry_date: form.expiry_date || null,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Document uploaded");
      setForm({});
      qc.invalidateQueries({ queryKey: ["candidate-documents", candidateId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (d: DocRow) => {
      await supabase.storage.from("candidate-documents").remove([d.file_path]);
      const { error } = await supabase.from("candidate_documents").delete().eq("id", d.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["candidate-documents", candidateId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Skeleton className="h-32 w-full" />;

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Documents for {candidateName}</p>
      <Card className="space-y-3 border-border/60 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Select value={form.doc_type ?? ""} onValueChange={(v) => setForm({ ...form, doc_type: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{DOC_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Expiry</Label>
            <DatePicker value={form.expiry_date} onChange={(v) => setForm({ ...form, expiry_date: v })} />
          </div>
        </div>
        <Input type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] })} />
        <Button type="button" size="sm" disabled={upload.isPending} onClick={() => upload.mutate()}>
          <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload
        </Button>
      </Card>
      {!docs?.length ? (
        <EmptyState icon={FileCheck2} title="No documents" description="Upload passport, CV, or certificates." />
      ) : (
        <ul className="space-y-2">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-2 rounded-md border border-border/60 px-3 py-2 text-sm">
              <span className="capitalize">{d.doc_type}</span>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => setPreview(d)}><Eye className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove.mutate(d)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <DocumentPreviewDialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)} doc={preview} bucket="candidate-documents" />
    </div>
  );
}
