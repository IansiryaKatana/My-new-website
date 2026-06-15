import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AppRole = "owner" | "agent" | "tenant";

export type CurrentUser = {
  userId: string;
  email: string | null;
  profile: {
    id: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
  } | null;
  roles: AppRole[];
  isStaff: boolean;
};

export const getCurrentUser = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CurrentUser> => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: roleRows }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, phone, avatar_url, email").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    const roles = (roleRows ?? []).map((r) => r.role as AppRole);
    return {
      userId,
      email: profile?.email ?? null,
      profile: profile
        ? { id: profile.id, full_name: profile.full_name, phone: profile.phone, avatar_url: profile.avatar_url }
        : null,
      roles,
      isStaff: roles.includes("owner") || roles.includes("agent"),
    };
  });

export const bootstrapFirstOwner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase.rpc("bootstrap_first_owner");
    if (error) throw new Error(error.message);
    return { promoted: data === true };
  });
