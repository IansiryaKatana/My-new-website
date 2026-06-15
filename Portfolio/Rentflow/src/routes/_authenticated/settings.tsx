import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Building2, CreditCard, CheckCircle2, AlertCircle, Palette } from "lucide-react";
import { CommunicationsTab } from "@/components/settings/communications-tab";
import { TeamTab } from "@/components/settings/team-tab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffShell } from "@/components/staff-shell";
import { BrandingTab } from "@/components/settings/branding-tab";
import { getAgencySettings, updateAgencySettings } from "@/lib/agency.functions";
import {
  beginStripeConnectOnboarding,
  createStripeDashboardLink,
  refreshStripeConnectStatus,
  updateStripeCredentials,
} from "@/lib/stripe.functions";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Rentflow" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    stripe: typeof search.stripe === "string" ? search.stripe : undefined,
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { stripe, tab } = Route.useSearch();
  const fetch = useServerFn(getAgencySettings);
  const q = useQuery({ queryKey: ["agencySettings"], queryFn: () => fetch() });
  const defaultTab = tab ?? (stripe ? "stripe" : "agency");
  const tabCols = "grid w-full max-w-3xl grid-cols-2 sm:grid-cols-5";

  return (
    <StaffShell title="Settings">
      {q.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : q.isError ? (
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      ) : q.data ? (
        <Tabs defaultValue={defaultTab} key={defaultTab} className="space-y-6">
          <TabsList className={tabCols}>
            <TabsTrigger value="agency">Agency</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="stripe">Stripe</TabsTrigger>
          </TabsList>
          <TabsContent value="agency">
            <AgencyForm initial={q.data} />
          </TabsContent>
          <TabsContent value="branding">
            <BrandingTab initial={q.data} />
          </TabsContent>
          <TabsContent value="communications">
            <CommunicationsTab />
          </TabsContent>
          <TabsContent value="team">
            <TeamTab />
          </TabsContent>
          <TabsContent value="stripe">
            <StripeConnect initial={q.data} stripeReturn={stripe} />
          </TabsContent>
        </Tabs>
      ) : null}
    </StaffShell>
  );
}

type Settings = NonNullable<Awaited<ReturnType<typeof getAgencySettings>>>;

