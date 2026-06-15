import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Eye } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StaffShell } from "@/components/staff-shell";
import { UserAvatar } from "@/components/user-avatar";
import { ApplicationPreviewSheet } from "@/components/application-preview-sheet";
import {
  listApplications,
  updateApplicationStatus,
} from "@/lib/applications.functions";
import { formatAed, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/applications/")({
  head: () => ({ meta: [{ title: "Applications — Rental OS" }] }),
  component: ApplicationsPage,
});

const stages = [
  { key: "submitted", label: "Submitted" },
  { key: "docs_review", label: "Docs Review" },
  { key: "contract_sent", label: "Contract Sent" },
  { key: "approved", label: "Approved" },
] as const;

type Stage = (typeof stages)[number]["key"];

function ApplicationsPage() {
  const fetch = useServerFn(listApplications);
  const q = useQuery({ queryKey: ["applications"], queryFn: () => fetch() });
  const [previewId, setPreviewId] = useState<string | null>(null);

  return (
    <StaffShell title="Applications">
      {q.isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : q.isError ? (
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((s) => (
            <Column
              key={s.key}
              stage={s.key}
              label={s.label}
              items={(q.data ?? []).filter((a) => a.status === s.key)}
              onPreview={setPreviewId}
            />
          ))}
        </div>
      )}

      {previewId && <ApplicationPreviewSheet applicationId={previewId} onClose={() => setPreviewId(null)} />}
    </StaffShell>
  );
}

function Column({
  stage,
  label,
  items,
  onPreview,
}: {
  stage: Stage;
  label: string;
  items: NonNullable<Awaited<ReturnType<typeof listApplications>>>;
  onPreview: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <StatusBadge status={stage} label={String(items.length)} />
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
            Empty
          </p>
        ) : (
          items.map((a) => <ApplicationCard key={a.id} app={a} currentStage={stage} onPreview={onPreview} />)
        )}
      </div>
    </div>
  );
}

function ApplicationCard({
  app,
  currentStage,
  onPreview,
}: {
  app: NonNullable<Awaited<ReturnType<typeof listApplications>>>[number];
  currentStage: Stage;
  onPreview: (id: string) => void;
}) {
  const qc = useQueryClient();
  const update = useServerFn(updateApplicationStatus);
  const mut = useMutation({
    mutationFn: (status: string) => update({ data: { id: app.id, status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });

  const nextIdx = stages.findIndex((s) => s.key === currentStage) + 1;
  const next = stages[nextIdx];

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <UserAvatar
            name={app.profiles?.full_name}
            email={app.profiles?.email}
            src={app.profiles?.avatar_url}
            className="h-8 w-8 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <Link to="/applications/$id" params={{ id: app.id }} className="block text-sm text-card-foreground hover:underline">
              {app.profiles?.full_name ?? "Tenant"}
            </Link>
            <div className="text-xs text-muted-foreground">
              {app.properties?.title ?? "Property"} · {app.properties?.community ?? ""}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{formatDate(app.created_at)}</span>
              <span className="text-foreground">{formatAed(Number(app.offer_amount))}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onPreview(app.id)}>
            <Eye className="mr-1 h-3.5 w-3.5" /> Preview
          </Button>
          {next && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => mut.mutate(next.key)}
              disabled={mut.isPending}
            >
              →
            </Button>
          )}
          {currentStage !== "approved" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => mut.mutate("rejected")}
              disabled={mut.isPending}
            >
              Reject
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
