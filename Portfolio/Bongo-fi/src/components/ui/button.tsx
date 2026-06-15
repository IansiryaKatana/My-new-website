import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-[#B6FF2E]/70 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#B6FF2E] text-[#101010] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:scale-[1.02] hover:bg-[#c4ff55]",
        secondary: "bg-white text-[#101010] shadow-sm hover:bg-[#ededeb]",
        ghost: "bg-transparent text-[#535353] hover:bg-white/70 hover:text-[#101010]",
        dark: "bg-[#101010] text-white hover:bg-[#232323]",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4 text-xs",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  asChild = false,
  className,
  size,
  variant,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    />
  );
}
