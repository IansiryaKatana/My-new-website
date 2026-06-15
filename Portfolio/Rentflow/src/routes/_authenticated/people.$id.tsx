import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Phone, UserCheck, Globe } from "lucide-react";
import { StaffShell } from "@/components/staff-shell";
import { PageBack } from "@/components/page-back";
import { UserAvatar } from "@/components/user-avatar";
import { DocumentsList } from "@/components/documents-list";
import { MissingDocsMatrix } from "@/components/missing-docs-matrix";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getPerson360 } from "@/lib/people.functions";
import { formatAed, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/people/$id")({
  head: () => ({ meta: [{ title: "Person — Rentflow" }] }),
  component: PersonDetailPage,
});

function PersonDetailPage() {
  const { id } = Route.useParams();
  const fetch = useServerFn(getPerson360);
  const q = useQuery({ queryKey: ["person360", id], queryFn: () => fetch({ data: { id } }) });

  return (
    <StaffShell title="Person profile">
      <PageBack to="/tenants" label="Back to tenants" />

      {q.isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : q.isError ? (
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      ) : q.data ? (
        <PersonBody data={q.data} />
      ) : (
        <p className="text-sm text-muted-foreground">Person not found.</p>
      )}
    </StaffShell>
  );
}

type PersonData = Awaited<ReturnType<typeof getPerson360>>;

function PersonBody({ data }: { data: PersonData }) {
  const { profile, roles, applications, tenancies } = data;
  const allDocs = applications.flatMap((a) => a.documents);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
            <UserAvatar
              name={profile.full_name}
              email={profile.email}
              src={profile.avatar_url}
              className="h-20 w-20 text-lg"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-foreground">{profile.full_name ?? "Unnamed"}</h2>
                {roles.map((role) => (
                  <Badge key={role} variant="secondary" className="capitalize">{role}</Badge>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                {profile.email && <span className="flex items-center gap-2"><Mail className="h-4 w-4" />{profile.email}</span>}
                {profile.phone && <span className="flex items-center gap-2"><Phone className="h-4 w-4" />{profile.phone}</span>}
                {profile.emirates_id && <span className="flex items-center gap-2"><UserCheck className="h-4 w-4" />{profile.emirates_id}</span>}
                {profile.nationality && <span className="flex items-center gap-2"><Globe className="h-4 w-4" />{profile.nationality}</span>}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Member since {formatDate(profile.created_at)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Submitted documents</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <MissingDocsMatrix documents={allDocs} />
            <DocumentsList documents={allDocs} allowVerify invalidateKey={["person360"]} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Applications</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications.</p>
            ) : (
              applications.map((a) => (
                <Link
                  key={a.id}
                  to="/applications/$id"
                  params={{ id: a.id }}
                  className="flex flex-col gap-1 rounded-lg border border-border p-3 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-medium text-foreground">{a.property?.title ?? "Property"}</div>
                    <div className="text-xs text-muted-foreground">{a.property?.community} · {formatDate(a.created_at)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{formatAed(a.offer_amount)}</span>
                    <StatusBadge status={a.status} />
                    {a.documents.length > 0 && (
                      <Badge variant="outline">{a.documents.length} docs</Badge>
                    )}
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Tenancies</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {tenancies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tenancies.</p>
            ) : (
              tenancies.map((t) => (
                <Link
                  key={t.id}
                  to="/tenants/$id"
                  params={{ id: t.id }}
                  className="block rounded-lg border border-border p-3 text-sm hover:bg-muted/40"
                >
                  <div className="font-medium">{t.property?.title ?? "Property"}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(t.start_date)} → {formatDate(t.end_date)}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span>{formatAed(t.annual_rent)}/yr</span>
                    <StatusBadge status={t.status} />
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
