import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, AlertCircle, Mail, FileText, Send, Variable } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TEMPLATE_VARIABLES_HELP } from "@/lib/template-vars";
import {
  getCommunicationsSettings,
  sendTestEmail,
  updateContractTemplate,
  updateEmailTemplate,
  updateResendCredentials,
} from "@/lib/communications.functions";

type CommsSettings = NonNullable<Awaited<ReturnType<typeof getCommunicationsSettings>>>;

export function CommunicationsTab() {
  const qc = useQueryClient();
  const fetch = useServerFn(getCommunicationsSettings);
  const q = useQuery({ queryKey: ["communicationsSettings"], queryFn: () => fetch() });

  if (q.isLoading) return <p className="text-sm text-muted-foreground">Loading communications…</p>;
  if (q.isError) return <p className="text-sm text-destructive">{(q.error as Error).message}</p>;
  if (!q.data) return null;

  return (
    <div className="space-y-6">
      <ResendCredentialsCard initial={q.data} />
      <Tabs defaultValue="email" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="email">Email templates</TabsTrigger>
          <TabsTrigger value="contract">Contract templates</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <EmailTemplatesEditor templates={q.data.email_templates} />
        </TabsContent>
        <TabsContent value="contract">
          <ContractTemplatesEditor templates={q.data.contract_templates} />
        </TabsContent>
      </Tabs>
      <VariablesReference />
    </div>
  );
}

function ResendCredentialsCard({ initial }: { initial: CommsSettings }) {
  const qc = useQueryClient();
  const save = useServerFn(updateResendCredentials);
  const test = useServerFn(sendTestEmail);
  const [apiKey, setApiKey] = useState("");
  const [fromEmail, setFromEmail] = useState(initial.resend_from_email);
  const [fromName, setFromName] = useState(initial.resend_from_name);
  const [replyTo, setReplyTo] = useState(initial.resend_reply_to);
  const [testTo, setTestTo] = useState(fromEmail);
  const [error, setError] = useState<string | null>(null);

  const saveMut = useMutation({
    mutationFn: () =>
      save({
        data: {
          resend_api_key: apiKey.trim() || undefined,
          resend_from_email: fromEmail.trim() || null,
          resend_from_name: fromName.trim() || null,
          resend_reply_to: replyTo.trim() || null,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["communicationsSettings"] });
      qc.invalidateQueries({ queryKey: ["agencySettings"] });
      setApiKey("");
      setError(null);
    },
    onError: (e) => setError((e as Error).message),
  });

  const testMut = useMutation({
    mutationFn: () => test({ data: { to: testTo } }),
    onError: (e) => setError((e as Error).message),
  });

  useEffect(() => {
    setFromEmail(initial.resend_from_email);
    setFromName(initial.resend_from_name);
    setReplyTo(initial.resend_reply_to);
  }, [initial.resend_from_email, initial.resend_from_name, initial.resend_reply_to]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail className="h-4 w-4" /> Resend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Plug in your agency&apos;s Resend account. Emails and contract PDFs use these credentials — duplicate the app
          for a new client and paste their keys here.
        </p>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {initial.resend_configured ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <StatusBadge status="connected" label="Ready to send" semantic="success" />
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <StatusBadge status="pending" label="Add API key and from email" />
            </>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="API key (re_…)">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={initial.resend_api_key_preview ?? "re_…"}
              autoComplete="off"
            />
          </Field>
          <Field label="From email (verified in Resend)">
            <Input type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} placeholder="leases@youragency.ae" />
          </Field>
          <Field label="From name">
            <Input value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Your Agency" />
          </Field>
          <Field label="Reply-to email">
            <Input type="email" value={replyTo} onChange={(e) => setReplyTo(e.target.value)} placeholder="Optional" />
          </Field>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending ? "Saving…" : "Save Resend settings"}
          </Button>
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-1.5">
            <Label>Send test email to</Label>
            <Input type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
          </div>
          <Button variant="outline" onClick={() => testMut.mutate()} disabled={testMut.isPending || !initial.resend_configured}>
            <Send className="mr-2 h-4 w-4" />
            {testMut.isPending ? "Sending…" : "Send test"}
          </Button>
        </div>
        {testMut.isSuccess && <p className="mt-2 text-sm text-primary">Test email sent.</p>}
      </CardContent>
    </Card>
  );
}

