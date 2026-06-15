import { ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CircleButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  tone?: "blue" | "lime" | "white" | "black";
  label?: string;
  size?: "sm" | "md" | "lg";
};

const toneClasses = {
  blue: "bg-mar-blue text-white shadow-[0_18px_45px_rgba(0,108,255,0.24)]",
  lime: "bg-mar-lime text-mar-black shadow-[0_18px_45px_rgba(184,255,0,0.22)]",
  white: "bg-white text-mar-black",
  black: "bg-mar-black text-white",
};

const sizeClasses = {
  sm: "size-10",
  md: "size-14 sm:size-16",
  lg: "size-18 sm:size-20",
};

export function CircleButton({
  className,
  tone = "blue",
  label = "Open",
  size = "md",
  ...props
}: CircleButtonProps) {
  return (
    <a
      aria-label={label}
      className={cn(
        "group inline-flex shrink-0 items-center justify-center rounded-full transition duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mar-blue/40",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <ArrowUpRight className="size-5 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-12" />
    </a>
  );
}
