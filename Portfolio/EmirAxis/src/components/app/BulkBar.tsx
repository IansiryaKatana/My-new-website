import { X, Trash2, Pencil, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface BulkBarProps {
  count: number;
  onClear: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onExport?: () => void;
  extra?: ReactNode;
  className?: string;
  deleteLabel?: string;
  editLabel?: string;
}

export function BulkBar({
  count,
  onClear,
  onDelete,
  onEdit,
  onExport,
  extra,
  className,
  deleteLabel = "Delete",
  editLabel = "Bulk edit",
}: BulkBarProps) {
  if (count === 0) return null;
  return (
    <div
      className={cn(
        "sticky bottom-4 z-30 mx-auto flex w-[calc(100%-1rem)] max-w-lg flex-wrap items-center justify-center gap-1.5 rounded-full border border-border bg-card/95 px-2 py-2 shadow-elegant backdrop-blur sm:w-fit sm:min-w-[280px] sm:flex-nowrap sm:gap-2 sm:px-3",
        className,
      )}
    >
      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={onClear} aria-label="Clear selection">
        <X className="h-4 w-4" />
      </Button>
      <span className="text-sm tabular-nums text-foreground">
        {count} selected
      </span>
      <div className="mx-1 h-5 w-px bg-border" />
      {onEdit && (
        <Button size="sm" variant="ghost" className="h-8 gap-1.5" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" /> {editLabel}
        </Button>
      )}
      {onExport && (
        <Button size="sm" variant="ghost" className="h-8 gap-1.5" onClick={onExport}>
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
      )}
      {extra}
      {onDelete && (
        <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" /> {deleteLabel}
        </Button>
      )}
    </div>
  );
}
