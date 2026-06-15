import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex min-w-0 flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{eyebrow}</div>
        )}
        <h1 className="mt-1 break-words font-display text-2xl text-primary sm:text-3xl lg:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl break-words text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">{actions}</div>}
    </header>
  );
}
