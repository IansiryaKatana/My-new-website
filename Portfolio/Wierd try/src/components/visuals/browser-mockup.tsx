import { cn } from "../../lib/utils";

export function BrowserMockup({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border shadow-[var(--shadow-card)]",
        isDark ? "border-white/10 bg-[#111]" : "border-line bg-paper",
        className,
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "flex h-9 items-center gap-1.5 border-b px-4",
          isDark ? "border-white/10" : "border-line",
        )}
      >
        <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
        <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
        <span className="h-2 w-2 rounded-full bg-[#28C840]" />
      </div>
      <div className="space-y-4 p-4">
        <div
          className={cn(
            "h-20 rounded-xl",
            isDark
              ? "bg-gradient-to-br from-white/20 to-white/5"
              : "bg-gradient-to-br from-ink/10 to-ink/5",
          )}
        />
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className={cn(
                "h-14 rounded-lg",
                isDark ? "bg-white/[0.08]" : "bg-ink/5",
              )}
            />
          ))}
        </div>
        <div className="space-y-2">
          <div className={cn("h-2 w-3/4 rounded", isDark ? "bg-white/25" : "bg-ink/15")} />
          <div className={cn("h-2 w-1/2 rounded", isDark ? "bg-white/15" : "bg-ink/10")} />
        </div>
      </div>
    </div>
  );
}
