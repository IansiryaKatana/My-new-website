import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Branding {
  company_name: string;
  short_name: string;
  tagline: string | null;
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  accent_color: string;
  background_color: string;
  foreground_color: string;
  support_email: string | null;
  support_phone: string | null;
  font_family: string;
  font_display_family: string;
  font_weights: string;
}

/** Map legacy DB paths to bundled SVG assets. */
function normalizeBrandingAssets(b: Branding): Branding {
  const map = (url: string | null) =>
    url
      ?.replace("/assets/emiraxis-logo-white.png", "/assets/emiraxis-logo-white.svg")
      .replace("/assets/emiraxis-logo.png", "/assets/emiraxis-logo.svg")
      .replace("/assets/emiraxis-favicon.png", "/assets/emiraxis-favicon.svg") ?? url;
  return {
    ...b,
    logo_url: map(b.logo_url),
    logo_dark_url: map(b.logo_dark_url),
    favicon_url: map(b.favicon_url),
  };
}

const DEFAULT_BRANDING: Branding = {
  company_name: "EmirAxis",
  short_name: "EmirAxis",
  tagline: "The command center for UAE workforce operations.",
  logo_url: "/assets/emiraxis-logo.svg",
  logo_dark_url: "/assets/emiraxis-logo-white.svg",
  favicon_url: "/assets/emiraxis-favicon.svg",
  primary_color: "oklch(0.28 0.09 252)",
  accent_color: "oklch(0.78 0.13 85)",
  background_color: "oklch(0.985 0.005 85)",
  foreground_color: "oklch(0.18 0.04 252)",
  support_email: null,
  support_phone: null,
  font_family: "Geist",
  font_display_family: "Geist",
  font_weights: "100;200;300",
};

const BrandingContext = createContext<{ branding: Branding; refresh: () => Promise<void> }>({
  branding: DEFAULT_BRANDING,
  refresh: async () => {},
});

const FONT_LINK_ID = "app-google-font";

function loadGoogleFont(family: string, displayFamily: string, weights: string) {
  if (typeof document === "undefined") return;
  const unique = Array.from(new Set([family, displayFamily].filter(Boolean)));
  const w = weights || "100;200;300";
  const href =
    "https://fonts.googleapis.com/css2?" +
    unique.map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@${w}`).join("&") +
    "&display=swap";
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  if (link.href !== href) link.href = href;
}

function applyTheme(b: Branding) {
  if (typeof document === "undefined") return;
  const r = document.documentElement.style;
  r.setProperty("--primary", b.primary_color);
  r.setProperty("--gold", b.accent_color);
  r.setProperty("--ring", b.accent_color);
  r.setProperty("--sidebar-primary", b.accent_color);
  r.setProperty("--app-font", `"${b.font_family}"`);
  r.setProperty("--app-font-display", `"${b.font_display_family}"`);
  document.title = b.company_name;
  if (b.favicon_url) {
    let icon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      document.head.appendChild(icon);
    }
    icon.href = b.favicon_url;
  }
  loadGoogleFont(b.font_family, b.font_display_family, b.font_weights);
}

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<Branding>(DEFAULT_BRANDING);

  const load = async () => {
    const { data } = await supabase.from("branding_settings").select("*").maybeSingle();
    if (data) {
      const b = normalizeBrandingAssets({ ...DEFAULT_BRANDING, ...data } as Branding);
      setBranding(b);
      applyTheme(b);
    } else {
      applyTheme(DEFAULT_BRANDING);
    }
  };

  useEffect(() => {
    applyTheme(DEFAULT_BRANDING);
    void load();
  }, []);

  return (
    <BrandingContext.Provider value={{ branding, refresh: load }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
