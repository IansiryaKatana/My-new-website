import type { ComponentType } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Tone = "default" | "gold" | "info" | "success" | "warning" | "danger";

const toneStyles: Record<Tone, string> = {
  default: "bg-primary/8 text-primary",
  gold: "bg-gold/20 text-gold-foreground",
  info: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
};

interface StatCardProps {
  label: string;
  value: number | string | null | undefined;
  icon: ComponentType<{ className?: string }>;
  hint?: string;
  loading?: boolean;
  tone?: Tone;
}

export function StatCard({ label, value, icon: Icon, hint, loading, tone = "default" }: StatCardProps) {
  return (
    <Card className="min-w-0 border-border/60 p-4 shadow-soft transition-smooth hover:shadow-elegant sm:p-5">
      <div className="flex items-start justify-between">
        <div className={cn("grid h-9 w-9 place-items-center rounded-lg", toneStyles[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 break-words font-display text-2xl text-primary sm:text-3xl">
        {loading ? <Skeleton className="h-8 w-16" /> : (value ?? "—")}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      {hint && <div className="mt-2 text-[11px] text-muted-foreground/70">{hint}</div>}
    </Card>
  );
}
