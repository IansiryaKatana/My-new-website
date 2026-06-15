import { cn } from "@/lib/utils";

type DecorativePillClusterProps = {
  className?: string;
};

export function DecorativePillCluster({ className }: DecorativePillClusterProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex h-7 w-14 -translate-y-0.5 items-center align-middle",
        className,
      )}
    >
      <span className="absolute left-0 top-1/2 size-6 -translate-y-1/2 rounded-full bg-mar-lime" />
      <span className="absolute left-5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-mar-blue" />
      <span className="absolute left-8 top-1/2 h-5 w-7 -translate-y-1/2 rounded-full bg-mar-black" />
      <span className="absolute left-10 top-1/2 size-3 -translate-y-1/2 rounded-full bg-white ring-1 ring-black/10" />
    </span>
  );
}
