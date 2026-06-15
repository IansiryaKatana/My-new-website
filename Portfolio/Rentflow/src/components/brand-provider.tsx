import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPublicBranding } from "@/lib/agency.functions";
import {
  applyBrandPaletteToDocument,
  mergeBrandPalette,
  type BrandPalette,
  DEFAULT_BRAND_PALETTE,
} from "@/lib/branding";

const BrandingContext = createContext<BrandPalette>(DEFAULT_BRAND_PALETTE);

export function useBranding() {
  return useContext(BrandingContext);
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const fetchBranding = useServerFn(getPublicBranding);
  const { data } = useQuery({
    queryKey: ["publicBranding"],
    queryFn: () => fetchBranding(),
    staleTime: 60_000,
  });

  const palette = useMemo(() => mergeBrandPalette(data ?? undefined), [data]);

  useEffect(() => {
    applyBrandPaletteToDocument(palette);
  }, [palette]);

  return <BrandingContext.Provider value={palette}>{children}</BrandingContext.Provider>;
}
