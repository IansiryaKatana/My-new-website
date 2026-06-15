import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  // generic
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  gold: "bg-gold/15 text-gold-foreground border-gold/40",
};

// Maps every status enum value to a tone
const statusMap: Record<string, keyof typeof tones> = {
  // client_status
  prospect: "info", active: "success", on_hold: "warning", inactive: "neutral", blacklisted: "danger",
  // job_order_status
  draft: "neutral", open: "info", in_progress: "gold", partially_filled: "warning",
  filled: "success", cancelled: "danger",
  // candidate_status
  new: "info", screening: "gold", shortlisted: "info", interviewing: "gold",
  offered: "warning", hired: "success", rejected: "danger", withdrawn: "neutral",
  // worker_status
  onboarding: "info", on_leave: "warning", suspended: "danger",
  terminated: "danger", absconded: "danger", exited: "neutral",
  // placement_status
  proposed: "info", confirmed: "gold", completed: "success",
  // issue severity / extra
  resolved: "success", closed: "neutral", low: "neutral", medium: "info", high: "warning", critical: "danger",
  // invoice_status
  sent: "info", partial: "warning", paid: "success", overdue: "danger", void: "neutral",
};

export function StatusBadge({ status, className }: { status: string | null | undefined; className?: string }) {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const tone = statusMap[status] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        tones[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status.replace(/_/g, " ")}
    </span>
  );
}
