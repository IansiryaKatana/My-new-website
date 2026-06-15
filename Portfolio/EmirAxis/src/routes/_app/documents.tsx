import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileCheck2, Upload, Trash2, AlertTriangle, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BulkBar } from "@/components/app/BulkBar";
import { downloadCsv, toCsv } from "@/components/app/BulkImportDialog";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { DatePicker } from "@/components/ui/date-picker";
import { DocumentPreviewDialog, type DocumentPreviewItem } from "@/components/app/DocumentPreviewDialog";
import { WorkerAvatar } from "@/components/app/WorkerAvatarField";

export const Route = createFileRoute("/_app/documents")({
  head: () => ({ meta: [{ title: "Documents — Staffing OS" }] }),
  component: DocumentsPage,
});

type Doc = DocumentPreviewItem & {
  worker_id: string;
  created_at: string;
};

const CATEGORIES = ["passport", "visa", "emirates_id", "labor_card", "medical", "insurance", "contract", "certificate", "other"] as const;

function daysUntil(date: string | null): number | null {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
}

function expiryBadge(date: string | null) {
  const d = daysUntil(date);
  if (d === null) return null;
  if (d < 0) return <Badge className="bg-destructive text-destructive-foreground">Expired {Math.abs(d)}d</Badge>;
  if (d <= 30) return <Badge className="bg-gold text-gold-foreground">Expires in {d}d</Badge>;
  if (d <= 60) return <Badge variant="secondary">Expires in {d}d</Badge>;
  return <Badge variant="outline">{d}d</Badge>;
}

function DocumentsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState<{ worker_id?: string; category?: string; title?: string; expiry_date?: string; file?: File } | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [preview, setPreview] = useState<Doc | null>(null);

  const { data: docs, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("documents").select("id, worker_id, category, title, file_path, file_name, mime_type, expiry_date, created_at").order("expiry_date", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data as Doc[];
    },
  });

  const { data: workers } = useQuery({
    queryKey: ["workers-lite"],
    queryFn: async () => (await supabase.from("workers").select("id, full_name, employee_code, avatar_url").order("full_name")).data ?? [],
  });
  const wmap = new Map((workers ?? []).map((w) => [w.id, w]));

  const upload = useMutation({
    mutationFn: async (payload: typeof uploading) => {
      if (!payload?.file || !payload.worker_id || !payload.category) throw new Error("Worker, category and file are required");
      const ext = payload.file.name.split(".").pop();
      const path = `${payload.worker_id}/${payload.category}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("documents").upload(path, payload.file, { upsert: false });
      if (upErr) throw upErr;
      const { error } = await supabase.from("documents").insert({
        worker_id: payload.worker_id,
        category: payload.category as never,
        title: payload.title ?? null,
        expiry_date: payload.expiry_date || null,
        file_path: path,
        file_name: payload.file.name,
        mime_type: payload.file.type,
        size_bytes: payload.file.size,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Document uploaded");
      setUploading(null);
      qc.invalidateQueries({ queryKey: ["documents"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (d: Doc) => {
      await supabase.storage.from("documents").remove([d.file_path]);
      const { error } = await supabase.from("documents").delete().eq("id", d.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Document removed");
      qc.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openPreview = (d: Doc) => {
    const w = wmap.get(d.worker_id);
    setPreview({ ...d, worker_name: w?.full_name ?? null });
  };

  const filtered = (docs ?? []).filter((d) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const w = wmap.get(d.worker_id);
    return [w?.full_name, w?.employee_code, d.category, d.title, d.file_name].some((v) => v?.toLowerCase().includes(q));
  });

  const bulk = useBulkSelection(filtered);

  const bulkDelete = useMutation({
    mutationFn: async () => {
      const targets = filtered.filter((d) => bulk.isSelected(d.id));
      const paths = targets.map((t) => t.file_path).filter(Boolean);
      if (paths.length) await supabase.storage.from("documents").remove(paths);
      const { error } = await supabase.from("documents").delete().in("id", bulk.selectedIds);
      if (error) throw error;
      return bulk.selectedIds.length;
    },
    onSuccess: (n) => {
      toast.success(`Deleted ${n} document${n === 1 ? "" : "s"}`);
      bulk.clear();
      setConfirmBulkDelete(false);
      qc.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exportSelected = () => {
    const rows = filtered.filter((d) => bulk.isSelected(d.id)).map((d) => {
      const w = wmap.get(d.worker_id);
      return {
        worker: w?.full_name ?? "",
        employee_code: w?.employee_code ?? "",
        category: d.category,
        title: d.title ?? "",
        file_name: d.file_name ?? "",
        expiry_date: d.expiry_date ?? "",
      };
    });
    downloadCsv(`documents-${Date.now()}.csv`, toCsv(rows));
  };

  const expiringSoon = (docs ?? []).filter((d) => {
    const dd = daysUntil(d.expiry_date);
    return dd !== null && dd <= 30;
  }).length;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Compliance"
        title="Documents & Visas"
        description="Track Emirates IDs, visas, passports, labor cards, medicals & contracts."
        actions={
          <Button onClick={() => setUploading({})} className="bg-primary hover:bg-primary/90">
            <Upload className="mr-1.5 h-4 w-4" /> Upload document
          </Button>
        }
      />

      {expiringSoon > 0 && (
        <Card className="flex items-center gap-3 border-gold/40 bg-gold/5 p-4">
          <AlertTriangle className="h-5 w-5 text-gold" />
          <div className="text-sm">
            <span className="font-medium text-foreground">{expiringSoon} document{expiringSoon === 1 ? "" : "s"}</span>{" "}
            <span className="text-muted-foreground">expiring within 30 days.</span>
          </div>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <div className="relative filter-grow sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search documents…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 bg-background" />
        </div>
        <div className="text-xs text-muted-foreground">{filtered.length} document{filtered.length === 1 ? "" : "s"}</div>
      </div>

      <Card className="table-shell">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={FileCheck2} title="No documents yet" description="Upload worker documents to start tracking compliance." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={bulk.allSelected ? true : bulk.someSelected ? "indeterminate" : false}
                    onCheckedChange={bulk.toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Title / File</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => {
                const w = wmap.get(d.worker_id);
                const selected = bulk.isSelected(d.id);
                return (
                  <TableRow key={d.id} data-state={selected ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox checked={selected} onCheckedChange={() => bulk.toggle(d.id)} aria-label="Select row" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {w ? <WorkerAvatar name={w.full_name} url={w.avatar_url} /> : null}
                        <div className="min-w-0">
                          <div className="font-medium">{w?.full_name ?? "—"}</div>
                          <div className="text-xs text-muted-foreground">{w?.employee_code ?? ""}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{d.category.replace(/_/g, " ")}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <button type="button" className="text-left text-sm text-primary hover:underline" onClick={() => openPreview(d)}>
                        {d.title ?? d.file_name ?? "—"}
                      </button>
                    </TableCell>
                    <TableCell>{expiryBadge(d.expiry_date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openPreview(d)} aria-label="Preview"><Eye className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove.mutate(d)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <BulkBar
        count={bulk.count}
        onClear={bulk.clear}
        onExport={exportSelected}
        onDelete={() => setConfirmBulkDelete(true)}
      />

      <AlertDialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {bulk.count} document{bulk.count === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the files from storage and the database. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => bulkDelete.mutate()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {bulkDelete.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={!!uploading} onOpenChange={(o) => !o && setUploading(null)}>
        <SheetContent form className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader><SheetTitle>Upload document</SheetTitle></SheetHeader>
          {uploading && (
            <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); upload.mutate(uploading); }}>
              <Field label="Worker *">
                <Select value={uploading.worker_id ?? ""} onValueChange={(v) => setUploading({ ...uploading, worker_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select worker" /></SelectTrigger>
                  <SelectContent>{(workers ?? []).map((w) => <SelectItem key={w.id} value={w.id}>{w.full_name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Category *">
                <Select value={uploading.category ?? ""} onValueChange={(v) => setUploading({ ...uploading, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Title"><Input value={uploading.title ?? ""} onChange={(e) => setUploading({ ...uploading, title: e.target.value })} placeholder="e.g. Visa copy 2026" /></Field>
              <Field label="Expiry date"><DatePicker value={uploading.expiry_date} onChange={(v) => setUploading({ ...uploading, expiry_date: v ?? "" })} /></Field>
              <Field label="File *"><Input type="file" onChange={(e) => setUploading({ ...uploading, file: e.target.files?.[0] })} /></Field>
              <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setUploading(null)}>Cancel</Button>
                <Button type="submit" disabled={upload.isPending} className="bg-primary">{upload.isPending ? "Uploading…" : "Upload"}</Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      <DocumentPreviewDialog doc={preview} open={!!preview} onOpenChange={(o) => !o && setPreview(null)} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}</div>;
}
