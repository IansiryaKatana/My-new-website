import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { assignUserRole, listTeamMembers } from "@/lib/team.functions";

export function TeamTab() {
  const qc = useQueryClient();
  const fetch = useServerFn(listTeamMembers);
  const assign = useServerFn(assignUserRole);
  const q = useQuery({ queryKey: ["team"], queryFn: () => fetch() });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "agent" | "tenant">("agent");

  const mut = useMutation({
    mutationFn: () => assign({ data: { email, role } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["team"] });
      setEmail("");
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" /> Team members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Assign roles to users who have already signed up. They must create an account first.
          </p>
          {q.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : q.data && q.data.length > 0 ? (
            <ul className="mb-6 divide-y divide-border">
              {q.data.map((m) => {
                const profile = m.profiles as { full_name?: string; email?: string } | null;
                return (
                  <li key={m.user_id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <div className="font-medium">{profile?.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{profile?.email}</div>
                    </div>
                    <Badge className="capitalize">{m.role}</Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mb-6 text-sm text-muted-foreground">No team members yet.</p>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>User email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="agent@agency.ae" />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {mut.isError && <p className="mt-2 text-sm text-destructive">{(mut.error as Error).message}</p>}
          <Button className="mt-4" onClick={() => mut.mutate()} disabled={mut.isPending || !email}>
            {mut.isPending ? "Assigning…" : "Assign role"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
