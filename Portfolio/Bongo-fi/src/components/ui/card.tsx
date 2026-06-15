import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-[22px] border border-black/[0.04] bg-[#f8f8f6] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-start justify-between gap-3", className)}
      {...props}
    />
  );
}
