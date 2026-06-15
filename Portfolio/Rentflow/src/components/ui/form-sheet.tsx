"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type FormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function FormSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: FormSheetProps) {
  const isMobile = useIsMobile();
  const side = isMobile ? "bottom" : "right";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          "flex flex-col gap-0 overflow-hidden p-0",
          side === "bottom"
            ? "mb-0 max-h-[92vh] rounded-t-2xl border-t sm:max-h-[90vh]"
            : "h-full w-full max-w-lg border-l sm:max-w-xl",
          className,
        )}
      >
        <SheetHeader className="shrink-0 space-y-1 border-b border-border px-4 py-3 text-left sm:px-5">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="min-w-0">
              <SheetTitle className="text-base">{title}</SheetTitle>
              {description && <SheetDescription>{description}</SheetDescription>}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8 shrink-0"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">{children}</div>
        {footer && (
          <SheetFooter className="shrink-0 border-t border-border px-4 py-3 sm:px-5">{footer}</SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
