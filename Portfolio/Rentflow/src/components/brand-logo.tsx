import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBranding } from "@/components/brand-provider";

const SIZE_CLASSES = {
  sm: { img: "h-8 max-h-8 max-w-[7.5rem]", fallback: "h-8 w-8" },
  md: { img: "h-10 max-h-10 max-w-[10rem]", fallback: "h-10 w-10" },
  lg: { img: "h-12 max-h-12 max-w-[12rem]", fallback: "h-12 w-12" },
} as const;

type BrandLogoProps = {
  className?: string;
  size?: keyof typeof SIZE_CLASSES;
  /** @deprecated Use size instead — kept for backwards compatibility */
  iconClassName?: string;
  showName?: boolean;
  nameClassName?: string;
  subtitle?: string;
  variant?: "default" | "on-dark";
};

export function BrandLogo({
  className,
  size = "md",
  iconClassName,
  showName = false,
  nameClassName,
  subtitle,
  variant = "default",
}: BrandLogoProps) {
  const branding = useBranding();
  const name = branding.agency_name ?? "Rentflow";
  const logoSrc =
    variant === "on-dark"
      ? branding.logo_url_dark || branding.logo_url
      : branding.logo_url || branding.logo_url_dark;
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <div className={cn("flex items-center", showName ? "gap-3" : "", className)}>
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={name}
          className={cn("w-auto shrink-0 object-contain object-left", sizeClasses.img, iconClassName)}
        />
      ) : (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-ink shadow-glow",
            sizeClasses.fallback,
            iconClassName,
          )}
          aria-label={name}
        >
          <Building2 className={size === "lg" ? "h-6 w-6" : size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
        </div>
      )}
      {showName && (
        <div>
          <span
            className={cn(
              "block text-base",
              variant === "on-dark" ? "text-white" : "text-foreground",
              nameClassName,
            )}
          >
            {name}
          </span>
          {subtitle && (
            <span className={cn("text-xs", variant === "on-dark" ? "text-white/60" : "text-muted-foreground")}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
