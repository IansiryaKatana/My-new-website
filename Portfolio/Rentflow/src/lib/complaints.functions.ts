import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
export const listComplaints = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("complaints")
      .select("id, subject, description, severity, status, created_at, resolved_at, tenancy_id, tenancies(properties(title,community), profiles!tenancies_tenant_id_fkey(full_name))")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getComplaint = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("complaints")
      .select("*, tenancies(id, properties(title,community), profiles!tenancies_tenant_id_fkey(full_name,email,phone))")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Complaint not found");
    return row;
  });

const ComplaintInput = z.object({
  tenancy_id: z.string().uuid(),
  subject: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  severity: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
});

export const createComplaint = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => ComplaintInput.parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("complaints")
      .insert({ ...data, status: "open" })
      .select("id, subject, tenancy_id")
      .single();
    if (error) throw new Error(error.message);

    try {
      const { logActivity, notifyUser } = await import("@/lib/activity.server");
      await logActivity({
        action: "complaint_created",
        entity_type: "complaint",
        entity_id: row.id,
        actor_id: context.userId,
      });

      const { data: staff } = await context.supabase.from("user_roles").select("user_id").in("role", ["owner", "agent"]);
      for (const s of staff ?? []) {
        await notifyUser({
          user_id: s.user_id,
          title: "New complaint",
          body: row.subject,
          entity_type: "complaint",
          entity_id: row.id,
        });
      }
    } catch {
      // notifications are best-effort
    }

    return { id: row.id };
  });

export const updateComplaint = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["open", "in_progress", "awaiting_tenant", "resolved", "closed"]).optional(),
      severity: z.enum(["low", "medium", "high", "urgent"]).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    if (patch.status === "resolved") (patch as Record<string, unknown>).resolved_at = new Date().toISOString();
    const { error } = await context.supabase.from("complaints").update(patch as never).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
