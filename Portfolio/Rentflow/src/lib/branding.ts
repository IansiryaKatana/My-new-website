export type BrandPalette = {
  agency_name: string | null;
  logo_url: string | null;
  logo_url_dark: string | null;
  favicon_url: string | null;
  color_prussian: string;
  color_charcoal: string;
  color_mint_cream: string;
  color_royal_gold: string;
  color_watermelon: string;
  color_status_success: string;
  color_status_warning: string;
  color_status_info: string;
  color_status_danger: string;
  color_status_neutral: string;
};

export const DEFAULT_BRAND_PALETTE: BrandPalette = {
  agency_name: "Rentflow",
  logo_url: null,
  logo_url_dark: null,
  favicon_url: null,
  color_prussian: "#011936",
  color_charcoal: "#465362",
  color_mint_cream: "#F4FFFD",
  color_royal_gold: "#F9DC5C",
  color_watermelon: "#ED254E",
  color_status_success: "#059669",
  color_status_warning: "#D97706",
  color_status_info: "#2563EB",
  color_status_danger: "#DC2626",
  color_status_neutral: "#64748B",
};

const HEX_RE = /^#([0-9A-Fa-f]{6})$/;

export function isValidHexColor(value: string): boolean {
  return HEX_RE.test(value);
}

export function normalizeHexColor(value: string, fallback: string): string {
  const trimmed = value.trim();
  if (!trimmed.startsWith("#")) return isValidHexColor(`#${trimmed}`) ? `#${trimmed}` : fallback;
  return isValidHexColor(trimmed) ? trimmed.toUpperCase() : fallback;
}

export function mergeBrandPalette(partial?: Partial<BrandPalette> | null): BrandPalette {
  if (!partial) return { ...DEFAULT_BRAND_PALETTE };
  return {
    agency_name: partial.agency_name ?? DEFAULT_BRAND_PALETTE.agency_name,
    logo_url: partial.logo_url ?? null,
    logo_url_dark: partial.logo_url_dark ?? null,
    favicon_url: partial.favicon_url ?? null,
    color_prussian: normalizeHexColor(partial.color_prussian ?? DEFAULT_BRAND_PALETTE.color_prussian, DEFAULT_BRAND_PALETTE.color_prussian),
    color_charcoal: normalizeHexColor(partial.color_charcoal ?? DEFAULT_BRAND_PALETTE.color_charcoal, DEFAULT_BRAND_PALETTE.color_charcoal),
    color_mint_cream: normalizeHexColor(partial.color_mint_cream ?? DEFAULT_BRAND_PALETTE.color_mint_cream, DEFAULT_BRAND_PALETTE.color_mint_cream),
    color_royal_gold: normalizeHexColor(partial.color_royal_gold ?? DEFAULT_BRAND_PALETTE.color_royal_gold, DEFAULT_BRAND_PALETTE.color_royal_gold),
    color_watermelon: normalizeHexColor(partial.color_watermelon ?? DEFAULT_BRAND_PALETTE.color_watermelon, DEFAULT_BRAND_PALETTE.color_watermelon),
    color_status_success: normalizeHexColor(
      partial.color_status_success ?? DEFAULT_BRAND_PALETTE.color_status_success,
      DEFAULT_BRAND_PALETTE.color_status_success,
    ),
    color_status_warning: normalizeHexColor(
      partial.color_status_warning ?? DEFAULT_BRAND_PALETTE.color_status_warning,
      DEFAULT_BRAND_PALETTE.color_status_warning,
    ),
    color_status_info: normalizeHexColor(
      partial.color_status_info ?? DEFAULT_BRAND_PALETTE.color_status_info,
      DEFAULT_BRAND_PALETTE.color_status_info,
    ),
    color_status_danger: normalizeHexColor(
      partial.color_status_danger ?? DEFAULT_BRAND_PALETTE.color_status_danger,
      DEFAULT_BRAND_PALETTE.color_status_danger,
    ),
    color_status_neutral: normalizeHexColor(
      partial.color_status_neutral ?? DEFAULT_BRAND_PALETTE.color_status_neutral,
      DEFAULT_BRAND_PALETTE.color_status_neutral,
    ),
  };
}

