import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type BulkActionBarProps = {
  count: number;
  onClear: () => void;
  children?: ReactNode;
};

export function BulkActionBar({ count, onClear, children }: BulkActionBarProps) {
  if (count === 0) return null;
  return (
    <div className="sticky top-0 z-10 mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
      <span className="text-sm font-medium text-foreground">{count} selected</span>
      {children}
      <Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}
