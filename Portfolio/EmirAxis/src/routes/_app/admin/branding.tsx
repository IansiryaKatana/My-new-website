import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Type } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaInput } from "@/components/ui/media-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useBranding } from "@/lib/branding/BrandingProvider";

export const Route = createFileRoute("/_app/admin/branding")({
  head: () => ({ meta: [{ title: "Branding — Admin" }] }),
  component: BrandingAdmin,
});

const GOOGLE_FONTS = [
  "Geist",
  "Inter",
  "Manrope",
  "DM Sans",
  "Outfit",
  "Plus Jakarta Sans",
  "Space Grotesk",
  "Work Sans",
  "Sora",
  "Urbanist",
  "Figtree",
  "Instrument Serif",
  "Cormorant Garamond",
  "Lora",
  "Playfair Display",
  "JetBrains Mono",
] as const;

function BrandingAdmin() {
  const { hasRole } = useAuth();
  const { branding, refresh } = useBranding();
  const [form, setForm] = useState(branding);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(branding); }, [branding]);

  if (!hasRole("admin")) {
    return (
      <Card className="p-8 text-center">
        <h2 className="font-display text-2xl text-primary">Admin only</h2>
        <p className="mt-2 text-sm text-muted-foreground">You need the admin role to manage branding.</p>
      </Card>
    );
  }

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("branding_settings").update({
      company_name: form.company_name,
      short_name: form.short_name,
      tagline: form.tagline,
      primary_color: form.primary_color,
      accent_color: form.accent_color,
      background_color: form.background_color,
      foreground_color: form.foreground_color,
      support_email: form.support_email,
      support_phone: form.support_phone,
      logo_url: form.logo_url,
      logo_dark_url: form.logo_dark_url,
      favicon_url: form.favicon_url,
      font_family: form.font_family,
      font_display_family: form.font_display_family,
      font_weights: form.font_weights,
    }).eq("singleton", true);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Branding updated");
    await refresh();
  };

  return (
    <div className="page-stack">
      <header className="min-w-0 border-b border-border/60 pb-5">
        <h1 className="break-words font-display text-2xl text-primary sm:text-3xl lg:text-4xl">Branding & White-label</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">Rebrand the entire platform — name, logo, fonts and colors. Changes apply instantly.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-base font-semibold">Identity</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Company name"><Input value={form.company_name} onChange={(e) => update("company_name", e.target.value)} /></Field>
            <Field label="Short name (logo letter)"><Input value={form.short_name} onChange={(e) => update("short_name", e.target.value)} /></Field>
            <Field label="Tagline" className="sm:col-span-2">
              <Textarea rows={2} value={form.tagline ?? ""} onChange={(e) => update("tagline", e.target.value)} />
            </Field>

            <Field label="Logo (light backgrounds)" className="sm:col-span-2">
              <MediaInput value={form.logo_url} onChange={(v) => update("logo_url", v)} pathPrefix="logos" />
            </Field>
            <Field label="Logo (dark backgrounds)" className="sm:col-span-2">
              <MediaInput value={form.logo_dark_url} onChange={(v) => update("logo_dark_url", v)} pathPrefix="logos" />
            </Field>
            <Field label="Favicon" className="sm:col-span-2">
              <MediaInput value={form.favicon_url} onChange={(v) => update("favicon_url", v)} pathPrefix="favicons" accept="image/png,image/x-icon,image/svg+xml" maxSizeMB={1} />
            </Field>

            <Field label="Support email"><Input type="email" value={form.support_email ?? ""} onChange={(e) => update("support_email", e.target.value)} /></Field>
            <Field label="Support phone"><Input value={form.support_phone ?? ""} onChange={(e) => update("support_phone", e.target.value)} /></Field>
          </div>

          <h2 className="mt-8 flex items-center gap-2 text-base font-semibold"><Type className="h-4 w-4" /> Typography</h2>
          <p className="mt-1 text-xs text-muted-foreground">Powered by Google Fonts. All weights cap at <strong>Light 300</strong> system-wide.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Body font">
              <Select value={form.font_family} onValueChange={(v) => update("font_family", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GOOGLE_FONTS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Display / heading font">
              <Select value={form.font_display_family} onValueChange={(v) => update("font_display_family", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GOOGLE_FONTS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Weights (semicolon-separated, ≤ 300)" className="sm:col-span-2">
              <Input value={form.font_weights} onChange={(e) => update("font_weights", e.target.value)} placeholder="100;200;300" />
            </Field>
          </div>

          <h2 className="mt-8 text-base font-semibold">Theme tokens</h2>
          <p className="mt-1 text-xs text-muted-foreground">Use oklch() format. Changes update CSS variables live.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Primary (navy)"><Input value={form.primary_color} onChange={(e) => update("primary_color", e.target.value)} /></Field>
            <Field label="Accent (gold)"><Input value={form.accent_color} onChange={(e) => update("accent_color", e.target.value)} /></Field>
            <Field label="Background"><Input value={form.background_color} onChange={(e) => update("background_color", e.target.value)} /></Field>
            <Field label="Foreground"><Input value={form.foreground_color} onChange={(e) => update("foreground_color", e.target.value)} /></Field>
          </div>

          <div className="mt-8 flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setForm(branding)}>Reset</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
              <Save className="mr-1.5 h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b bg-muted/30 p-4 text-sm">Live preview</div>
          <div className="space-y-4 p-6" style={{ fontFamily: `"${form.font_family}", system-ui, sans-serif` }}>
            <div className="rounded-xl bg-gradient-primary p-5 text-primary-foreground">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-lg bg-gold text-gold-foreground">
                  {form.logo_url ? (
                    <img src={form.logo_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display text-lg" style={{ fontFamily: `"${form.font_display_family}"` }}>
                      {form.short_name.charAt(0) || "?"}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm">{form.company_name || "Company"}</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-60">Operations</div>
                </div>
              </div>
              <p className="mt-4 text-xs opacity-80">{form.tagline}</p>
            </div>
            <div style={{ fontFamily: `"${form.font_display_family}"` }} className="text-3xl text-primary">The quick brown fox</div>
            <div className="text-sm text-muted-foreground">jumps over the lazy dog — body text sample at light 300.</div>
            <Button className="w-full bg-primary hover:bg-primary/90">Primary action</Button>
            <Button variant="outline" className="w-full">Secondary</Button>
            <div className="flex items-center gap-2">
              {[form.primary_color, form.accent_color, form.background_color, form.foreground_color].map((c, i) => (
                <div key={i} className="h-8 w-8 rounded-md border" style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
