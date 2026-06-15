import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ImageIcon, Palette, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { updateAgencyBranding } from "@/lib/agency.functions";
import { StatusBadge } from "@/components/status-badge";
import {
  applyBrandPaletteToDocument,
  DEFAULT_BRAND_PALETTE,
  isValidHexColor,
  mergeBrandPalette,
  normalizeHexColor,
  type BrandPalette,
} from "@/lib/branding";
import { STATUS_SEMANTIC_LABELS, type StatusSemantic } from "@/lib/status-badges";

type AgencyRow = {
  logo_url: string | null;
  logo_url_dark: string | null;
  favicon_url: string | null;
  color_prussian: string | null;
  color_charcoal: string | null;
  color_mint_cream: string | null;
  color_royal_gold: string | null;
  color_watermelon: string | null;
  color_status_success: string | null;
  color_status_warning: string | null;
  color_status_info: string | null;
  color_status_danger: string | null;
  color_status_neutral: string | null;
};

const COLOR_FIELDS: { key: keyof BrandPalette; label: string; hint: string }[] = [
  { key: "color_prussian", label: "Prussian Blue", hint: "Primary · sidebar · headings" },
  { key: "color_charcoal", label: "Charcoal Blue", hint: "Muted text · borders" },
  { key: "color_mint_cream", label: "Mint Cream", hint: "Page background" },
  { key: "color_royal_gold", label: "Royal Gold", hint: "Accents · highlights" },
  { key: "color_watermelon", label: "Watermelon", hint: "CTAs · alerts" },
];

const STATUS_COLOR_FIELDS: { key: keyof BrandPalette; semantic: StatusSemantic; hint: string }[] = [
  { key: "color_status_success", semantic: "success", hint: "Approved · paid · active · resolved" },
  { key: "color_status_warning", semantic: "warning", hint: "Pending · scheduled · awaiting" },
  { key: "color_status_info", semantic: "info", hint: "In progress · open · submitted" },
  { key: "color_status_danger", semantic: "danger", hint: "Rejected · bounced · urgent" },
  { key: "color_status_neutral", semantic: "neutral", hint: "Draft · closed · ended" },
];

const STATUS_PREVIEW_SAMPLES: { status: string; semantic: StatusSemantic }[] = [
  { status: "approved", semantic: "success" },
  { status: "pending", semantic: "warning" },
  { status: "in_progress", semantic: "info" },
  { status: "rejected", semantic: "danger" },
  { status: "closed", semantic: "neutral" },
];

