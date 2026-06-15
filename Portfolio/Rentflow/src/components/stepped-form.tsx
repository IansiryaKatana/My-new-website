import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FormStep = {
  id: string;
  title: string;
  content: ReactNode;
  validate?: () => boolean;
};

type SteppedFormProps = {
  steps: FormStep[];
  stepIndex: number;
  onStepChange: (index: number) => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel?: string;
  onCancel: () => void;
};

export function SteppedForm({
  steps,
  stepIndex,
  onStepChange,
  onSubmit,
  submitting,
  submitLabel = "Save",
  onCancel,
}: SteppedFormProps) {
  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  function next() {
    if (step.validate && !step.validate()) return;
    if (!isLast) onStepChange(stepIndex + 1);
    else onSubmit();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => i < stepIndex && onStepChange(i)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs transition-colors",
              i === stepIndex
                ? "bg-primary text-primary-foreground"
                : i < stepIndex
                  ? "bg-muted text-foreground hover:bg-muted/80"
                  : "bg-muted/50 text-muted-foreground",
            )}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>
      <div>{step.content}</div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex gap-2">
          {!isFirst && (
            <Button type="button" variant="outline" onClick={() => onStepChange(stepIndex - 1)}>
              Back
            </Button>
          )}
          <Button type="button" onClick={next} disabled={submitting}>
            {submitting ? "Saving…" : isLast ? submitLabel : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
