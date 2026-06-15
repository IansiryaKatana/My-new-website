import { useBranding } from "@/lib/branding/BrandingProvider";
import type { PdfBranding } from "@/lib/pdf";

export function usePdfBranding(): PdfBranding {
  const { branding } = useBranding();
  return {
    company_name: branding.company_name,
    support_email: branding.support_email,
    support_phone: branding.support_phone,
    tagline: branding.tagline,
  };
}
