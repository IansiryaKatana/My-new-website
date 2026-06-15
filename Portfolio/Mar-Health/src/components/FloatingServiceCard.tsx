import { LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingServiceCardProps = {
  tone?: "lime" | "dark";
  className?: string;
};

export function FloatingServiceCard({
  tone = "lime",
  className,
}: FloatingServiceCardProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "rounded-[1.15rem] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.16)]",
        dark ? "bg-mar-black text-white" : "bg-mar-lime text-mar-black",
        className,
      )}
    >
      <div className="mb-8 flex items-start justify-between gap-6">
        <div className={cn("checkerboard h-14 w-16", dark ? "text-white" : "text-white/90")} />
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            dark ? "bg-mar-lime text-mar-black" : "bg-white/70 text-mar-black",
          )}
        >
          <LockKeyhole className="size-3.5" />
        </span>
      </div>
      <p className="label-text mb-2 opacity-70">Assurance</p>
      <h3 className="max-w-[9rem] text-[1.35rem] font-semibold leading-[0.95] tracking-[-0.06em]">
        Simple Powerful Tech Solutions
      </h3>
      <p className="mt-4 text-[0.66rem] font-semibold uppercase tracking-[0.12em] opacity-65">
        Health access / secure care
      </p>
    </div>
  );
}
