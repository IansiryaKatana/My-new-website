import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LogOut } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageBack } from "@/components/page-back";
import { NotificationBell } from "@/components/notification-bell";
import { UserAvatar } from "@/components/user-avatar";
import { FileUploadField } from "@/components/file-upload-field";
import { getTenantHome } from "@/lib/tenant.functions";
import { updateProfile } from "@/lib/profile.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/portal/profile")({
  head: () => ({ meta: [{ title: "Profile — Rentflow" }] }),
  component: PortalProfilePage,
});

function PortalProfilePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetch = useServerFn(getTenantHome);
  const save = useServerFn(updateProfile);
  const q = useQuery({ queryKey: ["tenant-home"], queryFn: () => fetch() });

  const profile = q.data?.profile;
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [emiratesId, setEmiratesId] = useState("");
  const [nationality, setNationality] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loaded, setLoaded] = useState(false);

  if (profile && !loaded) {
    setFullName(profile.full_name ?? "");
    setPhone(profile.phone ?? "");
    setEmiratesId(profile.emirates_id ?? "");
    setNationality(profile.nationality ?? "");
    setAvatarUrl(profile.avatar_url ?? "");
    setLoaded(true);
  }

  const mut = useMutation({
    mutationFn: () =>
      save({
        data: {
          full_name: fullName,
          phone: phone || null,
          emirates_id: emiratesId || null,
          nationality: nationality || null,
          avatar_url: avatarUrl || null,
        },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tenant-home"] }),
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/portal"><BrandLogo size="md" /></Link>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Button variant="ghost" size="sm" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-8">
        <PageBack to="/portal" label="Back to portal" />
        <Card>
          <CardHeader><CardTitle className="text-base">Your profile</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 sm:col-span-2">
              <UserAvatar name={fullName} email={profile?.email} src={avatarUrl} className="h-16 w-16" />
              <div className="flex-1">
                <FileUploadField
                  label="Profile photo"
                  bucket="branding"
                  pathPrefix={`avatars/${profile?.id ?? "me"}`}
                  value={avatarUrl}
                  onChange={setAvatarUrl}
                  accept="image/*"
                  hint="Shown to your agency when reviewing applications."
                />
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Email</Label>
              <Input value={profile?.email ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={120} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} />
            </div>
            <div className="space-y-1.5">
              <Label>Emirates ID</Label>
              <Input value={emiratesId} onChange={(e) => setEmiratesId(e.target.value)} maxLength={40} />
            </div>
            <div className="space-y-1.5">
              <Label>Nationality</Label>
              <Input value={nationality} onChange={(e) => setNationality(e.target.value)} maxLength={80} />
            </div>
            {mut.isSuccess && <p className="text-sm text-primary sm:col-span-2">Saved.</p>}
            <Button onClick={() => mut.mutate()} disabled={mut.isPending} className="w-fit sm:col-span-2">
              {mut.isPending ? "Saving…" : "Save profile"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
