import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/utils";

export function Section({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <section className={cn("py-20 sm:py-28 lg:py-32", className)} {...props} />;
}

export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container-page", className)} {...props} />;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
      <span className="h-1.5 w-1.5 rounded-full bg-ink" />
      {children}
    </p>
  );
}

export function SectionHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-balance text-3xl font-medium leading-[1.05] tracking-[-0.04em] text-ink sm:text-4xl lg:text-5xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}