/** Apply palette tokens to document root so Tailwind CSS variables update live. */
export function applyBrandPaletteToDocument(palette: BrandPalette) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const p = mergeBrandPalette(palette);

  root.style.setProperty("--prussian", p.color_prussian);
  root.style.setProperty("--charcoal", p.color_charcoal);
  root.style.setProperty("--mint-cream", p.color_mint_cream);
  root.style.setProperty("--royal-gold", p.color_royal_gold);
  root.style.setProperty("--watermelon", p.color_watermelon);
  root.style.setProperty("--status-success", p.color_status_success);
  root.style.setProperty("--status-warning", p.color_status_warning);
  root.style.setProperty("--status-info", p.color_status_info);
  root.style.setProperty("--status-danger", p.color_status_danger);
  root.style.setProperty("--status-neutral", p.color_status_neutral);

  root.style.setProperty("--ink", p.color_prussian);
  root.style.setProperty("--gold", p.color_royal_gold);
  root.style.setProperty("--gold-foreground", p.color_prussian);
  root.style.setProperty("--sand", p.color_mint_cream);

  root.style.setProperty("--background", p.color_mint_cream);
  root.style.setProperty("--foreground", p.color_prussian);
  root.style.setProperty("--card", "#ffffff");
  root.style.setProperty("--card-foreground", p.color_prussian);
  root.style.setProperty("--primary", p.color_prussian);
  root.style.setProperty("--primary-foreground", p.color_mint_cream);
  root.style.setProperty("--secondary", `color-mix(in oklab, ${p.color_charcoal} 12%, ${p.color_mint_cream})`);
  root.style.setProperty("--secondary-foreground", p.color_prussian);
  root.style.setProperty("--muted", `color-mix(in oklab, ${p.color_charcoal} 8%, white)`);
  root.style.setProperty("--muted-foreground", p.color_charcoal);
  root.style.setProperty("--accent", p.color_royal_gold);
  root.style.setProperty("--accent-foreground", p.color_prussian);
  root.style.setProperty("--destructive", p.color_watermelon);
  root.style.setProperty("--border", `color-mix(in oklab, ${p.color_charcoal} 22%, transparent)`);
  root.style.setProperty("--input", `color-mix(in oklab, ${p.color_charcoal} 18%, transparent)`);
  root.style.setProperty("--ring", p.color_royal_gold);

  root.style.setProperty(
    "--gradient-hero",
    `linear-gradient(145deg, ${p.color_prussian} 0%, color-mix(in oklab, ${p.color_prussian} 85%, ${p.color_charcoal}) 45%, ${p.color_charcoal} 100%)`,
  );
  root.style.setProperty(
    "--gradient-gold",
    `linear-gradient(135deg, color-mix(in oklab, ${p.color_royal_gold} 70%, white) 0%, ${p.color_royal_gold} 50%, color-mix(in oklab, ${p.color_royal_gold} 80%, #c9a000) 100%)`,
  );
  root.style.setProperty(
    "--gradient-watermelon",
    `linear-gradient(135deg, color-mix(in oklab, ${p.color_watermelon} 80%, white) 0%, ${p.color_watermelon} 100%)`,
  );
  root.style.setProperty(
    "--gradient-mesh",
    `radial-gradient(at 0% 0%, color-mix(in oklab, ${p.color_royal_gold} 22%, transparent) 0, transparent 50%), radial-gradient(at 100% 0%, color-mix(in oklab, ${p.color_watermelon} 12%, transparent) 0, transparent 45%), ${p.color_mint_cream}`,
  );

  applyFaviconToDocument(p.favicon_url);
}

export function applyFaviconToDocument(url: string | null | undefined) {
  if (typeof document === "undefined") return;

  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = url || "/favicon.ico";
}
