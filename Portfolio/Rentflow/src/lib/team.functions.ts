import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertOwner } from "@/lib/auth.server";

export const listTeamMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertOwner(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role, created_at, profiles(id, full_name, email, phone, avatar_url)")
      .in("role", ["owner", "agent"])
      .order("created_at");
    if (error) throw new Error(error.message);
    return roles ?? [];
  });

export const assignUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      email: z.string().email(),
      role: z.enum(["owner", "agent", "tenant"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertOwner(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email")
      .eq("email", data.email.trim().toLowerCase())
      .maybeSingle();
    if (profileError) throw new Error(profileError.message);
    if (!profile) throw new Error("No user found with that email. They must sign up first.");

    await supabaseAdmin.from("user_roles").delete().eq("user_id", profile.id).in("role", ["owner", "agent", "tenant"]);
    const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: profile.id, role: data.role });
    if (error) throw new Error(error.message);

    return { ok: true, user_id: profile.id };
  });

export const listStaffDirectory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("user_id, role, created_at, profiles(id, full_name, email, phone, avatar_url)")
      .in("role", ["owner", "agent"])
      .order("created_at");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listStaffAgents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("user_id, role, profiles(id, full_name, email)")
      .in("role", ["owner", "agent"]);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.user_id,
      role: r.role,
      full_name: (r.profiles as { full_name?: string } | null)?.full_name ?? null,
      email: (r.profiles as { email?: string } | null)?.email ?? null,
    }));
  });