type EmailTemplate = CommsSettings["email_templates"][number];

function EmailTemplatesEditor({ templates }: { templates: EmailTemplate[] }) {
  const qc = useQueryClient();
  const save = useServerFn(updateEmailTemplate);
  const [activeId, setActiveId] = useState(templates[0]?.id ?? "");
  const active = templates.find((t) => t.id === activeId) ?? templates[0];
  const [subject, setSubject] = useState(active?.subject ?? "");
  const [body, setBody] = useState(active?.body_html ?? "");
  const [enabled, setEnabled] = useState(active?.enabled ?? true);

  useEffect(() => {
    if (!active) return;
    setSubject(active.subject);
    setBody(active.body_html);
    setEnabled(active.enabled);
  }, [active?.id, active?.subject, active?.body_html, active?.enabled]);

  const mut = useMutation({
    mutationFn: () => save({ data: { id: active!.id, subject, body_html: body, enabled } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["communicationsSettings"] }),
  });

  if (!active) return <p className="text-sm text-muted-foreground">No email templates found.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Email templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <Button key={t.id} size="sm" variant={t.id === active.id ? "default" : "outline"} onClick={() => setActiveId(t.id)}>
              {t.name}
            </Button>
          ))}
        </div>
        {active.description && <p className="text-sm text-muted-foreground">{active.description}</p>}
        <Field label="Subject">
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={300} />
        </Field>
        <Field label="Body (HTML)">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={12} className="font-mono text-xs" />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          Enabled
        </label>
        <Button onClick={() => mut.mutate()} disabled={mut.isPending}>
          {mut.isPending ? "Saving…" : "Save template"}
        </Button>
        {mut.isSuccess && <span className="ml-2 text-sm text-primary">Saved.</span>}
      </CardContent>
    </Card>
  );
}

type ContractTemplate = CommsSettings["contract_templates"][number];

function ContractTemplatesEditor({ templates }: { templates: ContractTemplate[] }) {
  const qc = useQueryClient();
  const save = useServerFn(updateContractTemplate);
  const [activeId, setActiveId] = useState(templates[0]?.id ?? "");
  const active = templates.find((t) => t.id === activeId) ?? templates[0];
  const [body, setBody] = useState(active?.body_html ?? "");

  useEffect(() => {
    if (active) setBody(active.body_html);
  }, [active?.id, active?.body_html]);

  const mut = useMutation({
    mutationFn: () => save({ data: { id: active!.id, body_html: body } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["communicationsSettings"] }),
  });

  if (!active) return <p className="text-sm text-muted-foreground">No contract templates found.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" /> Contract templates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <Button key={t.id} size="sm" variant={t.id === active.id ? "default" : "outline"} onClick={() => setActiveId(t.id)}>
              {t.name}
              {t.is_default && <Badge className="ml-2" variant="secondary">Default</Badge>}
            </Button>
          ))}
        </div>
        {active.description && <p className="text-sm text-muted-foreground">{active.description}</p>}
        <Field label="Contract body (HTML) — merged into PDF">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={16} className="font-mono text-xs" />
        </Field>
        <Button onClick={() => mut.mutate()} disabled={mut.isPending}>
          {mut.isPending ? "Saving…" : "Save contract template"}
        </Button>
        {mut.isSuccess && <span className="ml-2 text-sm text-primary">Saved.</span>}
      </CardContent>
    </Card>
  );
}

function VariablesReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Variable className="h-4 w-4" /> Merge fields
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-muted-foreground">
          Use <code className="text-foreground">{"{{variable_name}}"}</code> in subjects, email bodies, and contract templates.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_VARIABLES_HELP.map((v) => (
            <div key={v.key} className="rounded-lg border border-border px-3 py-2 text-sm">
              <code className="text-foreground">{`{{${v.key}}}`}</code>
              <p className="text-xs text-muted-foreground">{v.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
