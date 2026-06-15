import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface BulkImportDialogProps<T> {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title?: string;
  description?: string;
  /** Comma-separated list of supported columns, first column shown as example */
  columns: string[];
  /** Map a parsed row (header → value) to an insert payload. Return null to skip row. */
  mapRow: (row: Record<string, string>) => Record<string, unknown> | null;
  /** Run the insert. Return number of created rows. */
  onSubmit: (rows: Record<string, unknown>[]) => Promise<number>;
}

function parseCsv(input: string): Record<string, string>[] {
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitLine(lines[0]).map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = splitLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = (cells[i] ?? "").trim()));
    return row;
  });
}
function splitLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { q = !q; continue; }
    if (c === "," && !q) { out.push(cur); cur = ""; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}

export function BulkImportDialog<T>({
  open,
  onOpenChange,
  title = "Bulk create",
  description,
  columns,
  mapRow,
  onSubmit,
}: BulkImportDialogProps<T>) {
  const [csv, setCsv] = useState("");
  const [busy, setBusy] = useState(false);
  const example = columns.join(",");

  const handle = async () => {
    const rows = parseCsv(csv);
    if (rows.length === 0) { toast.error("No data rows detected"); return; }
    const payloads = rows.map(mapRow).filter(Boolean) as Record<string, unknown>[];
    if (payloads.length === 0) { toast.error("No valid rows after mapping"); return; }
    setBusy(true);
    try {
      const n = await onSubmit(payloads);
      toast.success(`Created ${n} record${n === 1 ? "" : "s"}`);
      setCsv("");
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description ?? "Paste comma-separated rows. The first line must be the header."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Supported columns</Label>
          <code className="block rounded-md bg-muted px-2 py-1.5 text-xs">{example}</code>
          <Textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder={`${example}\n…`}
            rows={10}
            className="font-mono text-xs"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handle} disabled={busy || !csv.trim()}>
            {busy ? "Importing…" : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function toCsv(rows: Record<string, unknown>[], headers?: string[]): string {
  if (rows.length === 0) return "";
  const cols = headers ?? Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
