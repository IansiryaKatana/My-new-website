import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, UserCog } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth/AuthProvider";

export const Route = createFileRoute("/_app/admin/users")({
  head: () => ({ meta: [{ title: "Users & Roles — Staffing OS" }] }),
  component: UsersPage,
});

import { ALL_ROLES, type AppRole } from "@/lib/roles";

type Row = {
  id: string;
  email: string | null;
  full_name: string | null;
  job_title: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  roles: AppRole[];
  client_id: string | null;
  agent_id: string | null;
};

function UsersPage() {
  const { user, hasRole } = useAuth();
  const qc = useQueryClient();
  const isAdmin = hasRole("admin");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const [{ data: profiles, error: pe }, { data: roles, error: re }] = await Promise.all([
        supabase.from("profiles").select("id, email, full_name, job_title, avatar_url, is_active, created_at, client_id, agent_id").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (pe) throw pe;
      if (re) throw re;
      const rolesByUser = new Map<string, AppRole[]>();
      for (const r of (roles ?? []) as { user_id: string; role: AppRole }[]) {
        const arr = rolesByUser.get(r.user_id) ?? [];
        arr.push(r.role);
        rolesByUser.set(r.user_id, arr);
      }
      return (profiles ?? []).map((p) => ({ ...(p as Omit<Row, "roles">), roles: rolesByUser.get(p.id) ?? [] })) as Row[];
    },
  });

  const { data: agents } = useQuery({
    queryKey: ["agents-lite"],
    queryFn: async () => (await supabase.from("recruitment_agents").select("id, name").order("name")).data ?? [],
  });

  const { data: clients } = useQuery({
    queryKey: ["clients-lite"],
    queryFn: async () => (await supabase.from("clients").select("id, legal_name").order("legal_name")).data ?? [],
  });

  const linkAgent = useMutation({
    mutationFn: async ({ userId, agentId }: { userId: string; agentId: string | null }) => {
      const { error } = await supabase.from("profiles").update({ agent_id: agentId } as never).eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Agent link updated");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const linkClient = useMutation({
    mutationFn: async ({ userId, clientId }: { userId: string; clientId: string | null }) => {
      const { error } = await supabase.from("profiles").update({ client_id: clientId } as never).eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Client link updated");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleRole = useMutation({
    mutationFn: async ({ userId, role, on }: { userId: string; role: AppRole; on: boolean }) => {
      if (on) {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
        if (error && !error.message.includes("duplicate")) throw error;
      } else {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Roles updated");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Administration"
        title="Users & roles"
        description="Manage who has access to your workspace and what they can do."
      />

      {!isAdmin && (
        <Card className="border-warning/30 bg-warning/10 p-4 text-sm text-muted-foreground">
          Only admins can change roles. You can view this page in read-only mode.
        </Card>
      )}

      <Card className="table-shell">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : !data?.length ? (
          <div className="p-6"><EmptyState icon={UserCog} title="No users yet" description="Invite teammates by sharing the sign-up URL — they'll appear here." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Job title</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="w-32 text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((u) => {
                const initials = (u.full_name ?? u.email ?? "U").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback></Avatar>
                        <div>
                          <div className="font-medium">{u.full_name ?? "Unnamed"}{u.id === user?.id && <span className="ml-2 text-[10px] text-muted-foreground">(you)</span>}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{u.job_title ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length ? u.roles.map((r) => (
                          <Badge key={r} variant={r === "admin" ? "default" : "secondary"} className="capitalize">{r}</Badge>
                        )) : <span className="text-xs text-muted-foreground">No roles</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {isAdmin && (
                        <div className="mb-2 flex max-w-[200px] flex-col gap-2">
                          {u.roles.includes("client") && (
                            <Select value={u.client_id ?? "none"} onValueChange={(v) => linkClient.mutate({ userId: u.id, clientId: v === "none" ? null : v })}>
                              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Link client" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No client</SelectItem>
                                {(clients ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.legal_name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          )}
                          <Select value={u.agent_id ?? "none"} onValueChange={(v) => linkAgent.mutate({ userId: u.id, agentId: v === "none" ? null : v })}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Link agent" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No agent</SelectItem>
                              {(agents ?? []).map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" disabled={!isAdmin}>
                            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Roles
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Toggle roles</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {ALL_ROLES.map((r) => {
                            const has = u.roles.includes(r);
                            return (
                              <DropdownMenuCheckboxItem
                                key={r}
                                checked={has}
                                onCheckedChange={(c) => toggleRole.mutate({ userId: u.id, role: r, on: !!c })}
                                onSelect={(e) => e.preventDefault()}
                                className="capitalize"
                              >
                                {r}
                              </DropdownMenuCheckboxItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
