import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface BulkEditField {
  key: string;
  label: string;
  /** Currently only "select" is supported for safety */
  type: "select";
  options: { value: string; label: string }[];
}

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  count: number;
  fields: BulkEditField[];
  onApply: (patch: Record<string, unknown>) => Promise<void> | void;
}

export function BulkEditDialog({ open, onOpenChange, count, fields, onApply }: Props) {
  const [patch, setPatch] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    const filtered = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== "" && v != null));
    if (Object.keys(filtered).length === 0) {
      onOpenChange(false);
      return;
    }
    setBusy(true);
    try {
      await onApply(filtered);
      setPatch({});
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk edit {count} item{count === 1 ? "" : "s"}</DialogTitle>
          <DialogDescription>
            Only fields you change will be applied. Empty fields are ignored.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">{f.label}</Label>
              <Select value={patch[f.key] ?? ""} onValueChange={(v) => setPatch({ ...patch, [f.key]: v })}>
                <SelectTrigger><SelectValue placeholder="Leave unchanged" /></SelectTrigger>
                <SelectContent>
                  {f.options.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="capitalize">{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handle} disabled={busy}>{busy ? "Applying…" : "Apply"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