function AgencyForm({ initial }: { initial: Settings }) {
  const qc = useQueryClient();
  const update = useServerFn(updateAgencySettings);
  const [form, setForm] = useState({
    agency_name: initial.agency_name,
    legal_name: initial.legal_name ?? "",
    contact_email: initial.contact_email ?? "",
    contact_phone: initial.contact_phone ?? "",
    whatsapp_number: initial.whatsapp_number ?? "",
    address: initial.address ?? "",
    vat_number: initial.vat_number ?? "",
    trade_license: initial.trade_license ?? "",
    rera_number: initial.rera_number ?? "",
    ejari_contact: initial.ejari_contact ?? "",
    currency: initial.currency,
    default_agency_fee_pct: String(initial.default_agency_fee_pct),
    default_security_deposit_pct: String(initial.default_security_deposit_pct),
  });

  const mut = useMutation({
    mutationFn: () =>
      update({
        data: {
          agency_name: form.agency_name,
          legal_name: form.legal_name || null,
          contact_email: form.contact_email || null,
          contact_phone: form.contact_phone || null,
          whatsapp_number: form.whatsapp_number || null,
          address: form.address || null,
          vat_number: form.vat_number || null,
          trade_license: form.trade_license || null,
          rera_number: form.rera_number || null,
          ejari_contact: form.ejari_contact || null,
          currency: form.currency,
          default_agency_fee_pct: Number(form.default_agency_fee_pct) || 0,
          default_security_deposit_pct: Number(form.default_security_deposit_pct) || 0,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agencySettings"] });
      qc.invalidateQueries({ queryKey: ["publicBranding"] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-4 w-4" /> Agency profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Company details and defaults. Colors, logo and favicon are in the{" "}
          <span className="inline-flex items-center gap-1 text-foreground">
            <Palette className="h-3.5 w-3.5" /> Branding
          </span>{" "}
          tab.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Agency name">
            <Input value={form.agency_name} onChange={(e) => setForm({ ...form, agency_name: e.target.value })} maxLength={120} />
          </Field>
          <Field label="Legal name">
            <Input value={form.legal_name} onChange={(e) => setForm({ ...form, legal_name: e.target.value })} maxLength={200} />
          </Field>
          <Field label="Contact email">
            <Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} maxLength={255} />
          </Field>
          <Field label="Contact phone">
            <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} maxLength={40} />
          </Field>
          <Field label="WhatsApp">
            <Input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} maxLength={40} />
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} maxLength={500} />
          </Field>
          <Field label="Trade license">
            <Input value={form.trade_license} onChange={(e) => setForm({ ...form, trade_license: e.target.value })} maxLength={80} />
          </Field>
          <Field label="RERA number">
            <Input value={form.rera_number} onChange={(e) => setForm({ ...form, rera_number: e.target.value })} maxLength={80} />
          </Field>
          <Field label="VAT number">
            <Input value={form.vat_number} onChange={(e) => setForm({ ...form, vat_number: e.target.value })} maxLength={40} />
          </Field>
          <Field label="Ejari contact">
            <Input value={form.ejari_contact} onChange={(e) => setForm({ ...form, ejari_contact: e.target.value })} maxLength={200} />
          </Field>
          <Field label="Currency (3-letter)">
            <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} maxLength={3} />
          </Field>
          <Field label="Default agency fee %">
            <Input type="number" min={0} max={100} step="0.01" value={form.default_agency_fee_pct} onChange={(e) => setForm({ ...form, default_agency_fee_pct: e.target.value })} />
          </Field>
          <Field label="Default deposit %">
            <Input type="number" min={0} max={100} step="0.01" value={form.default_security_deposit_pct} onChange={(e) => setForm({ ...form, default_security_deposit_pct: e.target.value })} />
          </Field>
        </div>
        {mut.isError && (
          <p className="mt-3 text-sm text-destructive">{(mut.error as Error).message}</p>
        )}
        {mut.isSuccess && (
          <p className="mt-3 text-sm text-primary">Saved.</p>
        )}
        <div className="mt-4">
          <Button onClick={() => mut.mutate()} disabled={mut.isPending}>
            {mut.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type StripeSettings = Settings & {
  stripe_secret_key_configured?: boolean;
  stripe_webhook_secret_configured?: boolean;
  stripe_secret_key_preview?: string | null;
  stripe_webhook_secret_preview?: string | null;
};

function StripeConnect({ initial, stripeReturn }: { initial: StripeSettings; stripeReturn?: string }) {
  const qc = useQueryClient();
  const beginConnect = useServerFn(beginStripeConnectOnboarding);
  const refreshStatus = useServerFn(refreshStripeConnectStatus);
  const openDashboard = useServerFn(createStripeDashboardLink);
  const saveCredentials = useServerFn(updateStripeCredentials);
  const [actionError, setActionError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    stripe_secret_key: "",
    stripe_publishable_key: initial.stripe_publishable_key ?? "",
    stripe_webhook_secret: "",
    app_url: initial.app_url ?? "",
    stripe_country: initial.stripe_country ?? "AE",
  });

  const connected = initial.stripe_charges_enabled && !!initial.stripe_account_id;
  const onboardingStarted = !!initial.stripe_account_id;
  const platformReady =
    initial.stripe_secret_key_configured &&
    initial.stripe_webhook_secret_configured &&
    !!initial.stripe_publishable_key;

  const connectMut = useMutation({
    mutationFn: async () => {
      setActionError(null);
      const result = await beginConnect();
      window.location.href = result.url;
    },
    onError: (error) => setActionError((error as Error).message),
  });

  const refreshMut = useMutation({
    mutationFn: () => refreshStatus(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agencySettings"] });
      qc.invalidateQueries({ queryKey: ["publicPaymentsConfig"] });
    },
    onError: (error) => setActionError((error as Error).message),
  });

  const dashboardMut = useMutation({
    mutationFn: async () => {
      setActionError(null);
      const result = await openDashboard();
      window.location.href = result.url;
    },
    onError: (error) => setActionError((error as Error).message),
  });

  const credentialsMut = useMutation({
    mutationFn: () =>
      saveCredentials({
        data: {
          stripe_secret_key: credentials.stripe_secret_key.trim() || undefined,
          stripe_publishable_key: credentials.stripe_publishable_key.trim() || null,
          stripe_webhook_secret: credentials.stripe_webhook_secret.trim() || undefined,
          app_url: credentials.app_url.trim() || null,
          stripe_country: credentials.stripe_country.toUpperCase(),
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agencySettings"] });
      qc.invalidateQueries({ queryKey: ["publicPaymentsConfig"] });
      setCredentials((prev) => ({ ...prev, stripe_secret_key: "", stripe_webhook_secret: "" }));
    },
    onError: (error) => setActionError((error as Error).message),
  });

  useEffect(() => {
    setCredentials((prev) => ({
      ...prev,
      stripe_publishable_key: initial.stripe_publishable_key ?? "",
      app_url: initial.app_url ?? "",
      stripe_country: initial.stripe_country ?? "AE",
    }));
  }, [initial.stripe_publishable_key, initial.app_url, initial.stripe_country]);

  useEffect(() => {
    if (stripeReturn === "return" || stripeReturn === "refresh") {
      refreshMut.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeReturn]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4" /> Platform credentials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Paste your Stripe platform keys here when you duplicate this app for a new client. No code or{" "}
            <code className="text-foreground">.env</code> edits required — each deployment reads from this database.
          </p>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {platformReady ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <StatusBadge status="connected" label="Platform keys saved" semantic="success" />
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <StatusBadge status="pending" label="Add platform keys to enable payments" />
              </>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Secret key (sk_…)">
              <Input
                type="password"
                value={credentials.stripe_secret_key}
                onChange={(e) => setCredentials({ ...credentials, stripe_secret_key: e.target.value })}
                placeholder={initial.stripe_secret_key_preview ?? "sk_live_… or sk_test_…"}
                autoComplete="off"
              />
            </Field>
            <Field label="Publishable key (pk_…)">
              <Input
                value={credentials.stripe_publishable_key}
                onChange={(e) => setCredentials({ ...credentials, stripe_publishable_key: e.target.value })}
                placeholder="pk_live_… or pk_test_…"
                autoComplete="off"
              />
            </Field>
            <Field label="Webhook secret (whsec_…)">
              <Input
                type="password"
                value={credentials.stripe_webhook_secret}
                onChange={(e) => setCredentials({ ...credentials, stripe_webhook_secret: e.target.value })}
                placeholder={initial.stripe_webhook_secret_preview ?? "whsec_…"}
                autoComplete="off"
              />
            </Field>
            <Field label="App URL (production domain)">
              <Input
                value={credentials.app_url}
                onChange={(e) => setCredentials({ ...credentials, app_url: e.target.value })}
                placeholder="https://your-client-domain.com"
              />
            </Field>
            <Field label="Connect country (ISO-2)">
              <Input
                value={credentials.stripe_country}
                onChange={(e) => setCredentials({ ...credentials, stripe_country: e.target.value.toUpperCase() })}
                maxLength={2}
              />
            </Field>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Leave secret fields blank to keep existing values. Register webhook{" "}
            <code className="text-foreground">/api/stripe/webhook</code> in Stripe for{" "}
            <code className="text-foreground">checkout.session.completed</code>,{" "}
            <code className="text-foreground">checkout.session.async_payment_succeeded</code>, and{" "}
            <code className="text-foreground">account.updated</code>.
          </p>
          <div className="mt-4">
            <Button onClick={() => credentialsMut.mutate()} disabled={credentialsMut.isPending}>
              {credentialsMut.isPending ? "Saving…" : "Save credentials"}
            </Button>
            {credentialsMut.isSuccess && (
              <span className="ml-3 text-sm text-primary">Credentials saved.</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4" /> Stripe Connect
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {connected ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <StatusBadge status="connected" label="Ready to accept payments" semantic="success" />
              </>
            ) : onboardingStarted ? (
              <>
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <StatusBadge status="in_progress" label="Onboarding in progress" />
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <StatusBadge status="disconnected" label="Not connected" />
              </>
            )}
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            After platform keys are saved, connect the agency&apos;s Stripe account so tenants and website clients can pay
            rent, deposits and renewals online.
          </p>
          {initial.stripe_account_id && (
            <div className="mb-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
              <div className="text-muted-foreground">Connected account</div>
              <div className="font-mono text-foreground">{initial.stripe_account_id}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Charges {initial.stripe_charges_enabled ? "enabled" : "disabled"} · Payouts{" "}
                {initial.stripe_payouts_enabled ? "enabled" : "disabled"} · {initial.stripe_country ?? "AE"}
              </div>
            </div>
          )}
          {actionError && <p className="mb-3 text-sm text-destructive">{actionError}</p>}
          {refreshMut.isSuccess && stripeReturn && (
            <p className="mb-3 text-sm text-primary">Stripe status updated.</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => connectMut.mutate()}
              disabled={connectMut.isPending || refreshMut.isPending || !platformReady}
            >
              {connectMut.isPending
                ? "Opening Stripe…"
                : connected
                  ? "Update Stripe details"
                  : "Connect with Stripe"}
            </Button>
            <Button
              variant="outline"
              onClick={() => refreshMut.mutate()}
              disabled={refreshMut.isPending || !onboardingStarted}
            >
              {refreshMut.isPending ? "Refreshing…" : "Refresh status"}
            </Button>
            {onboardingStarted && (
              <Button variant="outline" onClick={() => dashboardMut.mutate()} disabled={dashboardMut.isPending}>
                {dashboardMut.isPending ? "Opening…" : "Stripe dashboard"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
