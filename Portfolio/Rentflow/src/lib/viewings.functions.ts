import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getViewing = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("viewings")
      .select("*, properties(id,title,community,building,unit_no,cover_image), profiles!viewings_tenant_id_fkey(full_name,email,phone)")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Viewing not found");
    return row;
  });

export const listViewings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("viewings")
      .select("id, status, requested_at, scheduled_at, notes, feedback, property_id, tenant_id, agent_id, properties(id,title,community,cover_image), profiles!viewings_tenant_id_fkey(full_name,phone)")
      .order("requested_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const requestViewing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { property_id: string; scheduled_at?: string; notes?: string }) =>
    z.object({
      property_id: z.string().uuid(),
      scheduled_at: z.string().optional(),
      notes: z.string().max(500).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase.from("viewings")
      .insert({ property_id: data.property_id, tenant_id: context.userId, scheduled_at: data.scheduled_at ?? null, notes: data.notes ?? null })
      .select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const updateViewing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status?: string; scheduled_at?: string | null; feedback?: string | null; agent_id?: string | null }) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["requested", "confirmed", "completed", "no_show", "cancelled"]).optional(),
      scheduled_at: z.string().nullable().optional(),
      feedback: z.string().max(1000).nullable().optional(),
      agent_id: z.string().uuid().nullable().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("viewings").update(patch as never).eq("id", id);
    if (error) throw new Error(error.message);

    if (patch.status === "confirmed") {
      try {
        const { data: viewing } = await context.supabase
          .from("viewings")
          .select("tenant_id, scheduled_at, properties(title)")
          .eq("id", id)
          .single();
        if (viewing?.tenant_id) {
          const { notifyUser } = await import("@/lib/activity.server");
          const prop = viewing.properties as { title?: string } | null;
          await notifyUser({
            user_id: viewing.tenant_id,
            title: "Viewing confirmed",
            body: prop?.title ?? "Your viewing",
            entity_type: "viewing",
            entity_id: id,
          });
          const { isResendConfigured, sendEmail } = await import("@/lib/resend.server");
          const { getAppBaseUrlFromSettings } = await import("@/lib/app-url.server");
          if (await isResendConfigured()) {
            const { data: tenant } = await context.supabase.from("profiles").select("email, full_name").eq("id", viewing.tenant_id).single();
            if (tenant?.email) {
              const base = await getAppBaseUrlFromSettings();
              await sendEmail({
                to: tenant.email,
                subject: `Viewing confirmed — ${prop?.title ?? "property"}`,
                html: `<p>Hi ${tenant.full_name ?? "there"},</p><p>Your viewing for <strong>${prop?.title ?? "the property"}</strong> is confirmed${viewing.scheduled_at ? ` for ${viewing.scheduled_at}` : ""}.</p><p><a href="${base}/portal">View portal</a></p>`,
                templateKey: "viewing_confirmed",
              });
            }
          }
        }
      } catch {
        // best-effort
      }
    }

    return { ok: true };
  });

export const cancelViewingAsTenant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("viewings")
      .update({ status: "cancelled" as never })
      .eq("id", data.id)
      .eq("tenant_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
