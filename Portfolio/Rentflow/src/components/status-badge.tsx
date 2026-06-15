import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { formatStatusLabel, getStatusSemantic, type StatusSemantic } from "@/lib/status-badges";
import { cn } from "@/lib/utils";

type StatusBadgeProps = Omit<ComponentProps<typeof Badge>, "variant"> & {
  status: string;
  semantic?: StatusSemantic;
  label?: string;
};

export function StatusBadge({ status, semantic, label, className, children, ...props }: StatusBadgeProps) {
  const resolved = getStatusSemantic(status, semantic);

  return (
    <Badge variant={`status-${resolved}`} className={cn("capitalize", className)} {...props}>
      {children ?? label ?? formatStatusLabel(status)}
    </Badge>
  );
}