export function BrandingTab({ initial }: { initial: AgencyRow }) {
  const qc = useQueryClient();
  const update = useServerFn(updateAgencyBranding);

  const [logoUrl, setLogoUrl] = useState(initial.logo_url ?? "");
  const [logoUrlDark, setLogoUrlDark] = useState(initial.logo_url_dark ?? "");
  const [faviconUrl, setFaviconUrl] = useState(initial.favicon_url ?? "");
  const [colors, setColors] = useState({
    color_prussian: initial.color_prussian ?? DEFAULT_BRAND_PALETTE.color_prussian,
    color_charcoal: initial.color_charcoal ?? DEFAULT_BRAND_PALETTE.color_charcoal,
    color_mint_cream: initial.color_mint_cream ?? DEFAULT_BRAND_PALETTE.color_mint_cream,
    color_royal_gold: initial.color_royal_gold ?? DEFAULT_BRAND_PALETTE.color_royal_gold,
    color_watermelon: initial.color_watermelon ?? DEFAULT_BRAND_PALETTE.color_watermelon,
    color_status_success: initial.color_status_success ?? DEFAULT_BRAND_PALETTE.color_status_success,
    color_status_warning: initial.color_status_warning ?? DEFAULT_BRAND_PALETTE.color_status_warning,
    color_status_info: initial.color_status_info ?? DEFAULT_BRAND_PALETTE.color_status_info,
    color_status_danger: initial.color_status_danger ?? DEFAULT_BRAND_PALETTE.color_status_danger,
    color_status_neutral: initial.color_status_neutral ?? DEFAULT_BRAND_PALETTE.color_status_neutral,
  });
  const [uploading, setUploading] = useState<"logo-light" | "logo-dark" | "favicon" | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const previewPalette = useMemo(
    () =>
      mergeBrandPalette({
        logo_url: logoUrl || null,
        logo_url_dark: logoUrlDark || null,
        favicon_url: faviconUrl || null,
        ...colors,
      }),
    [logoUrl, logoUrlDark, faviconUrl, colors],
  );

  useEffect(() => {
    applyBrandPaletteToDocument(previewPalette);
  }, [previewPalette]);

  const mut = useMutation({
    mutationFn: () =>
      update({
        data: {
          logo_url: logoUrl.trim() || null,
          logo_url_dark: logoUrlDark.trim() || null,
          favicon_url: faviconUrl.trim() || null,
          color_prussian: normalizeHexColor(colors.color_prussian, DEFAULT_BRAND_PALETTE.color_prussian),
          color_charcoal: normalizeHexColor(colors.color_charcoal, DEFAULT_BRAND_PALETTE.color_charcoal),
          color_mint_cream: normalizeHexColor(colors.color_mint_cream, DEFAULT_BRAND_PALETTE.color_mint_cream),
          color_royal_gold: normalizeHexColor(colors.color_royal_gold, DEFAULT_BRAND_PALETTE.color_royal_gold),
          color_watermelon: normalizeHexColor(colors.color_watermelon, DEFAULT_BRAND_PALETTE.color_watermelon),
          color_status_success: normalizeHexColor(colors.color_status_success, DEFAULT_BRAND_PALETTE.color_status_success),
          color_status_warning: normalizeHexColor(colors.color_status_warning, DEFAULT_BRAND_PALETTE.color_status_warning),
          color_status_info: normalizeHexColor(colors.color_status_info, DEFAULT_BRAND_PALETTE.color_status_info),
          color_status_danger: normalizeHexColor(colors.color_status_danger, DEFAULT_BRAND_PALETTE.color_status_danger),
          color_status_neutral: normalizeHexColor(colors.color_status_neutral, DEFAULT_BRAND_PALETTE.color_status_neutral),
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agencySettings"] });
      qc.invalidateQueries({ queryKey: ["publicBranding"] });
    },
  });

  async function uploadAsset(file: File, kind: "logo-light" | "logo-dark" | "favicon") {
    setUploadError(null);
    setUploading(kind);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `${kind}.${ext}`;
      const { error } = await supabase.storage.from("branding").upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("branding").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      if (kind === "logo-light") setLogoUrl(url);
      else if (kind === "logo-dark") setLogoUrlDark(url);
      else setFaviconUrl(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  function resetPalette() {
    setColors({
      color_prussian: DEFAULT_BRAND_PALETTE.color_prussian,
      color_charcoal: DEFAULT_BRAND_PALETTE.color_charcoal,
      color_mint_cream: DEFAULT_BRAND_PALETTE.color_mint_cream,
      color_royal_gold: DEFAULT_BRAND_PALETTE.color_royal_gold,
      color_watermelon: DEFAULT_BRAND_PALETTE.color_watermelon,
      color_status_success: DEFAULT_BRAND_PALETTE.color_status_success,
      color_status_warning: DEFAULT_BRAND_PALETTE.color_status_warning,
      color_status_info: DEFAULT_BRAND_PALETTE.color_status_info,
      color_status_danger: DEFAULT_BRAND_PALETTE.color_status_danger,
      color_status_neutral: DEFAULT_BRAND_PALETTE.color_status_neutral,
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="h-4 w-4" /> Logo & favicon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AssetField
            label="Logo (light backgrounds)"
            hint="PNG, SVG, or WebP · headers, cards, public pages on light/cream backgrounds"
            url={logoUrl}
            onUrlChange={setLogoUrl}
            uploading={uploading === "logo-light"}
            onUpload={(f) => uploadAsset(f, "logo-light")}
            preview={
              logoUrl ? (
                <img src={logoUrl} alt="Light logo preview" className="h-16 w-16 rounded-xl border border-border bg-background object-contain p-1" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-background text-xs text-muted-foreground">Light</div>
              )
            }
          />
          <AssetField
            label="Logo (dark backgrounds)"
            hint="PNG, SVG, or WebP · sidebar, auth panels, and sections on dark/primary backgrounds"
            url={logoUrlDark}
            onUrlChange={setLogoUrlDark}
            uploading={uploading === "logo-dark"}
            onUpload={(f) => uploadAsset(f, "logo-dark")}
            preview={
              logoUrlDark ? (
                <img src={logoUrlDark} alt="Dark logo preview" className="h-16 w-16 rounded-xl border border-white/20 bg-hero-gradient object-contain p-1" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-hero-gradient text-xs text-white/70">Dark</div>
              )
            }
          />
          <AssetField
            label="Favicon"
            hint="ICO or PNG · browser tab icon"
            url={faviconUrl}
            onUrlChange={setFaviconUrl}
            uploading={uploading === "favicon"}
            onUpload={(f) => uploadAsset(f, "favicon")}
            preview={
              faviconUrl ? (
                <img src={faviconUrl} alt="Favicon preview" className="h-10 w-10 rounded border border-border object-contain p-0.5" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded border border-border text-xs text-muted-foreground">ICO</div>
              )
            }
          />
          {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-4 w-4" /> Color palette
          </CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={resetPalette}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset defaults
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLOR_FIELDS.map(({ key, label, hint }) => {
              const value = colors[key as keyof typeof colors];
              const invalid = !isValidHexColor(value);
              return (
                <div key={key} className="space-y-2 rounded-xl border border-border p-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={isValidHexColor(value) ? value : DEFAULT_BRAND_PALETTE[key as keyof BrandPalette] as string}
                      onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value.toUpperCase() }))}
                      className="h-10 w-10 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
                      aria-label={`${label} picker`}
                    />
                    <div className="min-w-0 flex-1">
                      <Label className="text-sm">{label}</Label>
                      <p className="text-xs text-muted-foreground">{hint}</p>
                    </div>
                  </div>
                  <Input
                    value={value}
                    onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value }))}
                    maxLength={7}
                    className={invalid ? "border-destructive" : ""}
                  />
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-border p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Live preview</p>
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="flex h-14 items-center gap-3 bg-hero-gradient px-4">
                {logoUrlDark || logoUrl ? (
                  <img src={logoUrlDark || logoUrl} alt="" className="h-8 w-8 rounded-lg object-contain" />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-gold-gradient" />
                )}
                <span className="text-sm text-white">Dark background (sidebar)</span>
              </div>
              <div className="flex h-14 items-center gap-3 border-t border-border bg-background px-4">
                {logoUrl || logoUrlDark ? (
                  <img src={logoUrl || logoUrlDark} alt="" className="h-8 w-8 rounded-lg object-contain" />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-gold-gradient" />
                )}
                <span className="text-sm text-foreground">Light background (public header)</span>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-border bg-background p-4">
                <span className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">Primary</span>
                <span className="rounded-md bg-gold-gradient px-3 py-1.5 text-xs text-ink">Gold accent</span>
                <span className="rounded-md bg-watermelon-gradient px-3 py-1.5 text-xs text-white">CTA</span>
                <span className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground">Muted</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-4 w-4" /> Status badge colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ERP/CRM-standard semantics used across applications, payments, maintenance, tenancies, and portal views.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STATUS_COLOR_FIELDS.map(({ key, semantic, hint }) => {
              const value = colors[key as keyof typeof colors];
              const invalid = !isValidHexColor(value);
              return (
                <div key={key} className="space-y-2 rounded-xl border border-border p-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={isValidHexColor(value) ? value : (DEFAULT_BRAND_PALETTE[key as keyof BrandPalette] as string)}
                      onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value.toUpperCase() }))}
                      className="h-10 w-10 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
                      aria-label={`${STATUS_SEMANTIC_LABELS[semantic]} picker`}
                    />
                    <div className="min-w-0 flex-1">
                      <Label className="text-sm">{STATUS_SEMANTIC_LABELS[semantic]}</Label>
                      <p className="text-xs text-muted-foreground">{hint}</p>
                    </div>
                  </div>
                  <Input
                    value={value}
                    onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value }))}
                    maxLength={7}
                    className={invalid ? "border-destructive" : ""}
                  />
                </div>
              );
            })}
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Status preview</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_PREVIEW_SAMPLES.map(({ status, semantic }) => (
                <StatusBadge key={status} status={status} semantic={semantic} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {mut.isError && <p className="text-sm text-destructive">{(mut.error as Error).message}</p>}
      {mut.isSuccess && <p className="text-sm text-primary">Branding saved — applied across the app.</p>}

      <Button onClick={() => mut.mutate()} disabled={mut.isPending}>
        {mut.isPending ? "Saving…" : "Save branding"}
      </Button>
    </div>
  );
}

function AssetField({
  label,
  hint,
  url,
  onUrlChange,
  onUpload,
  uploading,
  preview,
}: {
  label: string;
  hint: string;
  url: string;
  onUrlChange: (v: string) => void;
  onUpload: (file: File) => void;
  uploading: boolean;
  preview: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      {preview}
      <div className="min-w-0 flex-1 space-y-2">
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground">{hint}</p>
        <Input value={url} onChange={(e) => onUrlChange(e.target.value)} placeholder="https://… or upload below" />
        <div className="flex flex-wrap gap-2">
          <Label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent/20">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload file"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
                e.target.value = "";
              }}
            />
          </Label>
          {url && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onUrlChange("")}>
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
