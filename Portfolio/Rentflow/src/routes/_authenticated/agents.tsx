import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { UserCog } from "lucide-react";
import { StaffShell } from "@/components/staff-shell";
import { UserAvatar } from "@/components/user-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listStaffDirectory } from "@/lib/team.functions";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/agents")({
  head: () => ({ meta: [{ title: "Agents — Rentflow" }] }),
  component: AgentsPage,
});

function AgentsPage() {
  const fetch = useServerFn(listStaffDirectory);
  const q = useQuery({ queryKey: ["staffDirectory"], queryFn: () => fetch() });

  return (
    <StaffShell title="Agents & team">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Owners and agents who manage properties, applications, and tenants.</p>
        <Button variant="outline" asChild>
          <Link to="/settings" search={{ tab: "team" }}>Manage roles in Settings</Link>
        </Button>
      </div>

      {q.isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : q.isError ? (
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(q.data ?? []).map((member) => {
            const profile = member.profiles as {
              id?: string;
              full_name?: string | null;
              email?: string | null;
              phone?: string | null;
              avatar_url?: string | null;
            } | null;
            return (
              <Card key={member.user_id}>
                <CardContent className="flex items-start gap-3 p-4">
                  <UserAvatar
                    name={profile?.full_name}
                    email={profile?.email}
                    src={profile?.avatar_url}
                    className="h-12 w-12"
                  />
                  <div className="min-w-0 flex-1">
                    {profile?.id ? (
                      <Link to="/people/$id" params={{ id: profile.id }} className="font-medium text-foreground hover:underline">
                        {profile.full_name ?? profile.email ?? "Team member"}
                      </Link>
                    ) : (
                      <div className="font-medium">{profile?.full_name ?? "Team member"}</div>
                    )}
                    <p className="truncate text-xs text-muted-foreground">{profile?.email}</p>
                    {profile?.phone && <p className="text-xs text-muted-foreground">{profile.phone}</p>}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant={member.role === "owner" ? "default" : "secondary"} className="capitalize gap-1">
                        <UserCog className="h-3 w-3" /> {member.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Since {formatDate(member.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </StaffShell>
  );
}
