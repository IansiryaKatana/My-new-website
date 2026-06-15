import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { notifyUser } from "@/lib/activity.server";

export const listApplicationMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ application_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: app } = await context.supabase.from("applications").select("tenant_id").eq("id", data.application_id).single();
    if (!app) throw new Error("Application not found");

    const { data: rows, error } = await context.supabase
      .from("messages")
      .select("id, body, created_at, sender_id, read_at, profiles(full_name)")
      .eq("application_id", data.application_id)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const sendApplicationMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ application_id: z.string().uuid(), body: z.string().min(1).max(2000) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: app, error: appError } = await context.supabase
      .from("applications")
      .select("tenant_id, agent_id")
      .eq("id", data.application_id)
      .single();
    if (appError) throw new Error(appError.message);

    const { error } = await context.supabase.from("messages").insert({
      application_id: data.application_id,
      sender_id: context.userId,
      body: data.body.trim(),
    });
    if (error) throw new Error(error.message);

    const recipient = context.userId === app.tenant_id ? app.agent_id : app.tenant_id;
    if (recipient) {
      await notifyUser({
        user_id: recipient,
        title: "New message on application",
        body: data.body.slice(0, 120),
        entity_type: "application",
        entity_id: data.application_id,
      });
    }

    return { ok: true };
  });
